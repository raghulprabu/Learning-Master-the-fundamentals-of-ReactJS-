const useCallbackContent = {
  id: 'useCallback',
  title: 'useCallback Hook',
  icon: '📲',
  theme: 'sky',
  tagline: 'Cache ("memoize") a function definition itself across renders — useMemo\'s sibling, specialized for functions.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useCallback returns a memoized version of a function that only changes if one of its dependencies changes. Without it, a function defined inside a component is recreated — a brand-new reference — on every single render.',
      'In fact, useCallback(fn, deps) is essentially shorthand for useMemo(() => fn, deps) — it caches the *function itself* (its reference) rather than the result of calling it.'
    ],
    points: [
      'Syntax: const memoizedFn = useCallback((args) => { ... }, [dependencies]);',
      'On each render, if the dependencies are unchanged, React returns the *exact same function reference* from last time — not a new one that merely "does the same thing".',
      'It does not make the function run faster — it makes the function\'s *identity* stable across renders.'
    ],
    code: { title: 'The basic shape', snippet: `// Without useCallback: a brand-new function every render
const handleSearch = (query) => onSearch(query, filters);

// With useCallback: the SAME function reference, as long as
// onSearch/filters haven't changed
const handleSearch = useCallback(
  (query) => onSearch(query, filters),
  [onSearch, filters]
);` },
    analogy: {
      icon: '🔑',
      title: 'Real-World Analogy',
      text: '"Imagine reprinting a brand-new house key every single morning, even though the lock hasn\'t changed. Your smart lock (a memoized child component) sees a \'new\' key each day and assumes it must re-check everything from scratch. useCallback is like keeping the SAME physical key as long as the lock hasn\'t changed — the smart lock recognizes it instantly and skips the unnecessary re-check."'
    }
  },

  whyUsed: {
    description: 'Functions are values in JavaScript — and like objects/arrays, a new function expression creates a new reference every time it runs. That matters in React because reference equality is how memoized children (React.memo) and some Hooks\' dependency arrays decide "did anything actually change?".',
    points: [
      'Prevents memoized child components (wrapped in React.memo) from re-rendering needlessly when they receive a callback prop.',
      'Keeps a function\'s identity stable so it can safely be used in another Hook\'s dependency array (e.g. useEffect) without causing that effect to re-run every render.',
      'Useful for functions passed to custom hooks that compare dependencies by reference (debounce/throttle helpers, subscription setups).'
    ]
  },

  whenToUse: {
    description: 'Like useMemo, useCallback is a targeted performance optimization — reach for it when a function\'s *identity* matters to something downstream, not by default for every function you write.',
    points: [
      'You\'re passing a callback to a child component wrapped in React.memo, and want to prevent it from re-rendering whenever the parent re-renders.',
      'A function is listed as a dependency of useEffect/useMemo/another useCallback, and you need it to stay stable to avoid re-running that hook unnecessarily.',
      'You\'re returning a function from a custom Hook and want consumers to be able to depend on it safely.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use useCallback',
      text: '"If a function is only ever used inside the component that defines it (e.g. directly as an onClick on a plain <button>), wrapping it in useCallback adds overhead (the dependency comparison) without any benefit — plain DOM elements don\'t care about function identity. Reach for it specifically when identity matters to a memoized consumer downstream."'
    }
  },

  howItWorks: {
    description: 'On first render, React stores your function and its dependency array. On later renders, it compares the new dependency array to the old one; if unchanged, it discards the newly-created function and returns the *original* reference instead — keeping the identity stable across renders.',
    code: {
      title: 'Stabilizing a callback passed to a memoized child',
      snippet: `const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {
  console.log('ExpensiveList rendered'); // we want this to log RARELY
  return (
    <ul>{items.map(item => (
      <li key={item.id} onClick={() => onSelect(item.id)}>{item.name}</li>
    ))}</ul>
  );
});

function ProductPage({ items }) {
  const [theme, setTheme] = useState('light');

  // ❌ Without useCallback: a NEW function every render -> ExpensiveList
  // re-renders every time ProductPage re-renders (e.g. when theme toggles)
  // const handleSelect = (id) => navigate(\`/product/\${id}\`);

  // ✅ With useCallback: same reference across renders where deps don't change
  const handleSelect = useCallback((id) => navigate(\`/product/\${id}\`), [navigate]);

  return (
    <>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>Toggle theme</button>
      <ExpensiveList items={items} onSelect={handleSelect} />
    </>
  );
}`
    },
    points: [
      'useCallback only helps if the *receiving* component is also memoized (React.memo) — otherwise it re-renders regardless of prop identity.',
      'The functional-update form of state setters (setX(prev => ...)) often removes the *need* for a function to depend on the latest state — reducing how often it must change.',
      'useCallback(fn, deps) ≡ useMemo(() => fn, deps) — they share the same underlying caching mechanism.'
    ]
  },

  flowDiagram: {
    title: 'How useCallback keeps a function reference stable',
    steps: [
      { icon: '🔁', label: 'Parent re-renders', note: 'e.g. unrelated state changes' },
      { icon: '🔍', label: 'Compare dependencies', note: '[onSearch, filters] unchanged?' },
      { icon: '♻️', label: 'Return cached function', note: 'Same reference as before' },
      { icon: '🛡️', label: 'Memoized child skips re-render', note: 'React.memo sees identical props' }
    ]
  },

  realWorldExamples: {
    intro: 'useCallback earns its keep specifically around memoized children and Hook dependencies:',
    items: [
      { icon: '📋', title: 'Large lists with per-row actions', description: 'A virtualized table where each memoized row receives an onSelect/onDelete callback — useCallback prevents every row from re-rendering when unrelated parent state changes.' },
      { icon: '🔌', title: 'Custom hooks returning functions', description: 'A useDebouncedSearch() hook returns a `search` function — wrapping it in useCallback lets consumers safely depend on it in their own effects.' },
      { icon: '🧩', title: 'Stabilizing handlers passed deep through composition', description: 'A reusable <DataGrid onRowClick={...} onSort={...}> that\'s wrapped in React.memo benefits from stable callback identities to actually skip work.' },
      { icon: '🎯', title: 'Functions inside useEffect dependency arrays', description: 'When an effect must call a function defined in the component, wrapping that function in useCallback (or moving it inside the effect) keeps the effect from re-running every render.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Unlocks the benefits of React.memo for components receiving function props.',
      'Keeps function identities stable for safe use in other Hooks\' dependency arrays.',
      'Helps avoid cascades of unnecessary re-renders in component trees with many memoized children.',
      'Makes "this function\'s identity matters elsewhere" explicit and self-documenting.'
    ],
    cons: [
      'Adds overhead (dependency comparison, cache storage) — a net loss when nothing downstream cares about identity.',
      'Easy to add "just in case" everywhere, cluttering code without measurable benefit.',
      'Easy to get the dependency array wrong, leading to a function that "remembers" stale values (stale closures).',
      'Only effective in combination with React.memo on the receiving component — using it alone often achieves nothing.'
    ]
  },

  comparison: {
    title: 'useCallback vs. useMemo — same mechanism, different target',
    left: {
      title: '📲 useCallback — memoizes a FUNCTION',
      tone: 'good',
      code: `const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
// returns the function itself, with a stable reference`,
      note: 'Use when a function\'s *identity* needs to stay stable (props to memoized children, Hook dependencies).'
    },
    right: {
      title: '💭 useMemo — memoizes a VALUE',
      tone: 'neutral',
      code: `const total = useMemo(() => {
  return computeExpensiveTotal(a, b);
}, [a, b]);
// returns the RESULT of calling the function`,
      note: 'Use when a *computed value* is expensive to (re)produce and should be cached between renders.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Using useCallback without memoizing the receiving component',
        wrong: `const handleClick = useCallback(() => doX(), []);\nreturn <PlainButton onClick={handleClick} />; // ❌ PlainButton isn't memoized — re-renders regardless`,
        right: `const MemoButton = React.memo(PlainButton);\nconst handleClick = useCallback(() => doX(), []);\nreturn <MemoButton onClick={handleClick} />; // ✅ now identity stability actually pays off`,
        note: 'useCallback only prevents re-renders when paired with React.memo (or another reference-equality check) on the receiving side. Used alone on a plain element/non-memoized component, it changes nothing observable.'
      },
      {
        title: 'Missing dependencies → stale closures',
        wrong: `const handleSubmit = useCallback(() => {\n  api.save(formData); // ❌ "formData" not in deps — always saves the FIRST render's data\n}, []);`,
        right: `const handleSubmit = useCallback(() => {\n  api.save(formData);\n}, [formData]); // ✅ updates when formData changes — always saves current data`,
        note: 'Just like useEffect/useMemo, every reactive value the function reads must be listed — otherwise the cached function "remembers" old values from whenever it was last recreated.'
      },
      {
        title: 'Wrapping every single handler "just in case"',
        note: 'If a handler is only used as a plain DOM event prop (<button onClick={handleClick}>) and never passed to a memoized child or Hook dependency array, useCallback adds cost without benefit. Reserve it for cases where a function\'s identity genuinely matters downstream.'
      }
    ]
  },

  bestPractices: [
    'Pair useCallback with React.memo on the receiving component — using one without the other rarely achieves anything.',
    'List every reactive value the function reads in the dependency array; let the linter\'s exhaustive-deps rule guide you.',
    'Prefer functional state updates (setX(prev => ...)) so handlers don\'t need to depend on the latest state value — fewer dependencies, more stable functions.',
    'Reach for it deliberately — after noticing (via the Profiler) that an unstable callback is causing real, measurable re-render churn.',
    'Remember useCallback(fn, deps) === useMemo(() => fn, deps) — pick whichever reads more clearly for your case.'
  ],

  interviewQuestions: [
    { q: 'What does useCallback do, and how is it different from useMemo?', a: 'useCallback returns a memoized *function* — the same reference across renders as long as its dependencies haven\'t changed. useMemo returns a memoized *value* — the cached result of calling a function. In fact useCallback(fn, deps) is equivalent to useMemo(() => fn, deps); useCallback is just a more readable shorthand for the specific case of memoizing functions.' },
    { q: 'Why does a function defined inside a component get a new reference on every render, and why does that matter?', a: 'Every time the component function runs (i.e. every render), any function expression inside it is re-created as a brand-new object in memory — a fresh reference, even if its code looks identical to last time. This matters because React.memo and dependency-array comparisons use reference equality (Object.is): a "new" function reference looks like "a change" to them, defeating memoization and potentially causing unnecessary re-renders or effect re-runs.' },
    { q: 'Does wrapping a function in useCallback automatically prevent its child component from re-rendering?', a: 'No — by itself it only stabilizes the function\'s *reference*. The child also needs to be wrapped in React.memo (or otherwise compare props by reference) to actually skip re-rendering when it receives the same function reference again. Using useCallback without a memoized receiver changes nothing observable — it\'s the pairing that matters.' },
    { q: 'What is a "stale closure", and how can useCallback cause one if used incorrectly?', a: 'A stale closure happens when a function "remembers" values from the render in which it was created, rather than the latest ones — because it was never recreated to capture the new values. If you omit a reactive dependency from useCallback\'s array, React keeps returning the old cached function (which closed over old variables), so it keeps using stale data even after that data has changed. The fix is to include every reactive value the function reads in the dependency array.' },
    { q: 'When would you NOT bother wrapping a function in useCallback?', a: 'When the function is only used directly as a plain DOM event handler (e.g. <button onClick={handleClick}>) and never passed to a memoized child component or listed in another Hook\'s dependency array — plain DOM elements don\'t care about function identity, so memoizing achieves nothing besides adding comparison overhead.' }
  ],

  summary: {
    description: 'useCallback memoizes a function\'s *identity* — handing back the same reference across renders when its dependencies are unchanged. It\'s the partner optimization to React.memo: alone, it does little; paired with a memoized receiver, it can meaningfully cut down unnecessary re-renders. Use it deliberately where function identity matters, get the dependency array right, and lean on functional state updates to keep handlers naturally stable.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useCallback — the canonical reference, including the React.memo pairing and common pitfalls like stale closures.' },
    { label: 'Related topic', note: 'See "useMemo" for the value-memoizing sibling Hook, and "Performance Optimization" for the broader toolbox (React.memo, profiling, code-splitting).' }
  ]
};

export default useCallbackContent;
