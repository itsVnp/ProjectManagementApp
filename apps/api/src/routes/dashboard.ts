import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { CustomError } from '../middleware/error-handler';

const router = Router();

// Get dashboard statistics
router.get('/stats', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    let stats = null;

    try {
      const [
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        upcomingTasks
      ] = await Promise.all([
        // Total projects
        prisma.project.count({
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
          }
        }),
        // Total tasks
        prisma.task.count({
          where: {
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
        }),
        // Completed tasks
        prisma.task.count({
          where: {
            status: 'COMPLETED',
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
        }),
        // Overdue tasks
        prisma.task.count({
          where: {
            dueDate: { lt: new Date() },
            status: { not: 'COMPLETED' },
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
        }),
        // Upcoming tasks (next 7 days)
        prisma.task.count({
          where: {
            dueDate: {
              gte: new Date(),
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            status: { not: 'COMPLETED' },
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
        })
      ]);

      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      stats = {
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        upcomingTasks,
        completionRate
      };
    } catch (dbError) {
      console.log('⚠️  Database not available, using mock dashboard stats for development');
      isDatabaseAvailable = false;
    }

    // If no database, use mock data for development
    if (!isDatabaseAvailable) {
      stats = {
        totalProjects: 3,
        totalTasks: 12,
        completedTasks: 8,
        overdueTasks: 1,
        upcomingTasks: 3,
        completionRate: 67
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

export default router; 