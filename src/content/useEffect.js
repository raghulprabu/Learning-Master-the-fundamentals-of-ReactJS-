const useEffectContent = {
  id: 'useEffect',
  title: 'useEffect Hook',
  icon: '🧗‍♂️',
  theme: 'cyan',
  tagline: 'Synchronize a component with the outside world — APIs, subscriptions, timers, the DOM, and anything else "outside React".',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useEffect lets you run code ("a side effect") after React has rendered/updated the DOM — things that aren\'t about *what* to render, but about keeping your component in sync with something outside of React: fetching data, subscribing to events, manually changing the DOM, setting timers, logging, and more.',
      'It takes a setup function (the effect) and an optional dependency array that controls *when* the effect re-runs.'
    ],
    points: [
      'Syntax: useEffect(() => { /* effect */ return () => { /* cleanup */ }; }, [dependencies]);',
      'The cleanup function (if returned) runs before the effect re-runs, and when the component unmounts.',
      'The dependency array tells React when to re-run the effect: omit it (every render), pass [] (once on mount), or pass [a, b] (whenever a or b changes).'
    ],
    code: { title: 'The basic shape', snippet: `useEffect(() => {
  // 👉 runs AFTER the render is committed to the screen
  const subscription = api.subscribe(handleEvent);

  return () => {
    // 🧹 cleanup — runs before the next effect, and on unmount
    subscription.unsubscribe();
  };
}, [api]); // 👈 dependency array — controls when this re-runs` },
    analogy: {
      icon: '📡',
      title: 'Real-World Analogy',
      text: '"useEffect is like a radar dish you set up after building the control room (the render). It watches for specific signals (your dependencies) and reacts when they change — pinging an external system (an API), tuning into a channel (a subscription), or starting a timer. And crucially, before you re-tune to a new channel, it politely turns off the old one first (cleanup)."'
    }
  },

  whyUsed: {
    description: 'Rendering should be a "pure" calculation: given the same props/state, return the same JSX, with no side effects. But real apps *need* side effects — fetching data, talking to browser APIs, setting up subscriptions. useEffect is the escape hatch that lets you do this safely, *after* React has updated the screen, without breaking the rendering model.',
    points: [
      'Synchronizes your component with external systems: servers (APIs), the DOM, browser APIs (timers, geolocation), third-party widgets.',
      'Lets you run code in response to a value changing — without making rendering itself impure.',
      'Provides a built-in cleanup mechanism so you don\'t leak subscriptions, timers, or listeners.',
      'Replaces and unifies three class-component lifecycle methods: componentDidMount, componentDidUpdate, and componentWillUnmount.'
    ]
  },

  whenToUse: {
    description: 'Reach for useEffect specifically when you need to step *outside* React to talk to something else — and resist the temptation to use it for things that can be computed during render.',
    points: [
      'Fetching data when a component mounts, or when some id/query changes.',
      'Subscribing to external stores/events (WebSockets, browser resize/scroll, third-party SDKs) — with cleanup to unsubscribe.',
      'Manually interacting with the DOM (measuring an element, integrating a non-React widget like a map or chart library).',
      'Setting/clearing timers and intervals (setTimeout, setInterval) — including the classic debounce pattern (see the Debouncing topic).',
      'Syncing state to localStorage, document.title, analytics events, etc.'
    ],
    analogy: {
      icon: '🚫',
      title: 'When NOT to use useEffect',
      text: '"If you can compute something directly while rendering (e.g. a filtered list, a formatted price, a derived boolean), or if you\'re only responding to a user event (a click, a submit), you almost certainly do NOT need useEffect. Reaching for it by default is the #1 cause of unnecessary re-renders and hard-to-trace bugs in React apps — the official docs literally have a guide titled \'You Might Not Need an Effect\'."'
    }
  },

  howItWorks: {
    description: 'After React renders and commits changes to the DOM, it runs your effect functions in order. If you provided a dependency array, React compares each dependency to its value from the previous render; if any changed, it first runs the previous effect\'s cleanup, then runs the new effect. On unmount, the latest cleanup runs one final time.',
    code: {
      title: 'Data fetching with cleanup — avoiding race conditions',
      snippet: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false; // cleanup flag — guards against race conditions
    setLoading(true);

    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        if (!ignore) {           // only apply if this effect is still relevant
          setUser(data);
          setLoading(false);
        }
      });

    return () => { ignore = true; }; // cleanup runs if userId changes again, or unmount
  }, [userId]); // 👈 re-run whenever userId changes

  if (loading) return <Spinner />;
  return <ProfileCard user={user} />;
}`
    },
    points: [
      'No dependency array → effect runs after EVERY render (rarely what you want).',
      'Empty array [] → effect runs ONCE, after the first render (like componentDidMount).',
      '[a, b] → effect re-runs whenever `a` or `b` changes between renders (like componentDidUpdate, scoped).',
      'The returned cleanup function runs before each subsequent effect run AND on unmount (like componentWillUnmount) — perfect for unsubscribing, clearing timers, and aborting fetches.'
    ]
  },

  flowDiagram: {
    title: 'The useEffect lifecycle',
    steps: [
      { icon: '🖼️', label: 'Render committed', note: 'React updates the DOM' },
      { icon: '🧹', label: 'Previous cleanup runs', note: '(if deps changed)' },
      { icon: '⚡', label: 'Effect runs', note: 'fetch / subscribe / timer' },
      { icon: '🔭', label: 'Watches dependencies', note: '[userId] — re-checks each render' },
      { icon: '🚪', label: 'Cleanup on unmount', note: 'unsubscribe / clearTimeout' }
    ]
  },

  realWorldExamples: {
    intro: 'These four patterns cover the overwhelming majority of real-world useEffect usage:',
    items: [
      {
        icon: '🌐', title: 'Fetching data on mount / when an id changes',
        description: 'Load a user\'s profile when the page opens, and reload it whenever the route\'s userId param changes.',
        code: `useEffect(() => {\n  let ignore = false;\n  fetchUser(userId).then(u => { if (!ignore) setUser(u); });\n  return () => { ignore = true; };\n}, [userId]);`
      },
      {
        icon: '⏱️', title: 'Setting up & clearing a timer',
        description: 'A countdown, an auto-rotating carousel, or a "session about to expire" warning — anything time-based needs setup AND cleanup.',
        code: `useEffect(() => {\n  const id = setInterval(() => setSeconds(s => s + 1), 1000);\n  return () => clearInterval(id); // 🧹 prevents leaks & duplicate timers\n}, []);`
      },
      {
        icon: '📡', title: 'Subscribing to browser/external events',
        description: 'Tracking window size, online/offline status, or a WebSocket connection — subscribe on mount, unsubscribe on unmount.',
        code: `useEffect(() => {\n  const onResize = () => setWidth(window.innerWidth);\n  window.addEventListener('resize', onResize);\n  return () => window.removeEventListener('resize', onResize);\n}, []);`
      },
      {
        icon: '💾', title: 'Syncing state to localStorage / document.title',
        description: 'Persist a theme preference, save a draft, or update the browser tab title to reflect unread message counts — exactly like this app\'s own Home.jsx does for its active section!',
        code: `useEffect(() => {\n  localStorage.setItem('theme', theme);\n  document.title = \`(\${unread}) Inbox\`;\n}, [theme, unread]);`
      }
    ]
  },

  prosAndCons: {
    pros: [
      'Unifies three separate class lifecycle methods into one consistent, composable API.',
      'Keeps side-effect logic colocated with the component/state it depends on — easy to find and reason about.',
      'Built-in cleanup mechanism prevents the classic memory-leak and "duplicate subscription" bugs.',
      'The dependency array makes "when should this run?" explicit and lint-checkable (eslint-plugin-react-hooks catches missing deps).'
    ],
    cons: [
      'Easy to overuse — many beginners reach for useEffect when a derived value or an event handler would be simpler and more predictable.',
      'Stale closures: an effect "remembers" the values from the render it was created in, which can cause subtle bugs if dependencies are mismanaged.',
      'Can cause cascades of re-renders/re-fetches if dependencies aren\'t set up carefully (e.g. a new object/array literal in the dependency array every render).',
      'Async work inside effects needs careful handling (ignore flags / AbortController) to avoid race conditions when dependencies change quickly.'
    ]
  },

  comparison: {
    title: 'Dependency array: the three modes',
    intro: 'The single most important thing to internalize about useEffect is what you pass as its second argument:',
    left: {
      title: '✅ `[]` — run once on mount',
      tone: 'good',
      code: `useEffect(() => {
  console.log('mounted!');
  return () => console.log('unmounted!');
}, []); // empty array — runs once`,
      note: 'Equivalent to componentDidMount + componentWillUnmount. Perfect for one-time setup like initial data loads or subscriptions that don\'t depend on props/state.'
    },
    right: {
      title: '⚠️ no array — run after every render',
      tone: 'bad',
      code: `useEffect(() => {
  console.log('ran again!');
  fetchData(); // 🚨 fetches on EVERY render — usually a bug
}); // no dependency array at all`,
      note: 'Almost always a mistake for anything beyond simple logging — leads to runaway loops of fetching/subscribing/state-updates.'
    }
  },

  commonMistakes: {
    intro: 'These mistakes are responsible for the vast majority of "why is my component looping / re-fetching forever?" questions online:',
    items: [
      {
        title: 'The infinite loop: updating state the effect depends on, unconditionally',
        wrong: `useEffect(() => {\n  setCount(count + 1); // ❌ runs -> updates state -> re-renders -> runs again -> forever\n}, [count]);`,
        right: `useEffect(() => {\n  if (count < 10) setCount(c => c + 1); // ✅ has a stopping condition\n}, [count]);\n// or better: derive the value during render instead of using an effect at all`,
        note: 'If an effect updates a piece of state that is also in its dependency array — without a condition that eventually stops it — you get an infinite render loop. Always ask: "could this be computed during render instead?"'
      },
      {
        title: 'Forgetting the dependency array entirely',
        wrong: `useEffect(() => {\n  fetchUser(userId).then(setUser); // ❌ refetches after EVERY render, not just when userId changes\n});`,
        right: `useEffect(() => {\n  fetchUser(userId).then(setUser); // ✅ only refetches when userId actually changes\n}, [userId]);`,
      },
      {
        title: 'Forgetting cleanup — leaking subscriptions/timers',
        wrong: `useEffect(() => {\n  const id = setInterval(tick, 1000); // ❌ never cleared -> duplicates pile up on re-render/unmount\n}, []);`,
        right: `useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id); // ✅ always clean up what you set up\n}, []);`,
      },
      {
        title: 'Race conditions in async effects',
        wrong: `useEffect(() => {\n  fetch(\`/search?q=\${query}\`).then(r => r.json()).then(setResults);\n  // ❌ a slow earlier request can resolve AFTER a faster later one, showing stale results\n}, [query]);`,
        right: `useEffect(() => {\n  let ignore = false;\n  fetch(\`/search?q=\${query}\`).then(r => r.json()).then(data => {\n    if (!ignore) setResults(data); // ✅ ignore stale responses\n  });\n  return () => { ignore = true; };\n}, [query]);`,
        note: 'When dependencies change quickly (e.g. typing in a search box), older requests can resolve after newer ones. An "ignore" flag (or AbortController) in the cleanup discards stale results — this is also exactly the kind of problem Debouncing helps prevent in the first place.'
      },
      {
        title: 'Using useEffect to compute a derived value',
        wrong: `useEffect(() => {\n  setFullName(firstName + ' ' + lastName); // ❌ extra render, extra state to keep in sync\n}, [firstName, lastName]);`,
        right: `const fullName = \`\${firstName} \${lastName}\`; // ✅ just compute it during render — no effect needed`,
      }
    ]
  },

  bestPractices: [
    'Always include every value from component scope that the effect uses in the dependency array (let the eslint-plugin-react-hooks `exhaustive-deps` rule guide you — don\'t silence it).',
    'Always return a cleanup function for anything you "set up" (subscriptions, timers, listeners, connections).',
    'Guard async effects against race conditions with an `ignore` flag or `AbortController`.',
    'Before reaching for useEffect, ask "can I compute this during render?" or "is this just responding to an event?" — if yes, you probably don\'t need an effect (see "You Might Not Need an Effect" in the official docs).',
    'Split unrelated concerns into separate useEffect calls — one effect per logical concern is easier to read, test, and get the dependency array right for.'
  ],

  interviewQuestions: [
    { q: 'What is a "side effect" in React, and why can\'t you just put that code directly in the component body?', a: 'A side effect is any operation that reaches outside the pure "compute UI from props/state" model — fetching data, subscribing to events, manually touching the DOM, logging, timers. Rendering is supposed to be a pure calculation (same inputs -> same JSX, no observable side effects), so React requires side effects to run in useEffect (after the render is committed) rather than during the render itself — otherwise you risk running them multiple times, in the wrong order, or during server rendering where there is no DOM.' },
    { q: 'Explain the three "modes" of the useEffect dependency array.', a: 'No array: the effect runs after every render (rare; usually a mistake). An empty array []: the effect runs once, after the initial render — like componentDidMount. An array with values [a, b]: the effect re-runs whenever any listed value changes between renders compared to the previous render — like a scoped componentDidUpdate.' },
    { q: 'What is the cleanup function, and when does it run?', a: 'It\'s the function you optionally return from your effect. React calls it right before running the effect again (when dependencies change) and one final time when the component unmounts. It\'s where you undo whatever the effect set up — unsubscribe from events, clear timers/intervals, cancel in-flight requests — preventing memory leaks and duplicate side effects.' },
    { q: 'How would you prevent a race condition when fetching data inside an effect that depends on a frequently-changing value (like a search query)?', a: 'Use a local "ignore"/"active" flag (or an AbortController) set up in the effect and flipped in its cleanup function. When the dependency changes again before the previous fetch resolves, the cleanup marks that earlier request as stale, so its .then() callback checks the flag and discards the now-irrelevant response instead of overwriting newer data. Debouncing the input that triggers the fetch in the first place also greatly reduces how often this can happen.' },
    { q: 'Give an example of code that *looks* like it needs useEffect but actually doesn\'t.', a: 'Computing a derived value — e.g. setting `fullName` state in an effect whenever `firstName`/`lastName` change. This adds an unnecessary extra render and an extra piece of state that can get out of sync. The fix is to simply compute `const fullName = \`${firstName} ${lastName}\`` directly during render — no effect, no extra state, always in sync. The official "You Might Not Need an Effect" guide catalogs many such cases (e.g. resetting state when a prop changes, responding to user events, transforming data for rendering).' }
  ],

  summary: {
    description: 'useEffect synchronizes your component with the world outside React — but it is not a generic "run code after render" hammer. Use it specifically for side effects (fetching, subscribing, timers, manual DOM/browser API work), always provide an accurate dependency array and cleanup function, and prefer computing values during render or handling things in event handlers whenever you can. Mastering "do I even need an effect here?" is the single biggest jump in React maturity.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useEffect and react.dev/learn/synchronizing-with-effects — the canonical deep dive into when, why, and how to use effects, plus the essential "You Might Not Need an Effect" guide.' }
  ]
};

export default useEffectContent;
