const useLayoutEffectContent = {
  id: 'useLayoutEffect',
  title: 'useLayoutEffect Hook',
  icon: '📐',
  theme: 'amber',
  tagline: 'useLayoutEffect runs before the browser paints — use it to measure and adjust the DOM without a visible flicker.',
  meta: 'Hooks · Advanced',

  whatIsIt: {
    description: [
      'useLayoutEffect works just like useEffect, but it runs synchronously after React updates the DOM and BEFORE the browser shows it on screen.',
      'Use it when you need to measure an element and then adjust something — so the user never sees the wrong position for even one frame.'
    ],
    points: [
      'Syntax is the same as useEffect: useLayoutEffect(() => { /* ... */ return cleanup; }, [deps]);',
      'Runs BEFORE the browser paints — blocks the paint until it finishes.',
      'Use it only when useEffect causes a visible flicker in measure-then-adjust logic.'
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
      text: '"Think of a painter finishing a portrait. useEffect is like showing the painting immediately and then touching up stray brushstrokes in front of the client — they can see the unfinished state. useLayoutEffect is finishing every touch-up BEHIND the curtain before revealing the finished piece."'
    }
  },

  whyUsed: {
    description: 'When you measure a DOM element and then change its position based on that measurement, useEffect can cause a flicker — the user briefly sees the wrong position. useLayoutEffect fixes this by doing the measure-and-adjust before the browser paints.',
    points: [
      'Prevents visible flicker when measuring and then adjusting layout.',
      'Runs against the freshly committed DOM — reads and writes happen in the same frame.',
      'Needed for tooltips, popovers, and scroll-position corrections.',
      'Matches the timing of browser APIs like getBoundingClientRect().'
    ]
  },

  whenToUse: {
    description: 'Use useLayoutEffect only when you can answer YES to: "does this effect need to measure the DOM and then change something before the user sees it?"',
    points: [
      'Measuring element size/position then repositioning another element (tooltips, dropdowns).',
      'Correcting scroll position when new items are added above the visible area.',
      'Syncing with animation libraries that must measure before they apply transforms.',
      'Any case where you have observed a real flicker with useEffect.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'The default should still be useEffect',
      text: '"Use useLayoutEffect only when you HAVE a flicker problem. It blocks the browser from painting, so overusing it makes your app feel slower. The React team says clearly: prefer useEffect when possible."'
    }
  },

  howItWorks: {
    description: 'After React commits DOM changes but before the browser paints, React runs all useLayoutEffect callbacks synchronously. The browser waits for them to finish. useEffect runs later, after the paint.',
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
      'Both hooks share the same cleanup mechanics — return a cleanup function just like useEffect.',
      'useLayoutEffect triggers a React warning in server-side rendering — there is no DOM to measure on the server.',
      'If you do not need to read layout from the DOM, useEffect is always the better choice.'
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
    intro: 'useLayoutEffect earns its keep in measure-then-adjust scenarios:',
    items: [
      { icon: '💬', title: 'Tooltips and popovers', description: 'Measuring the trigger element position then placing the popover — without one frame of it appearing in the wrong spot.' },
      { icon: '📜', title: 'Chat scroll position', description: 'When older messages load above current view, adjust scrollTop synchronously so visible messages do not jump.' },
      { icon: '📏', title: 'Auto-resizing text areas', description: 'Measure text content height and adjust the container — avoiding a visible resize pop after the fact.' },
      { icon: '🎬', title: 'Animation libraries', description: 'Libraries that need accurate before-measurements taken synchronously, right before they calculate and apply a transition.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Eliminates visible flicker for measure-then-adjust DOM logic.',
      'Guarantees DOM reads happen against fresh, committed DOM before paint.',
      'Same API as useEffect — no new mental model, just different timing.',
      'The exact right tool for tooltip/popover/scroll-correction problems.'
    ],
    cons: [
      'Synchronous and paint-blocking — overuse slows the app visibly.',
      'Not available during server-side rendering — React warns.',
      'Easy to reach for "to be safe" when useEffect works fine.',
      'Future readers need to understand why this effect needs special timing.'
    ]
  },

  comparison: {
    title: 'useEffect vs. useLayoutEffect — same API, different timing',
    left: {
      title: '🌀 useEffect — async, after paint (the default)',
      tone: 'good',
      code: `useEffect(() => {
  document.title = \`\${count} unread messages\`;
  // Non-visual work — fine to happen "a moment later"
}, [count]);`,
      note: 'Use for data fetching, subscriptions, logging, non-layout state — anything that does not need to race against paint.'
    },
    right: {
      title: '📐 useLayoutEffect — sync, before paint (the exception)',
      tone: 'neutral',
      code: `useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setTooltipOffset(-height - 8);
  // MUST complete before paint or user sees wrong position
}, []);`,
      note: 'Use only for measure-then-adjust DOM logic — and only when you have observed a real flicker without it.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Reaching for useLayoutEffect by default "to be safe"',
        wrong: `useLayoutEffect(() => { fetchData().then(setData); }, []); // ❌ blocks paint for no reason`,
        right: `useEffect(() => { fetchData().then(setData); }, []); // ✅ data fetching has nothing to do with layout`,
        note: 'Synchronous paint-blocking is a real cost. Reserve useLayoutEffect for effects that genuinely read layout and synchronously adjust it.'
      },
      {
        title: 'Using it during server-side rendering without a guard',
        wrong: `useLayoutEffect(() => {\n  const rect = ref.current.getBoundingClientRect(); // ❌ no DOM on server\n}, []);`,
        right: `useEffect(() => {\n  const rect = ref.current.getBoundingClientRect(); // ✅ runs only on client\n}, []);`,
        note: 'There is no DOM during server rendering. React warns if useLayoutEffect runs in an SSR context. Use useEffect when strict pre-paint timing is not required.'
      },
      {
        title: 'Doing expensive work inside it',
        note: 'useLayoutEffect blocks the browser from painting until it finishes. Any slow computation inside it directly delays what the user sees. Keep it small, fast, and focused on measure + adjust.'
      }
    ]
  },

  bestPractices: [
    'Default to useEffect. Switch to useLayoutEffect only after observing a real visible flicker.',
    'Keep callbacks small and fast — measure, compute, adjust only.',
    'Guard DOM-measurement code from running during server-side rendering.',
    'Pair with useRef for elements you need to measure — getBoundingClientRect, offsetHeight.',
    'Leave a short comment explaining WHY this effect needs pre-paint timing.'
  ],

  interviewQuestions: [
    { q: 'What is the key difference between useEffect and useLayoutEffect?', a: 'They share the same API — the difference is WHEN they run. useEffect runs asynchronously AFTER the browser has painted. useLayoutEffect runs synchronously after React commits DOM changes but BEFORE the browser paints, and it blocks the paint until it finishes.' },
    { q: 'Why would using useEffect for a tooltip cause a visible flicker?', a: 'Because useEffect runs AFTER the browser has already painted. The user briefly sees the tooltip in its default (wrong) position, then sees it jump to the correct position when the effect re-renders it. useLayoutEffect performs the measure-and-adjust before the first paint, so the user only ever sees the correct result.' },
    { q: 'Why does the React team recommend defaulting to useEffect?', a: 'Because useLayoutEffect blocks the browser from painting until it completes. Any slow work inside it delays what the user sees. useEffect does not carry this cost. Reserve useLayoutEffect for the narrow case where its pre-paint timing genuinely prevents a visible problem.' },
    { q: 'Why does useLayoutEffect cause a warning during server-side rendering?', a: 'Server rendering produces HTML with no real DOM. There is nothing to measure and no paint to synchronize with. React warns because useLayoutEffect\'s behavior is meaningless in that context. Keep layout-measurement code in client-only boundaries or use useEffect.' },
    { q: 'Give a concrete example of when useLayoutEffect is the right tool.', a: 'Repositioning a tooltip: read getBoundingClientRect, then synchronously write the adjusted position before the user sees anything. With useEffect, the tooltip briefly appears in the wrong spot before jumping. With useLayoutEffect, the user only ever sees the correctly-placed tooltip.' }
  ],

  summary: {
    description: 'useLayoutEffect is useEffect\'s synchronous, pre-paint sibling — built for the narrow case of measuring the DOM and adjusting layout before the user sees anything. It prevents flicker in tooltips, scroll corrections, and similar scenarios, but its paint-blocking nature means useEffect should be your default.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useLayoutEffect — includes explicit guidance: "useLayoutEffect can hurt performance — prefer useEffect when possible".' },
    { label: 'Related topic', note: 'See "useEffect" for the foundational Hook, and "useRef" for the DOM-measurement pattern they are commonly combined with.' }
  ]
};

export default useLayoutEffectContent;
