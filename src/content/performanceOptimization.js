const performanceOptimizationContent = {
  id: 'performanceOptimization',
  title: 'Performance Optimization',
  icon: '⚡',
  theme: 'emerald',
  tagline: 'Make React apps fast: profile first, then apply the right fix — memoization, virtualization, or code splitting.',
  meta: 'Ecosystem · Performance',

  whatIsIt: {
    description: [
      'React performance optimization is a set of techniques for reducing unnecessary work — extra re-renders, expensive computations, large bundles — so your app stays responsive and loads fast.',
      'The most important rule: measure first, optimize second. React is fast by default. Use the Profiler to find the actual bottleneck before adding any optimization.'
    ],
    points: [
      'Primary tools: React.memo (skip re-renders), useMemo (cache expensive values), useCallback (stable function references), React.lazy + Suspense (code splitting).',
      'Scheduling tools: useTransition, useDeferredValue — defer expensive work so the UI stays responsive.',
      'List tools: virtualization (render only visible rows) — critical for thousands of items.',
      'Always profile with React DevTools Profiler before adding any optimization.'
    ],
    code: { title: 'The complete optimization toolkit at a glance', snippet: `// 1. Memoize a component — only re-renders when its props actually change
const ProductCard = React.memo(function ProductCard({ product }) {
  return <div>{product.name} — \${product.price}</div>;
});

// 2. Memoize an expensive derived value
const sortedProducts = useMemo(
  () => [...products].sort(sortByPrice),
  [products] // only recomputes when products array changes
);

// 3. Stabilize a function reference (for callbacks passed to React.memo'd children)
const handleSelect = useCallback((id) => navigate(\`/products/\${id}\`), [navigate]);

// 4. Defer a slow re-render so typing stays instant
const [isPending, startTransition] = useTransition();
const handleFilter = (query) => {
  setQuery(query); // urgent — input stays snappy
  startTransition(() => setFilteredItems(items.filter(/* ... */))); // deferred
};

// 5. Code-split heavy components
const HeavyDashboard = lazy(() => import('./HeavyDashboard'));` },
    analogy: {
      icon: '🔧',
      title: 'Real-World Analogy',
      text: '"Performance optimization is like tuning a car. First, connect the diagnostic computer (Profiler) to find what is ACTUALLY slow. Then fix the one thing making the biggest difference — maybe the tires are underinflated (unnecessary re-renders), maybe the engine needs work (expensive computations), maybe the car carries too much weight (oversized bundle). Fix the measured bottleneck, not every part."'
    }
  },

  whyUsed: {
    description: 'React is fast for most apps. But at scale — thousands of list items, heavy computations on every keystroke, large bundles — performance can degrade. Targeted optimizations keep apps responsive in real production conditions.',
    points: [
      'React re-renders a component every time its parent renders — unless you memoize. At scale, this can freeze the UI.',
      'Expensive computations (sorting 10,000 items) on every keystroke slow down input noticeably.',
      'Large JavaScript bundles increase Time-to-Interactive — users on mobile feel this most.',
      'Rendering thousands of list rows without virtualization causes slow scrolling and memory pressure.'
    ]
  },

  whenToUse: {
    description: 'Apply optimizations after profiling — not preemptively on every component.',
    points: [
      'React.memo: a component re-renders frequently due to parent re-renders but its own props rarely change.',
      'useMemo: a derivation is genuinely expensive (sorting 10,000+ items) and runs on every render.',
      'useCallback: passing callbacks to React.memo children that would otherwise get a new reference every render.',
      'Virtualization: any list with 100+ items, especially with rich per-item rendering.',
      'Code splitting: always at route level, and for large infrequently-accessed features.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'Premature optimization makes code worse',
      text: '"Adding React.memo, useMemo, and useCallback everywhere without measuring adds complexity and can actually slow things down — each has its own overhead. Write clean code first. Optimize only the measured bottlenecks."'
    }
  },

  howItWorks: {
    description: 'Each optimization targets a different part of the rendering pipeline. Knowing which part is slow tells you which tool to reach for.',
    code: {
      title: 'Virtualized list — render only visible rows (react-window)',
      snippet: `import { FixedSizeList } from 'react-window';

function VirtualizedProductList({ products }) {
  const Row = ({ index, style }) => (
    <div style={style}>  {/* style sets position/height for the row */}
      <ProductCard product={products[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}         // visible window height
      itemCount={products.length}  // total items (even 100,000)
      itemSize={72}        // height per row in px
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
// Only renders ~10 visible rows at any time — regardless of total count
// Scrolling 10,000 items feels as fast as scrolling 10` },
    points: [
      'React DevTools Profiler: record an interaction, see which components re-rendered, how long each took, and what triggered them.',
      'React.memo only helps if props are reference-stable — combine with useMemo and useCallback for objects and functions.',
      'State colocation: move state as close as possible to where it is needed — unnecessary global state causes broad re-renders.'
    ]
  },

  flowDiagram: {
    title: 'The optimization decision tree',
    steps: [
      { icon: '🔍', label: 'Profile with DevTools', note: 'Find the ACTUAL bottleneck' },
      { icon: '🔁', label: 'Unnecessary re-renders?', note: 'React.memo + useCallback/useMemo' },
      { icon: '⚙️', label: 'Expensive computation?', note: 'useMemo for derived values' },
      { icon: '📜', label: 'Large lists?', note: 'Virtualize with react-window or react-virtual' },
      { icon: '📦', label: 'Large bundle?', note: 'Code split + lazy load + tree shake' }
    ]
  },

  realWorldExamples: {
    intro: 'Production performance work typically combines several tools:',
    items: [
      { icon: '🛍️', title: 'E-commerce product grid', description: 'Debounced search + useMemo for filtered products + React.memo on ProductCard + code-split checkout and admin pages.' },
      { icon: '📊', title: 'Analytics dashboard', description: 'useTransition for tab switching + useMemo for aggregations + React.memo on chart components + lazy-loaded charting library.' },
      { icon: '💬', title: 'Chat feed', description: 'Virtualized message list + useMemo for message grouping + Suspense for lazy-loaded emoji picker.' },
      { icon: '📋', title: 'Data tables with 10k+ rows', description: 'react-window for virtualization + React.memo on row components + debounced column filter.' }
    ]
  },

  prosAndCons: {
    pros: [
      'React\'s core reconciliation is already fast — most apps need only targeted, specific optimizations.',
      'The full toolkit covers essentially every performance bottleneck category.',
      'React DevTools Profiler makes it straightforward to find what is actually slow.',
      'Code splitting via React.lazy has the highest return for the least effort.'
    ],
    cons: [
      'Over-optimization clutters code and can actually reduce performance.',
      'Reference equality checks (React.memo, useMemo) can surprise — an object that "looks the same" is still a new reference.',
      'Virtualization adds implementation complexity and can conflict with certain CSS layouts.',
      'Bundle optimization requires bundler knowledge and careful dependency management.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Optimizing without profiling first',
        note: 'Adding React.memo and useMemo everywhere without measuring is "shotgun optimization" — you may optimize things that are not bottlenecks while the real problem goes unaddressed. Always open React DevTools Profiler, record an interaction, and find the slow components first.'
      },
      {
        title: 'Using React.memo without stable prop references',
        wrong: `<MemoizedChild config={{ theme: 'dark' }} /> // ❌ new object every render — React.memo never skips`,
        right: `const config = useMemo(() => ({ theme: 'dark' }), []);\n<MemoizedChild config={config} /> // ✅ stable reference — React.memo actually works`,
        note: 'React.memo compares props by reference (Object.is). A new object/function every render is always "changed" — React.memo never skips the re-render.'
      },
      {
        title: 'Virtualizing a 20-item list',
        note: 'Virtualization adds significant complexity — rows need explicit heights, scroll handling can conflict with CSS. For lists under 200 items with simple rendering, plain .map() + React.memo on the row is simpler and sufficient. Reserve virtualization for genuinely large lists (1,000+) with measured scrolling problems.'
      }
    ]
  },

  bestPractices: [
    'Measure before you optimize — open the React DevTools Profiler and find the actual slow component.',
    'Apply code splitting first (React.lazy at route level) — highest return, nearly effortless.',
    'Colocate state: keep state as close as possible to where it is needed — global state causes broad re-renders.',
    'Virtualize large lists (react-window or TanStack Virtual) when scrolling performance is measured to be slow.',
    'Use React.memo/useMemo/useCallback surgically on measured bottlenecks — not on every component by default.'
  ],

  interviewQuestions: [
    { q: 'What is the first thing you should do when a React app feels slow?', a: 'Profile it with React DevTools Profiler. Record an interaction, then inspect the flame graph to see which components re-rendered, how long they took, and what triggered them. Optimizing without this step often wastes effort on components that are not the actual bottleneck.' },
    { q: 'What is React.memo and when does it actually help?', a: 'React.memo is a higher-order component that skips a re-render when a component\'s props have not changed (compared by reference equality). It helps when a parent re-renders for unrelated reasons and the child\'s props have not changed. It only works if props are reference-stable — objects and functions must also be memoized with useMemo and useCallback, or React.memo\'s check always sees a "new" prop.' },
    { q: 'What is virtualization and why does it matter for long lists?', a: 'Virtualization renders only the items currently visible in the viewport instead of all items. A list of 10,000 items with virtualization renders around 10–15 DOM nodes at any time; without it, all 10,000 are in the DOM — slow initial render, memory pressure, and sluggish scrolling. Libraries like react-window and TanStack Virtual implement this.' },
    { q: 'How does state colocation improve performance?', a: 'When state lives higher in the tree than necessary, it causes re-renders in a broader subtree. Moving state down to the smallest component that needs it limits re-renders to just that component and its children. A search input\'s state that drives a local filter should live in the filtering component, not in a global store.' },
    { q: 'What is the relationship between code splitting and performance?', a: 'Code splitting reduces the JavaScript the browser must download before the app is interactive — improving Time-to-Interactive and initial load speed. Implement it with React.lazy(() => import(\'./Component\')) and wrap in a Suspense boundary. Route-level splitting is the most impactful starting point.' }
  ],

  summary: {
    description: 'React performance optimization is a measured, targeted practice: profile first, then apply the right tool for the measured bottleneck. React.memo, useMemo, and useCallback for re-renders and computations; code splitting for bundle size; virtualization for long lists; useTransition for scheduling. Write clean, well-colocated code first and reach for these tools only when you have evidence something specific is slow.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/render-and-commit and react.dev/reference/react/memo — canonical rendering and memoization references.' },
    { label: 'Related topics', note: 'See "React DevTools" for profiling, "Code Splitting" for bundle optimization, "useMemo"/"useCallback" for memoization, and "useTransition" for scheduling.' }
  ]
};

export default performanceOptimizationContent;
