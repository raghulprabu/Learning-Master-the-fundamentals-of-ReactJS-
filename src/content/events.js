const events = {
  id: 'events',
  title: 'Event Handling',
  icon: '🖱️',
  theme: 'amber',
  tagline: 'Responding to what the user does — clicks, typing, submissions, hovers — and turning interaction into state changes.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Event handling is how React lets you run code in response to user interactions: clicking a button, typing in a field, submitting a form, hovering over an element, pressing a key, and more.',
      'React wraps the browser\'s native events in a cross-browser wrapper called a "SyntheticEvent" and lets you attach handlers directly in JSX using camelCase props like onClick, onChange, onSubmit.'
    ],
    points: [
      'Event handler props are camelCase: onClick, onChange, onSubmit, onMouseEnter, onKeyDown.',
      'You pass a *function reference*, not a string (unlike HTML\'s onclick="doSomething()"). ',
      'The handler receives an event object (`e`) with details: e.target.value, e.preventDefault(), e.key, etc.'
    ],
    analogy: {
      icon: '🔔',
      title: 'Real-World Analogy',
      text: '"Event handlers are like doorbells wired to specific actions. Pressing the front-door button (onClick) might turn on a light, while pressing the back-door button (onSubmit) might start the sprinklers. Each button is wired to its own response — you decide what happens when each one is pressed."'
    }
  },

  whyUsed: {
    description: 'A UI that can\'t respond to the user is just a static poster. Event handling is what turns markup into something interactive — the bridge between "what the user does" and "what the app does in response" (usually: update state).',
    points: [
      'Captures user intent: clicks, keystrokes, drags, submissions, focus changes.',
      'Drives state updates — most event handlers exist purely to call a setState/dispatch function.',
      'Enables validation, navigation, API calls, animations — virtually every interactive feature starts with an event.',
      'React\'s synthetic event system smooths over cross-browser inconsistencies, so you write one handler that works everywhere.'
    ]
  },

  whenToUse: {
    description: 'Anywhere the user can do something, you likely need an event handler to react to it.',
    points: [
      'Buttons and links: onClick to trigger an action (save, delete, navigate, toggle).',
      'Form fields: onChange to capture typing/selection, onSubmit to handle form submission.',
      'Keyboard interaction: onKeyDown/onKeyUp for shortcuts, "press Enter to search", arrow-key navigation.',
      'Mouse/touch interaction: onMouseEnter/onMouseLeave for tooltips and hover effects, onDrag for drag-and-drop.'
    ]
  },

  howItWorks: {
    description: 'You define a function (inline or named) and pass it as the value of an event prop. React attaches a single listener at the root of your app (event delegation) and, when the native event fires, wraps it in a SyntheticEvent and calls your handler with it — giving you a consistent API across all browsers.',
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
      'Passing arguments: onClick={() => deleteItem(item.id)} — wrap in an arrow function so it isn\'t called immediately during render.',
      'e.preventDefault() stops default browser behaviour (e.g. a form reloading the page); e.stopPropagation() stops an event from bubbling to parent handlers.',
      'You can attach the same handler to multiple elements and branch on e.target or a passed argument to know which one fired.'
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
    intro: 'Event handlers are the trigger behind nearly every interactive feature you build:',
    items: [
      { icon: '✅', title: 'Form validation on submit', description: 'onSubmit calls e.preventDefault(), validates fields, and either shows errors or sends data to an API.' },
      { icon: '🌓', title: 'Dark mode toggle', description: 'A single onClick flips a boolean in state, which switches a CSS class/theme across the whole app.' },
      { icon: '⌨️', title: '"Press Enter to send" chat input', description: 'onKeyDown checks e.key === "Enter" to submit a message without needing a separate button click.' },
      { icon: '🖱️', title: 'Hover-to-preview cards', description: 'onMouseEnter/onMouseLeave toggle a "show preview" state used by media platforms like Netflix-style browsing.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Consistent, cross-browser API (SyntheticEvent) — write once, works everywhere.',
      'Declarative — you describe "on this event, do this" right where the element is defined.',
      'Naturally pairs with state to build fully interactive experiences.',
      'Event delegation under the hood keeps performance solid even with many elements.'
    ],
    cons: [
      'Inline arrow functions in JSX create a new function every render, which can affect memoized children\'s performance at scale (usually fine; optimize only when proven necessary).',
      'Forgetting e.preventDefault() on forms/links causes unexpected page reloads/navigations.',
      'Overly complex handler logic inline in JSX hurts readability — extract named handler functions.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Calling the handler instead of passing a reference',
        wrong: `<button onClick={handleClick()}>Save</button>  // ❌ runs immediately on render!`,
        right: `<button onClick={handleClick}>Save</button>           // ✅ passes the function\n<button onClick={() => handleClick(id)}>Save</button>  // ✅ pass args via arrow fn`,
        note: 'onClick={fn()} calls fn during render and assigns its *return value* as the handler. You almost always want to pass the function itself (or an arrow function that calls it).'
      },
      {
        title: 'Forgetting e.preventDefault() on form submission',
        wrong: `<form onSubmit={() => save(data)}>  // ❌ page reloads on submit`,
        right: `<form onSubmit={(e) => { e.preventDefault(); save(data); }}>  // ✅`,
        note: 'By default, submitting a <form> reloads the page. preventDefault() stops that so your JS can take over.'
      },
      {
        title: 'Reading stale state inside a handler created in a stale closure',
        note: 'In rare cases (e.g. a handler attached once via an effect), an event handler can "remember" an old value of state from when it was created. Make sure handlers are re-created when their dependencies change, or use functional state updates (setX(prev => ...)) to always work off the latest value.'
      }
    ]
  },

  bestPractices: [
    'Name handlers descriptively with a `handle` prefix: handleClick, handleSubmit, handleInputChange.',
    'Always call e.preventDefault() in form onSubmit handlers unless you genuinely want the default browser behaviour.',
    'Wrap handlers that need arguments in arrow functions: onClick={() => onDelete(item.id)}.',
    'Keep handler bodies short — delegate complex logic to separate functions/custom hooks for testability.',
    'Debounce or throttle high-frequency events (typing, scrolling, resizing) to avoid excessive work — see the dedicated Debouncing topic.'
  ],

  interviewQuestions: [
    { q: 'How does event handling in React differ from plain HTML/JavaScript?', a: 'In HTML you attach handlers as strings (onclick="doX()") or via addEventListener; in React you pass actual function references as camelCase props (onClick={doX}) directly in JSX. React also normalizes events into a cross-browser "SyntheticEvent" wrapper so your code behaves consistently across browsers, and internally uses event delegation for performance.' },
    { q: 'What is a SyntheticEvent?', a: 'A SyntheticEvent is React\'s cross-browser wrapper around the browser\'s native event object. It has the same interface as native events (e.target, e.preventDefault(), e.stopPropagation(), etc.) but behaves identically across browsers, smoothing over inconsistencies in the underlying DOM APIs.' },
    { q: 'Why is `<button onClick={handleClick()}>` usually wrong, and what should you write instead?', a: 'Writing handleClick() calls the function immediately during render and assigns whatever it *returns* as the click handler — not what you want. You should pass the function reference itself (onClick={handleClick}), or wrap it in an arrow function if you need to pass arguments (onClick={() => handleClick(id)}).' },
    { q: 'What does e.preventDefault() do, and when do you need it?', a: 'It stops the browser\'s default behaviour for that event — e.g. a form submission reloading the page, or a link navigating to a new URL. You call it inside handlers (commonly onSubmit) when you want to handle the action yourself in JavaScript instead of letting the browser do its default thing.' },
    { q: 'How would you implement "press Enter to submit" on a search input?', a: 'Attach an onKeyDown handler to the input, check if e.key === "Enter", and call your search/submit function (optionally calling e.preventDefault() if it\'s inside a form and you want to control the behaviour explicitly). Alternatively, wrap the input in a <form> with an onSubmit handler — the Enter key naturally triggers form submission.' }
  ],

  summary: {
    description: 'Event handling connects user actions to your application\'s logic — almost always by updating state, which then re-renders the UI. Learn the camelCase event props, the SyntheticEvent object, preventDefault/stopPropagation, and how to safely pass arguments to handlers, and you can wire up any interaction a designer can dream up.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/responding-to-events — the canonical guide to attaching handlers, passing arguments, and event propagation.' }
  ]
};

export default events;
