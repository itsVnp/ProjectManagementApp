import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { CustomError } from '../middleware/error-handler';

const router = Router();

// Validation middleware
const validateProject = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Project name is required and must be less than 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('color').optional().isHexColor().withMessage('Color must be a valid hex color'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
];

// Get all projects for the authenticated user
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Check if database is available
    let isDatabaseAvailable = true;
    let projects: any[] = [];

    try {
      const dbProjects = await prisma.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: {
                  userId: userId
                }
              }
            }
          ]
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              tasks: true,
              members: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      projects = dbProjects;
    } catch (dbError) {
      console.log('⚠️  Database not available, using mock projects for development');
      isDatabaseAvailable = false;
    }

    // If no database, use mock data for development
    if (!isDatabaseAvailable) {
      projects = [
        {
          id: 'project-1',
          name: 'Website Redesign',
          description: 'Complete redesign of the company website',
          status: 'ACTIVE',
          color: '#3B82F6',
          isPublic: false,
          owner: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          members: [
            {
              id: 'member-1',
              role: 'ADMIN',
              joinedAt: new Date(),
              user: {
                id: 'user-1',
                name: 'John Doe',
                email: 'john@example.com'
              }
            }
          ],
          _count: {
            tasks: 12,
            members: 1
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'project-2',
          name: 'Mobile App Development',
          description: 'iOS and Android app for the platform',
          status: 'ACTIVE',
          color: '#10B981',
          isPublic: false,
          owner: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          members: [
            {
              id: 'member-2',
              role: 'USER',
              joinedAt: new Date(),
              user: {
                id: 'user-1',
                name: 'John Doe',
                email: 'john@example.com'
              }
            }
          ],
          _count: {
            tasks: 8,
            members: 1
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }

    res.json({
      success: true,
      data: { projects }
    });
  } catch (error) {
    next(error);
  }
});

// Get a single project by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId
              }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true
              }
            },
            creator: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            tasks: true,
            members: true
          }
        }
      }
    });

    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    next(error);
  }
});

// Create a new project
router.post('/', validateProject, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Validation failed', 400);
    }

    const { name, description, color, isPublic } = req.body;
    const userId = req.user!.id;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        color: color || '#3B82F6',
        isPublic: isPublic || false,
        ownerId: userId,
        members: {
          create: {
            userId: userId,
            role: 'ADMIN'
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
});

// Update a project
router.put('/:id', validateProject, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Validation failed', 400);
    }

    const { id } = req.params;
    const { name, description, color, isPublic, status } = req.body;
    const userId = req.user!.id;

    // Check if user owns the project
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingProject) {
      throw new CustomError('Project not found or access denied', 404);
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        color,
        isPublic,
        status
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a project
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user owns the project
    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!project) {
      throw new CustomError('Project not found or access denied', 404);
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Add member to project
router.post('/:id/members', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').isIn(['USER', 'ADMIN', 'MODERATOR']).withMessage('Valid role is required')
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Validation failed', 400);
    }

    const { id } = req.params;
    const { email, role } = req.body;
    const userId = req.user!.id;

    if (!id) {
      throw new CustomError('Project ID is required', 400);
    }

    // Check if user owns the project
    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!project) {
      throw new CustomError('Project not found or access denied', 404);
    }

    // Find user by email
    const userToAdd = await prisma.user.findUnique({
      where: { email }
    });

    if (!userToAdd) {
      throw new CustomError('User not found', 404);
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userToAdd.id,
          projectId: id
        }
      }
    });

    if (existingMember) {
      throw new CustomError('User is already a member of this project', 400);
    }

    // Add member
    const member = await prisma.projectMember.create({
      data: {
        userId: userToAdd.id,
        projectId: id,
        role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: { member }
    });
  } catch (error) {
    next(error);
  }
});

// Remove member from project
router.delete('/:id/members/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, userId } = req.params;
    const currentUserId = req.user!.id;

    if (!id || !userId) {
      throw new CustomError('Project ID and User ID are required', 400);
    }

    // Check if user owns the project
    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: currentUserId
      }
    });

    if (!project) {
      throw new CustomError('Project not found or access denied', 404);
    }

    // Remove member
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId,
          projectId: id
        }
      }
    });

    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 