import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';
import { cartTotals, money } from '../data/commerce';
import { EmptyState, OrderSummary, ShopLink } from '../components/CommerceUI';
import { AddressText } from './Checkout';

export function OrderConfirmation({ order, navigate }) {
  if (!order) return <div className="store-page container store-content"><EmptyState title="No test receipt to show" navigate={navigate}>This receipt view is available during the current visit. If payment was interrupted, return to checkout to check its status. Test orders remain in the store’s Razorpay dashboard.</EmptyState></div>;
  const { details } = order;
  return <div className="store-page container store-content"><div className="store-confirm-hero"><CheckCircle2 size={50} aria-hidden="true" /><span className="store-eyebrow">TEST PAYMENT VERIFIED</span><h1>Your test payment is confirmed.</h1><p>Razorpay has confirmed this test payment. No real money was charged; no coffee will be shipped or prepared.</p></div>
    <div className="store-checkout-layout"><section className="store-panel store-form-panel"><span className="store-status">Test payment · Verified</span><h2 style={{ marginTop: '1rem' }}>Reference {order.id}</h2>
      <div className="store-review-section"><h3>Contact</h3><p>{details.name}</p><p>{details.email}</p><p>+91 {details.phone}</p></div>
      <div className="store-review-section"><h3>{details.fulfilment === 'pickup' ? 'Café pickup' : 'Delivery address'}</h3>{details.fulfilment === 'pickup' ? <><p>{CAFE_INFO.address}</p><p>{CAFE_INFO.hours}</p></> : <AddressText address={details.shipping} />}</div>
      <div className="store-review-section"><h3>Billing address</h3>{details.separateBilling ? <AddressText address={details.billing} /> : <p>{details.fulfilment === 'delivery' ? 'Same as delivery address' : 'Not provided for café pickup'}</p>}</div>
      <div className="store-review-section"><h3>Payment</h3><p>Razorpay · Test payment captured</p><p>Payment reference: {order.paymentId}</p></div>
      {details.notes.trim() && <div className="store-review-section"><h3>Order notes</h3><p>{details.notes}</p></div>}
      <div className="store-form-actions"><ShopLink navigate={navigate} page="orders" className="btn btn-secondary">View test orders</ShopLink><ShopLink navigate={navigate} className="btn btn-primary">Continue shopping</ShopLink></div>
    </section><OrderSummary cart={order.items} showItems fulfilment={details.fulfilment} confirmedTotals={order.totals} /></div>
  </div>;
}

export default function Orders({ orders, navigate, clearOrders }) {
  return <div className="store-page container store-content"><div className="store-page-heading"><div><span className="store-eyebrow">YOUR OZKAFE VISIT</span><h1>Test orders</h1><p>Review verified test payments from this visit.</p></div></div>
    <div className="store-banner"><Info size={20} /><p>This list is cleared when you refresh. The store can find your order details in Razorpay using the order reference. Test purchases do not trigger delivery, pickup, tracking or email confirmations.</p></div>
    {!orders.length ? <EmptyState title="No test orders yet" navigate={navigate}>Choose a coffee and complete a Razorpay test payment to see it here.</EmptyState> : <><div className="store-order-list">{orders.map(order => <article key={order.id} className="store-panel store-order-card"><div><span className="store-status">Test payment · Verified</span><h2>{order.id}</h2><p>{order.details.fulfilment === 'pickup' ? 'Café pickup' : 'Home delivery'} · {cartTotals(order.items).count} items</p><p>{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div><div><strong>{money(order.totals.total)}</strong><p>{order.details.fulfilment === 'delivery' ? 'Includes delivery and 5% GST' : 'Includes GST'}</p></div><ShopLink navigate={navigate} page="confirmation" params={{ id: order.id }} className="btn btn-secondary">View receipt</ShopLink></article>)}</div><button onClick={clearOrders} className="store-text-button">Clear this visit’s order list</button></>}
  </div>;
}
