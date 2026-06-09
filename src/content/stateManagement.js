const stateManagementContent = {
  id: 'stateManagement',
  title: 'State Management',
  icon: '🗃️',
  theme: 'blue',
  tagline: 'Choosing and using the right state management strategy — from local state to global stores.',
  meta: 'Ecosystem · Architecture',

  whatIsIt: {
    description: [
      'State management is the discipline of deciding where state lives, how it flows between components, and how it changes in response to user actions and data. Getting this right keeps apps predictable and maintainable; getting it wrong leads to bugs, unnecessary re-renders, and spaghetti data flow.',
      'The spectrum ranges from React\'s built-in tools (useState, useReducer, Context) to purpose-built external libraries (Redux Toolkit, Zustand, Jotai, TanStack Query) — each with different trade-offs in complexity, performance, and feature set.'
    ],
    points: [
      'Local state (useState/useReducer): owned by one component, lives and dies with it.',
      'Lifted state: shared by siblings, lives in their nearest common ancestor.',
      'Context: "ambient" data (auth, theme, locale) broadcast to any consumer without prop drilling.',
      'External stores (Redux, Zustand, Jotai): global state with optimized subscription and selector support for large-scale apps.',
      'Server state (TanStack Query, SWR): a separate category — remote data with caching, stale-while-revalidate, and sync with the server.'
    ],
    code: { title: 'When to reach for what', snippet: `// 1. Local state — component owns it, no one else cares
const [isOpen, setIsOpen] = useState(false);

// 2. Lifted state — two siblings need the same value
function Parent() {
  const [search, setSearch] = useState('');
  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <FilteredList query={search} />
    </>
  );
}

// 3. Context (+ useReducer) — cross-cutting data, changes infrequently
const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

// 4. Zustand — global state, accessed from anywhere, fine-grained selectors
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
const user = useStore((state) => state.user); // only re-renders if user changes

// 5. TanStack Query — server state
const { data, isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });` },
    analogy: {
      icon: '🏠',
      title: 'Real-World Analogy',
      text: '"State management is like deciding where to keep things in a house. Your TV remote lives on the couch (local state — one person uses it). Car keys live by the front door (lifted state — the whole household needs access). House rules are posted on the fridge (Context — ambient reference, rarely changes). The safe holds important documents that everyone might need but few actually access (external store). And the grocery list on the fridge gets updated frequently from outside (server state — TanStack Query)."'
    }
  },

  whyUsed: {
    description: 'As apps grow, state logic grows too — more components, more sharing, more derived values, more async data. Without a deliberate strategy, state scatters, duplicates, gets out of sync, and causes subtle bugs. A coherent state management strategy keeps data flow predictable, testable, and maintainable at scale.',
    points: [
      'Prevents "state spaghetti" — the same piece of data living in multiple places and getting out of sync.',
      'Ensures components re-render only for the state they actually care about (selector optimization in Zustand/Redux).',
      'Separates "server state" (async, cached, stale) from "client state" (sync, local, UI) — different problems need different tools.',
      'Makes state changes predictable, traceable, and testable — especially with reducer patterns.'
    ]
  },

  whenToUse: {
    description: 'Start simple (local state) and escalate only when you have evidence of a real problem.',
    points: [
      'Local state: the value is only needed by one component or its direct children.',
      'Lifted state: two or more sibling components need to share the same value.',
      'Context: the value is needed by many components at various depths, and changes infrequently.',
      'External store (Zustand/Redux): state needs to be accessed from many unrelated components with performance-critical selective subscriptions.',
      'TanStack Query/SWR: any state that comes from a server and needs caching, invalidation, background refresh.'
    ],
    analogy: {
      icon: '📏',
      title: 'The escalation principle',
      text: '"Start with useState. When two siblings need to share it, lift it up. When it needs to go many levels deep, use Context. When Context\'s all-or-nothing re-renders become a bottleneck, reach for Zustand or Redux. When data comes from a server and needs caching, use TanStack Query. Skip steps only when you have real evidence of a need — premature global state causes just as many problems as no strategy at all."'
    }
  },

  howItWorks: {
    description: 'The key insight that shapes state management decisions is understanding the difference between UI state, app state, and server state — each has different lifecycle, volatility, and ownership characteristics.',
    code: {
      title: 'Zustand — minimal, fast global store with selectors',
      snippet: `// store.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (credentials) => api.login(credentials).then(({ user, token }) =>
    set({ user, token })
  ),
  logout: () => set({ user: null, token: null }),
}));

// Any component — fine-grained subscription (only re-renders when user changes):
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);

// TanStack Query — the server state solution
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ProductList() {
  // Cached, background-refreshed, stale-while-revalidate:
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // treat as fresh for 5 min
  });
  if (isLoading) return <Spinner />;
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}` },
    points: [
      'Redux Toolkit (RTK): the modern Redux — createSlice, RTK Query for server state, excellent DevTools. Best for large teams that want strong conventions.',
      'Zustand: minimal boilerplate, direct store reads, works great for small-to-medium global state without Redux complexity.',
      'Jotai: atomic model — each piece of state is an atom, components subscribe only to the atoms they use. Great for granular, independent slices of state.',
      'TanStack Query / SWR: dedicated server-state libraries — caching, deduplicated fetching, background refresh, optimistic updates. Replace useEffect+useState fetching patterns with far less code.'
    ]
  },

  flowDiagram: {
    title: 'Choosing the right state tool',
    steps: [
      { icon: '🤔', label: 'Does only one component need it?', note: 'Yes → useState / useReducer' },
      { icon: '🤝', label: 'Is it shared by siblings / nearby?', note: 'Yes → Lift state to parent' },
      { icon: '🌐', label: 'Is it ambient / cross-cutting?', note: 'Yes → Context (+ useReducer)' },
      { icon: '🌍', label: 'Global with performance needs?', note: 'Yes → Zustand / Redux Toolkit' },
      { icon: '🔄', label: 'Comes from a server?', note: 'Yes → TanStack Query / SWR' }
    ]
  },

  realWorldExamples: {
    intro: 'Production apps typically use several layers simultaneously:',
    items: [
      { icon: '🔐', title: 'Auth state (Zustand or Context)', description: 'User identity and permissions — global, rarely changes after login. Zustand for fine-grained access; Context + useReducer for simpler apps.' },
      { icon: '🛒', title: 'Shopping cart (Context + useReducer or Zustand)', description: 'Client-side, mutable, accessed from header badge, product grid, and checkout. Context for small apps; Zustand for apps where cart updates frequently.' },
      { icon: '📦', title: 'Remote data (TanStack Query)', description: 'Product lists, user profiles, order history — all benefit from caching, background refresh, and automatic loading/error states. TanStack Query eliminates the useEffect+useState+isLoading pattern entirely.' },
      { icon: '🎨', title: 'UI state (local useState)', description: 'Modal open/close, accordion expanded, form field values — these live and die with their component, should never be in a global store.' }
    ]
  },

  prosAndCons: {
    pros: [
      'React\'s built-in tools (useState, Context, useReducer) are sufficient for most small-to-medium apps.',
      'External libraries (Zustand, Redux Toolkit) add powerful primitives (selectors, DevTools, middleware) for large-scale needs.',
      'TanStack Query/SWR dramatically simplify server-state management — less code, better UX, built-in caching.',
      'The ecosystem is mature — every pattern has well-tested, well-documented library support.'
    ],
    cons: [
      'Overusing global state (putting everything in a store) causes broad re-renders and makes component isolation harder.',
      'Each library has its own learning curve and mental model — team alignment matters.',
      'Conflating server state and client state (managing API responses manually in Redux) leads to complex, brittle sync logic.',
      'No one-size-fits-all solution — the "right" tool varies by app size, team, and requirements.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Putting server/API data in a client state store (Redux/Zustand)',
        wrong: `dispatch(fetchProducts()); // ❌ manually caching API responses in Redux — lots of boilerplate, stale data bugs`,
        right: `const { data } = useQuery({ queryKey: ['products'], queryFn: fetchProducts }); // ✅ TanStack Query handles caching, stale state, background refresh automatically`,
        note: 'Server state has different semantics from UI state: it\'s async, can become stale, needs background refresh, and should be invalidated when data changes. TanStack Query / SWR are purpose-built for this; a client store is not.'
      },
      {
        title: 'Going global too early',
        note: 'A common mistake: adding every new piece of state to the global store "because it might be needed elsewhere". Global state causes broad re-renders and couples components that shouldn\'t know about each other. Start local, escalate only when you have a real sharing problem — colocation is a feature.'
      },
      {
        title: 'Ignoring state colocation',
        note: 'State should live as close to where it\'s used as possible. UI state (is this modal open?) belongs in the component that renders the modal, not in a global store. Colocating state reduces the scope of re-renders and makes components independently testable and understandable.'
      }
    ]
  },

  bestPractices: [
    'Start with the simplest approach (local state) and escalate only when you have evidence of a need.',
    'Treat server state (API data) and client state (UI interactions) as different categories — use TanStack Query/SWR for the former.',
    'Colocate state as close to where it\'s used as possible — global state should be reserved for state that\'s genuinely global.',
    'In large apps: use Redux Toolkit or Zustand for complex client state with DevTools and testing needs.',
    'Define clear patterns for your team: where does auth state live? Where does form state live? Shared conventions prevent fragmentation.'
  ],

  interviewQuestions: [
    { q: 'What is the difference between server state and client state, and why does that distinction matter?', a: 'Client state is owned and managed entirely by the client — UI state, form values, modal open/close. It\'s synchronous, always fresh, and changes only in response to user actions. Server state is data fetched from a remote source — it\'s async, can become stale, needs to be cached, potentially shared with multiple users, and may need to be refreshed. Using a client state store (Redux, Zustand) to manage server data forces you to manually implement caching, staleness, and invalidation — complexity that TanStack Query/SWR handle automatically.' },
    { q: 'What is state colocation and why is it a best practice?', a: 'State colocation means keeping state as close as possible to where it\'s used. A modal\'s open/close state should live in (or very close to) the modal component — not in a global store. Benefits: re-renders are scoped to the smallest relevant subtree, components are independently testable, and the code is easier to understand because the state\'s purpose is obvious from context. Global state should be reserved for state that\'s genuinely needed by many unrelated parts of the app.' },
    { q: 'When would you choose Context over Zustand or Redux for shared state?', a: 'Context is a good choice when state changes infrequently and is needed broadly — auth user, theme, locale. Since all consumers re-render when the context value changes, Context is ill-suited for frequently-updating state. Zustand or Redux are better when state updates frequently, many components subscribe with different sub-slice interests (selectors), or when DevTools and middleware (logging, persistence) add value. Zustand is simpler; Redux Toolkit is better for large teams needing strong conventions.' },
    { q: 'How does TanStack Query (React Query) simplify server-state management compared to useEffect+useState?', a: 'A traditional useEffect+useState data-fetching pattern requires manually managing: loading state, error state, the data itself, cancellation of in-flight requests, avoiding state updates on unmounted components, and cache invalidation. TanStack Query handles all of this automatically with a simple useQuery hook — it deduplicates concurrent requests for the same data, caches results, provides background refresh when data becomes stale, and automatically invalidates caches on mutation. The result is dramatically less code with more reliable behavior.' },
    { q: 'What is the "escalation principle" for state management?', a: 'Start with the simplest tool for each piece of state: local useState for component-owned state. Lift it to the nearest common ancestor when siblings need to share it. Use Context when the same state is needed many levels deep without direct parent-child relationships. Reach for external stores (Zustand, Redux) when performance becomes a concern with Context\'s all-or-nothing re-renders, or when the app is large enough to benefit from DevTools and middleware. Each escalation step adds capability but also complexity — avoid skipping to the most powerful tool preemptively.' }
  ],

  summary: {
    description: 'State management in React is a spectrum: local useState for component-owned data, lifting state for shared siblings, Context for ambient cross-cutting values, external stores (Zustand/Redux) for global state with performance needs, and TanStack Query/SWR for server state with caching. The guiding principle is colocation — start local, escalate deliberately, and always treat server state as a distinct category with its own purpose-built tool.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/managing-state — the canonical React guide to the built-in state management tools and patterns.' },
    { label: 'Libraries', note: 'Redux Toolkit at redux-toolkit.js.org, Zustand at github.com/pmndrs/zustand, TanStack Query at tanstack.com/query — the main external options with their docs.' }
  ]
};

export default stateManagementContent;
