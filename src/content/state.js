const state = {
  id: 'state',
  title: 'State',
  icon: '🧠',
  theme: 'rose',
  tagline: 'State is data that can change over time. When state changes, React updates the screen.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'State is data that a component remembers between renders. It can change over time — usually because the user did something.',
      'When you update state, React automatically re-renders the component and shows the new data on screen.'
    ],
    points: [
      'State is private to the component — other components cannot see it unless you pass it as props.',
      'State survives between renders — a regular variable resets every render.',
      'Calling the setter function (setState) tells React to re-render with the new value.'
    ],
    analogy: {
      icon: '📓',
      title: 'Think of it like a sticky note',
      text: '"State is like a sticky note you keep updating — the cart count, whether a menu is open, what you typed. Every time you update the note, React checks it and refreshes the screen to match."'
    }
  },

  whyUsed: {
    description: 'Interactive UIs need to remember things — what the user typed, whether a menu is open, how many items are in the cart. State makes this possible.',
    points: [
      'A regular variable forgets its value on every render. State remembers.',
      'Calling setState is the only reliable way to trigger a UI update.',
      'State is the foundation of every interactive feature: forms, toggles, counters, carts.'
    ]
  },

  whenToUse: {
    description: 'Use state when a value changes over time AND that change should be visible on the screen.',
    points: [
      'User input: text typed, a checkbox checked, a slider moved.',
      'UI status: is a modal open? is data loading? which tab is active?',
      'Data loaded from a server that can change.',
      'Anything that, when it changes, should update what the user sees.'
    ],
    analogy: {
      icon: '🚦',
      title: 'When NOT to use state',
      text: '"If a value can be calculated from existing state or props — like a filtered list or a total price — do not store it as state. Just compute it during render. Storing derived values leads to bugs when the two copies get out of sync."'
    }
  },

  howItWorks: {
    description: 'useState(initialValue) returns two things: the current value and a setter function. Call the setter to update the value. React then re-renders the component.',
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
      'On first render, useState(0) sets count to 0.',
      'The user clicks the button. setCount(count + 1) is called.',
      'React schedules a re-render with the new value.',
      'The component runs again. count is now 1. The screen updates.'
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
    intro: 'Common real-world uses of state:',
    items: [
      { icon: '➕', title: 'Counter application', description: 'Tracks a number that goes up or down when the user clicks.', code: `const [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>+ {count}</button>` },
      { icon: '🛒', title: 'Shopping cart quantities', description: 'Each cart row tracks its own quantity. +/- buttons update it.', code: `const [qty, setQty] = useState(1);\n<button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>\n<span>{qty}</span>\n<button onClick={() => setQty(q => q + 1)}>+</button>` },
      { icon: '⌨️', title: 'Form input handling', description: 'Each input is controlled — its value comes from state and updates on every keystroke.', code: `const [email, setEmail] = useState('');\n<input value={email} onChange={e => setEmail(e.target.value)} />` },
      { icon: '🍔', title: 'Toggling a sidebar/menu', description: 'A boolean state flips open/closed. Conditionally shows or hides the sidebar.', code: `const [isOpen, setIsOpen] = useState(false);\n<button onClick={() => setIsOpen(o => !o)}>☰</button>\n{isOpen && <Sidebar />}` }
    ]
  },

  prosAndCons: {
    pros: [
      'Makes UIs interactive — state is what makes React apps feel alive.',
      'React keeps the DOM in sync automatically. No manual updates needed.',
      'State lives close to where it is used — easy to find and understand.',
      'Works with useEffect to trigger actions when values change.'
    ],
    cons: [
      'Storing too much in state causes bugs when copies get out of sync.',
      'State updates are batched and not immediate — code that reads state right after setting it will see the old value.',
      'Too much state in a parent can cause unrelated parts of the UI to re-render.',
      'Complex, connected state is easier to manage with useReducer or a state library.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Mutating state directly',
        wrong: `const [items, setItems] = useState([]);\nitems.push(newItem);      // ❌ mutates the array directly\nsetItems(items);          // React may not see the change`,
        right: `setItems(prev => [...prev, newItem]); // ✅ creates a new array`,
        note: 'React checks if the reference changed to decide if it should re-render. Mutating the same array keeps the same reference — React may skip the update. Always create a new array or object.'
      },
      {
        title: 'Reading state right after calling the setter',
        wrong: `setCount(count + 1);\nconsole.log(count);  // ❌ logs the OLD value — update has not applied yet`,
        right: `setCount(prev => {\n  const next = prev + 1;\n  console.log(next); // ✅ use the new value here\n  return next;\n});`,
        note: 'The setter schedules a re-render. The state variable still holds the old value until the component re-renders.'
      },
      {
        title: 'Storing derived data in state',
        wrong: `const [items, setItems] = useState([]);\nconst [total, setTotal] = useState(0); // ❌ duplicated — can get out of sync`,
        right: `const [items, setItems] = useState([]);\nconst total = items.reduce((sum, i) => sum + i.price, 0); // ✅ computed during render`,
        note: 'If a value can be calculated from existing state, just compute it. Storing it separately creates two sources of truth that can disagree.'
      }
    ]
  },

  bestPractices: [
    'Use setX(prev => ...) when the new value depends on the old one.',
    'Never mutate state — always create new arrays/objects.',
    'Keep state minimal — derive everything you can from existing state.',
    'Group closely related values into one state object.',
    'Use useState(() => expensiveCalc()) for expensive initial values.'
  ],

  interviewQuestions: [
    { q: 'What is state in React?', a: 'State is data a component manages internally. It can change over time. When state changes, React re-renders the component and updates the screen. Unlike a regular variable, state remembers its value between renders.' },
    { q: 'Why is state update "asynchronous"?', a: 'React batches state updates for performance. Calling the setter does not change the variable immediately. The new value is only available on the next render. This is why you should use setCount(prev => prev + 1) when the new value depends on the old one.' },
    { q: 'Why must you avoid mutating state directly?', a: 'React compares the old and new state references to decide if it should re-render. Mutating the same array or object keeps the same reference — React may skip the re-render and the UI will not update. Always create a new array or object.' },
    { q: 'When should you lift state up to a parent component?', a: 'When two or more child components need to share or stay in sync with the same data. Move the state to their nearest common parent and pass it down as props.' },
    { q: 'Should you store computed data in state?', a: 'No. If a value can be calculated from existing state or props, compute it during render. Storing it as separate state creates two sources of truth that can get out of sync.' }
  ],

  summary: {
    description: 'State is a component\'s private memory that can change over time. Use useState to create it. Update it with the setter function — never mutate directly. Keep state minimal and compute derived values during render. State is the heart of every interactive React feature.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/state-a-components-memory — the official deep-dive into how state works.' }
  ]
};

export default state;
