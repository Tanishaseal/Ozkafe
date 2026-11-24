import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { cartTotals, normalizeCart, productById, supportsGrind } from '../src/data/commerce.js';
import { GRIND_SIZE_OPTIONS } from '../src/data/coffeeBeansData.js';
import { newCheckout, validateCheckout } from '../src/data/checkout.js';
import { buildOrderNotes } from './order-notes.js';

export class PaymentError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

const requireValue = (condition, message, status = 400) => { if (!condition) throw new PaymentError(message, status); };
const sameHex = (left, right) => typeof right === 'string' && /^[a-f0-9]{64}$/i.test(right) && timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'));
const fingerprint = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

export function validateOrderInput(input) {
  requireValue(input && typeof input === 'object', 'Invalid checkout request.');
  requireValue(Array.isArray(input.items) && input.items.length > 0 && input.items.length <= 100, 'Provide between 1 and 100 cart lines.');
  const selections = input.items.map(item => {
    const product = productById(item?.coffeeId);
    requireValue(product, 'A product is no longer available. Refresh your cart.');
    requireValue(Number.isSafeInteger(item.quantity) && item.quantity > 0, 'Invalid quantity.');
    requireValue(Object.hasOwn(product.prices, item.selectedSize), 'Invalid pack size.');
    requireValue(supportsGrind(product) ? GRIND_SIZE_OPTIONS.includes(item.selectedGrind) : item.selectedGrind === '', 'Invalid grind selection.');
    return { coffeeId: product.id, selectedSize: item.selectedSize, selectedGrind: item.selectedGrind, quantity: item.quantity };
  });
  const raw = input.details;
  requireValue(raw && typeof raw === 'object', 'Contact and delivery details are required.');
  const details = newCheckout();
  const string = (value, max, label) => {
    requireValue(typeof value === 'string' && value.length <= max, `Invalid ${label}.`);
    return value.trim();
  };
  details.name = string(raw.name, 100, 'name');
  details.email = string(raw.email, 254, 'email');
  details.phone = string(raw.phone, 14, 'mobile number').replace(/\s/g, '');
  details.fulfilment = string(raw.fulfilment, 20, 'fulfilment method');
  details.payment = string(raw.payment, 20, 'payment method');
  details.notes = string(raw.notes ?? '', 500, 'order notes');
  requireValue(typeof raw.separateBilling === 'boolean', 'Invalid billing selection.');
  details.separateBilling = raw.separateBilling;
  details.acknowledged = raw.acknowledged === true;
  for (const prefix of ['shipping', 'billing']) {
    if ((prefix === 'shipping' && details.fulfilment !== 'delivery') || (prefix === 'billing' && !details.separateBilling)) continue;
    requireValue(raw[prefix] && typeof raw[prefix] === 'object', 'Address is required.');
    for (const [key, max] of Object.entries({ name: 100, line1: 180, line2: 180, landmark: 120, city: 100, state: 100, pin: 6, country: 30 })) {
      details[prefix][key] = string(raw[prefix][key] ?? '', max, `${prefix} ${key}`);
    }
    requireValue(details[prefix].country === 'India', 'Delivery and billing addresses must be in India.');
  }
  const errors = validateCheckout(details);
  requireValue(!Object.keys(errors).length, Object.values(errors)[0] || 'Check your details.');
  const items = normalizeCart(selections);
  requireValue(items.reduce((sum, item) => sum + item.quantity, 0) === selections.reduce((sum, item) => sum + item.quantity, 0), 'Invalid total quantity.');
  const totals = cartTotals(items, details.fulfilment);
  const amount = Math.round(totals.total * 100);
  requireValue(Number.isSafeInteger(amount) && amount >= 100, 'Invalid order amount.');
  return { items, details, totals, amount, currency: 'INR' };
}

export function createPaymentService({ env = process.env, fetchImpl = fetch, now = () => Date.now() } = {}) {
  const configured = () => Boolean(env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') && env.RAZORPAY_KEY_SECRET && /^[a-f0-9]{64}$/i.test(env.PAYMENT_SESSION_SECRET || ''));
  const config = () => ({ enabled: configured(), mode: 'test' });
  const requireConfig = () => requireValue(configured(), 'Test checkout is not configured on the server. Please contact Ozkafe.', 503);
  const sessionKey = () => Buffer.from(env.PAYMENT_SESSION_SECRET, 'hex');
  const seal = data => {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', sessionKey(), iv);
    cipher.setAAD(Buffer.from('ozkafe-test-checkout-v1'));
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
    return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
  };
  const unseal = token => {
    requireConfig();
    try {
      requireValue(typeof token === 'string' && token.length < 180000, 'Invalid checkout session.');
      const bytes = Buffer.from(token, 'base64url');
      const decipher = createDecipheriv('aes-256-gcm', sessionKey(), bytes.subarray(0, 12));
      decipher.setAAD(Buffer.from('ozkafe-test-checkout-v1'));
      decipher.setAuthTag(bytes.subarray(12, 28));
      const data = JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString('utf8'));
      requireValue(data.expiresAt > now(), 'This checkout session has expired. Contact Ozkafe if you already completed a test payment.');
      return data;
    } catch (error) {
      if (error instanceof PaymentError) throw error;
      throw new PaymentError('Invalid checkout session.');
    }
  };
  const request = async (path, body) => {
    requireConfig();
    let response;
    try {
      response = await fetchImpl(`https://api.razorpay.com/v1${path}`, {
        method: body ? 'POST' : 'GET',
        headers: { Authorization: `Basic ${Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64')}`, 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(12000)
      });
    } catch { throw new PaymentError('Razorpay could not be reached. Please try again or check payment status.', 502); }
    // Never return provider response bodies, authorization headers or secrets in errors.
    requireValue(response.ok, 'Razorpay could not process this request. Please retry or contact Ozkafe.', 502);
    try { return await response.json(); } catch { throw new PaymentError('Invalid response from payment provider.', 502); }
  };
  const checkProviderOrder = (order, session) => {
    requireValue(order.id === session.orderId && order.amount === session.quote.amount && order.currency === 'INR' && order.receipt === session.receipt, 'Payment order does not match checkout.', 409);
    requireValue(Object.entries(buildOrderNotes(session.quote)).every(([key, value]) => order.notes?.[key] === value), 'Order details could not be confirmed in Razorpay. Please contact Ozkafe before paying.', 409);
  };
  const result = (session, payment, status) => ({
    status, mode: 'test', orderId: session.orderId, paymentId: payment?.id || null,
    order: { id: session.orderId, paymentId: payment?.id || null, status, mode: 'test', createdAt: session.createdAt, items: session.quote.items, details: session.quote.details, totals: session.quote.totals }
  });
  const checkPayment = async (session, payment) => {
    requireValue(payment.order_id === session.orderId && payment.amount === session.quote.amount && payment.currency === 'INR', 'Payment amount or order does not match checkout.', 409);
    if (payment.status === 'authorized') {
      // Capture only the verified amount. This service deliberately rejects live keys.
      try { payment = await request(`/payments/${payment.id}/capture`, { amount: session.quote.amount, currency: 'INR' }); }
      catch { payment = await request(`/payments/${payment.id}`); }
      requireValue(payment.order_id === session.orderId && payment.amount === session.quote.amount && payment.currency === 'INR', 'Payment does not match checkout.', 409);
    }
    if (payment.status === 'captured' && payment.captured === true && !payment.amount_refunded) return result(session, payment, 'paid');
    return result(session, payment, payment.status === 'failed' ? 'failed' : 'pending');
  };
  const status = async input => {
    const session = unseal(input?.checkoutToken);
    const order = await request(`/orders/${session.orderId}`);
    checkProviderOrder(order, session);
    const payments = await request(`/orders/${session.orderId}/payments`);
    requireValue(Array.isArray(payments.items), 'Unable to check payment status.', 502);
    const payment = payments.items.find(item => item.status === 'captured') || payments.items.find(item => item.status === 'authorized');
    return payment ? checkPayment(session, payment) : result(session, null, 'pending');
  };
  return {
    config,
    async create(input) {
      requireConfig();
      const quote = validateOrderInput(input);
      let notes;
      try { notes = buildOrderNotes(quote); } catch (error) { throw new PaymentError(error.message); }
      let session;
      if (input.checkoutToken) {
        const previous = unseal(input.checkoutToken);
        requireValue(fingerprint(previous.quote) === fingerprint(quote), 'A pending payment has different checkout details. Check its status before starting a new checkout.', 409);
        session = previous;
        const order = await request(`/orders/${session.orderId}`);
        checkProviderOrder(order, session);
      } else {
        const receipt = `OZTEST-${randomUUID().replaceAll('-', '').slice(0, 24)}`;
        const order = await request('/orders', { amount: quote.amount, currency: 'INR', receipt, partial_payment: false, notes });
        requireValue(/^order_[a-zA-Z0-9]+$/.test(order.id), 'Invalid payment order returned.', 502);
        session = { orderId: order.id, receipt, quote, createdAt: new Date(now()).toISOString(), expiresAt: now() + 48 * 60 * 60 * 1000 };
        checkProviderOrder(order, session);
      }
      return { keyId: env.RAZORPAY_KEY_ID, mode: 'test', orderId: session.orderId, amount: quote.amount, currency: 'INR', checkoutToken: seal(session), expiresAt: session.expiresAt, totals: quote.totals };
    },
    async verify(input) {
      const session = unseal(input?.checkoutToken);
      requireValue(input.razorpay_order_id === session.orderId && /^pay_[a-zA-Z0-9]+$/.test(input.razorpay_payment_id || ''), 'Invalid payment reference.');
      const expected = createHmac('sha256', env.RAZORPAY_KEY_SECRET).update(`${session.orderId}|${input.razorpay_payment_id}`).digest('hex');
      requireValue(sameHex(expected, input.razorpay_signature), 'Payment signature could not be verified.', 400);
      checkProviderOrder(await request(`/orders/${session.orderId}`), session);
      const payment = await request(`/payments/${input.razorpay_payment_id}`);
      requireValue(payment.id === input.razorpay_payment_id, 'Invalid payment reference.', 409);
      return checkPayment(session, payment);
    },
    status
  };
}
