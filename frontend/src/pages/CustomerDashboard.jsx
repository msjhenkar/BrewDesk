import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getAllMenuItems } from '../services/api';
import { placeOrder, getAllOrders } from '../services/orderApi';
import '../styles/CustomerDashboard.css';

/* ── Constants ─────────────────────────────────────────────────────────────── */
const STATUS_CLASS = {
  PENDING: 'status-pending',
  CONFIRMED: 'status-confirmed',
  PREPARING: 'status-preparing',
  COMPLETED: 'status-completed',
  CANCELLED: 'status-cancelled',
};

const CATEGORY_EMOJI = {
  Beverages: '☕',
  'Cold Drinks': '🧊',
  'Quick Bites': '🥪',
  Desserts: '🍰',
  Meals: '🍽️',
};

/* ── Skeleton card ─────────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="cd-card cd-card--skeleton">
    <div className="cd-skeleton-img" />
    <div className="cd-card-body">
      <div className="cd-skeleton-line cd-skeleton-line--wide" />
      <div className="cd-skeleton-line" />
      <div className="cd-skeleton-line cd-skeleton-line--short" />
    </div>
    <div className="cd-skeleton-btn" />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { cart, addToCart, removeFromCart, increment, decrement,
    clearCart, totalItems, totalAmount } = useCart();
  const navigate = useNavigate();



  /* ── UI state ── */
  const [activeSection, setActiveSection] = useState('menu');  // 'menu' | 'orders' | 'profile'
  const [cartOpen, setCartOpen] = useState(false);   // mobile cart drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);   // mobile sidebar

  /* ── Menu state ── */
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(6);
  const [isLastPage, setIsLastPage] = useState(false);

  /* ── Orders state ── */
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  /* ── Order placement ── */
  const [placing, setPlacing] = useState(false);
  const [orderMsg, setOrderMsg] = useState(null);

  /* ── Fetch menu on mount and page change ── */
  useEffect(() => { fetchMenu(); }, [pageNo, pageSize]);

  /* ── Fetch orders when section opens ── */
  useEffect(() => {
    if (activeSection === 'orders') fetchOrders();
  }, [activeSection]);

  const fetchMenu = async () => {
    try {
      setMenuLoading(true);
      setMenuError('');
      const res = await getAllMenuItems(pageNo, pageSize);
      const data = Array.isArray(res.data) ? res.data : [];
      setMenuItems(data);
      setIsLastPage(data.length < pageSize);
    } catch {
      setMenuError('Could not load menu. Is the server running?');
    } finally {
      setMenuLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await getAllOrders();
      const all = Array.isArray(res.data) ? res.data : [];
      setOrders(all.filter(o => String(o.userId) === String(user?.id)));
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  /* ── Derived ── */
  const categories = ['All', ...new Set(menuItems.map(i => i.category).filter(Boolean))];
  const filteredMenu = menuItems.filter(item => {
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchSearch = !search ||
      (item.itemName || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  /* ── Handlers ── */
  const handleAddToCart = (item) => {
    addToCart({
      id: item.id, name: item.itemName, price: item.price,
      emoji: CATEGORY_EMOJI[item.category] || '🍴'
    });
    setAddedIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [item.id]: false })), 1000);
    setCartOpen(true); // open cart drawer on mobile when item is added
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    try {
      setPlacing(true);
      setOrderMsg(null);
      await placeOrder({
        userId: user.id,
        menuItems: cart.map(i => ({ menuItemId: i.id, quantity: i.quantity })),
      });
      clearCart();
      setCartOpen(false);
      setOrderMsg({ type: 'success', text: '🎉 Order placed! Check "Order History" to track it.' });
      setActiveSection('orders');
    } catch (err) {
      setOrderMsg({ type: 'error', text: err.response?.data?.message || 'Failed to place order.' });
    } finally {
      setPlacing(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const navTo = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  /* ══════════════════════ RENDER ══════════════════════════ */
  return (
    <div className="cd-page">

      {/* ─────────── TOP NAVBAR ─────────── */}
      <header className="cd-header">
        <div className="cd-header-left">
          {/* Hamburger (mobile) */}
          <button className="cd-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <div className="cd-brand">
            <span className="cd-brand-icon">☕</span>
            <div>
              <p className="cd-brand-name">BrewDesk</p>
              <p className="cd-brand-sub">Customer Portal</p>
            </div>
          </div>
        </div>

        <div className="cd-header-right">
          <span className="cd-welcome">Hello, <strong>{user?.firstName}</strong> 👋</span>
          {/* Cart toggle (mobile) */}
          <button className="cd-cart-toggle" onClick={() => setCartOpen(!cartOpen)} id="cart-toggle-btn">
            🛒
            {totalItems > 0 && <span className="cd-cart-badge">{totalItems}</span>}
          </button>
          <button onClick={handleLogout} className="cd-logout-btn">Sign Out</button>
        </div>
      </header>

      {/* ─────────── BODY (sidebar + content + cart) ─────────── */}
      <div className="cd-body">

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && <div className="cd-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ─── LEFT SIDEBAR ─── */}
        <aside className={`cd-sidebar ${sidebarOpen ? 'cd-sidebar--open' : ''}`}>
          <div className="cd-sidebar-logo">
            <span>☕</span>
            <div>
              <p className="cd-brand-name">BrewDesk</p>
              <p className="cd-brand-sub">Customer Portal</p>
            </div>
          </div>

          <nav className="cd-sidebar-nav">
            {[
              { id: 'menu', icon: '🍽️', label: 'Menu' },
              { id: 'orders', icon: '📦', label: 'Order History' },
              { id: 'profile', icon: '👤', label: 'Profile' },
            ].map(item => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => navTo(item.id)}
                className={`cd-nav-item ${activeSection === item.id ? 'cd-nav-item--active' : ''}`}
              >
                <span className="cd-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="cd-sidebar-footer">
            <div className="cd-user-chip">
              <div className="cd-user-avatar">{user?.firstName?.[0]?.toUpperCase()}</div>
              <div>
                <p className="cd-user-name">{user?.firstName}</p>
                <p className="cd-user-role">Customer</p>
              </div>
            </div>
            <button onClick={handleLogout} className="cd-sidebar-logout">↩ Sign Out</button>
          </div>
        </aside>

        {/* ─── CENTRE CONTENT ─── */}
        <main className="cd-content">

          {/* Banner */}
          {orderMsg && (
            <div className={`cd-banner cd-banner--${orderMsg.type}`}>
              <span>{orderMsg.text}</span>
              <button className="cd-banner-close" onClick={() => setOrderMsg(null)}>×</button>
            </div>
          )}

          {/* ══ MENU SECTION ══ */}
          {activeSection === 'menu' && (
            <section>
              <div className="cd-hero">
                <h1 className="cd-hero-title">What would you like today? ☕</h1>
                <p className="cd-hero-sub">Browse our freshly crafted menu and add items to your cart</p>
              </div>

              {/* Search */}
              <div className="cd-search-wrap">
                <span className="cd-search-icon">🔍</span>
                <input
                  id="menu-search"
                  type="text"
                  placeholder="Search menu items…"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setPageNo(1);
                  }}
                  className="cd-search"
                />
              </div>

              {/* Category pills */}
              {!menuLoading && categories.length > 1 && (
                <div className="cd-cats">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setPageNo(1);
                      }}
                      className={`cd-cat-btn ${categoryFilter === cat ? 'cd-cat-btn--active' : ''}`}
                    >
                      {cat !== 'All' && CATEGORY_EMOJI[cat] ? `${CATEGORY_EMOJI[cat]} ` : ''}{cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Error */}
              {menuError && (
                <div className="cd-error">
                  {menuError}
                  <button className="cd-error-retry" onClick={fetchMenu}>Retry</button>
                </div>
              )}

              {/* Skeletons */}
              {menuLoading && (
                <div className="cd-grid">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* Empty */}
              {!menuLoading && !menuError && filteredMenu.length === 0 && (
                <div className="cd-empty">
                  <div className="cd-empty-icon">😕</div>
                  <p className="cd-empty-title">No items found</p>
                  <button className="cd-empty-btn" onClick={() => { setSearch(''); setCategoryFilter('All'); }}>
                    Clear filters
                  </button>
                </div>
              )}

              {/* Grid */}
              {!menuLoading && !menuError && filteredMenu.length > 0 && (
                <>
                  <div className="cd-grid">
                    {filteredMenu.map(item => {
                      const unavailable = item.available === false;
                      return (
                        <div
                          key={item.id}
                          id={`menu-item-${item.id}`}
                          className={`cd-card ${unavailable ? 'cd-card--unavailable' : ''}`}
                        >
                          <div className="cd-card-img-wrap">
                            {item.imageUrl
                              ? <img src={item.imageUrl} alt={item.itemName} className="cd-card-img" />
                              : <span className="cd-card-emoji">{CATEGORY_EMOJI[item.category] || '🍴'}</span>
                            }
                            {unavailable && <div className="cd-unavailable-overlay">Unavailable</div>}
                          </div>
                          <div className="cd-card-body">
                            <div className="cd-card-header">
                              <h3 className="cd-item-name">{item.itemName}</h3>
                              <span className="cd-item-price">₹{item.price}</span>
                            </div>
                            {item.description && <p className="cd-item-desc">{item.description}</p>}
                            <span className="cd-item-cat">{item.category}</span>
                          </div>
                          <button
                            id={`add-${item.id}`}
                            disabled={unavailable}
                            onClick={() => handleAddToCart(item)}
                            className={`cd-add-btn ${addedIds[item.id] ? 'cd-add-btn--added' : ''} ${unavailable ? 'cd-add-btn--disabled' : ''}`}
                          >
                            {addedIds[item.id] ? '✓ Added!' : '+ Add to Cart'}
                          </button>
                        </div>
                      );
                    })}
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
            </section>
          )}

          {/* ══ ORDER HISTORY SECTION ══ */}
          {activeSection === 'orders' && (
            <section>
              <div className="cd-section-header">
                <div>
                  <h2 className="cd-section-title">Order History</h2>
                  <p className="cd-section-sub">Track all your past and current orders</p>
                </div>
                <button className="cd-refresh-btn" onClick={fetchOrders}>↻ Refresh</button>
              </div>

              {ordersLoading ? (
                <div className="cd-empty">
                  <span className="cd-spinner cd-spinner--large" />
                  <p>Loading orders…</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="cd-empty">
                  <div className="cd-empty-icon">📦</div>
                  <p className="cd-empty-title">No orders yet</p>
                  <button className="cd-empty-btn" onClick={() => setActiveSection('menu')}>Order Now</button>
                </div>
              ) : (
                <div className="cd-orders-list">
                  {orders.map(order => (
                    <div key={order.id} id={`order-${order.id}`} className="cd-order-card">
                      <div className="cd-order-top">
                        <div>
                          <p className="cd-order-id">Order <span>#{order.id}</span></p>
                          <p className="cd-order-date">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Just placed'}
                          </p>
                        </div>
                        <span className={`cd-status-badge ${STATUS_CLASS[order.status] || 'status-default'}`}>
                          {order.status}
                        </span>
                      </div>
                      {order.menuItems?.length > 0 && (
                        <div className="cd-order-items">
                          {order.menuItems.map((mi, idx) => (
                            <div key={idx} className="cd-order-item-row">
                              <span>{mi.menuItemName || `Item #${mi.menuItemId}`} × {mi.quantity}</span>
                              <span>₹{mi.subtotal ?? (mi.price * mi.quantity) ?? '—'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="cd-order-total-row">
                        <span>Total</span>
                        <span className="cd-order-total-amt">
                          ₹{parseFloat(order.totalAmount ?? order.total ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ══ PROFILE SECTION ══ */}
          {activeSection === 'profile' && (
            <section>
              <h2 className="cd-section-title">My Profile</h2>
              <p className="cd-section-sub">Your account information</p>

              <div className="cd-profile-card">
                <div className="cd-profile-avatar">{user?.firstName?.[0]?.toUpperCase()}</div>
                <div className="cd-profile-info">
                  <h3 className="cd-profile-name">{user?.firstName}</h3>
                  <p className="cd-profile-role">Customer Account</p>
                </div>
              </div>

              <div className="cd-profile-fields">
                {[
                  { label: 'First Name', value: user?.firstName },
                  { label: 'Email',      value: user?.email },
                  { label: 'Phone',      value: user?.phone },
                  { label: 'Account ID', value: `#${user?.id}` },
                  { label: 'Role',       value: user?.role },
                ].map(field => (
                  <div key={field.label} className="cd-profile-field">
                    <p className="cd-field-label">{field.label}</p>
                    <p className="cd-field-value">{field.value || '—'}</p>
                  </div>
                ))}
              </div>

              <div className="cd-profile-actions">
                <button className="cd-profile-action-btn" onClick={() => setActiveSection('orders')}>
                  📦 View Order History
                </button>
                <button className="cd-profile-action-btn cd-profile-action-btn--danger" onClick={handleLogout}>
                  ↩ Sign Out
                </button>
              </div>
            </section>
          )}
        </main>

        {/* ─── RIGHT CART PANEL ─── */}
        {(cartOpen || true) && ( // always rendered; CSS hides it on mobile unless cartOpen
          <aside className={`cd-cart-panel ${cartOpen ? 'cd-cart-panel--open' : ''}`}>
            <div className="cd-cart-panel-header">
              <h3 className="cd-cart-title">🛒 Your Cart</h3>
              {totalItems > 0 && <span className="cd-cart-count">{totalItems} items</span>}
              <button className="cd-cart-panel-close" onClick={() => setCartOpen(false)}>×</button>
            </div>

            {cart.length === 0 ? (
              <div className="cd-cart-empty">
                <span className="cd-cart-empty-icon">🛒</span>
                <p>Cart is empty</p>
                <small>Add items from the menu</small>
              </div>
            ) : (
              <>
                <div className="cd-cart-items">
                  {cart.map(item => (
                    <div key={item.id} id={`cart-row-${item.id}`} className="cd-cart-row">
                      <div className="cd-cart-emoji">{item.emoji}</div>
                      <div className="cd-cart-info">
                        <p className="cd-cart-name">{item.name}</p>
                        <p className="cd-cart-unit">₹{item.price}</p>
                      </div>
                      <div className="cd-qty-ctrl">
                        <button id={`dec-${item.id}`} className="cd-qty-btn" onClick={() => decrement(item.id)}>−</button>
                        <span className="cd-qty-val">{item.quantity}</span>
                        <button id={`inc-${item.id}`} className="cd-qty-btn" onClick={() => increment(item.id)}>+</button>
                      </div>
                      <button id={`remove-${item.id}`} className="cd-remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  ))}
                </div>

                <div className="cd-cart-footer">
                  <div className="cd-summary-divider" />
                  <div className="cd-summary-total">
                    <span>Total</span>
                    <span className="cd-summary-total-amt">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    id="place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="cd-place-btn"
                  >
                    {placing
                      ? <><span className="cd-spinner" /> Placing…</>
                      : `Place Order  ₹${totalAmount.toFixed(2)}`
                    }
                  </button>
                </div>
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
