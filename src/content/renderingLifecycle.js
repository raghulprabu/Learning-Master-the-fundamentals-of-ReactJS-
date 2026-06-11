const renderingLifecycleContent = {
  id: 'renderingLifecycle',
  title: 'Rendering Lifecycle',
  icon: '🔄',
  theme: 'purple',
  tagline: 'Understand how React renders components, when effects run, and what reconciliation means.',
  meta: 'Concepts · Deep Dive',

  whatIsIt: {
    description: [
      'React\'s rendering lifecycle is the sequence of steps React takes to turn your component code into pixels on screen — and to update those pixels efficiently when state or props change.',
      'The three phases: Render (React calls your component functions), Commit (React updates the real DOM), and Effects (React runs useEffect and useLayoutEffect callbacks).'
    ],
    points: [
      'Trigger → Render → Commit → Effects — every update follows this order.',
      'Render phase: pure, may be restarted (in concurrent mode). No DOM changes happen here.',
      'Commit phase: synchronous and uninterruptible — React applies all DOM changes at once.',
      'Effects phase: useLayoutEffect (sync, before paint) → browser paint → useEffect (async, after paint).'
    ],
    code: { title: 'The lifecycle made visible with logs', snippet: `function Counter() {
  const [count, setCount] = useState(0);

  // This runs every RENDER (even on re-renders from parent)
  console.log('1. Render: Counter called, count =', count);

  useLayoutEffect(() => {
    // Runs after commit, BEFORE paint
    console.log('3. useLayoutEffect: DOM updated, count =', count);
    return () => console.log('3. useLayoutEffect CLEANUP');
  }, [count]);

  useEffect(() => {
    // Runs after commit AND after paint
    console.log('4. useEffect: paint done, count =', count);
    return () => console.log('4. useEffect CLEANUP');
  }, [count]);

  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
// On button click:
// 1. Render: Counter called, count = 1     ← render phase
// 3. useLayoutEffect CLEANUP               ← commit: cleanup previous effect
// 3. useLayoutEffect: DOM updated          ← commit: run new layout effect
// [browser paints]
// 4. useEffect CLEANUP                     ← effects: cleanup previous
// 4. useEffect: paint done                 ← effects: run new effect` },
    analogy: {
      icon: '🎬',
      title: 'Real-World Analogy',
      text: '"The rendering lifecycle is like producing a film. The Render phase is the scriptwriting — everything happens on paper (in memory), nothing in the real world has changed yet. The Commit phase is the one-day shoot — everything is locked, every scene filmed once. The Effects phase is post-production and release — done after the shoot, the audience (user) sees the final result."'
    }
  },

  whyUsed: {
    description: 'Understanding the rendering lifecycle turns debugging from guesswork into reasoning. "Why did my effect run three times?" "Why do I see stale state in my callback?" "Why does my DOM flash?" — all of these have direct answers from the render → commit → effects sequence.',
    points: [
      'Explains when and why components re-render — enabling targeted memoization decisions.',
      'Explains the order of effect cleanup and setup — critical for debugging useEffect behavior.',
      'Explains why reading refs during render is unsafe but fine in effects.',
      'Explains what React StrictMode\'s double-rendering is doing.'
    ]
  },

  whenToUse: {
    description: 'This is conceptual knowledge — it informs every React decision rather than being a tool to "reach for". Most valuable when debugging subtle issues.',
    points: [
      'Debugging unexpected re-renders or missing renders.',
      'Understanding why an effect sees stale state.',
      'Explaining why useLayoutEffect prevents layout flicker but useEffect does not.',
      'Understanding why StrictMode causes double renders in development.'
    ],
    analogy: {
      icon: '💡',
      title: 'The Render phase is PURE',
      text: '"The render phase (calling your component function) must be pure — no DOM changes, no network calls, no side effects. React can call your render function multiple times, pause it, and restart it. Side effects in the render function run at unpredictable times. Side effects belong in useEffect (after paint) or useLayoutEffect (before paint)."'
    }
  },

  howItWorks: {
    description: 'React\'s reconciliation algorithm compares the previous element tree with the new one, computes a minimal set of DOM operations, and applies them all at once in the Commit phase. This "diff then batch apply" approach is what makes React efficient.',
    code: {
      title: 'What triggers a re-render — and the re-render sequence',
      snippet: `// TRIGGERS for re-renders:
// 1. Calling a setState setter
setState(newValue);

// 2. A parent re-rendering (child re-renders by default unless memoized)
function Parent() {
  const [x, setX] = useState(0);
  return <Child />; // Child re-renders when Parent re-renders
}

// 3. A consumed context value changing
const theme = useContext(ThemeContext); // re-renders when ThemeContext value changes

// 4. A Hook's internal state changing (e.g. useReducer dispatch)

// THE SEQUENCE (simplified):
// a) setState(newValue) called
// b) React schedules a re-render
// c) RENDER PHASE: React calls the component function, producing new React elements
// d) RECONCILIATION: React diffs new vs. previous elements
// e) COMMIT PHASE: React applies all DOM changes synchronously
// f) useLayoutEffect cleanups, then setups (sync, pre-paint)
// g) Browser paints the updated screen
// h) useEffect cleanups, then setups (async, post-paint)` },
    points: [
      'React batches multiple setState calls from the same event handler into a single re-render — avoids intermediate renders.',
      'React 18+ automatic batching extends to async code (setTimeout, Promises) — previously each caused a separate render.',
      'Keys in lists help React match items across renders — missing or unstable keys cause React to remount items instead of updating them.'
    ]
  },

  flowDiagram: {
    title: 'The complete render → commit → effects sequence',
    steps: [
      { icon: '⚡', label: 'Trigger: setState / props change', note: 'React schedules a re-render' },
      { icon: '🎨', label: 'Render phase: call component(s)', note: 'Pure — no DOM changes; may restart' },
      { icon: '🔍', label: 'Reconciliation: diff old vs. new', note: 'Produces minimal DOM change list' },
      { icon: '🔧', label: 'Commit phase: apply DOM changes', note: 'Synchronous, uninterruptible' },
      { icon: '📐', label: 'useLayoutEffect (sync, pre-paint)', note: 'Measure/adjust DOM' },
      { icon: '🖼️', label: 'Browser paints', note: 'User sees updated screen' },
      { icon: '🌀', label: 'useEffect (async, post-paint)', note: 'Fetches, subscriptions, timers' }
    ]
  },

  realWorldExamples: {
    intro: 'Lifecycle knowledge answers the "why" behind common React behaviors:',
    items: [
      { icon: '🔁', title: 'Why StrictMode causes double renders', description: 'React StrictMode calls the render function twice to surface side effects. If your render has API calls or mutations, you see them twice — React is telling you to move them to effects.' },
      { icon: '🔌', title: 'Why effects see "old" state', description: 'An effect closes over state values from the render it was created in. If state changes before the effect re-runs, it references old values — a "stale closure." Solution: include the value in deps, or use a ref.' },
      { icon: '✂️', title: 'Why effect cleanup runs before the next effect', description: 'React runs the previous cleanup before running the new effect on each re-render where deps changed — ensuring subscriptions are unsubscribed and timers cleared before restarting.' },
      { icon: '⚡', title: 'Why batching prevents intermediate renders', description: 'Calling setA(x) then setB(y) in one event handler produces ONE re-render — not two — so the UI never shows an inconsistent state where A updated but B has not.' }
    ]
  },

  prosAndCons: {
    pros: [
      'The lifecycle is the foundation for all performance and debugging work in React.',
      'The sequence is predictable and rarely changes between React versions.',
      'Knowing what triggers re-renders shows exactly where to apply memoization.',
      'Understanding effect cleanup timing eliminates subscription and timer memory-leak bugs.'
    ],
    cons: [
      'Concurrent mode makes the render phase non-deterministic — React can interrupt and restart renders.',
      'StrictMode\'s double invocation in development can confuse newcomers.',
      'Coming from class components requires mapping lifecycle methods to hook equivalents.',
      'Deep fiber internals are complex — the surface-level lifecycle is sufficient for most needs.'
    ]
  },

  comparison: {
    title: 'Class component lifecycle vs. function component hooks timing',
    left: {
      title: '📦 Class Component lifecycle methods',
      tone: 'neutral',
      code: `class MyComp extends React.Component {
  componentDidMount()  { /* after first render */ }
  componentDidUpdate() { /* after every re-render */ }
  componentWillUnmount(){ /* before removal */ }
  render()             { return <div />; }
}`,
      note: 'Explicit lifecycle stages — clear but more verbose, and harder to reuse across components.'
    },
    right: {
      title: '🪝 Function Component hooks equivalent',
      tone: 'good',
      code: `function MyComp() {
  useEffect(() => {
    // componentDidMount equivalent (first run)
    // componentDidUpdate equivalent (subsequent runs)
    return () => { /* componentWillUnmount equivalent */ };
  }, [deps]); // [] = mount/unmount only; [x] = also when x changes
  return <div />;
}`,
      note: 'One hook replaces three lifecycle methods — and is reusable across components via custom hooks.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Performing side effects during the render phase',
        wrong: `function Dashboard() {\n  fetch('/api/stats').then(setStats); // ❌ runs on every render — infinite loop\n  return <Stats data={stats} />;\n}`,
        right: `function Dashboard() {\n  useEffect(() => { fetch('/api/stats').then(setStats); }, []); // ✅ runs once after mount\n  return <Stats data={stats} />;\n}`,
        note: 'The render function may be called multiple times. Side effects (fetch, mutations, subscriptions) belong in useEffect.'
      },
      {
        title: 'Not providing cleanup — creating memory leaks',
        wrong: `useEffect(() => {\n  const id = setInterval(() => setTime(Date.now()), 1000);\n  // ❌ no cleanup: interval keeps running after unmount\n}, []);`,
        right: `useEffect(() => {\n  const id = setInterval(() => setTime(Date.now()), 1000);\n  return () => clearInterval(id); // ✅ cleanup runs on unmount\n}, []);`,
        note: 'Any effect that registers a timer, subscription, or event listener MUST return a cleanup function. Otherwise the resource leaks after the component unmounts.'
      },
      {
        title: 'Misunderstanding when effects run',
        wrong: `// "useEffect runs after every render" — only partially right:\nuseEffect(() => { /* ... */ }); // no deps: runs after every render\nuseEffect(() => { /* ... */ }, []); // empty deps: runs only on mount\nuseEffect(() => { /* ... */ }, [x]); // deps: runs on mount + when x changes`,
        note: 'The dependency array controls when the effect re-runs. An empty array runs once on mount. A non-empty array runs on mount plus whenever a dependency changes.'
      }
    ]
  },

  bestPractices: [
    'Keep the render function pure — no API calls, no DOM mutations, no side effects.',
    'Always provide cleanup in effects that subscribe, register, or allocate resources.',
    'Understand the dependency array: [] = mount only; [x] = on mount + when x changes; no array = every render.',
    'Use React StrictMode in development — double-invocation surfaces impure renders and missing cleanups.',
    'Use React DevTools Profiler to see which components render, when, and why.'
  ],

  interviewQuestions: [
    { q: 'What are the three phases of React\'s rendering lifecycle?', a: 'Render phase: React calls component functions to produce React elements — pure, may be interrupted. Commit phase: React applies the minimal DOM changes from reconciliation — synchronous and uninterruptible. Effects phase: useLayoutEffect runs before paint (for DOM measurement), then the browser paints, then useEffect runs asynchronously after paint.' },
    { q: 'What triggers a React component to re-render?', a: 'A component re-renders when: (1) its own state updates, (2) its parent re-renders (unless wrapped in React.memo with unchanged props), (3) a context value it consumes changes, or (4) a hook it uses detects a change. React batches multiple state updates from the same event handler into one re-render.' },
    { q: 'What is reconciliation, and what role do keys play?', a: 'Reconciliation compares the previous React element tree with the new one to find the minimal set of DOM operations needed. Keys in lists help React identify which items are new, moved, or removed. Without stable keys, React may remount components instead of updating them, losing state and reducing performance.' },
    { q: 'When does the useEffect cleanup function run?', a: 'In two cases: (1) before the NEXT effect runs — React runs the previous cleanup before re-running the effect when dependencies change; (2) when the component unmounts — the final cleanup tears down resources registered by the effect.' },
    { q: 'Why does React StrictMode cause components to render twice in development?', a: 'StrictMode invokes the render function twice and throws away the first result to surface impure renders — side effects that should be in useEffect instead. It also double-invokes effects (mount, cleanup, mount again) to detect missing cleanup. Both behaviors only happen in development and help you write more correct React code before shipping.' }
  ],

  summary: {
    description: 'The React rendering lifecycle — trigger → render (pure) → reconcile → commit (sync) → useLayoutEffect (pre-paint) → paint → useEffect (async) — is the foundational mental model for all React development. Keep renders pure, always clean up effects, and the lifecycle becomes a predictable tool rather than a source of mystery.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/render-and-commit — the canonical three-phase walkthrough with diagrams.' },
    { label: 'Related topics', note: 'See "useEffect" for the effects lifecycle, "Performance Optimization" for applying lifecycle knowledge, and "React DevTools" for observing it in practice.' }
  ]
};

export default renderingLifecycleContent;
