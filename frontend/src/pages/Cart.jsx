import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, increment, decrement, totalItems, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <nav className="cart-nav">
          <Link to="/order/menu" className="cart-back-link" id="cart-back-to-menu">
            ← Back to Menu
          </Link>
          <span className="cart-nav-title">Your Cart</span>
        </nav>

        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious items from our menu!</p>
          <Link to="/order/menu" id="go-to-menu-btn" className="cart-browse-btn">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* NAV */}
      <nav className="cart-nav">
        <Link to="/order/menu" className="cart-back-link" id="cart-back-to-menu">
          ← Back to Menu
        </Link>
        <span className="cart-nav-title">Your Cart ({totalItems} items)</span>
      </nav>

      <main className="cart-main">
        {/* ITEMS COLUMN */}
        <section className="cart-items-section">
          <h2 className="cart-section-title">Order Items</h2>

          <div className="cart-items-list">
            {cart.map(item => (
              <div key={item.id} id={`cart-item-${item.id}`} className="cart-item-card">
                <div className="cart-item-img-wrap">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  ) : (
                    <div className="cart-item-img-placeholder">☕</div>
                  )}
                </div>

                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-cat">{item.category}</p>
                  <p className="cart-item-unit-price">₹{item.price} each</p>
                </div>

                <div className="cart-item-controls">
                  <div className="cart-qty-row">
                    <button
                      id={`decrement-${item.id}`}
                      className="cart-qty-btn"
                      onClick={() => decrement(item.id)}
                    >
                      −
                    </button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      id={`increment-${item.id}`}
                      className="cart-qty-btn"
                      onClick={() => increment(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-subtotal">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    id={`remove-${item.id}`}
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SUMMARY COLUMN */}
        <aside className="cart-summary">
          <h2 className="cart-section-title">Order Summary</h2>

          <div className="cart-summary-rows">
            {cart.map(item => (
              <div key={item.id} className="cart-summary-row">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="cart-divider" />

          <div className="cart-total-row">
            <span>Total</span>
            <span className="cart-total-amount">₹{totalAmount.toFixed(2)}</span>
          </div>

          <p className="cart-tax-note">* Taxes & charges included</p>

          <button
            id="proceed-to-checkout-btn"
            className="cart-checkout-btn"
            onClick={() => navigate('/order/checkout')}
          >
            Proceed to Checkout →
          </button>

          <Link to="/order/menu" className="cart-continue-link" id="continue-shopping-link">
            Continue shopping
          </Link>
        </aside>
      </main>
    </div>
  );
};

export default Cart;
