const codeSplittingContent = {
  id: 'codeSplitting',
  title: 'Code Splitting & Lazy Loading',
  icon: '✂️',
  theme: 'violet',
  tagline: 'Split your bundle into smaller pieces and load code only when the user actually needs it.',
  meta: 'Ecosystem · Performance',

  whatIsIt: {
    description: [
      'Code splitting divides your JavaScript bundle into smaller chunks that load on demand, instead of sending all your app\'s code at once — even code the user may never visit.',
      'React supports this with React.lazy() to lazy-load components and Suspense to show a loading state while the code downloads.'
    ],
    points: [
      'React.lazy(fn) — lazy-imports a component; fn must return a Promise that resolves to { default: Component }.',
      '<Suspense fallback={<Spinner />}> — shows the fallback while the lazy component downloads.',
      'Dynamic import() — the JS syntax that tells bundlers (Vite, Webpack) to create a separate chunk.',
      'The bundler does the actual splitting; React.lazy + Suspense are the React API for displaying the result.'
    ],
    code: { title: 'React.lazy + Suspense — the canonical pattern', snippet: `import React, { lazy, Suspense } from 'react';

// ✅ The HeavyDashboard component is loaded only when actually rendered
const HeavyDashboard = lazy(() => import('./HeavyDashboard'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Router>
      <Suspense fallback={<PageSpinner />}>  {/* shows while chunk downloads */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<HeavyDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Without this, EVERY user downloads HeavyDashboard + AdminPanel code
// even if they only visit the home page` },
    analogy: {
      icon: '📚',
      title: 'Real-World Analogy',
      text: '"Code splitting is like a restaurant not printing every recipe in the menu. Instead, the kitchen keeps each recipe on a separate card, fetched only when that dish is ordered. Your JS bundle is the menu — each route\'s code is a recipe card you only need when that dish is ordered."'
    }
  },

  whyUsed: {
    description: 'Large JavaScript bundles make initial page loads slow, especially on mobile. Code splitting sends users only the code they need for the current page, then loads the rest when they navigate to it.',
    points: [
      'Reduces initial bundle size — faster Time-to-Interactive and First Contentful Paint.',
      'Users only download code for features they actually use.',
      'Improves Core Web Vitals scores, which affect SEO.',
      'Multiple smaller chunks can be fetched in parallel.'
    ]
  },

  whenToUse: {
    description: 'Split at natural boundaries where users may not visit certain parts, especially for large components.',
    points: [
      'Route-level: each page is the most impactful and natural split point.',
      'Heavy editors, charting libraries, or 3D renderers only some users access.',
      'Modals, drawers, admin panels not shown on first load.',
      'Third-party libraries needed only for specific features (PDF, maps).'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to split',
      text: '"Do not split tiny components or code used on every page — the extra network request can cost MORE than the bytes saved. Split large components (>10–20KB gzipped) that are not needed immediately. Over-splitting can actually slow an app down."'
    }
  },

  howItWorks: {
    description: 'Dynamic import() tells the bundler to create a separate chunk file. React.lazy wraps the import in a Suspense-aware component. When React first renders it, it fires the import(), shows the Suspense fallback, and replaces it with the real component once the chunk arrives.',
    code: {
      title: 'Splitting a heavy feature — lazy load on first open',
      snippet: `// The heavy RichTextEditor is only loaded when the modal first opens —
// not as part of the initial app bundle
const RichTextEditor = lazy(() => import('./RichTextEditor'));

function PostEditor() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Edit Post</button>
      {isOpen && (
        <Suspense fallback={<div>Loading editor…</div>}>
          <RichTextEditor />
        </Suspense>
      )}
    </>
  );
}

// Vite/Webpack splits this into two files:
// main.js + richTextEditor.[hash].js
// The editor chunk is only fetched when isOpen becomes true` },
    points: [
      'Preload: call import() before the user navigates — const prefetch = () => import(\'./HeavyPage\') — so the chunk is ready when they arrive.',
      'Wrap Suspense in an error boundary to handle chunk-download failures (network errors).',
      'Bundlers create content-hashed filenames for long-term browser caching automatically.'
    ]
  },

  flowDiagram: {
    title: 'What happens when a lazy component first renders',
    steps: [
      { icon: '🖱️', label: 'User navigates to /dashboard', note: 'React renders <HeavyDashboard>' },
      { icon: '📦', label: 'React.lazy fires import()', note: 'Dynamic import triggers chunk download' },
      { icon: '⏳', label: 'Suspense shows fallback', note: '<PageSpinner /> while loading' },
      { icon: '✅', label: 'Chunk arrives', note: 'Component module resolves' },
      { icon: '🖥️', label: 'HeavyDashboard renders', note: 'Fallback replaced with real content' }
    ]
  },

  realWorldExamples: {
    intro: 'Code splitting is applied in nearly every production React app:',
    items: [
      { icon: '🗺️', title: 'Route-level splitting', description: 'Each route generates a separate chunk — a user visiting / never downloads the code for /admin or /dashboard.' },
      { icon: '📝', title: 'Rich text / code editors', description: 'Libraries like Slate or CodeMirror are hundreds of KB — lazy-loaded only when the editing modal opens.' },
      { icon: '📊', title: 'Charting libraries', description: 'Chart.js, Recharts, or D3 are large bundles — lazy-loaded only on pages that display charts.' },
      { icon: '🛠️', title: 'Admin panels', description: 'An admin section used by 1% of users should not add to the bundle that 99% of users must download.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Directly improves initial load speed and Time-to-Interactive.',
      'Users do not download code for features they never use.',
      'Bundlers handle splitting automatically — the React API is simple.',
      'Improves Core Web Vitals and SEO-relevant load metrics.'
    ],
    cons: [
      'First visit to a lazy route has a small delay for the chunk download.',
      'Too many tiny chunks create many requests — can be slower in some networks.',
      'Server-side rendering needs extra setup for lazy components.',
      'More chunks means more complexity in caching strategy.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Not wrapping lazy components in Suspense',
        wrong: `const Dashboard = lazy(() => import('./Dashboard'));\nfunction App() { return <Dashboard />; } // ❌ throws — no Suspense boundary`,
        right: `function App() { return <Suspense fallback={<Loading />}><Dashboard /></Suspense>; } // ✅`,
        note: 'React.lazy REQUIRES a Suspense boundary somewhere above it. Forgetting it causes an error. One Suspense can cover multiple lazy components.'
      },
      {
        title: 'Splitting too granularly — waterfalling tiny components',
        note: 'Splitting a tiny 2KB component creates a new HTTP round trip for almost no bundle savings. Code-split at meaningful boundaries (routes, large libraries) — components over 10–15KB gzipped are worthwhile split targets.'
      },
      {
        title: 'Not preloading for predictable navigation',
        note: 'If users commonly go from A to B, preload B\'s chunk on hover: link.onMouseEnter = () => import(\'./PageB\'). The chunk downloads before the click so navigation feels instant.'
      }
    ]
  },

  bestPractices: [
    'Start with route-level splitting — the biggest wins with the least complexity.',
    'Always wrap lazy components in Suspense with a sensible fallback (skeleton > spinner > blank).',
    'Pair lazy routes with error boundaries to handle chunk-load failures gracefully.',
    'Preload chunks on hover for routes users are likely to visit next.',
    'Use webpack-bundle-analyzer or Vite\'s rollup-plugin-visualizer to find the largest split candidates.'
  ],

  interviewQuestions: [
    { q: 'What is code splitting and why does it matter?', a: 'Code splitting divides the JavaScript bundle into smaller chunks loaded on demand. It matters because large bundles increase initial load time — users download code for features they may never use. With splitting, users download only what they need for the current page, improving Time-to-Interactive and Core Web Vitals.' },
    { q: 'How does React.lazy() work, and what does it require?', a: 'React.lazy() takes a function that returns a Promise resolving to a module with a default export. When the lazy component first renders, React fires the dynamic import(), shows the nearest Suspense fallback while downloading, and renders the component once the chunk arrives. React.lazy() REQUIRES a Suspense boundary above it — rendering without one throws an error.' },
    { q: 'What is the most impactful way to start code splitting a React app?', a: 'Route-level splitting — wrapping each route\'s component in React.lazy() with a Suspense boundary around the routes. Each page becomes its own chunk; visiting the home page never downloads the dashboard or admin code.' },
    { q: 'How would you handle a lazy-loaded chunk that fails to download?', a: 'Wrap Suspense in an error boundary. When the import() Promise rejects (network error), the error propagates to the nearest error boundary, which renders its fallback — typically "Failed to load this section. Try refreshing."' },
    { q: 'What does preloading a lazy component mean?', a: 'Preloading fires the dynamic import() before the component renders — the chunk downloads in the background while the user is still on the current page. Implement it by calling the import function on hover: link.onMouseEnter = () => import(\'./TargetPage\'). The browser caches it so the navigation feels instant.' }
  ],

  summary: {
    description: 'Code splitting with React.lazy + Suspense + dynamic import() reduces what users download upfront, improving initial load speed. Start with route-level splits, always wrap with Suspense and an error boundary, and preload chunks on predictable navigation paths.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/lazy — the canonical React.lazy reference.' },
    { label: 'Related topic', note: 'See "Suspense" for deeper loading patterns, and "Performance Optimization" for the broader performance toolkit.' }
  ]
};

export default codeSplittingContent;
