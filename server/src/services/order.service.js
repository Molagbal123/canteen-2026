import { Order, OrderItem, Food, User } from '../models/index.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import sequelize from '../config/database.js';

export const createOrder = async (userId, { items, customerName, customerPhone, customerAddress }) => {
  if (!items || items.length === 0) {
    throw new ValidationError('Order must contain at least one item');
  }

  if (!customerName || !customerPhone || !customerAddress) {
    throw new ValidationError('Customer name, phone, and address are required');
  }

  const transaction = await sequelize.transaction();

  try {
    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const food = await Food.findByPk(item.foodId, { transaction });
      if (!food) {
        throw new NotFoundError(`Food item with ID ${item.foodId}`);
      }
      const itemTotal = parseFloat(food.price) * item.quantity;
      totalPrice += itemTotal;
      orderItemsData.push({
        food_id: food.id,
        quantity: item.quantity,
        price: food.price,
      });
    }

    const order = await Order.create(
      {
        user_id: userId,
        total_price: totalPrice,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
      },
      { transaction }
    );

    const itemsWithOrderId = orderItemsData.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    await OrderItem.bulkCreate(itemsWithOrderId, { transaction });

    await transaction.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'image', 'price'] }],
        },
      ],
    });

    return fullOrder;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  const orders = await Order.findAll({
    where: { user_id: userId },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'image', 'price'] }],
      },
    ],
    order: [['created_at', 'DESC']],
  });
  return orders;
};

export const getAllOrders = async ({ page = 1, limit = 20 }) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count, rows } = await Order.findAndCountAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'image', 'price'] }],
      },
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset,
    distinct: true,
  });

  return {
    data: rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
    },
  };
};

export const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['pending', 'cooking', 'delivering', 'done'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError('Invalid status. Must be: pending, cooking, delivering, or done');
  }

  const order = await Order.findByPk(orderId);
  if (!order) throw new NotFoundError('Order');

  await order.update({ status });
  return order;
};

export const getStats = async () => {
  const totalOrders = await Order.count();
  const totalRevenue = await Order.sum('total_price') || 0;
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
