"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const error_handler_1 = require("../middleware/error-handler");
const router = (0, express_1.Router)();
const validateProject = [
    (0, express_validator_1.body)('name').trim().isLength({ min: 1, max: 100 }).withMessage('Project name is required and must be less than 100 characters'),
    (0, express_validator_1.body)('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    (0, express_validator_1.body)('color').optional().isHexColor().withMessage('Color must be a valid hex color'),
    (0, express_validator_1.body)('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
];
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const projects = await database_1.prisma.project.findMany({
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
        res.json({
            success: true,
            data: { projects }
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const project = await database_1.prisma.project.findFirst({
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
            throw new error_handler_1.CustomError('Project not found', 404);
        }
        res.json({
            success: true,
            data: { project }
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', validateProject, async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new error_handler_1.CustomError('Validation failed', 400);
        }
        const { name, description, color, isPublic } = req.body;
        const userId = req.user.id;
        const project = await database_1.prisma.project.create({
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
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', validateProject, async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new error_handler_1.CustomError('Validation failed', 400);
        }
        const { id } = req.params;
        const { name, description, color, isPublic, status } = req.body;
        const userId = req.user.id;
        const existingProject = await database_1.prisma.project.findFirst({
            where: {
                id,
                ownerId: userId
            }
        });
        if (!existingProject) {
            throw new error_handler_1.CustomError('Project not found or access denied', 404);
        }
        const project = await database_1.prisma.project.update({
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
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const project = await database_1.prisma.project.findFirst({
            where: {
                id,
                ownerId: userId
            }
        });
        if (!project) {
            throw new error_handler_1.CustomError('Project not found or access denied', 404);
        }
        await database_1.prisma.project.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/:id/members', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('role').isIn(['USER', 'ADMIN', 'MODERATOR']).withMessage('Valid role is required')
], async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new error_handler_1.CustomError('Validation failed', 400);
        }
        const { id } = req.params;
        const { email, role } = req.body;
        const userId = req.user.id;
        if (!id) {
            throw new error_handler_1.CustomError('Project ID is required', 400);
        }
        const project = await database_1.prisma.project.findFirst({
            where: {
                id,
                ownerId: userId
            }
        });
        if (!project) {
            throw new error_handler_1.CustomError('Project not found or access denied', 404);
        }
        const userToAdd = await database_1.prisma.user.findUnique({
            where: { email }
        });
        if (!userToAdd) {
            throw new error_handler_1.CustomError('User not found', 404);
        }
        const existingMember = await database_1.prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: userToAdd.id,
                    projectId: id
                }
            }
        });
        if (existingMember) {
            throw new error_handler_1.CustomError('User is already a member of this project', 400);
        }
        const member = await database_1.prisma.projectMember.create({
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
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id/members/:userId', async (req, res, next) => {
    try {
        const { id, userId } = req.params;
        const currentUserId = req.user.id;
        if (!id || !userId) {
            throw new error_handler_1.CustomError('Project ID and User ID are required', 400);
        }
        const project = await database_1.prisma.project.findFirst({
            where: {
                id,
                ownerId: currentUserId
            }
        });
        if (!project) {
            throw new error_handler_1.CustomError('Project not found or access denied', 404);
        }
        await database_1.prisma.projectMember.delete({
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=projects.js.map