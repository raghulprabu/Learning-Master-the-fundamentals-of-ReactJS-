const state = {
  id: 'state',
  title: 'State',
  icon: '🧠',
  theme: 'rose',
  tagline: 'A component\'s private, changeable memory — the data that drives what the user sees and can change over time.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'State is data that a component "remembers" between renders and can change over time — usually in response to user actions, network responses, or timers. When state changes, React re-renders the component (and its children) to reflect the new data.',
      'In function components, state is created with the useState (or useReducer) Hook. Unlike a normal variable, updating state via its setter function tells React "re-render this component with the new value".'
    ],
    points: [
      'Local & private: a component\'s state belongs to that component (and is not visible to others unless passed down as props).',
      'Persists across renders: a regular variable resets every render; state survives.',
      'Triggers re-renders: calling the setter schedules React to re-render the component with the new value.'
    ],
    analogy: {
      icon: '📓',
      title: 'Real-World Analogy',
      text: '"State is like a sticky note on your desk that you keep updating — your current to-do count, whether the light is on or off, how many items are in your cart. Every time you update the note, you (React) glance at it again and adjust what you\'re doing (re-render) to match."'
    }
  },

  whyUsed: {
    description: 'Interactive UIs need to remember things — what the user typed, whether a menu is open, how many items are in the cart. Regular JS variables don\'t survive re-renders and don\'t trigger UI updates. State solves both problems.',
    points: [
      'Lets components "remember" values between renders (a plain `let count = 0` resets every time the function runs).',
      'Tells React exactly when to re-render — calling the setter is the *only* reliable way to get the UI to reflect new data.',
      'Forms the foundation of every interactive feature: forms, toggles, counters, modals, wizards, carts, filters…'
    ]
  },

  whenToUse: {
    description: 'Reach for state whenever a value changes over time AND that change should be reflected in the UI.',
    points: [
      'User input: text typed into a field, a checkbox being ticked, a slider being dragged.',
      'UI status: is a modal open? is data loading? which tab is active?',
      'Data fetched from a server that needs to be displayed and can change.',
      'Anything that, when it changes, should cause the component to re-render and show something different.'
    ],
    analogy: {
      icon: '🚦',
      title: 'When NOT to use state',
      text: '"If a value can be calculated from existing props/state during render (e.g. a filtered list, a total price, a formatted date), don\'t store it in state — just compute it directly in the render. Storing derived values in state is a common source of bugs (the two can get out of sync)."'
    }
  },

  howItWorks: {
    description: 'useState(initialValue) returns a pair: the current value, and a setter function to update it. Calling the setter doesn\'t change the variable immediately and synchronously — instead it schedules a re-render. On the next render, useState returns the new value.',
    code: {
      title: 'useState in action — a simple counter',
      snippet: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // [value, setter]

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      {/* Functional update — safest when new state depends on old state */}
      <button onClick={() => setCount(prev => prev + 1)}>+1 (safe)</button>
    </div>
  );
}`
    },
    steps: [
      'On first render, useState(0) initializes `count` to 0 and returns [0, setCount].',
      'The user clicks the button, calling setCount(count + 1).',
      'React schedules a re-render of Counter with the new value.',
      'Counter\'s function runs again; this time useState returns the *updated* value (1), and the JSX reflects it.'
    ]
  },

  flowDiagram: {
    title: 'The state update cycle',
    steps: [
      { icon: '🖱️', label: 'Event fires', note: 'onClick / onChange / fetch resolves' },
      { icon: '✏️', label: 'setState() called', note: 'setCount(count + 1)' },
      { icon: '📋', label: 'React schedules re-render', note: 'Update queued, batched' },
      { icon: '🔁', label: 'Component re-runs', note: 'New value returned by useState' },
      { icon: '🖥️', label: 'UI reflects new state', note: 'Screen updates to match' }
    ]
  },

  realWorldExamples: {
    intro: 'Some of the most common, practical real-world uses of state:',
    items: [
      { icon: '➕', title: 'Counter application', description: 'The classic learning example: const [count, setCount] = useState(0) tracks and displays a running total.', code: `const [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>+ {count}</button>` },
      { icon: '🛒', title: 'Shopping cart quantities', description: 'Each cart row keeps its own quantity in state, updated by +/- buttons, and the parent recalculates the total whenever it changes.', code: `const [qty, setQty] = useState(1);\n<button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>\n<span>{qty}</span>\n<button onClick={() => setQty(q => q + 1)}>+</button>` },
      { icon: '⌨️', title: 'Form input handling', description: 'Each input is "controlled" — its value comes from state, and onChange updates that state on every keystroke.', code: `const [email, setEmail] = useState('');\n<input value={email} onChange={e => setEmail(e.target.value)} />` },
      { icon: '🍔', title: 'Toggling a sidebar/menu', description: 'A simple boolean flips open/closed state and conditionally applies a CSS class or renders different markup.', code: `const [isOpen, setIsOpen] = useState(false);\n<button onClick={() => setIsOpen(o => !o)}>☰</button>\n{isOpen && <Sidebar />}` }
    ]
  },

  prosAndCons: {
    pros: [
      'Makes UIs interactive and dynamic — the heart of what makes React apps feel alive.',
      'React automatically keeps the DOM in sync with state — no manual DOM manipulation needed.',
      'Co-locating state with the component that needs it keeps logic easy to find and reason about.',
      'Works seamlessly with hooks like useEffect to trigger side effects when values change.'
    ],
    cons: [
      'Overusing state (storing things that could be derived/computed) leads to bugs from out-of-sync values.',
      'State updates are asynchronous and can be batched — code that assumes an immediate update after calling the setter will be surprised.',
      'Lifting state up too aggressively can cause unrelated parts of the UI to re-render; co-location and memoization help.',
      'Complex, interdependent state is harder to manage with plain useState — useReducer or a state library may fit better.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Mutating state directly',
        wrong: `const [items, setItems] = useState([]);\nitems.push(newItem);      // ❌ mutates the array directly\nsetItems(items);          // React may not detect a change`,
        right: `setItems(prev => [...prev, newItem]); // ✅ creates a new array reference`,
        note: 'React compares state by reference to decide whether to re-render. Mutating the existing object/array keeps the same reference, so React might skip the update entirely. Always create new objects/arrays.'
      },
      {
        title: 'Reading state right after calling its setter',
        wrong: `setCount(count + 1);\nconsole.log(count);  // ❌ logs the OLD value — update hasn't applied yet`,
        right: `setCount(prev => {\n  const next = prev + 1;\n  console.log(next); // ✅ compute & use the new value here\n  return next;\n});`,
        note: 'State updates are asynchronous/batched. The variable in the current render still holds the old value until the component re-renders.'
      },
      {
        title: 'Storing derived data in state',
        wrong: `const [items, setItems] = useState([]);\nconst [total, setTotal] = useState(0); // ❌ duplicated, can drift out of sync`,
        right: `const [items, setItems] = useState([]);\nconst total = items.reduce((sum, i) => sum + i.price, 0); // ✅ compute during render`,
        note: 'If a value can be computed from existing state/props, compute it directly in the render — storing it separately invites the two to fall out of sync.'
      }
    ]
  },

  bestPractices: [
    'Use the functional update form `setX(prev => ...)` whenever the new value depends on the previous one.',
    'Never mutate state directly — always create new arrays/objects ([...arr], {...obj}) so React detects the change.',
    'Keep state as minimal and "single source of truth" as possible — derive everything else during render.',
    'Group closely-related values into one state object/useReducer when they always change together; keep unrelated values separate.',
    'Initialize state lazily (useState(() => expensiveCalc())) when the initial value is expensive to compute.'
  ],

  interviewQuestions: [
    { q: 'What is state in React, and how is it different from a regular JavaScript variable?', a: 'State is data a component manages internally that can change over time and triggers a re-render when updated via its setter. Unlike a regular variable, it persists across renders (a plain variable resets every time the function runs) and updating it through setState/useState\'s setter is what tells React to re-render the component with the new value.' },
    { q: 'Why is state considered "asynchronous" or "batched"?', a: 'React doesn\'t apply state updates immediately and synchronously — it schedules a re-render and may batch multiple updates together for performance. That means reading the state variable immediately after calling its setter still shows the old value; the new value is only available on the next render. This is why functional updates (prev => ...) are recommended when new state depends on old state.' },
    { q: 'Why must you avoid mutating state directly (e.g. array.push, object.prop = x)?', a: 'React determines whether to re-render largely by comparing references (Object.is) between the old and new state. Mutating an existing array/object keeps the same reference, so React may not detect a change and skip re-rendering — leading to a UI that silently doesn\'t update. Always create a new array/object ([...arr, item], {...obj, key: value}).' },
    { q: 'When should you lift state up to a parent component?', a: 'When two or more sibling components need to share or stay in sync with the same piece of state, you move ("lift") that state to their closest common ancestor, then pass it down via props (and pass callback functions down so children can request changes). This keeps a single source of truth and avoids state getting out of sync.' },
    { q: 'Should you store data in state if it can be calculated from existing props or state?', a: 'No — derive it during render instead. Storing a value that could be computed (e.g. a filtered list, a total, a formatted string) duplicates the source of truth and risks the two falling out of sync as the underlying data changes. Compute it fresh on every render unless the computation is expensive enough to memoize with useMemo.' }
  ],

  summary: {
    description: 'State is a component\'s private, persistent, change-triggering memory. Create it with useState, update it immutably (preferably with functional updates), and keep it minimal — derive everything you can instead of storing it. Master state, and you unlock everything interactive in React: forms, toggles, counters, carts, wizards, and beyond.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/state-a-components-memory and react.dev/learn/state-as-a-snapshot — deep dives into how and why state works the way it does.' }
  ]
};

export default state;
