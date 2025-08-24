"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
exports.requireVerifiedEmail = requireVerifiedEmail;
const jwt_1 = require("../utils/jwt");
const database_1 = require("../config/database");
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = await (0, jwt_1.verifyToken)(token);
        const user = await database_1.prisma.user.findUnique({
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
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}
function requireRole(roles) {
    return (req, res, next) => {
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
function requireVerifiedEmail(req, res, next) {
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
//# sourceMappingURL=auth.js.map