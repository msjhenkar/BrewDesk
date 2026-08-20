import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authApi';
import './Register.css';

const FIELDS = [
  { name: 'firstName', label: 'First Name',    type: 'text',     placeholder: 'John',           half: true },
  { name: 'lastName',  label: 'Last Name',     type: 'text',     placeholder: 'Doe',            half: true },
  { name: 'email',     label: 'Email',         type: 'email',    placeholder: 'you@example.com', half: false },
  { name: 'phone',     label: 'Phone',         type: 'tel',      placeholder: '10-digit number', half: false },
  { name: 'password',  label: 'Password',      type: 'password', placeholder: 'Min. 6 chars',    half: true },
  { name: 'confirm',   label: 'Confirm Password', type: 'password', placeholder: '••••••••',    half: true },
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!/^\d{10}$/.test(form.phone)) e.phone = '10-digit number required';
    if (form.password.length < 6) e.password = 'Min. 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      setLoading(true);
      await registerUser({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim(),
        password:  form.password,
        phone:     form.phone.trim(),
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setApiError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">

        {/* Logo */}
        <div className="register-brand">
          <span className="brand-icon">☕</span>
          <h1 className="brand-name">BrewDesk</h1>
          <p className="brand-subtitle">Create your account</p>
        </div>

        {/* Card */}
        <div className="register-card">
          <h2>Get started</h2>
          <p className="card-subtitle">Fill in your details below</p>

          {apiError && (
            <div className="error-banner">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="register-form">
              {FIELDS.map(field => (
                <div key={field.name} className={`form-group ${field.half ? 'half-width' : 'full-width'} ${errors[field.name] ? 'has-error' : ''}`}>
                  <label htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                  />
                  {errors[field.name] && (
                    <p className="error-message">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              id="register-btn"
              type="submit"
              disabled={loading}
              className="register-btn"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="signin-link">
            Already have an account?{' '}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
