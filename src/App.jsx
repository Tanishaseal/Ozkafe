import React, { useState, useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Commercial from './pages/Commercial';
import SingleOrigin from './pages/SingleOrigin';
import InstantCoffee from './pages/InstantCoffee';
import CoffeeBeans from './pages/CoffeeBeans';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import FlyToCartAnimation from './components/FlyToCartAnimation';
import { getProductBackImage } from './data/coffeeBeansData';
import { normalizeCart, supportsGrind } from './data/commerce';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Orders, { OrderConfirmation } from './pages/Orders';
import { newCheckout } from './data/checkout';
import './commerce.css';

const PAGE_TITLES = {
  shop: 'Shop Coffee | Ozkafe',
  product: 'Coffee Details | Ozkafe',
  checkout: 'Checkout | Ozkafe',
  orders: 'Order Previews | Ozkafe',
  confirmation: 'Order Preview | Ozkafe',
  home: 'Ozkafe | Specialty Coffee Roastery & Cafe Experience Center | Kolkata',
  about: 'About Us | Ozkafe Specialty Coffee Roastery & Cafe | Kolkata',
  commercial: 'Commercial Blends & Wholesale Solutions | Ozkafe Kolkata',
  'single-origin': 'Single Origin Estate Coffees | Ozkafe Kolkata',
  'instant-coffee': 'Instant Coffee & Cold Brew | Ozkafe Kolkata',
  'coffee-beans': 'Coffee Beans & Roastery Shelf | Ozkafe Kolkata',
  cart: 'Shopping Cart | Ozkafe Specialty Coffee Roastery | Kolkata',
  contact: 'Contact & Directions | Ozkafe Ballygunge | Kolkata',
  faq: 'Frequently Asked Questions | Ozkafe Specialty Coffee & Cafe'
};

const PAGE_ROUTES = {
  shop: '/shop', product: '/product', checkout: '/checkout', orders: '/orders', confirmation: '/confirmation',
  home: '/',
  about: '/aboutus',
  commercial: '/commercial',
  'single-origin': '/single-origin',
  'instant-coffee': '/instant-coffee',
  cart: '/cart',
  contact: '/contactus',
  faq: '/faq',
  'coffee-beans': '/coffee-beans'
};

const getPageFromLocation = () => {
  if (typeof window === 'undefined') return 'home';

  // 1. Check pathname (e.g. /, /home, /aboutus, /commercial, /single-origin, /instant-coffee, /contactus, /faq)
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const storePage = ['shop', 'product', 'checkout', 'orders', 'confirmation'].find(page => pathname === `/${page}`);
  if (storePage) return storePage;
  
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
  if (pathname === '/cart' || pathname === '/shopping-cart') {
    return 'cart';
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
  if (hash === 'cart') return 'cart';

  return 'home';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(getPageFromLocation);
  const [routeSearch, setRouteSearch] = useState(window.location.search);
  const [checkoutDraft, setCheckoutDraft] = useState(newCheckout);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ozkafe_cart');
      return saved ? normalizeCart(JSON.parse(saved)) : [];
    } catch {
      return [];
    }
  });
  const [flyingItems, setFlyingItems] = useState([]);
  const [isCartBumping, setIsCartBumping] = useState(false);
  const [cartToast, setCartToast] = useState(null);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ozkafe_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cart]);

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
      setRouteSearch(window.location.search);
    };

    // If initial URL had a hash like #home, replace it cleanly with clean path (e.g. / for home)
    if (window.location.hash) {
      const initialPage = getPageFromLocation();
      const cleanPath = (PAGE_ROUTES[initialPage] || '/') + window.location.search;
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

  const handlePageChange = (page, params) => {
    setCurrentPage(page);
    const search = params ? `?${new URLSearchParams(params)}` : '';
    setRouteSearch(search);
    const targetPath = (PAGE_ROUTES[page] || '/') + search;

    // Update browser URL bar cleanly using HTML5 History API without #hash
    if (window.location.pathname + window.location.search !== targetPath || window.location.hash) {
      window.history.pushState({ page }, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (coffee, event = null, options = {}) => {
    const sizeKeys = Object.keys(coffee.prices || {});
    const defaultSize = options.selectedSize || (
      sizeKeys.includes('250g') 
        ? '250g' 
        : sizeKeys.includes('100g') 
          ? '100g' 
          : sizeKeys.includes('500 ml') 
            ? '500 ml' 
            : sizeKeys[0] || 'Standard'
    );
    const defaultGrind = supportsGrind(coffee) ? (options.selectedGrind || 'Whole Beans') : '';
    const quantity = Number.isSafeInteger(options.quantity) && options.quantity > 0 ? options.quantity : 1;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.coffeeId === coffee.id && item.selectedSize === defaultSize && item.selectedGrind === defaultGrind
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + quantity
        };
        return normalizeCart(updated);
      }

      const newItem = {
        id: `${coffee.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        coffeeId: coffee.id,
        name: coffee.name,
        category: coffee.category,
        categoryId: coffee.categoryId,
        detail: coffee.detail || '',
        image: coffee.image,
        backImage: coffee.backImage || getProductBackImage(coffee),
        prices: coffee.prices,
        selectedSize: defaultSize,
        selectedGrind: defaultGrind,
        quantity
      };

      return normalizeCart([...prevCart, newItem]);
    });

    // 1. Calculate flying start and end coordinates
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    const cartBtn = document.querySelector('.nav-cart-btn');
    let targetX = window.innerWidth - 60;
    let targetY = 35;
    if (cartBtn) {
      const rect = cartBtn.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    const flyId = `fly-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setFlyingItems((prev) => [
      ...prev,
      {
        id: flyId,
        startX,
        startY,
        targetX,
        targetY,
        image: coffee.image || '/images/coffee_packet.png',
        name: coffee.name
      }
    ]);

    // 2. When the flying order reaches the cart icon, trigger cart bump & badge pulse
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
      setIsCartBumping(true);
      setTimeout(() => setIsCartBumping(false), 550);
    }, 700);

    // 3. Show non-intrusive toast with "View Cart" CTA
    setCartToast({
      name: coffee.name,
      id: Date.now()
    });
    setTimeout(() => {
      setCartToast((prev) => (prev && prev.name === coffee.name ? null : prev));
    }, 3500);

    // NOTE: Does NOT open the cart directly. User stays on current page until Cart icon is clicked!
  };

  const handleUpdateCartItem = (itemId, updates) => {
    setCart((prevCart) =>
      normalizeCart(prevCart.map((item) => (item.id === itemId ? { ...item, ...updates } : item)))
    );
  };

  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleDemoOrder = () => {
    if (!cart.length) return;
    const id = `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    setOrders(previous => [{ id, createdAt: new Date().toISOString(), items: structuredClone(cart), details: structuredClone(checkoutDraft) }, ...previous]);
    setCart([]);
    setCheckoutDraft(newCheckout());
    setCartToast(null);
    handlePageChange('confirmation', { id });
  };

  return (
    <div className="app-layout">
      <a href="#main-content" className="store-skip-link">Skip to content</a>
      {/* Navbar with brand and navigation links */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={handlePageChange}
        totalCartItems={totalCartItems}
        isCartBumping={isCartBumping}
      />

      {/* Fly-to-Cart Animation Portal */}
      <FlyToCartAnimation items={flyingItems} />

      {/* Main Pages */}
      <main id="main-content" tabIndex={-1}>
        {currentPage === 'shop' && <Shop key={routeSearch} search={routeSearch} navigate={handlePageChange} />}
        {currentPage === 'product' && <Product key={routeSearch} productId={new URLSearchParams(routeSearch).get('id')} navigate={handlePageChange} onAddToCart={handleAddToCart} />}
        {currentPage === 'checkout' && <Checkout cart={cart} navigate={handlePageChange} draft={checkoutDraft} setDraft={setCheckoutDraft} onComplete={handleDemoOrder} />}
        {currentPage === 'orders' && <Orders orders={orders} navigate={handlePageChange} clearOrders={() => setOrders([])} />}
        {currentPage === 'confirmation' && <OrderConfirmation order={orders.find(order => order.id === new URLSearchParams(routeSearch).get('id'))} navigate={handlePageChange} />}
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
            onAddToCart={handleAddToCart}
          />
        )}
        {currentPage === 'single-origin' && (
          <SingleOrigin 
            setCurrentPage={handlePageChange}
            onAddToCart={handleAddToCart}
          />
        )}
        {currentPage === 'instant-coffee' && (
          <InstantCoffee 
            setCurrentPage={handlePageChange}
            onAddToCart={handleAddToCart}
          />
        )}
        {currentPage === 'coffee-beans' && (
          <CoffeeBeans 
            setCurrentPage={handlePageChange}
            onAddToCart={handleAddToCart}
          />
        )}
        {currentPage === 'cart' && (
          <Cart 
            cart={cart}
            updateCartItem={handleUpdateCartItem}
            removeFromCart={handleRemoveFromCart}
            clearCart={handleClearCart}
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

      {/* Added to Cart Floating Toast */}
      {cartToast && (
        <div className="cart-toast-notification" role="status" aria-live="polite">
          <div className="cart-toast-content">
            <Check size={18} className="cart-toast-check" aria-hidden="true" />
            <div className="cart-toast-text">
              <strong>Added to Cart!</strong>
              <span>{cartToast.name}</span>
            </div>
          </div>
          <button 
            type="button" 
            className="cart-toast-view-btn"
            onClick={() => {
              setCartToast(null);
              handlePageChange('cart');
            }}
          >
            <span>View Cart</span>
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer 
        setCurrentPage={handlePageChange}
      />
    </div>
  );
}
