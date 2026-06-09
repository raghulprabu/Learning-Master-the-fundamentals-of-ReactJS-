const useSyncExternalStoreContent = {
  id: 'useSyncExternalStore',
  title: 'useSyncExternalStore Hook',
  icon: '🔌',
  theme: 'cyan',
  tagline: 'Safely subscribe to data that lives outside React — browser APIs, third-party stores, external libraries.',
  meta: 'Hooks · Advanced',

  whatIsIt: {
    description: [
      'useSyncExternalStore is a Hook for reading and subscribing to a value from a store that lives OUTSIDE React\'s own state system — browser APIs (window size, online status, localStorage), third-party state-management libraries, or any custom subscription-based data source.',
      'It guarantees that, even with React\'s concurrent rendering features, your component never shows a "torn" or inconsistent snapshot of external data — solving a subtle correctness problem that naive useEffect-based subscriptions can suffer from.'
    ],
    points: [
      'Syntax: const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);',
      '`subscribe(callback)`: registers a listener for store changes, and returns an unsubscribe function.',
      '`getSnapshot()`: returns the current value of the store — must return a cached/stable reference if nothing has changed.',
      '`getServerSnapshot()` (optional): provides the initial value during server-side rendering.'
    ],
    code: { title: 'The basic shape', snippet: `const isOnline = useSyncExternalStore(
  // 1) subscribe — register/unregister a listener
  (callback) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  },
  // 2) getSnapshot — read the CURRENT value, synchronously
  () => navigator.onLine,
  // 3) getServerSnapshot — value to use during SSR (optional)
  () => true
);` },
    analogy: {
      icon: '📺',
      title: 'Real-World Analogy',
      text: '"Imagine a newsroom that gets live updates from outside reporters (the external store) while simultaneously preparing a broadcast that might get edited or re-recorded multiple times before airing (React\'s concurrent rendering). useSyncExternalStore is the producer\'s rule: \'No matter how many times we re-cut this segment internally, every single cut must reflect the EXACT SAME snapshot of the news at the moment we started — never a mix of old and new information.\' That\'s what prevents the broadcast (your UI) from showing a jarring, inconsistent mash-up of two different moments in time."'
    }
  },

  whyUsed: {
    description: 'Subscribing to external data with a plain useState + useEffect combo seems to work — until React\'s concurrent features (like useTransition or automatic batching across different priorities) cause your component to render with a MIX of old and new external values across different parts of the UI — a "tearing" bug that\'s notoriously hard to reproduce and debug. useSyncExternalStore was added specifically to give external stores a correct, tear-free way to integrate with concurrent React.',
    points: [
      'Prevents "tearing" — the bug where different parts of the UI briefly show inconsistent snapshots of the same external value during a concurrent render.',
      'Provides a standard, correct integration point for state-management libraries (many popular libraries use it internally for their React bindings).',
      'Handles the server-rendering case explicitly via getServerSnapshot — avoiding hydration mismatches for externally-sourced data.',
      'Replaces ad-hoc useEffect-based subscription patterns with a purpose-built, React-blessed primitive that\'s guaranteed correct under concurrent rendering.'
    ]
  },

  whenToUse: {
    description: 'This is a specialized, low-level Hook — most application code will never call it directly. Reach for it specifically when integrating with a genuinely external, mutable data source.',
    points: [
      'Subscribing directly to browser APIs: window dimensions, navigator.onLine, matchMedia, localStorage changes from other tabs.',
      'Building bindings/adapters for a state-management library that lives outside React\'s own state.',
      'Wrapping a third-party, subscription-based data source (WebSocket connections, observables, custom event emitters) for use in components.',
      'You\'re a LIBRARY AUTHOR providing React integration — not typically something application-level feature code reaches for directly.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use it',
      text: '"If your data lives IN React — useState, useReducer, props, Context — you don\'t need this Hook; React already guarantees consistency for its own state. And if you only need a ONE-TIME read of an external value (not ongoing subscription to changes), a plain useEffect or even a direct read during render may suffice. Reserve useSyncExternalStore specifically for ongoing subscriptions to mutable data that lives genuinely outside React."'
    }
  },

  howItWorks: {
    description: 'You give React three functions: how to subscribe to changes, how to read the current snapshot, and (optionally) what snapshot to use on the server. React calls getSnapshot on every render and whenever the store notifies it of a change (via the subscribe callback), and guarantees the value stays consistent across the entire render — even amid concurrent, interruptible rendering.',
    code: {
      title: 'Building a reusable useWindowWidth on top of it',
      snippet: `function subscribe(callback) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getSnapshot() {
  return window.innerWidth; // must be a primitive or stable reference
}

function getServerSnapshot() {
  return 1024; // a sensible default for server-rendered HTML
}

function useWindowWidth() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Usage — looks just like any other Hook to consumers:
function ResponsiveLayout() {
  const width = useWindowWidth();
  return width < 768 ? <MobileNav /> : <DesktopNav />;
}`
    },
    points: [
      'getSnapshot must be FAST and return a value that is reference-stable when nothing has changed — returning a new object/array every call causes infinite re-render loops.',
      'For object/array snapshots, cache the result and only produce a new reference when the underlying data genuinely changes (many libraries use a small memoization helper for this).',
      'Most developers encounter this Hook indirectly — as the mechanism powering React bindings for libraries like Redux, Zustand, Jotai, and React Router\'s internals.'
    ]
  },

  flowDiagram: {
    title: 'How useSyncExternalStore keeps external data tear-free',
    steps: [
      { icon: '🌐', label: 'External store changes', note: 'e.g. window resizes, store updates' },
      { icon: '📣', label: 'subscribe() callback fires', note: 'Notifies React something changed' },
      { icon: '📸', label: 'getSnapshot() called', note: 'React reads the CURRENT value' },
      { icon: '🔒', label: 'Consistency enforced', note: 'Same snapshot used throughout the render — no tearing' },
      { icon: '🔁', label: 'Component re-renders', note: 'UI reflects the new, consistent value' }
    ]
  },

  realWorldExamples: {
    intro: 'You\'ll most often meet useSyncExternalStore as the engine quietly running underneath tools you already use:',
    items: [
      { icon: '📚', title: 'State-management library bindings', description: 'Libraries like Zustand, Jotai, Redux\'s React bindings, and Valtio use useSyncExternalStore internally to safely connect their external stores to React components.' },
      { icon: '🌐', title: 'Browser API subscriptions', description: 'Custom hooks like useOnlineStatus, useWindowSize, useMediaQuery, or useLocalStorageValue (reacting to changes from OTHER tabs via the "storage" event) are textbook direct use cases.' },
      { icon: '🔄', title: 'Real-time data sources', description: 'Wrapping a WebSocket connection or a server-sent-events stream so components can subscribe to live data updates with guaranteed consistency.' },
      { icon: '🧭', title: 'Routing libraries', description: 'Client-side routers often track the current URL/history as external, mutable state — and use this Hook (or an equivalent pattern) to keep components in sync with it correctly.' }
    ]
  },

  prosAndCons: {
    pros: [
      'The only Hook that GUARANTEES tear-free reads of external, mutable data under React\'s concurrent rendering — a correctness guarantee no other approach provides.',
      'Provides a standard, well-defined integration contract — library authors don\'t need to invent ad-hoc (and possibly subtly-buggy) subscription patterns.',
      'Explicitly handles server-rendering via getServerSnapshot, preventing a whole class of hydration-mismatch bugs.',
      'Once wrapped in a custom Hook (useWindowWidth, useOnlineStatus), it\'s exactly as simple to consume as any other Hook.'
    ],
    cons: [
      'Low-level and somewhat unusual API (three callback functions) — noticeably more ceremony than useState/useEffect for the same conceptual task.',
      'getSnapshot must be written carefully (fast, reference-stable) — getting this wrong causes infinite loops or performance problems.',
      'Most application developers will rarely if ever call it directly — it primarily matters to library authors and those building low-level custom Hooks.',
      'The "tearing" problem it solves is subtle and rare enough that many won\'t encounter it directly — making the Hook\'s purpose easy to under-appreciate until you hit the bug it prevents.'
    ]
  },

  comparison: {
    title: 'Naive useEffect subscription vs. useSyncExternalStore',
    left: {
      title: '⚠️ useEffect + useState — looks fine, can "tear"',
      tone: 'bad',
      code: `function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => { /* remove listeners */ };
  }, []);
  return isOnline;
}
// Under concurrent rendering, different parts of the tree can
// observe DIFFERENT values of isOnline during the same render — "tearing"`,
      note: 'Works correctly almost all the time — but can produce rare, hard-to-reproduce inconsistencies specifically under concurrent rendering.'
    },
    right: {
      title: '✅ useSyncExternalStore — guaranteed consistent',
      tone: 'good',
      code: `function useOnlineStatus() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('online', cb);
      window.addEventListener('offline', cb);
      return () => { /* remove listeners */ };
    },
    () => navigator.onLine,
    () => true // server snapshot
  );
}
// React GUARANTEES every part of the tree sees the
// exact same snapshot throughout a given render — zero tearing`,
      note: 'Purpose-built to give React the information it needs to keep external reads perfectly consistent — even when rendering is interrupted and resumed.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Returning a new object/array from getSnapshot on every call',
        wrong: `const getSnapshot = () => ({ width: window.innerWidth, height: window.innerHeight });\n// ❌ new object every call → React thinks the snapshot ALWAYS changed → infinite re-render loop`,
        right: `let cached = { width: window.innerWidth, height: window.innerHeight };\nconst getSnapshot = () => {\n  const next = { width: window.innerWidth, height: window.innerHeight };\n  if (next.width !== cached.width || next.height !== cached.height) cached = next;\n  return cached; // ✅ stable reference when nothing meaningfully changed\n};`,
        note: 'getSnapshot\'s return value is compared by reference (Object.is) to detect changes. Returning a fresh object/array every time makes React believe something changed on every single call — causing an infinite loop. Cache and reuse the reference when the underlying values are unchanged.'
      },
      {
        title: 'Forgetting getServerSnapshot in apps that use server-side rendering',
        wrong: `useSyncExternalStore(subscribe, getSnapshot); // ❌ throws/warns during SSR — no \`window\` to read from`,
        right: `useSyncExternalStore(subscribe, getSnapshot, () => defaultServerValue); // ✅ explicit, safe initial value for SSR`,
        note: 'Browser-only APIs (window, navigator, localStorage) don\'t exist on the server. Omitting getServerSnapshot in an SSR context causes errors or warnings — always provide a sensible default for the server-rendered HTML.'
      },
      {
        title: 'Reaching for it when the data already lives in React state',
        note: 'If a value is already managed via useState/useReducer/Context, it\'s already guaranteed consistent by React — wrapping it in useSyncExternalStore adds complexity and ceremony for no benefit. This Hook solves a problem specific to data that genuinely lives OUTSIDE React\'s own state system.'
      }
    ]
  },

  bestPractices: [
    'Wrap it in a small custom Hook (useWindowWidth, useOnlineStatus) — consumers should never need to think about subscribe/getSnapshot/getServerSnapshot directly.',
    'Keep getSnapshot fast and side-effect-free — it can be called frequently, including during render.',
    'Cache and reuse object/array snapshot references — only produce a new reference when the underlying data has genuinely changed.',
    'Always provide getServerSnapshot for any store that might be read during server-side rendering — pick a sensible, deterministic default.',
    'Recognize this as a "library author\'s tool" — for application code, prefer React\'s own state (useState/useReducer/Context) whenever the data can reasonably live there instead.'
  ],

  interviewQuestions: [
    { q: 'What problem does useSyncExternalStore solve that a plain useState + useEffect subscription does not?', a: 'It prevents "tearing" — a subtle bug where, under React\'s concurrent rendering features, different parts of a component tree can end up rendering with DIFFERENT snapshots of the same external value during what should be a single, consistent render pass. A naive useEffect-based subscription can\'t give React the guarantees it needs to avoid this; useSyncExternalStore is a purpose-built primitive that DOES provide those guarantees, ensuring every part of the UI reflects the exact same snapshot of external data throughout a render.' },
    { q: 'What three arguments does useSyncExternalStore take, and what does each do?', a: '`subscribe(callback)` registers a listener for changes in the external store and returns an unsubscribe function; `getSnapshot()` synchronously returns the current value of the store (and must return a reference-stable value when nothing has changed); and the optional `getServerSnapshot()` provides the value to use during server-side rendering, where browser-only data sources don\'t exist.' },
    { q: 'Why must getSnapshot return a reference-stable value, and what happens if it doesn\'t?', a: 'React compares successive snapshot values by reference (using Object.is) to determine whether the store has changed and a re-render is needed. If getSnapshot returns a brand-new object or array on every single call — even when the underlying data is identical — React will perceive "a change" on every call, triggering an infinite loop of re-renders. The fix is to cache the snapshot and only produce a new reference when the underlying values genuinely differ.' },
    { q: 'Who typically needs to call useSyncExternalStore directly — application developers or library authors?', a: 'Mostly library authors and those building low-level custom Hooks that bridge React with genuinely external data sources (browser APIs, third-party stores, subscription-based services). Most application-level feature code either uses React\'s own state (useState/useReducer/Context — already guaranteed consistent) or consumes a higher-level custom Hook (useWindowWidth, useOnlineStatus) that wraps useSyncExternalStore internally — without ever needing to call it directly.' },
    { q: 'Why is getServerSnapshot necessary, and what would happen without it in a server-rendered app?', a: 'Server-side rendering happens in an environment without browser-only APIs (no `window`, no `navigator`, no real DOM) — so functions like getSnapshot that read from those APIs would throw or return nonsensical values on the server. getServerSnapshot lets you provide an explicit, deterministic value to use for the initial server-rendered HTML. Without it, React would either throw/warn during SSR, or risk a hydration mismatch between the server-rendered output and what the client subsequently computes.' }
  ],

  summary: {
    description: 'useSyncExternalStore is React\'s purpose-built, low-level primitive for safely subscribing to data that lives outside its own state system — browser APIs, third-party stores, subscription-based services — with a hard guarantee against "tearing" under concurrent rendering. Most developers will meet it indirectly, as the engine inside library bindings and custom Hooks like useWindowWidth or useOnlineStatus; reach for it directly only when building exactly that kind of integration, keep getSnapshot fast and reference-stable, and always supply a getServerSnapshot for SSR.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useSyncExternalStore — the canonical reference, including the "Subscribing to a browser API" and "Extracting the logic to a custom Hook" walkthroughs.' },
    { label: 'Related topic', note: 'See "Custom Hooks" for the wrapping pattern (useWindowWidth, useOnlineStatus) that makes this Hook approachable for everyday use, and "Concurrent Features" for the rendering model that makes its guarantees necessary.' }
  ]
};

export default useSyncExternalStoreContent;
