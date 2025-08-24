import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { CustomError } from '../middleware/error-handler';

const router = Router();

// Validation middleware
const validateTask = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Task title is required and must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']).withMessage('Invalid status'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('estimatedHours').optional().isFloat({ min: 0 }).withMessage('Estimated hours must be a positive number'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

// Get all tasks
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { limit, projectId, status, priority, assigneeId } = req.query;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Check if database is available
    let isDatabaseAvailable = true;
    let tasks: any[] = [];

    try {
      const where: any = {
        project: {
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
        }
      };

      if (projectId) where.projectId = projectId as string;
      if (status) where.status = status as string;
      if (priority) where.priority = priority as string;
      if (assigneeId) where.assigneeId = assigneeId as string;

      const dbTasks = await prisma.task.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 5
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ]
      });
      
      tasks = dbTasks;
    } catch (dbError) {
      console.log('⚠️  Database not available, using mock tasks for development');
      isDatabaseAvailable = false;
    }

    // If no database, use mock data for development
    if (!isDatabaseAvailable) {
      tasks = [
        {
          id: 'task-1',
          title: 'Design Homepage',
          description: 'Create a modern and responsive homepage design',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          project: {
            id: 'project-1',
            name: 'Website Redesign',
            color: '#3B82F6'
          },
          assignee: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          creator: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          comments: [],
          _count: {
            comments: 0
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'task-2',
          title: 'Implement Authentication',
          description: 'Set up user authentication system',
          status: 'COMPLETED',
          priority: 'URGENT',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          project: {
            id: 'project-1',
            name: 'Website Redesign',
            color: '#3B82F6'
          },
          assignee: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          creator: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          comments: [],
          _count: {
            comments: 0
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }

    res.json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
});

// Get a single task by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
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
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!task) {
      throw new CustomError('Task not found', 404);
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Create a new task
router.post('/', validateTask, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Validation failed', 400);
    }

    const {
      title,
      description,
      projectId,
      assigneeId,
      status,
      priority,
      dueDate,
      estimatedHours,
      tags
    } = req.body;
    const userId = req.user!.id;

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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
      }
    });

    if (!project) {
      throw new CustomError('Project not found or access denied', 404);
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
        creatorId: userId,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
        tags: tags || []
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
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
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Update a task
router.put('/:id', validateTask, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Validation failed', 400);
    }

    const { id } = req.params;
    const {
      title,
      description,
      assigneeId,
      status,
      priority,
      dueDate,
      estimatedHours,
      actualHours,
      tags
    } = req.body;
    const userId = req.user!.id;

    // Check if user has access to the task
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
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
        }
      }
    });

    if (!existingTask) {
      throw new CustomError('Task not found or access denied', 404);
    }

    const updateData: any = {
      title,
      description,
      assigneeId,
      status,
      priority,
      tags
    };

    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (estimatedHours) updateData.estimatedHours = parseFloat(estimatedHours);
    if (actualHours) updateData.actualHours = parseFloat(actualHours);

    // If task is being completed, set completedAt
    if (status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (status !== 'COMPLETED' && existingTask.status === 'COMPLETED') {
      updateData.completedAt = null;
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a task
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user has access to the task
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
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
        }
      }
    });

    if (!task) {
      throw new CustomError('Task not found or access denied', 404);
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Add comment to task
router.post('/:id/comments', [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment content is required and must be less than 1000 characters')
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Validation failed', 400);
    }

    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    if (!id) {
      throw new CustomError('Task ID is required', 400);
    }

    // Check if user has access to the task
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
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
        }
      }
    });

    if (!task) {
      throw new CustomError('Task not found or access denied', 404);
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId: id,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment }
    });
  } catch (error) {
    next(error);
  }
});

// Get task statistics
router.get('/stats/overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { projectId } = req.query;

    const where: any = {
      project: {
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
      }
    };

    if (projectId) where.projectId = projectId as string;

    const [totalTasks, completedTasks, overdueTasks, upcomingTasks] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.task.count({
        where: {
          ...where,
          dueDate: { lt: new Date() },
          status: { not: 'COMPLETED' }
        }
      }),
      prisma.task.count({
        where: {
          ...where,
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
          },
          status: { not: 'COMPLETED' }
        }
      })
    ]);

    const stats = {
      total: totalTasks,
      completed: completedTasks,
      overdue: overdueTasks,
      upcoming: upcomingTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 