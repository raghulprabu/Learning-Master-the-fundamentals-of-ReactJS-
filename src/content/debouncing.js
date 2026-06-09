const debouncingContent = {
  id: 'debouncing',
  title: 'Debouncing in React',
  icon: '⏳',
  theme: 'orange',
  tagline: 'Wait for the user to pause before reacting — turn 50 rapid-fire events into 1 meaningful one.',
  meta: 'Patterns · Performance · Worked Example',

  whatIsIt: {
    description: [
      'Debouncing is a technique that delays running a function until a burst of triggering events has *stopped* for a specified amount of time. Each new event resets the timer — so the function only ever runs once the user has "settled down".',
      'In React, debouncing most commonly wraps a fast-changing value (like search-box text) so that expensive work — an API call, a heavy filter, a re-render of a large list — only happens after the user pauses typing, not on every single keystroke.'
    ],
    points: [
      'Core idea: "wait until things go quiet, then act — and if something new happens before that, restart the wait".',
      'Implemented with setTimeout + clearTimeout: every new event clears the previous pending timer and schedules a fresh one.',
      'The result is a *debounced value* (or *debounced function*) that updates/runs far less often than the raw input — typically once per pause, instead of once per keystroke.'
    ],
    code: { title: 'The problem, in one picture', snippet: `User types: "r" "re" "rea" "reac" "react"
                ⏱     ⏱     ⏱      ⏱       ⏱
Without debounce → 5 API calls fired (one per keystroke, mostly wasted)
With debounce    → only the LAST one survives, after a short pause
                   "react" → 🔍 1 API call, 350ms after the last keystroke` },
    analogy: {
      icon: '🛗',
      title: 'Real-World Analogy',
      text: '"Think of an elevator door. Every time someone walks up and presses the button, the door\'s \'close timer\' resets — the door doesn\'t start closing the instant the first person arrives. It waits until NO ONE has pressed the button for a few seconds, and only then does it close and the elevator moves. Debouncing does the same thing for your code: it keeps \'waiting for one more person\' (keystroke) and only \'closes the doors\' (runs your function) once things go quiet."'
    }
  },

  whyUsed: {
    description: 'Many user interactions fire events far faster than your app can — or should — meaningfully respond to them. Typing in a search box can fire 5-10 keystroke events per second; window resize can fire dozens per second. Reacting to *every single one* wastes resources and often produces a worse experience than reacting to the *settled* result.',
    points: [
      'Prevents firing an API request on every keystroke — turning a "type \'react\'" search into 5 network requests, most of which arrive out of order and get immediately discarded.',
      'Reduces unnecessary re-renders and expensive computations (filtering thousands of rows) that would otherwise run on every keystroke.',
      'Improves perceived performance and reduces server load / API costs — fewer, more meaningful requests instead of a flood of throwaway ones.',
      'Produces a smoother UX: results visibly "settle" once the user pauses, rather than flickering through intermediate, irrelevant states.'
    ]
  },

  whenToUse: {
    description: 'Reach for debouncing whenever a *rapid stream of events* should ultimately produce just *one* meaningful reaction — once things calm down.',
    points: [
      'Search-as-you-type / autocomplete / auto-suggestion boxes that query an API or filter a large dataset.',
      'Form field validation that involves an async check (e.g. "is this username available?") — you don\'t want to hit the server on every keystroke.',
      'Window resize / scroll handlers that recompute layout, trigger animations, or fetch "load more" content.',
      'Auto-save drafts (documents, comments, settings forms) — save 1.5 seconds after the user stops typing, not on every character.'
    ],
    analogy: {
      icon: '🆚',
      title: 'Debounce vs. Throttle — don\'t confuse them',
      text: '"Debounce says \'wait until the user STOPS, then act once\' — perfect for search boxes (you only care about the final query). Throttle says \'act at most once every N milliseconds, no matter how often events fire\' — perfect for scroll/resize handlers where you want steady, periodic updates DURING continuous activity, not just at the end. Search → debounce. Scroll-position tracking → throttle."'
    }
  },

  howItWorks: {
    description: 'A debounce implementation tracks a pending timer. Each time the input changes, it cancels (clearTimeout) any timer still waiting, and starts a brand-new one (setTimeout). Only if the full delay elapses *without* being interrupted again does the timer fire and the "settled" value/action finally take effect.',
    code: {
      title: 'A reusable useDebounce custom Hook (the idiomatic React approach)',
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
      'The trick lives entirely in useEffect\'s cleanup function: React runs it right before the *next* effect — i.e. on every keystroke — cancelling whatever timer was still pending.',
      'Only the very last scheduled timer in a burst ever survives long enough to fire — every earlier one gets cleared before its time is up.',
      'Separating "debounced value" (useDebounce) from "what to do with it" (a second useEffect) keeps each concern small, readable, and independently testable.'
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
    intro: 'Debouncing quietly powers some of the most common (and most appreciated) UX details in production apps:',
    items: [
      { icon: '🔍', title: 'Live search & auto-suggestion', description: 'GitHub\'s repo search, e-commerce product search, Google\'s search bar — all wait for a brief pause before querying, instead of firing on every keystroke.', code: `const debouncedQuery = useDebounce(query, 350);\nuseEffect(() => { if (debouncedQuery) fetchSuggestions(debouncedQuery); }, [debouncedQuery]);` },
      { icon: '✅', title: 'Async username/email availability checks', description: 'Sign-up forms that show "✓ Username available" debounce the check — hitting the server only once the user pauses, not on every keystroke of a 12-character name.' },
      { icon: '💾', title: 'Auto-save drafts', description: 'Google Docs, Notion, and comment boxes save a draft ~1-2 seconds after you stop typing — debouncing prevents a network request on every single character.' },
      { icon: '📐', title: 'Resize-triggered layout recalculation', description: 'Recomputing chart dimensions or column counts on window resize — debounced so the expensive recalculation runs once after resizing settles, not 60 times per second.' },
      { icon: '🎚️', title: 'Range sliders & live filters', description: 'A price-range slider that filters a product grid waits for the user to stop dragging before re-querying or re-filtering — keeping the UI responsive while dragging.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Dramatically cuts the number of API calls / expensive computations — often from dozens down to one per "burst" of activity.',
      'Reduces server load and API costs — directly translates to real infrastructure savings at scale.',
      'Improves perceived smoothness — the UI updates once with a meaningful result, instead of flickering through many irrelevant intermediate states.',
      'Simple to implement and reuse via a small custom Hook (useDebounce) — and easy to tune via a single `delay` parameter.'
    ],
    cons: [
      'Introduces a deliberate delay — set it too high and the UI feels sluggish/unresponsive; too low and you lose the benefit.',
      'Adds a small amount of complexity (timers, cleanup) that must be handled correctly to avoid stale closures or memory leaks.',
      'Not appropriate for *every* rapid-event scenario — continuous, steady feedback (e.g. a live progress indicator while dragging) usually wants throttling instead.',
      'Can feel surprising to users who expect truly "instant" feedback — the delay should be tuned to feel natural, not laggy (300-500ms is a common sweet spot for search).'
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
      note: 'Floods the network, wastes server resources, and can briefly show results for "rea" AFTER results for "react" if responses race.'
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
      note: 'One meaningful request, fired only once the query has "settled" — fast, efficient, and immune to race conditions from intermediate queries.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Forgetting to clear the previous timer',
        wrong: `useEffect(() => {\n  setTimeout(() => setDebouncedValue(value), 400); // ❌ no cleanup — EVERY timer eventually fires!\n}, [value]);`,
        right: `useEffect(() => {\n  const id = setTimeout(() => setDebouncedValue(value), 400);\n  return () => clearTimeout(id); // ✅ cancels the stale timer when value changes again\n}, [value]);`,
        note: 'Without clearing the previous timer, EVERY keystroke schedules a real update — you end up with all the original problems, just delayed by 400ms instead of solved.'
      },
      {
        title: 'Debouncing the wrong layer (the input itself, instead of the side effect)',
        wrong: `// ❌ debouncing the controlled input's value updates makes typing feel laggy —\n// the user won't see what they typed for 400ms!\nconst handleChange = useDebounce((e) => setQuery(e.target.value), 400);`,
        right: `// ✅ keep the INPUT instantly responsive; debounce the derived value used for the side effect\nconst [query, setQuery] = useState('');\nconst debouncedQuery = useDebounce(query, 400);\n<input value={query} onChange={e => setQuery(e.target.value)} />`,
        note: 'Always keep the visible input snappy and instantaneous — debounce the *consequence* (the API call, the heavy filter), never the keystroke-to-screen feedback loop itself.'
      },
      {
        title: 'Choosing a delay that\'s too long or too short',
        note: 'Too short (e.g. 50ms) and you barely reduce the number of calls — you\'re back to firing on nearly every keystroke. Too long (e.g. 1500ms for a search box) and the app feels unresponsive and laggy. 300-500ms is a well-tested sweet spot for search-as-you-type; auto-save drafts can comfortably use 1000-2000ms since immediacy matters less there.'
      }
    ]
  },

  bestPractices: [
    'Extract debouncing into a small, reusable useDebounce(value, delay) custom Hook — write the timer/cleanup logic once, use it everywhere.',
    'Always clear the previous timer in the effect\'s cleanup function — this is the crux of correct debouncing; skipping it silently breaks everything.',
    'Keep the visible input/UI instantly responsive — debounce the side effect (API call, filter, save), never the keystroke-to-screen feedback.',
    'Tune the delay to the action: ~300-500ms for live search, ~150-250ms for instant filters on small local datasets, ~1000-2000ms for auto-save drafts.',
    'Combine with request-cancellation (AbortController, or an `ignore` flag) so a slow, stale request can\'t overwrite a newer result — debouncing reduces races, but doesn\'t eliminate them entirely.'
  ],

  interviewQuestions: [
    { q: 'What is debouncing, and what problem does it solve in a React app?', a: 'Debouncing delays running a function until a burst of triggering events has stopped for a specified period — each new event resets the wait. It solves the problem of rapid-fire events (like keystrokes in a search box) triggering far more work (API calls, re-renders, expensive computations) than is meaningful or necessary — collapsing, say, 10 keystroke-triggered actions down to a single action once the user pauses.' },
    { q: 'How would you implement a useDebounce custom Hook, and what is the key trick that makes it work?', a: 'Store the value in state, and inside a useEffect that depends on the raw value, schedule a setTimeout that updates that state after the delay. The key trick is the effect\'s CLEANUP function: React runs it right before the next effect run (i.e. on every new change), so returning () => clearTimeout(timerId) cancels the still-pending timer from the previous value — guaranteeing only the very last scheduled update in a burst actually fires.' },
    { q: 'What is the difference between debouncing and throttling, and when would you choose one over the other?', a: 'Debouncing waits for activity to STOP before acting once — ideal when you only care about the final, settled state (search-as-you-type, auto-save, availability checks). Throttling guarantees a function runs at most once every N milliseconds REGARDLESS of how often events fire — ideal when you want steady, periodic feedback DURING continuous activity (scroll position tracking, drag-to-resize previews, infinite-scroll loading triggers).' },
    { q: 'Where exactly should you apply debouncing in a search box — the input\'s onChange, or the resulting API call? Why?', a: 'You should debounce the consequence (the API call / expensive filter), not the input\'s own state update. The visible <input> must update its value on every keystroke to stay responsive — if you debounce the onChange handler itself, the user won\'t see their own typing reflected on screen for hundreds of milliseconds, which feels broken. The pattern is: keep `query` state instant, derive a `debouncedQuery` from it via useDebounce, and trigger the side effect off the debounced value.' },
    { q: 'Why might debounced API responses still arrive in the wrong order, and how do you guard against that?', a: 'Even with debouncing, only ONE request is typically in flight at a time for well-tuned delays — but if the delay is short or the network is slow/variable, an earlier request could still resolve after a later one (e.g. due to server-side latency differences). The standard guard is to either use an AbortController to cancel in-flight requests when a new one starts, or track an `ignore`/`isStale` flag in the effect\'s cleanup so a late-arriving response for an outdated query is simply discarded rather than overwriting fresher results.' }
  ],

  summary: {
    description: 'Debouncing converts a flood of rapid-fire events into a single, meaningful reaction once things settle down — the single highest-leverage performance pattern for search boxes, auto-save, and async validation. Implement it once as a small useDebounce custom Hook (the cleanup-function trick is the crux), keep the visible input instantly responsive, debounce only the expensive consequence, and tune the delay (300-500ms for search) to feel natural rather than laggy.',
    analogy: { icon: '🛗', title: 'Remember the elevator', text: 'Every new keystroke "presses the button again" and resets the wait — only true silence lets the doors close and the action fire.' }
  },

  furtherReading: [
    { label: 'Related topic', note: 'See "Custom Hooks" for the general pattern of extracting reusable logic like useDebounce, and "useEffect" for a deep dive on the cleanup-function mechanics this pattern depends on.' },
    { label: 'Related topic', note: 'See "Array.filter() & Searching" for how a debounced query typically feeds into client-side filtering of large lists.' },
    { label: 'Further exploration', note: 'Search "lodash debounce" or "use-debounce npm package" if you want a battle-tested, configurable implementation (with options like leading/trailing edge execution) instead of hand-rolling one.' }
  ]
};

export default debouncingContent;
