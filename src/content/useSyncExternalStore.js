const useSyncExternalStoreContent = {
  id: 'useSyncExternalStore',
  title: 'useSyncExternalStore Hook',
  icon: '🔌',
  theme: 'cyan',
  tagline: 'Safely read data from outside React — browser APIs, third-party stores, or custom subscriptions.',
  meta: 'Hooks · Advanced',

  whatIsIt: {
    description: [
      'useSyncExternalStore lets you subscribe to a data source that lives OUTSIDE React — browser APIs like window size or online status, or third-party state libraries.',
      'It guarantees that all parts of your UI show the same consistent snapshot of that data, even when React is doing concurrent rendering in the background.'
    ],
    points: [
      'Syntax: const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);',
      'subscribe(callback): register a listener for changes — return an unsubscribe function.',
      'getSnapshot(): return the current value synchronously — must be reference-stable when nothing changed.',
      'getServerSnapshot() (optional): value to use during server-side rendering.'
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
      text: '"Imagine a live news broadcast being edited multiple times before it airs. useSyncExternalStore is the rule: every single version of the segment must show the EXACT SAME snapshot of the news — never a mix of old and new. This prevents the broadcast (your UI) from showing confusing, inconsistent information."'
    }
  },

  whyUsed: {
    description: 'A plain useState + useEffect subscription works most of the time, but React\'s concurrent features can cause different parts of the UI to briefly show different values of the same external data — a bug called "tearing". useSyncExternalStore prevents this.',
    points: [
      'Prevents "tearing" — different parts of the UI showing inconsistent external data.',
      'Used internally by Redux, Zustand, and other popular state libraries.',
      'Handles server rendering via getServerSnapshot — no hydration mismatches.',
      'Replaces fragile useEffect-based subscriptions with a correct, React-endorsed approach.'
    ]
  },

  whenToUse: {
    description: 'This is a low-level, specialized Hook. Most app code never calls it directly — it is mainly for library authors and custom Hooks that bridge React with external data.',
    points: [
      'Subscribing to browser APIs: window size, navigator.onLine, matchMedia, localStorage.',
      'Building React bindings for a state library that lives outside React.',
      'Wrapping a WebSocket, observable, or custom event emitter for use in components.',
      'You are writing a library or low-level custom Hook — not typical feature code.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use it',
      text: '"If your data lives in React state (useState, useReducer, Context), React already guarantees consistency — you do not need this Hook. Reserve useSyncExternalStore specifically for ongoing subscriptions to mutable data that lives genuinely outside React."'
    }
  },

  howItWorks: {
    description: 'You give React three functions: how to subscribe to changes, how to read the current snapshot, and (optionally) a server-side value. React calls getSnapshot on every render and whenever the store notifies it, ensuring all parts of the UI use the exact same snapshot.',
    code: {
      title: 'Building a reusable useWindowWidth Hook',
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
      'getSnapshot must be FAST and reference-stable — returning a new object every call causes an infinite re-render loop.',
      'Cache object/array snapshots and only return a new reference when the data genuinely changed.',
      'Most developers meet this Hook indirectly — as the engine inside Redux, Zustand, and React Router.'
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
    intro: 'You will mostly meet useSyncExternalStore as the engine inside tools you already use:',
    items: [
      { icon: '📚', title: 'State-management libraries', description: 'Zustand, Redux bindings, Jotai, and Valtio use useSyncExternalStore internally to connect their stores to React components safely.' },
      { icon: '🌐', title: 'Browser API Hooks', description: 'useOnlineStatus, useWindowSize, useMediaQuery, useLocalStorageValue — textbook direct use cases for this Hook.' },
      { icon: '🔄', title: 'Real-time data sources', description: 'Wrapping a WebSocket or server-sent-events stream so components subscribe to live updates with guaranteed consistency.' },
      { icon: '🧭', title: 'Routing libraries', description: 'Client-side routers track the current URL as external, mutable state and use this Hook to keep components in sync.' }
    ]
  },

  prosAndCons: {
    pros: [
      'The only Hook that guarantees tear-free reads of external data under concurrent rendering.',
      'Standard integration point — library authors use one correct approach instead of inventing ad-hoc patterns.',
      'Handles server rendering via getServerSnapshot, preventing hydration mismatches.',
      'Once wrapped in a custom Hook, it is as simple to use as any other Hook.'
    ],
    cons: [
      'Low-level API — three callback functions is more ceremony than useState.',
      'getSnapshot must be written carefully — getting it wrong causes infinite loops.',
      'Most app developers will rarely call it directly.',
      'The tearing problem it solves is rare enough that its purpose is easy to under-appreciate.'
    ]
  },

  comparison: {
    title: 'Naive useEffect subscription vs. useSyncExternalStore',
    left: {
      title: '⚠️ useEffect + useState — can "tear"',
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
// observe DIFFERENT values of isOnline during the same render`,
      note: 'Works almost all the time — but can produce rare inconsistencies under concurrent rendering.'
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
// exact same snapshot throughout a given render`,
      note: 'Purpose-built to keep external reads perfectly consistent even when rendering is interrupted.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Returning a new object from getSnapshot on every call',
        wrong: `const getSnapshot = () => ({ width: window.innerWidth, height: window.innerHeight });\n// ❌ new object every call → React thinks the snapshot ALWAYS changed → infinite re-render`,
        right: `let cached = { width: window.innerWidth, height: window.innerHeight };\nconst getSnapshot = () => {\n  const next = { width: window.innerWidth, height: window.innerHeight };\n  if (next.width !== cached.width || next.height !== cached.height) cached = next;\n  return cached; // ✅ stable reference when nothing changed\n};`,
        note: 'React compares snapshot values by reference. A fresh object every call looks like a change every time — causing an infinite re-render loop. Cache and reuse the reference.'
      },
      {
        title: 'Forgetting getServerSnapshot in server-rendered apps',
        wrong: `useSyncExternalStore(subscribe, getSnapshot); // ❌ throws during SSR — no window to read from`,
        right: `useSyncExternalStore(subscribe, getSnapshot, () => defaultValue); // ✅ explicit safe default for SSR`,
        note: 'Browser APIs do not exist on the server. Always provide a sensible default for server-rendered HTML.'
      },
      {
        title: 'Reaching for it when the data already lives in React state',
        note: 'If a value is managed via useState, useReducer, or Context, React already guarantees consistency. Using useSyncExternalStore adds ceremony for no benefit — it solves a problem specific to data that genuinely lives OUTSIDE React.'
      }
    ]
  },

  bestPractices: [
    'Wrap it in a custom Hook (useWindowWidth, useOnlineStatus) — consumers never see subscribe/getSnapshot directly.',
    'Keep getSnapshot fast and free of side effects — it is called frequently, including during render.',
    'Cache object/array snapshots — only create a new reference when the underlying data changes.',
    'Always provide getServerSnapshot for any store read during server-side rendering.',
    'Treat this as a library author tool — for app code, prefer React state (useState/useReducer/Context).'
  ],

  interviewQuestions: [
    { q: 'What problem does useSyncExternalStore solve that useState + useEffect does not?', a: 'It prevents "tearing" — where different parts of the UI show different snapshots of the same external value during a concurrent render. A useEffect subscription cannot give React the guarantees needed to avoid this. useSyncExternalStore is purpose-built so every part of the UI always reflects the exact same snapshot of external data.' },
    { q: 'What three arguments does useSyncExternalStore take?', a: 'subscribe(callback) registers a listener and returns an unsubscribe function. getSnapshot() synchronously returns the current store value and must be reference-stable when nothing changed. getServerSnapshot() (optional) provides the value during server rendering where browser APIs do not exist.' },
    { q: 'Why must getSnapshot return a reference-stable value?', a: 'React compares snapshots using Object.is. If getSnapshot returns a new object on every call even when data has not changed, React treats it as a new value every time — causing an infinite re-render loop. Cache the result and only create a new reference when the underlying values genuinely differ.' },
    { q: 'Who typically needs to call useSyncExternalStore directly?', a: 'Mostly library authors and those building low-level custom Hooks that bridge React with external data sources. Application developers usually meet it indirectly — as the mechanism inside Redux bindings, Zustand, or a useWindowWidth Hook — without calling it directly.' },
    { q: 'Why is getServerSnapshot necessary?', a: 'Server rendering runs without browser APIs. Functions that read from window or navigator would throw on the server. getServerSnapshot lets you provide a safe deterministic default for the initial server-rendered HTML, preventing errors and hydration mismatches.' }
  ],

  summary: {
    description: 'useSyncExternalStore is React\'s low-level primitive for safely subscribing to data outside React — browser APIs, third-party stores, subscriptions — with a guarantee against tearing under concurrent rendering. Wrap it in a custom Hook so consumers never touch the raw API, keep getSnapshot fast and reference-stable, and always supply getServerSnapshot for SSR.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useSyncExternalStore — includes walkthroughs for subscribing to browser APIs and extracting the logic into a custom Hook.' },
    { label: 'Related topic', note: 'See "Custom Hooks" for the wrapping pattern, and "Concurrent Features" for the rendering model that makes its guarantees necessary.' }
  ]
};

export default useSyncExternalStoreContent;
