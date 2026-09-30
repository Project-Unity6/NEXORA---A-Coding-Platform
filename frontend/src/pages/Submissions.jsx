import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DifficultyBadge from '../components/DifficultyBadge';
import { submissionsAPI } from '../utils/api';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubmissionsLog = (targetPage = 1) => {
    setLoading(true);
    submissionsAPI.progress(targetPage)
      .then(res => {
        if (res?.success) {
          setSubmissions(res.data.submissions || []);
          setPage(res.data.pagination.currentPage);
          setTotalPages(res.data.pagination.totalPages);
        } else {
          setError('Failed to fetch submission logs.');
        }
      })
      .catch(err => {
        setError(err?.message || 'Error occurred while loading submissions.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubmissionsLog(1);
  }, []);

  return (
    <>
      <Navbar />
      <div className="problems-page">
        <div className="container">
          <div className="problems-header">
            <div>
              <h1 className="problems-title">All Submissions</h1>
              <p className="problems-subtitle">Track your historical submissions, compiler verdicts, and runtimes.</p>
            </div>
          </div>

          {error && (
            <div className="verdict-box failed" style={{ padding: '14px', fontSize: '0.85rem', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          <div className="table-wrap">
            <table className="problems-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Problem</th>
                  <th style={{ width: '20%' }}>Verdict</th>
                  <th style={{ width: '15%' }}>Language</th>
                  <th style={{ width: '15%' }}>Runtime</th>
                  <th style={{ width: '15%' }}>Memory</th>
                  <th style={{ width: '10%' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">
                      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-4)' }}>
                        Fetching your submission logs...
                      </div>
                    </td>
                  </tr>
                ) : submissions.length > 0 ? (
                  submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td>
                        {sub.problem ? (
                          <Link to={`/problems/${sub.problem.slug}`} className="prob-title-col">
                            {sub.problem.title}
                          </Link>
                        ) : (
                          <span style={{ color: 'var(--ink-4)' }}>Deleted Problem</span>
                        )}
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: 700, 
                          color: sub.status === 'Accepted' ? '#166534' : '#9B1C1C'
                        }}>
                          {sub.status}
                          <div style={{ fontSize: '0.65rem', fontWeight: 400, color: 'var(--ink-4)' }}>
                            Passed {sub.testCasesPassed}/{sub.totalTestCases}
                          </div>
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>
                        {sub.language}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        {sub.runtime !== null ? `${sub.runtime}ms` : '--'}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        {sub.memory !== null ? `${sub.memory} KB` : '--'}
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--ink-4)' }}>
                        {new Date(sub.createdAt).toLocaleDateString()}
                        <div style={{ fontSize: '0.65rem' }}>
                          {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="no-data">
                        You have not submitted any solutions to Nexora yet.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn"
                disabled={page === 1}
                onClick={() => fetchSubmissionsLog(page - 1)}
              >
                Previous
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button 
                className="page-btn"
                disabled={page === totalPages}
                onClick={() => fetchSubmissionsLog(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
