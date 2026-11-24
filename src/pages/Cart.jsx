import React from 'react';
import { Trash2 } from 'lucide-react';
import { GRIND_SIZE_OPTIONS } from '../data/coffeeBeansData';
import { cartTotals, money, supportsGrind } from '../data/commerce';
import { EmptyState, OrderSummary, ProductImage, Quantity, ShopLink } from '../components/CommerceUI';

export default function Cart({ cart, updateCartItem, removeFromCart, clearCart, setCurrentPage: navigate }) {
  const { count } = cartTotals(cart);
  return <div className="store-page container store-content">
    <nav className="store-breadcrumb" aria-label="Breadcrumb"><ShopLink navigate={navigate}>Coffee Beans</ShopLink><span>/</span><span aria-current="page">Cart</span></nav>
    <div className="store-page-heading"><div><span className="store-eyebrow">YOUR COFFEE, YOUR WAY</span><h1>Your cart <span>({count})</span></h1><p>One step closer to a great cup. Check your selections below.</p></div>{cart.length > 0 && <button className="store-text-button" onClick={clearCart}><Trash2 size={16} />Clear cart</button>}</div>
    {!cart.length ? <EmptyState title="Your next cup is waiting" navigate={navigate}>Your cart is empty. Explore our coffees and choose a favourite.</EmptyState> : <div className="store-checkout-layout">
      <section className="store-cart-items" aria-label="Cart items">{cart.map(item => <article className="store-cart-item store-panel" key={item.id}>
        <ShopLink navigate={navigate} page="product" params={{ id: item.coffeeId }} className="store-cart-image"><ProductImage src={item.image} alt={item.name} /></ShopLink>
        <div className="store-cart-item-copy"><span className="store-eyebrow">{item.category}</span><h2><ShopLink navigate={navigate} page="product" params={{ id: item.coffeeId }}>{item.name}</ShopLink></h2>
          <div className="store-cart-selects"><label>Pack size<select value={item.selectedSize} onChange={event => updateCartItem(item.id, { selectedSize: event.target.value })}>{Object.entries(item.prices).map(([size, price]) => <option key={size} value={size}>{size} · {money(price)}</option>)}</select></label>
            {supportsGrind(item) && <label>Grind<select value={item.selectedGrind} onChange={event => updateCartItem(item.id, { selectedGrind: event.target.value })}>{GRIND_SIZE_OPTIONS.map(grind => <option key={grind}>{grind}</option>)}</select></label>}
          </div><div className="store-cart-bottom"><Quantity value={item.quantity} onChange={quantity => updateCartItem(item.id, { quantity })} name={item.name} /><button className="store-text-button" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16} />Remove</button><div><strong>{money(item.prices[item.selectedSize] * item.quantity)}</strong><span className="store-small store-muted">Excl. 5% GST</span></div></div>
        </div>
      </article>)}<ShopLink navigate={navigate} className="store-text-button">Continue shopping</ShopLink></section>
      <OrderSummary cart={cart}><ShopLink navigate={navigate} page="checkout" className="btn btn-primary store-wide">Proceed to checkout</ShopLink><p className="store-summary-note">Enter your details, review your order and preview checkout.</p></OrderSummary>
    </div>}
  </div>;
}
