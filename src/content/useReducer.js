const useReducerContent = {
  id: 'useReducer',
  title: 'useReducer Hook',
  icon: '🔇',
  theme: 'rose',
  tagline: 'Manage complex, multi-part state through clear, predictable "actions" — useState\'s big sibling for tricky state logic.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useReducer is a Hook for managing state via a "reducer" function — a pure function that takes the current state and an action object describing "what happened", and returns the *new* state. It\'s the same pattern Redux popularized, built right into React.',
      'It returns [state, dispatch]: the current state, and a `dispatch` function you call with an action to request a state change — the reducer decides exactly how that action transforms the state.'
    ],
    points: [
      'Syntax: const [state, dispatch] = useReducer(reducer, initialState);',
      'A reducer is a pure function: (state, action) => newState — same inputs always produce the same output, no side effects.',
      'Actions are typically plain objects with a `type` (and optional payload): { type: \'increment\' }, { type: \'add_todo\', text: \'Buy milk\' }.'
    ],
    code: { title: 'The basic shape', snippet: `function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset':     return { count: 0 };
    default: throw new Error('Unknown action: ' + action.type);
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
//      ^state   ^dispatch          ^reducer fn  ^initial state

dispatch({ type: 'increment' }); // describes WHAT happened, not HOW to change state` },
    analogy: {
      icon: '🏛️',
      title: 'Real-World Analogy',
      text: '"useReducer is like a courtroom. Instead of everyone in the building (your components) directly rewriting the law (mutating state) however they please, they file a formal request — a petition describing what they want (an action) — to a single judge (the reducer). The judge reviews the current law (current state) and the petition, and issues one official, predictable ruling (the new state). Everyone always goes through the same process, so the outcome is consistent and traceable."'
    }
  },

  whyUsed: {
    description: 'When state has multiple sub-values that change together, or the "next state" depends on complex logic about *what kind* of update is happening, scattering many useState calls and ad-hoc update functions becomes hard to follow and easy to get subtly wrong. useReducer centralizes that logic into one well-tested, predictable function.',
    points: [
      'Centralizes all state-transition logic in one place (the reducer) — easy to find, read, test, and reason about.',
      'Makes state changes explicit and traceable: every change is a named "action" you can log, replay, or debug.',
      'Decouples *what happened* (dispatched actions, described by components) from *how state changes* (decided by the reducer) — components stay simple.',
      'Scales gracefully to complex state machines: undo/redo, multi-step wizards, carts with add/remove/update-quantity.'
    ]
  },

  whenToUse: {
    description: 'Reach for useReducer when you notice your useState-based logic getting tangled — not as a default replacement for simple state.',
    points: [
      'State has several sub-values that frequently update together (e.g. a form with values + errors + touched fields + submitting status).',
      'The next state depends on the *previous* state in non-trivial ways, or on the *type* of update (add vs remove vs reorder).',
      'You want to test your state-transition logic in isolation, without rendering any components (a reducer is just a function!).',
      'You\'re building something that resembles a state machine: wizards, undo/redo, games, complex filters/sorts.'
    ],
    analogy: {
      icon: '⚖️',
      title: 'useState vs useReducer — the simple rule of thumb',
      text: '"If you can describe your state changes as a short list of simple `setX(newValue)` calls, useState is perfectly fine — and often clearer. Reach for useReducer when you find yourself writing the same complex update logic in multiple event handlers, or when a state change depends on several other pieces of state at once."'
    }
  },

  howItWorks: {
    description: 'You provide a reducer function and an initial state. useReducer gives you the current state and a `dispatch` function. Calling dispatch(action) tells React: "run the reducer with the current state and this action, and re-render with whatever it returns".',
    code: {
      title: 'A todo list reducer — the classic real-world example',
      snippet: `function todosReducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, { id: action.id, text: action.text, done: false }];
    case 'toggled':
      return todos.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case 'deleted':
      return todos.filter(t => t.id !== action.id);
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  const handleAdd = (text) =>
    dispatch({ type: 'added', id: crypto.randomUUID(), text });
  const handleToggle = (id) => dispatch({ type: 'toggled', id });
  const handleDelete = (id) => dispatch({ type: 'deleted', id });

  return <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />;
}`
    },
    points: [
      'The reducer must be PURE — no API calls, no timers, no mutating its arguments — just compute and return new state.',
      'dispatch() is stable across renders (like a setState setter) — safe to pass down to children or list in dependency arrays.',
      'Reducers are plain functions — you can unit-test them with simple input/output assertions, with zero React involved.'
    ]
  },

  flowDiagram: {
    title: 'The dispatch -> reducer -> new state cycle',
    steps: [
      { icon: '🖱️', label: 'User interacts', note: 'Clicks "Add todo"' },
      { icon: '📨', label: 'dispatch(action)', note: '{ type: "added", text }' },
      { icon: '⚖️', label: 'Reducer runs', note: '(state, action) => newState' },
      { icon: '📋', label: 'React updates state', note: 'New state replaces old' },
      { icon: '🔁', label: 'Component re-renders', note: 'UI reflects the change' }
    ]
  },

  realWorldExamples: {
    intro: 'useReducer earns its keep when state logic gets genuinely complex:',
    items: [
      { icon: '✅', title: 'Todo / task management apps', description: 'Actions like added, toggled, deleted, edited, reordered each have their own clear transformation — easy to extend and test.' },
      { icon: '🛒', title: 'Shopping cart logic', description: 'add_item, remove_item, update_quantity, apply_coupon, clear_cart — centralizing this in a reducer keeps cart math correct and consistent everywhere it\'s used.' },
      { icon: '🧙', title: 'Multi-step forms / wizards', description: 'next_step, prev_step, update_field, submit — the reducer enforces valid transitions and keeps all step data in one predictable object.' },
      { icon: '↩️', title: 'Undo / redo systems', description: 'A reducer that keeps past/present/future slices of state can implement undo/redo by simply moving entries between those slices on dispatch.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Centralizes and documents all the ways state can change — a reducer is effectively living documentation of your state machine.',
      'Pure functions are trivially unit-testable — assert reducer(state, action) === expectedState with no rendering involved.',
      'Makes complex updates predictable and traceable (you can log every dispatched action for debugging).',
      'dispatch has a stable identity, simplifying dependency arrays and passing it down to deeply nested children.'
    ],
    cons: [
      'More upfront boilerplate (action types, switch statements) than a simple useState for trivial state.',
      'Can feel like overkill for state that\'s genuinely simple — adds a layer of indirection that isn\'t always needed.',
      'Designing a good action/reducer shape takes a bit of practice — overly granular or overly broad actions both cause friction.'
    ]
  },

  comparison: {
    title: 'useState vs. useReducer for the same feature',
    intro: 'A cart with add/remove/update-quantity actions, modeled both ways:',
    left: {
      title: '😕 useState — logic scattered across handlers',
      tone: 'neutral',
      code: `const [items, setItems] = useState([]);

const addItem = (item) => setItems(prev => [...prev, item]);
const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
const updateQty = (id, qty) =>
  setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
// ...repeated and re-derived in every component that needs to mutate the cart`,
      note: 'Works fine — but the "rules" of how the cart changes live in many places, and are easy to duplicate or get subtly wrong.'
    },
    right: {
      title: '✅ useReducer — logic centralized & testable',
      tone: 'good',
      code: `function cartReducer(items, action) {
  switch (action.type) {
    case 'add':    return [...items, action.item];
    case 'remove': return items.filter(i => i.id !== action.id);
    case 'setQty': return items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i);
    default: return items;
  }
}
const [items, dispatch] = useReducer(cartReducer, []);
dispatch({ type: 'add', item });`,
      note: 'One pure function defines every legal cart transition — easy to test, extend, and trust.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Putting side effects (API calls, timers) inside the reducer',
        wrong: `function reducer(state, action) {\n  if (action.type === 'save') {\n    fetch('/api/save', { method: 'POST', body: JSON.stringify(state) }); // ❌ impure!\n  }\n  return state;\n}`,
        right: `// ✅ keep the reducer pure — trigger the side effect from an event handler or useEffect instead\nconst handleSave = () => { dispatch({ type: 'saving' }); api.save(state).then(() => dispatch({ type: 'saved' })); };`,
        note: 'Reducers must be pure (no API calls, no randomness, no mutation) so React can safely call them — including potentially twice in development (Strict Mode) to help you find bugs.'
      },
      {
        title: 'Mutating the state argument inside the reducer',
        wrong: `case 'toggled':\n  state[index].done = !state[index].done; // ❌ mutates the existing array/object\n  return state;`,
        right: `case 'toggled':\n  return state.map((t, i) => i === index ? { ...t, done: !t.done } : t); // ✅ new array & objects`,
      },
      {
        title: 'Reaching for useReducer when useState would be clearer',
        note: 'If your state is just a number, string, or boolean with simple set/toggle operations, useState is more direct and readable. Save useReducer for state with real structure and transition logic — using it everywhere "just in case" adds unnecessary ceremony.'
      }
    ]
  },

  bestPractices: [
    'Keep reducers pure — no API calls, no timers, no randomness, no mutation. Just compute and return new state.',
    'Model actions as plain objects with a descriptive `type` (and minimal payload) — they double as a log of "everything that can happen" in your feature.',
    'Always return new objects/arrays for changed parts of state — spread syntax, .map(), .filter() — never mutate in place.',
    'Co-locate the reducer function near the component (or in its own file) and unit-test it directly: it\'s just a function.',
    'Pair useReducer with useContext when several components need to dispatch to (and read from) the same store — a lightweight Redux-like setup with zero extra dependencies.'
  ],

  interviewQuestions: [
    { q: 'What is useReducer, and how does it differ from useState?', a: 'useReducer manages state via a pure reducer function — (state, action) => newState — and a dispatch function used to send "actions" describing what happened. useState directly returns a setter for the value. useReducer centralizes complex state-transition logic in one testable place, while useState is more direct for simple, independent values. Internally, useState is actually implemented in terms of the same primitive as useReducer.' },
    { q: 'What does it mean for a reducer to be "pure", and why does that matter?', a: 'A pure reducer always returns the same output for the same (state, action) inputs, and causes no side effects (no API calls, no mutation, no randomness, no timers). This matters because React may call reducers multiple times (e.g. in Strict Mode, or while figuring out concurrent updates) — impure reducers would cause duplicated side effects or inconsistent results. It also makes reducers trivially unit-testable as plain functions.' },
    { q: 'When would you choose useReducer over multiple useState calls?', a: 'When several pieces of state change together in response to the same events, when the next state depends on complex logic about the *type* of update, or when you want to centralize and test your state-transition logic independent of any component. A common signal is noticing the same complex update logic duplicated across several event handlers — that logic belongs in a reducer.' },
    { q: 'How would you combine useReducer with useContext to build a lightweight global store?', a: 'Create a context whose value is `{ state, dispatch }` from a useReducer call in a Provider component near the top of your tree. Any descendant can then call useContext to read state and dispatch actions — giving you a small, app-specific Redux-like store using only built-in React APIs, often wrapped in custom hooks like useCart() or useAuth() for a clean consumer-facing API.' },
    { q: 'Why is dispatch guaranteed to have a stable identity across renders, and why does that matter?', a: 'React guarantees the dispatch function returned by useReducer (like the setter from useState) keeps the same reference across re-renders of the component. This means you can safely include it in dependency arrays (useEffect, useCallback) or pass it to deeply memoized child components without causing unnecessary re-renders or effect re-runs.' }
  ],

  summary: {
    description: 'useReducer turns "how does my state change?" into a single, pure, testable function — and turns "something happened" into a clearly-named, traceable action. Reach for it when state has real structure and transition logic; keep using useState for simple, independent values. Combined with useContext, it becomes a lightweight, dependency-free global store.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/extracting-state-logic-into-a-reducer and react.dev/reference/react/useReducer — the canonical "convert useState to useReducer" walkthrough and full API reference.' }
  ]
};

export default useReducerContent;
