const useInsertionEffectContent = {
  id: 'useInsertionEffect',
  title: 'useInsertionEffect Hook',
  icon: '💉',
  theme: 'rose',
  tagline: 'A rare, library-author-only Hook for injecting <style> tags into the DOM before layout effects read it.',
  meta: 'Hooks · Specialized / Library Authors',

  whatIsIt: {
    description: [
      'useInsertionEffect fires at the earliest possible moment in React\'s commit phase — before any DOM mutations are read by useLayoutEffect. Its one and only intended purpose is letting CSS-in-JS libraries inject <style> rules into the DOM before any layout-reading effect can run.',
      'The React team has been explicit: "This hook is less commonly used than the other Hooks. It is mostly useful to CSS-in-JS library authors." It exists to solve a real performance problem those specific libraries face — most application developers will never call it.'
    ],
    points: [
      'Syntax is identical to useEffect/useLayoutEffect: useInsertionEffect(() => { /* inject styles */ }, [deps]);',
      'Fires BEFORE useLayoutEffect — guaranteeing injected styles exist in the DOM by the time any layout-measurement effect reads from it.',
      'Cannot access refs or schedule state updates — its scope is intentionally narrow: insert styles, nothing else.'
    ],
    code: { title: 'The basic shape (CSS-in-JS library internals)', snippet: `// Inside a CSS-in-JS library's React bindings — NOT typical app code:
function useCSS(rule) {
  useInsertionEffect(() => {
    // Inject the generated CSS rule into a shared <style> tag,
    // guaranteed to happen BEFORE useLayoutEffect runs anywhere
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleTagFor(rule));
    }
  });
  return rule.className;
}` },
    analogy: {
      icon: '🎬',
      title: 'Real-World Analogy',
      text: '"Think of a film set where the SET DECORATORS (useInsertionEffect) must finish placing every prop and backdrop completely BEFORE the CINEMATOGRAPHER (useLayoutEffect) walks in to measure lighting angles and camera distances. If decorators were still moving furniture while the cinematographer was taking measurements, every measurement would be unreliable. useInsertionEffect guarantees the \'set\' (styles in the DOM) is fully ready before anyone starts measuring it."'
    }
  },

  whyUsed: {
    description: 'CSS-in-JS libraries that generate styles at render time (styled-components, Emotion, and similar) need to inject <style> tags into the document. If that injection happens via a regular useEffect or useLayoutEffect, it can interleave badly with React\'s rendering — causing expensive style recalculations mid-render, or, worse, layout-measuring effects (useLayoutEffect) reading the DOM BEFORE the relevant styles even exist. useInsertionEffect carves out a guaranteed-earliest moment specifically to avoid this.',
    points: [
      'Guarantees style injection completes before any useLayoutEffect runs — so layout measurements are always taken against fully-styled DOM.',
      'Avoids the performance penalty of injecting styles during the render phase itself, which can trigger expensive browser style recalculation mid-render.',
      'Gives CSS-in-JS libraries a dedicated, predictable integration point — rather than each library inventing its own ad-hoc workaround.',
      'Solves a real, measured performance problem for a specific category of tooling — it is not a general-purpose addition to the Hook toolkit.'
    ]
  },

  whenToUse: {
    description: 'In practice: almost never, unless you are building a CSS-in-JS library or similarly low-level styling tool. This is about as niche and specialized as React Hooks get.',
    points: [
      'You are implementing the internals of a CSS-in-JS library that injects <style> tags dynamically based on render-time values.',
      'You need to guarantee DOM style mutations complete before any other effect (especially layout-measuring ones) can observe the DOM.',
      'You are debugging or studying how libraries like styled-components/Emotion integrate efficiently with React\'s rendering and commit phases.'
    ],
    analogy: {
      icon: '🚫',
      title: 'When NOT to use useInsertionEffect (i.e. nearly always)',
      text: '"If you are building application features — forms, dashboards, lists, modals — you will never need this Hook. Its restrictions are severe by design (no refs, no state updates) precisely BECAUSE its job is so narrow. If you find yourself reaching for it in app code, you\'re almost certainly looking for useEffect or useLayoutEffect instead."'
    }
  },

  howItWorks: {
    description: 'React\'s commit phase has an internal ordering: useInsertionEffect callbacks run first (DOM mutations land), then useLayoutEffect callbacks run (DOM is read/measured and synchronously adjusted), then the browser paints, then useEffect callbacks run (asynchronously, post-paint). useInsertionEffect occupies that earliest slot specifically so style mutations are guaranteed visible to every later phase.',
    code: {
      title: 'The commit-phase ordering, made explicit',
      snippet: `// Order of execution after React commits a render to the DOM:

useInsertionEffect(() => {
  // 1️⃣ FIRST — inject/update <style> rules
  // No access to refs; cannot schedule state updates
});

useLayoutEffect(() => {
  // 2️⃣ SECOND — DOM is fully styled; safe to measure layout
  const { width } = ref.current.getBoundingClientRect();
});

// 3️⃣ Browser paints the screen

useEffect(() => {
  // 4️⃣ LAST — runs asynchronously, after paint
  analytics.track('component_rendered');
});`
    },
    points: [
      'The restriction against accessing refs or scheduling updates is intentional — it keeps this phase laser-focused on one job: mutating style-related DOM nodes, fast.',
      'Most developers will only ever encounter this Hook by reading the source code of styling libraries — not by writing it themselves.',
      'It was added to React specifically in response to measured performance issues in popular CSS-in-JS libraries\' integration with concurrent rendering.'
    ]
  },

  flowDiagram: {
    title: 'Where useInsertionEffect sits in the commit-phase ordering',
    steps: [
      { icon: '⚛️', label: 'React commits DOM changes', note: 'New elements exist in the tree' },
      { icon: '💉', label: 'useInsertionEffect runs', note: 'Styles injected — FIRST, guaranteed' },
      { icon: '📐', label: 'useLayoutEffect runs', note: 'Measures DOM — styles already present' },
      { icon: '🖼️', label: 'Browser paints', note: 'User sees the fully-styled, measured result' },
      { icon: '🌀', label: 'useEffect runs', note: 'Async, post-paint — everything else' }
    ]
  },

  realWorldExamples: {
    intro: 'This Hook\'s "real world" is almost entirely the internals of styling tools you may already use:',
    items: [
      { icon: '💅', title: 'CSS-in-JS libraries (styled-components, Emotion)', description: 'These libraries generate unique class names and CSS rules at render time, then inject corresponding <style> tags — useInsertionEffect is the mechanism that lets them do this efficiently and safely under concurrent rendering.' },
      { icon: '🎨', title: 'Atomic/utility CSS generation tools', description: 'Tools that generate and inject CSS rules on-demand based on the props/styles used in a render pass rely on guaranteed-early style insertion to avoid layout thrashing.' },
      { icon: '🔬', title: 'Low-level design-system tooling', description: 'Internal styling engines for large component libraries that need precise control over when and how styles land in the DOM relative to React\'s own rendering phases.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Solves a real, measured performance problem for CSS-in-JS libraries — guaranteeing styles exist before any layout-reading effect runs.',
      'Provides a single, standard, predictable integration point — rather than every library inventing its own timing workaround.',
      'Its narrow restrictions (no refs, no state updates) keep it fast and focused, exactly matching its singular purpose.',
      'Indirectly benefits virtually every React app that uses a modern CSS-in-JS library, even though almost no one calls it directly.'
    ],
    cons: [
      'Extremely narrow use case — the React docs themselves say it\'s "mostly useful to CSS-in-JS library authors"; essentially irrelevant to application code.',
      'Severely restricted (no ref access, no state updates) — by design, but easy to be confused by if you don\'t know why.',
      'Adds one more name to an already-long list of Hooks for newcomers to wonder about, despite rarely (if ever) needing it.',
      'Its purpose is hard to appreciate without understanding React\'s commit-phase internals and the specific problems CSS-in-JS libraries face.'
    ]
  },

  comparison: {
    title: 'The three "effect" Hooks — same shape, three distinct moments',
    left: {
      title: '⏱️ Timing order: insertion → layout → effect',
      tone: 'neutral',
      code: `useInsertionEffect(() => { /* inject styles */ });   // 1️⃣ earliest — DOM mutation only
useLayoutEffect(() => { /* measure & adjust DOM */ }); // 2️⃣ before paint — sync, blocks paint
useEffect(() => { /* fetch, subscribe, log, etc. */ }); // 3️⃣ after paint — async, default choice`,
      note: 'Each fires at a progressively later, less-restrictive moment — and each should be reached for progressively LESS often as you move up this list.'
    },
    right: {
      title: '🎯 "Which one should I use?" — a simple decision rule',
      tone: 'good',
      code: `// 99% of the time → useEffect
// "I need to measure layout and adjust before paint" → useLayoutEffect
// "I'm building a CSS-in-JS library and need to inject
//  styles before ANY layout effect can read the DOM" → useInsertionEffect`,
      note: 'If you\'re unsure which to reach for: it\'s useEffect. If you think you need useInsertionEffect, you almost certainly mean useLayoutEffect — or useEffect.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Reaching for it in regular application code',
        wrong: `useInsertionEffect(() => {\n  fetchUserProfile().then(setProfile); // ❌ wrong tool entirely — and refs/state updates aren't even reliably supported here\n}, []);`,
        right: `useEffect(() => {\n  fetchUserProfile().then(setProfile); // ✅ this is squarely useEffect's job\n}, []);`,
        note: 'If you find yourself reaching for useInsertionEffect outside of building a styling library, you\'re very likely looking for useEffect (the default) or useLayoutEffect (for measure-then-adjust DOM logic).'
      },
      {
        title: 'Trying to access refs or schedule state updates inside it',
        wrong: `useInsertionEffect(() => {\n  setSomeState(x); // ❌ not a supported use — this phase is intentionally restricted\n  console.log(myRef.current); // ❌ ref access isn't reliable here either\n});`,
        right: `useLayoutEffect(() => {\n  setSomeState(x);              // ✅ layout effects support refs and state updates\n  console.log(myRef.current);\n});`,
        note: 'These restrictions are intentional, not oversights — useInsertionEffect exists for ONE job (mutate style-related DOM as fast and early as possible), and broadening its capabilities would undermine the guarantee that makes it useful in the first place.'
      },
      {
        title: 'Assuming this Hook is something every React developer should know how to use',
        note: 'It is genuinely fine — expected, even — to go an entire career writing React applications without ever calling useInsertionEffect. Knowing it EXISTS (and roughly why) is useful context for understanding how styling libraries work; actually reaching for it yourself is the rare exception, not the rule.'
      }
    ]
  },

  bestPractices: [
    'Don\'t reach for it. Seriously — for the overwhelming majority of code, useEffect (or occasionally useLayoutEffect) is the correct choice.',
    'If you\'re evaluating or building a CSS-in-JS / styling library, study how existing libraries (styled-components, Emotion) use it before reinventing the approach.',
    'Treat its restrictions (no refs, no state updates) as a strong signal of its narrow intended scope — not as limitations to work around.',
    'When teaching or learning React Hooks, it\'s reasonable to mention this one exists (for completeness) without spending much time on it — recognition matters far more than mastery here.',
    'If you\'re unsure whether you need it: you don\'t. Use useEffect, or useLayoutEffect if you specifically need pre-paint DOM measurement.'
  ],

  interviewQuestions: [
    { q: 'What is useInsertionEffect, and who is it actually intended for?', a: 'It\'s a Hook that fires at the very earliest point in React\'s commit phase — before useLayoutEffect — with the singular purpose of letting CSS-in-JS libraries inject <style> tags into the DOM before any layout-reading effect can run. The React team has stated explicitly that it is "mostly useful to CSS-in-JS library authors" — it is not intended for general application code.' },
    { q: 'How does useInsertionEffect\'s timing relate to useLayoutEffect and useEffect?', a: 'They form an ordered sequence within React\'s commit-and-paint cycle: useInsertionEffect runs FIRST (DOM mutations for styles land), then useLayoutEffect runs (the DOM — now fully styled — can be measured and synchronously adjusted before paint), then the browser paints, and finally useEffect runs asynchronously, after the paint. This ordering guarantees that by the time any layout-measuring code runs, the relevant styles are already present in the DOM.' },
    { q: 'Why can\'t you access refs or schedule state updates inside useInsertionEffect?', a: 'These restrictions are intentional design choices that keep this phase narrowly focused and fast — its entire job is to perform style-related DOM mutations as early and efficiently as possible, before anything else can observe or depend on the DOM\'s style state. Allowing broader capabilities (ref access, state updates) would undermine the strict timing guarantee that makes the Hook useful in the first place, and would blur its purpose with useLayoutEffect\'s.' },
    { q: 'What specific problem does useInsertionEffect solve for CSS-in-JS libraries that useEffect or useLayoutEffect couldn\'t solve as well?', a: 'CSS-in-JS libraries generate and inject styles dynamically at render time. If that injection happens via useEffect, it can be too late — other effects (especially layout-measuring useLayoutEffect calls) might read the DOM before the relevant styles exist, producing incorrect measurements. If done via useLayoutEffect or directly during render, it can cause expensive, disruptive style recalculations at the wrong moment, hurting performance. useInsertionEffect carves out a guaranteed-earliest slot specifically so style mutations complete before ANY layout-reading code runs — solving both problems at once.' },
    { q: 'As an application developer, how often should you expect to use useInsertionEffect, and what should you reach for instead if you think you need it?', a: 'Essentially never — it is reasonable to go an entire career building React applications without calling it directly; its use is concentrated almost entirely in the internals of CSS-in-JS and styling libraries. If you find yourself thinking you need it in application code, you almost certainly want useEffect (the default choice for the vast majority of effects) or useLayoutEffect (specifically for pre-paint DOM measurement and adjustment).' }
  ],

  summary: {
    description: 'useInsertionEffect is the most specialized of React\'s "effect" Hooks — a narrow, intentionally-restricted tool that fires before any other effect, built specifically so CSS-in-JS libraries can inject styles into the DOM before layout-measuring code ever runs. It exists to solve a real, measured performance problem for a specific category of tooling; for everyday application code, it\'s enough to know it exists and why — useEffect (or occasionally useLayoutEffect) remains the right everyday choice.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useInsertionEffect — the canonical reference, explicitly framed around CSS-in-JS library use cases and its relationship to useLayoutEffect.' },
    { label: 'Related topic', note: 'See "useLayoutEffect" and "useEffect" for the two Hooks nearly everyone should reach for instead — and to understand the commit-phase ordering this Hook completes.' }
  ]
};

export default useInsertionEffectContent;
