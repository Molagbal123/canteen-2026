import { ValidationError } from './errors.js';

export const MAX_ORDER_ITEMS = 50;
export const MAX_ITEM_QUANTITY = 20;

export const ORDER_STATUS_TRANSITIONS = Object.freeze({
  pending: ['cooking', 'delivering', 'done'],
  cooking: ['delivering', 'done'],
  delivering: ['cooking', 'done'],
  done: ['cooking', 'delivering'],
});

export const normalizeOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Order must contain at least one item');
  }

  if (items.length > MAX_ORDER_ITEMS) {
    throw new ValidationError(`Order cannot contain more than ${MAX_ORDER_ITEMS} items`);
  }

  const quantitiesByFood = new Map();

  for (const item of items) {
    const foodId = Number(item?.foodId);
    const quantity = Number(item?.quantity);

    if (!Number.isInteger(foodId) || foodId < 1) {
      throw new ValidationError('Each foodId must be a positive integer');
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ValidationError('Each quantity must be a positive integer');
    }

    const combinedQuantity = (quantitiesByFood.get(foodId) || 0) + quantity;
    if (combinedQuantity > MAX_ITEM_QUANTITY) {
      throw new ValidationError(
        `Quantity for food ID ${foodId} cannot exceed ${MAX_ITEM_QUANTITY}`
      );
    }

    quantitiesByFood.set(foodId, combinedQuantity);
  }

  return Array.from(quantitiesByFood, ([foodId, quantity]) => ({ foodId, quantity }));
};

export const normalizeDeliveryDetails = ({ customerName, customerPhone, customerAddress }) => {
  const details = {
    customerName: String(customerName || '').trim(),
    customerPhone: String(customerPhone || '').trim(),
    customerAddress: String(customerAddress || '').trim(),
  };

  if (!details.customerName || !details.customerPhone || !details.customerAddress) {
    throw new ValidationError('Customer name, phone, and address are required');
  }

  if (details.customerName.length > 100 || details.customerAddress.length > 255) {
    throw new ValidationError('Customer name or address is too long');
  }

  if (!/^[0-9+().\s-]{8,20}$/.test(details.customerPhone)) {
    throw new ValidationError('Customer phone is invalid');
  }

  return details;
};

export const normalizeRequestId = (requestId) => {
  if (requestId === undefined || requestId === null || requestId === '') return null;

  const normalized = String(requestId).trim();
  if (!/^[a-zA-Z0-9_-]{8,64}$/.test(normalized)) {
    throw new ValidationError('requestId must be 8-64 letters, numbers, underscores, or hyphens');
  }

  return normalized;
};

export const assertValidStatusTransition = (currentStatus, nextStatus) => {
  if (!Object.hasOwn(ORDER_STATUS_TRANSITIONS, nextStatus)) {
    throw new ValidationError('Invalid order status');
  }

  if (currentStatus === nextStatus) return;

  if (!ORDER_STATUS_TRANSITIONS[currentStatus]?.includes(nextStatus)) {
    throw new ValidationError(`Order cannot move from ${currentStatus} to ${nextStatus}`);
  }
};
