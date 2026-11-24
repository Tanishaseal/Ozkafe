// Explicit opt-in integration check: creates one UNPAID order in Razorpay TEST mode.
// Run: node --env-file=.env.local scripts/check-razorpay.mjs
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createPaymentService } from '../server/payment-service.js';
import { checkoutFixture } from '../server/payment-fixture.js';

try {
  const service = createPaymentService();
  const input = checkoutFixture();
  input.details.name = 'Ozkafe Integration Test';
  input.details.separateBilling = true;
  input.details.billing = { ...input.details.shipping, name: 'Test Billing Recipient' };
  input.details.notes = 'INTEGRATION TEST ONLY. Do not fulfil. Notes round-trip verification: ☕.';
  const payment = await service.create(input);
  const status = await service.status(payment);
  assert.equal(status.status, 'pending');
  assert.equal(status.order.details.notes, input.details.notes);
  assert.equal(payment.amount, 51660);
  // The service validates every stored Notes field against the original on fetch.
  await mkdir('node_modules/.cache/ozkafe-qa', { recursive: true });
  await writeFile('node_modules/.cache/ozkafe-qa/razorpay-test-session.json', JSON.stringify(payment));
  console.log(`PASS: Razorpay test credentials, order creation and persisted Notes verified. Order: ${payment.orderId}; amount: INR 516.60; unpaid (no payment attempted).`);
} catch (error) {
  console.error(`Razorpay integration check failed: ${error.message}`);
  process.exitCode = 1;
}
