import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div>
        <div className="foot-logo">Nexora<span>.</span></div>
        <div className="foot-copy">© {new Date().getFullYear()} Nexora Technologies. All rights reserved.</div>
      </div>
      <div className="foot-links">
        <Link to="/problems">Problems</Link>
        <a href="#features">Features</a>
        <a href="#compare">Comparison</a>
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </footer>
  );
}
