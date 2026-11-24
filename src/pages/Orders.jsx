import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';
import { cartTotals, money } from '../data/commerce';
import { EmptyState, OrderSummary, ShopLink } from '../components/CommerceUI';
import { AddressText } from './Checkout';

export function OrderConfirmation({ order, navigate }) {
  if (!order) return <div className="store-page container store-content"><EmptyState title="No order preview to show" navigate={navigate}>Demo orders are only available until the page is refreshed. No real order has been placed.</EmptyState></div>;
  const { details } = order;
  return <div className="store-page container store-content"><div className="store-confirm-hero"><CheckCircle2 size={50} aria-hidden="true" /><span className="store-eyebrow">DEMO CHECKOUT COMPLETE</span><h1>Your order preview is ready.</h1><p>This is a demonstration, not a confirmed order. No payment has been taken and no coffee will be shipped or prepared.</p></div>
    <div className="store-checkout-layout"><section className="store-panel store-form-panel"><span className="store-status">Demo only · Unpaid</span><h2 style={{ marginTop: '1rem' }}>Reference {order.id}</h2>
      <div className="store-review-section"><h3>Contact</h3><p>{details.name}</p><p>{details.email}</p><p>+91 {details.phone}</p></div>
      <div className="store-review-section"><h3>{details.fulfilment === 'pickup' ? 'Café pickup' : 'Delivery address'}</h3>{details.fulfilment === 'pickup' ? <><p>{CAFE_INFO.address}</p><p>{CAFE_INFO.hours}</p></> : <AddressText address={details.shipping} />}</div>
      <div className="store-review-section"><h3>Billing address</h3>{details.separateBilling ? <AddressText address={details.billing} /> : <p>{details.fulfilment === 'delivery' ? 'Same as delivery address' : 'Not provided for café pickup'}</p>}</div>
      <div className="store-review-section"><h3>Payment</h3><p>Online payment · Preview only · No payment processed</p></div>
      {details.notes.trim() && <div className="store-review-section"><h3>Order notes</h3><p>{details.notes}</p></div>}
      <div className="store-form-actions"><ShopLink navigate={navigate} page="orders" className="btn btn-secondary">View demo orders</ShopLink><ShopLink navigate={navigate} className="btn btn-primary">Continue shopping</ShopLink></div>
    </section><OrderSummary cart={order.items} showItems fulfilment={details.fulfilment} /></div>
  </div>;
}

export default function Orders({ orders, navigate, clearOrders }) {
  return <div className="store-page container store-content"><div className="store-page-heading"><div><span className="store-eyebrow">YOUR OZKAFE VISIT</span><h1>Order previews</h1><p>Review the demo orders you created during this visit.</p></div></div>
    <div className="store-banner"><Info size={20} /><p>These are demo orders, not live purchases. They are kept in memory until you refresh this page. Live tracking and email confirmations are not enabled.</p></div>
    {!orders.length ? <EmptyState title="No order previews yet" navigate={navigate}>Choose a coffee and complete the demo checkout to see your order here.</EmptyState> : <><div className="store-order-list">{orders.map(order => <article key={order.id} className="store-panel store-order-card"><div><span className="store-status">Demo only · Unpaid</span><h2>{order.id}</h2><p>{order.details.fulfilment === 'pickup' ? 'Café pickup' : 'Home delivery'} · {cartTotals(order.items).count} items</p><p>{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div><div><strong>{money(cartTotals(order.items, order.details.fulfilment).total)}</strong><p>{order.details.fulfilment === 'delivery' ? 'Includes delivery and 5% GST' : 'Includes GST'}</p></div><ShopLink navigate={navigate} page="confirmation" params={{ id: order.id }} className="btn btn-secondary">View preview</ShopLink></article>)}</div><button onClick={clearOrders} className="store-text-button">Clear demo order history</button></>}
  </div>;
}
