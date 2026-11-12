import React, { useState, useEffect } from 'react';
import { Menu, X, Clock, MapPin, Phone } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';
import './Navbar.css';

export default function Navbar({ currentPage, setCurrentPage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About Us', path: '/aboutus' },
    { id: 'commercial', label: 'Commercial', path: '/commercial' },
    { id: 'single-origin', label: 'Single Origin', path: '/single-origin' },
    { id: 'contact', label: 'Contact Us', path: '/contactus' },
    { id: 'faq', label: 'FAQ', path: '/faq' }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : ''}`}>
      {/* Top Notification Announcement Bar */}
      <div className="topbar">
        <div className="container topbar-content">
          <div className="topbar-left">
            <span className="topbar-tag">Experience Center</span>
            <span className="topbar-item topbar-address">
              <MapPin size={13} aria-hidden="true" />
              <span>30/4, Broad St, Ballygunge Park, Kolkata</span>
            </span>
          </div>

          <div className="topbar-right">
            <span className="topbar-item">
              <Clock size={13} aria-hidden="true" />
              <span>Open Daily: 12:00 PM – 10:00 PM</span>
            </span>
            <a 
              href={CAFE_INFO.socials.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="topbar-item"
              aria-label="Ozkafe Instagram Page"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-biscuit)' }} aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>{CAFE_INFO.socials.instagramHandle}</span>
            </a>
            <div className="topbar-item">
              <Phone size={13} aria-hidden="true" />
              <a href="tel:+917605023132" style={{ color: 'inherit' }} aria-label="Call +91 7605 023 132">+91 7605 023 132</a>
              <span style={{ margin: '0 4px', opacity: 0.7 }}>/</span>
              <a href="tel:+919831133278" style={{ color: 'inherit' }} aria-label="Call +91 9831133278">+91 9831133278</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar-main" aria-label="Main Navigation">
        <div className="container navbar-container">
          {/* Logo & Title */}
          <a 
            href="/" 
            className="nav-brand" 
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            aria-label="Ozkafe Home"
          >
            <img 
              src="/ozkafe-logo.png" 
              alt="Ozkafe Emblem Logo" 
              className="nav-logo-img" 
            />
            <div className="nav-brand-text">
              <span className="brand-title">OZKAFE</span>
              <span className="brand-sub">Brewing Fresh • Est. 2016</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="nav-links" role="menubar">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                role="menuitem"
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Action */}
          <div className="nav-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => handleNavClick('contact')}
            >
              <MapPin size={14} aria-hidden="true" />
              <span>Visit Us</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-drawer-backdrop" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-drawer" className="mobile-drawer animate-fade-in" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <img 
            src="/images/illustrations/coffee_beans_sketch.png" 
            alt="" 
            className="art-watermark mobile-drawer-beans-watermark" 
            aria-hidden="true" 
          />
          <div className="mobile-drawer-links" style={{ position: 'relative', zIndex: 1 }}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mobile-drawer-footer">
            <button 
              className="btn btn-primary"
              onClick={() => handleNavClick('contact')}
              style={{ width: '100%' }}
            >
              <MapPin size={16} aria-hidden="true" />
              <span>Visit Us</span>
            </button>
            <div className="mobile-drawer-info">
              <p><strong>Hours:</strong> Daily 12:00 PM – 10:00 PM</p>
              <p>30/4, Broad St, Ballygunge Park, Kolkata</p>
              <p>
                <a href="tel:+917605023132">+91 7605 023 132</a> / <a href="tel:+919831133278">+91 9831133278</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
