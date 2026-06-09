const codeSplittingContent = {
  id: 'codeSplitting',
  title: 'Code Splitting & Lazy Loading',
  icon: '✂️',
  theme: 'violet',
  tagline: 'Split your bundle into smaller chunks and load code only when it\'s actually needed.',
  meta: 'Ecosystem · Performance',

  whatIsIt: {
    description: [
      'Code splitting is the practice of dividing your JavaScript bundle into multiple smaller chunks that can be loaded on-demand, rather than forcing every user to download all of your app\'s code upfront — even the parts they\'ll never visit.',
      'React supports this via React.lazy() for lazy-loading components and Suspense for rendering loading states while they download, plus dynamic import() at the module level as the underlying mechanism.'
    ],
    points: [
      'React.lazy(fn) — lazily imports a component; fn must return a Promise resolving to { default: Component }.',
      '<Suspense fallback={<Spinner />}> — renders the fallback while the lazy component\'s code is downloading.',
      'Dynamic import() — the JS syntax that tells bundlers (Webpack, Vite) to create a separate chunk for that module.',
      'Bundlers (Vite, Webpack, Parcel) do the actual splitting; React.lazy/Suspense are the React integration for rendering the result.'
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
      text: '"Code splitting is like a restaurant not printing every dish\'s recipe in the menu — it would make the menu enormous for no reason. Instead, the kitchen has each recipe on a separate card, fetched only when that dish is actually ordered. Your JS bundle is the menu; each route/feature\'s code is a recipe card — you only need to download the card for the dish you ordered."'
    }
  },

  whyUsed: {
    description: 'Modern web apps can have enormous JavaScript bundles — hundreds of kilobytes to several megabytes. Forcing every user to download all of it before anything displays makes initial load slow, especially on mobile or slower connections. Code splitting sends users only what they need for the current page, then loads the rest on-demand.',
    points: [
      'Reduces initial bundle size → faster Time-to-Interactive (TTI) and First Contentful Paint (FCP).',
      'Users only download code for the features they actually use — heavy admin panels don\'t cost anonymous users anything.',
      'Improves Core Web Vitals scores, which affect SEO and user experience metrics.',
      'Parallelizes loading — multiple smaller chunks can be fetched concurrently.'
    ]
  },

  whenToUse: {
    description: 'Code-split at natural boundaries where users may not visit certain parts of the app, especially when the split component is large.',
    points: [
      'Route-level splitting: each page/route is the most impactful and natural boundary for splitting.',
      'Feature-level: heavy editors (rich text, code editors), charting libraries, 3D renderers that only some users access.',
      'Conditional UI: modals, drawers, admin panels, settings screens that aren\'t shown on first load.',
      'Third-party libraries that are only needed for specific features (PDF generation, mapping library).'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to split',
      text: '"Don\'t split tiny components or code used on every route — the network request overhead can cost MORE than the bytes saved. Code splitting is for LARGE components (>10-20KB gzipped) that aren\'t needed immediately. Over-splitting can actually slow down an app due to waterfall requests and the runtime overhead of loading many tiny chunks."'
    }
  },

  howItWorks: {
    description: 'Dynamic import() is a JavaScript syntax that instructs bundlers to create a separate file (a "chunk") for the imported module. React.lazy() wraps a dynamic import in a Suspense-aware component; when React renders it for the first time, it fires the import(), suspends (shows the Suspense fallback), and resumes when the chunk arrives and the component is ready to render.',
    code: {
      title: 'Splitting a heavy feature modal — lazy load on first open',
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

// Vite/Webpack splits this into a separate chunk:
// main.js + richTextEditor.[hash].js
// The editor chunk is only fetched when isOpen becomes true` },
    points: [
      'Preloading: you can kick off the import() preemptively (e.g. on route hover) so the chunk arrives before the user actually navigates: const prefetch = () => import(\'./HeavyPage\').',
      'Error boundaries around Suspense handle chunk-loading failures (network errors) gracefully.',
      'Vite, Webpack, and other bundlers automatically create content-hashed filenames for each chunk, enabling long-term browser caching.'
    ]
  },

  flowDiagram: {
    title: 'What happens when a lazy component first renders',
    steps: [
      { icon: '🖱️', label: 'User navigates to /dashboard', note: 'React renders <HeavyDashboard>' },
      { icon: '📦', label: 'React.lazy fires import()', note: 'Dynamic import triggers chunk download' },
      { icon: '⏳', label: 'Suspense shows fallback', note: '<PageSpinner /> renders while loading' },
      { icon: '✅', label: 'Chunk arrives', note: 'Component module resolves' },
      { icon: '🖥️', label: 'HeavyDashboard renders', note: 'Fallback replaced with actual content' }
    ]
  },

  realWorldExamples: {
    intro: 'Code splitting is essentially always applied in production-scale React apps:',
    items: [
      { icon: '🗺️', title: 'Route-level splitting', description: 'Each route in a React Router or Next.js app generates a separate chunk — a user visiting / never downloads the code for /admin or /dashboard.' },
      { icon: '📝', title: 'Rich text / code editors', description: 'Libraries like Slate, TipTap, or CodeMirror are hundreds of KB — lazy-loaded only when the editing modal or page opens.' },
      { icon: '📊', title: 'Charting libraries', description: 'Chart.js, Recharts, or D3 are significant bundles — lazy-loaded only on pages that actually display charts.' },
      { icon: '🛠️', title: 'Admin panels', description: 'An admin section used by 1% of users should never add to the bundle size that 99% of users pay for.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Directly improves initial load speed and Time-to-Interactive, especially on mobile.',
      'Users don\'t download code for features they never use.',
      'Bundlers handle the complexity automatically — the developer API (React.lazy + Suspense) is simple.',
      'Improves Core Web Vitals and SEO-relevant load metrics.'
    ],
    cons: [
      'First visit to a lazily-loaded route has a small delay for the chunk download (mitigated by preloading).',
      'Over-splitting creates many small chunks with many requests — worse in some network conditions than one larger bundle.',
      'Server-side rendering requires additional setup for lazy components.',
      'More chunks means more complexity in chunk caching/invalidation strategy.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Not wrapping lazy components in Suspense',
        wrong: `const Dashboard = lazy(() => import('./Dashboard'));\nfunction App() { return <Dashboard />; } // ❌ throws — no Suspense boundary`,
        right: `function App() { return <Suspense fallback={<Loading />}><Dashboard /></Suspense>; } // ✅`,
        note: 'React.lazy REQUIRES a Suspense boundary somewhere above it in the tree. Forgetting it causes an error. One Suspense can cover multiple lazy components.'
      },
      {
        title: 'Splitting too granularly — waterfalling small components',
        note: 'Splitting a tiny 2KB component creates a new HTTP round trip for almost no bundle savings. Code-split at meaningful boundaries (routes, large libraries, heavy features) — generally components >10-15KB gzipped are worthwhile split targets.'
      },
      {
        title: 'Not preloading for predictable navigation',
        note: 'If users commonly navigate from A to B, preload B\'s chunk on hover or on focus: <Link onMouseEnter={() => import(\'./PageB\')} to="/b">Go to B</Link>. The chunk downloads before the click, making navigation feel instant.'
      }
    ]
  },

  bestPractices: [
    'Start with route-level splitting — the biggest wins with the least complexity.',
    'Always wrap lazy components in <Suspense> with a sensible fallback (skeleton UI > spinner > blank).',
    'Pair lazy routes with error boundaries to handle chunk-loading failures gracefully.',
    'Preload chunks on hover/focus for routes users are likely to navigate to next.',
    'Profile your bundle with tools like webpack-bundle-analyzer or Vite\'s rollup-plugin-visualizer to identify the largest candidates for splitting.'
  ],

  interviewQuestions: [
    { q: 'What is code splitting and why does it matter for React apps?', a: 'Code splitting divides the JavaScript bundle into smaller chunks that are loaded on-demand rather than all upfront. It matters because large bundles increase initial load time — users download code for features they may never use. With code splitting, users download only what they need for the current page, improving Time-to-Interactive and Core Web Vitals.' },
    { q: 'How does React.lazy() work, and what does it require to function?', a: 'React.lazy() takes a function that returns a Promise resolving to a module with a default export — the component. It integrates with Suspense: when the lazy component is first rendered, React fires the dynamic import(), suspends the component tree (showing the nearest Suspense fallback), and resumes rendering once the chunk resolves. React.lazy() REQUIRES a <Suspense> boundary above it — rendering it without one throws.' },
    { q: 'What is the most impactful way to start code splitting a React app?', a: 'Route-level splitting — wrapping each route\'s component in React.lazy() with a Suspense boundary around the routing. Each page becomes its own chunk; users visiting the home page never download the dashboard or admin code. This is also the most natural boundary since navigating between routes already has some inherent latency.' },
    { q: 'How would you handle the case where a lazy-loaded chunk fails to download (network error)?', a: 'Wrap the <Suspense> in an error boundary. When the chunk\'s import() Promise rejects (e.g. network error), the error propagates through Suspense to the nearest error boundary, which renders its fallback UI — typically something like "Failed to load this section. Try refreshing."' },
    { q: 'What does preloading a lazy component mean, and how would you implement it?', a: 'Preloading triggers the dynamic import() before the component is actually rendered — so the chunk downloads in the background while the user is still on the current page, making the eventual navigation feel instant. Implement it by calling the import() function eagerly: e.g. on mouse hover over a link — <Link onMouseEnter={() => import(\'./TargetPage\')} to="/target">. The browser caches the result so the actual render is instant.' }
  ],

  summary: {
    description: 'Code splitting via React.lazy + Suspense + dynamic import() is one of the highest-leverage performance optimizations for React apps — reducing what users download upfront, improving initial load speed, and keeping expensive features invisible to users who never need them. Start with route-level splits, wrap with Suspense and error boundaries, and preload on predictable navigation paths for a fast, resilient experience.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/lazy — the canonical React.lazy reference, and react.dev/reference/react/Suspense for the Suspense boundary API.' },
    { label: 'Related topic', note: 'See "Suspense" for deeper Suspense patterns (data fetching + streaming), and "Performance Optimization" for the broader performance toolkit.' }
  ]
};

export default codeSplittingContent;
