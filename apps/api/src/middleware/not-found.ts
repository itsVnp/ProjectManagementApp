import { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    message: 'The requested resource was not found on this server'
  });
} 