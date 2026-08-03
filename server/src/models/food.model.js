import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Food = sequelize.define('Food', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Food name is required' },
      len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' },
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'Price must be a valid number' },
      min: { args: [0], msg: 'Price cannot be negative' },
    },
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '',
  },
  image_public_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Category is required' },
    },
  },
}, {
  tableName: 'foods',
  paranoid: true,
  deletedAt: 'deleted_at',
});

export default Food;
