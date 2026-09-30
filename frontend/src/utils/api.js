const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const config = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw { status: res.status, message: data.message || 'Something went wrong', data };
  return data;
}

/* ── Auth ── */
export const authAPI = {
  register: (body) => request('/user/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/user/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  logout:   ()     => request('/user/auth/logout',   { method: 'POST' }),
  profile:  (year) => request(`/user/auth/fetchProfile${year ? `?year=${year}` : ''}`),
  adminRegister: (body) => request('/user/auth/adminRegister', { method: 'POST', body: JSON.stringify(body) }),
};

/* ── Problems ── */
export const problemsAPI = {
  getAll:      ()           => request('/problems'),
  get:         (slug)       => request(`/problems/${slug}`),
  submissions: (slug, page) => request(`/problems/${slug}/submissions${page ? `?page=${page}` : ''}`),
  submission:  (slug, id)   => request(`/problems/${slug}/submissions/${id}`),
  create:      (body)       => request(`/problems/createproblem`, { method: 'POST', body: JSON.stringify(body) }),
  update:      (slug, body) => request(`/problems/updateproblem/${slug}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:      (slug)       => request(`/problems/delete/${slug}`, { method: 'DELETE' }),
};

/* ── Submissions ── */
export const submissionsAPI = {
  submit:   (slug, body) => request(`/submissions/${slug}`,     { method: 'POST', body: JSON.stringify(body) }),
  run:      (slug, body) => request(`/submissions/${slug}/run`, { method: 'POST', body: JSON.stringify(body) }),
  progress: (page)       => request(`/submissions/progress${page ? `?page=${page}` : ''}`),
};
