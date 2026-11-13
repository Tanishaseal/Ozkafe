import React, { useState, useMemo } from 'react';
import { 
  Coffee, Search, X, Phone, MapPin, Compass
} from 'lucide-react';
import { SINGLE_ORIGIN_CATEGORIES, SINGLE_ORIGIN_COFFEES } from '../data/coffeeBeansData';
import { CAFE_INFO } from '../data/cafeData';
import CategoryShelfRow from '../components/CategoryShelfRow';
import './CoffeeBeans.css';

export default function SingleOrigin({ setCurrentPage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeChange = (coffeeId, size) => {
    setSelectedSizes(prev => ({ ...prev, [coffeeId]: size }));
  };

  const filteredCoffeesByCategory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = {};

    SINGLE_ORIGIN_CATEGORIES.forEach(cat => {
      const list = SINGLE_ORIGIN_COFFEES.filter(coffee => {
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
      {/* 1. Header Section with Dark Photographic Coffee Beans Hero Background */}
      <header className="beans-header-section page-header-hero">
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
          <h1>Single Origin & Estate Microlots</h1>
          {/* Breadcrumb Trail */}
          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigateTo('home')} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">Single Origin</span>
          </nav>

          {/* Search Box */}
          <div className="beans-search-box">
            <Search size={18} className="beans-search-icon" aria-hidden="true" />
            <input 
              type="text"
              placeholder="Search 29 single origin coffees (e.g. Baarbara, Harley, Nandan, MNEB)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="beans-search-input"
              aria-label="Search single origin coffees"
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
          {/* 7 Quick Jump Category Pills */}
          <nav className="beans-category-quicknav" aria-label="Quick Jump to Estate Category">
            <div className="quicknav-outer-wrap">
              <img 
                src="/images/illustrations/coffee_beans_sketch.png" 
                alt="" 
                className="quicknav-beans-flank-left" 
                aria-hidden="true"
              />
              <div className="quicknav-scroll-track">
                {SINGLE_ORIGIN_CATEGORIES.map(cat => {
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

          {/* 7 Category Shelf Rows */}
          {totalFilteredCount > 0 ? (
            <div className="beans-shelf-rows-wrapper">
              {SINGLE_ORIGIN_CATEGORIES.map(cat => (
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
              <h3>No single origin coffees found matching "{searchQuery}"</h3>
              <p>Try searching by estate name (e.g., Baarbara, Harley, Nandan, Cauvery Peak).</p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setSearchQuery('')}
              >
                Clear Search & View All Single Origin Coffees
              </button>
            </div>
          )}

          {/* Custom Grinding & Brewing Guide Banner */}
          <div className="grind-guide-box">
            <div className="grind-guide-split">
              <div className="grind-guide-content">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#8E4E25', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  <Compass size={15} aria-hidden="true" />
                  <span>Precision Home Brewing</span>
                </div>
                <h3>Custom Grinding for Your Brew Method</h3>
                <p>
                  Every estate coffee can be ordered as <strong>Whole Beans</strong> to safeguard delicate aromatics, or freshly custom-ground to your equipment's micron specification at no extra charge:
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

          {/* Roastery Direct Inquiries & Shelf Banner */}
          <div className="beans-contact-banner" style={{ position: 'relative', overflow: 'hidden' }}>
            <img 
              src="/images/illustrations/coffee_botanical_branch_light.png" 
              alt="" 
              className="art-watermark-dark beans-banner-watermark" 
              aria-hidden="true"
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3>Taste These Estates at Our Ballygunge Cupping Bar</h3>
              <p>
                Visit our experience center at <strong>{CAFE_INFO.address}</strong> to cup individual estate harvests or pick up fresh weekly roasts directly from our shelf.
              </p>
            </div>
            <div className="beans-banner-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigateTo('contact')}
              >
                <MapPin size={16} aria-hidden="true" />
                <span>Visit Cupping Bar</span>
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
