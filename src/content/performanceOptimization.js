const performanceOptimizationContent = {
  id: 'performanceOptimization',
  title: 'Performance Optimization',
  icon: '⚡',
  theme: 'emerald',
  tagline: 'Make React apps fast: memoization, virtualization, code splitting, profiling, and the rules of fast rendering.',
  meta: 'Ecosystem · Performance',

  whatIsIt: {
    description: [
      'React performance optimization is the set of techniques for reducing unnecessary work — re-renders, expensive computations, large bundles, slow data fetching — so the UI stays responsive, loads fast, and feels snappy.',
      'The most important performance principle: measure first, optimize second. React is already fast for most use cases. Profile to find the actual bottleneck before reaching for any optimization technique.'
    ],
    points: [
      'Primary tools: React.memo (skip re-renders for identical props), useMemo (cache expensive values), useCallback (stable function references), React.lazy + Suspense (code splitting).',
      'Runtime tools: useTransition/useDeferredValue (scheduling), virtualization (only render visible items), avoiding large inline objects/functions as props.',
      'Bundle tools: code splitting, tree shaking, image optimization, lazy loading assets.',
      'Profiling: React DevTools Profiler, browser Performance tab, Lighthouse — identify the actual bottleneck before optimizing.'
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
      text: '"Performance optimization is like tuning a car. First, you hook up the diagnostic computer (Profiler) to find out WHAT\'s actually slow — not guess. Then you fix the one thing making the biggest difference: maybe the tires are underinflated (unnecessary re-renders), maybe the engine needs a tune-up (expensive computations), maybe the car is dragging unnecessary weight (oversized bundle). You don\'t replace every part; you fix the measured bottleneck."'
    }
  },

  whyUsed: {
    description: 'React\'s reconciliation is fast, but at scale — thousands of list items, heavy computations on every keystroke, multi-megabyte bundles — performance degrades. The right optimizations at the right places keep apps responsive under real production conditions.',
    points: [
      'React re-renders a component every time its parent renders — unless you memoize. At scale, cascading re-renders can freeze the UI.',
      'Expensive computations (sorting 10k items) running on every keystroke slow down input by milliseconds that feel noticeable.',
      'Large JavaScript bundles increase Time-to-Interactive — users on mobile/slow connections experience this the most.',
      'Virtualized lists render only visible items — critical for performance when displaying thousands of rows.'
    ]
  },

  whenToUse: {
    description: 'Apply optimizations deliberately, after profiling — not preemptively everywhere.',
    points: [
      'React.memo: when a component re-renders frequently due to parent re-renders, but its props rarely change.',
      'useMemo: when a derivation is genuinely expensive (sorting 10k+ items) and runs on every render.',
      'useCallback: when passing callbacks to React.memo\'d children that would otherwise get a new reference every render.',
      'Virtualization: any list with 100+ items, especially with rich per-item rendering.',
      'Code splitting: route-level (always) and feature-level for large, infrequently-accessed modules.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'Premature optimization harms code quality',
      text: '"Adding React.memo, useMemo, and useCallback to every component and function \'just in case\' adds complexity, clutters code, and can actually slow things down — each has its own overhead. The linter, the Profiler, and real-world data should guide where to optimize. Write clean code first; optimize the measured bottlenecks second."'
    }
  },

  howItWorks: {
    description: 'Each optimization targets a different part of the rendering pipeline. Understanding which part is slow tells you which tool to use.',
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
      'React DevTools Profiler: record a render, inspect which components took longest, whether they re-rendered unnecessarily, what props/state triggered them.',
      'React.memo only helps if props are reference-stable — combine with useMemo/useCallback for objects and functions passed as props.',
      'State colocation: move state as close as possible to where it\'s needed — unnecessary global state causes broad re-renders.'
    ]
  },

  flowDiagram: {
    title: 'The optimization decision tree',
    steps: [
      { icon: '🔍', label: 'Profile with DevTools', note: 'Find the ACTUAL bottleneck' },
      { icon: '🔁', label: 'Unnecessary re-renders?', note: 'React.memo + useCallback/useMemo' },
      { icon: '⚙️', label: 'Expensive computation?', note: 'useMemo for derived values' },
      { icon: '📜', label: 'Large lists?', note: 'Virtualize with react-window / react-virtual' },
      { icon: '📦', label: 'Large bundle?', note: 'Code split + lazy load + tree shake' }
    ]
  },

  realWorldExamples: {
    intro: 'Production performance work typically combines several of these tools:',
    items: [
      { icon: '🛍️', title: 'E-commerce product grid', description: 'Debounced search input (no re-render per keystroke) + useMemo for filtered/sorted products + React.memo on <ProductCard> + code-split checkout and admin pages.' },
      { icon: '📊', title: 'Analytics dashboard', description: 'useTransition for tab switching (heavy chart render deferred) + useMemo for aggregation calculations + React.memo on chart components + lazy-loaded charting library.' },
      { icon: '💬', title: 'Chat / message feed', description: 'Virtualized message list (only render visible messages) + useMemo for message grouping + Suspense for lazy-loaded emoji picker.' },
      { icon: '📋', title: 'Data tables with 10k+ rows', description: 'react-window or TanStack Virtual for virtualization + React.memo on row components + debounced column filter input.' }
    ]
  },

  prosAndCons: {
    pros: [
      'React\'s core reconciliation is already highly optimized — most apps need only targeted, specific optimizations.',
      'The full toolkit (memo/useMemo/useCallback/lazy/virtualization) covers essentially any performance bottleneck category.',
      'React DevTools Profiler makes it relatively straightforward to identify what\'s actually slow before guessing.',
      'Code splitting via React.lazy is nearly zero-effort and has the highest ROI for most apps.'
    ],
    cons: [
      'Over-optimization clutters code and can actually reduce performance (each memo/callback has overhead).',
      'Reference equality checks (React.memo, useMemo) can be surprising — an object that "looks the same" is still a new reference.',
      'Virtualization adds significant implementation complexity and can conflict with certain CSS layouts.',
      'Bundle optimization (tree shaking, code splitting) requires bundler knowledge and careful dependency management.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Optimizing without profiling first',
        note: 'Adding React.memo and useMemo everywhere without measuring is "shotgun optimization" — you may be optimizing things that aren\'t bottlenecks while the real problem goes unaddressed. Always open React DevTools Profiler, record an interaction, and find the actual slow components before adding any optimization.'
      },
      {
        title: 'Using React.memo without stable prop references',
        wrong: `<MemoizedChild config={{ theme: 'dark' }} /> // ❌ new object every render — React.memo is useless here`,
        right: `const config = useMemo(() => ({ theme: 'dark' }), []);\n<MemoizedChild config={config} /> // ✅ stable reference — React.memo can actually skip re-renders`,
        note: 'React.memo compares props by reference (Object.is). A new object/array/function literal on every render is a new reference every time, making React.memo\'s check always false — it never actually skips re-renders.'
      },
      {
        title: 'Virtualizing without measuring — adding complexity for 20 items',
        note: 'Virtualization adds significant complexity (each row needs explicit height, scroll handling can conflict with CSS). For lists of <200 items with simple row rendering, plain .map() + React.memo on the row component is almost always sufficient and far simpler. Reserve react-window/react-virtual for genuinely large lists (1,000+) with measured performance problems.'
      }
    ]
  },

  bestPractices: [
    'Measure before you optimize — open the React DevTools Profiler and find the actual slow component.',
    'Apply code splitting first (React.lazy at the route level) — it\'s the highest-ROI optimization and nearly effortless.',
    'Colocate state: move state as close as possible to the components that need it — global state causes broad re-renders.',
    'Wrap large lists in virtualization (react-window or TanStack Virtual) when measured scrolling performance is poor.',
    'Use React.memo/useMemo/useCallback surgically on measured bottlenecks — not preemptively on every component and function.'
  ],

  interviewQuestions: [
    { q: 'What\'s the first thing you should do when a React app feels slow?', a: 'Profile it with React DevTools Profiler. Record an interaction (e.g. type in a search box, toggle a tab), then inspect the flame graph to see which components re-rendered, how long they took, and what triggered them. Optimizing without this step often wastes effort on components that aren\'t the actual bottleneck.' },
    { q: 'What is React.memo, and when does it actually help?', a: 'React.memo is a higher-order component that memoizes a component\'s render — it only re-renders when its props change (compared by shallow reference equality). It helps specifically when a parent re-renders for unrelated reasons and a child\'s props have NOT changed. It only works if the props are reference-stable: objects and functions passed as props must also be memoized (useMemo / useCallback), or React.memo\'s check will always see a "new" prop and never skip the re-render.' },
    { q: 'What is virtualization and why does it matter for long lists?', a: 'Virtualization renders only the items currently visible in the viewport, rather than all items in the array. A list of 10,000 items with virtualization renders ~10-15 DOM nodes at any time; without it, all 10,000 are in the DOM — causing slow initial render, memory pressure, and sluggish scrolling. Libraries like react-window and TanStack Virtual implement this. It\'s the most impactful optimization specifically for long lists with non-trivial per-item rendering.' },
    { q: 'How does state colocation improve performance?', a: 'When state lives higher in the tree than necessary, it causes re-renders in a broader subtree than needed. Moving state down to the smallest component that needs it ("colocating") limits re-renders to just that component and its children, rather than the entire parent tree. For example, a search input\'s state that only drives a local filter should live in the filtering component, not in a global store or distant ancestor.' },
    { q: 'What is the relationship between code splitting and performance, and how do you implement it in React?', a: 'Code splitting reduces the amount of JavaScript the browser must download and parse before the app is interactive — improving Time-to-Interactive and initial load speed. In React, implement it with React.lazy(() => import(\'./Component\')) and wrap the lazy component in a <Suspense fallback={...}> boundary. Route-level splitting (each page as a separate chunk) is the most impactful and natural starting point.' }
  ],

  summary: {
    description: 'React performance optimization is a measured, targeted practice: profile first, then apply the right tool for the measured bottleneck — React.memo/useMemo/useCallback for re-render and computation issues, code splitting for bundle bloat, virtualization for long lists, useTransition for scheduling-level responsiveness. Write clean, well-colocated code first; reach for these tools when you have evidence a specific part is slow.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/render-and-commit and react.dev/reference/react/memo — the canonical rendering and memoization references.' },
    { label: 'Related topics', note: 'See "React DevTools" for profiling instructions, "Code Splitting" and "Suspense" for bundle optimization, "useMemo"/"useCallback" for computation and reference memoization, and "useTransition" for scheduling.' }
  ]
};

export default performanceOptimizationContent;
