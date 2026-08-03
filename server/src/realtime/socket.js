import { Server } from 'socket.io';
import { corsOptions } from '../config/runtime.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

let io;

export const initRealtime = (httpServer) => {
  io = new Server(httpServer, {
    cors: corsOptions,
    transports: ['websocket', 'polling'],
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        socket.data.user = null;
        next();
        return;
      }

      const decoded = verifyAccessToken(token);
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'email', 'role'],
      });
      if (!user) throw new Error('User not found');

      socket.data.user = user.toJSON();
      next();
    } catch {
      next(new Error('Realtime authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    if (!user) return;
    socket.join(`user:${user.id}`);
    if (user.role === 'admin') socket.join('admins');
  });

  return io;
};

const emitDashboardChanged = () => {
  io?.to('admins').emit('dashboard:changed', { at: new Date().toISOString() });
};

export const emitOrderCreated = (order) => {
  if (!io) return;
  io.to('admins').to(`user:${order.user_id}`).emit('order:created', order);
  emitDashboardChanged();
};

export const emitOrderStatusUpdated = (order) => {
  if (!io) return;
  io.to('admins').to(`user:${order.user_id}`).emit('order:status-updated', order);
  emitDashboardChanged();
};

export const emitFoodChanged = (action, food) => {
  if (!io) return;
  io.emit('food:changed', { action, food });
  emitDashboardChanged();
};
