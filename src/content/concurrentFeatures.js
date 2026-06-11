const concurrentFeaturesContent = {
  id: 'concurrentFeatures',
  title: 'Concurrent Features',
  icon: '🌀',
  theme: 'violet',
  tagline: 'React 18 can pause, interrupt, and prioritize renders — keeping the UI responsive during heavy work.',
  meta: 'Concepts · Modern React',

  whatIsIt: {
    description: [
      'React 18\'s concurrent rendering mode changes how React schedules renders. Instead of every update blocking the main thread until it finishes, React can now pause a render, do something more urgent, and resume — keeping the UI responsive.',
      'Concurrent features include: automatic batching (multiple state updates → one render), useTransition (mark updates as non-urgent), useDeferredValue (defer a fast-changing value), and streaming SSR with Suspense.'
    ],
    points: [
      'Enable concurrent mode by using createRoot() instead of ReactDOM.render().',
      'Key change: React can now interrupt and discard an in-progress render when something urgent arrives.',
      'Automatic batching: state updates in async code (setTimeout, Promises) are batched in React 18 — previously each caused a separate render.',
      'useTransition and useDeferredValue let you explicitly mark work as "can wait".'
    ],
    code: { title: 'Concurrent mode + automatic batching demo', snippet: `// 1. Enable concurrent mode (replaces ReactDOM.render in React 18+)
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// 2. Automatic batching — React 18 only
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 17: 2 separate renders (this was in an async callback)
  // React 18: 1 render (batched automatically)
}, 1000);

// 3. Marking a slow update as non-urgent with useTransition
const [isPending, startTransition] = useTransition();
function handleTabClick(tab) {
  startTransition(() => setCurrentTab(tab)); // React can interrupt this if needed
}

// 4. Deferring a fast-changing value with useDeferredValue
const deferredQuery = useDeferredValue(query);
// HeavyList "lags behind" query updates, preventing jank during fast typing` },
    analogy: {
      icon: '🎭',
      title: 'Real-World Analogy',
      text: '"Old React was like a chef who would start chopping a big bag of onions and refuse all other orders until finished — the kitchen freezes. Concurrent React is a chef who immediately pauses the onions when an urgent drinks request arrives, handles it, then returns to the onions right where they left off. The same work gets done, but urgent requests are never kept waiting."'
    }
  },

  whyUsed: {
    description: 'Before concurrent rendering, any expensive render could freeze the browser — making buttons unresponsive and inputs laggy. Concurrent mode lets React prioritize urgent interactions so the UI stays snappy even during heavy work.',
    points: [
      'Prevents UI freezes from expensive renders — React can pause and prioritize urgent interactions.',
      'Automatic batching reduces unnecessary re-renders from async code.',
      'useTransition and useDeferredValue give explicit control over what can wait.',
      'Enables streaming SSR — server pages stream HTML before all data is ready.'
    ]
  },

  whenToUse: {
    description: 'Concurrent mode is enabled at the root for all React 18 apps using createRoot(). The specific APIs are opt-in.',
    points: [
      'useTransition: expensive state updates (tab switching, heavy filters) that can be deprioritized vs. urgent typing.',
      'useDeferredValue: fast-changing values (search queries) feeding expensive renders that should lag behind gracefully.',
      'Suspense for data: declarative loading states with a compatible data library or framework.',
      'Streaming SSR: Next.js App Router + Server Components use this automatically.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'Concurrent mode does NOT make renders faster',
      text: '"Concurrent rendering changes HOW React schedules work — it does not make any individual render faster. A component that takes 200ms still takes 200ms. Concurrent mode ensures that 200ms does not freeze the input field. For actual speed improvements, you still need useMemo, virtualization, and better algorithms."'
    }
  },

  howItWorks: {
    description: 'React 18\'s scheduler assigns different priorities to updates. User-input events (typing, clicking) are "urgent" and render synchronously. Updates wrapped in startTransition are "lower priority" — interruptible and can be abandoned if a newer urgent update arrives.',
    code: {
      title: 'All concurrent APIs working together',
      snippet: `function SearchApp() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  function handleChange(e) {
    setQuery(e.target.value); // URGENT: input stays snappy
    startTransition(() => {
      // NON-URGENT: results update can be interrupted
      setResults(searchIndex.search(e.target.value));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Searching…</span>}
      {/* HeavyResults uses deferredQuery and is wrapped in Suspense */}
      <Suspense fallback={<ResultsSkeleton />}>
        <HeavyResults query={deferredQuery} />
      </Suspense>
    </>
  );
}` },
    points: [
      'flushSync() (from react-dom) forces a synchronous update — use it when you must read the DOM immediately after a state update.',
      'Transitions are NOT async — the state update is synchronous. Only the RENDER of that update is deprioritized.',
      'React StrictMode\'s double-invocation helps you find code that breaks when renders are interrupted and restarted.'
    ]
  },

  flowDiagram: {
    title: 'Concurrent priority — urgent vs. transition renders',
    steps: [
      { icon: '⌨️', label: 'User types (urgent)', note: 'Input state update — highest priority' },
      { icon: '⚡', label: 'Input re-renders instantly', note: 'Committed before anything else' },
      { icon: '🔄', label: 'Transition render begins', note: 'Lower priority — interruptible' },
      { icon: '✋', label: 'New urgent input arrives', note: 'Transition interrupted and restarted' },
      { icon: '✅', label: 'Transition commits when settled', note: 'Results appear once typing pauses' }
    ]
  },

  realWorldExamples: {
    intro: 'Concurrent features power the next generation of responsive React UIs:',
    items: [
      { icon: '📝', title: 'Live document editors', description: 'Typing stays perfectly smooth even while a complex document preview re-renders in the background via useTransition.' },
      { icon: '🔍', title: 'Search with rich result cards', description: 'Typing in a search box stays instant; the results panel updates a beat behind via useDeferredValue.' },
      { icon: '📊', title: 'Dashboard tab switching', description: 'Clicking a heavy tab wrapped in useTransition registers instantly (the tab highlights) while the expensive content renders in the background.' },
      { icon: '🌐', title: 'Streaming SSR in Next.js', description: 'Pages wrapped in Suspense boundaries stream HTML progressively as server data resolves — users see content start appearing immediately.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Keeps UI responsive during expensive renders — the biggest improvement in React 18.',
      'Automatic batching reduces renders from async code automatically — no code changes needed.',
      'useTransition and useDeferredValue give fine-grained control over render scheduling.',
      'Enables streaming SSR and progressive hydration — better perceived load performance.'
    ],
    cons: [
      'Requires createRoot() — apps using legacy ReactDOM.render() do not get concurrent features.',
      'Interruptible renders mean impure render functions (side effects during render) break.',
      'StrictMode\'s double invocation is more visible and can confuse developers new to concurrent mode.',
      'Some older third-party libraries may not be compatible with concurrent rendering.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using ReactDOM.render() instead of createRoot() in React 18',
        wrong: `ReactDOM.render(<App />, document.getElementById('root')); // ❌ legacy mode — no concurrent features`,
        right: `import { createRoot } from 'react-dom/client';\ncreateRoot(document.getElementById('root')).render(<App />); // ✅`,
        note: 'ReactDOM.render() runs in legacy mode with no React 18 concurrent features. createRoot() is the entry point for everything concurrent.'
      },
      {
        title: 'Expecting concurrent mode to make slow renders faster',
        note: 'Concurrent mode manages scheduling — it can defer a render, but once it runs, it runs at the same speed. If a component takes 200ms, startTransition makes the UI responsive for those 200ms but the render still takes 200ms. Speed improvements come from useMemo, virtualization, and fewer re-renders.'
      },
      {
        title: 'Putting side effects in the render function',
        note: 'Concurrent rendering can call your component function multiple times and discard results. Side effects in render (fetch, mutations, timers) run multiple times with unpredictable results. With StrictMode enabled, this surfaces immediately as double-invocation. Move all side effects to useEffect.'
      }
    ]
  },

  bestPractices: [
    'Migrate to createRoot() — it is required for all React 18 concurrent features.',
    'Keep render functions strictly pure — concurrent mode may call them multiple times.',
    'Use useTransition for explicit transitions; useDeferredValue for implicitly lagging values — profile first to confirm you need them.',
    'Use automatic batching — you may be able to remove manual batching workarounds after upgrading to React 18.',
    'Enable React StrictMode in development — it is the best early-warning system for concurrent-mode incompatibilities.'
  ],

  interviewQuestions: [
    { q: 'What is the key difference between legacy and concurrent rendering?', a: 'In legacy mode (ReactDOM.render), once React starts a render it runs synchronously to completion — a long render blocks the main thread and freezes the UI. In concurrent mode (createRoot), React can interrupt a render when something more urgent arrives (user input), process the urgent update, then resume or restart the lower-priority work. The UI stays responsive because urgent interactions always take priority.' },
    { q: 'What is automatic batching in React 18?', a: 'Automatic batching groups multiple state updates into a single re-render. In React 17, batching only worked inside synchronous event handlers — updates in setTimeout or Promises each triggered separate renders. In React 18 with createRoot(), ALL state updates are batched automatically regardless of where they are called, reducing renders without any code changes.' },
    { q: 'What does it mean for a render to be "interruptible"?', a: 'React can pause an in-progress low-priority (transition) render when a higher-priority update (user input) arrives. The paused work is discarded and React immediately processes the urgent update. After committing the urgent update, React starts the transition render fresh with the latest state. Urgent interactions always feel instant because they never wait for transition work to finish.' },
    { q: 'How does concurrent rendering change the requirements for component purity?', a: 'Concurrent rendering may call a component\'s render function multiple times and discard intermediate results. Any side effects in the render function will execute multiple times with unpredictable results. Concurrent mode makes "render must be pure" strictly necessary, not just a style preference. Move all side effects to useEffect.' },
    { q: 'Name three React 18+ APIs that expose concurrent rendering capabilities.', a: 'useTransition returns [isPending, startTransition] — mark a state update as non-urgent so React can deprioritize and interrupt its render. useDeferredValue(value) returns a lagging copy of a fast-changing value so expensive consumers can update at their own pace. Automatic batching — state updates from async code are now batched into single renders automatically.' }
  ],

  summary: {
    description: 'Concurrent React 18 changes renders from uninterruptible synchronous work to priority-based, interruptible scheduling — keeping urgent interactions responsive while heavy work runs in the background. Enable it with createRoot(), keep renders pure, and use useTransition, useDeferredValue, and Suspense for the UX-level control concurrent rendering makes possible.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/blog/2022/03/29/react-v18 — the React 18 release post explaining concurrent features and the createRoot migration.' },
    { label: 'Related topics', note: 'See "useTransition" and "useDeferredValue" for the scheduling APIs, "Suspense" for declarative loading, and "Rendering Lifecycle" for the foundational model.' }
  ]
};

export default concurrentFeaturesContent;
