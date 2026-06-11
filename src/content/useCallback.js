const useCallbackContent = {
  id: 'useCallback',
  title: 'useCallback Hook',
  icon: '📲',
  theme: 'sky',
  tagline: 'useCallback saves a function definition so React returns the same reference across renders.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useCallback returns a memoized version of a function that only changes when one of its dependencies changes. Without it, a function defined inside a component is recreated — a brand-new reference — on every render.',
      'useCallback(fn, deps) is essentially shorthand for useMemo(() => fn, deps). It caches the function itself, not the result of calling it.'
    ],
    points: [
      'Syntax: const memoizedFn = useCallback((args) => { ... }, [dependencies]);',
      'On each render, if dependencies are unchanged, React returns the same function reference.',
      'It does not make the function run faster — it keeps the function\'s identity stable.'
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
      text: '"Imagine making a brand-new house key every morning, even though the lock has not changed. A smart lock (a memoized child component) sees a \'new\' key each day and re-checks everything. useCallback is like keeping the SAME physical key as long as the lock has not changed — the smart lock recognizes it and skips the unnecessary re-check."'
    }
  },

  whyUsed: {
    description: 'Every function inside a component is recreated on every render. Memoized children and Hook dependency arrays use reference equality to decide if something changed — a new function reference looks like a change even if the code is identical.',
    points: [
      'Prevents memoized children (React.memo) from re-rendering when they receive a callback prop.',
      'Keeps a function stable so it can safely be in a useEffect dependency array.',
      'Useful for functions returned from custom hooks that consumers depend on.'
    ]
  },

  whenToUse: {
    description: 'Use useCallback when a function\'s identity matters to something downstream — not by default for every function.',
    points: [
      'Passing a callback to a React.memo child to prevent unnecessary re-renders.',
      'A function is listed as a dependency of useEffect and needs to stay stable.',
      'Returning a function from a custom hook that consumers use in their own effects.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use useCallback',
      text: '"If a function is only used directly as an onClick on a plain <button>, there is no benefit to wrapping it in useCallback. Plain DOM elements do not care about function identity. Reach for it only when identity matters to a memoized consumer downstream."'
    }
  },

  howItWorks: {
    description: 'On first render, React stores your function and its dependencies. On later renders, if dependencies are unchanged, React discards the newly created function and returns the original reference instead.',
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
      'useCallback only helps if the receiving component is also wrapped in React.memo.',
      'Functional state updates (setX(prev => ...)) often reduce how often a function needs to change.',
      'useCallback(fn, deps) equals useMemo(() => fn, deps) — same mechanism.'
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
    intro: 'useCallback earns its keep around memoized children and Hook dependencies:',
    items: [
      { icon: '📋', title: 'Large lists with per-row actions', description: 'A memoized table row receives an onSelect callback. useCallback prevents every row from re-rendering when unrelated parent state changes.' },
      { icon: '🔌', title: 'Custom hooks returning functions', description: 'A useDebouncedSearch hook returns a search function. Wrapping it in useCallback lets consumers safely depend on it in their own effects.' },
      { icon: '🧩', title: 'Stable handlers passed deep through composition', description: 'A reusable <DataGrid> wrapped in React.memo benefits from stable callback identities to actually skip work.' },
      { icon: '🎯', title: 'Functions inside useEffect dependencies', description: 'When an effect must call a function defined in the component, wrapping it in useCallback keeps the effect from re-running every render.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Unlocks the benefits of React.memo for components receiving function props.',
      'Keeps function identities stable for safe use in other Hooks\' dependency arrays.',
      'Helps avoid cascades of unnecessary re-renders in component trees.',
      'Makes "this function\'s identity matters" explicit and self-documenting.'
    ],
    cons: [
      'Adds overhead — a net loss when nothing downstream cares about identity.',
      'Easy to add "just in case" everywhere, cluttering code without benefit.',
      'Easy to get the dependency array wrong, leading to stale closures.',
      'Only effective when the receiving component is also wrapped in React.memo.'
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
      note: 'Use when a function\'s identity needs to be stable for memoized children or Hook dependencies.'
    },
    right: {
      title: '💭 useMemo — memoizes a VALUE',
      tone: 'neutral',
      code: `const total = useMemo(() => {
  return computeExpensiveTotal(a, b);
}, [a, b]);
// returns the RESULT of calling the function`,
      note: 'Use when a computed value is expensive and should be cached between renders.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Using useCallback without memoizing the receiving component',
        wrong: `const handleClick = useCallback(() => doX(), []);\nreturn <PlainButton onClick={handleClick} />; // ❌ PlainButton isn't memoized — re-renders regardless`,
        right: `const MemoButton = React.memo(PlainButton);\nconst handleClick = useCallback(() => doX(), []);\nreturn <MemoButton onClick={handleClick} />; // ✅ now identity stability actually pays off`,
        note: 'useCallback only prevents re-renders when paired with React.memo on the receiving component.'
      },
      {
        title: 'Missing dependencies causing stale closures',
        wrong: `const handleSubmit = useCallback(() => {\n  api.save(formData); // ❌ "formData" not in deps — always saves the FIRST render's data\n}, []);`,
        right: `const handleSubmit = useCallback(() => {\n  api.save(formData);\n}, [formData]); // ✅ updates when formData changes`,
        note: 'Every reactive value the function reads must be listed. Otherwise the cached function always uses old values.'
      },
      {
        title: 'Wrapping every handler in useCallback "just in case"',
        note: 'If a handler is only used as a plain DOM event prop and never passed to a memoized child or Hook dependency, useCallback adds cost without benefit.'
      }
    ]
  },

  bestPractices: [
    'Pair useCallback with React.memo on the receiving component — using one without the other rarely helps.',
    'List every reactive value the function reads in the dependency array.',
    'Use functional state updates (setX(prev => ...)) to keep handlers naturally stable.',
    'Reach for it after the Profiler shows an unstable callback is causing real re-render churn.',
    'Remember useCallback(fn, deps) equals useMemo(() => fn, deps) — same mechanism.'
  ],

  interviewQuestions: [
    { q: 'What does useCallback do, and how is it different from useMemo?', a: 'useCallback returns a memoized function — the same reference across renders as long as dependencies have not changed. useMemo returns a memoized value — the cached result of calling a function. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).' },
    { q: 'Why does a function defined inside a component get a new reference on every render?', a: 'Every time the component function runs (every render), any function expression inside it is recreated as a new object in memory. This matters because React.memo and dependency arrays use reference equality. A new function reference looks like a change, defeating memoization.' },
    { q: 'Does wrapping a function in useCallback automatically prevent a child from re-rendering?', a: 'No. It only stabilizes the function\'s reference. The child also needs to be wrapped in React.memo to actually skip re-rendering. It is the combination of both that matters.' },
    { q: 'What is a stale closure, and how can useCallback cause one?', a: 'A stale closure happens when a function remembers values from an old render instead of the latest ones. If you omit a dependency from useCallback\'s array, the cached function always uses old values. Fix it by listing every reactive value the function reads.' },
    { q: 'When would you NOT wrap a function in useCallback?', a: 'When the function is only used directly as a plain DOM event handler and never passed to a memoized child or listed in another Hook\'s dependency array. Plain DOM elements do not care about function identity, so memoizing adds cost with no benefit.' }
  ],

  summary: {
    description: 'useCallback keeps a function\'s reference stable across renders. Paired with React.memo, it prevents unnecessary child re-renders. Use it deliberately where function identity matters to something downstream, and always get the dependency array right.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useCallback — the canonical reference, including the React.memo pairing and stale closure pitfalls.' },
    { label: 'Related topic', note: 'See "useMemo" for the value-memoizing sibling, and "Performance Optimization" for the broader toolbox.' }
  ]
};

export default useCallbackContent;
