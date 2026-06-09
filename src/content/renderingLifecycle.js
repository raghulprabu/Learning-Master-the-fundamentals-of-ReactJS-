const renderingLifecycleContent = {
  id: 'renderingLifecycle',
  title: 'Rendering Lifecycle',
  icon: '🔄',
  theme: 'purple',
  tagline: 'Understand exactly how React renders components, when effects run, and what "reconciliation" really means.',
  meta: 'Concepts · Deep Dive',

  whatIsIt: {
    description: [
      'React\'s rendering lifecycle is the sequence of steps React takes to turn your component code into pixels on screen — and to update those pixels efficiently when state or props change. Understanding it removes "why is this rendering?" confusion and unlocks performance debugging.',
      'The three phases: Render (React calls your component functions to produce React elements), Commit (React applies the differences to the real DOM), and Cleanup/Effects (React runs useEffect and useLayoutEffect callbacks after commit).'
    ],
    points: [
      'Trigger → Render → Commit → Effects: every update follows this sequence.',
      'Render phase: pure, may be interrupted/restarted (especially in concurrent mode). No DOM changes happen here.',
      'Commit phase: synchronous and uninterruptible — React applies all DOM changes at once.',
      'Effects phase: useLayoutEffect (sync, pre-paint) then browser paint then useEffect (async, post-paint).'
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
      text: '"The rendering lifecycle is like producing a film. The Render phase is the script-writing and storyboard stage — everything happens on paper (in memory), it can be revised multiple times, and nothing in the real world has changed yet. The Commit phase is the one-day shoot — everything is locked, every scene gets filmed exactly once (DOM mutations applied). The Effects phase is post-production and release — done after the shoot, can take as long as needed, and the audience (user) sees the final result."'
    }
  },

  whyUsed: {
    description: 'Understanding the rendering lifecycle transforms debugging from guesswork into reasoning. "Why did my effect run three times?" "Why do I see stale state in my callback?" "Why does my DOM flash?" — all of these have precise answers that come directly from knowing the render → commit → effects sequence.',
    points: [
      'Explains when and why components re-render — enabling targeted memoization decisions.',
      'Explains the order of effect cleanup and setup — critical for debugging useEffect behavior.',
      'Explains why reading refs during render is unsafe but fine in effects.',
      'Explains what React.StrictMode\'s double-rendering is doing (surfacing impure renders).'
    ]
  },

  whenToUse: {
    description: 'This is conceptual knowledge — it informs every React decision rather than being a tool to "reach for". Understanding it is most valuable when debugging subtle issues.',
    points: [
      'Debugging unexpected re-renders or missing renders.',
      'Understanding why an effect sees stale state / why cleanup runs at a specific moment.',
      'Explaining why useLayoutEffect prevents layout flicker but useEffect doesn\'t.',
      'Understanding why React.StrictMode causes double renders and effects in development.'
    ],
    analogy: {
      icon: '💡',
      title: 'The Render phase is PURE',
      text: '"The render phase (calling your component function) must be pure — no DOM mutations, no network calls, no side effects. React can (and in concurrent mode, will) call your render function multiple times, pause it, restart it, and throw it away. Any side effects in the render function run multiple times or at unpredictable times. Side effects belong in useEffect (post-paint) or useLayoutEffect (pre-paint)."'
    }
  },

  howItWorks: {
    description: 'React\'s reconciliation algorithm ("the Fiber architecture") computes what changed by comparing the previous React element tree (virtual DOM) with the new one. It produces a minimal set of DOM operations (insertions, updates, deletions) and applies them all at once in the Commit phase. This "diff then batch apply" approach is what makes React efficient.',
    code: {
      title: 'What triggers a re-render — and the re-render sequence',
      snippet: `// TRIGGERS for re-renders:
// 1. Calling a setState setter
setState(newValue);

// 2. A parent re-rendering (child re-renders by default unless memoized)
function Parent() {
  const [x, setX] = useState(0);
  return <Child />; // Child re-renders when Parent re-renders, even if its props didn't change
}

// 3. A consumed context value changing
const theme = useContext(ThemeContext); // re-renders when ThemeContext.Provider's value changes

// 4. A Hook's internal state changing (e.g. useReducer dispatch)

// THE SEQUENCE (simplified):
// a) setState(newValue) called
// b) React schedules a re-render
// c) RENDER PHASE: React calls the component function(s), producing new React elements
// d) RECONCILIATION: React diffs new vs. previous elements, produces minimal DOM change list
// e) COMMIT PHASE: React applies all DOM changes synchronously
// f) useLayoutEffect cleanups, then useLayoutEffect setups (sync, pre-paint)
// g) Browser paints the updated screen
// h) useEffect cleanups, then useEffect setups (async, post-paint)` },
    points: [
      'React batches multiple setState calls from the same event handler into a single re-render — avoids unnecessary intermediate renders.',
      'In React 18+, automatic batching extends to async code (setTimeout, Promise callbacks) — previously these each triggered a separate render.',
      'Reconciliation uses "keys" to match list items across renders — missing or unstable keys cause React to remount items instead of updating them.'
    ]
  },

  flowDiagram: {
    title: 'The complete render → commit → effects sequence',
    steps: [
      { icon: '⚡', label: 'Trigger: setState / props change', note: 'React schedules a re-render' },
      { icon: '🎨', label: 'Render phase: call component(s)', note: 'Pure — no DOM changes; may be restarted' },
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
      { icon: '🔁', title: 'Why StrictMode causes double renders', description: 'React.StrictMode intentionally invokes the render function twice in development, then throws away the first result. If your render has side effects (API calls, mutations), you\'ll see them twice — that\'s React telling you to move them to effects.' },
      { icon: '🔌', title: 'Why effects see "old" state after a fast update', description: 'An effect closes over the state values from the render it was created in. If state changes and the effect hasn\'t re-run yet (different deps), it still references the old values — a "stale closure". Solution: include the value in deps, or use a ref.' },
      { icon: '✂️', title: 'Why effect cleanup runs before the next effect', description: 'React runs the PREVIOUS effect\'s cleanup function before running the NEW effect on each re-render where deps changed — ensuring each effect starts from a clean slate (subscriptions unsubscribed, timers cleared, etc.).' },
      { icon: '⚡', title: 'Why batching prevents intermediate renders', description: 'In an event handler that calls setA(x) then setB(y), React batches them into ONE re-render — not two — so the UI never shows an inconsistent intermediate state where A has updated but B hasn\'t.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Understanding the lifecycle is the foundation for all performance and debugging work in React.',
      'The render → commit → effects sequence is predictable and learnable — it rarely changes between versions.',
      'Knowing what triggers re-renders directly informs where to apply memoization.',
      'Understanding effects\' cleanup timing eliminates an entire class of subscription/timer memory-leak bugs.'
    ],
    cons: [
      'Concurrent mode makes the render phase non-deterministic in scheduling — React can interrupt and restart renders, which surprises developers expecting single-pass rendering.',
      'React.StrictMode\'s double invocation in development can mask the true lifecycle timing for newcomers.',
      'The fiber internals are complex — understanding the surface-level lifecycle is sufficient for most needs, but deep optimization sometimes requires understanding the architecture.',
      'Mental model adjustments are needed coming from class component lifecycle methods (componentDidMount → useEffect with [] etc.).'
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
      note: 'Explicit lifecycle stages with dedicated methods — clear but more verbose, and harder to reuse stateful logic across components.'
    },
    right: {
      title: '🪝 Function Component hooks equivalent',
      tone: 'good',
      code: `function MyComp() {
  useEffect(() => {
    // componentDidMount equivalent (first run)
    // componentDidUpdate equivalent (subsequent runs)
    return () => { /* componentWillUnmount equivalent */ };
  }, [deps]); // [] = mount/unmount only; [x] = also on x changes
  return <div />;
}`,
      note: 'One hook replaces three lifecycle methods — and the same hook pattern is reusable across components via custom hooks.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Performing side effects during the render phase',
        wrong: `function Dashboard() {\n  fetch('/api/stats').then(setStats); // ❌ runs on EVERY render — infinite loop\n  return <Stats data={stats} />;\n}`,
        right: `function Dashboard() {\n  useEffect(() => { fetch('/api/stats').then(setStats); }, []); // ✅ runs once after mount\n  return <Stats data={stats} />;\n}`,
        note: 'The render function may be called multiple times by React (Strict Mode, concurrent mode). Side effects (fetch, DOM mutations, subscriptions, timers) belong in useEffect.'
      },
      {
        title: 'Ignoring effect cleanup — creating memory leaks',
        wrong: `useEffect(() => {\n  const id = setInterval(() => setTime(Date.now()), 1000);\n  // ❌ no cleanup: interval keeps running after component unmounts\n}, []);`,
        right: `useEffect(() => {\n  const id = setInterval(() => setTime(Date.now()), 1000);\n  return () => clearInterval(id); // ✅ cleanup runs on unmount\n}, []);`,
        note: 'Any effect that registers a timer, subscription, or event listener MUST return a cleanup function that undoes it. Otherwise the resource leaks after the component unmounts — or runs its callback and tries to setState on an unmounted component.'
      },
      {
        title: 'Misunderstanding when effects run',
        wrong: `// "useEffect runs after every render" — partially right:\nuseEffect(() => { /* runs on every render */ }); // no deps: runs after every render\nuseEffect(() => { /* ... */ }, []); // empty deps: runs only on mount\nuseEffect(() => { /* ... */ }, [x]); // deps: runs on mount + when x changes`,
        note: 'The dependency array controls when the effect re-runs — not whether it runs on the first render (it always runs on mount). An empty array runs once; a non-empty array runs on mount plus any render where a dep changed.'
      }
    ]
  },

  bestPractices: [
    'Keep the render function pure — no API calls, no DOM mutations, no side effects. Pure renders enable concurrent mode features.',
    'Always provide cleanup in effects that subscribe, register, or allocate resources.',
    'Understand the dependency array semantics: empty array = mount/unmount only; deps array = on mount + when deps change; no array = every render.',
    'Use React.StrictMode in development — its double-invocation will surface impure renders and missing cleanups before they become production bugs.',
    'Use the React DevTools Profiler to understand which components are rendering, when, and why — the conceptual lifecycle is the mental model; the Profiler is the diagnostic tool.'
  ],

  interviewQuestions: [
    { q: 'What are the three phases of React\'s rendering lifecycle?', a: 'Render phase: React calls component functions to produce React elements (pure, may be interrupted in concurrent mode, no DOM changes). Commit phase: React applies the minimal set of DOM changes produced by reconciliation — synchronous and uninterruptible. Effects phase: useLayoutEffect runs synchronously after commit and before paint (for DOM measurement); the browser paints; then useEffect runs asynchronously, after paint.' },
    { q: 'What triggers a React component to re-render?', a: 'A component re-renders when: (1) its own state updates (setState/dispatch), (2) its parent re-renders (unless the component is wrapped in React.memo with unchanged props), (3) a context value it consumes changes, or (4) a Hook it uses (e.g. useSyncExternalStore) detects a change in external state. React batches multiple state updates from the same event handler into a single re-render.' },
    { q: 'What is reconciliation, and what role do keys play in it?', a: 'Reconciliation is the process of comparing the previous React element tree with the new one (produced by the render phase) to determine the minimal set of DOM operations needed to bring the DOM in sync. Keys in lists help React identify which items are new, moved, or removed — without stable keys, React may incorrectly match items across renders and remount components that could have been updated in-place, losing state and causing performance issues.' },
    { q: 'When does the useEffect cleanup function run?', a: 'In two scenarios: (1) Before the NEXT effect runs — React runs the previous effect\'s cleanup before re-running the effect when dependencies change. This ensures each effect starts from a clean state (subscriptions unsubscribed, timers cleared). (2) When the component UNMOUNTS — the final cleanup runs, tearing down any resources (event listeners, WebSocket connections, intervals) the effect registered.' },
    { q: 'Why does React.StrictMode cause components to render twice in development?', a: 'StrictMode intentionally invokes the render function (and some lifecycle methods) twice in development and throws away the first result. This surfaces impure renders — side effects in the render function that should be in useEffect instead. It also double-invokes effects (mount, then unmount/cleanup, then mount again) to help detect effects that are missing cleanup. Both behaviors only happen in development and are intended to help you write more correct React code before shipping to production.' }
  ],

  summary: {
    description: 'The React rendering lifecycle — trigger → render (pure) → reconcile → commit (sync) → useLayoutEffect (pre-paint) → paint → useEffect (async post-paint) — is the foundational mental model for all of React. Understanding it explains every "why is this re-rendering?", "why does my effect see stale state?", and "why does StrictMode cause double renders?" question you\'ll ever have. Keep renders pure, always clean up effects, and the lifecycle becomes a predictable, powerful tool rather than a source of mystery.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/render-and-commit — the canonical "render and commit" deep dive, explaining the three phases with diagrams.' },
    { label: 'Related topics', note: 'See "useEffect" for the effects lifecycle, "Performance Optimization" for applying lifecycle knowledge to re-render diagnosis, and "React DevTools" for observing the lifecycle in practice.' }
  ]
};

export default renderingLifecycleContent;
