const useDeferredValueContent = {
  id: 'useDeferredValue',
  title: 'useDeferredValue Hook',
  icon: '⏱️',
  theme: 'blue',
  tagline: 'Get a "lagging behind" copy of a value that updates only once the urgent work settles down.',
  meta: 'Hooks · Concurrent React',

  whatIsIt: {
    description: [
      'useDeferredValue takes a value and returns a deferred copy of it that may "lag behind" the real one during fast updates. React keeps the old value on screen for expensive re-renders until it can catch up in the background — without you having to manage timers or extra state.',
      'It\'s conceptually similar to debouncing or throttling a value — but instead of a fixed time delay, React decides *when* to update the deferred value based on what the device can keep up with, integrating naturally with concurrent rendering.'
    ],
    points: [
      'Syntax: const deferredValue = useDeferredValue(value);',
      'On the initial render, the deferred value equals the original value.',
      'On updates, React first re-renders with the OLD deferred value (keeping things responsive), then schedules a background re-render with the NEW value once resources allow.'
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
      text: '"Imagine watching a live caption track on a video call — it doesn\'t update letter-by-letter in perfect sync with the speaker; it shows the previous sentence smoothly while quietly catching up to the latest words as soon as it can keep pace. useDeferredValue works the same way: the UI keeps showing a coherent \'previous\' version smoothly, then \'catches up\' to the latest value the moment the system has spare capacity — instead of stuttering trying to keep perfectly in sync."'
    }
  },

  whyUsed: {
    description: 'When a fast-changing value (like search text) feeds directly into an expensive render (like a 5,000-row results list), re-rendering on every change can make the whole page feel sluggish. useDeferredValue lets the *expensive consumer* of that value update at its own pace, while the value\'s direct producer (the input) stays perfectly responsive.',
    points: [
      'Keeps expensive renders from blocking urgent updates — without you needing to control where the original state update happens.',
      'Particularly useful when you *receive* a fast-changing value (e.g. via props) and can\'t wrap its origin in startTransition yourself.',
      'Lets React show stale-but-consistent content smoothly rather than freezing or flickering through every intermediate state.',
      'Integrates with Suspense — React can show old content while new content (including data) is loading in the background.'
    ]
  },

  whenToUse: {
    description: 'Reach for useDeferredValue when a value changes quickly and feeds into a render that\'s known to be expensive — and you\'d rather let that render "lag a little" than have it block the rest of the UI.',
    points: [
      'You receive a fast-changing value as a prop (so you can\'t wrap its setState in startTransition yourself).',
      'You want to keep showing the previous, consistent results while new ones are being prepared, rather than a jarring blank/loading flash.',
      'A part of the UI is expensive to re-render and doesn\'t need to be perfectly in sync with every keystroke — search results, previews, visualizations.',
      'You want behavior similar to debouncing/throttling, but adaptive to the user\'s actual device performance rather than a fixed delay.'
    ],
    analogy: {
      icon: '🆚',
      title: 'useDeferredValue vs. debouncing/throttling',
      text: '"Debouncing/throttling use FIXED time delays you choose by hand — e.g. always wait 300ms. useDeferredValue instead asks React to update the value \'as soon as resources allow\', adapting automatically to the actual device and current workload — faster on powerful machines, more patient on slow ones — and it integrates with React\'s rendering and Suspense, rather than working purely on a wall-clock timer."'
    }
  },

  howItWorks: {
    description: 'On each render, React compares the deferred value to the latest real value. If they differ, React first re-renders with the OLD deferred value (so the UI stays responsive immediately), then — in the background, at lower priority — re-renders again with the new value once it can do so without blocking urgent work.',
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
      'Comparing `value !== deferredValue` gives you an easy "is this content stale/updating?" signal — handy for a dimmed/pending visual treatment.',
      'Pairing useDeferredValue with React.memo on the expensive child prevents it from re-rendering at all until the deferred value actually changes.',
      'Unlike a fixed-delay debounce, the "lag" adapts to the device — fast machines catch up almost immediately; slow ones lean more on the old value to stay smooth.'
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
    intro: 'useDeferredValue is the right tool whenever "smoothness" matters more than "perfect sync" for an expensive view:',
    items: [
      { icon: '🔎', title: 'Search results panels', description: 'A results list backed by a large in-memory dataset stays visually smooth while typing — showing the previous results until the new set is ready, instead of stutter-rendering on every keystroke.' },
      { icon: '🖼️', title: 'Live previews (Markdown, code, design tools)', description: 'A Markdown editor\'s rendered preview pane can lag a beat behind fast typing, staying smooth, while the raw text editor itself remains perfectly instantaneous.' },
      { icon: '📊', title: 'Data visualizations driven by sliders/inputs', description: 'Dragging a slider that re-renders a complex chart can defer the chart\'s data prop — keeping the slider buttery-smooth while the chart catches up shortly after.' },
      { icon: '🧭', title: 'Autocomplete / suggestion dropdowns over large datasets', description: 'Suggestions computed from thousands of entries can lag slightly behind keystrokes without harming usability — users barely perceive a few-frame difference in a dropdown.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Keeps expensive consumers of fast-changing values from blocking the rest of the UI — without restructuring where the state lives.',
      'Adapts automatically to device performance — no fixed delay to hand-tune like with debouncing.',
      'Provides an easy staleness signal (value !== deferredValue) for subtle "updating…" visual treatments.',
      'Composes naturally with React.memo and Suspense for smooth, coherent loading experiences.'
    ],
    cons: [
      'Only meaningful in environments with concurrent rendering (React 18+) — and only helps if the deferred consumer is genuinely expensive to render.',
      'Doesn\'t reduce the amount of work done — a slow computation is still slow; it only changes when/how it\'s scheduled relative to urgent updates.',
      'The "lag" is intentionally not deterministic/timed — harder to reason about precisely than a fixed debounce delay if your use case truly needs predictable timing.',
      'Easy to reach for as a default "make it fast" fix when the real win would come from memoization, virtualization, or reducing dataset size.'
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
      note: 'Use when you can\'t (or don\'t want to) wrap the original update — you just want a smoother-lagging copy of the value you have.'
    },
    right: {
      title: '🚦 useTransition — you trigger the UPDATE',
      tone: 'neutral',
      code: `const [isPending, startTransition] = useTransition();
function handleClick() {
  startTransition(() => setTab(next)); // you control this
}`,
      note: 'Use when you initiate the state change yourself and want to mark that specific update as low priority — plus get a built-in pending flag.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Expecting useDeferredValue to reduce computation cost',
        wrong: `const deferredQuery = useDeferredValue(query);\nconst results = searchMillionRows(deferredQuery); // ❌ still scans a million rows — just less often`,
        right: `const deferredQuery = useDeferredValue(query);\nconst results = useMemo(() => searchMillionRows(deferredQuery), [deferredQuery]); // ✅ memoized AND deferred`,
        note: 'useDeferredValue changes WHEN a render happens relative to urgent work — it doesn\'t make the render itself cheaper. Pair it with useMemo (and good algorithms/data structures) to actually reduce the cost of the work being deferred.'
      },
      {
        title: 'Deferring a value that needs to be perfectly in sync (e.g. form validation)',
        wrong: `const deferredEmail = useDeferredValue(email);\n<ErrorMessage valid={isValidEmail(deferredEmail)} /> {/* ❌ validation message lags behind input — confusing */}`,
        right: `<ErrorMessage valid={isValidEmail(email)} /> {/* ✅ validation feedback should always be immediate and accurate */}`,
        note: 'Reserve deferring for content where a brief lag is genuinely imperceptible or harmless (large lists, previews, charts) — never for feedback the user needs to trust as accurate right now, like form validation or error messages.'
      },
      {
        title: 'Forgetting to memoize the expensive child',
        note: 'If the component receiving the deferred value isn\'t memoized (or doesn\'t itself memoize its expensive computation), it may still re-render and recompute on every parent render — regardless of whether the deferred value actually changed. useDeferredValue\'s benefit is best realized in combination with React.memo / useMemo on the consuming side.'
      }
    ]
  },

  bestPractices: [
    'Use it specifically for values feeding *expensive, non-critical-timing* renders — large lists, previews, visualizations — never for validation/feedback that must stay perfectly in sync.',
    'Pair it with useMemo (on the computation) and React.memo (on the component) — the deferred value alone doesn\'t make anything faster or skip re-renders by itself.',
    'Use `value !== deferredValue` as a clean signal to apply a subtle "updating" visual treatment (slight opacity dim, faint spinner) for extra polish.',
    'Reach for it when you receive the fast-changing value from elsewhere (e.g. props) — if you own the state update yourself, useTransition often gives you more direct control plus a pending flag.',
    'Profile to confirm there\'s a real perceptible benefit — for cheap renders, the deferred value will simply equal the real one almost instantly, adding indirection without payoff.'
  ],

  interviewQuestions: [
    { q: 'What does useDeferredValue do, conceptually?', a: 'It returns a "deferred" copy of a value that may temporarily lag behind the real one during fast updates. React keeps showing the old deferred value (and whatever expensive UI depends on it) smoothly, and updates it to the latest value in the background once it can do so without blocking more urgent rendering work — conceptually similar to an adaptive debounce built into React\'s scheduler.' },
    { q: 'How is useDeferredValue different from manually debouncing a value with setTimeout?', a: 'A manual debounce uses a FIXED time delay you choose by hand (e.g. always wait 300ms), regardless of the device\'s actual performance. useDeferredValue instead asks React to update the value "as soon as resources allow" — adapting automatically to the current device and workload (catching up almost instantly on fast machines, lagging more on slow ones), and integrating directly with React\'s concurrent rendering and Suspense rather than running on a separate wall-clock timer.' },
    { q: 'Does useDeferredValue make an expensive computation faster?', a: 'No — it changes WHEN that computation runs relative to more urgent updates, not how long it takes to run. A search over a million rows is still a search over a million rows; useDeferredValue just lets React defer running it (and re-rendering its result) until urgent work is handled, keeping the interface responsive in the meantime. To actually reduce the cost, you still need techniques like memoization, better algorithms, virtualization, or reducing the dataset size.' },
    { q: 'How would you show users that content is "updating" while a deferred value catches up?', a: 'Compare the live value to its deferred counterpart — `const isStale = query !== deferredQuery` — and use that boolean to apply a subtle visual treatment, like reducing the opacity of the stale content or showing a small inline spinner, while the new content is being prepared in the background. This gives users a gentle, non-blocking signal that fresh results are on their way.' },
    { q: 'When would you choose useDeferredValue over useTransition?', a: 'Choose useDeferredValue when you receive a fast-changing value (often via props) and can\'t — or don\'t want to — control how its underlying state update is scheduled; you just want a smoother-lagging copy of that value for an expensive consumer. Choose useTransition when YOU initiate the state update yourself and want to explicitly mark it as low-priority, while also getting a built-in `isPending` flag to drive loading indicators.' }
  ],

  summary: {
    description: 'useDeferredValue gives you a "smoothly lagging" copy of a fast-changing value — letting expensive consumers (big lists, previews, charts) update at a pace the device can handle, without freezing the rest of the interface or requiring you to control the original state update. It\'s an adaptive alternative to fixed-delay debouncing that plugs directly into React\'s concurrent rendering — pair it with useMemo/React.memo for real performance wins, and reserve it for content where a brief lag is genuinely harmless.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useDeferredValue — the canonical reference, including the "Showing stale content while fresh content is loading" pattern with isStale.' },
    { label: 'Related topic', note: 'See "useTransition" for the update-oriented sibling Hook, and "Debouncing in React" for the classic fixed-delay alternative this Hook adaptively replaces.' }
  ]
};

export default useDeferredValueContent;
