import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/orderApi';
import '../styles/Checkout.css';

const PAYMENT_METHODS = [
  { id: 'CASH', label: 'Cash', icon: '💵' },
  { id: 'CARD', label: 'Card', icon: '💳' },
  { id: 'UPI',  label: 'UPI',  icon: '📱' },
];

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    phoneNumber: '',
    tableNumber: '',
    paymentMethod: 'CASH',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Name is required';
    if (!/^[0-9]{10}$/.test(form.phoneNumber))
      e.phoneNumber = 'Enter a valid 10-digit phone number';
    if (cart.length === 0) e.cart = 'Cart is empty';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      customerName: form.customerName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      tableNumber: form.tableNumber ? parseInt(form.tableNumber) : null,
      paymentMethod: form.paymentMethod,
      items: cart.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      setLoading(true);
      setApiError('');
      const res = await placeOrder(payload);
      clearCart();
      navigate('/order/success', { state: { order: res.data } });
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
        'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <p>🛒 Your cart is empty.</p>
          <Link to="/order/menu" id="checkout-back-menu" className="checkout-empty-link">
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* NAV */}
      <nav className="checkout-nav">
        <Link to="/order/cart" className="checkout-back" id="checkout-back-cart">
          ← Back to Cart
        </Link>
        <span className="checkout-nav-title">Checkout</span>
      </nav>

      {/* STEPS INDICATOR */}
      <div className="checkout-steps">
        <div className="checkout-step checkout-step-done">
          <span>1</span> Menu
        </div>
        <div className="checkout-step-line checkout-step-line-done" />
        <div className="checkout-step checkout-step-done">
          <span>2</span> Cart
        </div>
        <div className="checkout-step-line checkout-step-line-done" />
        <div className="checkout-step checkout-step-active">
          <span>3</span> Checkout
        </div>
        <div className="checkout-step-line" />
        <div className="checkout-step">
          <span>4</span> Confirm
        </div>
      </div>

      <main className="checkout-main">
        {/* FORM */}
        <section className="checkout-form-section">
          <h2 className="checkout-section-title">Your Details</h2>

          {apiError && <div className="checkout-api-error">{apiError}</div>}

          <form id="checkout-form" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="co-field">
              <label htmlFor="customerName" className="co-label">
                Full Name <span className="co-required">*</span>
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                className={`co-input ${errors.customerName ? 'co-input-error' : ''}`}
                placeholder="e.g. Arjun Sharma"
                value={form.customerName}
                onChange={handleChange}
              />
              {errors.customerName && (
                <p className="co-error-msg">{errors.customerName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="co-field">
              <label htmlFor="phoneNumber" className="co-label">
                Phone Number <span className="co-required">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                maxLength={10}
                className={`co-input ${errors.phoneNumber ? 'co-input-error' : ''}`}
                placeholder="10-digit mobile number"
                value={form.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <p className="co-error-msg">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Table Number */}
            <div className="co-field">
              <label htmlFor="tableNumber" className="co-label">
                Table Number <span className="co-optional">(optional)</span>
              </label>
              <input
                id="tableNumber"
                name="tableNumber"
                type="number"
                min="1"
                className="co-input"
                placeholder="Leave blank for takeaway"
                value={form.tableNumber}
                onChange={handleChange}
              />
            </div>

            {/* Payment Method */}
            <div className="co-field">
              <label className="co-label">Payment Method</label>
              <div className="co-payment-grid">
                {PAYMENT_METHODS.map(pm => (
                  <label
                    key={pm.id}
                    id={`pay-${pm.id.toLowerCase()}`}
                    className={`co-payment-option ${form.paymentMethod === pm.id ? 'co-payment-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.id}
                      checked={form.paymentMethod === pm.id}
                      onChange={handleChange}
                      className="co-payment-radio"
                    />
                    <span className="co-payment-icon">{pm.icon}</span>
                    <span className="co-payment-label">{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              id="place-order-btn"
              type="submit"
              className="co-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <><span className="co-btn-spinner" /> Placing Order…</>
              ) : (
                `Place Order  ₹${totalAmount.toFixed(2)}`
              )}
            </button>
          </form>
        </section>

        {/* SUMMARY */}
        <aside className="checkout-summary">
          <h2 className="checkout-section-title">Order Summary</h2>
          <div className="checkout-summary-list">
            {cart.map(item => (
              <div key={item.id} className="checkout-summary-row">
                <span className="checkout-summary-name">
                  {item.name}
                  <span className="checkout-summary-qty"> × {item.quantity}</span>
                </span>
                <span className="checkout-summary-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-summary-total">
            <span>Total</span>
            <span className="checkout-summary-total-amt">₹{totalAmount.toFixed(2)}</span>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Checkout;
