import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, problemsAPI } from '../utils/api';
import './AdminPanel.css';

const TAB_DASHBOARD = 'dashboard';
const TAB_REGISTER = 'register';
const TAB_CREATE = 'create';
const TAB_UPDATE = 'update';
const TAB_DELETE = 'delete';

export default function AdminPanel() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_DASHBOARD);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      showNotification('Error logging out', 'error');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <button onClick={() => navigate('/problems')} className="admin-back-btn" title="Back to problems">
            ←
          </button>
          <div className="admin-logo-text">Nexora <span>Admin</span></div>
        </div>

        <nav className="admin-nav">
          <NavItem 
            icon="⊞" 
            label="Dashboard" 
            isActive={activeTab === TAB_DASHBOARD} 
            onClick={() => setActiveTab(TAB_DASHBOARD)} 
          />
          
          <div className="admin-nav-header">Access Control</div>
          <NavItem 
            icon="✦" 
            label="Register Admin" 
            isActive={activeTab === TAB_REGISTER} 
            onClick={() => setActiveTab(TAB_REGISTER)} 
          />
          
          <div className="admin-nav-header">Problem Engine</div>
          <NavItem 
            icon="⊕" 
            label="Create Problem" 
            isActive={activeTab === TAB_CREATE} 
            onClick={() => setActiveTab(TAB_CREATE)} 
          />
          <NavItem 
            icon="✎" 
            label="Update Problem" 
            isActive={activeTab === TAB_UPDATE} 
            onClick={() => setActiveTab(TAB_UPDATE)} 
          />
          <NavItem 
            icon="✕" 
            label="Delete Problem" 
            isActive={activeTab === TAB_DELETE} 
            onClick={() => setActiveTab(TAB_DELETE)} 
          />
        </nav>

        <div className="admin-footer">
          <div className="admin-user-info">
            <span className="admin-username">{user?.username}</span>
            <button onClick={toggleTheme} className="theme-switch" title="Toggle Theme" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)'}}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">{activeTab.replace('-', ' ')}</h1>
        </header>

        <div className="admin-content">
          {/* Notification Toast */}
          <div className={`admin-toast ${notification.type} ${notification.show ? 'show' : ''}`}>
            <span>{notification.type === 'error' ? '⚠' : '✓'}</span>
            {notification.message}
          </div>

          <div className="admin-container">
            {activeTab === TAB_DASHBOARD && <DashboardTab />}
            {activeTab === TAB_REGISTER && <RegisterAdminTab notify={showNotification} />}
            {activeTab === TAB_CREATE && <CreateProblemTab notify={showNotification} />}
            {activeTab === TAB_UPDATE && <UpdateProblemTab notify={showNotification} />}
            {activeTab === TAB_DELETE && <DeleteProblemTab notify={showNotification} />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------
// Sub-Components
// ---------------------------------------------------------

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button className={`admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="admin-nav-icon">{icon}</span>
      {label}
    </button>
  );
}

function DashboardTab() {
  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <div className="admin-card warm">
        <h2 className="admin-h2">Welcome to Mission Control</h2>
        <p>
          This is the highly secure Nexora administration panel. From here, you have elevated access to system resources.
          You can provision new administrators, engineer advanced algorithmic problems, and maintain the platform's integrity.
          Ensure you verify all JSON payloads before executing create or update commands to prevent schema validation failures on the backend.
        </p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '16px' }}>✦</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>Security & Access</h3>
          <p style={{ fontSize: '0.85rem' }}>Provision top-tier administrator accounts with complete system read/write access.</p>
        </div>
        <div className="admin-card">
          <div style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '16px' }}>⎋</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>Problem Engineering</h3>
          <p style={{ fontSize: '0.85rem' }}>Construct complex code challenges and deploy them instantly to the production environment.</p>
        </div>
      </div>
    </div>
  );
}

function RegisterAdminTab({ notify }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.adminRegister(formData);
      notify('Administrator registered successfully');
      setFormData({ username: '', email: '', password: '' });
    } catch (err) {
      notify(err.message || 'Failed to register admin', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', animation: 'fadeIn 0.3s' }}>
      <h2 className="admin-h2">Register Administrator</h2>
      <form onSubmit={handleSubmit} className="admin-card">
        <div className="admin-form-group">
          <label className="admin-form-label">Username</label>
          <input 
            type="text" 
            required
            className="admin-input"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Email Address</label>
          <input 
            type="email" 
            required
            className="admin-input"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Password</label>
          <input 
            type="password" 
            required
            minLength={6}
            className="admin-input"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <button type="submit" disabled={loading} className="admin-btn dark full" style={{ marginTop: '24px' }}>
          {loading ? 'Processing...' : 'Provision Account'}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------
// Complex Form Builders for Problems
// ---------------------------------------------------------

const BLANK_PROBLEM_JSON = {
  title: "",
  description: "",
  difficulty: "easy",
  tags: ["arrays"],
  constraints: ["1 <= n <= 10^5"],
  visibleTestCases: [
    { input: "n = 5", output: "5", explanation: "Base case" }
  ],
  hiddenTestCases: [
    { input: "n = 10", output: "10" }
  ],
  boilerPlate: [
    { language: "python", initialCode: "def solve(n):\n    pass", driverCode: "if __name__ == '__main__':\n    pass" }
  ],
  referenceSolution: [
    { language: "python", completeCode: "def solve(n):\n    return n" }
  ]
};

function CreateProblemTab({ notify }) {
  const [jsonStr, setJsonStr] = useState(JSON.stringify(BLANK_PROBLEM_JSON, null, 2));
  const [loading, setLoading] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonStr);
      setJsonStr(JSON.stringify(parsed, null, 2));
    } catch (err) {
      notify('Invalid JSON syntax', 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = JSON.parse(jsonStr);
      setLoading(true);
      await problemsAPI.create(payload);
      notify('Problem created successfully!');
      setJsonStr(JSON.stringify(BLANK_PROBLEM_JSON, null, 2));
    } catch (err) {
      notify(err.message || 'Failed to create problem', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <div className="admin-flex-between">
        <h2 className="admin-h2" style={{ margin: 0 }}>Create Problem</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleFormat} className="admin-btn" style={{ border: '1px solid var(--border)' }}>
            Format JSON
          </button>
          <button onClick={handleSubmit} disabled={loading} className="admin-btn gold">
            {loading ? 'Saving...' : 'Deploy Problem'}
          </button>
        </div>
      </div>
      
      <div className="admin-json-container">
        <div className="admin-json-header">
          <span>problem_schema.json</span>
          <span style={{ color: 'var(--gold)' }}>RAW ENTRY</span>
        </div>
        <textarea
          value={jsonStr}
          onChange={(e) => setJsonStr(e.target.value)}
          className="admin-textarea"
          spellCheck="false"
        />
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--ink-4)', marginTop: '12px' }}>
        Ensure the JSON strictly complies with the internal MongoDB Schema validation (e.g. valid enums for tags & languages).
      </p>
    </div>
  );
}

function UpdateProblemTab({ notify }) {
  const [slug, setSlug] = useState('');
  const [jsonStr, setJsonStr] = useState('');
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchProblem = async (e) => {
    e.preventDefault();
    if (!slug) return;
    setLoadingFetch(true);
    try {
      const res = await problemsAPI.get(slug);
      setJsonStr(JSON.stringify(res.problem, null, 2));
      setHasLoaded(true);
      notify('Problem loaded for editing');
    } catch (err) {
      notify(err.message || 'Failed to fetch problem', 'error');
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = JSON.parse(jsonStr);
      setLoadingUpdate(true);
      await problemsAPI.update(slug, payload);
      notify('Problem updated successfully!');
      setHasLoaded(false);
      setSlug('');
      setJsonStr('');
    } catch (err) {
      notify(err.message || 'Failed to update problem', 'error');
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <h2 className="admin-h2">Update Problem</h2>
      
      <form onSubmit={fetchProblem} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input 
          type="text" 
          placeholder="Enter problem slug (e.g. two-sum)" 
          className="admin-input"
          style={{ maxWidth: '400px' }}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <button type="submit" disabled={loadingFetch} className="admin-btn dark">
          {loadingFetch ? 'Querying...' : 'Fetch Schema'}
        </button>
      </form>

      {hasLoaded && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
          <div className="admin-flex-between">
            <span style={{ fontSize: '0.9rem', color: 'var(--ink-2)', fontWeight: 600 }}>Editing: {slug}</span>
            <button onClick={handleUpdate} disabled={loadingUpdate} className="admin-btn gold">
              {loadingUpdate ? 'Committing...' : 'Commit Changes'}
            </button>
          </div>
          <div className="admin-json-container">
            <div className="admin-json-header">
              <span>{slug}.json</span>
            </div>
            <textarea
              value={jsonStr}
              onChange={(e) => setJsonStr(e.target.value)}
              className="admin-textarea"
              spellCheck="false"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteProblemTab({ notify }) {
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    
    setLoading(true);
    try {
      await problemsAPI.delete(slug);
      notify(`Problem "${slug}" permanently deleted`);
      setSlug('');
      setConfirm(false);
    } catch (err) {
      notify(err.message || 'Failed to delete problem', 'error');
      setConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', animation: 'fadeIn 0.3s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span style={{ fontSize: '2rem', color: '#E74C3C' }}>⚠</span>
        <h2 className="admin-h2" style={{ margin: 0 }}>Delete Problem</h2>
      </div>
      
      <div className="admin-card" style={{ borderColor: 'rgba(231, 76, 60, 0.3)' }}>
        <p style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--ink-2)' }}>
          <strong>Critical Warning:</strong> This is a destructive operation. All submissions and analytics tied to this problem may become orphaned. Proceed with extreme caution.
        </p>
        
        <div className="admin-form-group">
          <label className="admin-form-label">Target Problem Slug</label>
          <input 
            type="text" 
            placeholder="e.g. reverse-linked-list"
            className="admin-input"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setConfirm(false);
            }}
          />
        </div>
        
        <button 
          onClick={handleDelete}
          disabled={!slug || loading}
          className="admin-btn full danger"
        >
          {loading ? 'Executing Deletion...' : confirm ? 'CONFIRM DESTRUCTION' : 'Initialize Deletion'}
        </button>
      </div>
    </div>
  );
}
