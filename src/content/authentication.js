const authenticationContent = {
  id: 'authentication',
  title: 'Authentication in React',
  icon: '🔐',
  theme: 'rose',
  tagline: 'Manage login, logout, token storage, and protected routes in your React app.',
  meta: 'Ecosystem · Security',

  whatIsIt: {
    description: [
      'Authentication in React means: checking who the user is (login), keeping that identity across page reloads (token storage), sharing it across the app (Context), and blocking unauthenticated users from private pages (protected routes).',
      'React has no built-in auth — you build it using Context, hooks, and React Router, combined with your backend\'s auth strategy (JWTs, sessions, or OAuth).'
    ],
    points: [
      'Auth Context: holds user info, login, and logout functions — available everywhere via useAuth().',
      'Protected Routes: redirect users to /login if they are not logged in.',
      'Token storage options: memory (safest), HttpOnly cookies (safe from XSS), or localStorage (avoid for sensitive tokens).',
      'Token refresh: silently get a new access token when the old one expires — user never sees a logout.'
    ],
    code: { title: 'Auth context + protected route pattern', snippet: `// authContext.js
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authed | unauthed

  // On mount: verify any existing session / token
  useEffect(() => {
    authApi.getCurrentUser()
      .then(u => { setUser(u); setStatus('authed'); })
      .catch(() => setStatus('unauthed'));
  }, []);

  const login = async (credentials) => {
    const { user, token } = await authApi.login(credentials);
    // Prefer HttpOnly cookies (set by server) — or store token in memory only
    setUser(user);
    setStatus('authed');
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setStatus('unauthed');
  };

  const value = useMemo(() => ({ user, status, login, logout }), [user, status]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

// ProtectedRoute.jsx — redirect unauthenticated users
function ProtectedRoute({ children }) {
  const { user, status } = useAuth();
  if (status === 'loading') return <PageSpinner />; // don't flash login page while checking
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Router setup
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />` },
    analogy: {
      icon: '🏢',
      title: 'Real-World Analogy',
      text: '"Authentication is like entering an office building. At the front desk (login page), you show your ID and get a badge (token). You keep the badge somewhere — in your pocket (memory), on a visible lanyard (localStorage — risky), or in a secure keycard system (HttpOnly cookie — safest). A restricted floor (protected route) checks your badge. When the badge expires, security silently renews it (token refresh)."'
    }
  },

  whyUsed: {
    description: 'Almost every real app has user accounts. You need one consistent, secure place for auth state — not scattered "is the user logged in?" checks in every component.',
    points: [
      'One Auth Context prevents duplicate auth-check logic in every component.',
      'Protected routes enforce access control in one place — not scattered conditionals.',
      'Token storage choice directly impacts security — localStorage tokens can be stolen via XSS.',
      'Proper token refresh stops users from being suddenly "logged out" when tokens expire.'
    ]
  },

  whenToUse: {
    description: 'Any app with user accounts, private pages, or different user roles needs an auth pattern.',
    points: [
      'Login, register, and logout flows with a backend.',
      'Route-level access control — authenticated vs. unauthenticated areas.',
      'Role-based access: admin vs. regular user.',
      'Social login (Google, GitHub): use a library like Auth0, Clerk, or NextAuth.js.'
    ],
    analogy: {
      icon: '💡',
      title: 'The loading state that prevents flashing',
      text: '"On page load, your app does not immediately know if the user is logged in — it must check with the server first. During this short loading moment, protected routes must show a spinner — not the login page. Without this, even logged-in users briefly see the login page on refresh, which looks broken."'
    }
  },

  howItWorks: {
    description: 'The standard flow: AuthProvider checks the session on mount, exposes user + login + logout, ProtectedRoute reads auth status, and Axios interceptors handle token refresh automatically so the user never notices.',
    code: {
      title: 'Axios interceptors for token injection and auto-refresh',
      snippet: `// axiosInstance.js
import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

// Request interceptor: inject access token (if storing in memory, not cookie)
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken(); // in-memory store
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// Response interceptor: handle 401 → refresh → retry
let isRefreshing = false;
let failedQueue = [];

api.interceptors.response.use(null, async (error) => {
  if (error.response?.status !== 401) return Promise.reject(error);
  if (isRefreshing) return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }));

  isRefreshing = true;
  try {
    const { accessToken } = await api.post('/auth/refresh'); // uses HttpOnly refresh cookie
    tokenStore.setAccessToken(accessToken);
    failedQueue.forEach(p => p.resolve(accessToken));
    return api.request(error.config); // retry original
  } catch {
    failedQueue.forEach(p => p.reject());
    authStore.logout(); // full logout on refresh failure
  } finally {
    isRefreshing = false;
    failedQueue = [];
  }
});

export default api;` },
    points: [
      'Best security: short-lived access tokens in memory + long-lived refresh tokens in HttpOnly cookies.',
      'Auth libraries (Auth0, Clerk, NextAuth.js) handle all token complexity — worth using for social login or complex flows.',
      'Role-based access: store user.roles in auth context, check roles in ProtectedRoute or conditionally in components.'
    ]
  },

  flowDiagram: {
    title: 'Complete authentication flow',
    steps: [
      { icon: '🖥️', label: 'App loads', note: 'AuthProvider calls /api/me to check session' },
      { icon: '👤', label: 'User logs in', note: 'POST /api/login → server sets HttpOnly cookie' },
      { icon: '🏠', label: 'Navigate to /dashboard', note: 'ProtectedRoute checks user — allows entry' },
      { icon: '⏱️', label: 'Access token expires', note: 'Axios interceptor catches 401' },
      { icon: '🔄', label: 'Silent token refresh', note: 'Uses refresh cookie → new access token' },
      { icon: '↩️', label: 'Retry original request', note: 'User never notices the refresh' }
    ]
  },

  realWorldExamples: {
    intro: 'Auth is one of the most important decisions in a React app:',
    items: [
      { icon: '🔑', title: 'JWT with HttpOnly cookies', description: 'Server sets the JWT in an HttpOnly, SameSite=Strict cookie — JavaScript cannot read it, so XSS attacks cannot steal it. Use withCredentials: true in fetch/Axios.' },
      { icon: '🌐', title: 'Social login with a library', description: 'Clerk, Auth0, or NextAuth.js handle OAuth flows, token storage, and session management. You get a useAuth() hook and pre-built login UI — saves weeks of work.' },
      { icon: '🛡️', title: 'Role-based protected routes', description: '<ProtectedRoute requiredRole="admin"> checks user.roles before rendering. Unauthenticated → /login; wrong role → /unauthorized.' },
      { icon: '📱', title: 'Persistent sessions', description: 'Access tokens in memory refreshed every 15 minutes via a long-lived HttpOnly refresh cookie — users stay logged in without storing sensitive tokens in localStorage.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Auth Context makes the user\'s identity available everywhere consistently.',
      'Protected routes provide a clean, single gatekeeping point.',
      'HttpOnly cookies + token refresh is the most secure approach for SPAs.',
      'Auth libraries dramatically reduce implementation time for OAuth flows.'
    ],
    cons: [
      'Token management and refresh logic add complexity — auth libraries exist for this reason.',
      'localStorage tokens (a common shortcut) are XSS-vulnerable — avoid for sensitive tokens.',
      'In-memory tokens are lost on page refresh — mitigated by refresh tokens.',
      'CORS and cookie settings add configuration overhead in development.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Storing JWT access tokens in localStorage',
        wrong: `localStorage.setItem('token', jwt); // ❌ any XSS attack can steal this token`,
        right: `// ✅ Store in memory (safest) or let the server use HttpOnly cookies\n// In memory: tokenStore.setToken(jwt) — only lives in the JS closure`,
        note: 'localStorage is accessible to any JavaScript on the page — including scripts injected by XSS attacks. HttpOnly cookies are inaccessible from JavaScript regardless of XSS, making them the secure choice.'
      },
      {
        title: 'Not handling the "loading" auth status',
        wrong: `function ProtectedRoute({ children }) {\n  const { user } = useAuth();\n  if (!user) return <Navigate to="/login" />; // ❌ flashes login page for logged-in users\n  return children;\n}`,
        right: `function ProtectedRoute({ children }) {\n  const { user, status } = useAuth();\n  if (status === 'loading') return <Spinner />;    // wait for the session check\n  if (!user) return <Navigate to="/login" replace />;\n  return children;\n}`,
        note: 'On page load, auth state is unknown until the session check finishes. Redirecting before that check runs briefly shows the login page to logged-in users — jarring and confusing.'
      },
      {
        title: 'Forgetting to logout on token refresh failure',
        note: 'If the refresh token expires or is revoked, the refresh request fails. Your interceptor must catch this, clear all auth state, and redirect to the login page. Without this, the app looks logged in but every API call fails.'
      }
    ]
  },

  bestPractices: [
    'Use HttpOnly, SameSite=Strict cookies for refresh tokens — never store them in JavaScript-accessible storage.',
    'Store access tokens in memory — they are short-lived and do not need to survive page reloads.',
    'Always check the "loading" status in protected routes to prevent the login-page flash on initial load.',
    'Use Axios interceptors to inject tokens and handle 401 refresh — do not scatter this logic across components.',
    'For OAuth and social login, use a library (Auth0, Clerk, NextAuth.js) — the security complexity is not worth building from scratch.'
  ],

  interviewQuestions: [
    { q: 'Where should JWT access tokens be stored in a React SPA, and why?', a: 'In memory (a JavaScript module variable), not in localStorage. localStorage is accessible to any JavaScript on the page — an XSS attack can read and steal tokens stored there. In-memory storage is only accessible within the current JS execution context, immune to XSS-based theft. The tradeoff is tokens are lost on page refresh — solved by refresh tokens stored in HttpOnly cookies.' },
    { q: 'How do you implement a protected route in React Router?', a: 'Create a ProtectedRoute component that reads auth status from useAuth(). If still loading, show a spinner — not a redirect — to prevent flashing the login page for logged-in users. If user is null after loading, render <Navigate to="/login" replace />. Otherwise render children. Wrap sensitive routes: <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />.' },
    { q: 'How does the access token + refresh token pattern work?', a: 'Short-lived access tokens (15-60 min) are used for API requests. When one expires (401), an interceptor calls a refresh endpoint, which uses a long-lived HttpOnly refresh cookie. The server issues a new access token and the interceptor retries the original request — all transparently. The user only sees the login page if the refresh token itself has expired.' },
    { q: 'What happens when the refresh token expires?', a: 'The refresh request returns an error. The interceptor clears all auth state, redirects to the login page, and optionally shows "your session expired, please log in again." Without this, the app appears logged in but every API call fails with 401.' },
    { q: 'When would you use Auth0, Clerk, or NextAuth.js instead of building auth yourself?', a: 'When you need OAuth/social login, MFA, magic links, or SSO. These libraries handle OAuth flows, token management, and security best practices — implementing them correctly takes weeks. Even for simple email/password auth, libraries handle password hashing, brute-force protection, and compliance. Build from scratch only when you have requirements no library can meet.' }
  ],

  summary: {
    description: 'Authentication in React uses familiar patterns: an AuthContext Provider with user state + login/logout, useAuth() for consumption, ProtectedRoute for access control, and Axios interceptors for token injection and refresh. Security comes from storage choices: HttpOnly cookies for refresh tokens, memory for access tokens — never localStorage. For OAuth and social login, use Clerk, Auth0, or NextAuth.js.'
  },

  furtherReading: [
    { label: 'Related topics', note: 'See "React Router" for the route-protection pattern, "API Integration" for Axios interceptors, and "Context API" for the auth context pattern.' },
    { label: 'Libraries', note: 'Clerk (clerk.com), Auth0 (auth0.com), NextAuth.js (next-auth.js.org) — production auth for React apps at different complexity levels.' }
  ]
};

export default authenticationContent;
