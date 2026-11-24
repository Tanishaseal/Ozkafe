import React from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { cartTotals, money } from '../data/commerce';

export function ShopLink({ navigate, page = 'shop', params, children, ...props }) {
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

export function OrderSummary({ cart, children, showItems = false, fulfilment = '' }) {
  const totals = cartTotals(cart);
  return <aside className="store-summary store-panel" aria-label="Order summary">
    <h2>Order summary <span>({totals.count})</span></h2>
    {showItems && <ul className="store-summary-items">{cart.map(item => <li key={item.id}>
      <ProductImage src={item.image} alt="" />
      <div><strong>{item.name}</strong><span>{item.selectedSize}{item.selectedGrind && ` · ${item.selectedGrind}`} · Qty {item.quantity}</span></div>
      <strong>{money(item.prices[item.selectedSize] * item.quantity)}</strong>
    </li>)}</ul>}
    <dl className="store-totals">
      <div><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
      <div><dt>GST (5%)</dt><dd>{money(totals.tax)}</dd></div>
      <div><dt>Delivery</dt><dd>{fulfilment === 'pickup' ? 'Not applicable (pickup)' : 'To be confirmed'}</dd></div>
      <div className="store-total"><dt>{fulfilment === 'pickup' ? 'Total' : 'Items total'}</dt><dd>{money(totals.total)}</dd></div>
    </dl>
    <p className="store-muted store-small">{fulfilment === 'pickup' ? 'Includes GST. Collect your order at the café.' : 'Includes GST. Delivery charges are not included.'}</p>
    {children}
  </aside>;
}

export function EmptyState({ title, children, navigate }) {
  return <div className="store-empty store-panel"><ShoppingBag size={42} aria-hidden="true" /><h2>{title}</h2><p>{children}</p><ShopLink navigate={navigate} className="btn btn-primary">Explore the shop</ShopLink></div>;
}
