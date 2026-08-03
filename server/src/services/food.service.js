import { Food } from '../models/index.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { Op } from 'sequelize';
import { deleteUploadedImage } from './image.service.js';

const normalizeFoodData = (data, { partial = false } = {}) => {
  const normalized = {};
  const textFields = ['name', 'description', 'category', 'image', 'image_public_id'];

  for (const field of textFields) {
    if (data[field] !== undefined) normalized[field] = String(data[field]).trim();
  }

  if (data.price !== undefined) {
    const price = Number(data.price);
    if (!Number.isFinite(price) || price < 0) {
      throw new ValidationError('Price must be a non-negative number');
    }
    normalized.price = price;
  }

  if (!partial && (!normalized.name || normalized.price === undefined || !normalized.category)) {
    throw new ValidationError('Food name, price, and category are required');
  }

  return normalized;
};

export const getAll = async ({ page = 1, limit = 12, search, category }) => {
  const normalizedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const normalizedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 12, 1), 100);
  const offset = (normalizedPage - 1) * normalizedLimit;
  const where = {};

  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  if (category && category !== 'all') {
    where.category = category;
  }

  const { count, rows } = await Food.findAndCountAll({
    where,
    limit: normalizedLimit,
    offset,
    order: [['created_at', 'DESC']],
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

export const getById = async (id) => {
  const food = await Food.findByPk(id);
  if (!food) throw new NotFoundError('Food');
  return food;
};

export const create = async (data) => {
  return Food.create(normalizeFoodData(data));
};

export const update = async (id, data) => {
  const food = await Food.findByPk(id);
  if (!food) throw new NotFoundError('Food');
  const normalized = normalizeFoodData(data, { partial: true });
  const previousPublicId = food.image_public_id;
  await food.update(normalized);

  if (normalized.image_public_id && previousPublicId && previousPublicId !== normalized.image_public_id) {
    try {
      await deleteUploadedImage(previousPublicId);
    } catch (error) {
      console.error('Failed to delete previous Cloudinary image:', error.message);
    }
  }
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
