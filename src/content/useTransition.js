const useTransitionContent = {
  id: 'useTransition',
  title: 'useTransition Hook',
  icon: '🚦',
  theme: 'purple',
  tagline: 'Mark a state update as "non-urgent" so React can keep the UI responsive while it happens.',
  meta: 'Hooks · Concurrent React',

  whatIsIt: {
    description: [
      'useTransition lets you mark certain state updates as "transitions" — non-urgent updates that React can prepare in the background without blocking the screen from responding to more urgent things, like typing or clicking.',
      'It returns [isPending, startTransition]: a boolean telling you whether the transition is still being prepared, and a function you wrap around the state update you want to de-prioritize.'
    ],
    points: [
      'Syntax: const [isPending, startTransition] = useTransition();',
      'Wrap the "expensive" state update: startTransition(() => setTab(nextTab));',
      'React renders the transition update in the background and can interrupt it if something more urgent (another keystroke, a click) comes in — keeping the interface responsive.'
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
      text: '"Imagine a barista who gets both a \'quick coffee\' order and a \'complex 12-step latte art\' order at once. A bad barista starts the latte first and makes the coffee customer wait. A good barista (React with useTransition) starts the latte in the background, but immediately drops it the instant a new urgent order comes in — always serving the most pressing thing first, while still making progress on the slower job whenever there\'s a gap."'
    }
  },

  whyUsed: {
    description: 'Some state updates trigger expensive re-renders (switching tabs that render huge lists, applying filters across thousands of rows). If treated with the same urgency as a keystroke, they can make the whole UI feel frozen — typing lags, clicks don\'t register. useTransition tells React "this update can wait a beat if something more urgent comes up".',
    points: [
      'Keeps the UI responsive to urgent input (typing, clicking, hovering) even while a big re-render is in progress.',
      'Lets React interrupt, deprioritize, and even abandon in-progress renders for stale transitions when newer input arrives.',
      'Provides a built-in `isPending` flag so you can show a subtle loading indicator without manually managing loading state.',
      'Avoids the "frozen screen" feeling that comes from large synchronous re-renders blocking the main thread.'
    ]
  },

  whenToUse: {
    description: 'Reach for useTransition when a specific state update is known to trigger a slow re-render, and you want the rest of the UI to stay snappy while it resolves.',
    points: [
      'Switching between tabs/views where the new view renders a large amount of content.',
      'Applying search/filter criteria that re-render large lists or tables.',
      'Any state update that you\'ve observed (via the Profiler) causes visible jank or input lag.',
      'When you want to show a "pending" state for an update without manually wiring up isLoading booleans.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use useTransition',
      text: '"Don\'t use it for controlled input values themselves — text typed into an <input> must update synchronously, or the input will visibly lag behind the user\'s typing. Wrap the EXPENSIVE DERIVED work (e.g. re-rendering a filtered list) in the transition, while keeping the input\'s own state update immediate and untransitioned."'
    }
  },

  howItWorks: {
    description: 'startTransition(callback) tells React: "the state updates inside this callback are not urgent — render them, but feel free to pause, throw away, or restart this work if something more pressing shows up". React then renders the result in the background; once ready, it commits it to the screen — or discards it if newer input has made it stale.',
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
      'The function passed to startTransition must be synchronous — it schedules the *update*, not an async operation; data fetching itself isn\'t "transitioned" by this Hook.',
      'isPending becomes true while the new UI is being prepared in the background, and false once it\'s committed — perfect for a subtle, automatic loading affordance.',
      'Transitions are interruptible: if the user types again before a transition finishes, React abandons the stale one and starts a fresh one with the latest input.'
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
    intro: 'useTransition shines anywhere "switching views" risks freezing the interface:',
    items: [
      { icon: '🗂️', title: 'Tabs that render heavy content', description: 'Switching from "Profile" to "Posts" (which renders hundreds of cards) stays instantly responsive to the click — the heavy render happens without blocking the tab indicator from updating immediately.' },
      { icon: '🔎', title: 'Filtering large data tables', description: 'Typing into a filter box for a 10,000-row table keeps the input itself perfectly smooth, while the (slow) table re-render is deprioritized and shown with a subtle pending indicator.' },
      { icon: '🗺️', title: 'Map / visualization libraries', description: 'Changing a map\'s data layer or a chart\'s aggregation level can trigger expensive redraws — wrapping the state update in a transition keeps pan/zoom interactions responsive throughout.' },
      { icon: '📑', title: 'Paginated or infinite-scrolling feeds', description: 'Jumping between pages of a feed that renders rich media cards stays snappy to the click, with the new page\'s content appearing smoothly once ready.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Keeps the interface responsive to urgent interactions even during expensive re-renders — directly improves perceived performance.',
      'Provides an automatic, accurate `isPending` flag — no manual isLoading state wiring for render-level transitions.',
      'Interruptible by design — newer input automatically supersedes and discards stale in-progress work.',
      'Requires no restructuring of your component\'s data flow — just wrap the slow update.'
    ],
    cons: [
      'Only available in React 18+ and only effective with concurrent rendering — won\'t help in environments/setups that don\'t support it.',
      'Doesn\'t make the underlying work *faster* — it changes *scheduling priority*, not algorithmic complexity; a genuinely slow computation should still be optimized (useMemo, virtualization, web workers).',
      'The callback passed to startTransition must be synchronous — it\'s easy to misunderstand it as "wrap my async fetch", which it does not do.',
      'Adds a layer of "scheduling" reasoning to your mental model — not always intuitive for newcomers to concurrent React.'
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
      note: 'Use when you receive a value (often a prop, or from elsewhere) and want a "lagging behind" version of it for expensive rendering — without controlling the update itself.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Wrapping the input\'s own state update in a transition',
        wrong: `function handleChange(e) {\n  startTransition(() => setQuery(e.target.value)); // ❌ input now visibly lags behind typing\n}`,
        right: `function handleChange(e) {\n  setQuery(e.target.value);                       // ✅ urgent — instant feedback\n  startTransition(() => setFilteredItems(filter(items, e.target.value))); // ✅ deferred\n}`,
        note: 'Controlled input values must update synchronously and immediately — deferring them makes typing feel broken. Only defer the EXPENSIVE DERIVED update, never the keystroke-to-screen feedback loop.'
      },
      {
        title: 'Expecting startTransition to make async code "non-blocking"',
        wrong: `startTransition(async () => {\n  const data = await fetchData(); // ❌ the async gap isn't part of the transition\n  setData(data);\n});`,
        right: `startTransition(() => setIsRefreshing(true));\nfetchData().then(data => startTransition(() => { setData(data); setIsRefreshing(false); }));`,
        note: 'startTransition wraps SYNCHRONOUS state updates that determine what to render — it does not make a Promise or fetch itself lower-priority. (React 19\'s "Actions" / useActionState handle async transitions more directly — see the Server Components / Concurrent Features topics.)'
      },
      {
        title: 'Reaching for it as a default performance fix',
        note: 'useTransition changes WHEN/HOW updates are scheduled — it does not make slow code fast. If a computation is genuinely expensive, first look at memoization (useMemo), reducing the amount of work (pagination, virtualization), or moving heavy computation off the main thread — then layer scheduling improvements like useTransition on top.'
      }
    ]
  },

  bestPractices: [
    'Reserve transitions specifically for updates you\'ve observed causing jank — not as a blanket wrapper around every setState call.',
    'Always keep the user\'s direct input (typed text, drag position) on the urgent path; defer only the expensive, derived consequence.',
    'Use the built-in `isPending` to show a subtle, non-blocking affordance (a faded overlay, a small spinner) rather than a full-screen loading state.',
    'Combine with useMemo/virtualization for the underlying expensive computation — useTransition improves *scheduling*, good algorithms improve *speed*; you usually want both.',
    'Profile before and after with React DevTools\' Profiler to confirm the transition is actually improving perceived responsiveness in your specific case.'
  ],

  interviewQuestions: [
    { q: 'What problem does useTransition solve, and how does it solve it?', a: 'It solves the problem of expensive state updates (e.g. re-rendering a huge filtered list) making the UI feel frozen or laggy to more urgent interactions like typing or clicking. It solves this by letting you mark specific updates as "transitions" — low-priority work that React can prepare in the background, interrupt, or discard if something more urgent comes in — so the rest of the interface stays responsive throughout.' },
    { q: 'What does useTransition return, and how do you use each part?', a: 'It returns a tuple [isPending, startTransition]. `isPending` is a boolean that\'s true while the transitioned update is still being prepared — useful for showing a subtle loading indicator. `startTransition` is a function you call with a synchronous callback containing the state update(s) you want to mark as non-urgent — e.g. startTransition(() => setFilteredItems(...)).' },
    { q: 'Why should you NOT wrap a controlled input\'s own onChange state update in startTransition?', a: 'Because transitioned updates are intentionally deprioritized and may be delayed or discarded — if you wrap the input\'s own value update in a transition, what the user sees in the box can visibly lag behind their typing, which feels broken. The correct pattern is to update the input\'s state immediately/urgently, and wrap only the expensive DERIVED work (like re-filtering a large list) in the transition.' },
    { q: 'Does useTransition make slow code run faster?', a: 'No — it changes WHEN and in what order updates are rendered (scheduling/priority), not how fast the underlying computation runs. A genuinely slow filter or render still takes the same amount of CPU time; useTransition just ensures that work doesn\'t block more urgent updates from being shown first, and can be abandoned if it becomes stale. For real speed improvements, you still need techniques like memoization, virtualization, or algorithmic optimization.' },
    { q: 'How is useTransition different from simply setting a manual isLoading state around an expensive operation?', a: 'A manual isLoading flag just toggles a UI affordance — it doesn\'t change how or when React schedules the underlying render, so a big synchronous re-render can still block the main thread and freeze input. useTransition actually changes the SCHEDULING: React renders the transitioned update at lower priority, can interrupt it mid-way if something more urgent arrives, and can discard stale in-progress renders entirely — `isPending` is then an accurate, automatically-managed reflection of that real scheduling state, not just a manually-toggled flag.' }
  ],

  summary: {
    description: 'useTransition lets you tell React "this update can wait" — keeping urgent interactions (typing, clicking) instantly responsive while expensive re-renders happen in the background, complete with a built-in pending indicator. It\'s a scheduling tool, not a speed tool: keep direct user input on the urgent path, defer only the expensive derived consequences, and pair it with real optimizations (memoization, virtualization) for the best of both worlds.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useTransition — the canonical reference, including the "Marking a state update as a non-blocking transition" walkthrough.' },
    { label: 'Related topic', note: 'See "useDeferredValue" for the value-oriented sibling Hook, and "Concurrent Features" for the bigger picture of React\'s concurrent rendering model.' }
  ]
};

export default useTransitionContent;
