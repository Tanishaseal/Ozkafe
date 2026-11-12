import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { FAQ_DATA } from '../data/cafeData';
import './FAQ.css';

export default function FAQ({ setCurrentPage }) {
  const [openId, setOpenId] = useState('faq-1');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'hours', label: 'Hours & Location' },
    { id: 'coffee', label: 'Coffee & Roasting' },
    { id: 'food', label: 'Food & Bakery' },
    { id: 'dining', label: 'Cafe & Amenities' },
    { id: 'events', label: 'Workshops & Events' }
  ];

  const toggleAccordion = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesQuery = !query || 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const clearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  const navigateTo = (page) => {
    if (setCurrentPage) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="faq-page animate-fade-in">
      {/* 1. Page Header Section with Dark Cafe Tabletop Hero Background */}
      <header className="faq-header page-header-hero">
        <div 
          className="page-header-bg" 
          style={{ backgroundImage: "url('/images/headers/header_bg_faq.jpg')" }} 
        />
        <div className="page-header-overlay" />

        {/* Botanical Illustrations */}
        <img 
          src="/images/illustrations/coffee_botanical_branch_light.png" 
          alt="" 
          className="art-watermark-dark faq-header-leaf-decor" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch_light.png" 
          alt="" 
          className="art-watermark-dark faq-header-beans-decor" 
          aria-hidden="true"
        />

        <div className="container page-header-content">
          <h1>Frequently Asked Questions</h1>
          {/* Breadcrumb Trail */}
          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigateTo('home')} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">FAQ</span>
          </nav>

          {/* Live Search Box */}
          <div className="faq-search-box">
            <Search size={18} className="faq-search-icon" aria-hidden="true" />
            <input 
              type="text"
              placeholder="Search questions (e.g., beans, pizza, parking, hours)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faq-search-input"
              aria-label="Search frequently asked questions"
            />
            {searchQuery && (
              <button 
                type="button"
                className="faq-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Categories & Accordions */}
      <section className="section faq-main-section">
        {/* Subtle Botanical Leaf & Beans Watermarks in Blank Margins */}
        <img 
          src="/images/illustrations/coffee_branch_leaves.png" 
          alt="" 
          className="art-watermark faq-watermark-left" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch.png" 
          alt="" 
          className="art-watermark faq-watermark-right" 
          aria-hidden="true"
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="faq-categories" role="tablist" aria-label="FAQ Categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`faq-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="faq-accordion-list" role="region" aria-label="Frequently Asked Questions List">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button 
                      className="faq-question-btn"
                      onClick={() => toggleAccordion(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown 
                        size={20} 
                        className={`faq-chevron ${isOpen ? 'rotated' : ''}`} 
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="faq-answer-panel animate-fade-in">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="faq-empty-state">
                <p>No questions matched your search query "{searchQuery}".</p>
                <button 
                  className="btn btn-outline btn-sm" 
                  onClick={clearFilters}
                  style={{ marginTop: '1rem' }}
                >
                  View All Questions
                </button>
              </div>
            )}
          </div>

          {/* Elegant Botanical Accent below FAQ list */}
          <div className="faq-bottom-flourish">
            <img 
              src="/images/illustrations/coffee_beans_sketch.png" 
              alt="" 
              className="art-accent-inline" 
              style={{ width: '130px', margin: '3rem auto 0', display: 'block' }} 
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
