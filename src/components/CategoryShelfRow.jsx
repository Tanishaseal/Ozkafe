import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export default function CategoryShelfRow({ category, coffees, selectedSizes, onSizeChange }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
          const sizeKeys = Object.keys(coffee.prices);
          const defaultSize = sizeKeys.includes('250g') 
            ? '250g' 
            : sizeKeys.includes('100g') 
              ? '100g' 
              : sizeKeys.includes('500 ml') 
                ? '500 ml' 
                : sizeKeys[0];
          const currentSize = selectedSizes[coffee.id] || defaultSize;
          const price = coffee.prices[currentSize];

          return (
            <article key={coffee.id} className="shelf-coffee-card">
              <div className="shelf-card-media">
                <img 
                  src="/images/coffee_packet.png" 
                  alt={coffee.name} 
                  className="shelf-packet-img" 
                  loading="lazy" 
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

                {/* Size Selector */}
                <div className="shelf-size-selector" role="group" aria-label={`Select size for ${coffee.name}`}>
                  {sizeKeys.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`shelf-size-btn ${currentSize === size ? 'active' : ''}`}
                      onClick={() => onSizeChange(coffee.id, size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Price Section with Excl. 5% GST explicitly shown */}
                <div className="shelf-card-price-row">
                  <div className="shelf-price-wrap">
                    <span className="shelf-price-val">₹{price}</span>
                    <span className="shelf-price-tag">Excl. 5% GST</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

