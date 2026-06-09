const bestPracticesContent = {
  id: 'bestPractices',
  title: 'React Best Practices',
  icon: '🏆',
  theme: 'violet',
  tagline: 'The rules, patterns, and conventions that experienced React developers follow to write maintainable, performant code.',
  meta: 'Concepts · Best Practices',

  whatIsIt: {
    description: [
      'React best practices are the accumulated wisdom of the community — patterns that consistently produce more maintainable, performant, and bug-resistant code, distilled from years of production experience at scale.',
      'They cover: component design, state management, effects, performance, file organization, naming conventions, and accessibility — the full spectrum of decisions you make while building a React app.'
    ],
    points: [
      'Keep components small and focused: each component does one thing well.',
      'Colocate state: state lives as close as possible to where it\'s needed.',
      'Prefer declarative over imperative patterns wherever possible.',
      'Extract complexity into custom hooks: components describe WHAT, hooks handle HOW.',
      'Never skip the key prop — and never use the array index as a key for dynamic lists.'
    ],
    code: { title: 'Key best practices illustrated', snippet: `// 1. One component, one responsibility
// ❌ God component — too many concerns
function ProductPage({ id }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState([]);
  // 200 lines of mixed logic...
}

// ✅ Each component has a clear purpose
function ProductPage({ id }) {
  return <ProductLayout id={id}><ProductReviews productId={id} /></ProductLayout>;
}

// 2. Derive state from existing state — don't duplicate
const [items, setItems] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
// ❌ const [filtered, setFiltered] = useState([]); // derived state duplicated
// ✅ const filtered = items.filter(i => i.name.includes(searchQuery)); // derived

// 3. Custom hooks for cross-cutting logic
function useProductData(id) {
  return useQuery({ queryKey: ['product', id], queryFn: () => fetchProduct(id) });
}
function ProductCard({ id }) {
  const { data, isLoading } = useProductData(id); // clean component body
  if (isLoading) return <Skeleton />;
  return <div>{data.name}</div>;
}

// 4. Avoid array-index keys for dynamic lists
// ❌ items.map((item, i) => <Item key={i} />);    // breaks on reorder/delete
// ✅ items.map(item => <Item key={item.id} />);    // stable, data-derived` },
    analogy: {
      icon: '🏗️',
      title: 'Real-World Analogy',
      text: '"Best practices in React are like building codes in construction — they\'re not arbitrary rules, they\'re lessons learned from things that failed at scale. \'Never use index as a key\' is the engineering equivalent of \'always pour a proper foundation before building walls\' — it\'s possible to ignore it and sometimes get away with it, but it will bite you when the situation becomes complex enough."'
    }
  },

  whyUsed: {
    description: 'React gives you enormous flexibility — there are a dozen ways to do almost anything. Best practices represent the patterns that experienced engineers have found consistently lead to good outcomes: maintainable code, fewer bugs, better performance, easier onboarding of new team members.',
    points: [
      'Component design: small, focused, composable components that are easy to test and reuse.',
      'State hygiene: single source of truth, no duplicated state, derived values computed not stored.',
      'Effects discipline: effects for side effects only — not as a general-purpose "do something on render" mechanism.',
      'Performance: memoize deliberately (after profiling), not preemptively everywhere.'
    ]
  },

  whenToUse: {
    description: 'Apply these consistently from the start — technical debt from ignoring them compounds rapidly in React codebases.',
    points: [
      'Component naming: always PascalCase for components, camelCase for everything else.',
      'File structure: one component per file, co-located test and style files, grouped by feature.',
      'Effect discipline: each effect does one thing; dependencies are complete and correct.',
      'Prop design: prefer explicit, named props over massive prop objects; avoid spreading \'...\' all props blindly.'
    ],
    analogy: {
      icon: '📏',
      title: 'The single responsibility principle',
      text: '"If you have to use \'and\' to describe what a component does — \'it fetches the user AND renders the profile AND handles the edit form AND manages notifications\' — it has too many responsibilities. Split it. Each component should do exactly one thing with laser focus. This makes each piece individually testable, reusable, and replaceable."'
    }
  },

  howItWorks: {
    description: 'Best practices are applied at three levels: design time (how you structure components and state), development time (how you write effects, handlers, and hooks), and review time (what patterns your team enforces consistently).',
    code: {
      title: 'Anti-patterns → best practices side-by-side',
      snippet: `// ANTI-PATTERN 1: effect used to sync derived state
// ❌
const [count, setCount] = useState(0);
const [isEven, setIsEven] = useState(true);
useEffect(() => setIsEven(count % 2 === 0), [count]); // extra render, extra complexity

// ✅
const isEven = count % 2 === 0; // derive during render — always correct

// ANTI-PATTERN 2: Effect for event-driven logic
// ❌
const [submitted, setSubmitted] = useState(false);
useEffect(() => { if (submitted) sendAnalytics('form_submitted'); }, [submitted]);

// ✅ — respond to events in event handlers, not effects
const handleSubmit = () => {
  sendAnalytics('form_submitted'); // side effect triggered by the event
  submitForm();
};

// ANTI-PATTERN 3: Massive prop objects
// ❌
function Form({ config }) {
  return <input type={config.type} value={config.value} onChange={config.onChange} />;
}
// ✅
function Form({ type, value, onChange }) { // explicit, documented props
  return <input type={type} value={value} onChange={onChange} />;
}

// ANTI-PATTERN 4: useEffect for one-time initialization
// ❌
const [initialized, setInitialized] = useState(false);
useEffect(() => { if (!initialized) { init(); setInitialized(true); } }, []);

// ✅
if (typeof window !== 'undefined') init(); // module-level, or use a ref-based init guard` },
    points: [
      '"You Might Not Need an Effect": effects are for synchronizing with EXTERNAL systems (DOM, APIs, third-party libraries). For anything that can be derived from existing state, or should happen in response to an event, an effect is the wrong tool.',
      'Prop naming conventions: boolean props use "is/has/can" prefix (isLoading, hasError, canEdit); event handlers start with "on" (onClick, onChange, onSubmit).',
      'Component composition over configuration: prefer children/slots over a massive `variant` prop that does different things in different modes.'
    ]
  },

  flowDiagram: {
    title: 'The decision hierarchy for any piece of code',
    steps: [
      { icon: '🤔', label: 'Can this be derived from existing state?', note: 'Yes → compute it, don\'t store it' },
      { icon: '🎯', label: 'Should it happen because of a user event?', note: 'Yes → event handler, not effect' },
      { icon: '🔌', label: 'Does it sync with an EXTERNAL system?', note: 'Yes → useEffect (proper home)' },
      { icon: '🧩', label: 'Is it reused by multiple components?', note: 'Yes → custom hook' },
      { icon: '🪆', label: 'Is this component doing too much?', note: 'Yes → split into smaller components' }
    ]
  },

  realWorldExamples: {
    intro: 'These patterns recur in every well-designed React codebase:',
    items: [
      { icon: '🧩', title: 'Feature-based folder structure', description: 'src/features/cart/ containing CartProvider, CartSummary, CartItem, useCart.js, cartReducer.js — everything related to the cart feature lives together, making it easy to find, change, and delete.' },
      { icon: '🎣', title: 'Custom hooks for API calls', description: 'useProductSearch(query), useUserProfile(id), useInfiniteScroll() — components read data via clean hook interfaces; the fetching/caching implementation is invisible.' },
      { icon: '📝', title: 'Controlled vs. uncontrolled forms', description: 'Default to uncontrolled for simple forms (useRef or react-hook-form). Use controlled (useState) when you need real-time validation, dependent fields, or to sync form state with parent state. Don\'t over-control simple forms.' },
      { icon: '⚠️', title: 'Always-correct error and loading states', description: 'Every component that fetches data must render meaningfully in all three states: loading (skeleton), error (error message), and success (data). A component that only handles the success path is incomplete.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Consistent patterns make code predictable and easier to navigate for any team member.',
      'Following established best practices prevents entire categories of subtle bugs (stale state, unnecessary re-renders, effect misuse).',
      'Good component design produces naturally testable, reusable pieces.',
      'Accumulated community wisdom — benefit from what others have learned at scale.'
    ],
    cons: [
      'Best practices are opinionated — reasonable teams sometimes disagree on specific choices.',
      'Some practices (always memoize hooks\' return values in Providers) add code that feels like overhead.',
      'Practices evolve with React versions — what was best practice in React 16 may not be in React 18+.',
      'Over-engineering in pursuit of "best practices" can make simple things unnecessarily complex — pragmatism matters.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using effects to sync derived state',
        wrong: `const [count, setCount] = useState(0);\nconst [doubled, setDoubled] = useState(0);\nuseEffect(() => setDoubled(count * 2), [count]); // ❌ extra state, extra render, always out of sync risk`,
        right: `const doubled = count * 2; // ✅ derive it — always in sync, no effect needed`,
        note: 'If a value can be computed from existing state/props during render, it should be computed — not stored as state and kept in sync via an effect. This is one of the most common React anti-patterns.'
      },
      {
        title: 'Responding to events inside effects instead of event handlers',
        wrong: `const [shouldFetch, setShouldFetch] = useState(false);\nuseEffect(() => { if (shouldFetch) fetchData(); }, [shouldFetch]); // ❌ roundabout`,
        right: `const handleSubmit = () => { fetchData(); }; // ✅ direct — respond to events in handlers`,
        note: 'Effects are for synchronizing with external systems, not for triggering code in response to events. If something should happen "because the user did X", put it in the event handler for X — not in an effect watching state that the handler sets.'
      },
      {
        title: 'Missing key props or using index as keys',
        wrong: `items.map((item, i) => <Item key={i} {...item} />); // ❌ index as key breaks on reorder/filter/insert`,
        right: `items.map(item => <Item key={item.id} {...item} />); // ✅ stable, data-derived, unique ID`,
        note: 'Index keys cause React to incorrectly match items across list mutations, leading to wrong state on re-ordered/filtered lists, animation glitches, and subtle focus bugs. Use the item\'s stable unique ID from your data as the key.'
      }
    ]
  },

  bestPractices: [
    'One responsibility per component — if the name contains "and", split it.',
    'Derive state, don\'t duplicate it — computed values belong in the render, not as additional state.',
    'Respond to events in event handlers — use effects only for syncing with external systems.',
    'Keep effects small and focused: one concern per effect, always with correct cleanup.',
    'Always provide complete dependency arrays in effects/memos — let the eslint-plugin-react-hooks exhaustive-deps rule enforce this.',
    'Never use array index as a list key — always use a stable, data-derived unique ID.',
    'Name booleans with is/has/can; event handlers with on; custom hooks with use.',
    'Colocate related files (component, test, styles) in feature folders.',
    'Write components and hooks that are independently testable from their usage context.',
    'Profile before memoizing — React.memo/useMemo/useCallback have overhead and add complexity; apply them to measured bottlenecks, not preemptively.'
  ],

  interviewQuestions: [
    { q: 'What does "you might not need an effect" mean, and when does it apply?', a: 'React effects (useEffect) are specifically for synchronizing your component with an EXTERNAL system — the DOM, a WebSocket, a third-party library. Many developers overuse them for things that don\'t require effects: computing derived values (better done during render), responding to events (better done in the event handler directly), or transforming data when props change (better done inline). "You Might Not Need an Effect" is React\'s guidance that effects are a specific tool with a specific purpose — and that reaching for them for other purposes adds unnecessary complexity and extra renders.' },
    { q: 'Why is using array index as a list key an anti-pattern?', a: 'React uses keys to identify which items in a list correspond to which items in the previous render, to decide what to update, move, or remount. Index keys tie item identity to POSITION — when you reorder, insert, or delete items, the indices shift, and React incorrectly matches items to their previous states. This causes: wrong component state (item 2\'s state appearing on item 3 after a delete), wrong DOM focus, animation glitches, and subtle data display bugs. Stable, data-derived unique IDs (e.g. item.id from a database) solve all of these.' },
    { q: 'What is state colocation and why is it important?', a: 'State colocation means keeping state as close as possible to where it\'s used — in the component that owns it, not in a parent that merely passes it down, and not in a global store if only one subtree needs it. Colocation limits the blast radius of state changes: only the subtree that owns the state re-renders when it changes. It also makes components self-contained and independently testable. Lifting state higher than necessary, or globalizing it unnecessarily, causes broad re-renders and tight coupling between unrelated components.' },
    { q: 'What is the difference between controlled and uncontrolled components for forms?', a: 'A controlled input\'s value is driven by React state — every keystroke calls setState, making React the source of truth. This enables real-time validation, dependent fields, and explicit control over the value. An uncontrolled input stores its value in the DOM itself — you read it with a ref or on submit. Uncontrolled is simpler for basic forms; controlled is necessary when you need to react to input changes in real time. Libraries like react-hook-form use uncontrolled inputs under the hood for performance, with an API that feels controlled.' },
    { q: 'When should you split a component into smaller sub-components?', a: 'Split when: (1) the component\'s description requires "and" (it does A and B and C); (2) a part of the component could be reused elsewhere; (3) a large, complex JSX block has a clear conceptual identity that a child component name would clarify; (4) a section renders independently and could benefit from its own memoization; or (5) the component\'s prop list has grown too long for one logical unit. The guiding principle: each component should do one thing, and its name should clearly and completely describe that one thing.' }
  ],

  summary: {
    description: 'React best practices are the patterns that consistently produce maintainable, performant, bug-resistant code: small focused components, colocated state, derived values computed during render, effects only for external system sync, stable list keys, and deliberately-applied memoization. Apply them consistently, enforce them with linting (eslint-plugin-react-hooks), and treat them as the foundation that allows confident refactoring and scaling.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/you-might-not-need-an-effect — the canonical "when not to use effects" guide, directly applicable to the most common React anti-pattern.' },
    { label: 'Related topics', note: 'See "Performance Optimization" for memoization best practices, "State Management" for state colocation and store design, and "Testing" for testability-driven component design.' }
  ]
};

export default bestPracticesContent;
