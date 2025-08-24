"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = setupSocketHandlers;
const jwt_1 = require("../utils/jwt");
function setupSocketHandlers(io) {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            const decoded = await (0, jwt_1.verifyToken)(token);
            socket.data.user = decoded;
            next();
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`🔌 User ${socket.data.user.id} connected`);
        socket.join(`user:${socket.data.user.id}`);
        socket.on('join-project', (projectId) => {
            socket.join(`project:${projectId}`);
            console.log(`👥 User ${socket.data.user.id} joined project ${projectId}`);
        });
        socket.on('leave-project', (projectId) => {
            socket.leave(`project:${projectId}`);
            console.log(`👋 User ${socket.data.user.id} left project ${projectId}`);
        });
        socket.on('task-update', (data) => {
            socket.to(`project:${data.projectId}`).emit('task-updated', {
                taskId: data.taskId,
                updates: data.updates,
                updatedBy: socket.data.user.id
            });
        });
        socket.on('project-update', (data) => {
            socket.to(`project:${data.projectId}`).emit('project-updated', {
                projectId: data.projectId,
                updates: data.updates,
                updatedBy: socket.data.user.id
            });
        });
        socket.on('new-comment', (data) => {
            socket.to(`project:${data.projectId}`).emit('comment-added', {
                taskId: data.taskId,
                comment: data.comment,
                addedBy: socket.data.user.id
            });
        });
        socket.on('typing', (data) => {
            socket.to(`project:${data.projectId}`).emit('user-typing', {
                userId: socket.data.user.id,
                userName: socket.data.user.name,
                taskId: data.taskId
            });
        });
        socket.on('stop-typing', (data) => {
            socket.to(`project:${data.projectId}`).emit('user-stopped-typing', {
                userId: socket.data.user.id,
                taskId: data.taskId
            });
        });
        socket.on('disconnect', () => {
            console.log(`🔌 User ${socket.data.user.id} disconnected`);
        });
    });
    return io;
}
//# sourceMappingURL=socket.js.map