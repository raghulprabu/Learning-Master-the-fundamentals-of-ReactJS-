const useMemoContent = {
  id: 'useMemo',
  title: 'useMemo Hook',
  icon: '💭',
  theme: 'violet',
  tagline: 'useMemo saves the result of an expensive calculation so React does not repeat it on every render.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useMemo caches the result of a calculation between renders. You give it a function and a list of dependencies. React only re-runs the function when one of those dependencies changes.',
      'It is a pure performance optimization — removing it from your code would not change how the app works, only possibly how fast it is.'
    ],
    points: [
      'Syntax: const result = useMemo(() => expensiveCalc(a, b), [a, b]);',
      'On first render, React runs the function and caches the result.',
      'On later renders, if dependencies are the same, React returns the cached result without re-running the function.'
    ],
    code: { title: 'The basic shape', snippet: `const visibleProducts = useMemo(
  () => filterAndSortProducts(products, filterText, sortKey),
  [products, filterText, sortKey]   // 👈 only recompute when one of these changes
);
// On renders where products/filterText/sortKey are unchanged,
// React skips the (potentially expensive) calculation entirely.` },
    analogy: {
      icon: '🧮',
      title: 'Real-World Analogy',
      text: '"useMemo is like a chef who pre-chops vegetables and keeps the pile on the counter. As long as the order has not changed, the chef reuses the pile instead of chopping again. Only when the order changes does the chef chop fresh."'
    }
  },

  whyUsed: {
    description: 'Some calculations are expensive — filtering thousands of items, sorting large lists, complex math. Repeating them on every render wastes CPU and makes the UI feel slow.',
    points: [
      'Skips recomputing expensive derived values when their inputs have not changed.',
      'Gives a stable reference to objects and arrays for memoized child components.',
      'Keeps dependency arrays of other hooks stable when they include computed values.',
      'Makes "derive during render" patterns fast even for non-trivial work.'
    ]
  },

  whenToUse: {
    description: 'Use useMemo only after profiling shows a calculation is genuinely slow — not by default on every derived value.',
    points: [
      'A calculation is measurably slow and runs on every render.',
      'You need a stable object or array reference for a memoized child (React.memo).',
      'A computed value is used in another Hook\'s dependency array.',
      'Profiling has confirmed a specific render is slow because of a specific calculation.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use useMemo',
      text: '"Most calculations are fast enough that memoizing them adds more overhead than it saves. Do not wrap every derived value in useMemo \'just in case\'. Profile first, then memoize only the specific bottleneck you found."'
    }
  },

  howItWorks: {
    description: 'On every render, React compares the new dependency array to the previous one. If every value is the same, React returns the cached result. If any value changed, React calls your function again and caches the new result.',
    code: {
      title: 'Memoizing an expensive filter and sort',
      snippet: `function ProductList({ products, filterText, sortKey }) {
  // Recomputed ONLY when products, filterText, or sortKey actually change —
  // not when, say, an unrelated "isSidebarOpen" state toggles in a parent.
  const visibleProducts = useMemo(
    () => products
      .filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()))
      .sort((a, b) => a[sortKey] < b[sortKey] ? -1 : 1),
    [products, filterText, sortKey]
  );

  // Memoizing an object so a memoized child doesn't re-render needlessly
  const chartConfig = useMemo(() => ({ theme: 'dark', animate: true }), []);

  return (
    <>
      <ChartWidget config={chartConfig} />          {/* React.memo'd child */}
      <ul>{visibleProducts.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </>
  );
}`
    }
  },

  flowDiagram: {
    title: 'useMemo decision flow on every render',
    steps: [
      { icon: '🔁', label: 'Component re-renders', note: 'For any reason' },
      { icon: '🔍', label: 'Compare dependencies', note: '[a, b] vs previous [a, b]' },
      { icon: '✅', label: 'Unchanged → reuse cache', note: 'Skip the calculation entirely' },
      { icon: '⚙️', label: 'Changed → recompute', note: 'Run fn(), cache new result' }
    ]
  },

  realWorldExamples: {
    intro: 'These are the situations where useMemo earns its keep in production apps:',
    items: [
      { icon: '📊', title: 'Dashboard aggregations', description: 'Computing totals and averages from thousands of records — recomputed only when the data or filters change.' },
      { icon: '🔎', title: 'Filtering and sorting large lists', description: 'A product catalog that filters thousands of rows benefits from memoizing the visible subset.' },
      { icon: '🧩', title: 'Stable props for memoized children', description: 'Passing a computed options object to a heavy chart component. Memoizing prevents the child re-rendering on unrelated parent updates.' },
      { icon: '🧠', title: 'Expensive derived values for useEffect', description: 'When an effect depends on a computed array, memoizing it prevents the effect from re-running every render.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Can speed up renders with genuinely expensive calculations.',
      'Provides stable references that unlock React.memo and stable dependency arrays.',
      'Makes derive-during-render patterns fast even for complex work.',
      'Self-documents that a calculation is expensive enough to cache.'
    ],
    cons: [
      'Adds memory overhead and a comparison cost on every render — can be a net loss for cheap calculations.',
      'Easy to get the dependency array wrong, causing stale values that do not update.',
      'Adds a layer of indirection that makes code slightly harder to read.',
      'Tempting to overuse "just in case", adding noise without real benefit.'
    ]
  },

  comparison: {
    title: 'Memoized vs. recomputed every render',
    left: {
      title: '⚙️ Without useMemo',
      tone: 'bad',
      code: `function ProductList({ products, filterText }) {
  // Runs on EVERY render — even when products/filterText
  // haven't changed (e.g. parent re-rendered for unrelated reasons)
  const visible = products.filter(p => p.name.includes(filterText));
  return <List items={visible} />;
}`,
      note: 'Fine for small lists — wasteful when the list is large and the parent re-renders often.'
    },
    right: {
      title: '✅ With useMemo',
      tone: 'good',
      code: `function ProductList({ products, filterText }) {
  const visible = useMemo(
    () => products.filter(p => p.name.includes(filterText)),
    [products, filterText]
  );
  return <List items={visible} />;
}`,
      note: 'Recomputes only when products or filterText actually change.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Memoizing cheap calculations "just in case"',
        wrong: `const fullName = useMemo(() => \`\${first} \${last}\`, [first, last]); // ❌ string concat is cheaper than memoization itself`,
        right: `const fullName = \`\${first} \${last}\`; // ✅ just compute it — no Hook needed`,
        note: 'useMemo has its own cost. For simple string or math operations, computing directly is faster.'
      },
      {
        title: 'Missing dependencies causing stale values',
        wrong: `const total = useMemo(() => calcTotal(items, discount), [items]); // ❌ "discount" missing — total won't update when discount changes`,
        right: `const total = useMemo(() => calcTotal(items, discount), [items, discount]); // ✅ all used values listed`,
        note: 'Every value the function reads must be in the dependency array. Let the eslint-plugin-react-hooks rule catch omissions.'
      },
      {
        title: 'Treating useMemo as a guarantee',
        note: 'React may discard a memoized value to free memory. Never rely on useMemo for correctness — only for performance. If code must run exactly once, use useEffect, useState, or useRef.'
      }
    ]
  },

  bestPractices: [
    'Use useMemo only after profiling shows a calculation is genuinely slow.',
    'List every value the function reads in the dependency array.',
    'Fix the root cause first — reduce how often the parent re-renders before reaching for memoization.',
    'Pair useMemo with React.memo when stabilizing a prop reference for a memoized child.',
    'Never rely on useMemo to skip side effects — it is a performance hint, not a lifecycle guarantee.'
  ],

  interviewQuestions: [
    { q: 'What does useMemo do, and what problem does it solve?', a: 'useMemo caches the return value of a calculation and only recomputes it when listed dependencies change. It solves the problem of expensive calculations being needlessly re-run on every render — including renders triggered by unrelated state changes.' },
    { q: 'Is useMemo a guarantee that a function will only run when its dependencies change?', a: 'No — it is a performance hint. React may discard the cached value to reclaim memory. Never rely on useMemo for correctness, only for performance.' },
    { q: 'When should you NOT use useMemo?', a: 'When the calculation is cheap — string concatenation, simple math, object property access. The overhead of memoization often outweighs any savings for trivial calculations.' },
    { q: 'How does useMemo help with React.memo?', a: 'React.memo skips re-rendering a component if its props are reference-equal to the previous render. Freshly-created objects and arrays always have new references, defeating React.memo. useMemo gives them a stable reference across renders where their dependencies have not changed.' },
    { q: 'What is the relationship between useMemo and useCallback?', a: 'They use the same caching mechanism. useMemo caches a computed value. useCallback caches a function. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). Both provide stable references for performance.' }
  ],

  summary: {
    description: 'useMemo caches a calculation result across renders, skipping work when dependencies are unchanged. Use it deliberately after profiling — for genuinely expensive derivations. It also gives stable references to memoized children and dependency arrays.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useMemo — the canonical reference, including guidance on when memoization actually helps.' },
    { label: 'Related topic', note: 'See "Performance Optimization" for the bigger picture of React.memo, useCallback, and profiling tools.' }
  ]
};

export default useMemoContent;
