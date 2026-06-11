const customHooksContent = {
  id: 'customHooks',
  title: 'Custom Hooks',
  icon: '🧪',
  theme: 'teal',
  tagline: 'Custom Hooks let you extract reusable stateful logic into a function that starts with "use".',
  meta: 'Hooks · Patterns',

  whatIsIt: {
    description: [
      'A custom Hook is a JavaScript function whose name starts with "use" and calls other Hooks (useState, useEffect, useContext, etc.) inside it.',
      'Custom Hooks share logic, not state. Two components using the same custom Hook each get their own independent state — as if they wrote the logic by hand.'
    ],
    points: [
      'Name must start with "use" — useFetch, useLocalStorage, useToggle.',
      'It is just a function — no special API or registration needed.',
      'Returns whatever is useful: a value, a [value, setter] pair, or an object.'
    ],
    code: { title: 'Extracting "online status" logic into a custom Hook', snippet: `// Before: this logic is duplicated in every component that needs it
function ChatIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return <span>{isOnline ? '🟢 Online' : '🔴 Offline'}</span>;
}

// After: extract it once, reuse it everywhere
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus(); // 👈 one readable line
  return <span>{isOnline ? '🟢 Online' : '🔴 Offline'}</span>;
}` },
    analogy: {
      icon: '🧰',
      title: 'Real-World Analogy',
      text: '"Custom Hooks are like power tools you build yourself. useState and useEffect are your hammer and screwdriver. A custom Hook like useFetch is like assembling them into a cordless drill — you build it once, give it a clear name, and grab it whenever you need it."'
    }
  },

  whyUsed: {
    description: 'Components often repeat the same stateful logic — fetching data, subscribing to events, debouncing input. Custom Hooks let you write that logic once, name it clearly, and reuse it anywhere.',
    points: [
      'Write stateful logic once and reuse it across many components.',
      'Custom Hooks can call other custom Hooks — compose small focused Hooks.',
      'A component that calls useFetch(url) reads clearly — it hides how.',
      'Test Hook logic in isolation without rendering a full component.'
    ]
  },

  whenToUse: {
    description: 'Extract logic into a custom Hook when you see the same Hook-based code in more than one place — or when it clutters a component so much the rendering logic is hard to see.',
    points: [
      'You copy-paste a useState+useEffect combo from one component to another.',
      'A component body is dominated by subscriptions, timers, or fetches.',
      'You want to give logic a clear name — useWindowSize() is better than 15 inlined lines.',
      'You want to swap an implementation (e.g. polling to WebSockets) in one place.'
    ],
    analogy: {
      icon: '🔀',
      title: 'Custom Hooks vs. plain helper functions',
      text: '"If your reusable logic needs to call Hooks (useState, useEffect), it must be a custom Hook and follow the Rules of Hooks. If it is pure computation with no Hooks (e.g. formatCurrency), it should just be a regular function."'
    }
  },

  howItWorks: {
    description: 'A custom Hook is invoked the same way as a built-in Hook — at the top level of a component or another custom Hook. React tracks state by call order, so the Rules of Hooks apply identically.',
    code: {
      title: 'A practical, composable trio: useDebounce + useFetch',
      snippet: `function useDebounce(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);  // cancel the pending update if value changes again
  }, [value, delayMs]);
  return debounced;
}

function useFetch(url) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    if (!url) return;
    let ignore = false;
    setStatus('loading');
    fetch(url).then(r => r.json()).then(json => {
      if (!ignore) { setData(json); setStatus('success'); }
    }).catch(() => { if (!ignore) setStatus('error'); });
    return () => { ignore = true; }; // avoid setting state on a stale/unmounted request
  }, [url]);

  return { data, status };
}

// Composing them together in a search box — each Hook owns ONE concern
function ProductSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const { data: results, status } = useFetch(
    debouncedQuery ? \`/api/search?q=\${debouncedQuery}\` : null
  );

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" />
      {status === 'loading' && <Spinner />}
      <ResultsList items={results} />
    </>
  );
}`
    },
    points: [
      'Every call site of a custom Hook gets its own independent state.',
      'Custom Hooks re-run on every render of the calling component — no extra lifecycle.',
      'Return an object ({ data, status }) for many named values, an array ([value, setter]) for a simple pair.'
    ]
  },

  flowDiagram: {
    title: 'How logic flows from component → custom Hook → built-in Hooks',
    steps: [
      { icon: '🧩', label: 'Component calls useFetch(url)', note: 'Looks like a single function call' },
      { icon: '🔧', label: 'Custom Hook runs', note: 'Just a normal function, "use"-prefixed' },
      { icon: '⚛️', label: 'Calls useState + useEffect inside', note: 'Built-in Hooks do the real work' },
      { icon: '📦', label: 'Returns { data, status }', note: 'A clean, purpose-built API back to the caller' }
    ]
  },

  realWorldExamples: {
    intro: 'These are the custom Hooks you will reach for again and again in real apps:',
    items: [
      { icon: '🌐', title: 'useFetch(url)', description: 'Encapsulates loading, error, and data state for an API request. The foundation of most data-fetching code.' },
      { icon: '💾', title: 'useLocalStorage(key, initialValue)', description: 'Behaves like useState but automatically saves to and reads from localStorage — perfect for persisting theme or draft text.' },
      { icon: '⏳', title: 'useDebounce(value, delay)', description: 'Returns a settled version of a fast-changing value — the backbone of efficient search-as-you-type features.' },
      { icon: '🔁', title: 'useToggle(initial)', description: 'A simple wrapper around useState for booleans. Returns [value, toggle] — expressive and readable.' },
      { icon: '📐', title: 'useWindowSize()', description: 'Subscribes to window resize events and returns the current size. Powers responsive logic that CSS alone cannot express.' },
      { icon: '📝', title: 'useForm(initialValues)', description: 'Bundles values, change handlers, validation errors, and a submit handler into one clean object.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Write stateful logic once, reuse it anywhere — no duplication.',
      'Each call site gets fully isolated state — no cross-component interference.',
      'Small focused Hooks compose into richer behavior.',
      'Easier to unit-test in isolation than logic tangled inside a component.'
    ],
    cons: [
      'Still bound by the Rules of Hooks — top-level calls only, same order every render.',
      'Over-abstracting too early can hide what is actually happening.',
      'A poorly-designed return shape can make a custom Hook harder to use than inline logic.',
      'Cannot bypass the Rules of Hooks — sometimes requires rethinking component structure.'
    ]
  },

  comparison: {
    title: 'Duplicated logic vs. extracted custom Hook',
    left: {
      title: '😩 Without a custom Hook — copy-pasted everywhere',
      tone: 'bad',
      code: `function ProfilePage() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // ...repeated almost verbatim in SettingsPage, DashboardPage, NavBar...
}`,
      note: 'Every component re-implements the same subscription logic and can diverge subtly over time.'
    },
    right: {
      title: '✅ With useWindowSize() — written once, used everywhere',
      tone: 'good',
      code: `function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

function ProfilePage() {
  const width = useWindowSize(); // 👈 one expressive line, fully tested elsewhere
}`,
      note: 'One implementation to fix or extend — every consumer benefits automatically.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Forgetting the "use" prefix',
        wrong: `function fetchData(url) { // ❌ doesn't start with "use" — eslint-plugin-react-hooks won't check it,\n  const [data, setData] = useState(null);   //    and readers won't realize it uses Hooks\n  useEffect(() => { /* ... */ }, [url]);\n  return data;\n}`,
        right: `function useFetchData(url) { // ✅ "use" prefix — the linter enforces the Rules of Hooks here too\n  const [data, setData] = useState(null);\n  useEffect(() => { /* ... */ }, [url]);\n  return data;\n}`,
        note: 'The "use" prefix is how React\'s ESLint plugin recognizes the function as a Hook and checks it for Rules-of-Hooks violations.'
      },
      {
        title: 'Thinking custom Hooks share state between components',
        note: 'Calling the same custom Hook in two different components gives each its own independent state. If you need to share state across components, lift it up or use Context.'
      },
      {
        title: 'Breaking the Rules of Hooks inside a custom Hook',
        wrong: `function useFeature(flag) {\n  if (flag) {\n    const [on, setOn] = useState(false); // ❌ conditional Hook call\n  }\n}`,
        right: `function useFeature(flag) {\n  const [on, setOn] = useState(false); // ✅ always called, same order every render\n  if (!flag) return null;\n  return on;\n}`,
        note: 'Custom Hooks follow the same Rules of Hooks: only call Hooks at the top level, never inside conditionals or loops.'
      }
    ]
  },

  bestPractices: [
    'Always start the name with "use" — it signals this follows the Rules of Hooks.',
    'Give each custom Hook one clear responsibility — compose small Hooks together.',
    'Use arrays ([value, setter]) for symmetric pairs, objects ({ data, status }) for many named values.',
    'Write custom Hooks to work the same wherever they are called — no hidden assumptions.',
    'Test custom Hooks in isolation with renderHook from React Testing Library.'
  ],

  interviewQuestions: [
    { q: 'What is a custom Hook, and what makes it different from a regular helper function?', a: 'A custom Hook is a JavaScript function named with "use" that calls other Hooks inside it. The "use" prefix signals that it follows the Rules of Hooks. A regular helper function does not call Hooks — it is pure computation.' },
    { q: 'If two components use the same custom Hook, do they share state?', a: 'No. Each call site gets its own independent state. Calling useFetch in ComponentA and ComponentB creates two separate sets of state. Custom Hooks share logic, not state. To share actual state, use Context or lift state up.' },
    { q: 'Are custom Hooks bound by the Rules of Hooks?', a: 'Yes, identically to built-in Hooks. They may only be called at the top level — never inside loops, conditions, or nested functions. React tracks state by call order, and this consistency is what makes it work correctly.' },
    { q: 'How do you decide whether to return an array or an object from a custom Hook?', a: 'Arrays work well for small symmetric pairs where callers want to rename values — like useState\'s [value, setValue]. Objects work better when there are several named values — like { data, status, error, refetch }.' },
    { q: 'When would you extract logic into a custom Hook vs. leaving it inline?', a: 'Extract it when the same Hook-based logic appears in more than one component, or when it clutters a component so much that the rendering logic is hard to see. If the logic does not call any Hooks, keep it as a regular function.' }
  ],

  summary: {
    description: 'A custom Hook is a "use"-prefixed function that calls other Hooks — a way to extract and reuse stateful logic without duplicating it. They follow the same Rules of Hooks, compose well, and turn tangled component bodies into clear one-liners.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/reusing-logic-with-custom-hooks — the canonical walkthrough with the useOnlineStatus example and guidance on naming and design.' },
    { label: 'Related topic', note: 'See "Debouncing in React" for a full deep-dive on building and using a useDebounce custom Hook.' }
  ]
};

export default customHooksContent;
