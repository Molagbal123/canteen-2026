import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  request_id: {
    type: DataTypes.STRING(64),
    allowNull: true,
    unique: true,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'cooking', 'delivering', 'done'),
    defaultValue: 'pending',
    allowNull: false,
  },
  customer_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  customer_phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  customer_address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'orders',
});

export default Order;
