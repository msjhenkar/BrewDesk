import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/OrderSuccess.css';

const PREP_MESSAGES = [
  '☕ Our baristas are already brewing your order!',
  '🔥 Your order is warming up in the kitchen!',
  '⏳ Estimated wait: 10–15 minutes. Sit back & relax!',
];

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % PREP_MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [order]);

  // If user navigated directly without state, redirect to menu
  if (!order) {
    return (
      <div className="os-page">
        <div className="os-no-order">
          <p>No order found. Please place an order first.</p>
          <Link to="/order/menu" className="os-menu-link" id="success-back-menu">
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = {
    PENDING:    '#f59e0b',
    CONFIRMED:  '#3b82f6',
    PREPARING:  '#8b5cf6',
    READY:      '#10b981',
    DELIVERED:  '#059669',
    CANCELLED:  '#ef4444',
  }[order.status] || '#6b7280';

  return (
    <div className="os-page">
      <div className="os-card">
        {/* Confetti icon */}
        <div className="os-success-icon">🎉</div>

        <h1 className="os-title">Order Placed!</h1>
        <p className="os-subtitle">Thank you for your order. We got it!</p>

        {/* Order Details */}
        <div className="os-details">
          <div className="os-detail-row">
            <span className="os-detail-label">Order ID</span>
            <span id="order-id" className="os-detail-value os-detail-id">
              #{order.id}
            </span>
          </div>

          <div className="os-detail-row">
            <span className="os-detail-label">Total Amount</span>
            <span id="order-total" className="os-detail-value os-detail-price">
              ₹{parseFloat(order.totalAmount ?? order.total ?? 0).toFixed(2)}
            </span>
          </div>

          <div className="os-detail-row">
            <span className="os-detail-label">Status</span>
            <span
              id="order-status"
              className="os-status-badge"
              style={{ background: statusColor }}
            >
              {order.status}
            </span>
          </div>

          {order.tableNumber && (
            <div className="os-detail-row">
              <span className="os-detail-label">Table</span>
              <span id="order-table" className="os-detail-value">
                #{order.tableNumber}
              </span>
            </div>
          )}

          <div className="os-detail-row">
            <span className="os-detail-label">Payment</span>
            <span id="order-payment" className="os-detail-value">
              {order.paymentMethod}
            </span>
          </div>
        </div>

        {/* Rotating prep message */}
        <div className={`os-prep-msg ${visible ? 'os-prep-visible' : 'os-prep-hidden'}`}>
          {PREP_MESSAGES[msgIndex]}
        </div>

        {/* CTA buttons */}
        <div className="os-actions">
          <Link to="/order/menu" id="order-again-btn" className="os-primary-btn">
            Order Again
          </Link>
          <button
            id="track-order-btn"
            className="os-secondary-btn"
            onClick={() => navigate('/order/menu')}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
