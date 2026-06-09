const authenticationContent = {
  id: 'authentication',
  title: 'Authentication in React',
  icon: '🔐',
  theme: 'rose',
  tagline: 'Manage login/logout, token storage, protected routes, and auth state in React applications.',
  meta: 'Ecosystem · Security',

  whatIsIt: {
    description: [
      'Authentication in React is the pattern of: (1) verifying who the user is (login), (2) persisting that identity across page reloads (token/session storage), (3) making that identity available throughout the component tree (auth context), and (4) protecting routes/components from unauthenticated access.',
      'React itself provides no auth primitives — authentication is built from existing React patterns (Context, Hooks, React Router) combined with your backend\'s auth strategy (JWTs, sessions, OAuth).'
    ],
    points: [
      'Three token storage options — each with trade-offs: (a) Memory (most secure, lost on refresh), (b) HttpOnly cookies (secure from XSS, requires CORS setup), (c) localStorage/sessionStorage (convenient, XSS-vulnerable — generally avoid for sensitive tokens).',
      'Auth Context: a provider holding user identity + login/logout functions, consumed via useAuth() hook.',
      'Protected Routes: components that redirect unauthenticated users to /login before rendering.',
      'Token refresh: intercepting 401 responses, refreshing the access token silently, and retrying the original request.'
    ],
    code: { title: 'Complete auth context + protected routes pattern', snippet: `// authContext.js
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
      text: '"Authentication in a React app is like entering an office building. At the front desk (login page), you show your credentials and receive a badge (token). The badge is stored somewhere — in your pocket (memory), on a lanyard visible to everyone (localStorage, risky), or embedded in your keycard that security controls (HttpOnly cookie, most secure). When you approach a restricted floor (protected route), the floor scanner reads your badge and either lets you in or directs you back to the lobby (redirect to login). The badge expires (token expiry) and needs periodic renewal (token refresh)."'
    }
  },

  whyUsed: {
    description: 'Almost every real-world app has user accounts and access control. React apps need a consistent, secure pattern for auth state that handles all the edge cases: persisting login across reloads, protecting routes, handling token expiry, and logging out properly.',
    points: [
      'Centralizing auth state in Context prevents every component from needing its own "is user logged in?" logic.',
      'Protected routes enforce access control at the routing level — one place to gatekeep, not scattered conditionals.',
      'Token storage choice directly impacts security — XSS-vulnerable apps with localStorage-stored tokens are a common attack vector.',
      'Proper token refresh UX prevents frustrating "suddenly logged out" experiences when access tokens expire.'
    ]
  },

  whenToUse: {
    description: 'Any app with user accounts, access control, or personalization needs an auth pattern.',
    points: [
      'Login/register/logout flows with backend authentication.',
      'Route-level access control: authenticated vs. unauthenticated areas.',
      'Role-based access: admin vs. regular user, showing/hiding features.',
      'OAuth / Social login: integrating Google/GitHub login via libraries like Auth0, NextAuth.js, Clerk, or Firebase Auth.'
    ],
    analogy: {
      icon: '💡',
      title: 'The "loading" state that prevents flashing',
      text: '"A critical UX detail: on page load, your app doesn\'t immediately know if the user is logged in — it has to check (verify the session, call /api/me). During this brief \'status === loading\' moment, protected routes must show a spinner — not flash the login page. Without this check, even legitimate logged-in users briefly see the login page on reload, which looks broken and erodes trust."'
    }
  },

  howItWorks: {
    description: 'The standard React auth flow: Provider wraps the app → verifies existing session on mount → exposes user+login+logout → ProtectedRoute checks user before rendering → Axios/fetch interceptors handle token refresh automatically.',
    code: {
      title: 'Axios interceptors for automatic token injection + refresh',
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
      'Short-lived access tokens (15-60 min) stored in memory + long-lived refresh tokens in HttpOnly cookies is the gold-standard security approach.',
      'OAuth / social login libraries (Auth0, Clerk, NextAuth.js) handle all of this complexity — worth considering for any app with social login or complex auth requirements.',
      'RBAC (role-based access control): store user.roles in auth context, check roles in ProtectedRoute or conditionally in components.'
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
    intro: 'Auth architecture is one of the most consequential decisions in a React app:',
    items: [
      { icon: '🔑', title: 'JWT with HttpOnly cookies', description: 'Server sets the JWT in an HttpOnly, SameSite=Strict cookie — unreachable by JavaScript, immune to XSS. Frontend uses withCredentials: true in fetch/Axios. Refresh tokens extend the session silently.' },
      { icon: '🌐', title: 'OAuth/social login with a library', description: 'Clerk, Auth0, or NextAuth.js handle the OAuth flow, token storage, and session management — you get a useUser() / useAuth() hook and pre-built login UI. Saves weeks of implementation.' },
      { icon: '🛡️', title: 'Role-based protected routes', description: '<ProtectedRoute requiredRole="admin"> checks user.roles before rendering admin pages — unauthenticated users → /login; insufficient role → /unauthorized.' },
      { icon: '📱', title: 'Persistent sessions via refresh tokens', description: 'Access tokens in memory (refreshed silently every 15 min via a long-lived HttpOnly refresh token cookie) — the user stays logged in across browser sessions without storing sensitive tokens in localStorage.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Centralized auth Context makes the user\'s identity consistently available across the entire app.',
      'React Router protected routes provide a clean, maintainable single gatekeeping point.',
      'HttpOnly cookie + token refresh pattern is the most secure available approach for SPAs.',
      'Auth libraries (Auth0, Clerk) dramatically reduce implementation time and security risk for OAuth flows.'
    ],
    cons: [
      'Token management, refresh logic, and interceptors add meaningful complexity — auth libraries exist for a reason.',
      'localStorage token storage (a common shortcut) creates real XSS vulnerability — resist the temptation.',
      'Session persistence across tabs with in-memory token storage requires additional coordination (BroadcastChannel, service worker).',
      'CORS, SameSite cookie settings, and HTTPS requirements add configuration overhead, especially in development.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Storing JWT access tokens in localStorage',
        wrong: `localStorage.setItem('token', jwt); // ❌ XSS-vulnerable — any injected script can steal the token`,
        right: `// ✅ Store in memory (most secure) or let the server use HttpOnly cookies\n// In memory: tokenStore.setToken(jwt) → only lives in the JS closure, not accessible from DOM`,
        note: 'localStorage is accessible from any JavaScript on the page — including malicious scripts injected via XSS. A stolen JWT is a stolen session. HttpOnly cookies are inaccessible from JavaScript regardless of XSS, making them the secure choice. In-memory storage is also safe but requires token refresh on every page load.'
      },
      {
        title: 'Not handling the "loading" auth status',
        wrong: `function ProtectedRoute({ children }) {\n  const { user } = useAuth();\n  if (!user) return <Navigate to="/login" />; // ❌ shows login page BRIEFLY even when user is logged in\n  return children;\n}`,
        right: `function ProtectedRoute({ children }) {\n  const { user, status } = useAuth();\n  if (status === 'loading') return <Spinner />;    // wait for the session check\n  if (!user) return <Navigate to="/login" replace />;\n  return children;\n}`,
        note: 'On initial load, auth state is unknown until the backend session-check resolves. Showing a redirect before that check completes briefly flashes the login page for authenticated users — a jarring experience. The "loading" status prevents this.'
      },
      {
        title: 'Forgetting to call logout on token refresh failure',
        note: 'If the refresh token has expired or been invalidated (user deleted, password changed, token revoked), the refresh request returns a 401. Your interceptor must handle this case: clear all auth state, redirect to /login, and inform the user their session has expired. Silently ignoring refresh failure leaves the app in a broken authenticated-but-rejected limbo.'
      }
    ]
  },

  bestPractices: [
    'Use HttpOnly, SameSite=Strict cookies for refresh tokens — never store refresh tokens in JavaScript-accessible storage.',
    'Store access tokens in memory (a JS closure/module variable) — they\'re short-lived and don\'t need to survive page reloads.',
    'Always check the "loading" auth status in protected routes to prevent the authenticated→login page flash on initial load.',
    'Use Axios interceptors (or a fetch wrapper) to automatically inject tokens and handle 401 refresh — don\'t scatter this logic across components.',
    'For OAuth / social login, reach for a library (Auth0, Clerk, NextAuth.js) — the security complexity is not worth hand-rolling.'
  ],

  interviewQuestions: [
    { q: 'Where should JWT access tokens be stored in a React SPA, and why?', a: 'In memory (a JavaScript module variable or closure), NOT in localStorage or sessionStorage. localStorage is accessible to any JavaScript on the page — an XSS attack can read and exfiltrate tokens stored there. In-memory storage is only accessible within the current JS execution context, making it immune to XSS-based token theft. The tradeoff is tokens are lost on page refresh — mitigated by refresh tokens stored in HttpOnly cookies (server-managed, JavaScript-inaccessible).' },
    { q: 'How do you implement a protected route in React Router?', a: 'Create a ProtectedRoute wrapper component that reads the current auth status from useAuth(). If status is still loading (the session check is in progress), show a spinner — not a redirect — to prevent flashing the login page for legitimately authenticated users. If the user is null after loading, render <Navigate to="/login" replace />. Otherwise render the children. Wrap any sensitive route: <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />.' },
    { q: 'How does the access token + refresh token pattern work for session persistence?', a: 'Short-lived access tokens (15-60 min) are used for API requests. When one expires (401 response), an interceptor automatically calls a token-refresh endpoint, which uses a long-lived refresh token stored in an HttpOnly cookie. The server validates the refresh token, issues a new access token, and the interceptor retries the original request — all transparently. The user never sees a login prompt unless the refresh token itself has expired.' },
    { q: 'What happens in your auth flow when the refresh token expires?', a: 'The refresh request itself returns an error. The response interceptor catches this, clears all auth state (user, in-memory access token), and redirects to the login page — optionally showing a message like "Your session has expired, please log in again." Without this handling, the app enters a broken state where the user appears logged in but every API request fails with 401.' },
    { q: 'When would you use Auth0, Clerk, or NextAuth.js instead of building auth yourself?', a: 'Whenever you need: OAuth/social login (Google, GitHub, Apple), multi-factor authentication, magic links, SAML/enterprise SSO, or any complex auth flow. These libraries handle all the OAuth redirect flows, token management, session persistence, and security best practices — implementing them correctly yourself takes weeks and requires significant security expertise. Even for simple username/password auth, libraries like Auth0 offload PBKDF2 password hashing, brute-force protection, and compliance obligations. The only reason to build from scratch is very specific requirements that no library can accommodate.' }
  ],

  summary: {
    description: 'Authentication in React is built from familiar patterns: an AuthContext Provider holding user state + login/logout, useAuth() for consumption, ProtectedRoute for access control, and Axios interceptors for token injection and refresh. Security comes from storage decisions: HttpOnly cookies for refresh tokens, in-memory for access tokens — never localStorage. For OAuth and social login, libraries like Clerk, Auth0, or NextAuth.js make the right choice the easy choice.'
  },

  furtherReading: [
    { label: 'Related topic', note: 'See "React Router" for the route-protection pattern, "API Integration" for the Axios interceptor setup, and "Context API" for the auth context pattern.' },
    { label: 'Libraries', note: 'Clerk (clerk.com), Auth0 (auth0.com), and NextAuth.js (next-auth.js.org) — production-ready auth solutions for React apps at different complexity levels.' }
  ]
};

export default authenticationContent;
