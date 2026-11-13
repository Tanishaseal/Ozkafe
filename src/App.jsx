import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Commercial from './pages/Commercial';
import SingleOrigin from './pages/SingleOrigin';
import InstantCoffee from './pages/InstantCoffee';
import CoffeeBeans from './pages/CoffeeBeans';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

const PAGE_TITLES = {
  home: 'Ozkafe | Specialty Coffee Roastery & Cafe Experience Center | Kolkata',
  about: 'About Us | Ozkafe Specialty Coffee Roastery & Cafe | Kolkata',
  commercial: 'Commercial Blends & Wholesale Solutions | Ozkafe Kolkata',
  'single-origin': 'Single Origin Estate Coffees | Ozkafe Kolkata',
  'instant-coffee': 'Instant Coffee & Cold Brew | Ozkafe Kolkata',
  'coffee-beans': 'Coffee Beans & Roastery Shelf | Ozkafe Kolkata',
  contact: 'Contact & Directions | Ozkafe Ballygunge | Kolkata',
  faq: 'Frequently Asked Questions | Ozkafe Specialty Coffee & Cafe'
};

const VALID_PAGES = ['home', 'about', 'commercial', 'single-origin', 'instant-coffee', 'coffee-beans', 'contact', 'faq'];

export const PAGE_ROUTES = {
  home: '/',
  about: '/aboutus',
  commercial: '/commercial',
  'single-origin': '/single-origin',
  'instant-coffee': '/instant-coffee',
  contact: '/contactus',
  faq: '/faq',
  'coffee-beans': '/coffee-beans'
};

const getPageFromLocation = () => {
  if (typeof window === 'undefined') return 'home';

  // 1. Check pathname (e.g. /, /home, /aboutus, /commercial, /single-origin, /instant-coffee, /contactus, /faq)
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  
  if (pathname === '/' || pathname === '/home' || pathname === '/index.html') {
    return 'home';
  }
  if (pathname === '/aboutus' || pathname === '/about' || pathname === '/about-us') {
    return 'about';
  }
  if (pathname === '/commercial') {
    return 'commercial';
  }
  if (pathname === '/single-origin' || pathname === '/singleorigin') {
    return 'single-origin';
  }
  if (pathname === '/instant-coffee' || pathname === '/instantcoffee' || pathname === '/instant') {
    return 'instant-coffee';
  }
  if (pathname === '/contactus' || pathname === '/contact' || pathname === '/contact-us') {
    return 'contact';
  }
  if (pathname === '/faq') {
    return 'faq';
  }
  if (pathname === '/coffee-beans' || pathname === '/beans') {
    return 'coffee-beans';
  }

  // 2. Check hash (backward compatibility / legacy #home, #about etc.)
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash === 'home') return 'home';
  if (hash === 'about' || hash === 'aboutus' || hash === 'about-us') return 'about';
  if (hash === 'commercial') return 'commercial';
  if (hash === 'single-origin' || hash === 'singleorigin') return 'single-origin';
  if (hash === 'instant-coffee' || hash === 'instantcoffee' || hash === 'instant') return 'instant-coffee';
  if (hash === 'contact' || hash === 'contactus' || hash === 'contact-us') return 'contact';
  if (hash === 'faq') return 'faq';
  if (hash === 'coffee-beans') return 'coffee-beans';

  return 'home';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(getPageFromLocation);

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

  // Idle prefetch header backgrounds for subpages to ensure instantaneous navigation across devices
  useEffect(() => {
    const prefetchAssets = () => {
      const assets = [
        '/images/headers/header_bg_about.webp',
        '/images/headers/header_bg_beans.webp',
        '/images/headers/header_bg_contact.webp',
        '/images/headers/header_bg_faq.webp',
        '/images/illustrations/coffee_botanical_branch_light.webp',
        '/images/illustrations/coffee_beans_sketch_light.webp'
      ];
      assets.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(prefetchAssets, { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    } else {
      const timerId = setTimeout(prefetchAssets, 1000);
      return () => clearTimeout(timerId);
    }
  }, []);

  // Listen for browser back / forward navigation (popstate) & clean up any trailing hash (#home)
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const resolvedPage = getPageFromLocation();
      setCurrentPage(resolvedPage);
    };

    // If initial URL had a hash like #home, replace it cleanly with clean path (e.g. / for home)
    if (window.location.hash) {
      const initialPage = getPageFromLocation();
      const cleanPath = PAGE_ROUTES[initialPage] || '/';
      window.history.replaceState({ page: initialPage }, '', cleanPath);
    }

    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, []);

  // Update document title whenever currentPage changes
  useEffect(() => {
    if (PAGE_TITLES[currentPage]) {
      document.title = PAGE_TITLES[currentPage];
    }
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const targetPath = PAGE_ROUTES[page] || '/';

    // Update browser URL bar cleanly using HTML5 History API without #hash
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState({ page }, '', targetPath);
    }

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
        {currentPage === 'commercial' && (
          <Commercial 
            setCurrentPage={handlePageChange}
          />
        )}
        {currentPage === 'single-origin' && (
          <SingleOrigin 
            setCurrentPage={handlePageChange}
          />
        )}
        {currentPage === 'instant-coffee' && (
          <InstantCoffee 
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
