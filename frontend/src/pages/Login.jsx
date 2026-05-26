import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      setLoading(true);
      const res = await loginUser(form);
      const userData = res.data;
      console.log(userData);
      login(userData);
      if (userData.role === 'ADMIN') {
        navigate('/menu', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <span className="brand-icon">☕</span>
          <h1 className="brand-name">BrewDesk</h1>
          <p className="brand-subtitle">Cafe Management System</p>
        </div>

        {/* Heading */}
        <div className="login-header">
          <h2>Sign in to your account</h2>
          <p>Enter your credentials to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="error-banner">
            {error}
          </div>
        )}

        {/* Form */}
        <form id="login-form" className="login-form" onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <button type="button" className="forgot-link">Forgot password?</button>
            </div>
            <div className="input-with-toggle">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button id="login-btn" type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Signing in…
              </>
            ) : 'Sign In'}
          </button>

        </form>

        <p className="signup-link">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
