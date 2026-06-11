const apiIntegrationContent = {
  id: 'apiIntegration',
  title: 'API Integration',
  icon: '🔗',
  theme: 'amber',
  tagline: 'Fetch data from a server in React — handle loading, errors, caching, and race conditions correctly.',
  meta: 'Ecosystem · Data Fetching',

  whatIsIt: {
    description: [
      'API integration in React means connecting components to external data — REST APIs, GraphQL, or backend services — while correctly handling loading states, errors, race conditions, and caching.',
      'You can use the manual useEffect + useState pattern (built in, good for simple cases) or a data-fetching library like TanStack Query or SWR (handles caching, deduplication, and background refresh automatically).'
    ],
    points: [
      'Basic pattern: fetch in useEffect → set loading/data/error state → render based on status.',
      'Common problems with naive fetching: race conditions, no cancellation on unmount, duplicate requests, no caching.',
      'TanStack Query / SWR solve all common problems automatically with much less code.',
      'Always handle three states: loading, error, and success — users see all three.'
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
      text: '"Fetching data is like ordering a package online. A naive approach just sends the order and waits — if you reorder and the OLD package arrives AFTER the new one, it overwrites the correct data (race condition). Good implementation tracks which response belongs to the latest request, shows delivery progress (loading/error/success), and cancels old orders on unmount. TanStack Query is the professional shipping service that handles all of this automatically."'
    }
  },

  whyUsed: {
    description: 'Every non-trivial React app needs to communicate with a backend. Getting this right — handling all edge cases — is where a library pays for itself many times over.',
    points: [
      'Async data can fail — every component that fetches must handle loading, error, and success.',
      'Naive implementations suffer from race conditions, memory leaks, and no caching.',
      'Libraries like TanStack Query solve these problems with far less code.',
      'Consistent patterns across the app reduce bugs and improve user experience.'
    ]
  },

  whenToUse: {
    description: 'Every component that needs external data needs API integration. The question is which approach to use.',
    points: [
      'Simple, one-off fetches: manual useEffect + useState is fine with proper race condition handling.',
      'Complex data needs (caching, background refresh, pagination): TanStack Query or SWR.',
      'GraphQL APIs: Apollo Client or urql offer type-safe, normalized caching.',
      'Real-time data (WebSockets, SSE): custom useEffect subscriptions or dedicated libraries.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'The race condition you do not know about',
      text: '"A component fetches data when params change. The user changes params quickly. Request #1 (old params) takes longer than Request #2 (new params). Request #1 arrives AFTER Request #2 and overwrites the correct data with stale data. The fix is the ignore flag in useEffect\'s cleanup. TanStack Query handles this automatically."'
    }
  },

  howItWorks: {
    description: 'Whether manual or via a library, the pattern is the same: initiate a request, track its status, update state when it completes or fails, and handle the component unmounting before the request finishes.',
    code: {
      title: 'Mutations with TanStack Query — creating data',
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
      'AbortController properly cancels the HTTP request — stronger than the ignore flag which just ignores the response.',
      'Always check response.ok before parsing — a 404 or 500 is still a resolved fetch Promise, not an error.',
      'Use a centralized fetch wrapper or Axios instance for auth headers and token refresh across the app.'
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
      { icon: '📄', title: 'Paginated data tables', description: 'TanStack Query\'s keepPreviousData shows the current page while the next page loads, and can prefetch adjacent pages for instant navigation.' },
      { icon: '🔐', title: 'Authenticated API calls', description: 'Centralized Axios instance with interceptors that inject the auth token and handle 401 token expiry/refresh automatically for every request.' }
    ]
  },

  prosAndCons: {
    pros: [
      'TanStack Query / SWR eliminate race conditions and stale data bugs with minimal code.',
      'Automatic caching, deduplication, and background refresh improve both UX and performance.',
      'Consistent useQuery/useMutation patterns across the app reduce cognitive load.',
      'Excellent DevTools in TanStack Query for visualizing cache state and request timing.'
    ],
    cons: [
      'TanStack Query/SWR have learning curves — cache invalidation and query key design take practice.',
      'Manual useEffect fetching requires no extra dependency.',
      'Caching too aggressively (staleTime too high) shows users outdated data.',
      'GraphQL adds its own complexity layer before you get the benefits.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Not handling the race condition in useEffect fetches',
        wrong: `useEffect(() => { fetch('/api').then(r => r.json()).then(setData); }, [id]); // ❌ old response can overwrite new`,
        right: `useEffect(() => {\n  let ignore = false;\n  fetch('/api').then(r => r.json()).then(data => { if (!ignore) setData(data); });\n  return () => { ignore = true; };\n}, [id]); // ✅`,
        note: 'When id changes quickly, multiple in-flight requests may resolve out of order. The ignore flag ensures only the most recent response updates state.'
      },
      {
        title: 'Treating a non-2xx response as a successful fetch',
        wrong: `fetch('/api/data').then(r => r.json()).then(setData); // ❌ a 404 still reaches .then`,
        right: `fetch('/api/data').then(r => { if (!r.ok) throw new Error(\`HTTP \${r.status}\`); return r.json(); }).then(setData);`,
        note: 'fetch() only rejects on network failures, not HTTP error codes. Always check response.ok before parsing the JSON body.'
      },
      {
        title: 'Fetching on every render instead of only on mount',
        wrong: `// No dependency array → runs after every render → infinite loop if it sets state\nuseEffect(() => { fetchData().then(setData); }); // ❌`,
        right: `useEffect(() => { fetchData().then(setData); }, []); // ✅ mount only`,
        note: 'The dependency array controls when the effect re-runs. An empty array runs once on mount. Leaving it out runs after every single render.'
      }
    ]
  },

  bestPractices: [
    'Use TanStack Query or SWR for any meaningful data fetching — the manual pattern becomes brittle at scale.',
    'Always handle all three states: loading, error, and success — an incomplete experience for any state is a UX failure.',
    'Guard against race conditions with the ignore flag or AbortController in manual useEffect fetches.',
    'Design query keys thoughtfully in TanStack Query — they determine cache identity and invalidation scope.',
    'Centralize API configuration (base URL, auth headers, error handling) in an Axios instance or custom fetcher.'
  ],

  interviewQuestions: [
    { q: 'What is a race condition in React data fetching and how do you prevent it?', a: 'A race condition occurs when multiple requests are in-flight simultaneously and an older response arrives after a newer one — overwriting fresh data with stale data. The standard fix in useEffect is an ignore flag: set it to true in the cleanup function and check it before updating state. AbortController provides a stronger solution by actually cancelling the HTTP request.' },
    // eslint-disable-next-line no-template-curly-in-string
    { q: 'Why does fetch() not throw on 404 or 500 responses?', a: 'fetch() resolves its Promise for any complete HTTP response, including 4xx and 5xx. It only rejects on actual network failures. To treat HTTP errors as failures, check response.ok (true for 200–299) and throw manually if it is false: if (!response.ok) throw new Error(`HTTP ${response.status}`).' },
    { q: 'What advantages does TanStack Query offer over manual useEffect + useState?', a: 'TanStack Query provides: automatic caching (same query key returns cached data instantly), background refresh (stale data shown while fresh data fetches), request deduplication (concurrent components share one request), race condition handling (always uses latest request), and a useMutation hook with cache invalidation. All this replaces hundreds of lines of manual boilerplate with a few hooks.' },
    { q: 'How do you handle authentication tokens across the entire app?', a: 'Centralize auth headers in an Axios instance configured at startup — add the Authorization header in a request interceptor and add a response interceptor to catch 401s, attempt a token refresh, and retry the original request. This ensures every API call automatically includes authentication without each component managing headers manually.' },
    { q: 'What is cache invalidation in TanStack Query?', a: 'Cache invalidation marks cached query data as stale so it gets re-fetched. Call queryClient.invalidateQueries({ queryKey: [\'products\'] }) in a useMutation onSuccess callback after creating or updating data. This tells TanStack Query the cached list no longer reflects the server state and needs a fresh fetch — keeping the UI consistent with the server.' }
  ],

  summary: {
    description: 'API integration in React is about managing async state correctly — loading, error, success, caching, and race conditions. Start with manual useEffect for simple one-off fetches (with the ignore flag). Graduate to TanStack Query or SWR as data-fetching complexity grows. These libraries replace complex manual boilerplate with a few hooks and produce more correct, more performant results.'
  },

  furtherReading: [
    { label: 'TanStack Query docs', note: 'tanstack.com/query/latest/docs/react/overview — comprehensive docs for the most popular React server-state library.' },
    { label: 'Official React docs', note: 'react.dev/learn/synchronizing-with-effects — the canonical explanation of fetching in effects, including the race condition pattern.' }
  ]
};

export default apiIntegrationContent;
