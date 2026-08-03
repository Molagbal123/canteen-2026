import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  food_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  food_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  food_image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'Quantity must be at least 1' },
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Snapshot of food price at order time',
  },
}, {
  tableName: 'order_items',
});

export default OrderItem;
