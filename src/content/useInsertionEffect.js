const useInsertionEffectContent = {
  id: 'useInsertionEffect',
  title: 'useInsertionEffect Hook',
  icon: '💉',
  theme: 'rose',
  tagline: 'A special Hook for CSS-in-JS libraries to inject styles into the DOM before layout effects run.',
  meta: 'Hooks · Specialized / Library Authors',

  whatIsIt: {
    description: [
      'useInsertionEffect fires at the very first moment in React\'s commit phase — before useLayoutEffect — so CSS-in-JS libraries can inject style tags into the DOM before anything else reads layout.',
      'The React team has been clear: "This Hook is mostly useful to CSS-in-JS library authors." Most application developers will never call it.'
    ],
    points: [
      'Syntax: useInsertionEffect(() => { /* inject styles */ }, [deps]);',
      'Fires BEFORE useLayoutEffect — styles exist in the DOM before any layout measurement.',
      'Cannot access refs or schedule state updates — its scope is intentionally narrow.'
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
      text: '"Think of a film set. The set decorators (useInsertionEffect) must finish placing every prop BEFORE the cinematographer (useLayoutEffect) walks in to measure lighting. If decorators were still moving furniture while the cinematographer measured, every measurement would be wrong. useInsertionEffect guarantees the set is fully ready before anyone starts measuring."'
    }
  },

  whyUsed: {
    description: 'CSS-in-JS libraries generate and inject styles at render time. If injection happens via useEffect or useLayoutEffect, a layout-measuring effect might run BEFORE the relevant styles exist — giving wrong measurements. useInsertionEffect runs before all other effects so styles are always ready.',
    points: [
      'Guarantees style injection completes before any useLayoutEffect reads layout.',
      'Avoids expensive browser style recalculations that happen when styles arrive mid-render.',
      'Gives CSS-in-JS libraries a dedicated, predictable integration point.',
      'Solves a real performance problem for a specific category of styling tools.'
    ]
  },

  whenToUse: {
    description: 'Almost never — unless you are building a CSS-in-JS library or similarly low-level styling tool.',
    points: [
      'You are implementing internals of a CSS-in-JS library that injects style tags dynamically.',
      'You need style mutations to land before any layout-measuring effect can observe the DOM.',
      'You are studying how styled-components or Emotion integrate with React\'s commit phase.'
    ],
    analogy: {
      icon: '🚫',
      title: 'When NOT to use useInsertionEffect (i.e. almost always)',
      text: '"If you are building forms, dashboards, lists, or modals — you will never need this Hook. Its restrictions (no refs, no state updates) are severe by design. If you are reaching for it in app code, you almost certainly want useEffect or useLayoutEffect instead."'
    }
  },

  howItWorks: {
    description: 'React\'s commit phase runs effects in this order: useInsertionEffect first (style mutations), then useLayoutEffect (measure and adjust), then the browser paints, then useEffect (everything else). useInsertionEffect occupies the earliest slot so styles are always present before anything reads layout.',
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
      'No ref access and no state updates — intentional, to keep this phase fast and focused.',
      'Most developers only encounter this Hook by reading the source code of styling libraries.',
      'It was added specifically in response to performance issues in CSS-in-JS libraries under concurrent rendering.'
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
    intro: 'This Hook\'s real world is almost entirely the internals of styling tools you may already use:',
    items: [
      { icon: '💅', title: 'CSS-in-JS libraries', description: 'styled-components and Emotion generate unique class names and inject CSS rules at render time — useInsertionEffect lets them do this efficiently under concurrent rendering.' },
      { icon: '🎨', title: 'Atomic CSS generation tools', description: 'Tools that generate and inject CSS rules on-demand based on the props used in a render pass use early style insertion to avoid layout thrashing.' },
      { icon: '🔬', title: 'Low-level design-system tooling', description: 'Internal styling engines for large component libraries that need precise control over when styles land relative to React\'s rendering phases.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Solves a real performance problem for CSS-in-JS libraries.',
      'One standard integration point — no more ad-hoc timing workarounds per library.',
      'Narrow restrictions keep it fast and focused on one job.',
      'Improves every React app using CSS-in-JS, even though almost no one calls it directly.'
    ],
    cons: [
      'Extremely narrow use case — mostly irrelevant to application code.',
      'Severely restricted (no refs, no state updates) — confusing if you do not know why.',
      'Hard to understand without knowing React\'s commit-phase internals.',
      'Adds one more Hook name that developers may wonder about without ever needing.'
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
      note: 'If you are unsure which to reach for: it is useEffect. If you think you need useInsertionEffect, you almost certainly mean useLayoutEffect — or useEffect.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Using it in regular application code',
        wrong: `useInsertionEffect(() => {\n  fetchUserProfile().then(setProfile); // ❌ wrong tool — refs and state updates not supported\n}, []);`,
        right: `useEffect(() => {\n  fetchUserProfile().then(setProfile); // ✅ this is squarely useEffect's job\n}, []);`,
        note: 'If you find yourself reaching for useInsertionEffect outside a styling library, you want useEffect or useLayoutEffect instead.'
      },
      {
        title: 'Trying to access refs or schedule state updates',
        wrong: `useInsertionEffect(() => {\n  setSomeState(x); // ❌ not supported by design\n  console.log(myRef.current); // ❌ ref access not reliable here\n});`,
        right: `useLayoutEffect(() => {\n  setSomeState(x);              // ✅ layout effects support refs and state updates\n  console.log(myRef.current);\n});`,
        note: 'These restrictions are intentional. useInsertionEffect has one job — inject styles fast and early. Broadening its capabilities would undermine the guarantee that makes it useful.'
      },
      {
        title: 'Thinking every React developer needs to learn this Hook deeply',
        note: 'It is completely normal to write React apps for years without calling useInsertionEffect. Knowing it exists and roughly why is enough. Actually using it is the rare exception for library authors only.'
      }
    ]
  },

  bestPractices: [
    'Do not reach for it in application code. useEffect (or useLayoutEffect) is almost always the correct choice.',
    'If you are building a CSS-in-JS library, study how styled-components or Emotion use it first.',
    'Treat its restrictions (no refs, no state updates) as a signal of its narrow scope — not limitations to work around.',
    'For learning and teaching React, mention it exists for completeness — but spend minimal time on it.',
    'If you are not sure whether you need it: you do not. Use useEffect.'
  ],

  interviewQuestions: [
    { q: 'What is useInsertionEffect, and who is it for?', a: 'It fires at the very earliest point in React\'s commit phase — before useLayoutEffect — so CSS-in-JS libraries can inject style tags into the DOM before any layout-reading effect runs. The React team says explicitly it is "mostly useful to CSS-in-JS library authors." It is not for general application code.' },
    { q: 'How does its timing relate to useLayoutEffect and useEffect?', a: 'They fire in order: useInsertionEffect first (styles land), then useLayoutEffect (measure and adjust the now-fully-styled DOM before paint), then the browser paints, then useEffect (asynchronously, after paint). This ordering guarantees styles are present before any layout-measuring code runs.' },
    { q: 'Why cannot you access refs or schedule state updates inside useInsertionEffect?', a: 'These restrictions are intentional — its entire job is to perform style-related DOM mutations as early and efficiently as possible. Allowing refs and state updates would blur its purpose with useLayoutEffect and undermine the strict timing guarantee that makes it useful for CSS-in-JS libraries.' },
    { q: 'What problem does it solve for CSS-in-JS libraries?', a: 'CSS-in-JS libraries generate and inject styles at render time. If that injection happens via useEffect or useLayoutEffect, layout-measuring effects might read the DOM before the relevant styles exist — giving wrong measurements. useInsertionEffect carves out the earliest slot specifically so style mutations complete before ANY layout-reading code runs.' },
    { q: 'How often should an application developer use useInsertionEffect?', a: 'Essentially never. It is reasonable to go an entire career building React applications without calling it. If you think you need it in app code, you almost certainly want useEffect or useLayoutEffect instead.' }
  ],

  summary: {
    description: 'useInsertionEffect is the most specialized React Hook — an intentionally restricted tool for CSS-in-JS libraries to inject styles before layout effects run. For everyday application code, useEffect and useLayoutEffect are the right choices. Knowing this Hook exists is more important than knowing how to write it.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useInsertionEffect — explicitly framed around CSS-in-JS use cases.' },
    { label: 'Related topic', note: 'See "useLayoutEffect" and "useEffect" for the Hooks you should reach for instead.' }
  ]
};

export default useInsertionEffectContent;
