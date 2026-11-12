import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CoffeeBeans from './pages/CoffeeBeans';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

const PAGE_TITLES = {
  home: 'Ozkafe | Specialty Coffee Roastery & Cafe Experience Center | Kolkata',
  about: 'About Us | Ozkafe Specialty Coffee Roastery & Cafe | Kolkata',
  'coffee-beans': 'Coffee Beans & Roastery Shelf | Ozkafe Kolkata',
  contact: 'Contact & Directions | Ozkafe Ballygunge | Kolkata',
  faq: 'Frequently Asked Questions | Ozkafe Specialty Coffee & Cafe'
};

const VALID_PAGES = ['home', 'about', 'coffee-beans', 'contact', 'faq'];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Always on initial load and refresh: display loader with logo, then smoothly fade out
  useEffect(() => {
    if (typeof window.__dismissOzkafeLoader === 'function') {
      window.__dismissOzkafeLoader();
    } else {
      const minDisplayTime = 700;
      const timer = setTimeout(() => {
        const loaderEl = document.getElementById('ozkafe-loader');
        if (loaderEl) {
          loaderEl.classList.add('loader-fade-out');
          setTimeout(() => {
            if (loaderEl && loaderEl.parentNode) {
              loaderEl.parentNode.removeChild(loaderEl);
            }
          }, 500);
        }
      }, minDisplayTime);

      return () => clearTimeout(timer);
    }
  }, []);

  // Sync hash with current page and handle history navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_PAGES.includes(hash)) {
        setCurrentPage(hash);
      } else if (!hash) {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update document title whenever currentPage changes
  useEffect(() => {
    if (PAGE_TITLES[currentPage]) {
      document.title = PAGE_TITLES[currentPage];
    }
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Navbar with brand and navigation links */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={handlePageChange}
      />

      {/* Main Pages */}
      <main id="main-content">
        {currentPage === 'home' && (
          <Home 
            setCurrentPage={handlePageChange} 
          />
        )}
        {currentPage === 'about' && (
          <About 
            setCurrentPage={handlePageChange} 
          />
        )}
        {currentPage === 'coffee-beans' && (
          <CoffeeBeans 
            setCurrentPage={handlePageChange}
          />
        )}
        {currentPage === 'contact' && (
          <Contact 
            setCurrentPage={handlePageChange}
          />
        )}
        {currentPage === 'faq' && (
          <FAQ 
            setCurrentPage={handlePageChange} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        setCurrentPage={handlePageChange}
      />
    </div>
  );
}
