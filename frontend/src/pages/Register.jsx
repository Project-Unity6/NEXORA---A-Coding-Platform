import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ username, email, password });
      navigate('/problems');
    } catch (err) {
      setError(err?.message || 'Registration failed. Try a different username/email.');
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
            <h2 className="auth-title">Create account</h2>
            <p className="auth-subtitle">Join Nexora for full access to standard problems and statistics.</p>
            
            {error && (
              <div className="verdict-box failed" style={{ padding: '12px', fontSize: '0.8rem', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="username-input">Username</label>
                <input 
                  type="text" 
                  id="username-input"
                  className="form-input" 
                  placeholder="codeguru"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

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
                <label className="form-label" htmlFor="password-input">Password (min 6 chars)</label>
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
                {submitting ? 'Registering...' : 'Sign up free →'}
              </button>
            </form>

            <p className="auth-footer-text">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>

        <div className="auth-right">
          <div style={{ maxWidth: '480px' }}>
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              <span className="eyebrow-text">Practice makes perfect</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', color: 'var(--ink)' }}>
              Unlock interview consistency.
            </h3>
            <p style={{ color: 'var(--ink-3)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '28px' }}>
              Create your account to unlock premium tracking. Stay motivated by maintaining your daily streak and tracking your solved problem counts across Easy, Medium, and Hard challenges.
            </p>
            
            <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', display: 'flex', gap: '20px', boxShadow: 'var(--shadow-md)' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--ink-4)', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>Easy Solved</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>84</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--ink-4)', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>Current Streak</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>12 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
