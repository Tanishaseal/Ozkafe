import React, { useRef, useState } from 'react';
import { CreditCard, Info, MapPin, Truck } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';
import { INDIA_STATES, validateCheckout } from '../data/checkout';
import { EmptyState, OrderSummary, ShopLink } from '../components/CommerceUI';

function Field({ id, label, value, onChange, error, full = false, children, ...props }) {
  return <label className={`store-field ${full ? 'is-full' : ''}`} htmlFor={id}><span>{label}{props.required && ' *'}</span>
    {children ? <select {...props} id={id} name={id} value={value} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>{children}</select> : <input {...props} id={id} name={id} value={value} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />}
    {error && <span className="store-error" id={`${id}-error`}>{error}</span>}
  </label>;
}

function AddressFields({ prefix, value, update, errors }) {
  const field = (key, label, props = {}) => <Field id={`${prefix}.${key}`} label={label} value={value[key]} onChange={next => update(key, next)} error={errors[`${prefix}.${key}`]} autoComplete="off" {...props} />;
  return <div className="store-form-grid">
    {field('name', 'Recipient full name', { required: true, full: true, autoComplete: `section-${prefix} name`, maxLength: 100 })}
    {field('line1', 'House / flat, building and street', { required: true, full: true, autoComplete: `section-${prefix} address-line1`, maxLength: 180 })}
    {field('line2', 'Area / locality (optional)', { full: true, autoComplete: `section-${prefix} address-line2`, maxLength: 180 })}
    {field('landmark', 'Landmark (optional)', { full: true, maxLength: 120 })}
    {field('city', 'City / town', { required: true, autoComplete: `section-${prefix} address-level2`, maxLength: 100 })}
    <Field id={`${prefix}.state`} label="State / union territory" required value={value.state} onChange={next => update('state', next)} error={errors[`${prefix}.state`]} autoComplete={`section-${prefix} address-level1`}><option value="">Select state / UT</option>{INDIA_STATES.map(state => <option key={state}>{state}</option>)}</Field>
    {field('pin', 'PIN code', { required: true, autoComplete: `section-${prefix} postal-code`, inputMode: 'numeric', maxLength: 6 })}
    {field('country', 'Country', { readOnly: true, autoComplete: `section-${prefix} country-name` })}
  </div>;
}

export function AddressText({ address }) {
  return <div><p><strong>{address.name}</strong></p><p>{address.line1}{address.line2 && `, ${address.line2}`}</p>{address.landmark && <p>Landmark: {address.landmark}</p>}<p>{address.city}, {address.state} – {address.pin}</p><p>India</p></div>;
}

export default function Checkout({ cart, navigate, draft, setDraft, onComplete }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const submitting = useRef(false);
  const headingRef = useRef(null);
  const steps = ['Contact details', 'Delivery / pickup', 'Payment & review'];
  const edit = (key, value) => {
    setDraft(previous => ({ ...previous, [key]: value }));
    setErrors(previous => { const next = { ...previous }; delete next[key]; return next; });
  };
  const editAddress = (prefix, key, value) => {
    setDraft(previous => ({ ...previous, [prefix]: { ...previous[prefix], [key]: value } }));
    setErrors(previous => { const next = { ...previous }; delete next[`${prefix}.${key}`]; return next; });
  };
  const goStep = next => {
    setErrors({}); setStep(next);
    requestAnimationFrame(() => { headingRef.current?.focus(); headingRef.current?.scrollIntoView({ block: 'center', behavior: 'auto' }); });
  };
  const submit = event => {
    event.preventDefault();
    const found = validateCheckout(draft, step === 2 ? undefined : step);
    if (Object.keys(found).length) {
      setErrors(found);
      if (step === 2) {
        if (Object.keys(validateCheckout(draft, 0)).length) setStep(0);
        else if (Object.keys(validateCheckout(draft, 1)).length) setStep(1);
      }
      requestAnimationFrame(() => document.getElementById(Object.keys(found)[0])?.focus());
      return;
    }
    if (step < 2) { goStep(step + 1); return; }
    if (submitting.current) return;
    submitting.current = true;
    onComplete();
  };
  if (!cart.length) return <div className="store-page container store-content"><EmptyState title="Add a coffee before checking out" navigate={navigate}>Your cart is empty. Select your coffee and pack size to continue.</EmptyState></div>;
  return <div className="store-page container store-content">
    <nav className="store-breadcrumb" aria-label="Breadcrumb"><ShopLink navigate={navigate}>Coffee Beans</ShopLink><span>/</span><ShopLink navigate={navigate} page="cart">Cart</ShopLink><span>/</span><span aria-current="page">Checkout</span></nav>
    <div className="store-page-heading"><div><span className="store-eyebrow">GUEST CHECKOUT</span><h1>Make it your next cup.</h1><p>No account needed. Just your details and your favourite coffee.</p></div></div>
    <div className="store-banner"><Info size={20} aria-hidden="true" /><p><strong>Checkout preview.</strong> No payment will be taken and no real order will be placed. Form details and demo orders are cleared when you refresh this page.</p></div>
    <ol className="store-steps" aria-label="Checkout progress">{steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined}>{index < step ? <button onClick={() => goStep(index)}>✓ {label}</button> : <span>{index + 1}. {label}</span>}</li>)}</ol>
    <div className="store-checkout-layout"><form className="store-form-panel store-panel" onSubmit={submit} noValidate>
      <h2 ref={headingRef} tabIndex={-1}>{steps[step]}</h2><p>{step === 0 ? 'Your contact details for this order. Fields marked * are required.' : step === 1 ? 'Choose how you would like to receive your coffee.' : 'Check your selections and details before creating a demo order.'}</p>
      {Object.keys(errors).length > 0 && <div className="store-error-summary" role="alert"><strong>Please check the following:</strong>{Object.entries(errors).map(([key, message]) => <a key={key} href={`#${key}`} onClick={event => { event.preventDefault(); document.getElementById(key)?.focus(); }}>{message}</a>)}</div>}
      {step === 0 && <div className="store-form-grid">
        <Field id="name" label="Full name" required full autoComplete="name" maxLength={100} value={draft.name} onChange={value => edit('name', value)} error={errors.name} />
        <Field id="email" label="Email address" type="email" required full autoComplete="email" maxLength={254} value={draft.email} onChange={value => edit('email', value)} error={errors.email} />
        <Field id="phone" label="Mobile number (+91)" type="tel" inputMode="tel" required full autoComplete="tel-national" maxLength={14} value={draft.phone} onChange={value => edit('phone', value)} error={errors.phone} />
      </div>}
      {step === 1 && <>
        <fieldset className="store-options"><legend>Receive your order *</legend><div className="store-choices">
          <label className="store-choice"><input id="fulfilment" type="radio" name="fulfilment" value="delivery" checked={draft.fulfilment === 'delivery'} onChange={() => edit('fulfilment', 'delivery')} aria-describedby={errors.fulfilment ? 'fulfilment-error' : undefined} /><div><Truck size={22} /><strong>Home delivery</strong><span>Across India</span><span>Delivery: ₹80/kg per item + 5% GST</span></div></label>
          <label className="store-choice"><input type="radio" name="fulfilment" value="pickup" checked={draft.fulfilment === 'pickup'} onChange={() => edit('fulfilment', 'pickup')} /><div><MapPin size={22} /><strong>Café pickup</strong><span>Collect from Ozkafe, Kolkata</span><span>No shipping required</span></div></label>
        </div>{errors.fulfilment && <p className="store-error" id="fulfilment-error">{errors.fulfilment}</p>}</fieldset>
        {draft.fulfilment === 'delivery' && <fieldset className="store-form-section"><legend>Delivery address</legend><AddressFields prefix="shipping" value={draft.shipping} update={(key, value) => editAddress('shipping', key, value)} errors={errors} /></fieldset>}
        {draft.fulfilment === 'pickup' && <div className="store-pickup"><strong>Ozkafe Experience Center</strong><p>{CAFE_INFO.address}</p><p>{CAFE_INFO.hours}</p><p className="store-small">Pickup readiness will be confirmed for live orders. No pickup slot is reserved in this preview.</p><a className="store-text-button" href={CAFE_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer">View directions</a></div>}
        {draft.fulfilment && <><label className="store-check"><input type="checkbox" checked={draft.separateBilling} onChange={event => edit('separateBilling', event.target.checked)} /><span>{draft.fulfilment === 'delivery' ? 'Use a different billing address' : 'Add a billing address (optional)'}</span></label>
          {draft.separateBilling && <fieldset className="store-form-section"><legend>Billing address</legend><AddressFields prefix="billing" value={draft.billing} update={(key, value) => editAddress('billing', key, value)} errors={errors} /></fieldset>}
          <label className="store-field">Order notes (optional)<textarea name="notes" value={draft.notes} maxLength={500} onChange={event => edit('notes', event.target.value)} placeholder="Any delivery or pickup instructions" /></label></>}
      </>}
      {step === 2 && <>
        <section className="store-review-section"><div className="store-review-title"><h3>Contact</h3><button type="button" className="store-text-button" onClick={() => goStep(0)}>Edit contact</button></div><p>{draft.name}</p><p>{draft.email}</p><p>+91 {draft.phone}</p></section>
        <section className="store-review-section"><div className="store-review-title"><h3>{draft.fulfilment === 'pickup' ? 'Café pickup' : 'Delivery address'}</h3><button type="button" className="store-text-button" onClick={() => goStep(1)}>Edit delivery</button></div>{draft.fulfilment === 'pickup' ? <><p>{CAFE_INFO.address}</p><p>{CAFE_INFO.hours}</p></> : <AddressText address={draft.shipping} />}</section>
        <section className="store-review-section"><h3>Billing address</h3>{draft.separateBilling ? <AddressText address={draft.billing} /> : <p>{draft.fulfilment === 'delivery' ? 'Same as delivery address' : 'Not provided for café pickup'}</p>}</section>
        {draft.notes.trim() && <section className="store-review-section"><h3>Order notes</h3><p>{draft.notes}</p></section>}
        <fieldset className="store-form-section"><legend>Payment method *</legend><label className="store-choice"><input id="payment" type="radio" name="payment" checked={draft.payment === 'online'} onChange={() => edit('payment', 'online')} aria-describedby={errors.payment ? 'payment-error' : undefined} /><div><CreditCard size={24} /><strong>Pay online with Razorpay</strong><span>Online payment preview</span><span>Payment will be available when checkout goes live. No card, UPI, OTP or bank details are needed here.</span></div></label>{errors.payment && <p className="store-error" id="payment-error">{errors.payment}</p>}</fieldset>
        <label className="store-check"><input id="acknowledged" type="checkbox" checked={draft.acknowledged} onChange={event => edit('acknowledged', event.target.checked)} aria-describedby={errors.acknowledged ? 'acknowledged-error' : undefined} /><span>I understand this creates a demo order only. Nothing will be charged, delivered or prepared for pickup.</span></label>{errors.acknowledged && <p className="store-error" id="acknowledged-error">{errors.acknowledged}</p>}
      </>}
      <div className="store-form-actions">{step > 0 ? <button className="btn btn-secondary" type="button" onClick={() => goStep(step - 1)}>Back</button> : <ShopLink navigate={navigate} page="cart" className="store-text-button">Back to cart</ShopLink>}<button type="submit" className="btn btn-primary">{step === 0 ? 'Continue to delivery' : step === 1 ? 'Review order' : 'Create demo order'}</button></div>
    </form><OrderSummary cart={cart} showItems fulfilment={draft.fulfilment}><ShopLink navigate={navigate} page="cart" className="store-text-button">Edit items in cart</ShopLink></OrderSummary></div>
  </div>;
}
