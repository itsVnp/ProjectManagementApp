import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';

import authRoutes from './routes/auth';
import projectsRoutes from './routes/projects';
import tasksRoutes from './routes/tasks';
import dashboardRoutes from './routes/dashboard';
import { errorHandler } from './middleware/error-handler';
import { authMiddleware } from './middleware/auth';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectsRoutes);
app.use('/api/tasks', authMiddleware, tasksRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'Claro API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user profile',
      },
      projects: {
        'GET /api/projects': 'Get all projects for user',
        'POST /api/projects': 'Create a new project',
        'GET /api/projects/:id': 'Get a specific project',
        'PUT /api/projects/:id': 'Update a project',
        'DELETE /api/projects/:id': 'Delete a project',
        'POST /api/projects/:id/members': 'Add member to project',
        'DELETE /api/projects/:id/members/:userId': 'Remove member from project',
      },
      tasks: {
        'GET /api/tasks': 'Get all tasks for user',
        'POST /api/tasks': 'Create a new task',
        'GET /api/tasks/:id': 'Get a specific task',
        'PUT /api/tasks/:id': 'Update a task',
        'DELETE /api/tasks/:id': 'Delete a task',
        'POST /api/tasks/:id/comments': 'Add comment to task',
        'GET /api/tasks/stats/overview': 'Get task statistics',
      },
      dashboard: {
        'GET /api/dashboard/stats': 'Get dashboard statistics',
      },
    },
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

export default app; 