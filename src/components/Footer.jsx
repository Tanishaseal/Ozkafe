import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ setCurrentPage }) {
  const handleNav = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      {/* Subtle Botanical Watermarks */}
      <img 
        src="/images/illustrations/coffee_botanical_branch_light.png" 
        alt="" 
        className="art-watermark-dark footer-botanical-watermark" 
        aria-hidden="true"
      />
      <img 
        src="/images/illustrations/coffee_beans_sketch_light.png" 
        alt="" 
        className="art-watermark-dark footer-beans-watermark-left" 
        aria-hidden="true"
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-top">
          {/* 1. Logo & Brand */}
          <div className="footer-brand">
            <a 
              href="/" 
              className="footer-logo-wrap"
              onClick={(e) => { e.preventDefault(); handleNav('home'); }}
              aria-label="Ozkafe Home"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img 
                src="/ozkafe-logo.png" 
                alt="Ozkafe Emblem Logo" 
                className="footer-logo-img" 
              />
              <div>
                <div className="footer-brand-title">OZKAFE</div>
                <div className="footer-brand-tagline">Brewing Fresh • Est. 2016</div>
              </div>
            </a>
            <p className="footer-brand-desc">
              Specialty Coffee Roastery Brand & Cafe Experience Center. Micro-batch shade-grown Arabica, estate microlots, artisan blends, and European dining.
            </p>
          </div>

          {/* 2. Navigation Pages */}
          <div className="footer-nav">
            <h4 className="footer-heading">Navigation</h4>
            <div className="footer-links-list">
              <a href="/" className="footer-link-btn" onClick={(e) => { e.preventDefault(); handleNav('home'); }}>
                Home
              </a>
              <a href="/aboutus" className="footer-link-btn" onClick={(e) => { e.preventDefault(); handleNav('about'); }}>
                About Us
              </a>
              <a href="/commercial" className="footer-link-btn" onClick={(e) => { e.preventDefault(); handleNav('commercial'); }}>
                Commercial
              </a>
              <a href="/single-origin" className="footer-link-btn" onClick={(e) => { e.preventDefault(); handleNav('single-origin'); }}>
                Single Origin
              </a>
              <a href="/contactus" className="footer-link-btn" onClick={(e) => { e.preventDefault(); handleNav('contact'); }}>
                Contact Us
              </a>
              <a href="/faq" className="footer-link-btn" onClick={(e) => { e.preventDefault(); handleNav('faq'); }}>
                FAQ
              </a>
            </div>
          </div>

          {/* 3. Contact Us Details */}
          <div className="footer-contact">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-contact-items">
              <div className="footer-contact-item">
                <MapPin size={18} aria-hidden="true" />
                <div>
                  <strong>Address</strong>
                  <span>{CAFE_INFO.address}</span>
                </div>
              </div>

              <div className="footer-contact-item">
                <Clock size={18} aria-hidden="true" />
                <div>
                  <strong>Hours</strong>
                  <span>{CAFE_INFO.hours}</span>
                </div>
              </div>

              <div className="footer-contact-item">
                <Phone size={18} aria-hidden="true" />
                <div>
                  <strong>Phone</strong>
                  <div>
                    <a href="tel:+917605023132" style={{ color: 'inherit' }}>+91 7605 023 132</a>
                    {' / '}
                    <a href="tel:+919831133278" style={{ color: 'inherit' }}>+91 9831133278</a>
                  </div>
                </div>
              </div>

              <div className="footer-contact-item">
                <Mail size={18} aria-hidden="true" />
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${CAFE_INFO.email}`} style={{ color: 'inherit' }}>{CAFE_INFO.email}</a>
                </div>
              </div>

              <div className="footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px', color: 'var(--color-biscuit)' }} aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <div>
                  <strong>Instagram</strong>
                  <a href={CAFE_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                    {CAFE_INFO.socials.instagramHandle}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © 2016–{CURRENT_YEAR} Ozkafe. All rights reserved. Kolkata, West Bengal.
          </div>
          <div className="footer-bottom-tagline">
            Specialty Coffee Roastery & Cafe Experience Center
          </div>
        </div>
      </div>
    </footer>
  );
}
