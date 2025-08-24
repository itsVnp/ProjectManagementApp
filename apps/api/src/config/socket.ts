import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt';

export function setupSocketHandlers(io: Server) {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = await verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User ${socket.data.user.id} connected`);

    // Join user to their personal room
    socket.join(`user:${socket.data.user.id}`);

    // Join user to their project rooms
    socket.on('join-project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`👥 User ${socket.data.user.id} joined project ${projectId}`);
    });

    // Leave project room
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      console.log(`👋 User ${socket.data.user.id} left project ${projectId}`);
    });

    // Handle task updates
    socket.on('task-update', (data) => {
      socket.to(`project:${data.projectId}`).emit('task-updated', {
        taskId: data.taskId,
        updates: data.updates,
        updatedBy: socket.data.user.id
      });
    });

    // Handle project updates
    socket.on('project-update', (data) => {
      socket.to(`project:${data.projectId}`).emit('project-updated', {
        projectId: data.projectId,
        updates: data.updates,
        updatedBy: socket.data.user.id
      });
    });

    // Handle comments
    socket.on('new-comment', (data) => {
      socket.to(`project:${data.projectId}`).emit('comment-added', {
        taskId: data.taskId,
        comment: data.comment,
        addedBy: socket.data.user.id
      });
    });

    // Handle user typing
    socket.on('typing', (data) => {
      socket.to(`project:${data.projectId}`).emit('user-typing', {
        userId: socket.data.user.id,
        userName: socket.data.user.name,
        taskId: data.taskId
      });
    });

    // Handle user stopped typing
    socket.on('stop-typing', (data) => {
      socket.to(`project:${data.projectId}`).emit('user-stopped-typing', {
        userId: socket.data.user.id,
        taskId: data.taskId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User ${socket.data.user.id} disconnected`);
    });
  });

  return io;
} 