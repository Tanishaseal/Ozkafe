import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { COFFEE_BEANS_DATA, COFFEE_CATEGORIES } from '../data/coffeeBeansData';
import { money } from '../data/commerce';
import { ProductImage, ShopLink } from '../components/CommerceUI';

export default function Shop({ navigate, search = '' }) {
  const params = new URLSearchParams(search);
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [sort, setSort] = useState('catalog');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const products = useMemo(() => {
    const list = COFFEE_BEANS_DATA.filter(product => (category === 'all' || product.categoryId === category) && `${product.name} ${product.category} ${product.detail || ''}`.toLowerCase().includes(query.trim().toLowerCase()));
    if (sort === 'low' || sort === 'high') list.sort((a, b) => (Math.min(...Object.values(a.prices)) - Math.min(...Object.values(b.prices))) * (sort === 'low' ? 1 : -1));
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, category, sort]);
  const reset = () => { setQuery(''); setCategory('all'); setSort('catalog'); };
  return <div className="store-page">
    <header className="store-shop-hero"><div className="container">
      <span className="store-eyebrow">THE OZKAFE ROASTERY</span>
      <h1>Your next favourite cup.</h1>
      <p>Explore estate coffees, house blends and everyday favourites.<br /> Choose your coffee, pack size and the grind for your brew.</p>
      <span className="store-hero-detail">{COFFEE_BEANS_DATA.length} coffees · {COFFEE_CATEGORIES.length} collections</span>
    </div></header>
    <div className="container store-shop-body">
      <div className="store-toolbar">
        <label className="store-search"><Search size={20} aria-hidden="true" /><span className="sr-only">Search coffees</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search coffees, estates or blends" /></label>
        <label className="store-sort">Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="catalog">Catalog order</option><option value="low">Starting price: low to high</option><option value="high">Starting price: high to low</option><option value="name">Name: A to Z</option></select></label>
        <button className="store-filter-toggle btn btn-secondary" aria-expanded={filtersOpen} aria-controls="shop-filters" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={18} />Collections</button>
      </div>
      <div className="store-catalog-layout">
        <aside id="shop-filters" className={`store-filters ${filtersOpen ? 'is-open' : ''}`}><h2>Collections</h2>
          <button className={category === 'all' ? 'is-selected' : ''} onClick={() => setCategory('all')} aria-pressed={category === 'all'}>All coffees <span>{COFFEE_BEANS_DATA.length}</span></button>
          {COFFEE_CATEGORIES.map(item => <button key={item.id} aria-pressed={category === item.id} className={category === item.id ? 'is-selected' : ''} onClick={() => setCategory(item.id)}>{item.name}<span>{COFFEE_BEANS_DATA.filter(product => product.categoryId === item.id).length}</span></button>)}
          <div className="store-filter-note"><strong>Made for your ritual.</strong><p>Choose from our available pack sizes and grind options on each product page.</p></div>
        </aside>
        <section aria-label="Coffee products"><div className="store-results-heading"><p role="status">{products.length} {products.length === 1 ? 'coffee' : 'coffees'}{category !== 'all' && ` in ${COFFEE_CATEGORIES.find(item => item.id === category)?.name || 'this collection'}`}</p>{(query || category !== 'all') && <button className="store-text-button" onClick={reset}><X size={16} />Clear filters</button>}</div>
          {products.length ? <div className="store-product-grid">{products.map(product => <article className="store-product-card" key={product.id}>
            <ShopLink navigate={navigate} page="product" params={{ id: product.id }} className="store-card-image" tabIndex={-1} aria-hidden="true"><ProductImage src={product.image} alt="" loading="lazy" /></ShopLink>
            <div className="store-card-copy"><p className="store-eyebrow">{product.category}</p><h2><ShopLink navigate={navigate} page="product" params={{ id: product.id }}>{product.name}</ShopLink></h2><p className="store-card-detail">{product.detail || `${Object.keys(product.prices).length} pack sizes available`}</p><div className="store-card-price"><span>From <strong>{money(Math.min(...Object.values(product.prices)))}</strong></span><span>Excl. 5% GST</span></div><ShopLink navigate={navigate} page="product" params={{ id: product.id }} className="btn btn-secondary" aria-label={`Choose options for ${product.name}`}>Choose options</ShopLink></div>
          </article>)}</div> : <div className="store-empty store-panel"><Search size={36} /><h2>No coffees found</h2><p>Try a different name or explore another collection.</p><button className="btn btn-primary" onClick={reset}>Reset filters</button></div>}
        </section>
      </div>
    </div>
  </div>;
}
