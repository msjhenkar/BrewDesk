import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMenuItems } from '../services/api';
import { useCart } from '../context/CartContext';
import '../styles/CustomerMenu.css';

const CATEGORIES = ['All', 'Beverages', 'Cold Drinks', 'Quick Bites', 'Desserts', 'Meals'];

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState({});

  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(6);
  const [isLastPage, setIsLastPage] = useState(false);

  const { addToCart, totalItems } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await getAllMenuItems(pageNo, pageSize);
        const data = res.data || [];
        setMenuItems(data);
        setIsLastPage(data.length < pageSize);
      } catch {
        setError('Could not load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [pageNo, pageSize]);

  const filtered = menuItems.filter(item => {
    const matchCat = category === 'All' || item.category === category;
    const matchSearch =
      item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.itemName,
      price: item.price,
      image: item.imageUrl,
      category: item.category,
    });
    setAddedIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [item.id]: false })), 1200);
  };

  const getCategoryEmoji = (cat) => {
    const map = {
      Beverages: '☕',
      'Cold Drinks': '🧊',
      'Quick Bites': '🥪',
      Desserts: '🍰',
      Meals: '🍽️',
    };
    return map[cat] || '🍴';
  };

  return (
    <div className="cm-page">
      {/* NAVBAR */}
      <nav className="cm-navbar">
        <div className="cm-navbar-brand">
          <span className="cm-brand-icon">☕</span>
          <div>
            <p className="cm-brand-name">BrewDesk</p>
            <p className="cm-brand-sub">Order from Menu</p>
          </div>
        </div>
        <Link to="/order/cart" className="cm-cart-btn" id="view-cart-btn">
          🛒 Cart
          {totalItems > 0 && (
            <span className="cm-cart-badge">{totalItems}</span>
          )}
        </Link>
      </nav>

      {/* HERO */}
      <header className="cm-hero">
        <h1 className="cm-hero-title">What would you like today?</h1>
        <p className="cm-hero-subtitle">
          Freshly crafted beverages &amp; bites made with love ☕
        </p>

        <div className="cm-search-wrap">
          <span className="cm-search-icon">🔍</span>
          <input
            id="menu-search"
            type="text"
            className="cm-search"
            placeholder="Search your favourite..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* CATEGORIES */}
      <div className="cm-categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            id={`cat-btn-${cat.toLowerCase().replace(/\s/g, '-')}`}
            className={`cm-cat-btn ${category === cat ? 'cm-cat-active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat !== 'All' && <span>{getCategoryEmoji(cat)}</span>} {cat}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <main className="cm-main">
        {loading && (
          <div className="cm-loading">
            <div className="cm-spinner" />
            <p>Loading menu…</p>
          </div>
        )}

        {error && <div className="cm-error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="cm-empty">
            <p>😔 No items found. Try a different search.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="cm-grid">
              {filtered.map(item => (
                <div
                  key={item.id}
                  id={`menu-card-${item.id}`}
                  className={`cm-card ${!item.available ? 'cm-card-unavailable' : ''}`}
                >
                  {/* Image */}
                  <div className="cm-card-img-wrap">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.itemName} className="cm-card-img" />
                    ) : (
                      <div className="cm-card-img-placeholder">
                        {getCategoryEmoji(item.category)}
                      </div>
                    )}
                    {!item.available && (
                      <div className="cm-unavailable-badge">Unavailable</div>
                    )}
                    <div className="cm-category-chip">{item.category}</div>
                  </div>

                  {/* Body */}
                  <div className="cm-card-body">
                    <h3 className="cm-item-name">{item.itemName}</h3>
                    {item.description && (
                      <p className="cm-item-desc">{item.description}</p>
                    )}

                    <div className="cm-card-footer">
                      <span className="cm-price">₹{item.price}</span>
                      <button
                        id={`add-to-cart-${item.id}`}
                        disabled={!item.available}
                        onClick={() => handleAddToCart(item)}
                        className={`cm-add-btn ${addedIds[item.id] ? 'cm-add-btn-added' : ''}`}
                      >
                        {addedIds[item.id] ? '✓ Added!' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {!search.trim() && (
              <div className="pagination-bar">
                <button 
                  className="pagination-btn"
                  onClick={() => setPageNo(prev => Math.max(1, prev - 1))}
                  disabled={pageNo === 1}
                >
                  ◀ Previous
                </button>
                <span className="pagination-info">
                  Page <strong>{pageNo}</strong>
                </span>
                <button 
                  className="pagination-btn"
                  onClick={() => setPageNo(prev => prev + 1)}
                  disabled={isLastPage}
                >
                  Next ▶
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CustomerMenu;
