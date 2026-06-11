const reactDevToolsContent = {
  id: 'reactDevTools',
  title: 'React DevTools',
  icon: '🔬',
  theme: 'cyan',
  tagline: 'Inspect your React component tree, live props and state, and profile re-renders — all from the browser.',
  meta: 'Ecosystem · Tooling',

  whatIsIt: {
    description: [
      'React DevTools is a browser extension (Chrome, Firefox, Edge) that adds two panels to your browser\'s developer tools: the Components tab (inspect live props, state, and hooks) and the Profiler tab (record and analyze render performance).',
      'It connects directly to React\'s internal tree, so you can inspect any component\'s current values, watch re-renders happen in real time, and find exactly which component is causing a slow interaction.'
    ],
    points: [
      'Components tab: browse the component tree, inspect and edit props and state live, see hook values.',
      'Profiler tab: record interactions, see which components rendered, how long each took, and why they re-rendered.',
      'Highlight updates: enable "Highlight updates when components render" to see re-renders visually.',
      'Supports concurrent features: shows Suspense states, useTransition pending states, and more.'
    ],
    code: { title: 'Useful DevTools code helpers', snippet: `// 1. Give components readable names in DevTools
const MemoizedRow = React.memo(function ProductRow({ product }) { // ✅ named function
  return <li>{product.name}</li>;
});
// Anonymous: React.memo(() => ...) → shows as "Anonymous" in DevTools — unhelpful

// 2. Name your context for DevTools clarity
const CartContext = createContext(null);
CartContext.displayName = 'CartContext'; // ✅ shows as "CartContext" not "Context"

// 3. Enable re-render highlighting during development
// In React 18+: <React.StrictMode> automatically enables double-invocation
// to surface side effects — DevTools shows both renders

// 4. Use the Profiler component programmatically for CI perf tracking
import { Profiler } from 'react';

<Profiler id="ProductList" onRender={(id, phase, actualDuration) => {
  if (actualDuration > 16) console.warn(\`\${id} took \${actualDuration}ms\`);
}}>
  <ProductList />
</Profiler>` },
    analogy: {
      icon: '🩺',
      title: 'Real-World Analogy',
      text: '"React DevTools is your app\'s X-ray machine and vital-signs monitor combined. The Components panel is the X-ray — it shows the exact internal structure with all values inside. The Profiler is the vital-signs monitor — it records how your app performs during an interaction and flags which components are working too hard."'
    }
  },

  whyUsed: {
    description: 'Without DevTools, debugging React requires console.log statements scattered throughout components and guesswork about re-renders. DevTools makes the invisible visible — inspect any component\'s props and state live, see re-renders happen in real time, and profile exactly where CPU time is being spent.',
    points: [
      'Inspect any component\'s current props, state, and hook values instantly — no console.log needed.',
      'See unnecessary re-renders visually before they become performance problems.',
      'Profile slow interactions to find the exact component causing jank.',
      'Debug context values, Suspense states, and error boundaries all in one place.'
    ]
  },

  whenToUse: {
    description: 'Keep DevTools installed during development at all times. Use specific panels for specific tasks.',
    points: [
      'Components panel: when debugging unexpected behavior — wrong props, stale state, missing context.',
      'Profiler: when an interaction feels slow or you want to measure the cost of a new feature.',
      '"Highlight updates" setting: to confirm memoization is working or catch surprising re-renders.',
      'Right-click a DOM element → Inspect → Components to jump directly to the React component rendering it.'
    ],
    analogy: {
      icon: '💡',
      title: 'A workflow for finding unnecessary re-renders',
      text: '"1. Enable Highlight updates when components render in DevTools Settings. 2. Interact with the app — type in a search box. 3. Watch for flashing components that should NOT be re-rendering. 4. Open the Profiler to quantify. 5. Apply React.memo, useMemo, or useCallback to eliminate the unnecessary renders."'
    }
  },

  howItWorks: {
    description: 'DevTools hooks into React\'s internal fiber tree via a publicly-committed DevTools API. It reads component names, props, state, hooks, and timing data from fiber nodes and presents them in a browsable UI. The Profiler records a flame chart showing render timing for every component during a session.',
    code: {
      title: 'Using the Profiler component for programmatic performance monitoring',
      snippet: `// <Profiler> wraps any part of your tree and calls onRender after each commit
function onRenderCallback(
  id,             // the "id" prop of the Profiler tree that just committed
  phase,          // "mount" (first render) or "update" (re-render)
  actualDuration, // time in ms spent rendering this subtree
  baseDuration,   // estimated time without memoization
  startTime,      // when React began rendering
  commitTime      // when React committed
) {
  if (actualDuration > 16) {
    console.warn(\`Slow render: \${id} took \${actualDuration.toFixed(1)}ms (\${phase})\`);
  }
}

<Profiler id="ProductGrid" onRender={onRenderCallback}>
  <ProductGrid products={products} />
</Profiler>` },
    points: [
      'StrictMode double-invokes renders in development to surface side-effect bugs — this shows as extra renders in DevTools and is intentional.',
      'Click a component in the flame chart to see "Why did this render?" — which prop or state changed.',
      'Enable "Record why each component rendered while profiling" in the gear ⚙️ settings for the most useful output.'
    ]
  },

  flowDiagram: {
    title: 'Using the Profiler to diagnose and fix a slow interaction',
    steps: [
      { icon: '▶️', label: 'Click "Record" in Profiler tab', note: 'Start capturing timing data' },
      { icon: '🖱️', label: 'Perform the slow interaction', note: 'Type in search box, click tab, etc.' },
      { icon: '⏹️', label: 'Click "Stop"', note: 'Profiler renders flame chart' },
      { icon: '🔍', label: 'Find the tallest bar in flame chart', note: 'That component took the most time' },
      { icon: '🔧', label: 'Apply targeted optimization', note: 'useMemo, React.memo, virtualization' }
    ]
  },

  realWorldExamples: {
    intro: 'DevTools solves a predictable set of recurring problems:',
    items: [
      { icon: '🔁', title: 'Finding cascading re-renders', description: 'A context value changing causes 40 components to re-render — DevTools highlights all of them. Fix: split the context or memoize the value.' },
      { icon: '⏱️', title: 'Identifying slow renders blocking input', description: 'Typing in a search box lags — Profiler shows FilteredProductList taking 80ms on every keystroke. Fix: memoize the filter computation or use useTransition.' },
      { icon: '🔌', title: 'Debugging missing context values', description: 'A component unexpectedly gets the default context value — Components tab reveals the Provider is missing from the ancestor tree or there is a typo in the import.' },
      { icon: '🧩', title: 'Verifying memoization works', description: '"Highlight updates" shows ProductCard still flashing despite React.memo — Components tab reveals an unstable onSelect function prop. Fix: wrap onSelect in useCallback.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Makes React\'s invisible internal state directly visible and editable.',
      '"Why did this render?" turns vague "it\'s slow" into a precise, actionable diagnosis.',
      'Edit props and state directly for quick "what if" debugging without changing code.',
      'No configuration needed — install the extension, open DevTools, it works.'
    ],
    cons: [
      'Production builds do not expose the same detail by default — component names may be minified.',
      'Profiler adds overhead — timing numbers show the shape of the problem, not exact production values.',
      'Very large component trees can be slow to browse in the Components tab.',
      'StrictMode\'s double-renders can initially confuse developers new to React.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Forgetting to enable "Record why each component rendered"',
        note: 'The default Profiler shows WHICH components rendered and HOW LONG they took — but not WHY. Enable "Record why each component rendered while profiling" in the gear ⚙️ Settings. This tells you what prop or state change triggered each render — the most useful setting for diagnosing unnecessary re-renders.'
      },
      {
        title: 'Mistaking StrictMode double-renders for real bugs',
        note: 'React StrictMode in development intentionally double-invokes renders and effects to surface impure rendering and side-effect bugs. DevTools shows mount-then-remount — this is by design and does not happen in production. If you see duplicate API calls, React is pointing to a real bug in your effect code.'
      },
      {
        title: 'Using anonymous functions — DevTools shows "Anonymous"',
        wrong: `export default React.memo(() => <div>...</div>); // ❌ DevTools shows "Anonymous"`,
        right: `const ProductCard = React.memo(function ProductCard() { return <div>...</div>; }); // ✅`,
        note: 'Named function components show their name in DevTools, making the flame chart readable. Arrow functions inside React.memo or forwardRef all show as "Anonymous" unless you use named function expressions.'
      }
    ]
  },

  bestPractices: [
    'Install React DevTools and keep it open during development — catch re-render issues early.',
    'Enable "Record why each component rendered while profiling" for the most actionable Profiler output.',
    'Name all components — use named function expressions inside React.memo and forwardRef.',
    'Set context.displayName on all Context objects so Providers show meaningful names in the tree.',
    'Use the Profiler component in development for automated performance regression detection.'
  ],

  interviewQuestions: [
    { q: 'What are the two main panels in React DevTools?', a: 'The Components panel lets you browse the live React component tree and inspect or edit any component\'s props, state, hooks, and context values in real time — great for debugging unexpected values. The Profiler panel lets you record an interaction and view a flame chart showing which components rendered, how long each took, and why — great for diagnosing performance problems.' },
    { q: 'How would you use DevTools to diagnose why a component re-renders too often?', a: 'Enable "Highlight updates when components render" in settings — components that re-render flash visually so you can see what is re-rendering unexpectedly. For quantified analysis, use the Profiler: record, perform the interaction, stop, then find components that re-rendered. Click one and check "Why did this render?" to see which prop or state change triggered it.' },
    { q: 'Why do components appear as "Anonymous" in React DevTools?', a: 'Component names come from JavaScript function names. Arrow functions wrapped in React.memo or forwardRef have no intrinsic name — they appear as "Anonymous." The fix is named function expressions: const Card = React.memo(function Card() {...}). The function name propagates correctly through React.memo and forwardRef.' },
    { q: 'What does React StrictMode\'s double-rendering mean in DevTools?', a: 'In development, StrictMode intentionally renders each component twice and invokes effects twice to surface bugs caused by impure rendering or side effects. DevTools shows components mounting, unmounting, and remounting — by design and not in production builds. If this reveals duplicate API calls, that is React pointing to a real bug in your effect code.' },
    { q: 'What is the Profiler component (as distinct from the DevTools Profiler tab)?', a: 'The Profiler component is imported from "react" and embedded in JSX with an id and onRender callback. It reports render timing for its wrapped subtree programmatically — useful for automated performance monitoring in CI or sending data to observability dashboards. The DevTools Profiler tab is for manual, interactive profiling during development.' }
  ],

  summary: {
    description: 'React DevTools is the essential companion to React development. The Components panel makes props, state, hooks, and context visible and editable without console.log. The Profiler turns "something is slow" into a precise diagnosis. Name your components, set context displayNames, and enable "record why" in Profiler settings to get the most out of the tool.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/react-developer-tools — installation and tour of the Components and Profiler panels.' },
    { label: 'Related topic', note: 'See "Performance Optimization" for what to do with Profiler findings, and "React.memo / useMemo / useCallback" for the fixes to re-render issues you will discover.' }
  ]
};

export default reactDevToolsContent;
