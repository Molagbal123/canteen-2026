import { Order, OrderItem, Food, User } from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';
import {
  assertValidStatusTransition,
  normalizeDeliveryDetails,
  normalizeOrderItems,
  normalizeRequestId,
} from '../utils/order.js';

const orderIncludes = [
  {
    model: OrderItem,
    as: 'items',
    include: [
      {
        model: Food,
        as: 'food',
        attributes: ['id', 'name', 'image', 'price'],
        paranoid: false,
      },
    ],
  },
];

export const createOrder = async (
  userId,
  { items, customerName, customerPhone, customerAddress, requestId }
) => {
  const normalizedItems = normalizeOrderItems(items);
  const delivery = normalizeDeliveryDetails({ customerName, customerPhone, customerAddress });
  const normalizedRequestId = normalizeRequestId(requestId);

  if (normalizedRequestId) {
    const existingOrder = await Order.findOne({
      where: { user_id: userId, request_id: normalizedRequestId },
      include: orderIncludes,
    });
    if (existingOrder) return { order: existingOrder, created: false };
  }

  let orderId;
  try {
    orderId = await sequelize.transaction(async (transaction) => {
      const foodIds = normalizedItems.map((item) => item.foodId);
      const foods = await Food.findAll({
        where: { id: { [Op.in]: foodIds } },
        transaction,
      });

      if (foods.length !== foodIds.length) {
        const foundIds = new Set(foods.map((food) => food.id));
        const missingId = foodIds.find((id) => !foundIds.has(id));
        throw new NotFoundError(`Food item with ID ${missingId}`);
      }

      const foodById = new Map(foods.map((food) => [food.id, food]));
      const orderItemsData = normalizedItems.map((item) => {
        const food = foodById.get(item.foodId);
        return {
          food_id: food.id,
          food_name: food.name,
          food_image: food.image,
          quantity: item.quantity,
          price: food.price,
        };
      });
      const totalPrice = orderItemsData.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
      );

      const order = await Order.create(
        {
          user_id: userId,
          request_id: normalizedRequestId,
          total_price: totalPrice,
          customer_name: delivery.customerName,
          customer_phone: delivery.customerPhone,
          customer_address: delivery.customerAddress,
        },
        { transaction }
      );

      const itemsWithOrderId = orderItemsData.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      await OrderItem.bulkCreate(itemsWithOrderId, { transaction, validate: true });

      return order.id;
    });
  } catch (error) {
    if (normalizedRequestId && error.name === 'SequelizeUniqueConstraintError') {
      const existingOrder = await Order.findOne({
        where: { user_id: userId, request_id: normalizedRequestId },
        include: orderIncludes,
      });
      if (existingOrder) return { order: existingOrder, created: false };
    }
    throw error;
  }

  const order = await Order.findByPk(orderId, { include: orderIncludes });
  return { order, created: true };
};

export const getUserOrders = async (userId) => {
  const orders = await Order.findAll({
    where: { user_id: userId },
    include: orderIncludes,
    order: [['created_at', 'DESC']],
  });
  return orders;
};

export const getAllOrders = async ({ page = 1, limit = 20 }) => {
  const normalizedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const normalizedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 100);
  const offset = (normalizedPage - 1) * normalizedLimit;
  const { count, rows } = await Order.findAndCountAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ...orderIncludes,
    ],
    order: [['created_at', 'DESC']],
    limit: normalizedLimit,
    offset,
    distinct: true,
  });

  return {
    data: rows,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total: count,
      totalPages: Math.ceil(count / normalizedLimit),
    },
  };
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new NotFoundError('Order');

  assertValidStatusTransition(order.status, status);
  if (order.status !== status) await order.update({ status });
  return order;
};

export const getStats = async () => {
  const totalOrders = await Order.count();
  const totalRevenue = await Order.sum('total_price', { where: { status: 'done' } }) || 0;
  const pendingOrders = await Order.count({ where: { status: 'pending' } });
  const totalFoods = await Food.count();

  const recentOrders = await Order.findAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
    ],
    order: [['created_at', 'DESC']],
    limit: 10,
  });

  return {
    totalOrders,
    totalRevenue: parseFloat(totalRevenue),
    pendingOrders,
    totalFoods,
    recentOrders,
  };
};
