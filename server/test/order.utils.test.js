import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertValidStatusTransition,
  normalizeDeliveryDetails,
  normalizeOrderItems,
  normalizeRequestId,
} from '../src/utils/order.js';

test('normalizeOrderItems combines duplicate foods', () => {
  assert.deepEqual(
    normalizeOrderItems([
      { foodId: 4, quantity: 2 },
      { foodId: '4', quantity: '3' },
      { foodId: 7, quantity: 1 },
    ]),
    [
      { foodId: 4, quantity: 5 },
      { foodId: 7, quantity: 1 },
    ]
  );
});

test('normalizeOrderItems rejects unsafe quantities', () => {
  for (const quantity of [0, -1, 1.5, 'invalid', 21]) {
    assert.throws(() => normalizeOrderItems([{ foodId: 1, quantity }]), {
      name: 'Error',
    });
  }
});

test('normalizeOrderItems rejects invalid food IDs and empty orders', () => {
  assert.throws(() => normalizeOrderItems([]));
  assert.throws(() => normalizeOrderItems([{ foodId: 0, quantity: 1 }]));
  assert.throws(() => normalizeOrderItems([{ foodId: 'x', quantity: 1 }]));
});

test('normalizeDeliveryDetails trims values and validates phone numbers', () => {
  assert.deepEqual(
    normalizeDeliveryDetails({
      customerName: '  Nguyen Van Minh ',
      customerPhone: ' 0912 345 678 ',
      customerAddress: ' Room B2-305 ',
    }),
    {
      customerName: 'Nguyen Van Minh',
      customerPhone: '0912 345 678',
      customerAddress: 'Room B2-305',
    }
  );
  assert.throws(() => normalizeDeliveryDetails({
    customerName: 'Minh',
    customerPhone: 'abc',
    customerAddress: 'B2',
  }));
});

test('order status only moves forward one step', () => {
  assert.doesNotThrow(() => assertValidStatusTransition('pending', 'cooking'));
  assert.doesNotThrow(() => assertValidStatusTransition('done', 'done'));
  assert.throws(() => assertValidStatusTransition('pending', 'done'));
  assert.throws(() => assertValidStatusTransition('done', 'pending'));
  assert.throws(() => assertValidStatusTransition('pending', 'unknown'));
});

test('request IDs are optional but constrained', () => {
  assert.equal(normalizeRequestId(undefined), null);
  assert.equal(normalizeRequestId('order_123456'), 'order_123456');
  assert.throws(() => normalizeRequestId('short'));
  assert.throws(() => normalizeRequestId('contains spaces'));
});
