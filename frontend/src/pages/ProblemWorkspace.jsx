import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DifficultyBadge from '../components/DifficultyBadge';
import Tag from '../components/Tag';
import CodeEditor from '../components/CodeEditor';
import { problemsAPI, submissionsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function ProblemWorkspace() {
  const { slug } = useParams();
  const { theme } = useAuth();
  
  // Problem Details
  const [problem, setProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [problemError, setProblemError] = useState('');

  // Selected Language & Source Code
  const [language, setLanguage] = useState('python');
  const [sourceCode, setSourceCode] = useState('');
  
  // Left Panel Navigation
  const [leftTab, setLeftTab] = useState('problem');
  const [problemSubmissions, setProblemSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [subPage, setSubPage] = useState(1);
  const [subTotalPages, setSubTotalPages] = useState(1);
  
  // Submission Detail
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [loadingSubmissionDetail, setLoadingSubmissionDetail] = useState(false);

  // Bottom Console / Result Panel
  const [consoleTab, setConsoleTab] = useState('testcase'); // 'testcase' | 'result'
  const [customInput, setCustomInput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);

  // ─── RESIZABLE PANEL STATE ───
  // Horizontal split: left panel width as percentage of workspace width
  const [leftPanelPercent, setLeftPanelPercent] = useState(45);
  // Vertical split: editor height as percentage of right panel content area
  const [editorPercent, setEditorPercent] = useState(60);

  const workspaceRef = useRef(null);
  const rightPanelRef = useRef(null);
  const isDraggingHRef = useRef(false);  // horizontal (left-right)
  const isDraggingVRef = useRef(false);  // vertical (editor-console)
  const rafRef = useRef(null);

  // ─── HORIZONTAL RESIZE (LEFT ↔ RIGHT PANELS) ───
  const handleHPointerDown = useCallback((e) => {
    e.preventDefault();
    isDraggingHRef.current = true;
    e.target.setPointerCapture(e.pointerId);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleHPointerMove = useCallback((e) => {
    if (!isDraggingHRef.current || !workspaceRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = workspaceRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let pct = (x / rect.width) * 100;
      pct = Math.max(20, Math.min(70, pct)); // clamp between 20% and 70%
      setLeftPanelPercent(pct);
    });
  }, []);

  const handleHPointerUp = useCallback(() => {
    isDraggingHRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // ─── VERTICAL RESIZE (EDITOR ↕ CONSOLE) ───
  const handleVPointerDown = useCallback((e) => {
    e.preventDefault();
    isDraggingVRef.current = true;
    e.target.setPointerCapture(e.pointerId);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleVPointerMove = useCallback((e) => {
    if (!isDraggingVRef.current || !rightPanelRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = rightPanelRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      let pct = (y / rect.height) * 100;
      pct = Math.max(20, Math.min(85, pct)); // clamp between 20% and 85%
      setEditorPercent(pct);
    });
  }, []);

  const handleVPointerUp = useCallback(() => {
    isDraggingVRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Auto-sync initial code based on boilerplate
  useEffect(() => {
    setLoadingProblem(true);
    setProblemError('');
    problemsAPI.get(slug)
      .then(res => {
        if (res?.problem) {
          setProblem(res.problem);
          // Set initial code for default language
          const bp = res.problem.boilerPlate || [];
          const initialLang = bp[0]?.language || 'python';
          setLanguage(initialLang);
          const defaultCode = bp.find(item => item.language === initialLang)?.initialCode || '';
          setSourceCode(defaultCode);
        } else {
          setProblemError('Failed to parse problem response.');
        }
      })
      .catch(err => {
        setProblemError(err?.message || 'Problem could not be loaded.');
      })
      .finally(() => {
        setLoadingProblem(false);
      });
  }, [slug]);

  // Load submissions for "Submissions" tab
  const loadSubmissions = (page = 1) => {
    setLoadingSubs(true);
    problemsAPI.submissions(slug, page)
      .then(res => {
        if (res?.success) {
          setProblemSubmissions(res.data.submissions || []);
          setSubPage(res.data.pagination.currentPage);
          setSubTotalPages(res.data.pagination.totalPages);
        }
      })
      .catch(err => {
        console.error('Failed to load submissions', err);
      })
      .finally(() => {
        setLoadingSubs(false);
      });
  };

  useEffect(() => {
    if (leftTab === 'submissions') {
      setSelectedSubmissionId(null);
      loadSubmissions(1);
    }
  }, [leftTab]);

  const loadSubmissionDetail = async (id) => {
    setSelectedSubmissionId(id);
    setLoadingSubmissionDetail(true);
    setSubmissionDetail(null);
    try {
      const res = await problemsAPI.submission(slug, id);
      if (res?.success) {
        setSubmissionDetail(res.data.submission);
      }
    } catch (err) {
      console.error('Failed to load submission details', err);
    } finally {
      setLoadingSubmissionDetail(false);
    }
  };

  // Handle language switch
  const handleLanguageChange = (e) => {
    const nextLang = e.target.value;
    setLanguage(nextLang);
    const code = problem?.boilerPlate?.find(bp => bp.language === nextLang)?.initialCode || '';
    setSourceCode(code);
  };

  // Run Code logic
  const handleRunCode = async () => {
    if (running || submitting) return;
    setRunning(true);
    setRunResult(null);
    setSubmitResult(null);
    setConsoleTab('result');
    try {
      // Build test cases array if customInput is present, otherwise send visible inputs
      const customTestCases = customInput 
        ? [{ input: customInput, output: '', explanation: '' }]
        : (problem?.visibleTestCases || []).map(tc => ({ input: tc.input }));

      const res = await submissionsAPI.run(slug, {
        language,
        sourceCode,
        customTestCases
      });
      setRunResult(res?.runResult);
    } catch (err) {
      setRunResult({
        status: 'Error',
        errorMessage: err?.message || 'Execution error occured'
      });
    } finally {
      setRunning(false);
    }
  };

  // Submit Code logic
  const handleSubmitCode = async () => {
    if (running || submitting) return;
    setSubmitting(true);
    setRunResult(null);
    setSubmitResult(null);
    setConsoleTab('result');
    try {
      const res = await submissionsAPI.submit(slug, {
        language,
        sourceCode
      });
      setSubmitResult(res?.submission);
      // Reload submissions list if tab is active
      if (leftTab === 'submissions') {
        loadSubmissions(1);
      }
    } catch (err) {
      setSubmitResult({
        status: 'Error',
        errorMessage: err?.message || 'Submission error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProblem) {
    return (
      <>
        <Navbar />
        <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: 'var(--paper)', color: 'var(--ink)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            Loading challenge workspace...
          </div>
        </div>
      </>
    );
  }

  if (problemError || !problem) {
    return (
      <>
        <Navbar />
        <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: 'var(--paper)', color: 'var(--ink)' }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', marginBottom: '16px' }}>Could Not Load Workspace</h2>
            <p style={{ color: 'var(--ink-3)', marginBottom: '24px', fontSize: '0.9rem' }}>{problemError || 'Problem details missing.'}</p>
            <Link to="/problems" className="btn btn-dark">Return to Problems List</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="workspace resizable-workspace"
        ref={workspaceRef}
        style={{
          gridTemplateColumns: `${leftPanelPercent}% 0px 1fr`,
        }}
      >
        
        {/* LEFT PANEL: DESCRIPTION / SUBMISSIONS / HINTS */}
        <div className="panel">
          <div className="panel-tabs">
            <div 
              className={`panel-tab ${leftTab === 'problem' ? 'active' : ''}`}
              onClick={() => setLeftTab('problem')}
            >
              Problem Description
            </div>
            <div 
              className={`panel-tab ${leftTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setLeftTab('submissions')}
            >
              Submissions
            </div>
            <div 
              className={`panel-tab ${leftTab === 'hint' ? 'active' : ''}`}
              onClick={() => setLeftTab('hint')}
            >
              AI Hint
            </div>
          </div>

          <div className="panel-content">
            {leftTab === 'problem' && (
              <>
                <div>
                  <h1 className="workspace-title">{problem.title}</h1>
                  <div className="workspace-meta">
                    <DifficultyBadge difficulty={problem.difficulty} />
                    <div className="tags-cell">
                      {problem.tags?.map(t => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </div>
                </div>

                <div 
                  className="workspace-desc" 
                  dangerouslySetInnerHTML={{ __html: problem.description }}
                />

                {problem.constraints && problem.constraints.length > 0 && (
                  <div>
                    <h3 className="workspace-section-title">Constraints</h3>
                    <ul className="workspace-list">
                      {problem.constraints.map((c, i) => (
                        <li key={i}><code>{c}</code></li>
                      ))}
                    </ul>
                  </div>
                )}

                {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                  <div>
                    <h3 className="workspace-section-title">Examples</h3>
                    {problem.visibleTestCases.map((tc, index) => (
                      <div key={index} style={{ marginBottom: '16px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '6px' }}>
                          Example {index + 1}
                        </div>
                        <pre style={{ margin: 0, padding: '12px', background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-2)' }}>
                          <strong>Input:</strong> {tc.input}
                          <br />
                          <strong>Output:</strong> {tc.output}
                          {tc.explanation && (
                            <>
                              <br />
                              <strong>Explanation:</strong> {tc.explanation}
                            </>
                          )}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {leftTab === 'submissions' && (
              <div className="submissions-list">
                {selectedSubmissionId ? (
                  <div>
                    <button onClick={() => setSelectedSubmissionId(null)} className="btn btn-line" style={{marginBottom: '16px', padding: '6px 12px', fontSize: '0.75rem'}}>← Back to List</button>
                    {loadingSubmissionDetail ? (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-4)', textAlign: 'center', padding: '20px' }}>Loading details...</div>
                    ) : submissionDetail ? (
                      <div>
                        <h3 className="workspace-section-title" style={{marginBottom: '16px'}}>Submission Details</h3>
                        <div className={`verdict-box ${submissionDetail.status === 'Accepted' ? 'accepted' : 'failed'}`}>
                          <div className="verdict-title">{submissionDetail.status}</div>
                          <div className="verdict-meta" style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                            <span>Runtime: {submissionDetail.runtime !== null ? `${submissionDetail.runtime}ms` : 'N/A'}</span>
                            <span>Memory: {submissionDetail.memory !== null ? `${submissionDetail.memory} KB` : 'N/A'}</span>
                            <span>Language: <span style={{textTransform: 'capitalize'}}>{submissionDetail.language}</span></span>
                            <span>Passed: {submissionDetail.testCasesPassed}/{submissionDetail.totalTestCases}</span>
                          </div>
                          {submissionDetail.errorMessage && (
                            <pre className="verdict-error" style={{marginTop: '12px'}}>{submissionDetail.errorMessage}</pre>
                          )}
                        </div>
                        <h4 style={{fontSize: '0.9rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px'}}>Submitted Code</h4>
                        <pre style={{ margin: 0, padding: '16px', background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-2)', overflowX: 'auto' }}>
                          {submissionDetail.sourceCode}
                        </pre>
                      </div>
                    ) : (
                      <div className="no-data">Failed to load submission details.</div>
                    )}
                  </div>
                ) : (
                  <>
                    <h3 className="workspace-section-title">Your Submission History</h3>
                    
                    {loadingSubs ? (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-4)', textAlign: 'center', padding: '20px' }}>
                        Loading history...
                      </div>
                    ) : problemSubmissions.length > 0 ? (
                      <>
                        {problemSubmissions.map((sub) => (
                          <div 
                            className="submission-row-card" 
                            key={sub.id} 
                            style={{cursor: 'pointer'}}
                            onClick={() => loadSubmissionDetail(sub.id)}
                          >
                            <div className="sub-row-left">
                              <span style={{ 
                                fontWeight: 700, 
                                color: sub.status === 'Accepted' ? '#166534' : '#9B1C1C',
                                fontSize: '0.85rem'
                              }}>
                                {sub.status}
                              </span>
                              <span className="sub-row-meta">
                                {sub.language} · Passed {sub.testCasesPassed}/{sub.totalTestCases}
                              </span>
                            </div>
                            <div className="sub-row-right">
                              <span className="sub-row-meta">
                                {new Date(sub.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
    
                        {subTotalPages > 1 && (
                          <div className="pagination" style={{ marginTop: '16px' }}>
                            <button 
                              className="page-btn"
                              disabled={subPage === 1}
                              onClick={() => loadSubmissions(subPage - 1)}
                            >
                              Prev
                            </button>
                            <span className="page-info">Page {subPage} of {subTotalPages}</span>
                            <button 
                              className="page-btn"
                              disabled={subPage === subTotalPages}
                              onClick={() => loadSubmissions(subPage + 1)}
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="no-data">
                        You haven't made any submissions for this problem yet.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {leftTab === 'hint' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="ai-bubble">
                  <div className="ai-avatar">✦</div>
                  <div className="ai-text">
                    <strong>Nexora Engine:</strong> 
                    <p style={{ marginTop: '6px' }}>
                      To solve <strong>{problem.title}</strong> optimally, think about data structures that give you efficient access:
                    </p>
                    <ul style={{ paddingLeft: '16px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>For indexing checks, does a Hash Map/Set help achieve O(1) average lookups?</li>
                      <li>Check constraint sizes to decide if you need O(n log n) sorting or if O(n) is achievable.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── VERTICAL RESIZE HANDLE (LEFT ↔ RIGHT) ─── */}
        <div
          className="resize-handle-h"
          onPointerDown={handleHPointerDown}
          onPointerMove={handleHPointerMove}
          onPointerUp={handleHPointerUp}
        />

        {/* RIGHT PANEL: EDITOR & CONSOLE */}
        <div className="panel" style={{ background: 'var(--warm)' }} ref={rightPanelRef}>
          
          {/* TOP SECTION: EDITOR HEADER + CODE EDITOR */}
          <div
            className="right-panel-top"
            style={{ height: `${editorPercent}%` }}
          >
            {/* EDITOR HEADER */}
            <div className="editor-header">
              <div className="traffic">
                <span className="t-r"></span>
                <span className="t-a"></span>
                <span className="t-g"></span>
              </div>
              
              <select 
                className="editor-lang-select"
                value={language}
                onChange={handleLanguageChange}
              >
                {problem.boilerPlate?.map(bp => (
                  <option key={bp.language} value={bp.language}>
                    {bp.language.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* CODE EDITOR */}
            <div className="editor-wrapper">
              <CodeEditor 
                value={sourceCode} 
                onChange={setSourceCode}
                language={language}
                theme={theme}
              />
            </div>
          </div>

          {/* ─── HORIZONTAL RESIZE HANDLE (EDITOR ↕ CONSOLE) ─── */}
          <div
            className="resize-handle-v"
            onPointerDown={handleVPointerDown}
            onPointerMove={handleVPointerMove}
            onPointerUp={handleVPointerUp}
          />

          {/* BOTTOM SECTION: CONSOLE / RESULT DRAWER */}
          <div
            className="right-panel-bottom"
            style={{ height: `calc(${100 - editorPercent}% - 6px)` }}
          >
            <div className="panel-tabs" style={{ background: 'var(--warm)' }}>
              <div 
                className={`panel-tab ${consoleTab === 'testcase' ? 'active' : ''}`}
                onClick={() => setConsoleTab('testcase')}
              >
                Testcases
              </div>
              <div 
                className={`panel-tab ${consoleTab === 'result' ? 'active' : ''}`}
                onClick={() => setConsoleTab('result')}
              >
                Run Results
              </div>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {consoleTab === 'testcase' && (
                <div>
                  <div className="testcase-tabs">
                    {problem.visibleTestCases?.map((_, idx) => (
                      <button 
                        key={idx}
                        className={`testcase-tab ${selectedTestCaseIdx === idx ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedTestCaseIdx(idx);
                          setCustomInput(''); // Reset custom input when selecting preset
                        }}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                    <button 
                      className={`testcase-tab ${customInput ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTestCaseIdx(-1);
                        if (!customInput) setCustomInput(' '); // Set initial placeholder
                      }}
                    >
                      Custom Input
                    </button>
                  </div>

                  {selectedTestCaseIdx !== -1 ? (
                    <div className="testcase-box">
                      <label>Input</label>
                      <div className="testcase-val">
                        {problem.visibleTestCases?.[selectedTestCaseIdx]?.input}
                      </div>
                      <label>Expected Output</label>
                      <div className="testcase-val">
                        {problem.visibleTestCases?.[selectedTestCaseIdx]?.output}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="form-label" style={{ fontSize: '0.7rem', color: 'var(--ink-4)', marginBottom: '8px' }}>
                        Provide custom input lines
                      </label>
                      <textarea 
                        className="custom-input-area"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder={"e.g. [2, 7, 11, 15]\n9"}
                      />
                    </div>
                  )}
                </div>
              )}

              {consoleTab === 'result' && (
                <div>
                  {running && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-4)' }}>
                      Evaluating solution against sandbox testcases...
                    </div>
                  )}
                  {submitting && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-4)' }}>
                      Submitting solution to Judge0 pipeline...
                    </div>
                  )}

                  {!running && !submitting && !runResult && !submitResult && (
                    <div className="no-data">
                      Run or Submit your code to check compiler verdict here.
                    </div>
                  )}

                  {/* Run Code result display */}
                  {runResult && (
                    <div className={`verdict-box ${runResult.status === 'Accepted' ? 'accepted' : 'failed'}`}>
                      <div className="verdict-title">
                        Verdict: {runResult.status}
                      </div>
                      <div className="verdict-meta">
                        <span>Runtime: {runResult.runtime || 0}ms</span>
                        <span>Passed cases: {runResult.testCasesPassed || 0}</span>
                      </div>
                      {runResult.errorMessage && (
                        <pre className="verdict-error">{runResult.errorMessage}</pre>
                      )}
                      
                      {runResult.executionResults && runResult.executionResults.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '8px' }}>Testcase evaluation:</div>
                          {runResult.executionResults.map((exec, idx) => (
                            <div key={idx} style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '4px', padding: '10px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                              <div><strong>Input:</strong> {exec.input}</div>
                              <div><strong>Expected Output:</strong> {exec.expectedOutput}</div>
                              <div><strong>Actual Output:</strong> {exec.output}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit result display */}
                  {submitResult && (
                    <div className={`verdict-box ${submitResult.status === 'Accepted' ? 'accepted' : 'failed'}`}>
                      <div className="verdict-title">
                        Submission Verdict: {submitResult.status}
                      </div>
                      <div className="verdict-meta">
                        <span>Runtime: {submitResult.runtime || 0}ms</span>
                        <span>Memory: {submitResult.memory || 0} KB</span>
                        <span>Passed: {submitResult.testCasesPassed}/{submitResult.totalTestCases}</span>
                      </div>
                      {submitResult.errorMessage && (
                        <pre className="verdict-error">{submitResult.errorMessage}</pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="workspace-actions">
            <Link to="/problems" style={{ fontSize: '0.8rem', color: 'var(--ink-4)' }}>
              ← Return
            </Link>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleRunCode}
                className="btn btn-line"
                disabled={running || submitting}
              >
                {running ? 'Running...' : '▶ Run Code'}
              </button>
              <button 
                onClick={handleSubmitCode}
                className="btn btn-gold"
                disabled={running || submitting}
              >
                {submitting ? 'Submitting...' : '🚀 Submit'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
