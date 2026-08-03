import { catchAsync } from '../utils/catch-async.js';
import * as orderService from '../services/order.service.js';
import { emitOrderCreated, emitOrderStatusUpdated } from '../realtime/socket.js';

export const createOrder = catchAsync(async (req, res) => {
  const { order, created } = await orderService.createOrder(req.user.id, req.body);
  if (created) emitOrderCreated(order);
  res.status(created ? 201 : 200).json({
    success: true,
    data: order,
    message: created ? 'Order placed successfully' : 'Order already placed',
  });
});

export const getUserOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.status(200).json({ success: true, data: orders });
});

export const getAllOrders = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await orderService.getAllOrders({ page, limit });
  res.status(200).json({ success: true, ...result });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  emitOrderStatusUpdated(order);
  res.status(200).json({ success: true, data: order, message: 'Order status updated' });
});

export const getStats = catchAsync(async (req, res) => {
  const stats = await orderService.getStats();
  res.status(200).json({ success: true, data: stats });
});
