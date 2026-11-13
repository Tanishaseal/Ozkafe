import React from 'react';
import { Flame, HeartHandshake, MapPin, Coffee, Utensils } from 'lucide-react';
import { CAFE_INFO, ABOUT_MILESTONES } from '../data/cafeData';
import './About.css';

export default function About({ setCurrentPage }) {
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="about-page animate-fade-in">
      {/* 1. Page Header Section with Dark Micro-Roastery Hero Background */}
      <header className="about-header-section page-header-hero">
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

        {/* Botanical Illustrations */}
        <img 
          src="/images/illustrations/coffee_botanical_branch_light.webp" 
          alt="" 
          className="art-watermark-dark about-header-leaf-decor" 
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
          className="art-watermark-dark about-header-beans-decor" 
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width="220"
          height="139"
          onError={(e) => { e.currentTarget.src = '/images/illustrations/coffee_beans_sketch_light.png'; }}
          aria-hidden="true"
        />

        <div className="container page-header-content">
          <h1>About Us</h1>
          {/* Breadcrumb Trail */}
          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigateTo('home')} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">About Us</span>
          </nav>
        </div>
      </header>

      {/* 2. Narrative & Craft Section */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-split">
            <div className="about-story-text">
              <h2 style={{ marginBottom: '1.25rem' }}>Pioneering Specialty Coffee in Kolkata</h2>
              <p>
                Founded in <strong>2016 in Kolkata, West Bengal</strong>, Ozkafe was born out of a desire to redefine how coffee is understood, roasted, and savored. While instant and commercial chicory blends dominated the regional market, we set out on a journey across India's premier shade-grown coffee estates to find remarkable beans worthy of a true specialty cup.
              </p>
              <p>
                From small-batch test roasts in our early days to establishing our flagship <strong>Cafe Experience Center at {CAFE_INFO.address}</strong>, our philosophy has remained unyielding: <em>Brew Fresh, Roast Honestly, and Host with Heart.</em>
              </p>
              <p>
                Every roast profile is fine-tuned to accentuate the terroir of the bean—from the floral jasmine notes of a washed Chikmagalur harvest to the deep dark chocolate nuances of our signature espresso blend.
              </p>

              {/* Coffee Beans Sketch Accent */}
              <div className="about-beans-accent">
                <img 
                  src="/images/illustrations/coffee_beans_sketch.png" 
                  alt="" 
                  className="about-beans-accent-img"
                  loading="lazy"
                  aria-hidden="true"
                />
              </div>

              <div className="about-actions-row">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigateTo('contact')}
                >
                  <MapPin size={16} aria-hidden="true" />
                  <span>Visit Ballygunge Center</span>
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigateTo('coffee-beans')}
                >
                  <Coffee size={16} aria-hidden="true" />
                  <span>Explore Coffee Beans</span>
                </button>
              </div>
            </div>

            <div className="about-image-card">
              <img 
                src="/images/ozkafe_about_coffee.png" 
                alt="Ozkafe Fresh Roasted Specialty Coffee, House Blends & Handcrafted Latte Art" 
                loading="lazy"
              />
              <div className="about-image-caption">
                <strong>Artisanal Roasts & Fresh Brews</strong> • In-house specialty blends & handcrafted coffee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Core Values */}
      <section className="section bg-cream about-values-section">
        {/* Subtle Botanical Leaf & Beans Watermarks */}
        <img 
          src="/images/illustrations/coffee_botanical_branch.png" 
          alt="" 
          className="art-watermark values-branch-watermark-left" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch.png" 
          alt="" 
          className="art-watermark values-beans-watermark-right" 
          aria-hidden="true"
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header">
            <h2 className="section-title">The Pillars of Ozkafe</h2>
            <p className="section-subtitle">
              Every bean we roast, every pizza dough we ferment, and every conversation we host is guided by three principles.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-box">
                <Flame size={24} aria-hidden="true" />
              </div>
              <h3>Precision Roasting</h3>
              <p>
                We never over-roast or mask natural flavors with dark bitterness. Our micro-batches are gently developed to preserve vibrant fruit, floral aromatics, and natural bean sweetness.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <Utensils size={24} aria-hidden="true" />
              </div>
              <h3>Wholesome Kitchen Craft</h3>
              <p>
                Coffee and food must speak the same honest language. Our pizzas are made from 48-hour fermented sourdough crusts, our bakery uses pure butter, and our salads feature crisp fresh greens.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <HeartHandshake size={24} aria-hidden="true" />
              </div>
              <h3>Unhurried Hospitality</h3>
              <p>
                Tucked into Ballygunge Park, our cafe is a peaceful escape. Whether you sit for thirty minutes with a cortado or spend an entire afternoon reading, you are always at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Journey Timeline */}
      <section className="section timeline-section">
        {/* Subtle Pourover Decanter & Botanical Watermarks */}
        <img 
          src="/images/illustrations/coffee_pourover_sketch.png" 
          alt="" 
          className="art-watermark about-timeline-watermark" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_branch_leaves.png" 
          alt="" 
          className="art-watermark about-timeline-branch-right" 
          aria-hidden="true"
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header">
            <h2 className="section-title">From 2016 to Today</h2>
            <p className="section-subtitle">A decade of brewing fresh in the City of Joy.</p>
          </div>

          <div className="timeline-wrap">
            {ABOUT_MILESTONES.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-dot" aria-hidden="true" />
                <div className="timeline-year">{item.year}</div>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
