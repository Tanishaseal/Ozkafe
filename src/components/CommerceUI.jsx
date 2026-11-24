import React from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { cartTotals, itemDeliveryPaise, money, DELIVERY_RATE_PER_KG } from '../data/commerce';

export function ShopLink({ navigate, page = 'coffee-beans', params, children, ...props }) {
  const href = `/${page}${params ? `?${new URLSearchParams(params)}` : ''}`;
  return <a href={href} {...props} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); navigate(page, params);
  }}>{children}</a>;
}

export function ProductImage({ src, alt, ...props }) {
  return <img src={src || '/images/coffee_packet.png'} alt={alt} {...props} onError={event => {
    if (!event.currentTarget.src.endsWith('/images/coffee_packet.png')) event.currentTarget.src = '/images/coffee_packet.png';
  }} />;
}

export function Quantity({ value, onChange, name }) {
  return <div className="store-quantity" role="group" aria-label={`Quantity for ${name}`}>
    <button type="button" disabled={value <= 1} aria-label={`Decrease quantity for ${name}`} onClick={() => onChange(value - 1)}><Minus size={16} /></button>
    <output aria-live="polite">{value}</output>
    <button type="button" aria-label={`Increase quantity for ${name}`} onClick={() => onChange(value + 1)}><Plus size={16} /></button>
  </div>;
}

export function OrderSummary({ cart, children, showItems = false, fulfilment = '', confirmedTotals }) {
  const totals = confirmedTotals || cartTotals(cart, fulfilment);
  return <aside className="store-summary store-panel" aria-label="Order summary">
    <h2>Order summary <span>({totals.count})</span></h2>
    {showItems && <ul className="store-summary-items">{cart.map(item => <li key={item.id}>
      <ProductImage src={item.image} alt="" />
      <div><strong>{item.name}</strong><span>{item.selectedSize}{item.selectedGrind && ` · ${item.selectedGrind}`} · Qty {item.quantity}</span>{fulfilment !== 'pickup' && <span>Delivery for these items: {money(itemDeliveryPaise(item) / 100)}</span>}</div>
      <strong>{money(item.prices[item.selectedSize] * item.quantity)}</strong>
    </li>)}</ul>}
    <dl className="store-totals">
      <div><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
      <div><dt>{fulfilment === 'pickup' ? 'Delivery' : `Delivery (₹${DELIVERY_RATE_PER_KG}/kg)`}</dt><dd>{fulfilment === 'pickup' ? 'Not applicable (pickup)' : money(totals.delivery)}</dd></div>
      {fulfilment !== 'pickup' && <div><dt>Total billed weight</dt><dd>{totals.weightGrams / 1000} kg</dd></div>}
      <div><dt>GST (5% on full bill)</dt><dd>{money(totals.tax)}</dd></div>
      <div className="store-total"><dt>{fulfilment ? 'Total' : 'Estimated total'}</dt><dd>{money(totals.total)}</dd></div>
    </dl>
    <p className="store-muted store-small">{fulfilment === 'pickup' ? 'Includes 5% GST. No delivery charge for café pickup.' : `Delivery is ₹${DELIVERY_RATE_PER_KG}/kg per item, multiplied by quantity. GST is 5% on products plus delivery.`}</p>
    {fulfilment !== 'pickup' && cart.some(item => /ml$/i.test(item.selectedSize)) && <p className="store-muted store-small">Cold brew delivery weight: 1ml = 1g.</p>}
    {!fulfilment && <p className="store-muted store-small">Home-delivery estimate. Choose delivery or café pickup at checkout.</p>}
    {children}
  </aside>;
}

export function EmptyState({ title, children, navigate }) {
  return <div className="store-empty store-panel"><ShoppingBag size={42} aria-hidden="true" /><h2>{title}</h2><p>{children}</p><ShopLink navigate={navigate} className="btn btn-primary">Explore coffees</ShopLink></div>;
}
