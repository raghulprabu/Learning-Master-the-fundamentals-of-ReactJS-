const useReducerContent = {
  id: 'useReducer',
  title: 'useReducer Hook',
  icon: '🔇',
  theme: 'rose',
  tagline: 'useReducer helps you manage complex state using a single, predictable function.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useReducer manages state through a "reducer" — a pure function that takes the current state and an action, and returns the new state.',
      'It returns [state, dispatch]: the current state, and a dispatch function you call with an action to request a state change.'
    ],
    points: [
      'Syntax: const [state, dispatch] = useReducer(reducer, initialState);',
      'A reducer is a pure function: (state, action) => newState.',
      'Actions are plain objects with a type: { type: "increment" } or { type: "add_todo", text: "Buy milk" }.'
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
      text: '"useReducer is like a courtroom. Instead of everyone directly rewriting the law (mutating state), they file a formal request (an action) to a judge (the reducer). The judge reviews the current law (state) and the request, then issues one official ruling (the new state). Every change goes through the same process."'
    }
  },

  whyUsed: {
    description: 'When state has multiple parts that change together, or the next state depends on complex logic, scattered useState calls become hard to follow. useReducer puts all that logic in one place.',
    points: [
      'Centralizes all state-transition logic in one place — easy to find and test.',
      'Makes state changes explicit and traceable — every change is a named action.',
      'Separates what happened (the action) from how state changes (the reducer).',
      'Scales well for complex state: undo/redo, multi-step forms, shopping carts.'
    ]
  },

  whenToUse: {
    description: 'Reach for useReducer when your useState logic starts getting complicated — not as a replacement for all simple state.',
    points: [
      'State has several sub-values that update together (form values + errors + submitting).',
      'The next state depends on the previous state in non-trivial ways.',
      'You want to test state-transition logic without rendering any component.',
      'You are building something like a state machine: wizards, undo/redo, games.'
    ],
    analogy: {
      icon: '⚖️',
      title: 'useState vs useReducer — the simple rule',
      text: '"If you can describe your state changes as simple setX(newValue) calls, useState is fine. Reach for useReducer when you find yourself writing the same complex update logic in multiple event handlers."'
    }
  },

  howItWorks: {
    description: 'You provide a reducer function and an initial state. Calling dispatch(action) tells React: run the reducer with the current state and this action, then re-render with whatever it returns.',
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
}` },
    points: [
      'The reducer must be pure — no API calls, no timers, no mutating arguments.',
      'dispatch() has a stable identity across renders — safe to pass to children.',
      'Reducers are just functions — unit-test them with simple input/output assertions.'
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
      { icon: '✅', title: 'Todo / task management', description: 'Actions like added, toggled, deleted, and reordered each have a clear transformation. Easy to extend and test.' },
      { icon: '🛒', title: 'Shopping cart logic', description: 'add_item, remove_item, update_quantity, apply_coupon, clear_cart — one reducer keeps cart math correct everywhere.' },
      { icon: '🧙', title: 'Multi-step forms', description: 'next_step, prev_step, update_field, submit — the reducer enforces valid transitions and keeps all step data in one object.' },
      { icon: '↩️', title: 'Undo / redo systems', description: 'A reducer that keeps past/present/future state slices can implement undo/redo by moving entries between them.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Centralizes all ways state can change — a reducer is living documentation of your state machine.',
      'Pure functions are easy to unit-test — assert reducer(state, action) === expectedState.',
      'Makes complex updates predictable and traceable.',
      'dispatch has a stable identity — simple to pass down and use in dependency arrays.'
    ],
    cons: [
      'More boilerplate (action types, switch statements) than useState for simple state.',
      'Can feel like overkill for state that is genuinely simple.',
      'Designing a good action shape takes practice.'
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
      note: 'Works fine — but cart rules live in many places and are easy to duplicate or get wrong.'
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
        right: `// ✅ keep the reducer pure — trigger side effects from event handlers or useEffect\nconst handleSave = () => { dispatch({ type: 'saving' }); api.save(state).then(() => dispatch({ type: 'saved' })); };`,
        note: 'Reducers must be pure. React may call them twice in development (Strict Mode) to catch bugs.'
      },
      {
        title: 'Mutating the state argument inside the reducer',
        wrong: `case 'toggled':\n  state[index].done = !state[index].done; // ❌ mutates the existing array\n  return state;`,
        right: `case 'toggled':\n  return state.map((t, i) => i === index ? { ...t, done: !t.done } : t); // ✅ new array`,
      },
      {
        title: 'Using useReducer when useState would be simpler',
        note: 'If your state is just a number, string, or boolean with a simple set or toggle, useState is clearer. Save useReducer for state with real structure and transition logic.'
      }
    ]
  },

  bestPractices: [
    'Keep reducers pure — no API calls, no timers, no randomness, no mutation.',
    'Name actions with a descriptive type that explains what happened.',
    'Always return new objects and arrays for changed parts of state — never mutate.',
    'Unit-test your reducer directly — it is just a function.',
    'Pair useReducer with useContext for a lightweight global store with no extra dependencies.'
  ],

  interviewQuestions: [
    { q: 'What is useReducer, and how does it differ from useState?', a: 'useReducer manages state through a pure reducer function — (state, action) => newState — and a dispatch function. useState directly returns a setter for the value. useReducer centralizes complex state-transition logic in one testable place, while useState is simpler for independent values.' },
    { q: 'What does it mean for a reducer to be "pure", and why does that matter?', a: 'A pure reducer always returns the same output for the same inputs and causes no side effects. This matters because React may call reducers multiple times in Strict Mode. Pure reducers are also trivially unit-testable as plain functions.' },
    { q: 'When would you choose useReducer over multiple useState calls?', a: 'When several pieces of state change together, when the next state depends on complex logic, or when you want to test your state-transition logic independently. A common sign is the same complex update logic duplicated in several event handlers.' },
    { q: 'How would you combine useReducer with useContext for a global store?', a: 'Create a context whose value is { state, dispatch } from useReducer in a Provider near the top of your tree. Any descendant can useContext to read state and dispatch actions — a lightweight Redux-like setup with only built-in React APIs.' },
    { q: 'Why is dispatch guaranteed to have a stable identity across renders?', a: 'React guarantees that dispatch keeps the same reference across re-renders, like the setter from useState. This means you can safely include it in dependency arrays or pass it to memoized child components without causing unnecessary re-renders.' }
  ],

  summary: {
    description: 'useReducer turns all your state transitions into one pure, testable function. Every change is a named action. Reach for it when state has real structure and multiple transition types. Combine with useContext for a simple global store.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/extracting-state-logic-into-a-reducer and react.dev/reference/react/useReducer — the "convert useState to useReducer" walkthrough and full API reference.' }
  ]
};

export default useReducerContent;
