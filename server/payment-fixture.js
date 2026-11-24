// Synthetic provider for automated tests only. Never imported by the API/app.
import { createHmac } from 'node:crypto';
import { newCheckout } from '../src/data/checkout.js';

export const testEnv = { RAZORPAY_KEY_ID: 'rzp_test_fixture', RAZORPAY_KEY_SECRET: 'synthetic-test-secret', PAYMENT_SESSION_SECRET: 'ab'.repeat(32) };
export function checkoutFixture() {
  return {
    items: [{ coffeeId: 'cb-1', selectedSize: '250g', selectedGrind: 'Whole Beans', quantity: 2 }],
    details: { ...newCheckout(), name: 'Test Customer', email: 'test@example.com', phone: '9876543210', fulfilment: 'delivery', payment: 'online', acknowledged: true,
      shipping: { name: 'Test Customer', line1: '12 Test Street', line2: '', landmark: '', city: 'Kolkata', state: 'West Bengal', pin: '700019', country: 'India' } }
  };
}
export function providerFixture() {
  const orders = new Map();
  const payments = new Map();
  const calls = [];
  const fetchImpl = async (url, options) => {
    const path = new URL(url).pathname.replace('/v1', '');
    calls.push({ path, method: options.method });
    let data;
    if (path === '/orders' && options.method === 'POST') {
      data = { ...JSON.parse(options.body), id: `order_fixture${orders.size + 1}`, status: 'created' };
      orders.set(data.id, data);
    } else if (/^\/orders\/[^/]+\/payments$/.test(path)) {
      data = { items: [...payments.values()].filter(payment => payment.order_id === path.split('/')[2]) };
    } else if (/^\/orders\/[^/]+$/.test(path)) data = orders.get(path.split('/')[2]);
    else if (/^\/payments\/[^/]+\/capture$/.test(path)) {
      data = payments.get(path.split('/')[2]);
      if (JSON.parse(options.body).amount !== data.amount) throw new Error('Incorrect capture amount');
      data.status = 'captured'; data.captured = true;
    } else if (/^\/payments\/[^/]+$/.test(path)) data = payments.get(path.split('/')[2]);
    return { ok: Boolean(data), json: async () => structuredClone(data) };
  };
  const authorize = (orderId, overrides = {}) => {
    const payment = { id: `pay_fixture${payments.size + 1}`, order_id: orderId, amount: orders.get(orderId).amount, currency: 'INR', status: 'authorized', captured: false, amount_refunded: 0, ...overrides };
    payments.set(payment.id, payment);
    return { razorpay_order_id: orderId, razorpay_payment_id: payment.id, razorpay_signature: createHmac('sha256', testEnv.RAZORPAY_KEY_SECRET).update(`${orderId}|${payment.id}`).digest('hex') };
  };
  return { fetchImpl, orders, payments, calls, authorize };
}
