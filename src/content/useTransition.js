const useTransitionContent = {
  id: 'useTransition',
  title: 'useTransition Hook',
  icon: '🚦',
  theme: 'purple',
  tagline: 'useTransition marks a state update as non-urgent so React keeps the UI responsive while it runs.',
  meta: 'Hooks · Concurrent React',

  whatIsIt: {
    description: [
      'useTransition lets you mark certain state updates as "transitions" — non-urgent updates that React can prepare in the background without blocking urgent things like typing or clicking.',
      'It returns [isPending, startTransition]: a boolean telling you whether the transition is still in progress, and a function you wrap around the state update you want to de-prioritize.'
    ],
    points: [
      'Syntax: const [isPending, startTransition] = useTransition();',
      'Wrap the expensive update: startTransition(() => setTab(nextTab));',
      'React renders the transition in the background and can interrupt it if something more urgent arrives.'
    ],
    code: { title: 'The basic shape', snippet: `const [isPending, startTransition] = useTransition();

function selectTab(nextTab) {
  startTransition(() => {
    setTab(nextTab); // 👈 marked as "not urgent" — React can deprioritize this render
  });
}

return (
  <>
    {isPending && <Spinner />}
    <TabButton onClick={() => selectTab('posts')}>Posts</TabButton>
  </>
);` },
    analogy: {
      icon: '🚥',
      title: 'Real-World Analogy',
      text: '"A good barista gets both a quick coffee order and a complex latte art order at once. Instead of making the coffee customer wait while finishing the latte, the barista starts the latte in the background and drops it instantly if a new urgent order arrives. React with useTransition works the same way."'
    }
  },

  whyUsed: {
    description: 'Some state updates trigger expensive re-renders (switching tabs, applying filters on thousands of rows). Without useTransition, these can freeze the whole UI — typing lags, clicks do not register.',
    points: [
      'Keeps the UI responsive during big re-renders.',
      'Lets React interrupt and discard stale in-progress renders.',
      'Provides isPending so you can show a loading indicator automatically.',
      'Avoids the "frozen screen" feeling from large synchronous re-renders.'
    ]
  },

  whenToUse: {
    description: 'Use useTransition when a specific state update causes visible jank and you want the rest of the UI to stay snappy while it resolves.',
    points: [
      'Switching tabs where the new view renders a large amount of content.',
      'Applying search or filter criteria that re-render large lists.',
      'Any update you have observed (via the Profiler) causing input lag.',
      'When you want a built-in pending state without manually managing isLoading.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use useTransition',
      text: '"Do not wrap a controlled input\'s own state update in a transition. Text typed into an input must update synchronously or the input will visibly lag. Wrap only the EXPENSIVE DERIVED work (like re-rendering a filtered list), never the keystroke-to-screen feedback."'
    }
  },

  howItWorks: {
    description: 'startTransition(callback) tells React: the state updates inside this callback are not urgent. React renders the result in the background and can abandon the work if something more pressing arrives.',
    code: {
      title: 'Keeping a search input snappy while filtering a huge list',
      snippet: `function SearchableList({ items }) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [filteredItems, setFilteredItems] = useState(items);

  function handleChange(e) {
    const next = e.target.value;
    setQuery(next); // 🟢 URGENT — input must feel instant

    startTransition(() => {
      // 🟡 NOT URGENT — React can deprioritize this big re-render
      setFilteredItems(items.filter(i => i.name.includes(next)));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <span className="spinner">Updating…</span>}
      <HugeList items={filteredItems} />
    </>
  );
}`
    },
    points: [
      'The function passed to startTransition must be synchronous — it schedules the update, not an async operation.',
      'isPending is true while the new UI is being prepared, false once it is committed.',
      'Transitions are interruptible — newer input automatically supersedes and discards stale in-progress work.'
    ]
  },

  flowDiagram: {
    title: 'Urgent vs. transitioned updates, side by side',
    steps: [
      { icon: '⌨️', label: 'User types a character', note: 'setQuery(next) — URGENT' },
      { icon: '⚡', label: 'Input updates instantly', note: 'No delay, no jank' },
      { icon: '🚦', label: 'startTransition(() => ...)', note: 'Big re-render marked low-priority' },
      { icon: '⏸️', label: 'React renders in background', note: 'Interruptible by newer input' },
      { icon: '✅', label: 'Commits when ready (or discards if stale)', note: 'isPending flips back to false' }
    ]
  },

  realWorldExamples: {
    intro: 'useTransition shines anywhere switching views risks freezing the interface:',
    items: [
      { icon: '🗂️', title: 'Tabs with heavy content', description: 'Switching from Profile to Posts (hundreds of cards) stays instantly responsive — the heavy render happens without blocking the tab indicator.' },
      { icon: '🔎', title: 'Filtering large data tables', description: 'Typing into a filter box for a 10,000-row table keeps the input perfectly smooth while the table re-render is deprioritized.' },
      { icon: '🗺️', title: 'Map and visualization libraries', description: 'Changing a map data layer or chart aggregation wraps the update in a transition to keep pan and zoom responsive.' },
      { icon: '📑', title: 'Paginated feeds', description: 'Jumping between pages of a rich media feed stays snappy to the click, with the new page appearing smoothly once ready.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Keeps the interface responsive to urgent interactions during expensive re-renders.',
      'Provides an automatic isPending flag — no manual loading state wiring.',
      'Interruptible — newer input automatically supersedes stale in-progress work.',
      'Requires no restructuring of your component data flow.'
    ],
    cons: [
      'Only available in React 18+ with concurrent rendering.',
      'Does not make the underlying work faster — it changes scheduling priority, not computation speed.',
      'The callback must be synchronous — easy to misunderstand as "wrap my async fetch".',
      'Adds scheduling concepts that are not always intuitive for beginners.'
    ]
  },

  comparison: {
    title: 'useTransition vs. useDeferredValue',
    left: {
      title: '🚦 useTransition — wraps the STATE UPDATE',
      tone: 'good',
      code: `const [isPending, startTransition] = useTransition();
startTransition(() => setFilteredItems(filter(items, q)));
// You control WHICH update is deprioritized`,
      note: 'Use when you initiate the state update yourself and want to mark it as low-priority — and want a built-in isPending flag.'
    },
    right: {
      title: '⏱️ useDeferredValue — wraps a VALUE',
      tone: 'neutral',
      code: `const deferredQuery = useDeferredValue(query);
<HugeList items={filter(items, deferredQuery)} />
// React decides when to "catch up" the deferred value`,
      note: 'Use when you receive a value from elsewhere and want a lagging version for expensive rendering.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Wrapping the input\'s own state update in a transition',
        wrong: `function handleChange(e) {\n  startTransition(() => setQuery(e.target.value)); // ❌ input now visibly lags\n}`,
        right: `function handleChange(e) {\n  setQuery(e.target.value);                       // ✅ urgent — instant feedback\n  startTransition(() => setFilteredItems(filter(items, e.target.value))); // ✅ deferred\n}`,
        note: 'Controlled input values must update synchronously. Only defer the expensive derived update, never the keystroke-to-screen feedback.'
      },
      {
        title: 'Expecting startTransition to make async code non-blocking',
        wrong: `startTransition(async () => {\n  const data = await fetchData(); // ❌ the async gap isn't part of the transition\n  setData(data);\n});`,
        right: `startTransition(() => setIsRefreshing(true));\nfetchData().then(data => startTransition(() => { setData(data); setIsRefreshing(false); }));`,
        note: 'startTransition wraps synchronous state updates. It does not make a Promise or fetch itself lower-priority.'
      },
      {
        title: 'Using it as a default performance fix',
        note: 'useTransition changes scheduling — it does not make slow code fast. For real speed improvements, use memoization, pagination, or virtualization first.'
      }
    ]
  },

  bestPractices: [
    'Reserve transitions for updates you have observed causing jank — not as a blanket wrapper.',
    'Always keep direct user input (typed text, drag position) on the urgent path.',
    'Use isPending to show a subtle, non-blocking affordance like a faded overlay.',
    'Combine with useMemo or virtualization for the underlying expensive computation.',
    'Profile before and after to confirm the transition actually improves responsiveness.'
  ],

  interviewQuestions: [
    { q: 'What problem does useTransition solve?', a: 'It solves the problem of expensive state updates (like re-rendering a huge filtered list) making the UI feel frozen. You mark specific updates as transitions — low-priority work that React can prepare in the background and interrupt if something more urgent arrives.' },
    { q: 'What does useTransition return, and how do you use each part?', a: 'It returns [isPending, startTransition]. isPending is true while the transitioned update is being prepared — useful for showing a subtle loading indicator. startTransition is a function you call with a synchronous callback containing the state update you want to de-prioritize.' },
    { q: 'Why should you NOT wrap a controlled input\'s own onChange in startTransition?', a: 'Transitioned updates are deprioritized and may be delayed. If you wrap the input\'s own value update in a transition, what the user sees in the box can visibly lag behind their typing, which feels broken. Only wrap the expensive derived work in the transition.' },
    { q: 'Does useTransition make slow code run faster?', a: 'No — it changes WHEN updates are rendered, not how fast the computation runs. A slow filter still takes the same CPU time. useTransition just ensures that work does not block urgent updates. For real speed improvements, use memoization, virtualization, or better algorithms.' },
    { q: 'How is useTransition different from setting a manual isLoading state?', a: 'A manual isLoading flag just toggles a UI affordance. useTransition actually changes React\'s scheduling — it renders the transitioned update at lower priority and can interrupt mid-way if something urgent arrives. isPending is an accurate, automatically-managed reflection of that real scheduling state.' }
  ],

  summary: {
    description: 'useTransition keeps urgent interactions responsive while expensive re-renders happen in the background. It is a scheduling tool, not a speed tool. Keep direct user input on the urgent path, defer only the expensive derived consequences, and pair it with memoization for the best results.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useTransition — the canonical reference with the "Marking a state update as non-blocking" walkthrough.' },
    { label: 'Related topic', note: 'See "useDeferredValue" for the value-oriented sibling Hook, and "Concurrent Features" for the bigger picture.' }
  ]
};

export default useTransitionContent;
