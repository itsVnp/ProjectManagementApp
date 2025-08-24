"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const projects_1 = __importDefault(require("./routes/projects"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const error_handler_1 = require("./middleware/error-handler");
const not_found_1 = require("./middleware/not-found");
const auth_2 = require("./middleware/auth");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const socket_1 = require("./config/socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/users', auth_2.authMiddleware, users_1.default);
app.use('/api/projects', auth_2.authMiddleware, projects_1.default);
app.use('/api/tasks', auth_2.authMiddleware, tasks_1.default);
app.use('/api/notifications', auth_2.authMiddleware, notifications_1.default);
app.get('/api/docs', (req, res) => {
    res.json({
        message: 'Claro API Documentation',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            projects: '/api/projects',
            tasks: '/api/tasks',
            notifications: '/api/notifications'
        }
    });
});
app.use(not_found_1.notFound);
app.use(error_handler_1.errorHandler);
(0, socket_1.setupSocketHandlers)(io);
async function startServer() {
    try {
        await (0, database_1.connectDatabase)();
        console.log('✅ Database connected successfully');
        await (0, redis_1.connectRedis)();
        console.log('✅ Redis connected successfully');
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
startServer();
//# sourceMappingURL=index.js.map