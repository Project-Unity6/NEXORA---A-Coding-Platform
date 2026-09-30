import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate('/problems');
    } catch (err) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-wrap">
        <div className="auth-left">
          <div className="auth-box">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Log in to your Nexora account to resume solving.</p>
            
            {error && (
              <div className="verdict-box failed" style={{ padding: '12px', fontSize: '0.8rem', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email-input">Email Address</label>
                <input 
                  type="email" 
                  id="email-input"
                  className="form-input" 
                  placeholder="name@domain.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password-input">Password</label>
                <input 
                  type="password" 
                  id="password-input"
                  className="form-input" 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-dark" 
                style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                disabled={submitting}
              >
                {submitting ? 'Authenticating...' : 'Log in →'}
              </button>
            </form>

            <p className="auth-footer-text">
              Don't have an account? <Link to="/register">Sign up free</Link>
            </p>
          </div>
        </div>

        <div className="auth-right">
          <div style={{ maxWidth: '480px' }}>
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              <span className="eyebrow-text">Interactive playground</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', color: 'var(--ink)' }}>
              Evaluate code in real-time.
            </h3>
            <p style={{ color: 'var(--ink-3)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '28px' }}>
              Nexora executes your code inside secure, sandboxed docker runtime environments and provides direct testcase evaluations in under 200 milliseconds.
            </p>
            
            <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <span className="t-r" style={{ width: '10px', height: '10px', borderRadius: '50%' }}></span>
                <span className="t-a" style={{ width: '10px', height: '10px', borderRadius: '50%' }}></span>
                <span className="t-g" style={{ width: '10px', height: '10px', borderRadius: '50%' }}></span>
              </div>
              <div style={{ color: 'var(--syn-kw)' }}>import <span style={{ color: 'var(--ink)' }}>sys</span></div>
              <div style={{ color: 'var(--syn-kw)' }}>def <span style={{ color: 'var(--syn-fn)' }}>validate</span>(input_val):</div>
              <div style={{ color: 'var(--ink-3)' }}>  # Computing O(1) solutions</div>
              <div style={{ color: 'var(--syn-kw)' }}>  return <span style={{ color: 'var(--syn-str)' }}>"Accepted"</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
