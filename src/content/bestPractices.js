const bestPracticesContent = {
  id: 'bestPractices',
  title: 'React Best Practices',
  icon: '🏆',
  theme: 'violet',
  tagline: 'The rules that experienced React developers follow to write clean, fast, and maintainable code.',
  meta: 'Concepts · Best Practices',

  whatIsIt: {
    description: [
      'React best practices are patterns the community has found to consistently produce cleaner, faster, and less buggy code — learned from years of production experience.',
      'They cover component design, state management, effects, performance, file organization, and naming — the full range of decisions you make when building a React app.'
    ],
    points: [
      'Keep components small and focused — each component does one thing.',
      'Colocate state — state lives as close as possible to where it is used.',
      'Prefer declarative patterns over imperative ones.',
      'Extract shared logic into custom hooks — components describe WHAT, hooks handle HOW.',
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
      text: '"Best practices are like building codes — not arbitrary rules, but lessons from failures at scale. \'Never use index as a key\' is like \'always pour a proper foundation\' — you can ignore it and sometimes get away with it, but it will fail when things get complex enough."'
    }
  },

  whyUsed: {
    description: 'React gives you a lot of freedom — there are many ways to do the same thing. Best practices show which patterns consistently work well as apps grow.',
    points: [
      'Component design: small, focused, composable — easy to test and reuse.',
      'State hygiene: one source of truth, no duplicate state, derived values computed not stored.',
      'Effects discipline: effects for side effects only, not as a "run something on render" shortcut.',
      'Performance: memoize after profiling, not everywhere preemptively.'
    ]
  },

  whenToUse: {
    description: 'Apply these from the start — bad habits in React compound quickly.',
    points: [
      'Naming: PascalCase for components, camelCase for everything else.',
      'File structure: one component per file, test and style files next to the component, grouped by feature.',
      'Effects: each effect does one thing; dependencies are complete and correct.',
      'Props: prefer explicit named props over passing one big config object.'
    ],
    analogy: {
      icon: '📏',
      title: 'The single responsibility principle',
      text: '"If you have to use \'and\' to describe what a component does — \'it fetches user data AND renders the profile AND handles edits AND shows notifications\' — it has too many jobs. Split it. Each component should do exactly one thing with full focus. This makes each piece testable, reusable, and replaceable."'
    }
  },

  howItWorks: {
    description: 'Best practices work at three levels: design time (how you structure components and state), development time (how you write effects and handlers), and review time (what your team enforces consistently).',
    code: {
      title: 'Anti-patterns vs. best practices side by side',
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
      '"You Might Not Need an Effect": effects are for syncing with external systems (DOM, APIs, third-party libraries). For derived values or event responses, an effect is the wrong tool.',
      'Boolean prop naming: use is/has/can prefix (isLoading, hasError, canEdit). Event handlers: start with on (onClick, onChange).',
      'Prefer component composition with children over a large variant prop that changes behavior in different modes.'
    ]
  },

  flowDiagram: {
    title: 'Decision hierarchy for any piece of code',
    steps: [
      { icon: '🤔', label: 'Can this be derived from existing state?', note: 'Yes → compute it, do not store it' },
      { icon: '🎯', label: 'Should it happen because of a user event?', note: 'Yes → event handler, not effect' },
      { icon: '🔌', label: 'Does it sync with an external system?', note: 'Yes → useEffect is the right place' },
      { icon: '🧩', label: 'Is it reused by multiple components?', note: 'Yes → extract to a custom hook' },
      { icon: '🪆', label: 'Is this component doing too much?', note: 'Yes → split into smaller components' }
    ]
  },

  realWorldExamples: {
    intro: 'These patterns appear in every well-designed React codebase:',
    items: [
      { icon: '🧩', title: 'Feature-based folder structure', description: 'src/features/cart/ holds CartProvider, CartSummary, CartItem, useCart.js, cartReducer.js — everything cart-related lives together, easy to find, change, or delete.' },
      { icon: '🎣', title: 'Custom hooks for API calls', description: 'useProductSearch(query), useUserProfile(id), useInfiniteScroll() — components read data via clean hooks; the fetch/cache code is hidden away.' },
      { icon: '📝', title: 'Controlled vs. uncontrolled forms', description: 'Default to uncontrolled (useRef or react-hook-form) for simple forms. Use controlled (useState) for real-time validation or when you need to sync form state with parent. Do not over-control simple forms.' },
      { icon: '⚠️', title: 'Always handle loading and error states', description: 'Every component that fetches must render in all three states: loading (skeleton), error (message), and success (data). Handling only the success path is an incomplete component.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Consistent patterns make the codebase predictable for any team member.',
      'Best practices prevent entire categories of subtle bugs — stale state, unnecessary renders, effect misuse.',
      'Good component design makes pieces naturally testable and reusable.',
      'The community has validated these patterns at scale — benefit from that experience.'
    ],
    cons: [
      'Best practices are opinionated — reasonable teams sometimes disagree on specifics.',
      'Some practices (memoizing Context values) feel like overhead in small apps.',
      'Practices evolve across React versions — what was correct in React 16 may differ in React 18.',
      'Over-engineering in pursuit of best practices can make simple things complex — pragmatism matters.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using effects to sync derived state',
        wrong: `const [count, setCount] = useState(0);\nconst [doubled, setDoubled] = useState(0);\nuseEffect(() => setDoubled(count * 2), [count]); // ❌ extra state, extra render, always at risk of being out of sync`,
        right: `const doubled = count * 2; // ✅ derive during render — always correct, no effect needed`,
        note: 'If a value can be computed from existing state during render, compute it — do not store it as separate state and keep it in sync with an effect. One of the most common React anti-patterns.'
      },
      {
        title: 'Responding to events inside effects instead of handlers',
        wrong: `const [shouldFetch, setShouldFetch] = useState(false);\nuseEffect(() => { if (shouldFetch) fetchData(); }, [shouldFetch]); // ❌ roundabout`,
        right: `const handleSubmit = () => { fetchData(); }; // ✅ respond to events in event handlers directly`,
        note: 'Effects are for syncing with external systems — not for triggering code in response to user events. If something should happen "because the user did X", put it in the handler for X.'
      },
      {
        title: 'Using array index as a list key',
        wrong: `items.map((item, i) => <Item key={i} {...item} />); // ❌ breaks on reorder, filter, or insert`,
        right: `items.map(item => <Item key={item.id} {...item} />); // ✅ stable, data-derived unique ID`,
        note: 'Index keys tie item identity to position. On reorder, insert, or delete, indices shift and React incorrectly matches items — causing wrong state, wrong focus, and animation bugs.'
      }
    ]
  },

  bestPractices: [
    'One responsibility per component — if the name needs "and", split it.',
    'Derive state, do not duplicate it — computed values belong in the render, not as extra state.',
    'Respond to events in handlers — use effects only for syncing with external systems.',
    'Keep effects small and focused: one concern per effect, always with proper cleanup.',
    'Always provide complete dependency arrays — let eslint-plugin-react-hooks exhaustive-deps enforce this.',
    'Never use array index as a list key — use a stable, unique ID from your data.',
    'Name booleans with is/has/can; event handlers with on; custom hooks with use.',
    'Colocate related files (component, test, styles) in feature folders.',
    'Write components that are testable in isolation from their usage context.',
    'Profile before memoizing — React.memo/useMemo/useCallback add complexity; apply them where profiling shows a need.'
  ],

  interviewQuestions: [
    { q: 'What does "you might not need an effect" mean?', a: 'React effects (useEffect) are for syncing with external systems — the DOM, APIs, or third-party libraries. Many developers misuse them for things that do not need effects: computing derived values (better done during render), responding to events (better done in the event handler), or transforming data when props change (better done inline). "You Might Not Need an Effect" is React\'s guidance that effects are a specific tool — reaching for them elsewhere adds unnecessary renders and complexity.' },
    { q: 'Why is array index as a list key an anti-pattern?', a: 'React uses keys to match items in the new tree to items in the previous tree. Index keys tie identity to position. When you reorder, insert, or delete items, indices shift and React incorrectly matches items to wrong states — causing wrong component state after deletions, wrong DOM focus, and animation glitches. Use stable, data-derived unique IDs (item.id from a database) instead.' },
    { q: 'What is state colocation and why is it important?', a: 'Colocation means keeping state as close as possible to where it is used — in the component that owns it, not in a parent that merely passes it down, and not in a global store if only one subtree needs it. Colocation limits re-render scope, makes components self-contained and testable, and keeps data flow easy to understand. Lifting state higher than needed or globalizing it unnecessarily causes broad re-renders and tight coupling.' },
    { q: 'When should you split a component into smaller sub-components?', a: 'Split when: (1) the description requires "and" — it does A and B and C; (2) a part could be reused elsewhere; (3) a section has a clear conceptual identity that a child component name would clarify; (4) independent memoization of a section would help; or (5) the prop list has grown too large for one logical unit. The rule: each component does one thing, and its name fully describes that one thing.' },
    { q: 'What is the difference between controlled and uncontrolled components for forms?', a: 'A controlled input has its value driven by React state — every keystroke calls setState, making React the source of truth. This enables real-time validation and cross-field dependencies. An uncontrolled input stores its value in the DOM — you read it with a ref or on submit. Uncontrolled is simpler for basic forms; controlled is needed when you must react to input changes live. Libraries like react-hook-form use uncontrolled inputs for performance with a controlled-looking API.' }
  ],

  summary: {
    description: 'React best practices — small focused components, colocated state, derived values computed during render, effects only for external system sync, stable list keys, and profiling-driven memoization — consistently produce clean, fast, and maintainable code. Apply them from the start, enforce with linting (eslint-plugin-react-hooks), and treat them as the foundation for confident refactoring and scaling.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/you-might-not-need-an-effect — the canonical guide on when not to use effects, directly addressing the most common React anti-pattern.' },
    { label: 'Related topics', note: 'See "Performance Optimization" for memoization practices, "State Management" for colocation, and "Testing" for testability-driven design.' }
  ]
};

export default bestPracticesContent;
