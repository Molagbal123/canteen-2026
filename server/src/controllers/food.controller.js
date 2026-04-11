import { catchAsync } from '../utils/catch-async.js';
import * as foodService from '../services/food.service.js';

export const getAll = catchAsync(async (req, res) => {
  const { page, limit, search, category } = req.query;
  const result = await foodService.getAll({ page, limit, search, category });
  res.status(200).json({ success: true, ...result });
});

export const getById = catchAsync(async (req, res) => {
  const food = await foodService.getById(req.params.id);
  res.status(200).json({ success: true, data: food });
});

export const create = catchAsync(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.image = req.file.path;
  }
  const food = await foodService.create(data);
  res.status(201).json({ success: true, data: food, message: 'Food created successfully' });
});

export const update = catchAsync(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.image = req.file.path;
  }
  const food = await foodService.update(req.params.id, data);
  res.status(200).json({ success: true, data: food, message: 'Food updated successfully' });
});

export const remove = catchAsync(async (req, res) => {
  await foodService.remove(req.params.id);
  res.status(200).json({ success: true, message: 'Food deleted successfully' });
});

export const getCategories = catchAsync(async (req, res) => {
  const categories = await foodService.getCategories();
  res.status(200).json({ success: true, data: categories });
});
