const useDeferredValueContent = {
  id: 'useDeferredValue',
  title: 'useDeferredValue Hook',
  icon: '⏱️',
  theme: 'blue',
  tagline: 'useDeferredValue gives you a copy of a value that updates only when the urgent work settles.',
  meta: 'Hooks · Concurrent React',

  whatIsIt: {
    description: [
      'useDeferredValue takes a value and returns a deferred copy that may "lag behind" the real one during fast updates. React keeps showing the old value for expensive re-renders until it can catch up in the background.',
      'It is similar to debouncing — but instead of a fixed time delay, React decides when to update based on what the device can handle.'
    ],
    points: [
      'Syntax: const deferredValue = useDeferredValue(value);',
      'On the initial render, the deferred value equals the real value.',
      'On updates, React first re-renders with the OLD deferred value, then schedules a background re-render with the new value.'
    ],
    code: { title: 'The basic shape', snippet: `function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {/* This list "lags behind" smoothly during fast typing */}
      <SearchResults query={deferredQuery} />
    </>
  );
}` },
    analogy: {
      icon: '🌊',
      title: 'Real-World Analogy',
      text: '"Imagine live captions on a video call. They do not update letter by letter in perfect sync with the speaker. They show the previous sentence smoothly while catching up to the latest words. useDeferredValue works the same way — the UI shows a coherent previous version, then catches up when the system has spare capacity."'
    }
  },

  whyUsed: {
    description: 'When a fast-changing value (like search text) feeds into an expensive render (like a 5,000-row results list), re-rendering on every change can make the whole page feel slow.',
    points: [
      'Keeps expensive renders from blocking urgent updates.',
      'Useful when you receive a fast-changing value via props and cannot wrap its setState in startTransition.',
      'Lets React show stale-but-consistent content smoothly rather than flickering.',
      'Integrates with Suspense — shows old content while new content loads in the background.'
    ]
  },

  whenToUse: {
    description: 'Use useDeferredValue when a fast-changing value feeds into an expensive render and you would rather let that render lag slightly than block the rest of the UI.',
    points: [
      'You receive a fast-changing value as a prop and cannot wrap its setState in startTransition.',
      'You want to keep showing previous results while new ones are being prepared.',
      'A part of the UI is expensive to re-render — search results, previews, charts.',
      'You want adaptive behavior instead of a fixed debounce delay.'
    ],
    analogy: {
      icon: '🆚',
      title: 'useDeferredValue vs. debouncing',
      text: '"Debouncing uses a FIXED time delay you choose — always wait 300ms. useDeferredValue asks React to update the value \'as soon as resources allow\', adapting to the actual device — faster on powerful machines, more patient on slow ones. It integrates with React\'s rendering and Suspense rather than a wall-clock timer."'
    }
  },

  howItWorks: {
    description: 'React compares the deferred value to the latest real value. If they differ, React first re-renders with the OLD deferred value to stay responsive, then schedules a background re-render with the new value once it can do so without blocking urgent work.',
    code: {
      title: 'Visibly "stale-but-smooth" search results',
      snippet: `function SearchResults({ query }) {
  // Memoize the expensive list so re-renders triggered by OTHER state
  // don't re-filter — only a genuine query change does
  const results = useMemo(() => searchHugeDataset(query), [query]);
  return <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>;
}

function SearchPage({ allItems }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // Optional: dim the stale results while React catches up
  const isStale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SearchResults query={deferredQuery} />
      </div>
    </>
  );
}`
    },
    points: [
      'Comparing value !== deferredValue gives you a clear "content is stale" signal for a visual treatment.',
      'Pair with React.memo on the expensive child — it will not re-render until the deferred value actually changes.',
      'Unlike a fixed debounce, the lag adapts to the device — fast machines catch up almost immediately.'
    ]
  },

  flowDiagram: {
    title: 'How the deferred value "catches up" to the real one',
    steps: [
      { icon: '⌨️', label: 'query changes rapidly', note: 'User typing fast' },
      { icon: '⚡', label: 'Input re-renders instantly', note: 'Always shows latest `query`' },
      { icon: '🐢', label: 'deferredQuery lags behind', note: 'Still shows previous value' },
      { icon: '🔄', label: 'Background render scheduled', note: 'React tries the new value when free' },
      { icon: '✅', label: 'deferredQuery catches up', note: 'Expensive view updates smoothly' }
    ]
  },

  realWorldExamples: {
    intro: 'useDeferredValue is the right tool when smoothness matters more than perfect sync for an expensive view:',
    items: [
      { icon: '🔎', title: 'Search results panels', description: 'A large in-memory dataset stays visually smooth while typing — showing previous results until the new set is ready.' },
      { icon: '🖼️', title: 'Live previews (Markdown, code)', description: 'A Markdown editor\'s rendered preview pane lags a beat behind fast typing while the raw text editor stays perfectly instant.' },
      { icon: '📊', title: 'Data visualizations with sliders', description: 'Dragging a slider that re-renders a complex chart defers the chart\'s data prop — the slider stays buttery-smooth.' },
      { icon: '🧭', title: 'Autocomplete over large datasets', description: 'Suggestions computed from thousands of entries can lag slightly — users barely perceive a few-frame difference in a dropdown.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Keeps expensive consumers from blocking the rest of the UI — without restructuring state.',
      'Adapts automatically to device performance — no fixed delay to hand-tune.',
      'Easy staleness signal (value !== deferredValue) for a subtle "updating" visual.',
      'Composes naturally with React.memo and Suspense.'
    ],
    cons: [
      'Only meaningful in environments with concurrent rendering (React 18+).',
      'Does not reduce the amount of work — a slow computation is still slow.',
      'The lag is not deterministic — harder to reason about than a fixed debounce if timing matters.',
      'Easy to reach for when memoization, virtualization, or smaller datasets would actually help.'
    ]
  },

  comparison: {
    title: 'useDeferredValue vs. useTransition — pick based on who controls the update',
    left: {
      title: '⏱️ useDeferredValue — you have a VALUE',
      tone: 'good',
      code: `// You receive \`query\` (e.g. via props) and can't
// control how its setState is scheduled
const deferredQuery = useDeferredValue(query);
<ExpensiveList query={deferredQuery} />`,
      note: 'Use when you cannot or do not want to wrap the original update — you just want a smoother-lagging copy of the value.'
    },
    right: {
      title: '🚦 useTransition — you trigger the UPDATE',
      tone: 'neutral',
      code: `const [isPending, startTransition] = useTransition();
function handleClick() {
  startTransition(() => setTab(next)); // you control this
}`,
      note: 'Use when you initiate the state change yourself and want to mark it as low priority — plus get a built-in pending flag.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Expecting useDeferredValue to reduce computation cost',
        wrong: `const deferredQuery = useDeferredValue(query);\nconst results = searchMillionRows(deferredQuery); // ❌ still scans a million rows`,
        right: `const deferredQuery = useDeferredValue(query);\nconst results = useMemo(() => searchMillionRows(deferredQuery), [deferredQuery]); // ✅ memoized AND deferred`,
        note: 'useDeferredValue changes WHEN a render happens — it does not make the render cheaper. Pair it with useMemo to actually reduce the cost.'
      },
      {
        title: 'Deferring a value that needs to be perfectly in sync',
        wrong: `const deferredEmail = useDeferredValue(email);\n<ErrorMessage valid={isValidEmail(deferredEmail)} /> {/* ❌ validation lags behind */}`,
        right: `<ErrorMessage valid={isValidEmail(email)} /> {/* ✅ validation should always be immediate */}`,
        note: 'Reserve deferring for content where a brief lag is harmless — never for validation or error messages the user needs to trust right now.'
      },
      {
        title: 'Forgetting to memoize the expensive child',
        note: 'If the component receiving the deferred value is not memoized, it may still re-render on every parent render regardless. useDeferredValue works best combined with React.memo and useMemo on the consuming side.'
      }
    ]
  },

  bestPractices: [
    'Use it for values feeding expensive, non-critical-timing renders — large lists, previews, charts.',
    'Pair with useMemo (on the computation) and React.memo (on the component).',
    'Use value !== deferredValue as a signal to apply a subtle "updating" visual treatment.',
    'Reach for it when you receive the fast-changing value via props — if you own the update, useTransition gives more direct control.',
    'Profile first to confirm there is a real perceptible benefit.'
  ],

  interviewQuestions: [
    { q: 'What does useDeferredValue do?', a: 'It returns a deferred copy of a value that may temporarily lag behind the real one. React keeps showing the old deferred value smoothly, then updates it in the background once it can do so without blocking urgent rendering. It is like an adaptive debounce built into React\'s scheduler.' },
    { q: 'How is useDeferredValue different from manually debouncing with setTimeout?', a: 'A manual debounce uses a fixed time delay you choose by hand. useDeferredValue asks React to update the value "as soon as resources allow" — adapting automatically to the current device. It also integrates directly with React\'s concurrent rendering and Suspense instead of running on a wall-clock timer.' },
    { q: 'Does useDeferredValue make an expensive computation faster?', a: 'No — it changes WHEN that computation runs relative to urgent updates, not how long it takes. A search over a million rows is still a search over a million rows. Pair it with useMemo and good algorithms to actually reduce the cost.' },
    { q: 'How do you show users that content is "updating"?', a: 'Compare the live value to its deferred copy — const isStale = query !== deferredQuery. Use that boolean to apply a subtle visual treatment like reducing the opacity of the stale content while the new content is being prepared.' },
    { q: 'When would you choose useDeferredValue over useTransition?', a: 'Choose useDeferredValue when you receive a fast-changing value via props and cannot control how its setState is scheduled. Choose useTransition when YOU initiate the state update yourself and want to mark it as low-priority, plus get a built-in isPending flag.' }
  ],

  summary: {
    description: 'useDeferredValue gives you a smoothly lagging copy of a fast-changing value. It lets expensive consumers update at a pace the device can handle without freezing the rest of the interface. Pair it with useMemo and React.memo, and reserve it for content where a brief lag is harmless.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useDeferredValue — the canonical reference including the isStale pattern.' },
    { label: 'Related topic', note: 'See "useTransition" for the update-oriented sibling, and "Debouncing in React" for the classic fixed-delay alternative.' }
  ]
};

export default useDeferredValueContent;
