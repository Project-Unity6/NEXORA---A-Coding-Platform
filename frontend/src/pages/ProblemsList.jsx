import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DifficultyBadge from '../components/DifficultyBadge';
import Tag from '../components/Tag';
import { problemsAPI } from '../utils/api';

export default function ProblemsList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    problemsAPI.getAll()
      .then(res => {
        if (res?.success && Array.isArray(res.problems)) {
          setProblems(res.problems);
        } else {
          setError('Failed to load problems list.');
        }
      })
      .catch(err => {
        console.error('Error fetching problems:', err);
        setError(err?.message || 'Could not fetch problems from server.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Extract all unique tags dynamically from fetched problems
  const allTags = useMemo(() => {
    const tags = new Set();
    problems.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
      const matchesTag = tagFilter === 'all' || (p.tags && p.tags.includes(tagFilter));
      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [problems, search, difficultyFilter, tagFilter]);

  return (
    <>
      <Navbar />
      <div className="problems-page">
        <div className="container">
          <div className="problems-header">
            <div>
              <h1 className="problems-title">Problems</h1>
              <p className="problems-subtitle">Practice coding challenges, submit solutions, and track your progress.</p>
            </div>
          </div>

          <div className="filters-bar">
            <input 
              type="text" 
              placeholder="Search problems by title..." 
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select 
              className="filter-select"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select 
              className="filter-select"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table className="problems-table">
              <thead>
                <tr>
                  <th style={{ width: '12%' }}>Status</th>
                  <th style={{ width: '43%' }}>Title</th>
                  <th style={{ width: '15%' }}>Difficulty</th>
                  <th style={{ width: '30%' }}>Tags</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4">
                      <div className="no-data" style={{ border: 'none', background: 'transparent' }}>
                        Loading problem set from database...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4">
                      <div className="no-data" style={{ color: '#9B1C1C' }}>
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : filteredProblems.length > 0 ? (
                  filteredProblems.map((prob) => (
                    <tr key={prob.slug}>
                      <td>
                        {prob.status === 'Solved' ? (
                          <span style={{ 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: '0.78rem', 
                            color: '#166534', 
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            ✓ Solved
                          </span>
                        ) : (
                          <span style={{ 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: '0.78rem', 
                            color: 'var(--ink-4)' 
                          }}>
                            ⃝ Todo
                          </span>
                        )}
                      </td>
                      <td>
                        <Link to={`/problems/${prob.slug}`} className="prob-title-col">
                          {prob.title}
                        </Link>
                      </td>
                      <td>
                        <DifficultyBadge difficulty={prob.difficulty} />
                      </td>
                      <td>
                        <div className="tags-cell">
                          {prob.tags && prob.tags.map(t => (
                            <Tag key={t}>{t}</Tag>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="no-data">
                        No problems match the specified search and filter criteria.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
