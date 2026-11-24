const PENDING_KEY = 'ozkafe_test_payment';
let pendingMemory = null;
let scriptPromise;

export function readPendingPayment() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(PENDING_KEY));
    if (saved?.checkoutToken && saved?.orderId) return saved;
  } catch { /* Storage may be disabled. The current visit still works. */ }
  return pendingMemory;
}

export function savePendingPayment(payment) {
  // Contains an encrypted server-issued token, not plaintext contact/address data.
  pendingMemory = payment;
  try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(payment)); } catch { /* In-memory fallback. */ }
}

export function clearPendingPayment() {
  pendingMemory = null;
  try { sessionStorage.removeItem(PENDING_KEY); } catch { /* Storage may be disabled. */ }
}

export async function paymentRequest(action, data = {}) {
  let response;
  try {
    response = await fetch('/api/payments', action ? {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...data }), signal: AbortSignal.timeout(55000)
    } : { cache: 'no-store', signal: AbortSignal.timeout(10000) });
  } catch { throw new Error('Unable to reach checkout. If you attempted payment, check its status before retrying.'); }
  let result;
  try { result = await response.json(); } catch { throw new Error('Payment backend is unavailable. Please contact Ozkafe.'); }
  if (!response.ok) throw new Error(result.error || 'Payment could not be processed.');
  return result;
}

export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    const fail = () => { clearTimeout(timer); script.remove(); scriptPromise = null; reject(new Error('Razorpay could not load. Check your connection and try again.')); };
    const timer = setTimeout(fail, 20000);
    script.onerror = fail;
    script.onload = () => { if (!window.Razorpay) return fail(); clearTimeout(timer); resolve(); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function openRazorpay(payment, details) {
  return new Promise((resolve, reject) => {
    let succeeded = false;
    let failed = false;
    const checkout = new window.Razorpay({
      key: payment.keyId, order_id: payment.orderId, amount: payment.amount, currency: payment.currency,
      name: 'Ozkafe', description: 'Ozkafe coffee order · Test payment',
      prefill: { name: details.name, email: details.email, contact: `+91${details.phone.replace(/\s/g, '')}` },
      theme: { color: '#693719' },
      retry: { enabled: true },
      modal: { ondismiss: () => { if (!succeeded) reject(new Error(failed ? 'Test payment was unsuccessful. Your cart is unchanged; check status or retry.' : 'Checkout was closed. Your cart is unchanged.')); } },
      handler: result => { succeeded = true; resolve(result); }
    });
    checkout.on('payment.failed', () => { failed = true; });
    checkout.open();
  });
}
