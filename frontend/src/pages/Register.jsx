import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authApi';

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
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-amber-800 to-amber-500 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">☕</div>
          <h1 className="text-3xl font-extrabold text-white">BrewDesk</h1>
          <p className="text-amber-200 text-sm mt-1">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Get started</h2>
          <p className="text-gray-500 text-sm mb-6">Fill in your details below</p>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {FIELDS.map(field => (
                <div key={field.name} className={field.half ? '' : 'col-span-2'}>
                  <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition ${
                      errors[field.name] ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              id="register-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 font-semibold hover:text-amber-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
