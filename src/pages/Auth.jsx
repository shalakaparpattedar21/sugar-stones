
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(
    params.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const nav = useNavigate();

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      if (mode === 'login') {
        await login(form);
      } else {
        await register(form);
      }

      nav('/account');
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <img
            src="/assets/images/logo.png"
            alt="Sugar & Stones"
          />
        </div>

        <span className="section__eyebrow">
          {mode === 'login' ? 'Welcome Back' : 'Join Sugar & Stones'}
        </span>

        <h1>{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>

        <p>
          {mode === 'login'
            ? 'Sign in to view your wishlist, orders and saved details.'
            : 'Create an account for faster checkout and order tracking.'}
        </p>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>

          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <Field
              label="Full Name"
              name="name"
              value={form.name}
              onChange={change}
              required
            />
          )}

          {mode === 'signup' && (
            <Field
              label="Mobile Number"
              name="phone"
              value={form.phone}
              onChange={change}
            />
          )}

          <Field
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            required
          />

          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            required
            minLength="6"
          />

          {message && <div className="form-error">{message}</div>}

          <button
            className="btn btn--gold auth-submit"
            disabled={busy}
          >
            {busy
              ? 'Please wait…'
              : mode === 'login'
                ? 'Sign In'
                : 'Create My Account'}
          </button>
        </form>

        {mode === 'login' && (
          <button
            className="forgot-link"
            onClick={() =>
              setMessage(
                'Password reset is not available yet. Please contact us and we will help you recover your account.'
              )
            }
          >
            Forgot password?
          </button>
        )}

        <p className="auth-note">
          By continuing, you agree to our terms and privacy policy.
        </p>

        <Link to="/shop" className="auth-back">
          Continue shopping →
        </Link>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', ...props }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input name={name} type={type} {...props} />
    </label>
  );
}
