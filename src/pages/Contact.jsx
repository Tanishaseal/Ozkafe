import React, { useState, useRef } from 'react';
import { MapPin, Clock, Phone, Mail, Send, CheckCircle, Navigation, ExternalLink } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';
import './Contact.css';

export default function Contact({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'General Inquiry',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const formCardRef = useRef(null);

  const navigateTo = (page) => {
    if (setCurrentPage) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = 'OZK-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(id);
    setIsSubmitted(true);
    if (formCardRef.current) {
      formCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiryType: 'General Inquiry',
      message: ''
    });
  };

  return (
    <div className="contact-page animate-fade-in">
      {/* 1. Page Header Section with Dark Espresso Bar Hero Background */}
      <header className="contact-header page-header-hero">
        <div 
          className="page-header-bg" 
          style={{ backgroundImage: "url('/images/headers/header_bg_contact.jpg')" }} 
        />
        <div className="page-header-overlay" />

        {/* Botanical Illustrations */}
        <img 
          src="/images/illustrations/coffee_botanical_branch_light.png" 
          alt="" 
          className="art-watermark-dark contact-header-leaf-decor" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch_light.png" 
          alt="" 
          className="art-watermark-dark contact-header-beans-decor" 
          aria-hidden="true"
        />

        <div className="container page-header-content">
          <h1>Contact Us</h1>
          {/* Breadcrumb Trail */}
          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigateTo('home')} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">Contact</span>
          </nav>
        </div>
      </header>

      {/* 2. Main Content */}
      <section className="section contact-main-section">
        {/* Subtle Botanical & Coffee Beans Watermarks in Blank Spaces */}
        <img 
          src="/images/illustrations/coffee_botanical_branch.png" 
          alt="" 
          className="art-watermark contact-watermark-left" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch.png" 
          alt="" 
          className="art-watermark contact-watermark-right" 
          aria-hidden="true"
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="contact-grid">
            {/* Left Column: Info Cards */}
            <div className="contact-info-col">
              {/* Address Card */}
              <div className="contact-card">
                <div className="contact-card-icon">
                  <MapPin size={22} aria-hidden="true" />
                </div>
                <div className="contact-card-content">
                  <h4>Cafe & Roastery Location</h4>
                  <p>{CAFE_INFO.address}</p>
                  <p style={{ marginTop: '0.5rem' }}>
                    <a 
                      href={CAFE_INFO.googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contact-map-link"
                    >
                      <Navigation size={14} aria-hidden="true" />
                      <span>Open in Google Maps</span>
                    </a>
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="contact-card">
                <div className="contact-card-icon">
                  <Clock size={22} aria-hidden="true" />
                </div>
                <div className="contact-card-content">
                  <h4>Hours of Operation</h4>
                  <p><strong>{CAFE_INFO.hours}</strong></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Serving specialty pour-overs, artisanal bakery, fresh pizzas, continental cuisine, burgers & flavored teas.
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="contact-card">
                <div className="contact-card-icon">
                  <Phone size={22} aria-hidden="true" />
                </div>
                <div className="contact-card-content">
                  <h4>Direct Inquiries & Cafe Help</h4>
                  <p><a href={`tel:${CAFE_INFO.phone}`}>{CAFE_INFO.phone}</a></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Call us for directions, takeaway pickups, or coffee recommendations.
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="contact-card">
                <div className="contact-card-icon">
                  <Mail size={22} aria-hidden="true" />
                </div>
                <div className="contact-card-content">
                  <h4>Email Correspondence</h4>
                  <p><a href={`mailto:${CAFE_INFO.email}`}>{CAFE_INFO.email}</a></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    For events, workshops, coffee beans wholesale, and partnerships.
                  </p>
                </div>
              </div>

              {/* Instagram Card */}
              <div className="contact-card">
                <div className="contact-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div className="contact-card-content">
                  <h4>Instagram Channel</h4>
                  <p>
                    <a href={CAFE_INFO.socials.instagram} target="_blank" rel="noopener noreferrer">
                      {CAFE_INFO.socials.instagramHandle}
                    </a>
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Follow our roastery updates, brewing stories, and fresh daily bakes.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Send Us a Message Form */}
            <div ref={formCardRef} className="contact-form-card">
              {isSubmitted ? (
                <div className="contact-success-state animate-fade-in" role="status" aria-live="polite">
                  <div className="contact-success-icon">
                    <CheckCircle size={36} aria-hidden="true" />
                  </div>
                  <h3>Message Received!</h3>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. Our team at Ozkafe Ballygunge has received your note.
                  </p>

                  <div className="contact-success-summary">
                    <div><strong>Confirmation ID:</strong> {ticketId}</div>
                    <div><strong>Inquiry Type:</strong> {formData.inquiryType}</div>
                    <div><strong>Contact:</strong> {formData.phone} • {formData.email || 'N/A'}</div>
                    {formData.message && (
                      <div style={{ marginTop: '0.5rem', borderTop: '1px dashed var(--border-medium)', paddingTop: '0.5rem' }}>
                        <strong>Your Message:</strong> "{formData.message}"
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    We usually respond within a few hours. For urgent questions or table reservations, please call {CAFE_INFO.phone}.
                  </p>

                  <button className="btn btn-primary" onClick={handleReset}>
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate={false}>
                  <h3>Send Us a Message or Inquiry</h3>
                  <p className="form-subtitle">
                    Fill out the form below and our team will get back to you promptly.
                  </p>

                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">Your Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Sreya Mukherjee"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-phone" className="form-label">Phone Number *</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98300 00000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email" className="form-label">Email Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        placeholder="sreya@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-inquiry" className="form-label">What is this regarding?</label>
                    <select
                      id="contact-inquiry"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="General Inquiry">General Visit & Inquiry</option>
                      <option value="Roastery Tour / Coffee Tasting">Roastery Tour & Coffee Tasting</option>
                      <option value="Fresh Roasted Beans / Wholesale">Fresh Roasted Coffee Beans Purchase</option>
                      <option value="Private Event / Gathering">Private Event / Gathering</option>
                      <option value="Feedback / General Question">Feedback or General Question</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label">Your Message *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      placeholder="Tell us about your visit, questions, or any specific coffee inquiries..."
                      value={formData.message}
                      onChange={handleChange}
                      className="form-textarea"
                      rows={5}
                    />
                  </div>

                  <button type="submit" className="form-submit-btn">
                    <Send size={17} aria-hidden="true" />
                    <span>Send Message to Ozkafe</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Live Interactive Map Section Under Send Us a Message */}
          <div className="live-map-section">
            <div className="live-map-card">
              <div className="live-map-header">
                <div className="live-map-title-group">
                  <MapPin size={22} aria-hidden="true" />
                  <div>
                    <h3 className="live-map-title">Ozkafe Ballygunge • Live Location</h3>
                    <div className="live-map-subtitle">{CAFE_INFO.address}</div>
                  </div>
                </div>

                <a 
                  href={CAFE_INFO.googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="live-map-btn"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>

              <div className="live-map-iframe-container">
                <iframe
                  title="Ozkafe Ballygunge Live Map"
                  src="https://maps.google.com/maps?q=30%2F4%2C+Broad+St%2C+Ballygunge+Park%2C+Ballygunge%2C+Kolkata&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
