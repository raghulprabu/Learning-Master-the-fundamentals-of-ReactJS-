const suspenseContent = {
  id: 'suspense',
  title: 'Suspense',
  icon: '⏸️',
  theme: 'sky',
  tagline: 'Declaratively show loading states for parts of your UI while their data or code is being fetched.',
  meta: 'Ecosystem · Concurrent React',

  whatIsIt: {
    description: [
      '<Suspense> is a built-in React component that lets you "declaratively" render a fallback UI (spinner, skeleton) while children are waiting for asynchronous work to finish — without each child component managing its own isLoading state.',
      'It supports two use cases today: (1) lazy-loaded code (React.lazy), and (2) data fetching — either via a Suspense-enabled framework (Next.js, Remix) or a Suspense-aware library (React Query with `suspense: true`, SWR with `suspense: true`).'
    ],
    points: [
      'Syntax: <Suspense fallback={<Loading />}>{children}</Suspense>',
      'When a child "suspends" (throws a Promise — the internal mechanism), React renders the fallback instead.',
      'Once the Promise resolves, React replaces the fallback with the actual content.',
      'Suspense boundaries can be nested — more granular boundaries show finer-grained loading states.'
    ],
    code: { title: 'Suspense with lazy loading and data fetching', snippet: `// Code splitting: lazy-loaded components automatically integrate with Suspense
const Dashboard = lazy(() => import('./Dashboard'));
const UserProfile = lazy(() => import('./UserProfile'));

function App() {
  return (
    // Outer boundary: full-page loading for top-level code/data
    <Suspense fallback={<FullPageSpinner />}>
      <UserProfile />
      {/* Inner boundary: isolated loading for just the dashboard widget */}
      <Suspense fallback={<SkeletonDashboard />}>
        <Dashboard />
      </Suspense>
    </Suspense>
  );
}

// With React Query (Suspense mode — library handles the "throw a Promise" part):
// function UserProfile() {
//   const { data: user } = useQuery({ queryKey: ['user'], queryFn: fetchUser, suspense: true });
//   return <h1>{user.name}</h1>; // no isLoading check needed — Suspense handles it!
// }` },
    analogy: {
      icon: '🎬',
      title: 'Real-World Analogy',
      text: '"Suspense is like a theatre\'s \'house lights\' being on between acts. When the next act (component + data) isn\'t ready yet, the stage goes dark (fallback renders — maybe a loading skeleton) and the audience sees a polished \'intermission\' rather than watching stagehands scrambling in the dark. When the next act is ready, the lights come up and the real content appears — no manual stage-management required from the actors."'
    }
  },

  whyUsed: {
    description: 'Traditional loading patterns require each component to manage its own `isLoading` / `isError` state and conditional rendering. This leads to loading-state boilerplate scattered throughout the component tree, and makes it hard to coordinate loading states for groups of related components. Suspense centralizes and declarativizes loading: you describe WHAT the loading experience looks like, and React handles WHEN it shows.',
    points: [
      'Eliminates per-component isLoading boilerplate when using Suspense-aware data libraries.',
      'Makes loading states composable: nest boundaries to create granular, orchestrated loading experiences.',
      'Enables "render as you fetch" — start fetching before rendering, show results as they arrive, with Suspense managing the transitions.',
      'Works with useTransition to prevent jarring loading flashes on navigation — keep showing the old content until the new is ready.'
    ]
  },

  whenToUse: {
    description: 'Suspense is the right tool when you want a declarative, component-tree-level approach to loading states — especially in combination with lazy loading or a Suspense-aware data library.',
    points: [
      'Wrapping lazily-loaded route or feature components (React.lazy).',
      'Data fetching via React Query/SWR with their suspense mode enabled — for clean, isLoading-free components.',
      'Server components in React 19 / Next.js 13+ where streaming is used to progressively send HTML.',
      'Any situation where you want to coordinate the loading state of a group of components into one boundary rather than many individual loading spinners.'
    ],
    analogy: {
      icon: '🆚',
      title: 'Traditional loading vs. Suspense',
      text: '"Traditional: every component checks if (isLoading) return <Spinner /> — scattered, boilerplate-heavy, hard to coordinate. With Suspense (via a data library): the component just reads its data synchronously and React handles the loading state at the boundary level. Less code in each leaf component, more orchestration power at the tree level."'
    }
  },

  howItWorks: {
    description: 'Suspense works via a "throw a Promise" protocol: a component signals to React that it\'s not ready by throwing a Promise. React catches it, renders the nearest Suspense fallback, and waits for the Promise to resolve — then re-renders the component. React.lazy uses this internally; Suspense-enabled data libraries implement it in their hooks. You never throw a Promise yourself in normal usage.',
    code: {
      title: 'Nested Suspense for orchestrated, granular loading',
      snippet: `function ProductPage() {
  return (
    // Inner boundary for the main content — fast to load
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails />

      {/* Separate inner boundary for reviews — may load slower */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews />
      </Suspense>

      {/* Another boundary for recommendations — optional, lower priority */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>
    </Suspense>
  );
}
// ProductDetails loads → renders immediately
// ProductReviews still loading → shows <ReviewsSkeleton />
// Recommendations still loading → shows <RecommendationsSkeleton />
// No conditional logic inside any of these components — Suspense handles it all` },
    points: [
      'Combine with useTransition for seamless transitions: startTransition(() => setTab(next)) keeps the current view visible while the new one\'s Suspense resolves in the background.',
      'In Next.js App Router (React 19), entire route segments wrapped in Suspense boundaries are streamed progressively to the browser.',
      'Error boundaries above Suspense catch Promise rejections (fetch errors) — the standard pattern is <ErrorBoundary><Suspense fallback={...}>{children}</Suspense></ErrorBoundary>.'
    ]
  },

  flowDiagram: {
    title: 'Suspense lifecycle: suspend → fallback → resume',
    steps: [
      { icon: '🔄', label: 'Child component "suspends"', note: 'Throws a Promise (internally)' },
      { icon: '⏸️', label: 'Suspense activates', note: 'Shows fallback={<Loading />}' },
      { icon: '⏳', label: 'Promise resolves', note: 'Data/code arrived' },
      { icon: '▶️', label: 'React re-renders children', note: 'Component gets its data' },
      { icon: '🖥️', label: 'Fallback replaced by real content', note: 'Seamless transition' }
    ]
  },

  realWorldExamples: {
    intro: 'Suspense underpins every modern React framework\'s loading experience:',
    items: [
      { icon: '📦', title: 'Route code splitting', description: 'Every Next.js page, Remix route, or React Router v6 lazy route uses Suspense under the hood for the loading state while the JS chunk downloads.' },
      { icon: '🔢', title: 'Skeleton UIs', description: 'A product page shows <ProductDetailSkeleton /> (gray boxes matching the content layout) until the real content loads — Suspense makes this per-section with zero component-level isLoading logic.' },
      { icon: '📡', title: 'Streaming server rendering', description: 'Next.js App Router uses Suspense to stream HTML — the shell arrives instantly, and each Suspense boundary streams in as its data resolves on the server.' },
      { icon: '🔄', title: 'Parallel data fetching with isolated loading states', description: 'Multiple independent components in different Suspense boundaries can each show their own skeleton while their data loads, without blocking each other or sharing a global loading state.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Declarative loading: describe WHAT to show while loading, not WHEN to show it.',
      'Eliminates per-component isLoading boilerplate when using compatible data libraries.',
      'Enables fine-grained, independently-loading UI sections via nested boundaries.',
      'Composable with useTransition and Error Boundaries for production-quality loading experiences.'
    ],
    cons: [
      'Data-fetching Suspense requires a Suspense-aware library (React Query, SWR, or a framework) — plain fetch() with useEffect doesn\'t integrate.',
      'Native support is still maturing — behavior can differ between client rendering and server streaming.',
      'Overly aggressive Suspense boundaries can cause "waterfall loading" (each boundary shows and resolves in sequence) — parallelize fetches properly.',
      'Error handling requires a separate ErrorBoundary — Suspense only handles the loading state.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Expecting plain useEffect/fetch to work with Suspense',
        wrong: `function Component() {\n  const [data, setData] = useState(null);\n  useEffect(() => { fetch('/api').then(r => r.json()).then(setData); }, []);\n  if (!data) return null; // ❌ does NOT integrate with Suspense`,
        right: `// ✅ Use React Query/SWR with suspense mode — they handle the Promise throwing\n// const { data } = useQuery({ queryKey: ['x'], queryFn: fetchX, suspense: true });`,
        note: 'Standard useEffect+fetch doesn\'t throw Promises — it doesn\'t integrate with Suspense boundaries. Suspense-aware data libraries implement the protocol Suspense requires.'
      },
      {
        title: 'Forgetting to add an ErrorBoundary above the Suspense',
        note: 'Suspense handles the loading state but not errors. If a Promise rejects (network error, server error), it bubbles up through the Suspense boundary to the nearest ErrorBoundary. Without one, the error crashes to the root. The standard wrapping is: <ErrorBoundary fallback={<Error />}><Suspense fallback={<Loading />}>{children}</Suspense></ErrorBoundary>.'
      },
      {
        title: 'Causing a loading waterfall with multiple sequential boundaries',
        note: 'If you nest one Suspense that suspends inside another, and the inner one can only start fetching AFTER the outer one resolves (due to parent-child data dependencies), you get a sequential loading waterfall. Fetch everything needed for a page in parallel at the route level, then let each component consume the already-started fetch — a "render-as-you-fetch" pattern.'
      }
    ]
  },

  bestPractices: [
    'Always wrap Suspense in an ErrorBoundary to handle fetch/loading failures gracefully.',
    'Use Suspense-aware data libraries (React Query/SWR suspense mode) for data fetching — don\'t manually try to integrate useEffect fetches.',
    'Start fetches as early as possible (at the route level) — don\'t fetch only after the component renders (fetch-then-render vs. render-as-you-fetch).',
    'Nest Suspense boundaries to create granular, independent loading states that don\'t block each other.',
    'Combine with useTransition for navigation — keep the current UI visible while new content\'s Suspense boundary resolves in the background.'
  ],

  interviewQuestions: [
    { q: 'What does React Suspense do, and what is the "throw a Promise" mechanism?', a: 'Suspense lets you declaratively describe a loading state for a subtree — rendering a fallback UI while children are waiting for asynchronous work to complete. The underlying mechanism is "throw a Promise": a component signals it\'s not ready by throwing a Promise, React catches it, renders the nearest Suspense fallback, and then re-renders the component once the Promise resolves. React.lazy and Suspense-aware libraries (React Query, SWR) implement this protocol; you don\'t throw Promises manually in normal usage.' },
    { q: 'What is the difference between traditional per-component loading state and Suspense?', a: 'Traditional loading: each component manages its own `isLoading` boolean via useState/useEffect and renders a spinner conditionally — scattered boilerplate throughout the tree. With Suspense (via a compatible data library): the component reads its data synchronously (the library handles the suspension), and the Suspense boundary above it shows the fallback while waiting — no per-component loading logic needed. Suspense centralizes loading state management at the tree level, while traditional patterns scatter it at the leaf level.' },
    { q: 'Why do you need an ErrorBoundary above a Suspense boundary?', a: 'Suspense handles the pending/loading state (while a Promise is in flight) but not the error state (when a Promise rejects). If the underlying fetch fails, the rejection propagates up through the Suspense boundary to the nearest ErrorBoundary — without one, it crashes to the root. The standard pattern is wrapping Suspense in an ErrorBoundary to handle both the loading and error cases declaratively.' },
    { q: 'What does "render-as-you-fetch" mean in the context of Suspense, and why is it better than "fetch-then-render"?', a: '"Fetch-then-render" starts fetching only after the component renders — often triggered in a useEffect — causing a waterfall: first render, then wait for fetch, then render again. "Render-as-you-fetch" starts the fetch BEFORE or at the moment the component renders (typically initiated by the router or a framework at navigation time), so data is already in-flight when the component mounts. Suspense shows the loading state during the in-flight period, then the component "resumes" once data arrives — no wasted time waiting for a render before fetching starts.' },
    { q: 'How does Suspense work with useTransition for navigation?', a: 'By default, navigating to a new route that uses Suspense immediately shows the fallback — a potentially jarring loading flash. Wrapping the navigation in startTransition() tells React to "try to render the new route in the background" — the old UI stays visible while the new route\'s Suspense resolves, and only then does React switch. Combined with isPending from useTransition, you can show a subtle indicator (e.g. dimming the current content) without a disruptive full-screen loading state.' }
  ],

  summary: {
    description: 'Suspense transforms loading states from scattered per-component boilerplate into declarative tree-level coordination — you wrap a subtree and describe its loading experience; React (and Suspense-aware libraries) handle the when. Nest boundaries for granular loading isolation, always pair with ErrorBoundary for failures, and combine with useTransition for seamless navigation. It\'s the cornerstone of React\'s modern data-loading story, powering streaming SSR in Next.js and the broader "concurrent features" model.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/Suspense — the canonical reference, including streaming, nested boundaries, and interaction with useTransition.' },
    { label: 'Related topic', note: 'See "Code Splitting" for the simplest Suspense use case (React.lazy), "useTransition" for seamless navigation patterns, and "Server Components" for streaming SSR.' }
  ]
};

export default suspenseContent;
