import { createPaymentHandler } from '../server/payment-handler.js';

// Vercel Node.js Function; all credentials are read server-side at runtime.
export default createPaymentHandler();
