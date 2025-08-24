"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const error_handler_1 = require("../middleware/error-handler");
const router = (0, express_1.Router)();
const validateTask = [
    (0, express_validator_1.body)('title').trim().isLength({ min: 1, max: 200 }).withMessage('Task title is required and must be less than 200 characters'),
    (0, express_validator_1.body)('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('status').optional().isIn(['TODO', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']).withMessage('Invalid status'),
    (0, express_validator_1.body)('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority'),
    (0, express_validator_1.body)('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
    (0, express_validator_1.body)('estimatedHours').optional().isFloat({ min: 0 }).withMessage('Estimated hours must be a positive number'),
    (0, express_validator_1.body)('tags').optional().isArray().withMessage('Tags must be an array')
];
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { projectId, status, priority, assigneeId } = req.query;
        const where = {
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
        if (projectId)
            where.projectId = projectId;
        if (status)
            where.status = status;
        if (priority)
            where.priority = priority;
        if (assigneeId)
            where.assigneeId = assigneeId;
        const tasks = await database_1.prisma.task.findMany({
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
        res.json({
            success: true,
            data: { tasks }
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
        const task = await database_1.prisma.task.findFirst({
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
            throw new error_handler_1.CustomError('Task not found', 404);
        }
        res.json({
            success: true,
            data: { task }
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', validateTask, async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new error_handler_1.CustomError('Validation failed', 400);
        }
        const { title, description, projectId, assigneeId, status, priority, dueDate, estimatedHours, tags } = req.body;
        const userId = req.user.id;
        const project = await database_1.prisma.project.findFirst({
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
            throw new error_handler_1.CustomError('Project not found or access denied', 404);
        }
        const task = await database_1.prisma.task.create({
            data: {
                title,
                description,
                projectId,
                assigneeId,
                creatorId: userId,
                status: status || 'TODO',
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : null,
                estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
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
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', validateTask, async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new error_handler_1.CustomError('Validation failed', 400);
        }
        const { id } = req.params;
        const { title, description, assigneeId, status, priority, dueDate, estimatedHours, actualHours, tags } = req.body;
        const userId = req.user.id;
        const existingTask = await database_1.prisma.task.findFirst({
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
            throw new error_handler_1.CustomError('Task not found or access denied', 404);
        }
        const updateData = {
            title,
            description,
            assigneeId,
            status,
            priority,
            tags
        };
        if (dueDate)
            updateData.dueDate = new Date(dueDate);
        if (estimatedHours)
            updateData.estimatedHours = parseFloat(estimatedHours);
        if (actualHours)
            updateData.actualHours = parseFloat(actualHours);
        if (status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
            updateData.completedAt = new Date();
        }
        else if (status !== 'COMPLETED' && existingTask.status === 'COMPLETED') {
            updateData.completedAt = null;
        }
        const task = await database_1.prisma.task.update({
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
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const task = await database_1.prisma.task.findFirst({
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
            throw new error_handler_1.CustomError('Task not found or access denied', 404);
        }
        await database_1.prisma.task.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/:id/comments', [
    (0, express_validator_1.body)('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment content is required and must be less than 1000 characters')
], async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new error_handler_1.CustomError('Validation failed', 400);
        }
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        if (!id) {
            throw new error_handler_1.CustomError('Task ID is required', 400);
        }
        const task = await database_1.prisma.task.findFirst({
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
            throw new error_handler_1.CustomError('Task not found or access denied', 404);
        }
        const comment = await database_1.prisma.comment.create({
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
    }
    catch (error) {
        next(error);
    }
});
router.get('/stats/overview', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.query;
        const where = {
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
        if (projectId)
            where.projectId = projectId;
        const [totalTasks, completedTasks, overdueTasks, upcomingTasks] = await Promise.all([
            database_1.prisma.task.count({ where }),
            database_1.prisma.task.count({ where: { ...where, status: 'COMPLETED' } }),
            database_1.prisma.task.count({
                where: {
                    ...where,
                    dueDate: { lt: new Date() },
                    status: { not: 'COMPLETED' }
                }
            }),
            database_1.prisma.task.count({
                where: {
                    ...where,
                    dueDate: {
                        gte: new Date(),
                        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=tasks.js.map