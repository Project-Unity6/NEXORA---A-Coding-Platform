import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, theme, toggleTheme, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="nav">
      <Link to="/" className="logo">
        <span className="logo-mark">⌥</span>
        Nexora<span className="logo-sub">.</span>
      </Link>

      <ul className={`nav-links ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
        <li>
          <NavLink to="/problems" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
            Problems
          </NavLink>
        </li>
        {user && (
          <>
            <li>
              <NavLink to="/submissions" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                Submissions
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                Profile
              </NavLink>
            </li>
            {user.role === 'admin' && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'active text-[var(--gold)] font-bold' : ''} onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>

      <div className="nav-right">
        <button 
          onClick={toggleTheme} 
          className="btn-icon theme-switch" 
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user ? (
          <>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-2)', display: 'none', md: 'inline' }}>
              {user.username}
            </span>
            <button onClick={handleLogout} className="btn btn-line">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-line">Log in</Link>
            <Link to="/register" className="btn btn-dark">Sign up free →</Link>
          </>
        )}

        {/* Mobile menu toggle */}
        <button 
          className="btn-icon" 
          style={{ display: 'none', border: 'none', fontSize: '1.25rem' }} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          id="mobile-menu-toggle"
        >
          ☰
        </button>
      </div>

      <style>{`
        @media (max-width: 960px) {
          #mobile-menu-toggle {
            display: grid !important;
          }
        }
      `}</style>
    </nav>
  );
}
