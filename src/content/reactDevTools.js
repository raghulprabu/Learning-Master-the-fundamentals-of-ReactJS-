const reactDevToolsContent = {
  id: 'reactDevTools',
  title: 'React DevTools',
  icon: '🔬',
  theme: 'cyan',
  tagline: 'Inspect and profile your React component tree from the browser — your primary debugging and performance tool.',
  meta: 'Ecosystem · Tooling',

  whatIsIt: {
    description: [
      'React DevTools is a browser extension (Chrome, Firefox, Edge) and a standalone app that gives you deep visibility into your React component tree — inspect props and state, trace re-renders, profile performance, and debug context and hooks.',
      'It adds two panels to browser DevTools: the Components tab (inspect the live component tree, props, state, hooks) and the Profiler tab (record and analyze render performance).'
    ],
    points: [
      'Components tab: browse the component tree, inspect/edit props and state in real time, see which hooks a component uses and their values.',
      'Profiler tab: record interactions, see which components rendered, how long each took, what caused re-renders, and a flame graph for visual analysis.',
      'Highlight updates: enable "Highlight updates when components render" to see re-renders visually in the browser.',
      'Supports concurrent features: shows which components are in a Suspense state, which are rendering with useTransition, etc.'
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
      text: '"React DevTools is your app\'s X-ray machine and vital-signs monitor combined. The Components panel is the X-ray — it shows the exact internal structure of your app\'s component \'skeleton\' at any moment, with all the values inside. The Profiler is the vital-signs monitor — it records how your app is \'performing\' during an interaction and flags which \'organs\' (components) are working too hard."'
    }
  },

  whyUsed: {
    description: 'Without DevTools, debugging React requires console.log statements scattered through components and guesswork about re-renders. DevTools makes the invisible visible: you can inspect any component\'s props and state live, watch re-renders happen in real time, and profile exactly where CPU time is being spent during an interaction.',
    points: [
      'Instantly inspect any component\'s current props, state, and hook values without console.log.',
      'Identify unnecessary re-renders visually before they become performance problems.',
      'Profile slow interactions to find the exact component(s) causing jank — without guessing.',
      'Debug context values, Suspense states, and error boundaries all from the same panel.'
    ]
  },

  whenToUse: {
    description: 'Always keep DevTools installed during development. Reach for specific panels for specific tasks.',
    points: [
      'Components panel: anytime you\'re debugging unexpected behavior — wrong props passed, stale state, missing context values.',
      'Profiler: when an interaction feels sluggish or you\'ve added a feature and want to baseline its render cost.',
      '"Highlight updates" setting: when you want to visually confirm that memoization is working (or catch surprising re-renders).',
      'Right-click a DOM element → "Inspect" → "Components" to jump directly to the React component rendering that element.'
    ],
    analogy: {
      icon: '💡',
      title: 'A workflow for finding unnecessary re-renders',
      text: '"1. Enable \'Highlight updates when components render\' in DevTools Settings. 2. Interact with the app — type in a search box, toggle a switch. 3. Watch for flashing components that SHOULDN\'T be re-rendering (e.g. an unrelated sidebar flashing). 4. Inspect those components in the Profiler to confirm and quantify. 5. Apply React.memo/useMemo/useCallback surgically to eliminate the unnecessary renders."'
    }
  },

  howItWorks: {
    description: 'DevTools hooks into React\'s internal fiber tree (the internal representation of the component tree) via a publicly-committed DevTools API. It reads component names, props, state, hooks, and timing data from fiber nodes and presents them in a browsable UI. The Profiler integration records a flame chart of render timing for every component that renders during a recorded session.',
    code: {
      title: 'Using the <Profiler> component for programmatic performance monitoring',
      snippet: `// <Profiler> wraps any part of your tree and calls onRender after each commit
function onRenderCallback(
  id,             // the "id" prop of the Profiler tree that just committed
  phase,          // "mount" (first render) or "update" (re-render)
  actualDuration, // time in ms spent rendering this subtree for the current update
  baseDuration,   // estimated time for the worst-case render without memoization
  startTime,      // when React began rendering this update
  commitTime      // when React committed this update
) {
  // Log to performance monitoring, or flag if too slow:
  if (actualDuration > 16) {
    console.warn(\`Slow render: \${id} took \${actualDuration.toFixed(1)}ms (\${phase})\`);
  }
}

<Profiler id="ProductGrid" onRender={onRenderCallback}>
  <ProductGrid products={products} />
</Profiler>` },
    points: [
      'StrictMode (development only) double-invokes renders and effects to surface side-effect bugs — this shows as extra renders in DevTools, which is intentional and expected.',
      'The Profiler tab shows a "Why did this render?" section when you click a component in the flame chart — it lists which prop or state changed.',
      'Use the ⚙️ Settings gear in DevTools to enable "Record why each component rendered while profiling" for the most actionable output.'
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
    intro: 'DevTools sessions solve a predictable set of recurring production issues:',
    items: [
      { icon: '🔁', title: 'Finding cascading re-renders', description: 'A context value changing causes 40 components to re-render — DevTools highlights all of them, revealing the context update is triggering far more than intended. Fix: split the context or memoize the value.' },
      { icon: '⏱️', title: 'Identifying slow renders blocking input', description: 'Typing in a search box feels laggy — Profiler shows <FilteredProductList> taking 80ms on every keystroke. Fix: memoize the filter computation, or wrap in useTransition.' },
      { icon: '🔌', title: 'Debugging missing context values', description: 'A component unexpectedly receives the default context value — Components tab reveals the Provider is missing from the ancestor tree, or a typo in the context import.' },
      { icon: '🧩', title: 'Verifying memoization works', description: '"Highlight updates" shows <ProductCard> still flashing on every search keystroke despite React.memo — Components tab reveals an unstable `onSelect` function prop. Fix: wrap onSelect in useCallback.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Makes React\'s otherwise invisible internal state directly visible and inspectable.',
      'The Profiler\'s "Why did this component render?" feature turns vague "it\'s slow" into a precise, actionable diagnosis.',
      'Directly editable props/state in Components tab for quick "what if" debugging without code changes.',
      'No configuration needed — install the extension, open DevTools, it just works.'
    ],
    cons: [
      'Production builds don\'t expose the same level of detail by default (component names may be minified).',
      'The Profiler adds overhead — measured timing numbers are representative of the shape of the problem, not exact production values.',
      'Very large component trees can be slow to navigate in the Components tab.',
      'StrictMode\'s double-renders in development make the Components tab show double mount operations — can initially be confusing.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Forgetting to enable "Record why each component rendered" in Profiler settings',
        note: 'The default Profiler view shows WHICH components rendered and HOW LONG they took — but not WHY they re-rendered. Enabling "Record why each component rendered while profiling" in the ⚙️ Settings tells you what prop/state change triggered each render — the single most useful setting for diagnosing unnecessary re-renders.'
      },
      {
        title: 'Mistaking StrictMode double-renders for real bugs',
        note: 'React.StrictMode in development intentionally double-invokes renders and effects to help surface impure rendering and side-effect bugs. DevTools correctly reflects this — you may see mount-then-remount in the Component tree. This is by design; it won\'t happen in a production build. If you\'re seeing duplicate API calls or state changes from this, that\'s actually React pointing to a real bug in your effect code.'
      },
      {
        title: 'Using anonymous functions/components — DevTools shows "Anonymous"',
        wrong: `export default React.memo(() => <div>...</div>); // ❌ DevTools shows "Anonymous" — undebuggable`,
        right: `const ProductCard = React.memo(function ProductCard() { return <div>...</div>; }); // ✅`,
        note: 'Named function components show their name in DevTools, making the flame chart and component tree readable. Arrow functions inside React.memo or forwardRef all show as "Anonymous" unless assigned to a named variable with a function-expression.'
      }
    ]
  },

  bestPractices: [
    'Install React DevTools and always develop with it open — catch re-render issues early.',
    'Enable "Record why each component rendered while profiling" in DevTools settings for the most useful Profiler output.',
    'Name all your components (no anonymous arrow functions in React.memo/forwardRef) so DevTools is readable.',
    'Set context.displayName on all your Context objects so Providers appear with meaningful names in the tree.',
    'Use the <Profiler> component in development for automated performance regression detection in CI or performance budgets.'
  ],

  interviewQuestions: [
    { q: 'What are the two main panels in React DevTools and what does each do?', a: 'The Components panel lets you browse the live React component tree, inspect and even edit any component\'s props, state, hooks, and context values in real time — great for debugging unexpected values or missing data. The Profiler panel lets you record an interaction and then view a flame chart showing which components rendered, how long each took, and (with the right setting enabled) why each rendered — great for diagnosing performance problems.' },
    { q: 'How would you use React DevTools to diagnose why a component is re-rendering too often?', a: 'Enable "Highlight updates when components render" in DevTools settings — components that re-render flash visually in the browser, letting you immediately see if unexpected components are flashing during an interaction. For quantified analysis, use the Profiler: click Record, perform the interaction, click Stop, then look for components that re-rendered in the flame chart. Click a component and check the "Why did this render?" section (if "Record why each component rendered" is enabled in Profiler settings) to see which prop or state change triggered it.' },
    { q: 'Why do components appear as "Anonymous" in React DevTools, and how do you fix it?', a: 'Component names in DevTools come from JavaScript function names. Arrow functions don\'t have intrinsic names — const x = () => {} makes `x` anonymous. Wrapping an arrow function in React.memo or forwardRef results in "Anonymous" in the component tree. The fix is to use named function expressions: const Card = React.memo(function Card(...){...}) or function Card(...){...}. The function\'s name propagates through React.memo/forwardRef and appears correctly in DevTools.' },
    { q: 'What does React.StrictMode\'s double-rendering mean in the context of DevTools?', a: 'In development, React.StrictMode intentionally renders each component twice and invokes effects twice to help surface bugs caused by impure rendering or side effects that shouldn\'t run more than once. DevTools reflects this — you see components mount, unmount, and remount in the tree. This is by design and doesn\'t happen in production builds. If double-rendering reveals duplicate API calls or unexpected state changes, that\'s React helping you find a real bug: impure render logic or missing cleanup in an effect.' },
    { q: 'What is the <Profiler> component (as distinct from the DevTools Profiler tab)?', a: '<Profiler> is a React component (imported from \'react\') you embed in your JSX tree with an `id` and an `onRender` callback. It reports render timing for its wrapped subtree programmatically — useful for automated performance monitoring (e.g. logging to analytics, asserting in performance tests, or sending to observability dashboards). The DevTools Profiler tab is for manual, interactive profiling during development; the <Profiler> component is for programmatic monitoring that can run continuously.' }
  ],

  summary: {
    description: 'React DevTools is the essential companion to React development — the Components tab makes props, state, hooks, and context visible and editable without console.log; the Profiler tab turns "something is slow" into a precise diagnosis with a flame chart and "why did this render?" data. Name your components, set context displayNames, and keep the Profiler\'s "record why" setting enabled to get the most value from the tool.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/react-developer-tools — installation instructions and a tour of the Components and Profiler panels.' },
    { label: 'Related topic', note: 'See "Performance Optimization" for what to do with the Profiler\'s findings, and "React.memo / useMemo / useCallback" for the fixes to the re-render issues you\'ll discover.' }
  ]
};

export default reactDevToolsContent;
