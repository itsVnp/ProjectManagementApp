"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const jwt_1 = require("../utils/jwt");
const error_handler_1 = require("../middleware/error-handler");
const router = (0, express_1.Router)();
const validateRegistration = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 })
];
const validateLogin = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty()
];
router.post('/register', validateRegistration, async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new error_handler_1.CustomError('Validation failed', 400);
        }
        const { email, password, name } = req.body;
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            throw new error_handler_1.CustomError('User already exists', 400);
        }
        const hashedPassword = await (0, jwt_1.hashPassword)(password);
        const user = await database_1.prisma.user.create({
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
        const token = (0, jwt_1.generateToken)({
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
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', validateLogin, async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new error_handler_1.CustomError('Validation failed', 400);
        }
        const { email, password } = req.body;
        const user = await database_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user || !user.password) {
            throw new error_handler_1.CustomError('Invalid credentials', 401);
        }
        const isPasswordValid = await (0, jwt_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new error_handler_1.CustomError('Invalid credentials', 401);
        }
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: { lastActiveAt: new Date() }
        });
        const token = (0, jwt_1.generateToken)({
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
    }
    catch (error) {
        next(error);
    }
});
router.get('/me', async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new error_handler_1.CustomError('Access token required', 401);
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
                subscriptionTier: true,
                avatarUrl: true,
                preferences: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            throw new error_handler_1.CustomError('User not found', 404);
        }
        res.json({
            success: true,
            data: { user }
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/forgot-password', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail()
], async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new error_handler_1.CustomError('Validation failed', 400);
        }
        const { email } = req.body;
        const user = await database_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent'
            });
            return;
        }
        res.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map