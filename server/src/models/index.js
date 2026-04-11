import User from './user.model.js';
import Food from './food.model.js';
import Order from './order.model.js';
import OrderItem from './order-item.model.js';

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

OrderItem.belongsTo(Food, { foreignKey: 'food_id', as: 'food' });
Food.hasMany(OrderItem, { foreignKey: 'food_id', as: 'orderItems' });

export { User, Food, Order, OrderItem };
