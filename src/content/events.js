const events = {
  id: 'events',
  title: 'Event Handling',
  icon: '🖱️',
  theme: 'amber',
  tagline: 'Event handling lets you run code when the user clicks, types, or submits a form.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Events are actions the user takes — clicking a button, typing in a field, submitting a form. Event handling is how React responds to these actions.',
      'You attach event handlers directly in JSX using camelCase props like onClick, onChange, and onSubmit.'
    ],
    points: [
      'Event props are camelCase: onClick, onChange, onSubmit, onKeyDown.',
      'Pass a function — not a string. Example: onClick={handleClick}.',
      'The handler receives an event object (e) with details: e.target.value, e.key, e.preventDefault().'
    ],
    analogy: {
      icon: '🔔',
      title: 'Like doorbells wired to actions',
      text: '"Event handlers are like doorbells. Pressing the front door button (onClick) might turn on a light. Pressing the back door button (onSubmit) might start the sprinklers. Each button is wired to its own response."'
    }
  },

  whyUsed: {
    description: 'A UI that cannot respond to the user is just a picture. Event handling makes your app interactive.',
    points: [
      'Captures what the user does: clicks, keystrokes, form submissions.',
      'Most event handlers update state — which updates the screen.',
      'Makes validation, API calls, and navigation possible.',
      'React normalizes events so your code works in all browsers.'
    ]
  },

  whenToUse: {
    description: 'Use event handlers anywhere the user can do something.',
    points: [
      'Buttons and links: onClick to save, delete, or navigate.',
      'Form fields: onChange to capture typing, onSubmit for form submission.',
      'Keyboard: onKeyDown for shortcuts like "press Escape to close".',
      'Mouse/touch: onMouseEnter/onMouseLeave for hover effects.'
    ]
  },

  howItWorks: {
    description: 'You write a function and pass it to an event prop. React calls your function when the user triggers that event. Inside the function, you usually update state.',
    code: {
      title: 'Common event-handling patterns',
      snippet: `function SearchBox() {
  const [query, setQuery] = useState('');

  const handleChange = (e) => setQuery(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();           // stop the page from reloading
    console.log('Searching for:', query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setQuery('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search products…"
      />
      <button type="submit">Search</button>
    </form>
  );
}`
    },
    points: [
      'Passing arguments: use an arrow function: onClick={() => deleteItem(item.id)}.',
      'e.preventDefault() stops the browser\'s default action (like a form reloading the page).',
      'e.stopPropagation() stops the event from bubbling up to parent elements.'
    ]
  },

  flowDiagram: {
    title: 'From user action to UI update',
    steps: [
      { icon: '👆', label: 'User clicks/types', note: 'Native DOM event fires' },
      { icon: '🎁', label: 'React wraps it', note: 'SyntheticEvent created' },
      { icon: '🧰', label: 'Your handler runs', note: 'onClick={handleClick}' },
      { icon: '✏️', label: 'State updates', note: 'setX(...) called inside handler' },
      { icon: '🖥️', label: 'UI re-renders', note: 'Screen reflects the new state' }
    ]
  },

  realWorldExamples: {
    intro: 'Event handlers are used in almost every interactive feature:',
    items: [
      { icon: '✅', title: 'Form validation on submit', description: 'onSubmit calls e.preventDefault(), checks the fields, and shows errors or sends data to an API.' },
      { icon: '🌓', title: 'Dark mode toggle', description: 'A single onClick flips a boolean in state and switches the app\'s theme.' },
      { icon: '⌨️', title: '"Press Enter to send" chat input', description: 'onKeyDown checks if e.key === "Enter" and submits the message.' },
      { icon: '🖱️', title: 'Hover-to-preview cards', description: 'onMouseEnter/onMouseLeave show and hide a preview card, like Netflix browsing.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Works the same way in all browsers — React handles the differences.',
      'You describe "on this event, do this" right where the element is.',
      'Pairs naturally with state to make any UI interactive.',
      'React uses event delegation — good performance even with many elements.'
    ],
    cons: [
      'Inline arrow functions create a new function every render — usually fine, but can affect performance at scale.',
      'Forgetting e.preventDefault() on forms causes unexpected page reloads.',
      'Complex logic inline in JSX hurts readability — extract named functions instead.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Calling the handler instead of passing it',
        wrong: `<button onClick={handleClick()}>Save</button>  // ❌ runs immediately on render!`,
        right: `<button onClick={handleClick}>Save</button>           // ✅ passes the function\n<button onClick={() => handleClick(id)}>Save</button>  // ✅ pass args with arrow fn`,
        note: 'onClick={fn()} calls fn right away and passes the return value as the handler. You almost always want to pass the function itself.'
      },
      {
        title: 'Forgetting e.preventDefault() on form submission',
        wrong: `<form onSubmit={() => save(data)}>  // ❌ page reloads on submit`,
        right: `<form onSubmit={(e) => { e.preventDefault(); save(data); }}>  // ✅`,
        note: 'By default, submitting a form reloads the page. e.preventDefault() stops that.'
      },
      {
        title: 'Using stale state inside event handlers',
        note: 'In some cases, a handler can read an old value of state. Use functional updates setX(prev => ...) to always work with the latest value.'
      }
    ]
  },

  bestPractices: [
    'Name handlers with a "handle" prefix: handleClick, handleSubmit, handleChange.',
    'Always call e.preventDefault() in form onSubmit handlers.',
    'Wrap handlers that need arguments in arrow functions: onClick={() => onDelete(item.id)}.',
    'Keep handler logic short — move complex work to separate functions.',
    'Debounce high-frequency events like typing or scrolling — see the Debouncing topic.'
  ],

  interviewQuestions: [
    { q: 'How does event handling in React differ from plain HTML?', a: 'In HTML you use strings like onclick="doX()". In React you pass function references as camelCase props: onClick={doX}. React also wraps events in a "SyntheticEvent" so they work consistently in all browsers.' },
    { q: 'What is a SyntheticEvent?', a: 'A SyntheticEvent is React\'s wrapper around the browser\'s native event. It has the same properties (e.target, e.preventDefault(), etc.) but works the same way in all browsers.' },
    { q: 'Why is onClick={handleClick()} usually wrong?', a: 'Writing handleClick() calls the function right away during render. You get back its return value as the handler — not the function itself. Write onClick={handleClick} to pass the function reference, or onClick={() => handleClick(id)} to pass arguments.' },
    { q: 'What does e.preventDefault() do?', a: 'It stops the browser\'s default action for that event. For example, it stops a form submission from reloading the page so your JavaScript can handle it instead.' },
    { q: 'How would you implement "press Enter to submit" on a search input?', a: 'Attach onKeyDown to the input and check if e.key === "Enter". Then call your search function. Or wrap the input in a <form> with onSubmit — the Enter key naturally submits a form.' }
  ],

  summary: {
    description: 'Event handling connects what the user does to what your app does — usually by updating state. Learn the camelCase event props, the event object (e), e.preventDefault(), and how to pass arguments. That covers almost every interactive feature you will ever build.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/responding-to-events — the official guide to attaching handlers and event propagation.' }
  ]
};

export default events;
