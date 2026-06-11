const useStateContent = {
  id: 'useState',
  title: 'useState Hook',
  icon: '🛰️',
  theme: 'emerald',
  tagline: 'useState lets you add state to a function component.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useState is a React Hook that lets a function component hold and update a piece of data. It returns a pair — [currentValue, setterFunction].',
      'When you call the setter, React re-renders the component and shows the new value on screen.'
    ],
    points: [
      'Syntax: const [value, setValue] = useState(initialValue);',
      'The initial value is only used on the first render.',
      'You can call useState many times for independent pieces of state.'
    ],
    code: { title: 'The basic shape', snippet: `import { useState } from 'react';

const [count, setCount] = useState(0);
//      ^value  ^setter        ^initial value (used once)` },
    analogy: {
      icon: '🪣',
      title: 'Real-World Analogy',
      text: '"useState is like a labelled bucket. You fill it once with water (initial value). Whenever you add new water (call the setter), the bucket\'s display updates. It remembers the level even after you walk away (re-render)."'
    }
  },

  whyUsed: {
    description: 'Plain JavaScript variables reset on every render. useState gives a component memory that survives re-renders and tells React to update the screen.',
    points: [
      'Gives a component memory that survives re-renders.',
      'Is the only reliable signal to React to redraw the component.',
      'Forms the foundation that other Hooks like useEffect and useMemo build on.'
    ]
  },

  whenToUse: {
    description: 'Use useState when a component needs to track a value that can change and that change should be visible in the UI.',
    points: [
      'Simple values: a counter, a toggle, a selected tab, input text.',
      'UI flags: isModalOpen, isLoading, hasError.',
      'Small objects or arrays that change as a unit.',
      'For complex state with many transitions, use useReducer instead.'
    ]
  },

  howItWorks: {
    description: 'On the first render, useState sets up a state slot and returns [initial, setter]. On every later render, React returns the current value from that slot. Calling the setter schedules a re-render with the new value.',
    code: {
      title: 'The lifecycle of a single useState call',
      snippet: `function Counter() {
  const [count, setCount] = useState(0);
  console.log('rendering with count =', count);

  return (
    <div>
      <p>Count: {count}</p>
      {/* Direct update — fine when not depending on the previous value */}
      <button onClick={() => setCount(count + 1)}>+1</button>

      {/* Functional update — SAFEST when new value depends on old value,
          especially with multiple updates in the same event */}
      <button onClick={() => setCount(prev => prev + 1)}>+1 (safe)</button>

      {/* Lazy initial state — runs the function only on the FIRST render */}
      {/* const [big, setBig] = useState(() => expensiveComputation()); */}
    </div>
  );
}`
    },
    points: [
      'React batches multiple setState calls in one event into a single re-render.',
      'For objects or arrays, always create a new one: setUser(prev => ({ ...prev, name: "New" })).',
      'Lazy initialization useState(() => heavy()) runs the function only once on first render.'
    ]
  },

  flowDiagram: {
    title: 'useState execution flow',
    steps: [
      { icon: '🏁', label: 'First render', note: 'useState(0) -> [0, setCount]' },
      { icon: '🖱️', label: 'User clicks +1', note: 'setCount(count + 1) called' },
      { icon: '📋', label: 'React schedules update', note: 'New value queued for next render' },
      { icon: '🔁', label: 'Component re-renders', note: 'useState now returns [1, setCount]' },
      { icon: '🖥️', label: 'UI shows "Count: 1"', note: 'Screen reflects new state' }
    ]
  },

  realWorldExamples: {
    intro: 'These four patterns cover most real-world useState usage:',
    items: [
      {
        icon: '➕', title: 'Counter application',
        description: 'The classic example — also used for like counters and stepper inputs.',
        code: `const [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>👍 {count}</button>`
      },
      {
        icon: '🛒', title: 'Shopping cart quantity',
        description: 'Each product row tracks its own quantity. The parent recomputes totals from the cart array in state.',
        code: `const [qty, setQty] = useState(1);\nconst increase = () => setQty(q => q + 1);\nconst decrease = () => setQty(q => Math.max(1, q - 1));`
      },
      {
        icon: '⌨️', title: 'Form input handling',
        description: 'A controlled input whose value comes from state. Every keystroke updates state.',
        code: `const [email, setEmail] = useState('');\n<input value={email} onChange={e => setEmail(e.target.value)} />`
      },
      {
        icon: '🍔', title: 'Toggling a sidebar or dark mode',
        description: 'A boolean flag flips between two UI states — the simplest useState pattern.',
        code: `const [isOpen, setIsOpen] = useState(false);\n<button onClick={() => setIsOpen(o => !o)}>{isOpen ? 'Close ✖' : 'Open ☰'}</button>`
      }
    ]
  },

  prosAndCons: {
    pros: [
      'Simple API — one line gives you a value and a way to change it.',
      'Co-locates state with the component that owns it.',
      'Triggers re-renders automatically.',
      'Works naturally with useEffect, useMemo, and other Hooks.'
    ],
    cons: [
      'Many useState calls for related values can get messy — useReducer fits better.',
      'Easy to store derived values as state, which causes sync bugs.',
      'Batched updates surprise beginners who expect immediate changes.',
      'Object and array state needs careful immutable updates.'
    ]
  },

  commonMistakes: {
    intro: 'These four mistakes are the most common useState bugs for beginners:',
    items: [
      {
        title: 'Expecting the updated value immediately after calling the setter',
        wrong: `setCount(count + 1);\nconsole.log(count);  // ❌ still logs the OLD value this render`,
        right: `setCount(prev => {\n  const next = prev + 1;\n  console.log(next);   // ✅ the new value, computed safely\n  return next;\n});`,
        note: 'State updates apply on the next render. The current render\'s count is a constant snapshot.'
      },
      {
        title: 'Calling setCount(count + 1) multiple times expecting +3',
        wrong: `const triple = () => {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}; // ❌ ends up +1, not +3 — all three read the SAME stale "count"`,
        right: `const triple = () => {\n  setCount(prev => prev + 1);\n  setCount(prev => prev + 1);\n  setCount(prev => prev + 1);\n}; // ✅ each update builds on the previous one -> +3`,
        note: 'Use functional updates to chain correctly — each one gets the latest pending value.'
      },
      {
        title: 'Mutating object or array state directly',
        wrong: `user.name = 'New Name';\nsetUser(user);  // ❌ same reference -> React may skip re-render`,
        right: `setUser(prev => ({ ...prev, name: 'New Name' })); // ✅ new object reference`,
      },
      {
        title: 'Creating too many separate state variables for one form',
        wrong: `const [firstName, setFirstName] = useState('');\nconst [lastName, setLastName] = useState('');\nconst [email, setEmail] = useState(''); // ❌ 6 lines to manage one "form"`,
        right: `const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });\n// update: setForm(prev => ({ ...prev, [field]: value })) ✅`,
        note: 'Group values that always change together into one state object.'
      }
    ]
  },

  bestPractices: [
    'Use the functional update form setX(prev => ...) when the new value depends on the previous one.',
    'Never mutate state directly — always create new arrays or objects.',
    'Use lazy initialization useState(() => expensiveCalc()) for expensive initial values.',
    'Do not store values you can compute during render — compute them fresh each render.',
    'Group related state into one object, and keep independent state in separate calls.'
  ],

  interviewQuestions: [
    { q: 'What does useState return, and what do the two values represent?', a: 'It returns an array with two items: the current state value, and a setter function to update it. Calling the setter triggers a re-render. You destructure them as [value, setValue].' },
    { q: 'Why do multiple calls to setCount(count + 1) not add up as expected?', a: 'Each call reads count from the same render — a constant snapshot. So all three compute "current + 1" and the last one wins — only +1. Using setCount(prev => prev + 1) fixes this because each call gets the latest pending value.' },
    { q: 'What is "lazy initial state" and why would you use it?', a: 'Passing a function to useState — useState(() => expensiveCalc()) — tells React to call it only on the first render. This avoids running an expensive calculation on every re-render.' },
    { q: 'Why should you never mutate state directly?', a: 'React checks if the new state reference is different from the old one. Mutating the existing array or object keeps the same reference, so React may skip the re-render and your UI stays out of sync. Always create a new array or object.' },
    { q: 'When would you reach for useReducer instead of useState?', a: 'When state is complex, has multiple sub-values that update together, or the next state depends on the type of update. useReducer centralizes all transition logic in one reducer function, which is easier to test and understand.' }
  ],

  summary: {
    description: 'useState gives a function component memory that survives renders and a way to tell React to redraw. Always use functional updates when the new value depends on the old one, and never mutate state directly.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useState — the complete API reference with examples.' },
    { label: 'Related topic', note: 'See "State" in Foundations for the concept, and "useReducer" for complex state.' }
  ]
};

export default useStateContent;
