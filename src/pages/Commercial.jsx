import React, { useState, useMemo } from 'react';
import { 
  Coffee, Search, X, Phone, MapPin, Building2
} from 'lucide-react';
import { COMMERCIAL_CATEGORIES, COMMERCIAL_COFFEES } from '../data/coffeeBeansData';
import { CAFE_INFO } from '../data/cafeData';
import CategoryShelfRow from '../components/CategoryShelfRow';
import './CoffeeBeans.css';

export default function Commercial({ setCurrentPage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeChange = (coffeeId, size) => {
    setSelectedSizes(prev => ({ ...prev, [coffeeId]: size }));
  };

  const filteredCoffeesByCategory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = {};

    COMMERCIAL_CATEGORIES.forEach(cat => {
      const list = COMMERCIAL_COFFEES.filter(coffee => {
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
      {/* 1. Header Section with Dark Roastery Micro-Roast Background */}
      <header className="beans-header-section page-header-hero">
        <div className="page-header-bg" aria-hidden="true">
          <img 
            src="/images/headers/header_bg_about.webp" 
            alt="" 
            className="page-header-bg-img"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            onError={(e) => { e.currentTarget.src = '/images/headers/header_bg_about.jpg'; }}
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
          <h1>Commercial Blends & Filter Coffee</h1>
          {/* Breadcrumb Trail */}
          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigateTo('home')} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">Commercial</span>
          </nav>

          {/* Search Box */}
          <div className="beans-search-box">
            <Search size={18} className="beans-search-icon" aria-hidden="true" />
            <input 
              type="text"
              placeholder="Search commercial & filter blends (e.g. Cowboy, Espresso, 80/20)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="beans-search-input"
              aria-label="Search commercial blends"
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
          {/* Quick Jump Category Pills */}
          <nav className="beans-category-quicknav" aria-label="Quick Jump to Commercial Category">
            <div className="quicknav-outer-wrap">
              <img 
                src="/images/illustrations/coffee_beans_sketch.png" 
                alt="" 
                className="quicknav-beans-flank-left" 
                aria-hidden="true"
              />
              <div className="quicknav-scroll-track">
                {COMMERCIAL_CATEGORIES.map(cat => {
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

          {/* Category Shelf Rows */}
          {totalFilteredCount > 0 ? (
            <div className="beans-shelf-rows-wrapper">
              {COMMERCIAL_CATEGORIES.map(cat => (
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
              <h3>No blends found matching "{searchQuery}"</h3>
              <p>Try searching for Cowboy blend, Bar Expresso, or South Indian Filter.</p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setSearchQuery('')}
              >
                Clear Search & View All Commercial Blends
              </button>
            </div>
          )}

          {/* B2B Commercial Roastery & Cafe Supply Highlight */}
          <div className="grind-guide-box">
            <div className="grind-guide-split">
              <div className="grind-guide-content">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#8E4E25', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  <Building2 size={15} aria-hidden="true" />
                  <span>Wholesale & Cafe Partnerships</span>
                </div>
                <h3>Commercial Roastery Solutions for Cafes & Restaurants</h3>
                <p>
                  We roast fresh daily on Broad Street, Kolkata, providing stable espresso formulations, South Indian filter roasts, and wholesale bulk packing for leading venues across India.
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
                  <span className="grind-method-pill">Custom Blend Profiles</span>
                  <span className="grind-method-pill">1 Kg Cafe Bulk Bags</span>
                  <span className="grind-method-pill">Espresso Dial-In Assistance</span>
                  <span className="grind-method-pill">Weekly Scheduled Roasting</span>
                  <span className="grind-method-pill">Staff Training & Cupping</span>
                </div>
              </div>
              <div className="grind-guide-illustration">
                <img 
                  src="/images/illustrations/coffee_pourover_sketch.png" 
                  alt="Roastery coffee craft" 
                  className="grind-pourover-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Roastery Direct Inquiries Banner */}
          <div className="beans-contact-banner" style={{ position: 'relative', overflow: 'hidden' }}>
            <img 
              src="/images/illustrations/coffee_botanical_branch_light.png" 
              alt="" 
              className="art-watermark-dark beans-banner-watermark" 
              aria-hidden="true"
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3>Partner with Ozkafe for Your Cafe or Restaurant</h3>
              <p>
                Experience consistency, honest pricing, and true specialty roasting. Speak directly with our master roaster at <strong>{CAFE_INFO.address}</strong>.
              </p>
            </div>
            <div className="beans-banner-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigateTo('contact')}
              >
                <MapPin size={16} aria-hidden="true" />
                <span>Visit Experience Center</span>
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
