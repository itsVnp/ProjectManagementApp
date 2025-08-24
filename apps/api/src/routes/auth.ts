import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { generateToken, hashPassword, comparePassword, verifyToken } from '../utils/jwt';
import { CustomError } from '../middleware/error-handler';

const router = Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 })
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Register user
router.post('/register', validateRegistration, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Validation failed', 400);
    }

    const { email, password, name } = req.body;

    // Check if database is available
    let isDatabaseAvailable = true;

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new CustomError('User already exists', 409);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
          subscriptionTier: true,
          createdAt: true
        }
      });

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token
        }
      });
    } catch (dbError) {
      if (dbError instanceof CustomError) {
        throw dbError;
      }
      console.log('⚠️  Database not available, registration not supported in development mode');
      throw new CustomError('Registration not available in development mode. Use admin@claro.com / admin123 to login.', 503);
    }
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', validateLogin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Validation failed', 400);
    }

    const { email, password } = req.body;

    // Check if database is available
    let user = null;
    let isDatabaseAvailable = true;

    try {
      // Try to find user in database
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError) {
      console.log('⚠️  Database not available, using mock authentication for development');
      isDatabaseAvailable = false;
    }

    // If no database, use mock authentication for development
    if (!isDatabaseAvailable) {
      // Mock user for development (email: admin@claro.com, password: admin123)
      if (email === 'admin@claro.com' && password === 'admin123') {
        const mockUser = {
          id: 'mock-user-id',
          email: 'admin@claro.com',
          name: 'Admin User',
          role: 'ADMIN' as const,
          isEmailVerified: true,
          subscriptionTier: 'PRO' as const
        };

        const token = generateToken({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role
        });

        res.json({
          success: true,
          message: 'Login successful (mock user)',
          data: {
            user: mockUser,
            token
          }
        });
        return;
      } else {
        throw new CustomError('Invalid credentials. Use admin@claro.com / admin123 for development', 401);
      }
    }

    // Database authentication
    if (!user || !user.password) {
      throw new CustomError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid credentials', 401);
    }

    // Update last active
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() }
      });
    } catch (updateError) {
      console.log('⚠️  Could not update last active time');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          subscriptionTier: user.subscriptionTier
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('Access token required', 401);
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);

    let user = null;
    let isDatabaseAvailable = true;

    try {
      // Try to find user in database
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
          subscriptionTier: true,
          avatarUrl: true,
          preferences: true,
          createdAt: true,
          updatedAt: true
        }
      });
    } catch (dbError) {
      console.log('⚠️  Database not available, using mock user for development');
      isDatabaseAvailable = false;
    }

    // If no database and it's a mock user, return mock data
    if (!isDatabaseAvailable && decoded.id === 'mock-user-id') {
      const mockUser = {
        id: 'mock-user-id',
        email: 'admin@claro.com',
        name: 'Admin User',
        role: 'ADMIN' as const,
        isEmailVerified: true,
        subscriptionTier: 'PRO' as const,
        avatarUrl: null,
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

      res.json({
        success: true,
        data: { user: mockUser }
      });
      return;
    }

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Validation failed', 400);
    }

    const { email } = req.body;

    let user = null;
    let isDatabaseAvailable = true;

    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError) {
      console.log('⚠️  Database not available, forgot password not supported in development mode');
      isDatabaseAvailable = false;
    }

    if (!isDatabaseAvailable) {
      res.json({
        success: true,
        message: 'Password reset not available in development mode'
      });
      return;
    }

    if (!user) {
      // Don't reveal if user exists
      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
      return;
    }

    // TODO: Implement email sending with reset token
    // For now, just return success message

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 