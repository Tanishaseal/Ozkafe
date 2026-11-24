import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { GRIND_SIZE_OPTIONS, getProductBackImage } from '../data/coffeeBeansData';
import { collectionPage, defaultSize, money, productById, supportsGrind } from '../data/commerce';
import { EmptyState, ProductImage, Quantity, ShopLink } from '../components/CommerceUI';

export default function Product({ productId, navigate, onAddToCart }) {
  const product = productById(productId);
  const [size, setSize] = useState(product ? defaultSize(product) : '');
  const [grind, setGrind] = useState('Whole Beans');
  const [quantity, setQuantity] = useState(1);
  const [back, setBack] = useState(false);
  const [added, setAdded] = useState(false);
  if (!product) return <div className="container store-page store-content"><EmptyState title="Coffee not found" navigate={navigate}>This product link is unavailable. Browse the shop to find your coffee.</EmptyState></div>;
  const add = (event, buyNow = false) => {
    onAddToCart(product, event, { selectedSize: size, selectedGrind: supportsGrind(product) ? grind : '', quantity });
    setAdded(true);
    if (buyNow) navigate('checkout');
  };
  return <div className="store-page container store-content">
    <nav className="store-breadcrumb" aria-label="Breadcrumb"><ShopLink navigate={navigate}>Coffee Beans</ShopLink><span>/</span><ShopLink navigate={navigate} page={collectionPage(product)}>{product.category}</ShopLink><span>/</span><span aria-current="page">{product.name}</span></nav>
    <div className="store-product-layout"><div className="store-gallery"><div className={`store-product-photo ${back ? 'is-back' : ''}`}><ProductImage src={back ? getProductBackImage(product) : product.image} alt={`${product.name} ${back ? 'back label' : 'packaging'}`} /></div><div className="store-gallery-tabs"><button onClick={() => setBack(false)} aria-pressed={!back}>Packaging</button><button onClick={() => setBack(true)} aria-pressed={back}>Back label</button></div></div>
      <section className="store-product-info"><span className="store-eyebrow">{product.category}</span><h1>{product.name}</h1>{product.detail && <p>{product.detail}</p>}<div className="store-product-price">{money(product.prices[size])}<span>Excl. 5% GST · {size}</span></div>
        <fieldset className="store-options"><legend>Pack size <span>Choose your size</span></legend><div>{Object.entries(product.prices).map(([key, price]) => <label key={key} className={size === key ? 'is-selected' : ''}><input type="radio" name="size" value={key} checked={size === key} onChange={() => { setSize(key); setAdded(false); }} /><strong>{key}</strong><span>{money(price)}</span></label>)}</div></fieldset>
        {supportsGrind(product) && <fieldset className="store-options"><legend>Grind <span>Match your brewing method</span></legend><div>{GRIND_SIZE_OPTIONS.map(option => <label key={option} className={grind === option ? 'is-selected' : ''}><input type="radio" name="grind" checked={grind === option} onChange={() => { setGrind(option); setAdded(false); }} />{option}</label>)}</div></fieldset>}
        <div className="store-product-quantity"><span>Quantity</span><Quantity value={quantity} onChange={value => { setQuantity(value); setAdded(false); }} name={product.name} /><strong>{money(product.prices[size] * quantity)}</strong></div>
        <div className="store-buy-actions"><button className="btn btn-primary" onClick={event => add(event)}><ShoppingBag size={18} />{added ? 'Add another' : 'Add to cart'}</button><button className="btn btn-secondary" onClick={event => add(event, true)}>Buy now</button></div>
        {added && <p className="store-added" role="status">Added to your cart. <ShopLink navigate={navigate} page="cart">View cart</ShopLink></p>}
        <div className="store-product-note"><strong>A little closer to your next cup.</strong><p>Review your coffee and quantities in the cart, then enter your contact and delivery details at checkout.</p><p className="store-small">Ordering preview: payments and live order processing are not available yet.</p></div>
      </section></div>
  </div>;
}
