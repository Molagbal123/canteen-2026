import sequelize from './src/config/database.js';
import { Order, OrderItem } from './src/models/index.js';

const reset = async () => {
  try {
    await sequelize.authenticate();
    await OrderItem.destroy({ where: {} });
    await Order.destroy({ where: {} });
    
    // Reset AUTO_INCREMENT (Assuming MySQL)
    await sequelize.query('ALTER TABLE `order_items` AUTO_INCREMENT = 1;');
    await sequelize.query('ALTER TABLE `orders` AUTO_INCREMENT = 1;');

    console.log('Successfully deleted all orders and reset IDs to 1.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting orders:', err);
    process.exit(1);
  }
};

reset();
