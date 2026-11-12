import React, { useState, useMemo, useRef } from 'react';
import { 
  Coffee, Search, X, ChevronLeft, ChevronRight, Phone, MapPin, Tag
} from 'lucide-react';
import { COFFEE_CATEGORIES, COFFEE_BEANS_DATA } from '../data/coffeeBeansData';
import { CAFE_INFO } from '../data/cafeData';
import './CoffeeBeans.css';

function CategoryShelfRow({ category, coffees, selectedSizes, onSizeChange }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (coffees.length === 0) return null;

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
              src="/images/illustrations/coffee_beans_sketch.png" 
              alt="" 
              className="shelf-header-beans-decor" 
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
          const defaultSize = sizeKeys.includes('250g') ? '250g' : sizeKeys.includes('500 ml') ? '500 ml' : sizeKeys[0];
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

export default function CoffeeBeans({ setCurrentPage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeChange = (coffeeId, size) => {
    setSelectedSizes(prev => ({ ...prev, [coffeeId]: size }));
  };

  const filteredCoffeesByCategory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = {};

    COFFEE_CATEGORIES.forEach(cat => {
      const list = COFFEE_BEANS_DATA.filter(coffee => {
        if (coffee.categoryId !== cat.id) return false;
        if (!query) return true;
        return (
          coffee.name.toLowerCase().includes(query) ||
          coffee.category.toLowerCase().includes(query) ||
          (coffee.detail && coffee.detail.toLowerCase().includes(query))
        );
      });
      result[cat.id] = list;
    });

    return result;
  }, [searchQuery]);

  const totalFilteredCount = useMemo(() => {
    return Object.values(filteredCoffeesByCategory).reduce((acc, curr) => acc + curr.length, 0);
  }, [filteredCoffeesByCategory]);

  const scrollToCategory = (catId) => {
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="coffee-beans-page animate-fade-in">
      {/* 1. Header Section with Dark Photographic Coffee Hero Background */}
      <header className="beans-header-section page-header-hero">
        <div 
          className="page-header-bg" 
          style={{ backgroundImage: "url('/images/headers/header_bg_beans.jpg')" }} 
        />
        <div className="page-header-overlay" />

        {/* Decorative Botanical Illustrations */}
        <img 
          src="/images/illustrations/coffee_botanical_branch_light.png" 
          alt="" 
          className="art-watermark-dark beans-header-leaf-decor" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch_light.png" 
          alt="" 
          className="art-watermark-dark beans-header-beans-decor" 
          aria-hidden="true"
        />

        <div className="container page-header-content">
          <h1>Coffee Beans</h1>
          {/* Breadcrumb Trail */}
          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigateTo('home')} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">Coffee Beans</span>
          </nav>

          {/* Search Box */}
          <div className="beans-search-box">
            <Search size={18} className="beans-search-icon" aria-hidden="true" />
            <input 
              type="text"
              placeholder="Search 60 coffees (e.g. Baarbara, Nandan, Espresso, Filter, Hazelnut)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="beans-search-input"
              aria-label="Search coffee beans"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="beans-search-clear" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Catalog Section */}
      <section className="section beans-catalog-section">
        {/* Subtle Animated Botanical & Bean Watermarks flanking the shelves */}
        <img 
          src="/images/illustrations/coffee_branch_leaves.png" 
          alt="" 
          className="art-watermark beans-shelf-watermark-left" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch.png" 
          alt="" 
          className="art-watermark beans-shelf-watermark-right" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_botanical_branch.png" 
          alt="" 
          className="art-watermark beans-shelf-watermark-mid-left" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_branch_leaves.png" 
          alt="" 
          className="art-watermark beans-shelf-watermark-lower-right" 
          aria-hidden="true"
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* 12 Quick Jump Category Pills with Artisanal Illustration Accents */}
          <nav className="beans-category-quicknav" aria-label="Quick Jump to Coffee Category">
            <div className="quicknav-outer-wrap">
              <img 
                src="/images/illustrations/coffee_beans_sketch.png" 
                alt="" 
                className="quicknav-beans-flank-left" 
                aria-hidden="true"
              />
              <div className="quicknav-scroll-track">
                {COFFEE_CATEGORIES.map(cat => {
                  const count = (filteredCoffeesByCategory[cat.id] || []).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className="quicknav-pill-btn"
                      onClick={() => scrollToCategory(cat.id)}
                    >
                      <span>{cat.name}</span>
                      <span className="quicknav-count">({count})</span>
                    </button>
                  );
                })}
              </div>
              <img 
                src="/images/illustrations/coffee_beans_sketch.png" 
                alt="" 
                className="quicknav-beans-flank-right" 
                aria-hidden="true"
              />
            </div>
          </nav>

          {/* 12 Category Shelf Rows */}
          {totalFilteredCount > 0 ? (
            <div className="beans-shelf-rows-wrapper">
              {COFFEE_CATEGORIES.map(cat => (
                <CategoryShelfRow
                  key={cat.id}
                  category={cat}
                  coffees={filteredCoffeesByCategory[cat.id] || []}
                  selectedSizes={selectedSizes}
                  onSizeChange={handleSizeChange}
                />
              ))}
            </div>
          ) : (
            <div className="beans-empty-state">
              <Coffee size={40} className="beans-empty-icon" aria-hidden="true" />
              <h3>No coffees found matching "{searchQuery}"</h3>
              <p>Try searching by coffee name, category, estate or process.</p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setSearchQuery('')}
              >
                Clear Search & View All 60 Coffees
              </button>
            </div>
          )}

          {/* Grinding & Brewing Guide Banner */}
          <div className="grind-guide-box">
            <div className="grind-guide-split">
              <div className="grind-guide-content">
                <h3>Custom Grinding for Your Home Brewer</h3>
                <p>
                  Every order can be shipped as <strong>Whole Beans</strong> to preserve fresh aromatics, or freshly custom-ground for your exact brewing equipment at no extra charge:
                </p>
                <div className="grind-guide-beans-accent">
                  <img 
                    src="/images/illustrations/coffee_beans_sketch.png" 
                    alt="" 
                    className="art-accent-inline" 
                    style={{ width: '130px', margin: '0.4rem 0 0.8rem' }} 
                    aria-hidden="true"
                  />
                </div>
                <div className="grind-methods-list">
                  <span className="grind-method-pill">Whole Beans</span>
                  <span className="grind-method-pill">French Press (Coarse)</span>
                  <span className="grind-method-pill">Pour-Over V60 (Medium-Fine)</span>
                  <span className="grind-method-pill">Aeropress (Medium)</span>
                  <span className="grind-method-pill">Moka Pot (Fine)</span>
                  <span className="grind-method-pill">South Indian Filter (Traditional)</span>
                  <span className="grind-method-pill">Espresso Machine (Ultra-Fine)</span>
                </div>
              </div>
              <div className="grind-guide-illustration">
                <img 
                  src="/images/illustrations/coffee_pourover_sketch.png" 
                  alt="Pour-over brewing illustration" 
                  className="grind-pourover-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Roastery Direct Inquiries & Wholesale Banner */}
          <div className="beans-contact-banner" style={{ position: 'relative', overflow: 'hidden' }}>
            <img 
              src="/images/illustrations/coffee_botanical_branch_light.png" 
              alt="" 
              className="art-watermark-dark beans-banner-watermark" 
              aria-hidden="true"
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3>Looking for Bulk Orders, Wholesale or Cupping Tours?</h3>
              <p>
                We roast fresh weekly at <strong>{CAFE_INFO.address}</strong>. Connect with our roasters for cafe supplies, custom blends, or retail subscriptions.
              </p>
            </div>
            <div className="beans-banner-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigateTo('contact')}
              >
                <MapPin size={16} aria-hidden="true" />
                <span>Visit Roastery Shelf</span>
              </button>
              <a 
                href={`tel:${CAFE_INFO.phone}`}
                className="btn btn-outline"
              >
                <Phone size={16} aria-hidden="true" />
                <span>Call {CAFE_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
