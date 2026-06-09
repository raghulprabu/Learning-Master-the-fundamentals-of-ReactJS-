const apiIntegrationContent = {
  id: 'apiIntegration',
  title: 'API Integration',
  icon: '🔗',
  theme: 'amber',
  tagline: 'Fetching, caching, loading, and error-handling for REST and GraphQL APIs in React components.',
  meta: 'Ecosystem · Data Fetching',

  whatIsIt: {
    description: [
      'API integration in React is the practice of connecting components to external data sources — REST APIs, GraphQL endpoints, backend services — in a way that correctly handles loading states, errors, race conditions, and data caching.',
      'Modern React apps have two primary approaches: the manual useEffect+useState pattern (built-in, fine for simple cases) and dedicated data-fetching libraries (TanStack Query, SWR, Apollo GraphQL) that add caching, deduplication, background refresh, and pagination out of the box.'
    ],
    points: [
      'The basic pattern: fetch in useEffect → set loading/data/error state → render based on status.',
      'Common problems with naive fetching: race conditions (stale responses overwriting fresh ones), no cancellation on unmount, duplicate requests, no caching.',
      'TanStack Query / SWR: solve all the common problems automatically with less code.',
      'Always handle three states: loading, error, and success — user experience depends on all three.'
    ],
    code: { title: 'From naive to production-ready fetch patterns', snippet: `// 1. NAIVE — common starter pattern with real problems
function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts); // ❌ no loading/error state, no cancellation, no caching
  }, []);
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// 2. BETTER — manual but correct fetch with race-condition guard
function Products() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; // 🔑 race condition guard
    setStatus('loading');
    fetch('/api/products')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => { if (!ignore) { setProducts(data); setStatus('success'); } })
      .catch(err => { if (!ignore) { setError(err.message); setStatus('error'); } });
    return () => { ignore = true; }; // cleanup: ignore stale responses
  }, []);

  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <p>Error: {error}</p>;
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// 3. BEST — TanStack Query (far less code, more features)
function Products() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
  });
  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}` },
    analogy: {
      icon: '📬',
      title: 'Real-World Analogy',
      text: '"Fetching data in a React component is like ordering a package online. A naive implementation just sends the order and waits — if the order takes too long and you reorder, you might receive the OLD package AFTER the new one (race condition). A good implementation tracks order numbers, ignores late arrivals from the old order, shows you the delivery progress (loading/error/success states), and cancels the old order if you unmount. TanStack Query is the professional shipping service that handles all of this automatically."'
    }
  },

  whyUsed: {
    description: 'Most non-trivial React apps need to communicate with a backend. Getting this right — handling all edge cases without re-inventing the wheel — is where a clear strategy (and usually a library) pays for itself many times over.',
    points: [
      'Data from APIs is asynchronous and can fail — every component that fetches must handle loading, error, and success states.',
      'Naive implementations suffer from race conditions, memory leaks on unmount, duplicate requests, and no caching.',
      'Libraries like TanStack Query and SWR solve these problems with far less code than manual approaches.',
      'Well-structured API integration makes loading states, errors, and re-fetching consistent across the app.'
    ]
  },

  whenToUse: {
    description: 'Every component that needs external data needs API integration. The question is which approach to use.',
    points: [
      'Simple, one-off fetches: manual useEffect+useState is fine, provided you handle race conditions and cleanup.',
      'Complex data needs (caching, background refresh, pagination, optimistic updates): TanStack Query or SWR.',
      'GraphQL APIs: Apollo Client or urql offer type-safe, normalized caching specific to GraphQL.',
      'Real-time data (WebSockets, SSE): custom useEffect subscriptions or dedicated libraries.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'The race condition you don\'t know about',
      text: '"Here\'s a bug almost every developer writes at some point: a component fetches data when params change. The user changes params quickly. Request #1 (for old params) takes longer than Request #2 (for new params). Request #1 arrives AFTER Request #2 and overwrites the correct data with stale data. The fix is the \'ignore\' flag in useEffect\'s cleanup (or AbortController). TanStack Query handles this automatically."'
    }
  },

  howItWorks: {
    description: 'Whether manual or via a library, API integration follows the same pattern: initiate a request, track its status, update state when it completes or fails, and handle the component unmounting before the request finishes.',
    code: {
      title: 'Mutations with TanStack Query — creating/updating data',
      snippet: `function AddProductForm() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (newProduct) => fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json()),

    onSuccess: () => {
      // Invalidate the products list so it refetches with the new item
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return (
    <form onSubmit={e => {
      e.preventDefault();
      mutate({ name: e.target.name.value, price: +e.target.price.value });
    }}>
      <input name="name" placeholder="Name" required />
      <input name="price" type="number" placeholder="Price" required />
      <button disabled={isPending}>{isPending ? 'Saving…' : 'Add Product'}</button>
    </form>
  );
}` },
    points: [
      'AbortController provides proper request cancellation — more explicit than the ignore flag, and genuinely aborts the HTTP request instead of just ignoring the response.',
      'Always check response.ok before parsing — a 404 or 500 response is still a "resolved" fetch Promise, not an error.',
      'For authenticated requests, set up a centralized fetch wrapper or Axios instance with Authorization headers and token refresh logic.'
    ]
  },

  flowDiagram: {
    title: 'The fetch lifecycle in a component',
    steps: [
      { icon: '⚡', label: 'Component mounts / deps change', note: 'useEffect fires' },
      { icon: '🔄', label: 'Set status="loading"', note: 'UI shows spinner/skeleton' },
      { icon: '📡', label: 'fetch() request sent', note: 'HTTP request to API' },
      { icon: '✅', label: 'Response arrives', note: 'Success → setData; Error → setError' },
      { icon: '🖥️', label: 'Re-render with data or error', note: 'UI updates to final state' }
    ]
  },

  realWorldExamples: {
    intro: 'Every real React app mixes these API integration patterns:',
    items: [
      { icon: '🛍️', title: 'E-commerce product listing', description: 'TanStack Query with queryKey: [\'products\', filters] — re-fetches automatically when filters change, caches results, shows stale data while refreshing in the background.' },
      { icon: '👤', title: 'User profile with mutations', description: 'useQuery for reading profile data + useMutation for updating it — onSuccess invalidates the cached profile so the UI reflects the change immediately.' },
      { icon: '📄', title: 'Paginated data tables', description: 'TanStack Query\'s keepPreviousData option shows the current page while the next page loads, and prefetches adjacent pages for instant navigation.' },
      { icon: '🔐', title: 'Authenticated API calls', description: 'Centralized Axios instance with interceptors that inject the auth token and handle 401 token expiry / refresh automatically for every request.' }
    ]
  },

  prosAndCons: {
    pros: [
      'TanStack Query / SWR eliminate entire categories of bugs (race conditions, stale data) with minimal code.',
      'Automatic caching, deduplication, and background refresh improve both UX and performance.',
      'Consistent patterns (useQuery, useMutation) across the app reduce cognitive load.',
      'Excellent DevTools in TanStack Query for visualizing cache state and request timing.'
    ],
    cons: [
      'TanStack Query/SWR have learning curves — especially cache invalidation and query key design.',
      'Manual useEffect fetching, while more verbose, requires no additional dependency.',
      'Over-caching (staleTime too high) can show users outdated data in UIs where freshness matters.',
      'GraphQL adds its own complexity layer (normalized caching, fragments, type policies) before you get the benefits.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Not handling the race condition in useEffect fetches',
        wrong: `useEffect(() => { fetch('/api').then(r => r.json()).then(setData); }, [id]); // ❌ old response can arrive after new`,
        right: `useEffect(() => {\n  let ignore = false;\n  fetch('/api').then(r => r.json()).then(data => { if (!ignore) setData(data); });\n  return () => { ignore = true; };\n}, [id]); // ✅`,
        note: 'When id changes quickly, multiple in-flight requests may resolve out of order. The ignore flag ensures only the response for the most recent request updates state.'
      },
      {
        title: 'Treating a non-2xx response as a successful fetch',
        wrong: `fetch('/api/data').then(r => r.json()).then(setData); // ❌ a 404 still reaches .then — it\'s a "resolved" fetch`,
        right: `fetch('/api/data').then(r => { if (!r.ok) throw new Error(\`HTTP \${r.status}\`); return r.json(); }).then(setData);`,
        note: 'The fetch() Promise only rejects on network errors, not HTTP error codes. Always check response.ok (or throw on r.status >= 400) before parsing the JSON body.'
      },
      {
        title: 'Fetching on every render instead of only on mount',
        wrong: `// No dependency array → runs after EVERY render → infinite loop if it updates state\nuseEffect(() => { fetchData().then(setData); }); // ❌ no deps`,
        right: `useEffect(() => { fetchData().then(setData); }, []); // ✅ mount only (or provide the real deps it depends on)`,
      }
    ]
  },

  bestPractices: [
    'Use TanStack Query or SWR for any meaningful data fetching — the manual pattern is brittle and verbose at scale.',
    'Always handle all three states: loading, error, and success — an incomplete experience for any state is a UX failure.',
    'Guard against race conditions: use the ignore flag or AbortController in manual useEffect fetches.',
    'Design query keys thoughtfully in TanStack Query — they determine cache identity and invalidation scope.',
    'Centralize API configuration (base URL, auth headers, error handling) in an Axios instance or a custom fetcher — don\'t repeat it in every component.'
  ],

  interviewQuestions: [
    { q: 'What is a race condition in React data fetching and how do you prevent it?', a: 'A race condition occurs when multiple requests for the same data are in-flight simultaneously (e.g. because a dependency changed quickly), and a response from an OLDER request arrives after a response from a NEWER one — overwriting fresh data with stale data. The standard prevention in useEffect is an "ignore" flag: set it to true in the cleanup function, and check it before updating state with any response. AbortController provides a more complete solution by actually cancelling the in-flight HTTP request.' },
    { q: 'Why does fetch() not throw on 404 or 500 responses?', a: 'fetch() resolves its Promise (calls .then) for any complete HTTP response, including 4xx and 5xx status codes — it only rejects on actual network failures (DNS errors, connection timeouts, no network). To treat HTTP errors as failures, you must explicitly check response.ok (true for 200-299 status codes) and throw manually if it\'s false: if (!response.ok) throw new Error(`HTTP ${response.status}`). TanStack Query / Axios handle this more gracefully out of the box.' },
    { q: 'What advantages does TanStack Query offer over manual useEffect+useState data fetching?', a: 'TanStack Query provides: (1) automatic caching — requests for the same key return cached data instantly on subsequent mounts; (2) background refresh — stale data is shown while fresh data fetches in the background; (3) request deduplication — concurrent renders requesting the same key share one request; (4) race condition handling — always resolves with the latest request; (5) automatic garbage collection of old cache entries; (6) a useMutation hook with optimistic update and invalidation support. All this comes with less code than a manual implementation of even a subset of these features.' },
    { q: 'How do you handle authentication tokens in API calls across an entire React app?', a: 'Centralize auth headers in a fetch wrapper or Axios instance configured at app startup: set the Authorization header in an Axios request interceptor that reads the token from wherever auth state lives. Add a response interceptor that catches 401 responses, attempts a token refresh, and retries the original request. This ensures every API call throughout the app automatically includes authentication without each component managing headers manually.' },
    { q: 'What is cache invalidation in TanStack Query, and when would you use it?', a: 'Cache invalidation marks cached query data as stale (or removes it) so it gets re-fetched. Call queryClient.invalidateQueries({ queryKey: [\'products\'] }) in a useMutation\'s onSuccess callback after creating or updating a product — this tells TanStack Query that the cached products list no longer reflects the server state and needs to be re-fetched. This pattern (mutate → invalidate → auto-refetch) keeps the UI consistent with the server without manually updating the local cache.' }
  ],

  summary: {
    description: 'API integration in React is fundamentally about managing asynchronous state correctly — loading, error, success, caching, and race conditions. Start with the manual useEffect pattern for simple one-off fetches (with proper race-condition handling); graduate to TanStack Query or SWR as soon as data-fetching complexity grows. These libraries replace hundreds of lines of manual boilerplate with a few hooks, and produce more correct, more performant results in the process.'
  },

  furtherReading: [
    { label: 'TanStack Query docs', note: 'tanstack.com/query/latest/docs/react/overview — comprehensive docs for the most popular React server-state library.' },
    { label: 'Official React docs', note: 'react.dev/learn/synchronizing-with-effects — the canonical explanation of when and how to fetch data in effects, including the race condition pattern.' }
  ]
};

export default apiIntegrationContent;
