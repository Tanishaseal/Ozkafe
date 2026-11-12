import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, Clock, ArrowRight, CheckCircle2, 
  UtensilsCrossed, Star,
  Volume2, VolumeX, Play, Pause, Coffee
} from 'lucide-react';
import { CAFE_INFO, REVIEWS } from '../data/cafeData';
import './Home.css';

export default function Home({ setCurrentPage }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const currentVid = videoRef.current;
    if (currentVid) {
      currentVid.play().catch(() => {
        // Autoplay handled by browser policy
      });
    }
    return () => {
      if (currentVid) {
        currentVid.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleTimeUpdate = () => {
    // home video naturally transitions at ~30.5s; loop seamlessly
    if (videoRef.current && videoRef.current.currentTime >= 30.5) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="home-page animate-fade-in">
      {/* 1. Cinematic Hero Live Video Section */}
      <section className="hero-video-section">
        <video
          ref={videoRef}
          className="hero-video-media"
          src="/videos/home_video.mp4"
          poster="/images/hero_coffee.jpg"
          autoPlay
          muted={isMuted}
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="hero-video-overlay" />

        <div className="container hero-video-center-container">
          <div className="hero-brand-lockup">
            <div className="hero-badge-pill">
              <Coffee size={14} aria-hidden="true" />
              <span>Specialty Coffee Roastery & Cafe</span>
            </div>
            <h1 className="hero-brand-title">OZKAFE</h1>
            <p className="hero-brand-quote">
              <span className="quote-mark">“</span>
              Freshly roasted for peak flavor and aroma
              <span className="quote-mark">”</span>
            </p>
            <p className="hero-brand-location">
              30/4, Broad St, Ballygunge Park, Kolkata • Founded 2016
            </p>
            <div className="hero-action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigateTo('coffee-beans')}
              >
                <Coffee size={16} aria-hidden="true" />
                <span>Explore Coffee Beans</span>
              </button>
              <button 
                className="btn btn-hero-secondary"
                onClick={() => navigateTo('contact')}
              >
                <MapPin size={16} aria-hidden="true" />
                <span>Visit Ballygunge Cafe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Live Video Controls */}
        <div className="hero-video-controls">
          <button 
            className="video-ctrl-btn"
            onClick={togglePlay}
            title={isPlaying ? "Pause background video" : "Play background video"}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
          >
            {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            <span className="video-ctrl-text">{isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button 
            className="video-ctrl-btn"
            onClick={toggleMute}
            title={isMuted ? "Unmute video sound" : "Mute video sound"}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
          >
            {isMuted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
            <span className="video-ctrl-text">{isMuted ? "Sound Off" : "Sound On"}</span>
          </button>
        </div>

        {/* Bottom subtle edge blend into page */}
        <div className="hero-video-bottom-blend" />
      </section>

      {/* 2. Quick Info Bar */}
      <section className="quick-info-strip">
        <div className="container">
          <div className="quick-info-grid">
            <div className="quick-info-box">
              <MapPin size={26} aria-hidden="true" />
              <div>
                <div className="quick-info-title">Ballygunge Park Address</div>
                <div className="quick-info-sub">{CAFE_INFO.address}</div>
              </div>
            </div>

            <div className="quick-info-box">
              <Clock size={26} aria-hidden="true" />
              <div>
                <div className="quick-info-title">Opening Hours</div>
                <div className="quick-info-sub">{CAFE_INFO.hours}</div>
              </div>
            </div>

            <div className="quick-info-box">
              <UtensilsCrossed size={26} aria-hidden="true" />
              <div>
                <div className="quick-info-title">Cuisine & Roastery</div>
                <div className="quick-info-sub">Specialty Coffee, Bakery, Pizza, Continental, Burgers, Salads</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Flagship Experience Center Section */}
      <section className="section bg-white home-flagship-section">
        {/* Subtle Botanical Leaf Watermark */}
        <img 
          src="/images/illustrations/coffee_botanical_branch.png" 
          alt="" 
          className="art-watermark flagship-leaf-watermark" 
          aria-hidden="true"
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="feature-split">
            <div className="feature-image-frame">
              <img 
                src="/images/ozkafe_real_interior.png" 
                alt="Ozkafe Ballygunge Cafe Experience Center Interior" 
                className="feature-img" 
                loading="lazy"
              />
              <span className="feature-card-stamp">Ballygunge Park</span>
            </div>

            <div>
              <h2 className="section-title">A Welcoming Haven for Real Coffee & Conversation</h2>
              <p>
                Step inside our Ballygunge Park cafe, where the rich aroma of freshly micro-roasted coffee beans greets you at the door. Designed with warm timber, ample natural light, and quiet seating, it's the ideal space in Kolkata to enjoy single-origin manual brews or an unhurried meal with friends.
              </p>

              <div className="hero-highlights-strip" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="hero-highlight-item">
                  <span className="hero-highlight-title">Founded {CAFE_INFO.foundedYear}</span>
                  <span className="hero-highlight-sub">Kolkata's Roastery Pioneer</span>
                </div>
                <div className="hero-highlight-item">
                  <span className="hero-highlight-title">12 PM – 10 PM</span>
                  <span className="hero-highlight-sub">Open Daily in Ballygunge</span>
                </div>
                <div className="hero-highlight-item">
                  <span className="hero-highlight-title">100% Arabica</span>
                  <span className="hero-highlight-sub">Micro-Roasts & Fresh Bakes</span>
                </div>
              </div>

              {/* Hand-Drawn Coffee Beans Illustration Accent */}
              <div className="home-beans-accent">
                <img 
                  src="/images/illustrations/coffee_beans_sketch.png" 
                  alt="Artisanal Roasted Coffee Beans Sketch" 
                  className="home-beans-sketch-img"
                  loading="lazy"
                />
              </div>

              <div className="feature-btn-row">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigateTo('coffee-beans')}
                >
                  <Coffee size={16} aria-hidden="true" />
                  <span>Buy Roasted Beans</span>
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigateTo('about')}
                >
                  <span>Our Heritage Story</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Roastery Experience Section */}
      <section className="section bg-cream home-roastery-section">
        {/* Subtle Pourover Decanter & Botanical Watermarks */}
        <img 
          src="/images/illustrations/coffee_pourover_sketch.png" 
          alt="" 
          className="art-watermark roastery-pourover-watermark" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_branch_leaves.png" 
          alt="" 
          className="art-watermark roastery-branch-watermark" 
          aria-hidden="true"
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="feature-split feature-split-reverse">
            <div>
              <h2 className="section-title">A Serene Sanctuary for Real Coffee & Unhurried Moments</h2>
              <p>
                Ozkafe was envisioned not just as a coffee shop, but as an experiential sanctuary. Located on Broad Street in Ballygunge Park, our space blends warm timber, clean Scandinavian lines, and the rich, comforting fragrance of freshly roasted beans.
              </p>

              <div className="feature-points">
                <div className="feature-point">
                  <div className="feature-point-bullet">
                    <CheckCircle2 size={14} aria-hidden="true" />
                  </div>
                  <div className="feature-point-text">
                    <strong>Direct Farm-to-Roaster Craft</strong>
                    <p>Ethically sourced specialty Arabica from sustainable South Indian estates, roasted in custom small batches.</p>
                  </div>
                </div>

                <div className="feature-point">
                  <div className="feature-point-bullet">
                    <CheckCircle2 size={14} aria-hidden="true" />
                  </div>
                  <div className="feature-point-text">
                    <strong>Manual Brewing Bar</strong>
                    <p>Experience precision extraction via Pour-Over (V60), Aeropress, French Press, or our 18-hour slow cold brew.</p>
                  </div>
                </div>

                <div className="feature-point">
                  <div className="feature-point-bullet">
                    <CheckCircle2 size={14} aria-hidden="true" />
                  </div>
                  <div className="feature-point-text">
                    <strong>Relaxed, Thoughtful Dining</strong>
                    <p>Comfortable seating with high-speed Wi-Fi, perfect for book lovers, remote work, or quiet catch-ups.</p>
                  </div>
                </div>
              </div>

              <div className="feature-btn-row">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigateTo('about')}
                >
                  <span>Our Roastery Story</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigateTo('contact')}
                >
                  <MapPin size={16} aria-hidden="true" />
                  <span>Find Us on Map</span>
                </button>
              </div>
            </div>

            <div className="feature-image-frame">
              <img 
                src="/images/ozkafe_storefront.png" 
                alt="Ozkafe Ballygunge Cafe Experience Center Storefront" 
                className="feature-img" 
                loading="lazy"
              />
              <span className="feature-card-stamp">Ballygunge Park</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Guest Reviews / Community */}
      <section className="section bg-white home-reviews-section">
        {/* Subtle Botanical Leaf & Beans Watermarks */}
        <img 
          src="/images/illustrations/coffee_branch_leaves.png" 
          alt="" 
          className="art-watermark reviews-branch-watermark-left" 
          aria-hidden="true"
        />
        <img 
          src="/images/illustrations/coffee_beans_sketch.png" 
          alt="" 
          className="art-watermark reviews-beans-watermark-right" 
          aria-hidden="true"
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header">
            <h2 className="section-title">What Kolkata Says About Ozkafe</h2>
            <p className="section-subtitle">
              Warm hospitality, authentic roasting, and relaxed cafe culture in Ballygunge.
            </p>
          </div>

          <div className="testimonials-grid">
            {REVIEWS.map(review => (
              <div key={review.id} className="testimonial-card">
                <div>
                  <div className="testimonial-stars" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="testimonial-quote">"{review.quote}"</p>
                </div>
                <div>
                  <div className="testimonial-author-name">{review.author}</div>
                  <div className="testimonial-author-role">{review.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
