import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeatmapCalendar from '../components/HeatmapCalendar';
import { authAPI } from '../utils/api';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    authAPI.profile(selectedYear)
      .then(res => {
        if (res?.success) {
          setProfileData(res.data);
        } else {
          setError('Failed to fetch profile details.');
        }
      })
      .catch(err => {
        setError(err?.message || 'Error occurred while loading profile.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedYear]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: 'var(--paper)', color: 'var(--ink)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            Loading user profile...
          </div>
        </div>
      </>
    );
  }

  if (error || !profileData) {
    return (
      <>
        <Navbar />
        <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: 'var(--paper)', color: 'var(--ink)' }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', marginBottom: '16px' }}>Could Not Load Profile</h2>
            <p style={{ color: 'var(--ink-3)', marginBottom: '24px', fontSize: '0.9rem' }}>{error}</p>
            <button onClick={() => setSelectedYear(new Date().getFullYear())} className="btn btn-dark">Retry</button>
          </div>
        </div>
      </>
    );
  }

  const { user, stats, activity } = profileData;
  const initialLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  // Available year options for selection
  const yearsOptions = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 3; y--) {
    yearsOptions.push(y);
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="container">
          <div className="profile-grid">
            
            {/* SIDEBAR */}
            <div className="profile-sidebar">
              <div className="profile-avatar">{initialLetter}</div>
              <h2 className="profile-name">{user?.username}</h2>
              <p className="profile-email">{user?.email}</p>
              
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <span className="profile-info-label">Role</span>
                  <span className="profile-info-val" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Joined</span>
                  <span className="profile-info-val">
                    {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* MAIN DASHBOARD */}
            <div className="profile-main">
              
              {/* LIFETIME STATISTICS CARDS */}
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-label">Problems Solved</div>
                  <div className="stat-val">{stats?.totalSolved || 0}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>
                      <span>Easy: {stats?.easySolved || 0}</span>
                      <span>Medium: {stats?.mediumSolved || 0}</span>
                      <span>Hard: {stats?.hardSolved || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-label">Acceptance Rate</div>
                  <div className="stat-val">{stats?.acceptanceRate || 0}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink-4)', marginTop: '12px', fontFamily: 'var(--font-mono)' }}>
                    {stats?.acceptedSubmissions || 0} / {stats?.totalSubmissions || 0} accepted
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Current Streak</div>
                  <div className="stat-val">{stats?.currentStreak || 0} days</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink-4)', marginTop: '12px', fontFamily: 'var(--font-mono)' }}>
                    Longest streak: {stats?.longestStreak || 0} days
                  </div>
                </div>
              </div>

              {/* HEATMAP CALENDAR BOX */}
              <div className="dashboard-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 className="dash-title" style={{ margin: 0 }}>Submission Heatmap</h3>
                  
                  <select 
                    className="filter-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    style={{ padding: '6px 12px' }}
                  >
                    {yearsOptions.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <HeatmapCalendar 
                  year={activity?.year || selectedYear} 
                  contributions={activity?.contributions || {}} 
                />
              </div>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
