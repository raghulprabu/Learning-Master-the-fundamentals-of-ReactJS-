const concurrentFeaturesContent = {
  id: 'concurrentFeatures',
  title: 'Concurrent Features',
  icon: '🌀',
  theme: 'violet',
  tagline: 'React 18\'s concurrent rendering engine — interruptible renders, automatic batching, and the Hooks that expose it.',
  meta: 'Concepts · Modern React',

  whatIsIt: {
    description: [
      'React\'s concurrent rendering mode (introduced in React 18) changes how React schedules and executes renders. Instead of every update being completed synchronously from start to finish, React can now start a render, pause it, continue other work, and resume — keeping the UI responsive even during expensive renders.',
      'Concurrent features include: automatic batching (multiple state updates → one render), useTransition (mark updates as non-urgent), useDeferredValue (defer a fast-changing value), Suspense for data (show loading states declaratively), and streaming SSR with Server Components.'
    ],
    points: [
      'Concurrent rendering is opt-in at the root: ReactDOM.createRoot() enables it; ReactDOM.render() (legacy) does not.',
      'Key concept: React can now INTERRUPT and DISCARD an in-progress render when something more urgent arrives — no longer "once React starts a render, it can\'t stop".',
      'Automatic batching: state updates in async code (setTimeout, Promises) are now batched in React 18 — previously they each triggered a separate render.',
      'The "use" Hook (React 19) and Server Components build further on the concurrent model.'
    ],
    code: { title: 'Opting into concurrent mode + automatic batching demo', snippet: `// 1. Enable concurrent mode (replaces ReactDOM.render in React 18+)
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
      text: '"Old React was like a chef who would start chopping an entire bag of onions and refuse to take any other orders until every last onion was chopped — the kitchen freezes. Concurrent React is a chef who pauses the onion-chopping immediately when an urgent \'table needs drinks\' request arrives, handles the urgent thing, then comes back to the onions right where they left off. The same work gets done, but urgent requests are never kept waiting."'
    }
  },

  whyUsed: {
    description: 'Before concurrent rendering, any expensive synchronous render could freeze the browser\'s main thread — making buttons unresponsive, inputs laggy, and animations janky. Concurrent mode gives React the ability to prioritize work, keeping the UI responsive even during heavy rendering tasks.',
    points: [
      'Prevents UI freezes from expensive synchronous renders — React can pause and prioritize urgent interactions.',
      'Automatic batching reduces unnecessary re-renders from async code — fewer renders, better performance.',
      'useTransition + useDeferredValue let developers explicitly mark "this update can wait" for better UX control.',
      'Enables streaming SSR — server-rendered pages can start streaming HTML before all data is ready.'
    ]
  },

  whenToUse: {
    description: 'Concurrent mode is enabled at the root for all React 18 apps using createRoot(). The specific concurrent APIs are opt-in within your app.',
    points: [
      'useTransition: expensive state updates (tab switching, heavy filters) that should be deprioritized vs. urgent input.',
      'useDeferredValue: fast-changing values (search queries) feeding expensive child renders that should "lag behind" gracefully.',
      'Suspense for data: declarative loading states — requires a Suspense-compatible data library or framework.',
      'Streaming SSR: Next.js App Router + Server Components use this automatically.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'Concurrent mode ≠ automatically faster',
      text: '"Concurrent rendering changes HOW React schedules work — it doesn\'t make any individual render faster. A component that takes 200ms to render still takes 200ms; concurrent mode just ensures that 200ms render doesn\'t freeze the input field. For actual speed improvements, you still need useMemo, virtualization, and algorithmic optimizations — concurrent mode layers prioritization on top of those."'
    }
  },

  howItWorks: {
    description: 'React 18\'s scheduler assigns different priorities to different updates. User-input events (typing, clicking) are "urgent" and must render synchronously. State updates wrapped in startTransition are "transition" priority — lower priority, interruptible, and can be abandoned if a newer urgent update comes in. React interleaves these priorities using the browser\'s idle callback / scheduler to keep the main thread free for urgent work.',
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
      'flushSync() (from react-dom) is an escape hatch to force a synchronous, non-batched update — use it in situations where you must read the DOM immediately after a state update.',
      'Transitions are NOT async — the state update itself is synchronous; it\'s the RENDER of that update that\'s deprioritized and interruptible.',
      'React Strict Mode\'s double-invocation behavior is specifically designed to help you find code that breaks when renders are interrupted/restarted — a prerequisite for safely using concurrent features.'
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
      { icon: '📝', title: 'Live document editors', description: 'Typing must remain perfectly smooth even while a complex document preview re-renders in the background — useTransition keeps the typing urgent while the preview is a transition.' },
      { icon: '🔍', title: 'Search with rich result cards', description: 'Typing in a search box stays instant; the results panel below updates a beat behind via useDeferredValue, preventing every keystroke from triggering a heavy re-render.' },
      { icon: '📊', title: 'Dashboard tab switching', description: 'Clicking a tab that renders a complex dashboard is wrapped in useTransition — the click registers instantly (the tab highlights), while the expensive content renders in the background.' },
      { icon: '🌐', title: 'Streaming SSR in Next.js App Router', description: 'Pages wrapped in Suspense boundaries stream their HTML progressively as server data resolves — users see content start appearing immediately rather than waiting for all data.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Keeps UI responsive during expensive renders — the most impactful architectural improvement in React 18.',
      'Automatic batching reduces renders from async code automatically — no code changes needed.',
      'Prioritization APIs (useTransition, useDeferredValue) give fine-grained control over render scheduling.',
      'Enables streaming SSR and progressive hydration — dramatically better perceived load performance.'
    ],
    cons: [
      'Opt-in via createRoot() — apps using legacy ReactDOM.render() don\'t get concurrent features without migration.',
      'The render phase being interruptible means impure renders (side effects in render) break — requires strict purity.',
      'StrictMode\'s double-invocation is more visible and can confuse developers new to concurrent mode.',
      'Some third-party libraries were not written with concurrent mode in mind and may have subtle issues — check for compatibility.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using ReactDOM.render() instead of createRoot() in React 18',
        wrong: `ReactDOM.render(<App />, document.getElementById('root')); // ❌ legacy mode — no concurrent features`,
        right: `import { createRoot } from 'react-dom/client';\ncreatRoot(document.getElementById('root')).render(<App />); // ✅ concurrent mode enabled`,
        note: 'ReactDOM.render() runs in legacy mode and doesn\'t enable React 18\'s concurrent features (automatic batching, useTransition, etc.). createRoot() is the entry point for all React 18 concurrent features.'
      },
      {
        title: 'Expecting concurrent mode to make slow renders fast',
        note: 'Concurrent mode manages SCHEDULING — it can interrupt a render and defer it, but once it runs, it runs at the same speed as before. If a component takes 200ms to render synchronously, wrapping its state update in startTransition makes the UI RESPONSIVE for those 200ms, but the render itself still takes 200ms. Actual speed improvements come from useMemo, virtualization, fewer components rendering, etc.'
      },
      {
        title: 'Putting side effects in the render function in a concurrent app',
        note: 'Concurrent rendering can call your component function multiple times (and discard intermediate results). Side effects in the render function (fetch, mutations, timers) will run multiple times with unexpected results. With StrictMode enabled (the default in React 18 development), this surfaces immediately — treat any double-invocation as the bug it is, and move all side effects to useEffect.'
      }
    ]
  },

  bestPractices: [
    'Migrate to createRoot() — it\'s the prerequisite for all React 18 concurrent features and the new default.',
    'Keep render functions strictly pure — concurrent mode may invoke them multiple times; side effects must live in effects.',
    'Use useTransition for explicit transitions, useDeferredValue for implicitly "lagging behind" values — start with profiling to confirm you actually need them.',
    'Leverage automatic batching — you may find you can remove manual batching workarounds (unstable_batchedUpdates) after upgrading to React 18.',
    'Enable React.StrictMode in development — it\'s the best early-warning system for code that\'s incompatible with concurrent rendering.'
  ],

  interviewQuestions: [
    { q: 'What is the key difference between legacy React rendering and concurrent rendering?', a: 'In legacy mode (ReactDOM.render), once React starts a render it runs synchronously to completion — a long render blocks the main thread, making the UI unresponsive. In concurrent mode (createRoot), React can interrupt a render in progress if a higher-priority update arrives (user input), work on the urgent update first, and then resume or restart the interrupted work. The UI stays responsive because urgent interactions always take priority.' },
    { q: 'What is automatic batching in React 18, and what changed from React 17?', a: 'Automatic batching groups multiple state updates into a single re-render, preventing unnecessary intermediate renders. In React 17, batching only happened for updates in synchronous event handlers — updates inside setTimeout, Promises, or async code each triggered their own render. In React 18 with createRoot(), ALL state updates are batched automatically regardless of where they originate — reducing renders from async code significantly without any code changes.' },
    { q: 'What does it mean for a render to be "interruptible" in concurrent mode?', a: 'React can pause an in-progress low-priority (transition) render when a higher-priority update (like user input) arrives. The paused render work is discarded and React immediately processes the urgent update first. After committing the urgent update, React starts the transition render fresh with the latest state. This ensures urgent interactions always feel instant, at the cost of transition work occasionally being "thrown away and redone" — which is acceptable because the result of the most recent input is always what matters.' },
    { q: 'How does concurrent rendering change the requirements for component purity?', a: 'Concurrent rendering may call a component\'s render function multiple times (to test if a scheduled interrupt will produce the right result) and discard intermediate results. Any side effects in the render function (fetch calls, DOM mutations, subscriptions, writing to refs/variables outside React) will execute multiple times with unpredictable ordering and results. Concurrent mode makes the "render must be pure" rule strictly necessary, not just stylistically preferred.' },
    { q: 'Name three specific React 18+ APIs that surface concurrent rendering capabilities to developers.', a: 'useTransition([isPending, startTransition]): lets you mark a state update as non-urgent so React can deprioritize and interrupt its render in favor of urgent updates, with a built-in isPending flag for loading UI. useDeferredValue(value): returns a "lagging behind" version of a fast-changing value, letting an expensive consumer render at its own pace. Automatic batching: state updates from async code (setTimeout, Promises) are now automatically batched into single renders, previously requiring manual workarounds.' }
  ],

  summary: {
    description: 'Concurrent React 18 fundamentally changes how renders are scheduled — from an uninterruptible synchronous guarantee to a priority-based, interruptible system that keeps urgent interactions responsive while expensive work happens in the background. Enable it with createRoot(), keep renders pure, and leverage useTransition/useDeferredValue/Suspense for the UX-level control concurrent rendering makes possible.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/blog/2022/03/29/react-v18 — the React 18 release post explaining concurrent features, automatic batching, and the createRoot migration.' },
    { label: 'Related topics', note: 'See "useTransition" and "useDeferredValue" for the scheduling-control APIs, "Suspense" for declarative loading states, and "Rendering Lifecycle" for the foundational model concurrent rendering builds on.' }
  ]
};

export default concurrentFeaturesContent;
