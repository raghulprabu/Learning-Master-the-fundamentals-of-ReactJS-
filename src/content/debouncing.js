const debouncingContent = {
  id: 'debouncing',
  title: 'Debouncing in React',
  icon: '⏳',
  theme: 'orange',
  tagline: 'Debouncing waits for the user to stop typing before reacting — turning many fast events into one.',
  meta: 'Patterns · Performance · Worked Example',

  whatIsIt: {
    description: [
      'Debouncing delays running a function until a burst of events has stopped for a set amount of time. Each new event resets the timer — so the function only runs once the user has paused.',
      'In React, debouncing most commonly wraps a search input so that an API call or heavy filter only runs after the user stops typing, not on every single keystroke.'
    ],
    points: [
      'Core idea: "wait until things go quiet, then act — restart the wait if something new happens".',
      'Implemented with setTimeout + clearTimeout — each new event clears the previous timer.',
      'The result updates far less often than the raw input — typically once per pause.'
    ],
    code: { title: 'The problem, in one picture', snippet: `User types: "r" "re" "rea" "reac" "react"
                ⏱     ⏱     ⏱      ⏱       ⏱
Without debounce → 5 API calls fired (one per keystroke, mostly wasted)
With debounce    → only the LAST one survives, after a short pause
                   "react" → 🔍 1 API call, 350ms after the last keystroke` },
    analogy: {
      icon: '🛗',
      title: 'Real-World Analogy',
      text: '"Think of an elevator door. Every time someone presses the button, the close timer resets. The door does not close the instant the first person arrives. It waits until nobody has pressed the button for a few seconds. Debouncing does the same thing for your code."'
    }
  },

  whyUsed: {
    description: 'Typing in a search box can fire 5-10 events per second. Reacting to every single one wastes resources and produces a worse experience than reacting to the settled result.',
    points: [
      'Prevents an API request on every keystroke — one search triggers one request, not five.',
      'Reduces unnecessary re-renders and expensive computations.',
      'Improves perceived performance and reduces server load.',
      'Produces a smoother UX — results settle once the user pauses.'
    ]
  },

  whenToUse: {
    description: 'Use debouncing when a rapid stream of events should produce just one meaningful reaction — once things calm down.',
    points: [
      'Search-as-you-type and autocomplete boxes that query an API.',
      'Async form field validation — checking if a username is available.',
      'Window resize or scroll handlers that recompute layout.',
      'Auto-save drafts — save once after the user stops typing.'
    ],
    analogy: {
      icon: '🆚',
      title: 'Debounce vs. Throttle — do not confuse them',
      text: '"Debounce says \'wait until the user STOPS, then act once\'. Throttle says \'act at most once every N milliseconds\'. Search box → debounce. Scroll position tracking → throttle."'
    }
  },

  howItWorks: {
    description: 'A debounce tracks a pending timer. When the input changes, it cancels any timer still waiting and starts a new one. Only if the full delay passes without interruption does the timer fire and the settled value take effect.',
    code: {
      title: 'A reusable useDebounce custom Hook',
      snippet: `function useDebounce(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Schedule the update for AFTER the pause
    const timerId = setTimeout(() => setDebouncedValue(value), delayMs);

    // 🔑 The cleanup function runs before the NEXT effect (i.e. on every
    // new keystroke) — cancelling the stale timer so only the last one survives
    return () => clearTimeout(timerId);
  }, [value, delayMs]);

  return debouncedValue;
}

// Usage in a live search box:
function ProductSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400); // 👈 settles 400ms after typing stops

  useEffect(() => {
    if (!debouncedQuery) return;
    let ignore = false;
    fetch(\`/api/products?q=\${debouncedQuery}\`)
      .then(r => r.json())
      .then(data => { if (!ignore) setResults(data); });
    return () => { ignore = true; };
  }, [debouncedQuery]); // 👈 fires ONCE per pause, not once per keystroke

  return <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" />;
}`
    },
    points: [
      'The key trick is the cleanup function — React runs it before the next effect, cancelling the pending timer.',
      'Only the very last scheduled timer in a burst survives — every earlier one gets cleared.',
      'Separating the debounced value from the side effect keeps each concern small and testable.'
    ]
  },

  flowDiagram: {
    title: 'The debounce lifecycle, keystroke by keystroke',
    steps: [
      { icon: '⌨️', label: 'User types "r"', note: 'Timer #1 scheduled (400ms)' },
      { icon: '✋', label: 'User types "e" (50ms later)', note: 'Timer #1 cancelled, Timer #2 scheduled' },
      { icon: '✋', label: 'User types "a", "c", "t"…', note: 'Each keystroke cancels the previous timer' },
      { icon: '🤫', label: 'User pauses for 400ms', note: 'No new keystroke arrives in time' },
      { icon: '✅', label: 'Final timer fires', note: 'debouncedValue = "react" → 1 API call' }
    ]
  },

  realWorldExamples: {
    intro: 'Debouncing powers some of the most common UX details in production apps:',
    items: [
      { icon: '🔍', title: 'Live search and auto-suggestion', description: 'GitHub, e-commerce search, Google — all wait for a brief pause before querying instead of firing on every keystroke.', code: `const debouncedQuery = useDebounce(query, 350);\nuseEffect(() => { if (debouncedQuery) fetchSuggestions(debouncedQuery); }, [debouncedQuery]);` },
      { icon: '✅', title: 'Async username availability checks', description: 'Sign-up forms that show "Username available" debounce the server check — hitting it only once the user pauses.' },
      { icon: '💾', title: 'Auto-save drafts', description: 'Google Docs, Notion, and comment boxes save a draft about 1-2 seconds after you stop typing.' },
      { icon: '📐', title: 'Resize-triggered layout recalculation', description: 'Recomputing chart dimensions after resizing — debounced so the expensive recalculation runs once, not 60 times per second.' },
      { icon: '🎚️', title: 'Range sliders and live filters', description: 'A price slider that filters a product grid waits for the user to stop dragging before re-querying.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Dramatically cuts the number of API calls — from dozens down to one per burst.',
      'Reduces server load and API costs at scale.',
      'Improves perceived smoothness — results update once with a meaningful result.',
      'Simple to reuse via a small useDebounce custom Hook.'
    ],
    cons: [
      'Introduces a deliberate delay — too high feels sluggish, too low loses the benefit.',
      'Adds complexity (timers, cleanup) that must be handled correctly.',
      'Not right for every fast-event scenario — continuous feedback usually wants throttling.',
      'Can feel surprising to users who expect instant feedback.'
    ]
  },

  comparison: {
    title: 'Without debounce vs. with debounce — the same search box',
    intro: 'Typing "react" (5 keystrokes) into a live-search input:',
    left: {
      title: '😵 Without debounce',
      tone: 'bad',
      code: `useEffect(() => {
  fetch(\`/api/search?q=\${query}\`).then(/* ... */);
}, [query]);

// Typing "react" fires:
// fetch("...q=r")
// fetch("...q=re")
// fetch("...q=rea")
// fetch("...q=reac")
// fetch("...q=react")
// 5 requests — 4 of them entirely wasted, and they
// may even resolve OUT OF ORDER, showing stale results!`,
      note: 'Floods the network and can briefly show results for "rea" AFTER results for "react" if responses race.'
    },
    right: {
      title: '🎯 With debounce (400ms)',
      tone: 'good',
      code: `const debouncedQuery = useDebounce(query, 400);

useEffect(() => {
  if (!debouncedQuery) return;
  fetch(\`/api/search?q=\${debouncedQuery}\`).then(/* ... */);
}, [debouncedQuery]);

// Typing "react" quickly fires:
// (nothing... nothing... nothing...)
// fetch("...q=react")  ← only ONE request, 400ms after the last keystroke`,
      note: 'One meaningful request, fired only once the query has settled.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Forgetting to clear the previous timer',
        wrong: `useEffect(() => {\n  setTimeout(() => setDebouncedValue(value), 400); // ❌ no cleanup — EVERY timer eventually fires!\n}, [value]);`,
        right: `useEffect(() => {\n  const id = setTimeout(() => setDebouncedValue(value), 400);\n  return () => clearTimeout(id); // ✅ cancels the stale timer when value changes again\n}, [value]);`,
        note: 'Without clearing the previous timer, every keystroke schedules a real update. You end up with all the original problems, just delayed by 400ms.'
      },
      {
        title: 'Debouncing the input itself instead of the side effect',
        wrong: `// ❌ debouncing the controlled input's value makes typing feel laggy —\n// the user won't see what they typed for 400ms!\nconst handleChange = useDebounce((e) => setQuery(e.target.value), 400);`,
        right: `// ✅ keep the INPUT instantly responsive; debounce the derived value used for the side effect\nconst [query, setQuery] = useState('');\nconst debouncedQuery = useDebounce(query, 400);\n<input value={query} onChange={e => setQuery(e.target.value)} />`,
        note: 'Always keep the visible input snappy. Debounce the consequence (the API call), never the keystroke-to-screen feedback.'
      },
      {
        title: 'Choosing a delay that is too long or too short',
        note: '50ms barely reduces calls. 1500ms for a search box feels broken. 300-500ms is a well-tested sweet spot for search. Auto-save drafts can use 1000-2000ms.'
      }
    ]
  },

  bestPractices: [
    'Extract debouncing into a small reusable useDebounce(value, delay) custom Hook.',
    'Always clear the previous timer in the cleanup function — this is the crux of correct debouncing.',
    'Keep the visible input instantly responsive — debounce the side effect, never the keystroke feedback.',
    'Use 300-500ms for live search, 150-250ms for local filters, 1000-2000ms for auto-save.',
    'Combine with an ignore flag or AbortController so a stale response cannot overwrite a newer result.'
  ],

  interviewQuestions: [
    { q: 'What is debouncing, and what problem does it solve in a React app?', a: 'Debouncing delays running a function until a burst of events stops for a set time. Each new event resets the wait. It solves the problem of rapid-fire events (like keystrokes) triggering far more API calls and computations than needed.' },
    { q: 'How do you implement a useDebounce custom Hook, and what is the key trick?', a: 'Store the value in state, and inside a useEffect, schedule a setTimeout to update that state after the delay. The key trick is the cleanup function — React runs it before the next effect, so returning clearTimeout(timerId) cancels the pending timer on every new change. Only the last timer in a burst survives.' },
    { q: 'What is the difference between debouncing and throttling?', a: 'Debouncing waits for activity to STOP before acting once — best for search boxes and auto-save. Throttling runs a function at most once every N milliseconds regardless of how often events fire — best for scroll position tracking and continuous feedback during drag.' },
    { q: 'Where should you apply debouncing in a search box — the onChange or the API call?', a: 'Debounce the consequence (the API call), not the input\'s own state update. The visible input must update instantly on every keystroke to stay responsive. If you debounce the onChange handler, the user will not see their typing for hundreds of milliseconds, which feels broken.' },
    { q: 'Why can debounced API responses still arrive in the wrong order?', a: 'Even with debouncing, a slow earlier request can still resolve after a faster later one. Use an AbortController or an ignore flag in the effect cleanup so a late-arriving response for an outdated query is discarded rather than overwriting fresher results.' }
  ],

  summary: {
    description: 'Debouncing converts a flood of rapid events into one meaningful reaction after the user pauses. Implement it as a small useDebounce Hook using the cleanup-function trick. Keep the input instantly responsive and only debounce the expensive consequence.',
    analogy: { icon: '🛗', title: 'Remember the elevator', text: 'Every new keystroke "presses the button again" and resets the wait — only true silence lets the doors close and the action fire.' }
  },

  furtherReading: [
    { label: 'Related topic', note: 'See "Custom Hooks" for extracting reusable logic like useDebounce, and "useEffect" for the cleanup mechanics this pattern depends on.' },
    { label: 'Related topic', note: 'See "Array.filter() & Searching" for how a debounced query feeds into client-side filtering of large lists.' },
    { label: 'Further exploration', note: 'Search "lodash debounce" or "use-debounce npm" for a battle-tested, configurable implementation.' }
  ]
};

export default debouncingContent;
