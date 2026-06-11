const suspenseContent = {
  id: 'suspense',
  title: 'Suspense',
  icon: '⏸️',
  theme: 'sky',
  tagline: 'Show a loading fallback while a component waits for code or data — without writing isLoading checks.',
  meta: 'Ecosystem · Concurrent React',

  whatIsIt: {
    description: [
      'Suspense is a built-in React component that shows a fallback UI (spinner, skeleton) while children are waiting for code or data to arrive — without each component managing its own isLoading state.',
      'It works with React.lazy (for lazy-loaded code) and Suspense-aware data libraries like React Query or SWR (for data fetching).'
    ],
    points: [
      'Syntax: <Suspense fallback={<Loading />}>{children}</Suspense>',
      'When a child "suspends" (throws a Promise internally), React shows the fallback.',
      'Once the Promise resolves, React replaces the fallback with the real content.',
      'Nest Suspense boundaries to create independent loading states for different sections.'
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
      text: '"Suspense is like a theatre\'s house lights between acts. When the next act is not ready, the stage goes dark (fallback renders — a loading skeleton) and the audience sees a polished intermission. When the act is ready, the lights come up. No manual stage-management required from the actors."'
    }
  },

  whyUsed: {
    description: 'Traditional loading patterns require every component to manage its own isLoading state and render a spinner conditionally. Suspense centralizes loading at the tree level — you describe WHAT the loading state looks like, and React handles WHEN to show it.',
    points: [
      'Removes per-component isLoading boilerplate when using Suspense-aware libraries.',
      'Makes loading states composable — nest boundaries for granular, independent loading sections.',
      'Works with useTransition to keep showing old content until new content is ready.',
      'Enables streaming server rendering in Next.js and React 19.'
    ]
  },

  whenToUse: {
    description: 'Use Suspense when you want a declarative, tree-level approach to loading states.',
    points: [
      'Wrapping lazily-loaded route or feature components (React.lazy).',
      'Data fetching via React Query or SWR with suspense mode enabled.',
      'Server components in Next.js App Router for streaming HTML.',
      'When you want one loading boundary for a group of related components instead of many individual spinners.'
    ],
    analogy: {
      icon: '🆚',
      title: 'Traditional loading vs. Suspense',
      text: '"Traditional: every component checks if (isLoading) return <Spinner /> — scattered, boilerplate-heavy. With Suspense (via a data library): the component just reads its data directly and React handles the loading state at the boundary level. Less code in each component, more orchestration power at the tree level."'
    }
  },

  howItWorks: {
    description: 'A component signals it is not ready by throwing a Promise. React catches it, renders the nearest Suspense fallback, and waits for the Promise to resolve — then re-renders the component. React.lazy and Suspense-aware data libraries do this internally. You never throw Promises manually.',
    code: {
      title: 'Nested Suspense for granular, independent loading states',
      snippet: `function ProductPage() {
  return (
    // Inner boundary for the main content — fast to load
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails />

      {/* Separate inner boundary for reviews — may load slower */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews />
      </Suspense>

      {/* Another boundary for recommendations — lower priority */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>
    </Suspense>
  );
}
// ProductDetails loads → renders immediately
// ProductReviews still loading → shows <ReviewsSkeleton />
// Recommendations still loading → shows <RecommendationsSkeleton />
// No conditional logic inside any of these components` },
    points: [
      'Combine with useTransition: startTransition(() => setTab(next)) keeps the current view visible while new content resolves.',
      'In Next.js App Router, Suspense boundaries stream HTML progressively to the browser.',
      'Always wrap Suspense in an ErrorBoundary — Suspense handles loading, ErrorBoundary handles fetch failures.'
    ]
  },

  flowDiagram: {
    title: 'Suspense lifecycle: suspend → fallback → resume',
    steps: [
      { icon: '🔄', label: 'Child component "suspends"', note: 'Throws a Promise internally' },
      { icon: '⏸️', label: 'Suspense activates', note: 'Shows fallback={<Loading />}' },
      { icon: '⏳', label: 'Promise resolves', note: 'Data/code arrived' },
      { icon: '▶️', label: 'React re-renders children', note: 'Component gets its data' },
      { icon: '🖥️', label: 'Fallback replaced by real content', note: 'Seamless transition' }
    ]
  },

  realWorldExamples: {
    intro: 'Suspense underpins every modern React framework\'s loading experience:',
    items: [
      { icon: '📦', title: 'Route code splitting', description: 'Every Next.js page or React Router lazy route uses Suspense for the loading state while the JS chunk downloads.' },
      { icon: '🔢', title: 'Skeleton UIs', description: 'A product page shows gray skeleton boxes until the real content loads — per section, with zero isLoading logic in any component.' },
      { icon: '📡', title: 'Streaming server rendering', description: 'Next.js App Router uses Suspense to stream HTML — the shell arrives instantly, each boundary streams in as its data resolves on the server.' },
      { icon: '🔄', title: 'Parallel data fetching', description: 'Multiple independent components in different Suspense boundaries each show their own skeleton while their data loads, without blocking each other.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Declarative loading — describe WHAT to show while waiting, not WHEN to show it.',
      'Removes per-component isLoading boilerplate with compatible data libraries.',
      'Fine-grained independent loading states via nested boundaries.',
      'Composes well with useTransition and ErrorBoundary.'
    ],
    cons: [
      'Data-fetching Suspense requires a Suspense-aware library — plain useEffect + fetch does not integrate.',
      'Behavior can differ between client rendering and server streaming.',
      'Overly nested boundaries can cause waterfall loading if fetches are sequential.',
      'Error handling needs a separate ErrorBoundary — Suspense only handles loading.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Expecting plain useEffect/fetch to work with Suspense',
        wrong: `function Component() {\n  const [data, setData] = useState(null);\n  useEffect(() => { fetch('/api').then(r => r.json()).then(setData); }, []);\n  if (!data) return null; // ❌ does NOT integrate with Suspense`,
        right: `// ✅ Use React Query/SWR with suspense mode — they handle the Promise throwing\n// const { data } = useQuery({ queryKey: ['x'], queryFn: fetchX, suspense: true });`,
        note: 'Standard useEffect + fetch does not throw Promises — it does not integrate with Suspense. Suspense-aware libraries implement the required protocol.'
      },
      {
        title: 'Forgetting an ErrorBoundary above Suspense',
        note: 'Suspense handles loading but not errors. If a Promise rejects (network error), it bubbles up through Suspense to the nearest ErrorBoundary. Without one, the error crashes to the root. Wrap: <ErrorBoundary fallback={<Error />}><Suspense fallback={<Loading />}>{children}</Suspense></ErrorBoundary>.'
      },
      {
        title: 'Causing waterfall loading with sequential boundaries',
        note: 'If an inner Suspense can only start fetching AFTER the outer one resolves, you get a sequential waterfall — each boundary shows and resolves one after another. Fetch everything in parallel at the route level and let each component consume the already-started fetch.'
      }
    ]
  },

  bestPractices: [
    'Always wrap Suspense in an ErrorBoundary to handle fetch failures gracefully.',
    'Use Suspense-aware data libraries (React Query/SWR) — do not manually integrate useEffect fetches.',
    'Start fetches as early as possible at the route level — not inside component effects.',
    'Nest Suspense boundaries to create independent, non-blocking loading states.',
    'Combine with useTransition for navigation so the current UI stays visible while new content resolves.'
  ],

  interviewQuestions: [
    { q: 'What does Suspense do and what is the "throw a Promise" mechanism?', a: 'Suspense renders a fallback UI while children are waiting for async work to complete. The internal mechanism is "throw a Promise" — a component that is not ready throws a Promise, React catches it, renders the nearest Suspense fallback, and re-renders the component once the Promise resolves. React.lazy and Suspense-aware libraries implement this; you never throw Promises manually.' },
    { q: 'What is the difference between traditional loading state and Suspense?', a: 'Traditional loading: each component manages its own isLoading boolean and renders a spinner conditionally — scattered boilerplate. With Suspense (via a compatible library): the component reads its data directly (the library suspends for you), and the Suspense boundary shows the fallback. Loading state management moves from leaf components up to the tree level.' },
    { q: 'Why do you need an ErrorBoundary above a Suspense boundary?', a: 'Suspense handles the loading state but not errors. If the underlying fetch fails, the rejection propagates through the Suspense boundary to the nearest ErrorBoundary. Without one, the error crashes to the root. The standard pattern wraps both: ErrorBoundary > Suspense > children.' },
    { q: 'What does "render-as-you-fetch" mean?', a: 'Fetch-then-render starts fetching only after the component renders via useEffect — causing a waterfall. Render-as-you-fetch starts the fetch before or at the moment the component renders (at navigation or route level), so data is already in-flight when the component mounts. Suspense shows the loading state during the in-flight period, then the component resumes once data arrives.' },
    { q: 'How does Suspense work with useTransition for navigation?', a: 'By default, navigating to a route using Suspense immediately shows the fallback — a jarring loading flash. Wrapping the navigation in startTransition() tells React to render the new route in the background while showing the current UI. Only when the new route\'s Suspense resolves does React switch — keeping the experience smooth.' }
  ],

  summary: {
    description: 'Suspense transforms scattered isLoading checks into declarative tree-level loading boundaries. Nest boundaries for granular loading isolation, always pair with ErrorBoundary for error handling, and combine with useTransition for seamless navigation. It is the foundation of React\'s modern data-loading story and streaming SSR.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/Suspense — includes streaming, nested boundaries, and interaction with useTransition.' },
    { label: 'Related topic', note: 'See "Code Splitting" for the simplest use case (React.lazy), "useTransition" for seamless navigation, and "Server Components" for streaming SSR.' }
  ]
};

export default suspenseContent;
