const useStateContent = {
  id: 'useState',
  title: 'useState Hook',
  icon: '🛰️',
  theme: 'emerald',
  tagline: 'The most fundamental Hook — gives a function component its own private, persistent, re-render-triggering memory.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useState is a React Hook that lets a function component hold and update a piece of state. It returns a pair — [currentValue, setterFunction] — and you call it once per piece of state you need.',
      'Calling the setter doesn\'t mutate the variable in place; it tells React "please re-render this component, and this time, return this new value from useState".'
    ],
    points: [
      'Syntax: const [value, setValue] = useState(initialValue);',
      'The initial value is used only on the very first render — afterwards React remembers the latest value for you.',
      'You can call useState as many times as you need, for independent pieces of state.'
    ],
    code: { title: 'The basic shape', snippet: `import { useState } from 'react';

const [count, setCount] = useState(0);
//      ^value  ^setter        ^initial value (used once)` },
    analogy: {
      icon: '🪣',
      title: 'Real-World Analogy',
      text: '"useState is like a labelled bucket you can refill. You set it up once with a starting amount of water (initial value). Whenever you pour new water in (call the setter), the bucket\'s display (the UI) updates to show the new level — and it remembers the level even after you walk away and come back (re-render)."'
    }
  },

  whyUsed: {
    description: 'Plain JavaScript variables inside a function component are recreated from scratch on every render — they can\'t "remember" anything, and changing them doesn\'t tell React to update the screen. useState solves both problems in one Hook.',
    points: [
      'Gives a component memory that survives across renders (a `let x = 0` resets to 0 every single render).',
      'Is the *only* reliable signal to React that "this component\'s output should be recalculated and redrawn".',
      'Forms the foundation almost every other Hook builds on or works alongside (useEffect reacts to state changes, useMemo/useCallback optimize around it, useReducer is "useState for complex state").'
    ]
  },

  whenToUse: {
    description: 'Use useState whenever a single component needs to track a value that can change over the component\'s lifetime and that change should be visible in the UI.',
    points: [
      'Simple, independent values: a counter, a toggle (boolean), a selected tab index, an input\'s text.',
      'UI status flags: isModalOpen, isLoading, hasError.',
      'Small objects/arrays that change as a unit (a single form\'s field values, a short list of items).',
      'When state updates are simple "replace with a new value" operations — for complex, interdependent state transitions, prefer useReducer.'
    ]
  },

  howItWorks: {
    description: 'On the first render, useState(initial) sets up a "state slot" for this component instance and returns [initial, setterFn]. On every subsequent render, React looks up the *current* value in that slot (ignoring the argument you pass) and returns it. Calling the setter schedules a re-render with the new value placed into that slot.',
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
      'React batches multiple setState calls triggered in the same event into a single re-render for performance.',
      'Updating an object/array? Always create a *new* one: setUser(prev => ({ ...prev, name: "New" })) — never mutate in place.',
      'Lazy initialization — useState(() => heavy()) — avoids re-running an expensive calculation on every render (the function only runs once).'
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
    intro: 'These four patterns cover the vast majority of real-world useState usage:',
    items: [
      {
        icon: '➕', title: 'Counter application',
        description: 'The canonical teaching example — but it\'s also the literal pattern behind "like" counters, view counters, and stepper inputs.',
        code: `const [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>👍 {count}</button>`
      },
      {
        icon: '🛒', title: 'Shopping cart quantity management',
        description: 'Each product row tracks its own quantity; "Remove" sets it to 0 and the parent recomputes totals from the cart array in state.',
        code: `const [qty, setQty] = useState(1);\nconst increase = () => setQty(q => q + 1);\nconst decrease = () => setQty(q => Math.max(1, q - 1));`
      },
      {
        icon: '⌨️', title: 'Form input handling',
        description: 'A controlled <input> whose value is state — every keystroke updates state, and state drives what\'s displayed.',
        code: `const [email, setEmail] = useState('');\n<input value={email} onChange={e => setEmail(e.target.value)} />`
      },
      {
        icon: '🍔', title: 'Toggling a sidebar / dark mode / accordion',
        description: 'A boolean flag flips between two UI states — the simplest, most common useState pattern of all.',
        code: `const [isOpen, setIsOpen] = useState(false);\n<button onClick={() => setIsOpen(o => !o)}>{isOpen ? 'Close ✖' : 'Open ☰'}</button>`
      }
    ]
  },

  prosAndCons: {
    pros: [
      'Extremely simple API — one line gives you a value and a way to change it.',
      'Co-locates state with the component that owns it — easy to find, read, and reason about.',
      'Triggers re-renders automatically — no manual DOM updates required.',
      'Composes naturally with other Hooks (useEffect, useMemo) to build complex behaviour from simple parts.'
    ],
    cons: [
      'Many independent useState calls for related values can become unwieldy — useReducer often models that better.',
      'Easy to misuse by storing values that should be *derived* instead (causing sync bugs).',
      'Asynchronous/batched updates surprise newcomers who expect the variable to change "immediately".',
      'Object/array state requires careful immutable updates — a frequent source of subtle bugs for beginners.'
    ]
  },

  commonMistakes: {
    intro: 'These four mistakes account for the overwhelming majority of useState bugs beginners hit:',
    items: [
      {
        title: 'Expecting the updated value immediately after calling the setter',
        wrong: `setCount(count + 1);\nconsole.log(count);  // ❌ still logs the OLD value this render`,
        right: `setCount(prev => {\n  const next = prev + 1;\n  console.log(next);   // ✅ the new value, computed safely\n  return next;\n});`,
        note: 'State updates apply on the *next* render — the current render\'s `count` variable is a constant snapshot. If you need the new value right away, compute it yourself or use useEffect to react to the change.'
      },
      {
        title: 'Calling setCount(count + 1) multiple times in one handler, expecting +3',
        wrong: `const triple = () => {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}; // ❌ ends up +1, not +3 — all three read the SAME stale "count"`,
        right: `const triple = () => {\n  setCount(prev => prev + 1);\n  setCount(prev => prev + 1);\n  setCount(prev => prev + 1);\n}; // ✅ each update builds on the previous one -> +3`,
        note: 'Direct updates all close over the same `count` from this render. Functional updates chain correctly because each one receives the latest pending value.'
      },
      {
        title: 'Mutating object/array state directly',
        wrong: `user.name = 'New Name';\nsetUser(user);  // ❌ same reference -> React may skip re-render`,
        right: `setUser(prev => ({ ...prev, name: 'New Name' })); // ✅ new object reference`,
      },
      {
        title: 'Creating too many separate state variables for one cohesive thing',
        wrong: `const [firstName, setFirstName] = useState('');\nconst [lastName, setLastName] = useState('');\nconst [email, setEmail] = useState(''); // ❌ 6 lines to manage one "form"`,
        right: `const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });\n// update: setForm(prev => ({ ...prev, [field]: value })) ✅`,
        note: 'Group values that always change together into one state object (or consider useReducer); keep genuinely independent values separate.'
      }
    ]
  },

  bestPractices: [
    'Prefer the functional update form `setX(prev => ...)` whenever the new value depends on the previous one — it\'s always correct, even with batching.',
    'Never mutate state directly — always produce new arrays/objects with spread syntax ([...arr], {...obj}).',
    'Use lazy initialization `useState(() => expensiveCalc())` for expensive initial values so the calculation runs only once.',
    'Don\'t store values you can derive during render (totals, filtered lists, formatted strings) — compute them fresh each render (memoize with useMemo only if proven slow).',
    'Split unrelated state into separate useState calls; group tightly-related state into one object or useReducer.'
  ],

  interviewQuestions: [
    { q: 'What does useState return, and what do the two values represent?', a: 'It returns a two-element array: the current state value, and a setter function used to update it and trigger a re-render. By convention you destructure them as [value, setValue] using array destructuring.' },
    { q: 'Why do multiple calls to setCount(count + 1) in the same function not add up the way you might expect?', a: 'Each call reads `count` from the same render\'s closure — a constant snapshot — so all three calls compute "current + 1" and the last one wins, resulting in +1 overall instead of +3. Using the functional update form, setCount(prev => prev + 1), fixes this because each update receives the latest pending value, allowing them to chain correctly.' },
    { q: 'What is "lazy initial state" and why would you use it?', a: 'Passing a function to useState — useState(() => computeExpensiveValue()) — tells React to call that function only on the very first render to compute the initial value, rather than on every render. This avoids wastefully re-running expensive calculations (like parsing localStorage or processing large data) on every re-render.' },
    { q: 'Why should you never mutate state directly, e.g. arr.push(item) followed by setArr(arr)?', a: 'React determines whether to re-render largely by checking if the new state reference differs from the old one (Object.is comparison). Mutating the existing array/object keeps the same reference, so React may conclude "nothing changed" and skip the re-render — leaving your UI out of sync with your data. Always create a new array/object: setArr(prev => [...prev, item]).' },
    { q: 'When would you reach for useReducer instead of useState?', a: 'When state is complex, has multiple sub-values that update together, or the next state depends on intricate logic involving the action being performed (e.g. a multi-step form, an undo/redo system, a shopping cart with add/remove/update-quantity actions). useReducer centralizes that transition logic in one reducer function, making it more predictable and testable than scattering many interdependent useState calls.' }
  ],

  summary: {
    description: 'useState is the entry point to interactivity in React: it gives a function component memory that survives renders and a way to signal "redraw me with this new value". Master the functional-update form, immutable updates for objects/arrays, and the props-vs-state and stored-vs-derived distinctions, and you have the foundation for every other Hook in this app.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useState — the complete API reference, including pitfalls like stale closures and batching, with runnable examples.' },
    { label: 'Related topic', note: 'See "State" in Foundations for the conceptual model, and "useReducer" for managing more complex state transitions.' }
  ]
};

export default useStateContent;
