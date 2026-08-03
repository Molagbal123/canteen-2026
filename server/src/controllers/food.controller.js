import { catchAsync } from '../utils/catch-async.js';
import * as foodService from '../services/food.service.js';
import { emitFoodChanged } from '../realtime/socket.js';
import { deleteUploadedImage, uploadFoodImage } from '../services/image.service.js';

const persistWithOptionalImage = async (body, file, persist) => {
  const data = { ...body };
  let uploadedImage;

  try {
    if (file) {
      uploadedImage = await uploadFoodImage(file);
      data.image = uploadedImage.secure_url;
      data.image_public_id = uploadedImage.public_id;
    }
    return await persist(data);
  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await deleteUploadedImage(uploadedImage.public_id);
      } catch {
        // The original persistence error is more actionable.
      }
    }
    throw error;
  }
};

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
  const food = await persistWithOptionalImage(
    req.body,
    req.file,
    (data) => foodService.create(data)
  );
  emitFoodChanged('created', food);
  res.status(201).json({ success: true, data: food, message: 'Food created successfully' });
});

export const update = catchAsync(async (req, res) => {
  const food = await persistWithOptionalImage(
    req.body,
    req.file,
    (data) => foodService.update(req.params.id, data)
  );
  emitFoodChanged('updated', food);
  res.status(200).json({ success: true, data: food, message: 'Food updated successfully' });
});

export const remove = catchAsync(async (req, res) => {
  const food = await foodService.remove(req.params.id);
  emitFoodChanged('deleted', food);
  res.status(200).json({ success: true, message: 'Food deleted successfully' });
});

export const getCategories = catchAsync(async (req, res) => {
  const categories = await foodService.getCategories();
  res.status(200).json({ success: true, data: categories });
});
