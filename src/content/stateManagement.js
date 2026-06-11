const stateManagementContent = {
  id: 'stateManagement',
  title: 'State Management',
  icon: '🗃️',
  theme: 'blue',
  tagline: 'Choose the right place for your state — from local component state to global stores.',
  meta: 'Ecosystem · Architecture',

  whatIsIt: {
    description: [
      'State management is deciding where state lives, how it flows between components, and how it changes. Getting this right keeps apps predictable and easy to maintain.',
      'The range goes from React\'s built-in tools (useState, useReducer, Context) to purpose-built libraries (Redux Toolkit, Zustand, TanStack Query) — each with different trade-offs.'
    ],
    points: [
      'Local state (useState/useReducer): owned by one component, lives and dies with it.',
      'Lifted state: shared by siblings, lives in their nearest common parent.',
      'Context: "ambient" data (auth, theme, locale) shared without prop drilling.',
      'External stores (Zustand, Redux): global state with fine-grained subscription and selector support.',
      'Server state (TanStack Query, SWR): remote data with caching, background refresh, and sync with the server.'
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
      text: '"State management is like deciding where to keep things at home. The TV remote stays on the couch (local state). Car keys are by the front door (lifted state — the whole family needs access). House rules are on the fridge (Context — rarely changes). The safe holds documents everyone might need (external store). The grocery list updates frequently from outside (server state — TanStack Query)."'
    }
  },

  whyUsed: {
    description: 'As apps grow, state logic grows too. Without a clear strategy, state scatters, duplicates, gets out of sync, and causes bugs. A deliberate approach keeps data flow predictable and maintainable.',
    points: [
      'Prevents the same data living in multiple places and getting out of sync.',
      'Components re-render only for the state they actually care about (with selectors).',
      'Separates server state (async, cached, stale) from client state (sync, local, UI).',
      'Makes state changes predictable, traceable, and testable.'
    ]
  },

  whenToUse: {
    description: 'Start simple (local state) and escalate only when you have a real problem.',
    points: [
      'Local state: the value is only needed by one component or its direct children.',
      'Lifted state: two or more sibling components need to share the same value.',
      'Context: needed by many components at various depths, changes infrequently.',
      'External store: many unrelated components need it with performance-critical selective subscriptions.',
      'TanStack Query/SWR: any state that comes from a server and needs caching or background refresh.'
    ],
    analogy: {
      icon: '📏',
      title: 'The escalation principle',
      text: '"Start with useState. When siblings share it, lift it. When it goes many levels deep, use Context. When Context\'s all-or-nothing re-renders become slow, use Zustand or Redux. When data comes from a server, use TanStack Query. Skip steps only when you have real evidence — premature global state causes just as many problems as no strategy."'
    }
  },

  howItWorks: {
    description: 'The key insight is understanding the difference between client state (UI interactions, synchronous) and server state (remote data, async, can become stale). Each has different lifecycle and needs different tools.',
    code: {
      title: 'Zustand — minimal global store with selectors',
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
      'Redux Toolkit: modern Redux with createSlice and RTK Query. Best for large teams wanting strong conventions and DevTools.',
      'Zustand: minimal boilerplate, direct store reads. Great for small-to-medium global state without Redux complexity.',
      'Jotai: atomic model — each state piece is an atom, components subscribe only to the atoms they use.',
      'TanStack Query / SWR: dedicated server-state — caching, deduplication, background refresh, optimistic updates.'
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
      { icon: '🛒', title: 'Shopping cart (Context + useReducer or Zustand)', description: 'Client-side, mutable, accessed from header badge, product grid, and checkout simultaneously.' },
      { icon: '📦', title: 'Remote data (TanStack Query)', description: 'Product lists, user profiles, order history — all benefit from caching and background refresh. TanStack Query removes the useEffect+isLoading pattern entirely.' },
      { icon: '🎨', title: 'UI state (local useState)', description: 'Modal open/close, accordion expanded, form field values — these live and die with their component. Never put these in a global store.' }
    ]
  },

  prosAndCons: {
    pros: [
      'React\'s built-in tools are sufficient for most small-to-medium apps.',
      'External libraries add selectors, DevTools, and middleware for large-scale needs.',
      'TanStack Query/SWR dramatically simplify server state — less code, better UX, built-in caching.',
      'The ecosystem is mature — every pattern has well-documented library support.'
    ],
    cons: [
      'Overusing global state causes broad re-renders and harder component isolation.',
      'Each library has its own learning curve — team alignment matters.',
      'Mixing server state and client state in one store leads to complex sync logic.',
      'No one-size-fits-all solution — the right tool depends on app size and requirements.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Putting server/API data in a client state store',
        wrong: `dispatch(fetchProducts()); // ❌ manually caching API responses in Redux — lots of boilerplate, stale data bugs`,
        right: `const { data } = useQuery({ queryKey: ['products'], queryFn: fetchProducts }); // ✅ TanStack Query handles caching automatically`,
        note: 'Server state is async, can become stale, needs background refresh, and should be invalidated when data changes. TanStack Query/SWR handle all this; a client store is not designed for it.'
      },
      {
        title: 'Going global too early',
        note: 'Adding every new piece of state to a global store "because it might be needed elsewhere" causes broad re-renders and couples unrelated components. Start local, escalate only when you have a real sharing problem — colocation is a feature, not a limitation.'
      },
      {
        title: 'Ignoring state colocation',
        note: 'State should live as close to where it is used as possible. "Is this modal open?" belongs in the component that renders the modal, not in a global store. Colocating state reduces re-render scope and makes components independently testable.'
      }
    ]
  },

  bestPractices: [
    'Start with the simplest approach (local state) and escalate only when you have evidence of a need.',
    'Treat server state (API data) and client state (UI interactions) as different categories — use TanStack Query/SWR for server state.',
    'Colocate state as close to where it is used as possible.',
    'In large apps: use Redux Toolkit or Zustand for complex client state with DevTools and testing needs.',
    'Define clear team conventions: where does auth state live? Where does form state live?'
  ],

  interviewQuestions: [
    { q: 'What is the difference between server state and client state?', a: 'Client state is owned entirely by the client — UI state, form values, modal open/close. It is synchronous, always fresh, and changes only from user actions. Server state is data fetched from a remote source — it is async, can become stale, needs caching, and may need background refresh. Using a client store (Redux, Zustand) for server data forces you to manually implement caching and staleness — complexity TanStack Query/SWR handle automatically.' },
    { q: 'What is state colocation and why is it a best practice?', a: 'State colocation means keeping state as close as possible to where it is used. A modal\'s open/close state should live near the modal — not in a global store. This scopes re-renders to the smallest subtree, makes components independently testable, and keeps the code easy to understand. Global state should only be for state genuinely needed by many unrelated parts of the app.' },
    { q: 'When would you choose Context over Zustand or Redux?', a: 'Context is good when state changes infrequently and is needed broadly — auth user, theme, locale. Since all consumers re-render on every context change, Context is a poor choice for frequently-updating state. Zustand or Redux are better when state updates often, many components subscribe with different slice interests, or when DevTools add value. Zustand is simpler; Redux Toolkit suits large teams needing strong conventions.' },
    { q: 'How does TanStack Query simplify server-state management?', a: 'A manual useEffect+useState pattern requires managing loading state, error state, cancellation, cache invalidation, and race conditions. TanStack Query handles all of this with a simple useQuery hook — it deduplicates requests, caches results, provides background refresh, and automatically invalidates caches on mutation. The result is far less code with more reliable behavior.' },
    { q: 'What is the "escalation principle" for state management?', a: 'Start with useState. Lift it to the nearest parent when siblings need to share it. Use Context when the same state is needed many levels deep. Reach for Zustand or Redux when Context\'s all-or-nothing re-renders become a performance bottleneck. Each step adds capability but also complexity — avoid skipping to the most powerful tool before you have evidence of a need.' }
  ],

  summary: {
    description: 'State management is a spectrum: local useState for component-owned data, lifting for shared siblings, Context for ambient cross-cutting values, external stores for global state with performance needs, and TanStack Query for server state with caching. The guiding principle is colocation — start local, escalate deliberately, and always treat server state as its own category with purpose-built tools.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/managing-state — canonical React guide to built-in state management tools.' },
    { label: 'Libraries', note: 'Redux Toolkit at redux-toolkit.js.org, Zustand at github.com/pmndrs/zustand, TanStack Query at tanstack.com/query.' }
  ]
};

export default stateManagementContent;
