const reactRouterContent = {
  id: 'reactRouter',
  title: 'React Router',
  icon: '🧭',
  theme: 'orange',
  tagline: 'React Router maps URLs to components so users can navigate between pages without a full page reload.',
  meta: 'Ecosystem · Routing',

  whatIsIt: {
    description: [
      'React Router is the standard routing library for React. It maps URL paths to components, enabling client-side navigation — users move between "pages" without the browser reloading.',
      'React Router v6 uses a declarative, component-based API with nested routes, layout routes, and hooks for reading URL params and query strings.'
    ],
    points: [
      'Core components: <BrowserRouter>, <Routes> + <Route>, <Link>, <Outlet>.',
      'Core hooks: useNavigate() (go to a URL in code), useParams() (read URL params), useSearchParams() (read/write query string), useLocation() (read current URL).',
      'Nested routes let a parent Route render shared UI (nav, sidebar) with an <Outlet> where child routes appear.'
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
      text: '"React Router is like a GPS navigator. You give it a map of destinations (routes: path → component). Every time the user navigates — clicking a Link, pressing the back button, or calling navigate() — it checks the map and renders the right component for the current location. No page reload; the URL changes and React swaps the content instantly."'
    }
  },

  whyUsed: {
    description: 'Without a router, a React app shows one static view with no way to navigate to different "pages" or share a URL. React Router gives every screen its own URL and makes the back button work.',
    points: [
      'Multi-page navigation without full reloads — fast, smooth user experience.',
      'Every screen gets a shareable, bookmarkable URL.',
      'Browser back/forward buttons work as users expect.',
      'Nested routes enable shared layouts with tabs or sidebars inside a dashboard.'
    ]
  },

  whenToUse: {
    description: 'Any React app with more than one screen needs a router. React Router is the standard choice.',
    points: [
      'Multi-page apps: Home, About, Dashboard, Profile, Settings.',
      'URL-driven state: product detail pages (/products/42) or filtered views (/items?status=active).',
      'Deeply nested UI: admin dashboards where header and sidebar persist across sub-views.',
      'Protected routes: redirect unauthenticated users to /login before they can access /dashboard.'
    ],
    analogy: {
      icon: '🔒',
      title: 'Protected routes pattern',
      text: '"A common need: redirect unauthenticated users to /login before showing /dashboard. In React Router v6 this is a component: function ProtectedRoute({ children }) { const { user } = useAuth(); return user ? children : <Navigate to=\'/login\' replace />; }. Wrap any Route element with it."'
    }
  },

  howItWorks: {
    description: 'BrowserRouter listens to the browser\'s History API. When the URL changes, Routes finds the first Route whose path matches and renders its element. Nested routes render inside the parent\'s Outlet. URL params (:id) are available via useParams().',
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
      'useNavigate() — call navigate(\'/path\') to push, navigate(-1) to go back, navigate(\'/path\', { replace: true }) to replace the history entry.',
      'Route params (:id) are always strings — parse them (parseInt etc.) before comparing to numbers.',
      'React Router v6.4+ adds loader/action data APIs for colocating data fetching with routes.'
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
      { icon: '📊', title: 'Admin dashboard', description: '/dashboard, /users, /users/:id, /settings — a sidebar Layout with Outlet, protected behind an auth check.' },
      { icon: '🔐', title: 'Auth flow', description: '/login, /register — redirect to /dashboard on success via useNavigate; redirect to /login from protected routes via Navigate.' },
      { icon: '🔎', title: 'URL-driven search', description: 'useSearchParams keeps filter state in the URL so it is shareable and bookmarkable: /products?category=electronics&sort=price' }
    ]
  },

  prosAndCons: {
    pros: [
      'Declarative, composable routing that feels native to React.',
      'Nested routes enable powerful, DRY layout patterns.',
      'Rich hook set covers nearly every routing need.',
      'v6.4+ data APIs bring colocated loading/mutation — a big DX improvement for data-heavy routes.'
    ],
    cons: [
      'v5 to v6 had major breaking changes — older tutorials may not apply.',
      'Complex route configurations can be hard to overview as apps grow.',
      'Data APIs (loaders/actions) add significant new API surface to learn.',
      'Server-side rendering requires extra setup (StaticRouter or framework support).'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using <a href> instead of <Link>',
        wrong: `<a href="/about">About</a> // ❌ triggers a full page reload — React state is lost`,
        right: `<Link to="/about">About</Link> // ✅ client-side navigation — React stays mounted`,
        note: 'Every link that navigates within your app should be a Link or NavLink. A plain anchor tag reloads the page and throws away all React state.'
      },
      {
        title: 'Calling useNavigate() outside a Router',
        note: 'All React Router hooks must be called inside a component that is a descendant of BrowserRouter. When testing components in isolation, wrap them in MemoryRouter — otherwise you get a "must be inside Router" error.'
      },
      {
        title: 'Using URL params as non-strings without parsing',
        wrong: `const { id } = useParams();\nconst item = items.find(i => i.id === id); // ❌ id is a STRING — number comparison is always false`,
        right: `const { id } = useParams();\nconst item = items.find(i => i.id === parseInt(id, 10)); // ✅ explicit parse`
      }
    ]
  },

  bestPractices: [
    'Define all routes near the app root in one place for an easy overview.',
    'Use NavLink instead of Link for nav items that need active/inactive styling.',
    'Keep URL params as simple identifiers — derive values from them rather than putting complex state in the URL.',
    'Use Navigate replace (not push) for auth redirects so the back button does not loop users back to a protected page.',
    'Wrap test renders of routing-aware components in MemoryRouter to avoid context errors.'
  ],

  interviewQuestions: [
    { q: 'What is React Router and why is it needed?', a: 'React Router maps URL paths to components, enabling client-side navigation — users can move between "pages" without full browser reloads, with shareable URLs and working back/forward buttons. Without a router, a React app has one static view with no URL-driven navigation.' },
    { q: 'What is the difference between Link and a plain anchor tag?', a: 'Link uses the History API to update the URL and trigger React Router\'s route matching — no page reload, React stays mounted. A plain anchor tag triggers a full browser navigation, reloads the page from the server, and discards all React state.' },
    { q: 'How do nested routes work in React Router v6?', a: 'A parent Route\'s element renders an Outlet — a placeholder where matched child routes appear. This enables layout routes: a parent defines persistent UI (header, sidebar) while the Outlet swaps in the matched child\'s content based on the URL.' },
    { q: 'How would you implement a protected route that redirects unauthenticated users to /login?', a: 'Create a ProtectedRoute wrapper: const { user } = useAuth(); return user ? children : <Navigate to="/login" replace />;. Wrap any sensitive Route\'s element with it. Using replace prevents the login page from being added to history so the back button does not loop the user.' },
    { q: 'When would you use useSearchParams vs. useParams?', a: 'useParams reads dynamic path segments defined in the route pattern (/products/:id → { id: "42" }). useSearchParams reads and writes the query string (?category=electronics&sort=price). Use params for identifiers that define the resource; use search params for optional filter or sort state that users might want to share or bookmark.' }
  ],

  summary: {
    description: 'React Router turns a React app into a multi-page experience with real URLs, browser history, nested layouts, and programmatic navigation — all without page reloads. The core patterns (nested routes + Outlet, useParams, useNavigate, useSearchParams, protected routes via Navigate) cover the majority of routing needs in production apps.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'reactrouter.com/en/main — canonical React Router v6 documentation, including the tutorial, data APIs, and v5 migration guide.' },
    { label: 'Related topic', note: 'See "Code Splitting" for lazy-loading route components, and "Authentication" for the full auth-with-routing pattern.' }
  ]
};

export default reactRouterContent;
