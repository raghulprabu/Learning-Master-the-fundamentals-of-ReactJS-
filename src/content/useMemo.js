const useMemoContent = {
  id: 'useMemo',
  title: 'useMemo Hook',
  icon: '💭',
  theme: 'violet',
  tagline: 'Cache ("memoize") the result of an expensive calculation so it isn\'t recomputed on every single render.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useMemo is a Hook that caches the *result* of a calculation between renders. You give it a function and a list of dependencies; React re-runs the function only when one of those dependencies changes — otherwise it hands back the cached value from last time.',
      'It\'s a pure performance optimization: removing every useMemo from your code would not change your app\'s *behaviour*, only (potentially) its speed.'
    ],
    points: [
      'Syntax: const result = useMemo(() => computeExpensiveValue(a, b), [a, b]);',
      'On the first render, React runs the function and caches the result alongside the dependency values.',
      'On later renders, if the dependencies are unchanged (compared with Object.is), React returns the cached result *without* re-running the function.'
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
      text: '"useMemo is like a chef who pre-chops vegetables and keeps the chopped pile on the counter. As long as the order hasn\'t changed (same ingredients requested), the chef just reuses the pile from before instead of re-chopping from scratch every single time a new ticket comes in. Only when the order actually changes does the chef chop again — and replace the pile with the fresh result."'
    }
  },

  whyUsed: {
    description: 'Some calculations are genuinely expensive — filtering/sorting thousands of items, complex derived data, heavy formatting. Recomputing them on every render (even when their inputs haven\'t changed) wastes CPU and can make a UI feel sluggish. useMemo skips that redundant work.',
    points: [
      'Avoids recomputing expensive derived values when their inputs haven\'t changed.',
      'Can prevent unnecessary re-renders of memoized child components by giving them a stable object/array reference (paired with React.memo).',
      'Helps keep dependency arrays of other hooks (useEffect) stable when they include computed objects/arrays.',
      'Lets you keep "derive during render" code (the recommended pattern) fast even when the derivation is non-trivial.'
    ]
  },

  whenToUse: {
    description: 'useMemo is an *optimization*, not a default. Reach for it deliberately, with evidence that it helps — not preemptively on every calculation.',
    points: [
      'A calculation is measurably slow (filtering/sorting/transforming large lists, heavy math, complex aggregations) AND runs on every render.',
      'You need to pass a stable object/array reference to a memoized child (React.memo) or to another Hook\'s dependency array, to prevent a cascade of unnecessary work.',
      'Profiling (React DevTools Profiler) has shown a specific render is slow because of a specific recalculation — memoize *that* one.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use useMemo',
      text: '"Most calculations in React are fast enough that memoizing them adds more overhead (extra memory, dependency comparisons) than it saves. Don\'t wrap every derived value in useMemo \'just in case\' — that\'s premature optimization that adds noise without measurable benefit. Profile first, then memoize the specific bottleneck you found."'
    }
  },

  howItWorks: {
    description: 'On every render, React compares the new dependency array to the previous one (using Object.is on each item). If every dependency is the same, React returns the value it cached last time — completely skipping your function. If any dependency changed, React calls your function again, caches the new result, and returns it.',
    code: {
      title: 'Memoizing an expensive filter+sort, and a stable object reference',
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
      { icon: '📊', title: 'Dashboard aggregations', description: 'Computing totals, averages, and grouped breakdowns from thousands of transaction records — recomputed only when the underlying data or filters change.' },
      { icon: '🔎', title: 'Filtering & sorting large lists', description: 'A product catalog or data table that filters/sorts thousands of rows on every keystroke benefits hugely from memoizing the derived, visible subset.' },
      { icon: '🧩', title: 'Stabilizing props for memoized children', description: 'Passing a computed `options` object to a heavy chart/map component wrapped in React.memo — memoizing the object prevents the child from re-rendering on every unrelated parent update.' },
      { icon: '🧠', title: 'Expensive derived values for useEffect deps', description: 'When an effect depends on a computed array/object, memoizing that computation keeps the effect from re-running every render due to a "new" reference.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Can meaningfully speed up renders that involve genuinely expensive calculations.',
      'Provides stable references that unlock React.memo and stable dependency arrays elsewhere.',
      'Keeps "derive during render" (the recommended state pattern) fast even for non-trivial derivations.',
      'Self-documents "this calculation is expensive enough to matter" for future readers.'
    ],
    cons: [
      'Adds memory overhead (cached value + dependency list) and a comparison cost on every render — can be a net loss for cheap calculations.',
      'Easy to get the dependency array wrong, causing stale memoized values that silently don\'t update.',
      'Makes code slightly harder to read — another layer of indirection between "what" and "how it\'s computed".',
      'Tempting to overuse "just in case", which adds noise without measurable benefit (premature optimization).'
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
      note: 'Fine for small lists/cheap filters — wasteful when the list is large and the parent re-renders often.'
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
      note: 'Recomputes only when products or filterText actually change — skips the work on unrelated re-renders.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Memoizing cheap calculations "just in case"',
        wrong: `const fullName = useMemo(() => \`\${first} \${last}\`, [first, last]); // ❌ string concat is cheaper than memoization itself`,
        right: `const fullName = \`\${first} \${last}\`; // ✅ just compute it — no Hook needed`,
        note: 'useMemo has its own cost (storing the cache, comparing dependencies). For trivial calculations, that overhead can exceed any savings — reserve it for genuinely expensive work.'
      },
      {
        title: 'Missing or incorrect dependencies → stale memoized values',
        wrong: `const total = useMemo(() => calcTotal(items, discount), [items]); // ❌ "discount" missing — total won't update when discount changes`,
        right: `const total = useMemo(() => calcTotal(items, discount), [items, discount]); // ✅ all used values listed`,
        note: 'Just like useEffect, the dependency array must include every reactive value the function reads — let eslint-plugin-react-hooks\' exhaustive-deps rule catch omissions for you.'
      },
      {
        title: 'Treating useMemo as a guarantee rather than a hint',
        note: 'React may, in some circumstances (e.g. to free memory), choose to "forget" a memoized value and recompute it. Never rely on useMemo for *correctness* (e.g. to avoid running code with side effects) — only for performance. If something must run exactly once, that\'s a job for useEffect/useState/useRef, not useMemo.'
      }
    ]
  },

  bestPractices: [
    'Reach for useMemo only after profiling shows a specific calculation is genuinely slow and runs often — not preemptively.',
    'List every value the calculation function reads in the dependency array (the linter will help enforce this).',
    'Prefer fixing the root cause first — e.g. moving expensive work out of the render path entirely, or reducing how often the parent re-renders — before reaching for memoization.',
    'Pair useMemo with React.memo when the goal is to stabilize a prop reference for a memoized child component.',
    'Never rely on useMemo to skip side effects or guarantee a calculation runs exactly once — it\'s a performance hint, not a lifecycle guarantee.'
  ],

  interviewQuestions: [
    { q: 'What does useMemo do, and what problem does it solve?', a: 'useMemo caches the return value of a calculation between renders, recomputing it only when its listed dependencies change. It solves the problem of expensive calculations (e.g. filtering/sorting large datasets) being needlessly re-run on every render — including renders triggered by completely unrelated state changes.' },
    { q: 'Is useMemo a guarantee that a function will only run when its dependencies change?', a: 'No — it\'s a performance *hint*. React is generally expected to honor it, but in some cases (e.g. to reclaim memory) it may discard the cached value and recompute. Because of this, you should never rely on useMemo for program *correctness* (like skipping a side effect) — only ever for performance.' },
    { q: 'When should you NOT use useMemo?', a: 'When the calculation is cheap (string concatenation, simple arithmetic, accessing an object property) — the overhead of memoization (storing the cached value, comparing dependencies on every render) often outweighs any benefit. Reach for it only after profiling shows a genuinely expensive calculation is causing a measurable slowdown.' },
    { q: 'How does useMemo help with React.memo and component re-renders?', a: 'React.memo skips re-rendering a component if its props are reference-equal to the previous render\'s props. If you pass a freshly-created object/array/function as a prop, it has a new reference every render, defeating React.memo. Wrapping that value in useMemo (or the function in useCallback) gives it a stable reference across renders where its dependencies haven\'t changed — letting the memoized child correctly skip unnecessary re-renders.' },
    { q: 'What\'s the relationship between useMemo and useCallback?', a: 'They\'re close cousins built on the same caching mechanism: useMemo memoizes a computed *value*, while useCallback memoizes a *function* itself (useCallback(fn, deps) is essentially equivalent to useMemo(() => fn, deps)). Both exist to provide stable references across renders for performance — useMemo for data, useCallback for callbacks/handlers.' }
  ],

  summary: {
    description: 'useMemo caches the result of a calculation across renders, skipping redundant work when its dependencies are unchanged — and, just as importantly, it can hand a stable reference to memoized children or other Hooks\' dependency arrays. Use it deliberately, backed by profiling, for genuinely expensive derivations — not as a reflexive wrapper around every computed value.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useMemo — the canonical reference, including guidance on when memoization actually helps and common pitfalls.' },
    { label: 'Related topic', note: 'See "Performance Optimization" for the bigger picture of React.memo, useCallback, code-splitting, and profiling tools that work alongside useMemo.' }
  ]
};

export default useMemoContent;
