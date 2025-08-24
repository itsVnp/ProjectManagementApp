import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../config/database';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        isEmailVerified: boolean;
        subscriptionTier: string;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = await verifyToken(token);
    
    // Check if database is available
    let user = null;
    let isDatabaseAvailable = true;

    try {
      // Verify user still exists in database
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
          subscriptionTier: true
        }
      });
    } catch (dbError) {
      console.log('⚠️  Database not available, using mock user for development');
      isDatabaseAvailable = false;
    }

    // If no database and it's a mock user, use mock data
    if (!isDatabaseAvailable && decoded.id === 'mock-user-id') {
      const mockUser = {
        id: 'mock-user-id',
        email: 'admin@claro.com',
        name: 'Admin User',
        role: 'ADMIN',
        isEmailVerified: true,
        subscriptionTier: 'PRO'
      };

      // Add user to request object
      req.user = mockUser;
      next();
      return;
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Add user to request object
    req.user = user;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
}

export function requireVerifiedEmail(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  if (!req.user.isEmailVerified) {
    res.status(403).json({
      success: false,
      message: 'Email verification required'
    });
    return;
  }

  next();
} 