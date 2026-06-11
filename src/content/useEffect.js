const useEffectContent = {
  id: 'useEffect',
  title: 'useEffect Hook',
  icon: '🧗‍♂️',
  theme: 'cyan',
  tagline: 'useEffect lets you run code after React updates the screen.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useEffect lets you run code after React renders — things like fetching data, subscribing to events, setting timers, or updating the page title.',
      'It takes a setup function and an optional dependency array that controls when the effect runs again.'
    ],
    points: [
      'Syntax: useEffect(() => { /* effect */ return () => { /* cleanup */ }; }, [deps]);',
      'The cleanup function runs before the effect runs again, and when the component unmounts.',
      'No array = runs every render. [] = runs once on mount. [a, b] = runs when a or b changes.'
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
      text: '"useEffect is like a radar dish. You set it up after building the control room (the render). It watches for signals (your dependencies) and reacts when they change. Before tuning to a new channel, it turns off the old one first (cleanup)."'
    }
  },

  whyUsed: {
    description: 'Rendering should be a pure calculation. But real apps need to fetch data, talk to the browser, and set up subscriptions. useEffect lets you do this safely after React updates the screen.',
    points: [
      'Syncs your component with external systems: APIs, the DOM, timers, WebSockets.',
      'Lets you run code in response to a value changing without making rendering impure.',
      'Provides cleanup so you do not leak subscriptions, timers, or listeners.',
      'Replaces componentDidMount, componentDidUpdate, and componentWillUnmount in one Hook.'
    ]
  },

  whenToUse: {
    description: 'Use useEffect when you need to step outside React and talk to something else — the browser, a server, or a third-party library.',
    points: [
      'Fetching data when a component mounts, or when an id changes.',
      'Subscribing to events (WebSockets, resize, scroll) with cleanup to unsubscribe.',
      'Manually interacting with the DOM or a non-React widget like a chart library.',
      'Setting or clearing timers and intervals.',
      'Syncing state to localStorage or updating document.title.'
    ],
    analogy: {
      icon: '🚫',
      title: 'When NOT to use useEffect',
      text: '"If you can compute something during render (like a filtered list), or if you are only responding to a click, you do NOT need useEffect. Overusing it is the number one cause of unnecessary re-renders and hard-to-trace bugs."'
    }
  },

  howItWorks: {
    description: 'After React commits the DOM, it runs your effect. If any dependency changed, React first runs the previous cleanup, then runs the new effect. On unmount, the latest cleanup runs one final time.',
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
      'No dependency array: runs after every render (rarely what you want).',
      'Empty array []: runs once on mount, like componentDidMount.',
      '[a, b]: re-runs whenever a or b changes.',
      'The cleanup function prevents memory leaks from timers and subscriptions.'
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
    intro: 'These four patterns cover most real-world useEffect usage:',
    items: [
      {
        icon: '🌐', title: 'Fetching data on mount or when an id changes',
        description: 'Load a user profile when the page opens. Reload it when the userId changes.',
        code: `useEffect(() => {\n  let ignore = false;\n  fetchUser(userId).then(u => { if (!ignore) setUser(u); });\n  return () => { ignore = true; };\n}, [userId]);`
      },
      {
        icon: '⏱️', title: 'Setting up and clearing a timer',
        description: 'A countdown or auto-rotating carousel needs both setup and cleanup.',
        code: `useEffect(() => {\n  const id = setInterval(() => setSeconds(s => s + 1), 1000);\n  return () => clearInterval(id); // 🧹 prevents leaks & duplicate timers\n}, []);`
      },
      {
        icon: '📡', title: 'Subscribing to browser events',
        description: 'Track window size or online/offline status. Subscribe on mount, unsubscribe on unmount.',
        code: `useEffect(() => {\n  const onResize = () => setWidth(window.innerWidth);\n  window.addEventListener('resize', onResize);\n  return () => window.removeEventListener('resize', onResize);\n}, []);`
      },
      {
        icon: '💾', title: 'Syncing state to localStorage or document.title',
        description: 'Persist a theme preference or update the browser tab title when unread count changes.',
        code: `useEffect(() => {\n  localStorage.setItem('theme', theme);\n  document.title = \`(\${unread}) Inbox\`;\n}, [theme, unread]);`
      }
    ]
  },

  prosAndCons: {
    pros: [
      'Unifies three class lifecycle methods into one consistent API.',
      'Keeps side-effect logic next to the component and state it depends on.',
      'Built-in cleanup prevents memory leaks and duplicate subscriptions.',
      'The dependency array makes "when should this run?" clear and checkable.'
    ],
    cons: [
      'Easy to overuse — many things can be computed during render instead.',
      'Stale closures can cause subtle bugs if dependencies are wrong.',
      'Can cause infinite loops if you update state that is also in the dependency array.',
      'Async effects need careful handling to avoid race conditions.'
    ]
  },

  comparison: {
    title: 'Dependency array: the three modes',
    intro: 'The second argument to useEffect is the most important thing to get right:',
    left: {
      title: '✅ `[]` — run once on mount',
      tone: 'good',
      code: `useEffect(() => {
  console.log('mounted!');
  return () => console.log('unmounted!');
}, []); // empty array — runs once`,
      note: 'Equivalent to componentDidMount + componentWillUnmount. For one-time setup like initial data loads.'
    },
    right: {
      title: '⚠️ no array — run after every render',
      tone: 'bad',
      code: `useEffect(() => {
  console.log('ran again!');
  fetchData(); // 🚨 fetches on EVERY render — usually a bug
}); // no dependency array at all`,
      note: 'Almost always a mistake — leads to runaway loops of fetching and state updates.'
    }
  },

  commonMistakes: {
    intro: 'These are the most common reasons a component loops or re-fetches forever:',
    items: [
      {
        title: 'Infinite loop: updating state the effect depends on',
        wrong: `useEffect(() => {\n  setCount(count + 1); // ❌ runs -> updates state -> re-renders -> runs again -> forever\n}, [count]);`,
        right: `useEffect(() => {\n  if (count < 10) setCount(c => c + 1); // ✅ has a stopping condition\n}, [count]);\n// or better: derive the value during render instead of using an effect at all`,
        note: 'Always ask: "can I compute this during render?" before reaching for useEffect.'
      },
      {
        title: 'Forgetting the dependency array',
        wrong: `useEffect(() => {\n  fetchUser(userId).then(setUser); // ❌ refetches after EVERY render\n});`,
        right: `useEffect(() => {\n  fetchUser(userId).then(setUser); // ✅ only refetches when userId changes\n}, [userId]);`,
      },
      {
        title: 'Forgetting cleanup — leaking subscriptions and timers',
        wrong: `useEffect(() => {\n  const id = setInterval(tick, 1000); // ❌ never cleared -> duplicates pile up\n}, []);`,
        right: `useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id); // ✅ always clean up what you set up\n}, []);`,
      },
      {
        title: 'Race conditions in async effects',
        wrong: `useEffect(() => {\n  fetch(\`/search?q=\${query}\`).then(r => r.json()).then(setResults);\n  // ❌ a slow earlier request can resolve AFTER a faster later one\n}, [query]);`,
        right: `useEffect(() => {\n  let ignore = false;\n  fetch(\`/search?q=\${query}\`).then(r => r.json()).then(data => {\n    if (!ignore) setResults(data); // ✅ ignore stale responses\n  });\n  return () => { ignore = true; };\n}, [query]);`,
        note: 'When dependencies change quickly, older requests can resolve after newer ones. An ignore flag discards stale results.'
      },
      {
        title: 'Using useEffect to compute a derived value',
        wrong: `useEffect(() => {\n  setFullName(firstName + ' ' + lastName); // ❌ extra render, extra state\n}, [firstName, lastName]);`,
        right: `const fullName = \`\${firstName} \${lastName}\`; // ✅ just compute it during render`,
      }
    ]
  },

  bestPractices: [
    'Include every value your effect uses in the dependency array.',
    'Always return a cleanup function for subscriptions, timers, and listeners.',
    'Guard async effects against race conditions with an ignore flag or AbortController.',
    'Ask yourself "can I compute this during render?" before writing an effect.',
    'Split unrelated concerns into separate useEffect calls.'
  ],

  interviewQuestions: [
    { q: 'What is a "side effect" in React, and why use useEffect?', a: 'A side effect is any operation outside of rendering — fetching data, subscribing to events, updating the DOM, setting timers. Rendering should be a pure calculation, so React requires side effects to run in useEffect after the render is committed.' },
    { q: 'Explain the three modes of the useEffect dependency array.', a: 'No array: the effect runs after every render. An empty array []: the effect runs once after the first render, like componentDidMount. An array with values [a, b]: the effect re-runs whenever a or b changes between renders.' },
    { q: 'What is the cleanup function, and when does it run?', a: 'The cleanup function is what you return from your effect. React calls it before running the effect again and when the component unmounts. Use it to unsubscribe from events, clear timers, and cancel requests to prevent memory leaks.' },
    { q: 'How do you prevent a race condition when fetching data inside useEffect?', a: 'Use an ignore flag in the effect. Set it to true in the cleanup function. When the effect runs again before the previous fetch finishes, the cleanup marks it stale and the .then() callback checks the flag before updating state.' },
    { q: 'Give an example of code that looks like it needs useEffect but does not.', a: 'Computing a derived value — like setting fullName state whenever firstName or lastName changes. This adds an extra render and extra state. Just compute it during render: const fullName = firstName + " " + lastName. No effect needed.' }
  ],

  summary: {
    description: 'useEffect synchronizes your component with the world outside React. Use it for fetching, subscribing, and timers. Always provide an accurate dependency array and a cleanup function. Ask yourself if you really need an effect — many things are simpler when computed during render.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useEffect and react.dev/learn/synchronizing-with-effects — the deep dive into effects, plus the "You Might Not Need an Effect" guide.' }
  ]
};

export default useEffectContent;
