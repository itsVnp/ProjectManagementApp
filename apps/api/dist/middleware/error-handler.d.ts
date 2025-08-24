import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare class CustomError extends Error implements AppError {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=error-handler.d.ts.map