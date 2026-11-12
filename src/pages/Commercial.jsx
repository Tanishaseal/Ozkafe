import React from 'react';
import { Briefcase, Sliders, Coffee, Sparkles, Phone, Mail, ArrowLeft, MapPin } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';
import './UnderConstruction.css';

export default function Commercial({ setCurrentPage }) {
  const navigateTo = (page) => {
    if (setCurrentPage) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="uc-page animate-fade-in">
      {/* 1. Page Header Section with Dark Micro-Roastery Hero Background */}
      <header className="page-header-hero">
        <div 
          className="page-header-bg" 
          style={{ backgroundImage: "url('/images/headers/header_bg_about.jpg')" }} 
        />
        <div className="page-header-overlay" />

        {/* Botanical Illustrations */}
        <img 
          src="/images/illustrations/coffee_botanical_branch_light.png" 
          alt="" 
          className="art-watermark-dark"
          style={{ position: 'absolute', left: '-20px', top: '-10px', width: '240px', opacity: 0.14 }}
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch_light.png" 
          alt="" 
          className="art-watermark-dark"
          style={{ position: 'absolute', right: '-20px', bottom: '0px', width: '220px', opacity: 0.14 }}
          aria-hidden="true"
        />

        <div className="container page-header-content">
          <h1>Commercial</h1>
          {/* Breadcrumb Trail */}
          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigateTo('home')} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">Commercial</span>
          </nav>
        </div>
      </header>

      {/* 2. Main Under Construction Content */}
      <section className="uc-main-section">
        {/* Subtle Watermarks */}
        <img 
          src="/images/illustrations/coffee_botanical_branch.png" 
          alt="" 
          className="uc-watermark-left" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch.png" 
          alt="" 
          className="uc-watermark-right" 
          aria-hidden="true"
        />

        <div className="container uc-content-wrapper">
          <div className="uc-card">
            {/* Badge */}
            <div className="uc-badge-wrap">
              <span className="uc-badge">
                <span className="uc-badge-dot" />
                Under Construction • Coming Soon
              </span>
            </div>

            {/* Icon */}
            <div className="uc-icon-wrap">
              <Briefcase size={36} aria-hidden="true" />
            </div>

            {/* Titles */}
            <h2 className="uc-title">Commercial Roastery & Wholesale Solutions</h2>
            <p className="uc-tagline">
              Bespoke Coffee Roasting, Equipment Consulting & B2B Supply for Kolkata & Beyond
            </p>
            <p className="uc-desc">
              We are actively developing our dedicated Commercial B2B portal. Soon you will be able to browse wholesale roast-to-order catalog tiers, order custom cafe espresso blend formulations, and request machine calibrations directly online.
            </p>

            {/* Feature Previews */}
            <div className="uc-features-title">What We Offer for Commercial Partners</div>
            <div className="uc-features-grid">
              <div className="uc-feature-item">
                <div className="uc-feature-icon">
                  <Sliders size={20} aria-hidden="true" />
                </div>
                <h4 className="uc-feature-heading">Custom Roast Profiles</h4>
                <p className="uc-feature-text">
                  Signature espresso blends and single-estate roast profiles crafted specifically for your venue's brew equipment and customer preferences.
                </p>
              </div>

              <div className="uc-feature-item">
                <div className="uc-feature-icon">
                  <Coffee size={20} aria-hidden="true" />
                </div>
                <h4 className="uc-feature-heading">Fresh Micro-Batch Supply</h4>
                <p className="uc-feature-text">
                  Roasted in small batches right here in Kolkata, stamped with exact roast dates, and delivered on reliable weekly schedules.
                </p>
              </div>

              <div className="uc-feature-item">
                <div className="uc-feature-icon">
                  <Sparkles size={20} aria-hidden="true" />
                </div>
                <h4 className="uc-feature-heading">Barista & Bar Consulting</h4>
                <p className="uc-feature-text">
                  Commercial espresso machine curation, water filtration analysis, grinder dial-in training, and ongoing barista workshops.
                </p>
              </div>
            </div>

            {/* Direct Contact Box */}
            <div className="uc-contact-box">
              <h4 className="uc-contact-box-title">Have an immediate wholesale or cafe inquiry?</h4>
              <p className="uc-contact-box-sub">
                Our roasting team is actively taking orders and partnerships by direct phone and email while this page is under construction.
              </p>
              <div className="uc-contact-lines">
                <div className="uc-contact-item">
                  <Phone size={17} aria-hidden="true" />
                  <span>
                    <a href="tel:+917605023132">+91 7605 023 132</a> / <a href="tel:+919831133278">+91 9831133278</a>
                  </span>
                </div>
                <div className="uc-contact-item">
                  <Mail size={17} aria-hidden="true" />
                  <span>
                    <a href={`mailto:${CAFE_INFO.email}`}>{CAFE_INFO.email}</a>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="uc-action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigateTo('contact')}
              >
                <MapPin size={16} aria-hidden="true" />
                <span>Inquire on Contact Page</span>
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigateTo('home')}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
