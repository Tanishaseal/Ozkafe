import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Tag, ShoppingCart, Check } from 'lucide-react';

export default function CategoryShelfRow({ category, coffees, onAddToCart, onViewProduct }) {
  const scrollRef = useRef(null);
  const [recentlyAdded, setRecentlyAdded] = useState({});

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCartClick = (coffee, e) => {
    if (onViewProduct) { onViewProduct(coffee.id); return; }
    setRecentlyAdded((prev) => ({ ...prev, [coffee.id]: true }));
    setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [coffee.id]: false }));
    }, 1400);

    if (onAddToCart) {
      onAddToCart(coffee, e);
    }
  };

  if (!coffees || coffees.length === 0) return null;

  return (
    <section className="category-shelf-section" id={`cat-${category.id}`}>
      <div className="category-shelf-header">
        <div className="category-shelf-info">
          <div className="category-shelf-badge-row">
            <span className="category-shelf-badge">
              <Tag size={13} aria-hidden="true" />
              <span>{category.subtitle}</span>
            </span>
            <img 
              src="/images/illustrations/coffee_beans_sketch.webp" 
              alt="" 
              className="shelf-header-beans-decor" 
              onError={(e) => { e.currentTarget.src = '/images/illustrations/coffee_beans_sketch.png'; }}
              aria-hidden="true"
            />
          </div>
          <h2 className="category-shelf-title">
            {category.name}
            <span className="category-shelf-counter">{coffees.length} {coffees.length === 1 ? 'item' : 'items'}</span>
          </h2>
        </div>

        <div className="category-shelf-controls">
          <button 
            type="button" 
            className="shelf-nav-arrow" 
            onClick={() => handleScroll('left')}
            aria-label={`Scroll ${category.name} to the left`}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button 
            type="button" 
            className="shelf-nav-arrow" 
            onClick={() => handleScroll('right')}
            aria-label={`Scroll ${category.name} to the right`}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="category-shelf-track" ref={scrollRef}>
        {coffees.map((coffee) => {
          const pricesList = Object.values(coffee.prices || {});
          const startingPrice = pricesList.length > 0 ? Math.min(...pricesList) : 0;

          return (
            <article key={coffee.id} className="shelf-coffee-card">
              <div className="shelf-card-media">
                <img 
                  src={coffee.image || "/images/coffee_packet.png"} 
                  alt={coffee.name} 
                  className="shelf-packet-img" 
                  loading="lazy" 
                  onError={(e) => {
                    const currentSrc = e.currentTarget.getAttribute('src') || '';
                    if (currentSrc.endsWith('.webp')) {
                      e.currentTarget.src = currentSrc.replace('.webp', '.png');
                    } else if (!currentSrc.includes('coffee_packet.png')) {
                      e.currentTarget.src = '/images/coffee_packet.png';
                    }
                  }}
                />
              </div>

              <div className="shelf-card-content">
                <div className="shelf-card-header">
                  <span className="shelf-card-cat">{coffee.category}</span>
                  <h3 className="shelf-card-name">{coffee.name}</h3>
                  {coffee.detail && (
                    <div className="shelf-card-detail">{coffee.detail}</div>
                  )}
                </div>

                {/* Price Section with Excl. 5% GST and Add to Cart Button */}
                <div className="shelf-card-price-row">
                  <div className="shelf-price-wrap">
                    <span className="shelf-price-from">From</span>
                    <span className="shelf-price-val">₹{startingPrice}</span>
                    <span className="shelf-price-tag">Excl. 5% GST</span>
                  </div>
                  <button
                    type="button"
                    className={`shelf-add-cart-btn ${recentlyAdded[coffee.id] ? 'added' : ''}`}
                    onClick={(e) => handleAddToCartClick(coffee, e)}
                    aria-label={onViewProduct ? `Choose options for ${coffee.name}` : `Add ${coffee.name} to cart`}
                  >
                    {recentlyAdded[coffee.id] ? (
                      <>
                        <Check size={15} aria-hidden="true" />
                        <span>Added! ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={15} aria-hidden="true" />
                        <span>{onViewProduct ? 'Choose options' : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

