import { Food } from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';
import { Op } from 'sequelize';

export const getAll = async ({ page = 1, limit = 12, search, category }) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const where = {};

  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  if (category && category !== 'all') {
    where.category = category;
  }

  const { count, rows } = await Food.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['created_at', 'DESC']],
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

export const getById = async (id) => {
  const food = await Food.findByPk(id);
  if (!food) throw new NotFoundError('Food');
  return food;
};

export const create = async (data) => {
  return Food.create(data);
};

export const update = async (id, data) => {
  const food = await Food.findByPk(id);
  if (!food) throw new NotFoundError('Food');
  await food.update(data);
  return food;
};

export const remove = async (id) => {
  const food = await Food.findByPk(id);
  if (!food) throw new NotFoundError('Food');
  await food.destroy();
  return food;
};

export const getCategories = async () => {
  const foods = await Food.findAll({
    attributes: ['category'],
    group: ['category'],
    order: [['category', 'ASC']],
  });
  return foods.map((f) => f.category);
};
