import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCart, cartTotals, supportsGrind, productById } from './commerce.js';
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
  assert.deepEqual(cartTotals(cart), { subtotal: 904, tax: 45.2, total: 949.2, count: 4 });
});
test('Changing a variant merges existing rows and retains total quantity', () => {
  const cart = normalizeCart([row(), row({ selectedSize: '500g', quantity: 2 })]);
  const changed = normalizeCart(cart.map(item => ({ ...item, selectedSize: '500g' })));
  assert.equal(changed.length, 1);
  assert.equal(changed[0].quantity, 3);
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
