import { useEffect, useRef, useState } from 'react';
import { clearPendingPayment, loadRazorpay, openRazorpay, paymentRequest, readPendingPayment, savePendingPayment } from './payment-client';

export default function usePaymentCheckout({ cart, draft, onComplete, onRestore }) {
  const [available, setAvailable] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(readPendingPayment);
  const locked = useRef(false);
  useEffect(() => {
    let active = true;
    paymentRequest().then(config => { if (active) setAvailable(config.enabled && config.mode === 'test'); })
      .catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, []);
  const complete = result => {
    if (result.status !== 'paid' || result.mode !== 'test') return false;
    clearPendingPayment(); setPending(null); onComplete(result.order);
    return true;
  };
  const run = async action => {
    if (locked.current) return;
    locked.current = true; setBusy(true); setMessage('');
    try { await action(); }
    catch (error) { setMessage(error.message || 'Payment could not be completed. Check its status before retrying.'); }
    finally { locked.current = false; setBusy(false); }
  };
  const check = (discard = false) => run(async () => {
    const saved = readPendingPayment();
    if (!saved) return;
    const result = await paymentRequest('status', { checkoutToken: saved.checkoutToken });
    if (complete(result)) return;
    if (discard) {
      clearPendingPayment(); setPending(null);
      setMessage('No completed payment was found. You can now edit your details and start a new test checkout.');
    } else {
      onRestore(result.order);
      setMessage('No completed payment was found. Your saved checkout has been restored. Review it before retrying.');
    }
  });
  const pay = () => run(async () => {
    const saved = readPendingPayment();
    if (saved && complete(await paymentRequest('status', { checkoutToken: saved.checkoutToken }))) return;
    await loadRazorpay();
    const payment = await paymentRequest('create', {
      items: cart.map(({ coffeeId, selectedSize, selectedGrind, quantity }) => ({ coffeeId, selectedSize, selectedGrind, quantity })),
      details: draft, ...(saved ? { checkoutToken: saved.checkoutToken } : {})
    });
    savePendingPayment(payment); setPending(payment);
    const callback = await openRazorpay(payment, draft);
    const result = await paymentRequest('verify', { ...callback, checkoutToken: payment.checkoutToken });
    if (!complete(result)) setMessage('Your payment is awaiting confirmation. Keep your order reference and check payment status before retrying.');
  });
  return { available, busy, message, pending, pay, check };
}
