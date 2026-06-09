const reactRouterContent = {
  id: 'reactRouter',
  title: 'React Router',
  icon: '🧭',
  theme: 'orange',
  tagline: 'Client-side navigation without full page reloads — map URLs to components in a React app.',
  meta: 'Ecosystem · Routing',

  whatIsIt: {
    description: [
      'React Router is the de-facto routing library for React. It maps URL paths to components, enabling client-side navigation in Single Page Applications (SPAs) — users can move between "pages" without full browser reloads, giving the app a fast, native-app feel.',
      'React Router v6 (current) uses a declarative, component-based API with nested routes, layout routes, and data-loading features (React Router v6.4+ "data APIs" with loaders/actions).'
    ],
    points: [
      'Core components: <BrowserRouter> (wraps app), <Routes> + <Route> (defines path→component mapping), <Link> (navigation without reload), <Outlet> (renders child routes inside a layout).',
      'Core hooks: useNavigate() (programmatic navigation), useParams() (reads URL params), useSearchParams() (reads/writes query string), useLocation() (reads current URL object).',
      'Nested routes enable "layout routes" — a parent Route that renders shared UI (nav, sidebar) with an <Outlet> where child routes render inside it.'
    ],
    code: { title: 'Core v6 setup', snippet: `import { BrowserRouter, Routes, Route, Link, Outlet, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>     {/* Layout wraps children */}
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return <>
    <nav><Link to="/">Home</Link> | <Link to="/products">Products</Link></nav>
    <Outlet />   {/* child route renders here */}
  </>;
}

function ProductDetail() {
  const { id } = useParams();  // reads :id from the URL
  return <h1>Product #{id}</h1>;
}` },
    analogy: {
      icon: '🗺️',
      title: 'Real-World Analogy',
      text: '"React Router is like a GPS navigator for your app. You give it a map of destinations (routes: path → component), and every time the user navigates — clicking a Link, hitting the back button, or calling navigate() — it consults the map and renders the right component for the current \'location\'. No actual full page loads happen; the URL changes and React swaps the content instantly."'
    }
  },

  whyUsed: {
    description: 'Without a router, a React SPA renders one static view — there\'s no way to navigate to distinct "pages", no shareable/bookmarkable URLs, and no browser back/forward button support. React Router solves all of this with a declarative, component-based API that integrates naturally with React\'s rendering model.',
    points: [
      'Enables multi-page navigation without full reloads — fast, seamless UX.',
      'Maps URLs to views so every screen has a shareable, bookmarkable address.',
      'Provides history navigation (back/forward) that matches user expectations.',
      'Nested routes enable shared layouts and deeply composed UIs (dashboard with sidebar, tabs within tabs).'
    ]
  },

  whenToUse: {
    description: 'Essentially any React SPA with more than one "screen" or "page" needs a router. React Router is the standard choice.',
    points: [
      'Multi-page SPAs: apps with Home, About, Dashboard, Profile, Settings pages.',
      'Apps with URL-driven state: product detail pages (/products/42), filtered views (/items?status=active).',
      'Apps with deeply nested UI: admin dashboards where a sidebar/header should persist across sub-views.',
      'Protected routes: gating certain paths behind auth checks before rendering.'
    ],
    analogy: {
      icon: '🔒',
      title: 'Protected routes pattern',
      text: '"A common real-world need: redirect unauthenticated users to /login before they can access /dashboard. In React Router v6, this is a component: function ProtectedRoute({ children }) { const { user } = useAuth(); return user ? children : <Navigate to=\'/login\' replace />; }. Wrap any <Route> element with it."'
    }
  },

  howItWorks: {
    description: 'BrowserRouter listens to the browser\'s History API. When the URL changes (via <Link>, navigate(), or the browser back button), <Routes> finds the first <Route> whose `path` matches the current URL and renders its `element`. Nested routes render inside the parent\'s <Outlet>. URL params (:id) are extracted and made available via useParams().',
    code: {
      title: 'Protected routes + programmatic navigation + search params',
      snippet: `function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'all';

  return (
    <>
      <select value={category} onChange={e => setSearchParams({ category: e.target.value })}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
      </select>
      <ProductGrid category={category} />
    </>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const handleSuccess = () => navigate('/dashboard', { replace: true });
  return <LoginForm onSuccess={handleSuccess} />;
}

// In routes config:
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />`
    },
    points: [
      'useNavigate() returns a function — call navigate(\'/path\') for push, navigate(-1) for back, navigate(\'/path\', { replace: true }) to replace history entry.',
      'Route params (:id) are always strings — parse them (parseInt, etc.) before using as non-string values.',
      'React Router v6.4+ introduces loader/action data APIs (similar to Remix) for colocating data fetching with routes — significant for larger apps.'
    ]
  },

  flowDiagram: {
    title: 'What happens when a user navigates to /products/42',
    steps: [
      { icon: '🖱️', label: 'User clicks <Link to="/products/42">', note: 'Or calls navigate("/products/42")' },
      { icon: '🔧', label: 'History API updates URL', note: 'No page reload' },
      { icon: '🔍', label: 'Routes matches /products/:id', note: 'Route with path="products/:id" wins' },
      { icon: '📦', label: '<ProductDetail /> renders', note: 'useParams() → { id: "42" }' },
      { icon: '🖥️', label: 'View updates in-place', note: 'Shared Layout (nav/sidebar) stays mounted' }
    ]
  },

  realWorldExamples: {
    intro: 'React Router ships in virtually every non-trivial React app:',
    items: [
      { icon: '🛍️', title: 'E-commerce routing', description: '/, /products, /products/:id, /cart, /checkout — nested inside a layout with persistent header/footer. Product page uses useParams to fetch by ID.' },
      { icon: '📊', title: 'Admin dashboard', description: '/dashboard, /users, /users/:id, /settings — a sidebar Layout with <Outlet>, protected behind an auth check.' },
      { icon: '🔐', title: 'Auth flow', description: '/login, /register, /forgot-password — redirect to /dashboard on success via useNavigate; redirect to /login from protected routes via <Navigate>.' },
      { icon: '🔎', title: 'URL-driven search & filtering', description: 'useSearchParams keeps filter state in the URL so it\'s shareable/bookmarkable: /products?category=electronics&sort=price' }
    ]
  },

  prosAndCons: {
    pros: [
      'Declarative, composable routing that feels native to React.',
      'Nested routes enable powerful, DRY layout patterns.',
      'Rich hook set (useNavigate, useParams, useSearchParams, useLocation) covers nearly every routing need.',
      'v6.4+ data APIs bring Remix-like colocated loading/mutation — a significant DX improvement for data-heavy routes.'
    ],
    cons: [
      'v5 → v6 breaking changes were substantial — older tutorials/code may not apply.',
      'Complex route configurations can become hard to overview as apps grow.',
      'Data APIs (loaders/actions) add significant API surface to learn and a different mental model from component-level fetching.',
      'Server-side rendering requires extra configuration (StaticRouter or framework-level support).'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using <a href> instead of <Link>',
        wrong: `<a href="/about">About</a> // ❌ triggers a full page reload, losing all React state`,
        right: `<Link to="/about">About</Link> // ✅ client-side navigation, React stays mounted`,
        note: 'Every anchor tag that navigates within your SPA should be a <Link> (or <NavLink> for active-class styling). Using a plain <a> throws away the entire point of a SPA.'
      },
      {
        title: 'Calling useNavigate() outside a <Router>',
        note: 'All React Router hooks (useNavigate, useParams, useLocation, useSearchParams) must be called inside a component that is a descendant of a <BrowserRouter> (or equivalent). A common mistake is testing a component in isolation without wrapping it in <MemoryRouter> — it will throw a context error.'
      },
      {
        title: 'Using URL params as non-strings without parsing',
        wrong: `const { id } = useParams();\nconst item = items.find(i => i.id === id); // ❌ id is a STRING, items[n].id may be a NUMBER — always false`,
        right: `const { id } = useParams();\nconst item = items.find(i => i.id === parseInt(id, 10)); // ✅ explicit parse`,
      }
    ]
  },

  bestPractices: [
    'Co-locate route definitions near your app root in a single routes config for easy overview.',
    'Use <NavLink> instead of <Link> for nav items that need active/inactive styling.',
    'Keep URL params as simple identifiers; derive/compute values from them rather than stuffing complex state in the URL.',
    'Use <Navigate replace> (not push) for auth redirects — so the user\'s browser back button doesn\'t loop them back to a protected page.',
    'Wrap test renders of routing-aware components in <MemoryRouter> to avoid "must be inside Router" errors in tests.'
  ],

  interviewQuestions: [
    { q: 'What is React Router and why is it needed in a React SPA?', a: 'React Router maps URL paths to components, enabling client-side navigation — users can move between "pages" without full browser reloads, giving fast UX with shareable/bookmarkable URLs and functional browser back/forward buttons. Without a router, a React app renders one static view with no URL-driven navigation.' },
    { q: 'What is the difference between <Link> and a plain <a href> tag in a React app?', a: '<Link> from react-router-dom uses the History API to update the URL and trigger React Router\'s route matching — no page reload, React stays mounted. A plain <a href> triggers a full browser navigation, reloading the page from the server and discarding all React state and component instances.' },
    { q: 'How do nested routes work in React Router v6?', a: 'A parent Route\'s element renders an <Outlet> — a placeholder where matched child routes render. This enables "layout routes": a parent defines persistent UI (header, sidebar, navigation) while the <Outlet> swaps in the matched child\'s content. Nested routes are defined by placing <Route> elements as children of another <Route>.' },
    { q: 'How would you implement a protected route that redirects unauthenticated users to /login?', a: 'Create a ProtectedRoute wrapper component: function ProtectedRoute({ children }) { const { user } = useAuth(); return user ? children : <Navigate to="/login" replace />; }. Wrap any sensitive <Route>\'s element: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />. Using `replace` prevents the login page from being added to history, so back-button doesn\'t loop the user back.' },
    { q: 'When would you use useSearchParams vs. useParams?', a: 'useParams() reads dynamic path segments defined in the route pattern (/products/:id → { id: "42" }) — they\'re part of the route\'s path definition. useSearchParams() reads and writes the query string (?category=electronics&sort=price) — they\'re key-value pairs appended after the path. Use params for identifiers that define the resource; use search params for optional filter/sort/pagination state that might be shared or bookmarked.' }
  ],

  summary: {
    description: 'React Router turns a single-page React app into a multi-page experience with real URLs, browser history, nested layouts, and programmatic navigation — all without page reloads. The core v6 patterns (nested routes + <Outlet>, useParams, useNavigate, useSearchParams, protected routes via <Navigate>) cover the vast majority of routing needs in production apps.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'reactrouter.com/en/main — the canonical React Router v6 documentation, including the tutorial, data APIs, and migration guide from v5.' },
    { label: 'Related topic', note: 'See "Code Splitting & Lazy Loading" for lazy-loading route components with React.lazy + Suspense, and "Authentication" for the full auth-with-routing pattern.' }
  ]
};

export default reactRouterContent;
