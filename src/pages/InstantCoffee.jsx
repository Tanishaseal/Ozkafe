import React, { useState, useMemo } from 'react';
import { 
  Coffee, Search, X, Phone, MapPin, Zap
} from 'lucide-react';
import { INSTANT_COFFEE_CATEGORIES, INSTANT_COFFEES } from '../data/coffeeBeansData';
import { CAFE_INFO } from '../data/cafeData';
import CategoryShelfRow from '../components/CategoryShelfRow';
import './CoffeeBeans.css';

export default function InstantCoffee({ setCurrentPage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeChange = (coffeeId, size) => {
    setSelectedSizes(prev => ({ ...prev, [coffeeId]: size }));
  };

  const filteredCoffeesByCategory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = {};

    INSTANT_COFFEE_CATEGORIES.forEach(cat => {
      const list = INSTANT_COFFEES.filter(coffee => {
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
    if (setCurrentPage) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="coffee-beans-page animate-fade-in">
      {/* 1. Header Section with Dark Tabletop Hero Background */}
      <header className="beans-header-section page-header-hero">
        <div className="page-header-bg" aria-hidden="true">
          <img 
            src="/images/headers/header_bg_faq.webp" 
            alt="" 
            className="page-header-bg-img"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            onError={(e) => { e.currentTarget.src = '/images/headers/header_bg_faq.jpg'; }}
          />
        </div>
        <div className="page-header-overlay" />

        {/* Decorative Botanical Illustrations */}
        <img 
          src="/images/illustrations/coffee_botanical_branch_light.webp" 
          alt="" 
          className="art-watermark-dark beans-header-leaf-decor" 
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
          className="art-watermark-dark beans-header-beans-decor" 
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width="220"
          height="139"
          onError={(e) => { e.currentTarget.src = '/images/illustrations/coffee_beans_sketch_light.png'; }}
          aria-hidden="true"
        />

        <div className="container page-header-content">
          <h1>Instant Coffee & Cold Brew</h1>
          {/* Breadcrumb Trail */}
          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigateTo('home')} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">Instant Coffee</span>
          </nav>

          {/* Search Box */}
          <div className="beans-search-box">
            <Search size={18} className="beans-search-icon" aria-hidden="true" />
            <input 
              type="text"
              placeholder="Search instant coffees & cold brew (e.g. Freeze Dried, Caramel, Hazelnut)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="beans-search-input"
              aria-label="Search instant coffee"
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
        {/* Subtle Background Watermarks */}
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

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* 3 Quick Jump Category Pills */}
          <nav className="beans-category-quicknav" aria-label="Quick Jump to Instant Coffee Category">
            <div className="quicknav-outer-wrap">
              <img 
                src="/images/illustrations/coffee_beans_sketch.png" 
                alt="" 
                className="quicknav-beans-flank-left" 
                aria-hidden="true"
              />
              <div className="quicknav-scroll-track">
                {INSTANT_COFFEE_CATEGORIES.map(cat => {
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

          {/* 3 Category Shelf Rows */}
          {totalFilteredCount > 0 ? (
            <div className="beans-shelf-rows-wrapper">
              {INSTANT_COFFEE_CATEGORIES.map(cat => (
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
              <h3>No instant coffees found matching "{searchQuery}"</h3>
              <p>Try searching for Freeze Dried, Agglomerated, Caramel, or Cold Brew.</p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setSearchQuery('')}
              >
                Clear Search & View All Instant Coffees
              </button>
            </div>
          )}

          {/* Quick Serving & Brewing Guide */}
          <div className="grind-guide-box">
            <div className="grind-guide-split">
              <div className="grind-guide-content">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#8E4E25', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  <Zap size={15} aria-hidden="true" />
                  <span>Instant Convenience • Barista Standards</span>
                </div>
                <h3>Serving Suggestions: Instant Crystals & Cold Brew 3x</h3>
                <p>
                  Crafted using 100% shade-grown Indian Arabicas and robustas through advanced low-temperature freeze drying, ensuring the natural aromatic volatile oils stay preserved:
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
                  <span className="grind-method-pill">Freeze Dried: 1-2 tsp in Hot Water / Milk</span>
                  <span className="grind-method-pill">Flavoured Instant: Dessert Lattes & Frappes</span>
                  <span className="grind-method-pill">Cold Brew 3x: 1 Part Concentrate + 2 Parts Water/Milk</span>
                  <span className="grind-method-pill">100% Arabica & Chicory Blends Available</span>
                </div>
              </div>
              <div className="grind-guide-illustration">
                <img 
                  src="/images/illustrations/coffee_pourover_sketch.png" 
                  alt="Instant coffee serving illustration" 
                  className="grind-pourover-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Roastery Direct Inquiries & Orders Banner */}
          <div className="beans-contact-banner" style={{ position: 'relative', overflow: 'hidden' }}>
            <img 
              src="/images/illustrations/coffee_botanical_branch_light.png" 
              alt="" 
              className="art-watermark-dark beans-banner-watermark" 
              aria-hidden="true"
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3>Instant Coffee Inquiries, Wholesale & Retail Orders</h3>
              <p>
                Available for pickup at our Ballygunge cafe or shipped anywhere in India. Reach out to our team at <strong>{CAFE_INFO.address}</strong>.
              </p>
            </div>
            <div className="beans-banner-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigateTo('contact')}
              >
                <MapPin size={16} aria-hidden="true" />
                <span>Visit Ballygunge Cafe</span>
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
