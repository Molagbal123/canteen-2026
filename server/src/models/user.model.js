import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' },
      len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    set(value) {
      this.setDataValue('email', String(value || '').trim().toLowerCase());
    },
    unique: { msg: 'Tài khoản đã được đăng ký' },
    validate: {
      notEmpty: { msg: 'Vui lòng nhập tài khoản' },
      customValidator(value) {
        if (!value) return;
        const isEmail = /^\S+@\S+\.\S+$/.test(value);
        const isStudentId = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d.]{7,}$/.test(value);
        if (!isEmail && !isStudentId) {
          throw new Error('Tài khoản phải là Mã sinh viên (ít nhất 7 ký tự gồm chữ, số hoặc dấu chấm) hoặc Email.');
        }
      }
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required' },
      len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: '',
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '',
  },
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toSafeJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default User;
