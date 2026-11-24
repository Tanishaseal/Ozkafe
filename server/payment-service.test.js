import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createPaymentService, validateOrderInput } from './payment-service.js';
import { createPaymentHandler } from './payment-handler.js';
import { buildOrderNotes } from './order-notes.js';
import { checkoutFixture, providerFixture, testEnv } from './payment-fixture.js';

const setup = options => {
  const provider = providerFixture();
  return { provider, service: createPaymentService({ env: testEnv, fetchImpl: provider.fetchImpl, ...options }) };
};
const section = (notes, prefix) => JSON.parse(Object.keys(notes).filter(key => key.startsWith(`${prefix}_`)).sort().map(key => notes[key]).join(''));

test('server uses catalogue prices, weight-based delivery and overall GST despite client tampering', () => {
  const input = checkoutFixture(); input.amount = 1; input.totals = { total: .01 }; input.items[0].prices = { '250g': .01 };
  const quote = validateOrderInput(input);
  assert.equal(quote.amount, 51660); assert.equal(quote.totals.delivery, 40); assert.equal(quote.totals.tax, 24.6);
  input.details.fulfilment = 'pickup'; assert.equal(validateOrderInput(input).amount, 47460);
  input.items = [{ coffeeId: 'cb-57', selectedSize: '180 ml', selectedGrind: '', quantity: 1 }];
  input.details.fulfilment = 'delivery'; assert.equal(validateOrderInput(input).totals.delivery, 14.4);
});
test('invalid selections and missing customer details are rejected', () => {
  for (const change of [input => input.items[0].quantity = -1, input => input.items[0].quantity = 1.1, input => input.items[0].quantity = Number.MAX_SAFE_INTEGER, input => input.items[0].coffeeId = 'missing', input => input.items[0].selectedSize = '1g', input => input.items[0].selectedGrind = 'invalid', input => input.details.email = 'bad', input => input.details.shipping.pin = '123', input => input.details.shipping.country = 'Nepal', input => input.details.acknowledged = false]) {
    const input = checkoutFixture(); change(input); assert.throws(() => validateOrderInput(input));
  }
});
test('all customer, address, billing, item and instruction details survive Notes chunking', () => {
  const input = checkoutFixture(); input.details.separateBilling = true; input.details.billing = { ...input.details.shipping, name: 'Billing Customer' }; input.details.notes = '☕'.repeat(260) + '😀'.repeat(60);
  const quote = validateOrderInput(input); const notes = buildOrderNotes(quote);
  assert.ok(Object.keys(notes).length <= 15); assert.ok(Object.values(notes).every(value => typeof value === 'string' && value.length <= 256));
  assert.equal(section(notes, 'customer').email, input.details.email);
  assert.deepEqual(section(notes, 'delivery'), input.details.shipping); assert.deepEqual(section(notes, 'billing'), input.details.billing);
  assert.equal(section(notes, 'instructions'), input.details.notes);
  assert.equal(section(notes, 'items')[0].quantity, 2); assert.equal(section(notes, 'totals').total, 516.6);
});
test('oversized Notes stop checkout before a provider order or payment is created', async () => {
  const { service, provider } = setup(); const input = checkoutFixture();
  input.details.separateBilling = true;
  for (const key of ['name', 'city']) input.details.shipping[key] = 'X'.repeat(100);
  input.details.shipping.line1 = 'X'.repeat(180); input.details.shipping.line2 = 'X'.repeat(180); input.details.shipping.landmark = 'X'.repeat(120);
  input.details.billing = { ...input.details.shipping }; input.details.notes = 'N'.repeat(500);
  input.items = Array.from({ length: 10 }, (_, index) => ({ ...input.items[0], coffeeId: `cb-${index + 1}` }));
  await assert.rejects(service.create(input), /storage limit/); assert.equal(provider.calls.length, 0);
});
test('creates durable order Notes and encrypted sessions; retry reuses the provider order', async () => {
  const { service, provider } = setup(); const input = checkoutFixture(); const created = await service.create(input);
  assert.equal(created.amount, 51660); assert.equal(created.keyId, testEnv.RAZORPAY_KEY_ID);
  assert.equal(Buffer.from(created.checkoutToken, 'base64url').includes(Buffer.from(input.details.email)), false);
  assert.equal(section(provider.orders.get(created.orderId).notes, 'customer').name, input.details.name);
  const retried = await service.create({ ...input, checkoutToken: created.checkoutToken });
  assert.equal(retried.orderId, created.orderId); assert.equal(provider.orders.size, 1);
  input.items[0].quantity = 1;
  await assert.rejects(service.create({ ...input, checkoutToken: created.checkoutToken }), /different checkout details/);
});
test('valid signature and provider-authorized payment are captured and verified idempotently', async () => {
  const { service, provider } = setup(); const created = await service.create(checkoutFixture()); const callback = provider.authorize(created.orderId);
  const result = await service.verify({ ...callback, checkoutToken: created.checkoutToken });
  assert.equal(result.status, 'paid'); assert.equal(result.order.totals.total, 516.6);
  assert.equal((await service.verify({ ...callback, checkoutToken: created.checkoutToken })).status, 'paid');
  assert.equal(provider.calls.filter(call => call.path.endsWith('/capture')).length, 1);
});
test('forged signatures and substituted callback order IDs cannot confirm payment', async () => {
  const { service, provider } = setup(); const created = await service.create(checkoutFixture()); const callback = provider.authorize(created.orderId);
  for (const signature of ['0'.repeat(64), 'short', null]) await assert.rejects(service.verify({ ...callback, razorpay_signature: signature, checkoutToken: created.checkoutToken }), /signature/);
  await assert.rejects(service.verify({ ...callback, razorpay_order_id: 'order_other', checkoutToken: created.checkoutToken }), /reference/);
  assert.equal(provider.calls.filter(call => call.path.includes('/payments')).length, 0);
});
test('validly signed payments with mismatched amounts, currencies or orders never succeed', async () => {
  for (const overrides of [{ amount: 1 }, { currency: 'USD' }, { order_id: 'order_other' }]) {
    const { service, provider } = setup(); const created = await service.create(checkoutFixture()); const callback = provider.authorize(created.orderId, overrides);
    await assert.rejects(service.verify({ ...callback, checkoutToken: created.checkoutToken }), /does not match/);
  }
});
test('failed, pending and refunded payments never become confirmed orders', async () => {
  for (const overrides of [{ status: 'failed' }, { status: 'created' }, { status: 'captured', captured: true, amount_refunded: 1 }]) {
    const { service, provider } = setup(); const created = await service.create(checkoutFixture()); const callback = provider.authorize(created.orderId, overrides);
    assert.notEqual((await service.verify({ ...callback, checkoutToken: created.checkoutToken })).status, 'paid');
  }
});
test('status recovers a captured payment after a lost browser callback', async () => {
  const { service, provider } = setup(); const created = await service.create(checkoutFixture());
  assert.equal((await service.status(created)).status, 'pending');
  provider.authorize(created.orderId, { status: 'captured', captured: true });
  const recovered = await service.status(created); assert.equal(recovered.status, 'paid'); assert.equal(recovered.order.details.email, 'test@example.com');
});
test('tampered/expired sessions, missing configuration and live keys are rejected', async () => {
  const { service, provider } = setup(); const created = await service.create(checkoutFixture());
  await assert.rejects(service.status({ checkoutToken: 'broken' }), /Invalid checkout session/);
  const expired = createPaymentService({ env: testEnv, fetchImpl: provider.fetchImpl, now: () => Date.now() + 49 * 3600000 });
  await assert.rejects(expired.status(created), /expired/);
  for (const env of [{}, { ...testEnv, RAZORPAY_KEY_ID: 'rzp_live_fixture' }]) {
    const disabled = createPaymentService({ env }); assert.equal(disabled.config().enabled, false);
    await assert.rejects(disabled.create(checkoutFixture()), /not configured/);
  }
});
test('provider failures do not leak credentials or raw errors', async () => {
  const service = createPaymentService({ env: testEnv, fetchImpl: async () => { throw new Error(testEnv.RAZORPAY_KEY_SECRET); } });
  await assert.rejects(service.create(checkoutFixture()), error => error.status === 502 && !error.message.includes(testEnv.RAZORPAY_KEY_SECRET));
});
test('HTTP API rejects cross-origin mutations, malformed/oversized requests and never returns secrets', async t => {
  const provider = providerFixture(); const server = createServer(createPaymentHandler({ env: testEnv, fetchImpl: provider.fetchImpl }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const get = await fetch(origin); assert.equal(get.headers.get('cache-control'), 'no-store'); assert.deepEqual(await get.json(), { enabled: true, mode: 'test' });
  const post = (body, headers = {}) => fetch(origin, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, ...headers }, body });
  assert.equal((await post('{}', { Origin: 'https://other.example' })).status, 403);
  assert.equal((await post('{')).status, 400);
  assert.equal((await post('{}', { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await post(JSON.stringify({ huge: 'x'.repeat(200001) }))).status, 413);
  assert.equal((await fetch(origin, { method: 'DELETE' })).status, 405);
  const response = await post(JSON.stringify({ action: 'create', ...checkoutFixture() }));
  assert.equal(response.status, 200); assert.equal((await response.text()).includes(testEnv.RAZORPAY_KEY_SECRET), false);
});
