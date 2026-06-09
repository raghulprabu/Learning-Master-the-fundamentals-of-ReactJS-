const customHooksContent = {
  id: 'customHooks',
  title: 'Custom Hooks',
  icon: '🧪',
  theme: 'teal',
  tagline: 'Extract your own reusable, stateful logic into plain functions whose names start with "use".',
  meta: 'Hooks · Patterns',

  whatIsIt: {
    description: [
      'A custom Hook is simply a JavaScript function whose name starts with "use" and that calls other Hooks (useState, useEffect, useContext, etc.) inside it. It lets you extract component logic — especially *stateful* logic involving Hooks — into a reusable, named, testable unit.',
      'Custom Hooks share *logic*, not state itself. Two components using the same custom Hook get their own, completely independent state — exactly as if they\'d each written that logic by hand inside a useState/useEffect pair.'
    ],
    points: [
      'Naming convention: must start with "use" (useFetch, useLocalStorage, useToggle) — this is how React\'s linter knows to check it follows the Rules of Hooks.',
      'Under the hood, it\'s "just a function" — no special API, no registration; you build it entirely from Hooks you already know.',
      'It returns whatever is useful to its callers: a value, a [value, setter] pair, an object of values and functions — your choice, like designing any function\'s API.'
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
      text: '"Custom Hooks are like power tools you build yourself out of basic tools. useState and useEffect are your hammer and screwdriver — universally useful, but generic. A custom Hook like useFetch is like assembling those into a cordless drill: you build it once, give it a clear purpose and a simple trigger (a function call), and from then on you just grab the drill — you don\'t re-explain how torque and screws work every time you need to hang a picture."'
    }
  },

  whyUsed: {
    description: 'Components often contain repeated, intertwined stateful logic — fetching data, subscribing to events, syncing with localStorage, debouncing input. Copy-pasting that logic between components duplicates bugs and makes future changes painful. Custom Hooks let you name that logic, write it once, test it in isolation, and reuse it anywhere — turning "a tangle of useState/useEffect" into a clean, expressive one-liner.',
    points: [
      'DRY: write a piece of stateful logic once, use it in as many components as you like.',
      'Composability: custom Hooks can call other custom Hooks, building up rich behavior from small, focused pieces.',
      'Readability: a component that calls useFetch(url) and useDebounce(value, 300) reads like a clear list of *what it does*, hiding *how*.',
      'Testability: you can test a custom Hook\'s logic in isolation (e.g. with @testing-library/react-hooks / renderHook) without rendering a full component tree.'
    ]
  },

  whenToUse: {
    description: 'Reach for a custom Hook the moment you notice the same Hook-based logic showing up in more than one place — or even in just one place where extracting it would make the component dramatically easier to read.',
    points: [
      'You copy-paste a useState+useEffect combo (or similar) from one component to another.',
      'A component\'s body is dominated by "plumbing" (subscriptions, timers, fetches) that obscures its actual rendering logic.',
       'You want to give a piece of logic a clear, descriptive name — useWindowSize() communicates intent far better than 15 inlined lines ever could.',
      'You want to swap an implementation detail (e.g. switch from polling to WebSockets) in one place without touching every component that uses it.'
    ],
    analogy: {
      icon: '🔀',
      title: 'Custom Hooks vs. plain helper functions',
      text: '"If your reusable logic needs to call other Hooks (useState, useEffect, useContext...) — i.e. it needs to \'hook into\' React\'s state and lifecycle — it must be a custom Hook (and follow the Rules of Hooks). If it\'s pure computation with no Hooks involved (e.g. formatCurrency(amount)), it should just be a regular function — wrapping it in \'use…\' would be misleading and add pointless overhead."'
    }
  },

  howItWorks: {
    description: 'A custom Hook is invoked the same way as a built-in Hook — at the top level of a component (or another custom Hook), never inside loops/conditions/nested functions. React tracks each Hook call\'s state by *call order*, so the Rules of Hooks apply identically to custom Hooks: they\'re what makes the "magic" of useState reliably return the right state on every render.',
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
      'Every call site of a custom Hook gets its own, fully independent state — calling useFetch in two components creates two separate `data`/`status` pairs.',
      'Custom Hooks re-run their internal Hooks on every render of the calling component, exactly like inlined Hooks would — there\'s no "extra" lifecycle to learn.',
      'Returning an object ({ data, status }) vs. an array ([value, setValue]) is a design choice — arrays are great for "rename freely" pairs (mirroring useState), objects are better when there are many/optional named values.'
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
    intro: 'These are the custom Hooks you\'ll reach for — or build — again and again in real apps:',
    items: [
      { icon: '🌐', title: 'useFetch(url) / useQuery(url)', description: 'Encapsulates loading/error/data state and cleanup for an API request — the foundation of most data-fetching code before reaching for a library like React Query.' },
      { icon: '💾', title: 'useLocalStorage(key, initialValue)', description: 'Behaves like useState but automatically persists to (and rehydrates from) localStorage — perfect for remembering theme, draft text, or sidebar collapsed state across reloads.' },
      { icon: '⏳', title: 'useDebounce(value, delay)', description: 'Returns a "settled" version of a fast-changing value after it stops changing for `delay` ms — the backbone of efficient search-as-you-type and auto-suggestion features.' },
      { icon: '🔁', title: 'useToggle(initial) / useBoolean', description: 'A tiny, expressive wrapper around useState for booleans — returns [value, toggle] so call sites read as plain English: const [isOpen, toggleOpen] = useToggle(false).' },
      { icon: '📐', title: 'useWindowSize() / useMediaQuery(query)', description: 'Subscribes to window resize/matchMedia events and returns the current size or a boolean — powers responsive logic that CSS alone can\'t express (e.g. conditionally rendering a different component on mobile).' },
      { icon: '📝', title: 'useForm(initialValues)', description: 'Bundles values, change handlers, validation errors, and a submit handler into one cohesive object — the seed of most hand-rolled form libraries.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Eliminates duplicated stateful logic — write it once, name it clearly, reuse it anywhere.',
      'Each call site gets fully isolated state — no risk of accidental cross-component interference.',
      'Composable: small, focused custom Hooks combine into richer behavior (useDebounce + useFetch above).',
      'Encapsulates implementation details behind a clean API — swap polling for WebSockets without touching consumers.',
      'Easier to unit-test in isolation than logic tangled inside a component\'s JSX.'
    ],
    cons: [
      'Still bound by the Rules of Hooks — top-level calls only, same order every render; this can surprise newcomers.',
      'Over-abstracting too early can hide what\'s actually happening, making debugging harder ("where does this state actually live?").',
      'A poorly-designed return shape (too many positional array values, inconsistent naming) can make a custom Hook harder to use than the inlined logic it replaced.',
      'Custom Hooks can call other Hooks conditionally-*looking* code paths only by restructuring — they can\'t bypass the Rules of Hooks, which sometimes requires real thought about component structure.'
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
      note: 'Every component that needs window width re-implements (and can subtly diverge from) the same subscription logic.'
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
      note: 'One implementation to fix, optimize, or extend — every consumer benefits automatically and uniformly.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Forgetting the "use" prefix',
        wrong: `function fetchData(url) { // ❌ doesn't start with "use" — eslint-plugin-react-hooks won't check it,\n  const [data, setData] = useState(null);   //    and readers won't realize it uses Hooks / follows Hook rules\n  useEffect(() => { /* ... */ }, [url]);\n  return data;\n}`,
        right: `function useFetchData(url) { // ✅ "use" prefix — the linter enforces the Rules of Hooks here too\n  const [data, setData] = useState(null);\n  useEffect(() => { /* ... */ }, [url]);\n  return data;\n}`,
        note: 'The "use" prefix isn\'t just a style nicety — it\'s how React\'s ESLint plugin recognizes the function as a Hook and checks it for Rules-of-Hooks violations. Skipping it disables that safety net.'
      },
      {
        title: 'Thinking custom Hooks share state between components',
        note: 'Calling the same custom Hook in two different components gives each one its OWN, independent state — exactly like two separate useState calls would. If you actually need to *share* state across components, that\'s a job for lifting state up or Context — a custom Hook alone won\'t do it (though it can be built on top of useContext to expose shared state conveniently).'
      },
      {
        title: 'Breaking the Rules of Hooks inside a custom Hook',
        wrong: `function useFeature(flag) {\n  if (flag) {\n    const [on, setOn] = useState(false); // ❌ conditional Hook call — breaks call-order tracking\n  }\n}`,
        right: `function useFeature(flag) {\n  const [on, setOn] = useState(false); // ✅ always called, same order every render\n  if (!flag) return null;\n  return on;\n}`,
        note: 'Custom Hooks are bound by the exact same Rules of Hooks as components: only call Hooks at the top level, never inside conditionals, loops, or nested functions — React relies on consistent call order to match state to the right useState call.'
      }
    ]
  },

  bestPractices: [
    'Always start the name with "use" — it signals "this follows the Rules of Hooks" to both readers and the linter.',
    'Give each custom Hook ONE clear responsibility (useDebounce, useFetch) — compose small Hooks together rather than building one giant do-everything Hook.',
    'Design the return value for the calling code\'s readability: arrays ([value, setValue]) for symmetric pairs, objects ({ data, status, refetch }) for many/optional named values.',
    'Write custom Hooks to be agnostic of any specific component — they should work the same wherever they\'re called, with no hidden assumptions about the caller\'s structure.',
    'Test custom Hooks in isolation (e.g. React Testing Library\'s renderHook) — their logic is exactly the kind of thing that benefits from focused unit tests.'
  ],

  interviewQuestions: [
    { q: 'What is a custom Hook, and what makes it different from a regular helper function?', a: 'A custom Hook is a JavaScript function — by convention named starting with "use" — that calls other Hooks (useState, useEffect, useContext, etc.) inside it, letting you extract and reuse stateful, Hook-based logic. The "use" prefix is what distinguishes it from a regular helper function: it signals to React\'s linter and to other developers that the function follows (and must follow) the Rules of Hooks, and that it "hooks into" React\'s state/lifecycle rather than being pure computation.' },
    { q: 'If two different components use the same custom Hook, do they share state?', a: 'No — each call site gets its own, fully independent instance of whatever state the Hook manages internally. Calling useFetch(url) in ComponentA and ComponentB creates two separate useState/useEffect pairs under the hood, just as if each component had written that logic inline. Custom Hooks let you reuse *logic*, not *state* — sharing actual state requires lifting it up or using Context.' },
    { q: 'Are custom Hooks bound by the Rules of Hooks?', a: 'Yes, identically to built-in Hooks and components: they may only be called at the top level (never inside loops, conditions, or nested functions/callbacks), and only from React function components or other custom Hooks. This consistency is what lets React reliably match each useState/useEffect call to the right piece of internal state across renders, by tracking call order.' },
    { q: 'How would you decide what a custom Hook should return — an array or an object?', a: 'Arrays (like useState\'s [value, setValue]) work well for small, symmetric pairs where callers commonly want to rename both values via destructuring — e.g. const [isOpen, toggleOpen] = useToggle(false). Objects work better when there are several values, some optional, or where names carry meaning that shouldn\'t be lost — e.g. const { data, status, error, refetch } = useFetch(url). The choice is purely an API design decision, same as designing any function\'s return value.' },
    { q: 'Give an example of when you would extract logic into a custom Hook versus leaving it inline.', a: 'Extract it once you notice the same Hook-based logic (a useState+useEffect combo for window resize, online status, debouncing, data fetching) appearing in more than one component — or even appearing once but cluttering a component\'s body so much that its actual rendering logic is hard to see. If the logic doesn\'t call any Hooks (e.g. pure formatting/calculation), it should remain a plain function rather than a "use…"-prefixed Hook, since wrapping it would be misleading and add no benefit.' }
  ],

  summary: {
    description: 'A custom Hook is just a "use"-prefixed function that calls other Hooks — a way to name, extract, and reuse stateful logic across components without duplicating it or sharing state unintentionally. They\'re bound by the same Rules of Hooks as everything else, compose beautifully (useDebounce + useFetch), and turn tangled component bodies into clear, expressive one-liners. When you catch yourself copy-pasting a useState/useEffect combo, that\'s your cue to extract a custom Hook.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/reusing-logic-with-custom-hooks — the canonical walkthrough, including the useOnlineStatus example and guidance on naming and designing custom Hook APIs.' },
    { label: 'Related topic', note: 'See "Debouncing in React" for a full deep-dive on building and using a useDebounce custom Hook in a real search experience.' }
  ]
};

export default customHooksContent;
