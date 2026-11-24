import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCart, cartTotals, supportsGrind, productById, packWeightGrams } from './commerce.js';
import { COFFEE_BEANS_DATA } from './coffeeBeansData.js';
import { newCheckout, validateCheckout } from './checkout.js';

const row = (overrides = {}) => ({ coffeeId: 'cb-1', selectedSize: '250g', selectedGrind: 'Whole Beans', quantity: 1, ...overrides });
test('Cart recovers malformed storage and rejects invalid items', () => {
  for (const value of [null, {}, 'bad', 42]) assert.deepEqual(normalizeCart(value), []);
  assert.deepEqual(normalizeCart([null, row({ coffeeId: 'missing' }), row({ quantity: -2 }), row({ quantity: 1.5 })]), []);
});
test('Cart uses catalog prices and merges identical variants without merging different grinds', () => {
  const cart = normalizeCart([row({ prices: { '250g': 0 }, quantity: 2 }), row(), row({ selectedGrind: 'Moka Pot' })]);
  assert.equal(cart.length, 2);
  assert.equal(cart[0].quantity, 3);
  assert.equal(cart[0].prices['250g'], 226);
  assert.deepEqual(cartTotals(cart, 'delivery'), { subtotal: 904, delivery: 80, tax: 49.2, total: 1033.2, count: 4, weightGrams: 1000 });
});
test('Changing a variant merges existing rows and retains total quantity', () => {
  const cart = normalizeCart([row(), row({ selectedSize: '500g', quantity: 2 })]);
  const changed = normalizeCart(cart.map(item => ({ ...item, selectedSize: '500g' })));
  assert.equal(changed.length, 1);
  assert.equal(changed[0].quantity, 3);
});
test('Delivery charges each pack proportionally and applies GST to products plus delivery', () => {
  const one = cartTotals(normalizeCart([row()]), 'delivery');
  assert.deepEqual(one, { subtotal: 226, delivery: 20, tax: 12.3, total: 258.3, count: 1, weightGrams: 250 });
  const two = cartTotals(normalizeCart([row({ quantity: 2 })]), 'delivery');
  assert.equal(two.delivery, 40);
  assert.equal(two.tax, 24.6);
  assert.equal(two.total, 516.6);
  const mixed = cartTotals(normalizeCart([row({ selectedSize: '1 Kg' }), row({ selectedSize: '500g' })]), 'delivery');
  assert.equal(mixed.delivery, 120);
  assert.equal(mixed.weightGrams, 1500);
});
test('Pickup removes both the delivery fee and GST on that fee', () => {
  assert.deepEqual(cartTotals(normalizeCart([row({ quantity: 2 })]), 'pickup'), { subtotal: 452, delivery: 0, tax: 22.6, total: 474.6, count: 2, weightGrams: 500 });
});
test('Cold brew uses the approved 1ml = 1g conversion including mixed carts', () => {
  const coldBrew = cartTotals(normalizeCart([row({ coffeeId: 'cb-57', selectedSize: '180 ml', quantity: 2 })]), 'delivery');
  assert.equal(coldBrew.delivery, 28.8);
  assert.equal(coldBrew.tax, 43.34);
  assert.equal(coldBrew.total, 910.14);
  const mixed = cartTotals(normalizeCart([row(), row({ coffeeId: 'cb-57', selectedSize: '500 ml' })]), 'delivery');
  assert.equal(mixed.delivery, 60);
  assert.equal(mixed.weightGrams, 750);
});
test('Every catalog size has a known weight; unsupported units cannot silently get free delivery', () => {
  for (const product of COFFEE_BEANS_DATA) for (const size of Object.keys(product.prices)) assert.ok(packWeightGrams(size) > 0);
  assert.throws(() => packWeightGrams('Standard'), /Missing delivery weight/);
  assert.deepEqual(cartTotals([], 'delivery'), { subtotal: 0, delivery: 0, tax: 0, total: 0, count: 0, weightGrams: 0 });
});
test('Instant, cold brew and cascara never receive a grind option', () => {
  for (const id of ['cb-28', 'cb-51', 'cb-57']) {
    assert.equal(supportsGrind(productById(id)), false);
    assert.equal(normalizeCart([row({ coffeeId: id })])[0].selectedGrind, '');
  }
});
test('Required contact, fulfilment, online payment and acknowledgement are validated', () => {
  const draft = newCheckout();
  assert.deepEqual(Object.keys(validateCheckout(draft, 0)), ['name', 'email', 'phone']);
  draft.name = 'Test Customer'; draft.email = 'test@example.com'; draft.phone = '9876543210';
  assert.deepEqual(validateCheckout(draft, 0), {});
  assert.ok(validateCheckout(draft, 1).fulfilment);
  draft.fulfilment = 'pickup';
  assert.deepEqual(validateCheckout(draft, 1), {});
  assert.ok(validateCheckout(draft, 2).payment);
  draft.payment = 'online'; draft.acknowledged = true;
  assert.deepEqual(validateCheckout(draft), {});
});
test('Delivery and separate billing require valid addresses, pickup does not', () => {
  const draft = newCheckout(); draft.fulfilment = 'delivery';
  assert.equal(Object.keys(validateCheckout(draft, 1)).length, 5);
  draft.shipping = { name: 'Test Customer', line1: '12 Test Street', city: 'Kolkata', state: 'West Bengal', pin: '700019' };
  assert.deepEqual(validateCheckout(draft, 1), {});
  draft.shipping.pin = '000000'; assert.ok(validateCheckout(draft, 1)['shipping.pin']);
  draft.fulfilment = 'pickup'; draft.separateBilling = true;
  assert.ok(validateCheckout(draft, 1)['billing.line1']);
  assert.equal(validateCheckout(draft, 1)['shipping.pin'], undefined);
});
