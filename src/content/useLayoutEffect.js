const useLayoutEffectContent = {
  id: 'useLayoutEffect',
  title: 'useLayoutEffect Hook',
  icon: '📐',
  theme: 'amber',
  tagline: 'Like useEffect, but fires synchronously after DOM mutations and before the browser paints — for measuring & adjusting layout.',
  meta: 'Hooks · Advanced',

  whatIsIt: {
    description: [
      'useLayoutEffect has the exact same signature as useEffect — useLayoutEffect(setup, dependencies) — but differs in WHEN it runs: synchronously, immediately after React has updated the DOM, but BEFORE the browser paints those changes to the screen.',
      'This timing makes it the right tool for reading layout from the DOM (measurements, positions, sizes) and synchronously making adjustments — before the user ever sees an intermediate, "wrong" frame.'
    ],
    points: [
      'Syntax is identical to useEffect: useLayoutEffect(() => { /* ... */ return () => { /* cleanup */ }; }, [deps]);',
      'Runs synchronously and BLOCKS the browser from painting until it finishes — unlike useEffect, which runs asynchronously after paint.',
      'Use it specifically when your effect needs to measure something in the DOM and then synchronously change the DOM/state in response, before the user sees anything.'
    ],
    code: { title: 'The defining difference: timing relative to paint', snippet: `useEffect(() => {
  // Runs AFTER the browser paints — user may briefly see the "before" state
  console.log('useEffect: painted already, then this runs');
});

useLayoutEffect(() => {
  // Runs BEFORE the browser paints — any DOM changes here are invisible
  // to the user as a separate "flash"; they're part of the same frame
  console.log('useLayoutEffect: runs first, blocks paint until done');
});` },
    analogy: {
      icon: '🖌️',
      title: 'Real-World Analogy',
      text: '"Imagine a painter about to unveil a portrait to a client. useEffect is like unveiling the painting immediately, then occasionally stepping back up afterward to touch up a stray brushstroke — the client may catch a glimpse of the \'before\' look. useLayoutEffect is the painter finishing every last touch-up BEHIND the curtain, and only pulling it back once the piece is truly final — the client only ever sees the finished result, with no flicker of the in-between state."'
    }
  },

  whyUsed: {
    description: 'Most effects (data fetching, subscriptions, logging) don\'t care about pixel-perfect timing relative to paint — useEffect\'s "after paint" timing is ideal because it doesn\'t block the browser from showing something to the user quickly. But a specific category of work — measuring an element\'s size/position and then synchronously adjusting layout based on it — would cause a visible flicker if done after paint. useLayoutEffect exists precisely to prevent that flicker.',
    points: [
      'Prevents visible flicker/flash when an effect must measure the DOM and then immediately adjust layout or state in response.',
      'Guarantees your DOM reads happen against the freshly-committed DOM, and your DOM writes happen before the user sees anything.',
      'Essential for certain animation and positioning libraries that need to calculate-then-apply transforms in a single visual frame.',
      'Matches the timing of browser APIs like getBoundingClientRect() that need to read post-mutation, pre-paint layout.'
    ]
  },

  whenToUse: {
    description: 'useLayoutEffect is a narrow, specialized tool — reach for it only when you can answer "yes" to: does this effect need to measure the DOM and then synchronously change something before the user sees it?',
    points: [
      'Measuring an element\'s size/position (getBoundingClientRect, offsetHeight) immediately after it renders, then using that measurement to position another element (tooltips, popovers, dropdowns).',
      'Preventing a visible "jump" or "flash" — e.g. adjusting scroll position to keep content stable when new items are prepended to a list.',
      'Synchronizing imperative, layout-affecting third-party libraries (certain charting/animation tools) that must run before paint.',
      'Implementing custom layout/measurement-driven behaviors where any visible flicker would look broken.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'The default should still be useEffect',
      text: '"Reach for useLayoutEffect only when you HAVE a flicker problem caused by measure-then-adjust logic — not preemptively. Because it runs synchronously and blocks painting, overusing it can make your app feel slower and less responsive than useEffect would. The official guidance is blunt: \'useLayoutEffect can hurt performance — prefer useEffect when possible.\'"'
    }
  },

  howItWorks: {
    description: 'After React commits changes to the DOM, but before the browser paints them on screen, React runs all useLayoutEffect callbacks (and their cleanups from the previous render) synchronously, in order — and waits for them to finish before allowing the browser to paint. useEffect callbacks, by contrast, are scheduled to run asynchronously after the paint has already happened.',
    code: {
      title: 'Positioning a tooltip without a visible flicker',
      snippet: `function Tooltip({ targetRef, children }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    // 1) MEASURE the target's position in the DOM (post-mutation, pre-paint)
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // 2) SYNCHRONOUSLY compute & apply the correct position —
    //    before the browser ever paints the "wrong" initial spot
    setPosition({
      top: targetRect.top - tooltipRect.height - 8,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
    });
  }, [targetRef]);

  return <div ref={tooltipRef} className="tooltip" style={position}>{children}</div>;
}`
    },
    points: [
      'Both Hooks share the exact same cleanup-function mechanics — return a function from the callback to clean up before the next run / on unmount.',
      'useLayoutEffect runs on both the client AND during server-rendering warnings — React will warn if you use it in an SSR context without a client-only guard, since there\'s no DOM to measure on the server.',
      'If you genuinely don\'t need to read layout from the DOM, useEffect achieves the same result without blocking the paint — always start there.'
    ]
  },

  flowDiagram: {
    title: 'useEffect vs. useLayoutEffect — where each sits in the render cycle',
    steps: [
      { icon: '⚛️', label: 'React renders & commits DOM', note: 'New elements exist in the DOM' },
      { icon: '📐', label: 'useLayoutEffect runs (sync)', note: 'Measure + adjust — BLOCKS paint' },
      { icon: '🖼️', label: 'Browser paints the screen', note: 'User sees the FINAL, adjusted result' },
      { icon: '🌀', label: 'useEffect runs (async)', note: 'Fires after paint — for non-visual work' }
    ]
  },

  realWorldExamples: {
    intro: 'useLayoutEffect earns its keep specifically in measure-then-adjust scenarios:',
    items: [
      { icon: '💬', title: 'Tooltips, popovers, and dropdown positioning', description: 'Measuring a trigger element\'s position and the popover\'s own size, then placing it precisely — without a single frame of it appearing in the wrong spot first.' },
      { icon: '📜', title: 'Maintaining scroll position when content is prepended', description: 'Chat apps that load older messages above the current view measure the new content\'s height and adjust scrollTop synchronously — so the visible messages don\'t visually "jump".' },
      { icon: '📏', title: 'Auto-resizing text areas / dynamic layout containers', description: 'Measuring text content height and synchronously adjusting a container\'s size to fit — avoiding a visible resize "pop" after the fact.' },
      { icon: '🎬', title: 'Coordinating with animation/transition libraries', description: 'Certain imperative animation libraries need accurate "before" measurements taken synchronously, right before they calculate and apply a transition — a classic useLayoutEffect use case.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Eliminates visible flicker for measure-then-adjust DOM logic — the user only ever sees the final, correct layout.',
      'Guarantees DOM reads happen against fresh, committed DOM and writes complete before paint — precise, predictable timing.',
      'The exact right tool for a specific, well-defined category of layout-measurement problems that useEffect cannot solve cleanly.',
      'Shares useEffect\'s familiar API (setup + cleanup + dependency array) — no new mental model to learn beyond the timing difference.'
    ],
    cons: [
      'Synchronous and paint-blocking — overuse can visibly slow down your app, making it feel less responsive than it would with useEffect.',
      'Not available during server-side rendering (no DOM to measure) — React warns when it\'s used in an SSR path without a client-only guard.',
      'Easy to reach for "to be safe" when useEffect would work identically and without the performance cost — the bar for using it should be a real, observed flicker.',
      'Adds a layer of "why does THIS effect need special timing?" that future readers must understand — comment or name things clearly when you use it.'
    ]
  },

  comparison: {
    title: 'useEffect vs. useLayoutEffect — same API, different timing & guarantees',
    left: {
      title: '🌀 useEffect — async, after paint (the default)',
      tone: 'good',
      code: `useEffect(() => {
  document.title = \`\${count} unread messages\`;
  // Non-visual work: fine to happen "a moment later" —
  // doesn't block the browser from painting first
}, [count]);`,
      note: 'Use for the vast majority of effects: data fetching, subscriptions, logging, setting non-layout state — anything that doesn\'t need to "win the race" against paint.'
    },
    right: {
      title: '📐 useLayoutEffect — sync, before paint (the exception)',
      tone: 'neutral',
      code: `useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setTooltipOffset(-height - 8);
  // Visual work: MUST complete before the user sees anything,
  // or they'll glimpse the wrong position for one frame
}, []);`,
      note: 'Use only for the narrow case of "measure the DOM, then synchronously adjust layout/state before paint" — and only when you\'ve observed a real flicker without it.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Reaching for useLayoutEffect by default "to be safe"',
        wrong: `useLayoutEffect(() => { fetchData().then(setData); }, []); // ❌ blocks paint for something that doesn't need to`,
        right: `useEffect(() => { fetchData().then(setData); }, []); // ✅ data fetching has nothing to do with layout — let paint happen first`,
        note: 'Synchronous, paint-blocking execution is a real cost. Reserve useLayoutEffect for effects that GENUINELY read layout and synchronously adjust it — for everything else (fetching, subscriptions, logging, timers), useEffect is both correct and faster.'
      },
      {
        title: 'Using it during server-side rendering without a guard',
        wrong: `useLayoutEffect(() => {\n  const rect = ref.current.getBoundingClientRect(); // ❌ no DOM exists on the server — warning + crash risk\n}, []);`,
        right: `useEffect(() => {\n  // ✅ runs only on the client, after hydration — or guard with typeof window !== 'undefined'\n  const rect = ref.current.getBoundingClientRect();\n}, []);`,
        note: 'There\'s no DOM (and nothing to measure) during server rendering. React will emit a warning if useLayoutEffect runs in an SSR context — guard layout-measurement logic so it only runs client-side, or use useEffect if the strict pre-paint timing isn\'t actually required.'
      },
      {
        title: 'Doing expensive work inside it that doesn\'t need pre-paint timing',
        note: 'Because useLayoutEffect blocks the browser from painting until it finishes, any slow computation inside it directly delays the user from seeing ANYTHING new. Keep useLayoutEffect callbacks fast and focused — measure, compute, adjust — and move anything that doesn\'t need that exact timing into a separate useEffect.'
      }
    ]
  },

  bestPractices: [
    'Default to useEffect. Switch to useLayoutEffect only after observing an actual visible flicker caused by measure-then-adjust DOM logic.',
    'Keep useLayoutEffect callbacks small, fast, and focused purely on measurement + synchronous adjustment — move anything else to useEffect.',
    'Guard DOM-measurement code so it never runs during server-side rendering (no DOM exists there) — or keep such logic in useEffect/client-only boundaries.',
    'Pair it with useRef for the elements you need to measure — getBoundingClientRect(), offsetHeight/offsetWidth, scrollHeight are the typical reads.',
    'Document WHY a particular effect needs pre-paint timing — it\'s the kind of subtle decision that benefits a future reader (or your future self).'
  ],

  interviewQuestions: [
    { q: 'What is the key difference between useEffect and useLayoutEffect?', a: 'They share the exact same API (setup function, optional cleanup, dependency array) — the difference is purely WHEN they run relative to the browser painting. useEffect runs asynchronously, AFTER the browser has painted the updated DOM to the screen. useLayoutEffect runs synchronously, immediately after React commits DOM changes but BEFORE the browser paints — and it blocks that paint until it finishes.' },
    { q: 'Why would using useEffect (instead of useLayoutEffect) for a "measure and reposition" tooltip cause a visible flicker?', a: 'Because useEffect runs AFTER the browser has already painted the screen. If your effect measures an element\'s position and then calls setState to reposition it, the user briefly sees the tooltip in its initial (wrong) position during the first paint, and then sees it "jump" to the correct position once the effect runs and triggers a re-render — a visible flicker. useLayoutEffect performs the measure-and-adjust cycle BEFORE the first paint, so the user only ever sees the final, correctly-positioned result.' },
    { q: 'Why does the React team recommend defaulting to useEffect and reaching for useLayoutEffect only when necessary?', a: 'Because useLayoutEffect runs synchronously and BLOCKS the browser from painting until it completes — meaning any slow work inside it directly delays what the user sees. useEffect, running asynchronously after paint, doesn\'t carry this cost, so for the vast majority of effects (data fetching, subscriptions, logging, non-layout state updates) it\'s both simpler and better for perceived performance. useLayoutEffect should be reserved for the specific, narrow case where its pre-paint timing genuinely prevents a visible problem.' },
    { q: 'Why might using useLayoutEffect cause a warning during server-side rendering, and how would you handle that?', a: 'Server-side rendering produces HTML with no real browser DOM to measure — there\'s no layout to read and no paint to synchronize with, so useLayoutEffect\'s defining behavior is meaningless (and potentially erroring) in that context; React emits a warning to flag the mismatch. The fix is to ensure layout-measurement code only runs on the client — e.g. by keeping it in an effect that naturally only fires after hydration, or guarding it so it\'s skipped during the server render pass.' },
    { q: 'Give a concrete example of when useLayoutEffect is the right tool, and explain why useEffect wouldn\'t work as well there.', a: 'Repositioning a tooltip based on its target element\'s measured size and position is a textbook case: you need to read the freshly-rendered DOM (getBoundingClientRect) and then SYNCHRONOUSLY write an adjusted position before the user sees anything. With useEffect, that read-then-write cycle happens after the browser has already painted the tooltip in its default (wrong) spot — producing a visible jump. useLayoutEffect performs the same read-then-write cycle before paint, so the very first thing the user sees is the correctly-positioned tooltip, with zero flicker.' }
  ],

  summary: {
    description: 'useLayoutEffect is useEffect\'s synchronous, pre-paint sibling — purpose-built for the narrow but important case of "measure the DOM, then synchronously adjust layout before the user sees anything". It prevents visible flicker in tooltips, scroll-position preservation, and similar measure-then-adjust scenarios — but its paint-blocking nature means useEffect should remain your default, with useLayoutEffect reserved for cases where you\'ve observed a real flicker it specifically fixes.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useLayoutEffect — the canonical reference, including the explicit guidance "useLayoutEffect can hurt performance — prefer useEffect when possible".' },
    { label: 'Related topic', note: 'See "useEffect" for the foundational Hook this one specializes, and "useRef" for the DOM-measurement pattern they\'re typically combined with.' }
  ]
};

export default useLayoutEffectContent;
