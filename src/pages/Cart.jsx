import React, { useState } from 'react';
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, 
  ChevronLeft, ChevronRight, Phone, MessageSquare, Check, RotateCcw
} from 'lucide-react';
import { GRIND_SIZE_OPTIONS, getProductBackImage } from '../data/coffeeBeansData';
import { CAFE_INFO } from '../data/cafeData';
import './Cart.css';

// Single Cart Item Component with dedicated Front / Back Slider & Options
function CartItemCard({ item, onUpdate, onRemove }) {
  const [activeSlide, setActiveSlide] = useState(0); // 0: Front, 1: Back

  if (!item || typeof item !== 'object') return null;

  const frontImg = item.image || '/images/coffee_packet.png';
  const backImg = item.backImage || getProductBackImage(item);

  const prices = (item.prices && typeof item.prices === 'object') ? item.prices : {};
  const sizeKeys = Object.keys(prices);
  const currentSize = item.selectedSize || (sizeKeys.includes('250g') ? '250g' : sizeKeys[0] || 'Standard');
  const currentGrind = item.selectedGrind || 'Whole Beans';
  const unitPrice = typeof prices[currentSize] === 'number' 
    ? prices[currentSize] 
    : (typeof Object.values(prices)[0] === 'number' ? Object.values(prices)[0] : 0);
  const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
  const itemTotal = unitPrice * qty;

  const slides = [
    { label: 'Front Side', src: frontImg, alt: `${item.name || 'Coffee'} Front Packaging` },
    { label: 'Back Side', src: backImg, alt: `${item.name || 'Coffee'} Official Back Label` }
  ];

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === 1 ? 0 : 1));
  };

  return (
    <article className="cart-item-card">
      {/* LEFT SIDE: Picture Slider (Front & Back) */}
      <div className="cart-item-slider-col">
        <div className="cart-slider-frame">
          <div className="cart-slider-badge">
            <span className="cart-badge-indicator" />
            <span>{slides[activeSlide].label}</span>
          </div>

          <div className="cart-slider-track">
            <img 
              src={slides[activeSlide].src}
              alt={slides[activeSlide].alt}
              className="cart-slider-img"
              loading="lazy"
              onError={(e) => {
                const currentSrc = e.currentTarget.getAttribute('src') || '';
                if (activeSlide === 0) {
                  if (currentSrc.endsWith('.webp')) {
                    e.currentTarget.src = currentSrc.replace('.webp', '.png');
                  } else if (!currentSrc.includes('coffee_packet.png')) {
                    e.currentTarget.src = '/images/coffee_packet.png';
                  }
                } else {
                  e.currentTarget.src = '/images/packaging_back/3.png';
                }
              }}
            />
          </div>

          {/* Slider Prev / Next Controls */}
          <button 
            type="button" 
            className="cart-slider-arrow prev"
            onClick={handlePrevSlide}
            aria-label={`View ${activeSlide === 0 ? 'Back' : 'Front'} side`}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button 
            type="button" 
            className="cart-slider-arrow next"
            onClick={handleNextSlide}
            aria-label={`View ${activeSlide === 1 ? 'Front' : 'Back'} side`}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>

          {/* Quick Toggle Tabs */}
          <div className="cart-slider-tabs" role="tablist" aria-label="Packaging views">
            <button
              type="button"
              role="tab"
              aria-selected={activeSlide === 0}
              className={`cart-slider-tab ${activeSlide === 0 ? 'active' : ''}`}
              onClick={() => setActiveSlide(0)}
            >
              Front
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSlide === 1}
              className={`cart-slider-tab ${activeSlide === 1 ? 'active' : ''}`}
              onClick={() => setActiveSlide(1)}
            >
              Back
            </button>
          </div>
        </div>

        {/* Slide dots */}
        <div className="cart-slider-dots">
          <button
            type="button"
            className={`cart-slider-dot ${activeSlide === 0 ? 'active' : ''}`}
            onClick={() => setActiveSlide(0)}
            aria-label="Slide 1: Front side"
          />
          <button
            type="button"
            className={`cart-slider-dot ${activeSlide === 1 ? 'active' : ''}`}
            onClick={() => setActiveSlide(1)}
            aria-label="Slide 2: Back side"
          />
        </div>
      </div>

      {/* RIGHT SIDE: Item Options (Quantity, Grams, Grind Size) */}
      <div className="cart-item-options-col">
        {/* Header */}
        <div className="cart-item-header">
          <div className="cart-item-info">
            <span className="cart-item-cat">{item.category}</span>
            <h3 className="cart-item-name">{item.name}</h3>
            {item.detail && <p className="cart-item-detail">{item.detail}</p>}
          </div>

          <button
            type="button"
            className="cart-item-remove-btn"
            onClick={() => onRemove(item.id)}
            title="Remove item from cart"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={16} aria-hidden="true" />
            <span>Remove</span>
          </button>
        </div>

        {/* Option 2: Grams of the product (Sourced directly from per-menu prices) */}
        <div className="cart-option-group">
          <div className="cart-option-label-row">
            <span className="cart-option-label">Grams / Size</span>
            <span className="cart-option-hint">Selected: <strong>{currentSize}</strong></span>
          </div>

          <div className="cart-size-pills-row" role="radiogroup" aria-label={`Select grams for ${item.name}`}>
            {sizeKeys.map((size) => {
              const isSelected = currentSize === size;
              const sizePrice = prices[size] || 0;
              return (
                <button
                  key={size}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`cart-size-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => onUpdate(item.id, { selectedSize: size })}
                >
                  <span className="cart-pill-gram">{size}</span>
                  <span className="cart-pill-price">₹{sizePrice}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Option 3: Grind size options */}
        <div className="cart-option-group">
          <div className="cart-option-label-row">
            <span className="cart-option-label">Grind Size</span>
            <span className="cart-option-hint">Selected: <strong>{currentGrind}</strong></span>
          </div>

          <div className="cart-grind-pills-row" role="radiogroup" aria-label={`Select grind size for ${item.name}`}>
            {GRIND_SIZE_OPTIONS.map((grind) => {
              const isSelected = currentGrind === grind;
              return (
                <button
                  key={grind}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`cart-grind-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => onUpdate(item.id, { selectedGrind: grind })}
                >
                  {isSelected && <Check size={12} className="cart-grind-check" aria-hidden="true" />}
                  <span>{grind}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Option 1: Quantity and Item Price Footer */}
        <div className="cart-item-footer">
          <div className="cart-qty-block">
            <span className="cart-option-label">Quantity</span>
            <div className="cart-qty-stepper" role="group" aria-label="Item quantity">
              <button
                type="button"
                className="cart-qty-btn"
                onClick={() => {
                  if (item.quantity > 1) {
                    onUpdate(item.id, { quantity: item.quantity - 1 });
                  } else {
                    onRemove(item.id);
                  }
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={14} aria-hidden="true" />
              </button>
              <span className="cart-qty-display" aria-live="polite">
                {item.quantity}
              </span>
              <button
                type="button"
                className="cart-qty-btn"
                onClick={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
                aria-label="Increase quantity"
              >
                <Plus size={14} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="cart-item-price-block">
            <div className="cart-unit-price-sub">
              ₹{unitPrice} / {currentSize} <span className="cart-price-tax-note">(Excl. 5% GST)</span>
            </div>
            <div className="cart-total-price-main">
              <span className="cart-total-label">Subtotal:</span>
              <span className="cart-total-amount">₹{itemTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CartInner({
  cart = [],
  updateCartItem,
  removeFromCart,
  clearCart,
  setCurrentPage
}) {
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const safeCart = Array.isArray(cart) ? cart.filter(item => item && typeof item === 'object' && item.id) : [];

  const totalItemsCount = safeCart.reduce((acc, item) => acc + (typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1), 0);

  // Subtotal calculation (Excl. 5% GST)
  const subtotal = safeCart.reduce((acc, item) => {
    const prices = (item.prices && typeof item.prices === 'object') ? item.prices : {};
    const sizeKeys = Object.keys(prices);
    const currentSize = item.selectedSize || (sizeKeys.includes('250g') ? '250g' : sizeKeys[0] || 'Standard');
    const unitPrice = typeof prices[currentSize] === 'number' 
      ? prices[currentSize] 
      : (typeof Object.values(prices)[0] === 'number' ? Object.values(prices)[0] : 0);
    const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
    return acc + unitPrice * qty;
  }, 0);

  // 5% GST as per official Roastery catalog
  const gstAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal + gstAmount) * 100) / 100;

  // Generate WhatsApp Order Message
  const generateWhatsAppMessage = () => {
    const lines = [
      `*New Coffee Order from Ozkafe Website*`,
      `---------------------------------`
    ];

    safeCart.forEach((item, idx) => {
      const prices = (item.prices && typeof item.prices === 'object') ? item.prices : {};
      const sizeKeys = Object.keys(prices);
      const currentSize = item.selectedSize || (sizeKeys.includes('250g') ? '250g' : sizeKeys[0] || 'Standard');
      const currentGrind = item.selectedGrind || 'Whole Beans';
      const unitPrice = typeof prices[currentSize] === 'number' 
        ? prices[currentSize] 
        : (typeof Object.values(prices)[0] === 'number' ? Object.values(prices)[0] : 0);
      const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
      const total = unitPrice * qty;

      lines.push(`${idx + 1}. *${item.name || 'Coffee'}*`);
      lines.push(`   • Grams/Size: ${currentSize}`);
      lines.push(`   • Grind: ${currentGrind}`);
      lines.push(`   • Quantity: ${qty}`);
      lines.push(`   • Price: ₹${total} (₹${unitPrice} each)`);
    });

    lines.push(`---------------------------------`);
    lines.push(`Subtotal (Excl. 5% GST): ₹${subtotal}`);
    lines.push(`GST (5%): ₹${gstAmount}`);
    lines.push(`*Grand Total: ₹${grandTotal}*`);
    lines.push(``);
    lines.push(`Please confirm roastery order and delivery/pickup schedule.`);

    return encodeURIComponent(lines.join('\n'));
  };

  const whatsappUrl = `https://wa.me/917605023132?text=${generateWhatsAppMessage()}`;

  return (
    <div className="cart-page animate-fade-in">
      {/* 1. Header Section with Dark Photographic Coffee Hero Background */}
      <header className="cart-header-section page-header-hero">
        <div className="page-header-bg" aria-hidden="true">
          <img 
            src="/images/headers/header_bg_beans.webp" 
            alt="" 
            className="page-header-bg-img"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            onError={(e) => { e.currentTarget.src = '/images/headers/header_bg_beans.jpg'; }}
          />
        </div>
        <div className="page-header-overlay" />

        {/* Decorative Botanical Illustrations */}
        <img 
          src="/images/illustrations/coffee_botanical_branch_light.webp" 
          alt="" 
          className="art-watermark-dark cart-header-leaf-decor" 
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width="240"
          height="321"
          onError={(e) => { e.currentTarget.src = '/images/illustrations/coffee_botanical_branch_light.png'; }}
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch_light.webp" 
          alt="" 
          className="art-watermark-dark cart-header-beans-decor" 
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width="220"
          height="139"
          onError={(e) => { e.currentTarget.src = '/images/illustrations/coffee_beans_sketch_light.png'; }}
          aria-hidden="true"
        />

        <div className="container page-header-content">
          <h1>Your Cart</h1>
          {/* Breadcrumb Trail */}
          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigateTo('home')} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-sep">&gt;</span>
            <button onClick={() => navigateTo('coffee-beans')} className="breadcrumb-link">Coffee Beans</button>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">Cart</span>
          </nav>
        </div>
      </header>

      {/* Main Cart Body */}
      <main className="cart-main-section">
        <div className="container">
          {safeCart.length === 0 ? (
            /* Empty Cart State */
            <div className="cart-empty-state">
              <div className="cart-empty-icon-wrap">
                <ShoppingCart size={48} className="cart-empty-icon" aria-hidden="true" />
              </div>
              <h2 className="cart-empty-title">Your Cart is Empty</h2>
              <p className="cart-empty-desc">
                Discover our artisanal micro-batch coffees, single-estate harvests, and specialty roastery blends.
              </p>
              <div className="cart-empty-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => navigateTo('coffee-beans')}
                >
                  <span>Explore Coffee Beans</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => navigateTo('commercial')}
                >
                  <span>Commercial Blends</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Cart Items & Summary */
            <div className="cart-content-grid">
              {/* Left Column: Cart Items List */}
              <div className="cart-items-column">
                <div className="cart-items-header">
                  <h2 className="cart-items-title">
                    Cart Items 
                    <span className="cart-items-count">({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})</span>
                  </h2>
                  <button
                    type="button"
                    className="cart-clear-all-btn"
                    onClick={clearCart}
                    aria-label="Clear all items in cart"
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="cart-items-list">
                  {safeCart.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onUpdate={updateCartItem}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Continue Shopping CTA */}
                <div className="cart-continue-wrap">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigateTo('coffee-beans')}
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                    <span>Continue Exploring Coffees</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Order Summary & Checkout */}
              <aside className="cart-summary-column" aria-label="Order summary">
                <div className="cart-summary-card">
                  <h3 className="cart-summary-title">Order Summary</h3>

                  <div className="cart-summary-rows">
                    <div className="summary-row">
                      <span className="summary-label">Items Count</span>
                      <span className="summary-val">{totalItemsCount}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Subtotal (Excl. GST)</span>
                      <span className="summary-val">₹{subtotal}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">
                        GST (5%)
                        <span className="summary-sublabel">Applicable roastery tax</span>
                      </span>
                      <span className="summary-val">₹{gstAmount}</span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-row total-row">
                      <span className="summary-total-label">Grand Total</span>
                      <span className="summary-total-val">₹{grandTotal}</span>
                    </div>
                    <div className="summary-tax-note">
                      * All prices aligned with official Ozkafe Coffee Pricing (01-09-2026).
                    </div>
                  </div>

                  {/* Checkout Actions */}
                  <div className="cart-checkout-actions">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-whatsapp-checkout"
                    >
                      <MessageSquare size={18} aria-hidden="true" />
                      <span>Order via WhatsApp</span>
                    </a>

                    <div className="checkout-alt-row">
                      <a 
                        href={`tel:${(CAFE_INFO.phone || '+917605023132').replace(/\s+/g, '')}`}
                        className="btn btn-secondary btn-call-order"
                      >
                        <Phone size={15} aria-hidden="true" />
                        <span>Call {CAFE_INFO.phone || '+91 7605 023 132'}</span>
                      </a>
                    </div>
                  </div>

                  {/* Roastery Experience Center Note */}
                  <div className="cart-experience-note">
                    <strong>Pickup / Experience Center:</strong>
                    <p>{CAFE_INFO.address || '30/4, Broad St, Ballygunge Park, Kolkata'} — {CAFE_INFO.hours || 'Open daily from 12:00 PM to 10:00 PM'}</p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

class CartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('CartErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="cart-page" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <div className="cart-empty-state">
            <h2>Shopping Cart</h2>
            <p>Your cart session has been safely refreshed.</p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => {
                try { localStorage.removeItem('ozkafe_cart'); } catch {}
                window.location.reload();
              }}
            >
              Reload Cart
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Cart(props) {
  return (
    <CartErrorBoundary>
      <CartInner {...props} />
    </CartErrorBoundary>
  );
}

