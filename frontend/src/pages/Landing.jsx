import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('problem');
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

  useEffect(() => {
    // Scroll reveal logic
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleCTA = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setEmailStatus('Successfully subscribed to Nexora! Let\'s start solving.');
      setEmail('');
    }
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            <span className="eyebrow-text">The premium open platform</span>
          </div>

          <h1 className="hero-h1">
            Every locked<br />coding challenge.<br />
            <em>Free.</em>
          </h1>

          <p className="hero-body">
            Access premium problems, detailed test cases, instant code execution, and real-time statistics. Master your tech interview preparation with Nexora's top-tier, fast sandbox.
          </p>

          <div className="hero-actions">
            <Link to="/problems" className="btn btn-dark btn-lg">Start solving — it's free</Link>
            <Link to="/register" className="btn btn-line btn-lg">Create account →</Link>
          </div>

          <div className="hero-proof">
            <div className="proof-item">
              <div className="proof-num">2,500+</div>
              <div className="proof-label">LeetCode problems</div>
            </div>
            <div className="proof-item">
              <div className="proof-num">&lt;200ms</div>
              <div className="proof-label">Sandbox runtime</div>
            </div>
            <div className="proof-item">
              <div className="proof-num">100%</div>
              <div className="proof-label">Privacy first</div>
            </div>
          </div>
        </div>

        {/* MOCKUP CODE PANEL */}
        <div className="hero-right">
          <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <div className="panel-tabs" style={{ background: 'var(--warm)' }}>
              <div className={`panel-tab ${activeTab === 'problem' ? 'active' : ''}`} onClick={() => setActiveTab('problem')}>Problem</div>
              <div className={`panel-tab ${activeTab === 'solution' ? 'active' : ''}`} onClick={() => setActiveTab('solution')}>Solution</div>
              <div className={`panel-tab ${activeTab === 'hint' ? 'active' : ''}`} onClick={() => setActiveTab('hint')}>AI Hint</div>
            </div>
            
            <div className="panel-content" style={{ padding: '20px', gap: '16px' }}>
              {activeTab === 'problem' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>146. LRU Cache</h3>
                    <span className="difficulty diff-medium">Medium</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className="tag">Hash Table</span>
                    <span className="tag">Linked List</span>
                    <span className="tag">Design</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--ink-2)' }}>
                    Design a data structure that follows the constraints of a <strong>Least Recently Used (LRU) cache</strong>. Implement the <code>LRUCache</code> class with <code>get</code> and <code>put</code> operations in O(1) time.
                  </p>
                </div>
              )}

              {activeTab === 'solution' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-2)' }}>
                  <div style={{ padding: '8px 12px', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                    <span>solution.py</span>
                    <span style={{ color: '#28C840' }}>● Running</span>
                  </div>
                  <pre style={{ padding: '12px', background: 'var(--warm-2)', margin: 0, overflow: 'auto', borderRadius: '0 0 6px 6px' }}>
{`class LRUCache:
  def __init__(self, capacity: int):
    self.cap = capacity
    self.cache = {}
    self.order = []

  def get(self, key: int) -> int:
    if key not in self.cache:
      return -1
    self.order.remove(key)
    self.order.append(key)
    return self.cache[key]`}
                  </pre>
                </div>
              )}

              {activeTab === 'hint' && (
                <div className="ai-bubble">
                  <div className="ai-avatar">✦</div>
                  <div className="ai-text">
                    <strong>Nexora Engine:</strong> Your current approach uses <code>list.remove()</code>, which is O(n). To get O(1) operations, use an <strong>OrderedDict</strong> or a custom <strong>Doubly Linked List</strong> with a Hash Map.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* USP STRIP */}
      <div className="usp-strip">
        <div className="usp-block reveal">
          <div className="usp-kicker">Free access</div>
          <h2 className="usp-head">All Premium Problems.<br /><span>Zero cost.</span></h2>
          <p class="usp-body">Unlock all company-specific and difficulty-level coding questions. Get full access without paying a cent.</p>
          <div className="usp-tag">✓ 2,500+ problems updated weekly</div>
        </div>
        <div className="usp-block reveal d1">
          <div className="usp-kicker">High performance</div>
          <h2 class="usp-head">Sub-200ms sandbox.<br /><span>Zero latency.</span></h2>
          <p class="usp-body">Powered by high-speed execution containers. Code, run, and evaluate your program before you've even finished thinking.</p>
          <div className="usp-tag">✓ Isolated secure run environments</div>
        </div>
        <div className="usp-block reveal d2">
          <div className="usp-kicker">Analytics driven</div>
          <h2 class="usp-head">Activity tracking.<br /><span>Streaks & heatmaps.</span></h2>
          <p class="usp-body">Keep track of your consistency with Github-style contribution graphs, streak statistics, and runtime comparisons.</p>
          <div className="usp-tag">✓ Precomputed fast statistics</div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-wrap" id="features">
        <div className="reveal" style={{ marginBottom: '40px' }}>
          <div className="section-eyebrow">Platform Capabilities</div>
          <h2 className="section-h">Engineered for the absolute interview grind.</h2>
        </div>

        <div className="feat-grid reveal">
          <div className="feat-cell">
            <div className="feat-num">01 — Editor</div>
            <h3>IDE-Grade Code Workspace</h3>
            <p>Complete syntax highlighting, autocomplete, automatic indentation, and bracket matching right inside your web browser.</p>
          </div>
          <div className="feat-cell">
            <div className="feat-num">02 — Speed</div>
            <h3>Optimized Sandbox Containers</h3>
            <p>Get instant feedback on test cases. Run solutions against standard input or custom test cases with sub-200ms feedback loop.</p>
          </div>
          <div className="feat-cell">
            <div className="feat-num">03 — Analytics</div>
            <h3>Streak & Heatmap Systems</h3>
            <p>Visualize your progress. Track daily submissions, keep your streaks alive, and view detailed progress charts.</p>
          </div>
          <div className="feat-cell">
            <div className="feat-num">04 — Submissions</div>
            <h3>Comprehensive History logs</h3>
            <p>Inspect every single line of code you've written, runtimes, memory, and status codes for past challenges.</p>
          </div>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="compare-wrap" id="compare">
        <div className="compare-inner reveal">
          <div className="section-eyebrow">Comparison</div>
          <h2 className="section-h">Why engineers prepare with Nexora.</h2>
          
          <table className="compare-table">
            <thead>
              <tr>
                <th>Features</th>
                <th className="col-nexora">
                  <span className="col-head">Nexora</span>
                  <div style={{ fontSize: '0.65rem', fontWeight: 400, marginTop: '4px' }}>Free forever</div>
                </th>
                <th>
                  <span className="col-head">LeetCode</span>
                  <div style={{ fontSize: '0.65rem', fontWeight: 400, marginTop: '4px' }}>Premium $35/mo</div>
                </th>
                <th>
                  <span className="col-head">HackerRank</span>
                  <div style={{ fontSize: '0.65rem', fontWeight: 400, marginTop: '4px' }}>Free</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>All locked coding problems</td>
                <td className="col-nexora"><span className="check">✓</span> 2,500+</td>
                <td><span className="price-free">Locked ($35)</span></td>
                <td><span className="cross">✕ No LeetCode</span></td>
              </tr>
              <tr>
                <td>Interactive Code Editor</td>
                <td className="col-nexora"><span className="check">✓</span> Yes</td>
                <td><span className="check">✓</span> Yes</td>
                <td><span className="cross">✕ Limited</span></td>
              </tr>
              <tr>
                <td>Sub-200ms execution runtime</td>
                <td className="col-nexora"><span className="check">✓</span> Yes</td>
                <td><span className="check">✓</span> Yes</td>
                <td><span className="cross">✕ Average</span></td>
              </tr>
              <tr>
                <td>Github-style heatmap & streaks</td>
                <td className="col-nexora"><span className="check">✓</span> Yes</td>
                <td><span className="check">✓</span> Yes</td>
                <td><span className="cross">✕ Basic</span></td>
              </tr>
              <tr>
                <td>Cost</td>
                <td className="col-nexora"><span className="price-free">₹0</span></td>
                <td><span className="price-free">$35/mo</span></td>
                <td><span className="price-free">Free</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-wrap reveal">
        <div className="section-eyebrow">Get Started</div>
        <h2 className="cta-h">Stop paying for what should be <em>free.</em></h2>
        <p className="cta-sub">Join thousands of high-performing developers practicing coding questions on Nexora.</p>
        
        <form onSubmit={handleCTA} className="cta-form">
          <input 
            type="email" 
            placeholder="your@email.com" 
            className="cta-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-dark" style={{ padding: '14px 28px' }}>
            Get started →
          </button>
        </form>
        {emailStatus && (
          <p style={{ marginTop: '16px', color: '#166534', fontWeight: 600, fontSize: '0.85rem' }}>{emailStatus}</p>
        )}
        <p style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--ink-4)' }}>Free forever · No credit card required</p>
      </div>

      <Footer />
    </>
  );
}
