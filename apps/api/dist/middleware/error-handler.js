"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
exports.errorHandler = errorHandler;
class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
function errorHandler(err, req, res, next) {
    let error = { ...err };
    error.message = err.message;
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new CustomError(message, 404);
    }
    if (err.name === 'MongoError' && err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new CustomError(message, 400);
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
        error = new CustomError(message, 400);
    }
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new CustomError(message, 401);
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new CustomError(message, 401);
    }
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err;
        switch (prismaError.code) {
            case 'P2002':
                error = new CustomError('Unique constraint violation', 400);
                break;
            case 'P2025':
                error = new CustomError('Record not found', 404);
                break;
            case 'P2003':
                error = new CustomError('Foreign key constraint violation', 400);
                break;
            default:
                error = new CustomError('Database error', 500);
        }
    }
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Server Error';
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}
//# sourceMappingURL=error-handler.js.map