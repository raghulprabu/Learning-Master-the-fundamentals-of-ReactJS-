const useRefContent = {
  id: 'useRef',
  title: 'useRef Hook',
  icon: '🔃',
  theme: 'amber',
  tagline: 'A mutable "box" that persists across renders without causing re-renders — perfect for DOM access and remembered values.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useRef returns a plain mutable object — { current: initialValue } — that React keeps stable across the component\'s entire lifetime. You can read and write `.current` freely, and unlike state, changing it does NOT trigger a re-render.',
      'It has two big use cases: (1) holding a reference to a DOM element so you can imperatively interact with it (focus, scroll, measure), and (2) storing any mutable value you want to persist across renders without it being part of the rendering output (timers, previous values, render counts, instance variables).'
    ],
    points: [
      'Syntax: const ref = useRef(initialValue); → ref.current holds the value.',
      'Attach to a DOM element via the `ref` attribute: <input ref={inputRef} /> → React sets inputRef.current to the actual DOM node.',
      'Mutating ref.current is "invisible" to React — it never schedules a re-render, and reading it during render gives unpredictable results (it may not reflect the very latest write).'
    ],
    code: { title: 'The two faces of useRef', snippet: `// 1) DOM access
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus(); // imperatively focus the input

// 2) Mutable value that survives renders WITHOUT causing one
const renderCount = useRef(0);
useEffect(() => { renderCount.current += 1; });` },
    analogy: {
      icon: '📌',
      title: 'Real-World Analogy',
      text: '"useRef is like a sticky note on the side of your monitor — you can scribble on it, update it, and read it anytime, and it stays put no matter how many times you refresh your screen (re-render). But — crucially — writing on that sticky note doesn\'t make your monitor refresh. It\'s just there for YOU to glance at and use whenever you need to."'
    }
  },

  whyUsed: {
    description: 'Sometimes you need to: (a) imperatively command a DOM element (focus an input, play a video, scroll into view) — something declarative props can\'t express — or (b) remember a value across renders that genuinely shouldn\'t trigger a re-render when it changes (a timer ID, a previous prop value, a flag). useRef cleanly covers both.',
    points: [
      'Direct DOM access for things React\'s declarative model doesn\'t cover: .focus(), .play(), .scrollIntoView(), measuring .getBoundingClientRect().',
      'Storing values that change over time but are "behind the scenes" — interval/timeout IDs, WebSocket connections, render counts, the previous value of a prop.',
      'Avoiding unnecessary re-renders for bookkeeping data that the UI doesn\'t directly depend on.',
      'Integrating with non-React libraries that need a real DOM node to attach to (charting libraries, maps, video players).'
    ]
  },

  whenToUse: {
    description: 'Reach for useRef specifically when you need an "escape hatch" from React\'s declarative rendering — not as a general-purpose state container.',
    points: [
      'Managing focus, text selection, or media playback (.focus(), .play(), .pause()).',
      'Triggering imperative animations or measuring element size/position.',
      'Storing a mutable value (timer ID, previous value, counter) that, when changed, should NOT cause a re-render.',
      'Integrating third-party DOM libraries that need a real node reference to mount onto.'
    ],
    analogy: {
      icon: '🚫',
      title: 'When NOT to use useRef',
      text: '"If a value is part of what you render — anything that should cause the UI to update when it changes — it belongs in state (useState/useReducer), not a ref. Reading or writing ref.current during rendering breaks React\'s rendering model and leads to unpredictable, hard-to-debug behaviour. Refs are for the parts of your component that live \'outside\' the render output."'
    }
  },

  howItWorks: {
    description: 'useRef(initialValue) creates an object { current: initialValue } once, and returns the *same* object on every subsequent render — React never replaces or resets it (unlike a regular variable). When you pass a ref to a JSX element\'s `ref` attribute, React sets `.current` to that DOM node after it mounts, and back to null when it unmounts.',
    code: {
      title: 'Auto-focusing an input on mount, and tracking renders',
      snippet: `function SearchBox() {
  const inputRef = useRef(null);
  const renderCount = useRef(1);

  useEffect(() => {
    inputRef.current.focus(); // 👈 imperative DOM command — runs once, after mount
  }, []);

  useEffect(() => {
    renderCount.current += 1; // 👈 tracked silently — no re-render triggered by this line
  });

  return (
    <div>
      <input ref={inputRef} placeholder="Search…" />
      <p>This component has rendered {renderCount.current} time(s)</p>
    </div>
  );
}`
    },
    points: [
      'Refs are perfect for "previous value" tracking: store the current value in a ref inside a useEffect that runs after each render.',
      'forwardRef / useImperativeHandle let a parent get a ref to specific methods of a child component (covered in their own topics).',
      'Unlike state, multiple synchronous writes to ref.current immediately reflect the latest value — no batching, no async surprises.'
    ]
  },

  flowDiagram: {
    title: 'Ref vs. State — what triggers what',
    steps: [
      { icon: '🧠', label: 'setState(x)', note: 'Schedules a re-render' },
      { icon: '🔁', label: 'Component re-runs', note: 'New JSX computed & painted' },
      { icon: '📌', label: 'ref.current = x', note: 'Just updates the box' },
      { icon: '🙈', label: 'No re-render happens', note: 'UI stays exactly as-is' }
    ]
  },

  realWorldExamples: {
    intro: 'useRef quietly powers many polished interaction details:',
    items: [
      { icon: '🔍', title: 'Auto-focus a search input', description: 'Focus the input the instant a search page or modal opens — a tiny detail that makes an app feel responsive.', code: `const inputRef = useRef(null);\nuseEffect(() => { inputRef.current?.focus(); }, []);\n<input ref={inputRef} />` },
      { icon: '📜', title: 'Scroll to a message / element', description: 'Chat apps scroll to the latest message; "back to top" buttons scroll a container into view — both need a direct DOM handle.', code: `const bottomRef = useRef(null);\nuseEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);` },
      { icon: '⏱️', title: 'Storing timer/interval IDs', description: 'A debounce or stopwatch implementation stores its setTimeout/setInterval id in a ref so it can be cleared later without causing extra renders.', code: `const timerRef = useRef(null);\nclearTimeout(timerRef.current);\ntimerRef.current = setTimeout(doSearch, 500);` },
      { icon: '📈', title: 'Tracking the previous value of a prop', description: 'Compare "previous vs. current" (e.g. to animate only on increase) by stashing the last-seen value in a ref updated after each render.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Gives you an escape hatch to the imperative DOM APIs that declarative props can\'t express.',
      'Persists values across renders without the overhead (or the re-render trigger) of state.',
      'Synchronous, immediate reads/writes — no batching surprises like state has.',
      'Essential for integrating non-React libraries that need real DOM node references.'
    ],
    cons: [
      'Easy to misuse as a "silent state" — storing UI-relevant data in a ref means the screen won\'t update when it changes.',
      'Encourages imperative patterns that fight React\'s declarative model if overused.',
      'Reading/writing `.current` during render is unsafe and can produce inconsistent results — it must be confined to event handlers and effects.',
      'Can make data flow harder to trace, since ref changes are invisible to React DevTools\' render highlighting.'
    ]
  },

  comparison: {
    title: 'useRef vs. useState — the defining difference',
    left: {
      title: '🧠 useState — for renderable data',
      tone: 'good',
      code: `const [query, setQuery] = useState('');
// changing it -> component re-renders -> <p>{query}</p> updates on screen`,
      note: 'Use when the value is part of what the user sees, and changing it should visibly update the UI.'
    },
    right: {
      title: '📌 useRef — for "behind the scenes" data',
      tone: 'neutral',
      code: `const timerId = useRef(null);
// changing it -> nothing visibly updates; it's just bookkeeping for YOUR code`,
      note: 'Use when the value is "yours" to track — the UI doesn\'t (and shouldn\'t) directly reflect it.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Storing UI-relevant data in a ref (expecting the screen to update)',
        wrong: `const countRef = useRef(0);\n<button onClick={() => { countRef.current++; }}>\n  Clicked {countRef.current} times {/* ❌ never updates on screen! */}\n</button>`,
        right: `const [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>Clicked {count} times</button> {/* ✅ */}`,
        note: 'Mutating ref.current never schedules a re-render — if the value should appear in the UI, it must be state, not a ref.'
      },
      {
        title: 'Reading/writing ref.current during rendering',
        wrong: `function Component() {\n  myRef.current = computeSomething(); // ❌ side effect during render — unpredictable\n  return <div>{myRef.current}</div>;\n}`,
        right: `useEffect(() => {\n  myRef.current = computeSomething(); // ✅ confined to an effect (or event handler)\n});`,
        note: 'Render functions must be predictable/pure. Mutating refs during render can produce inconsistent values, especially with React\'s concurrent rendering features (e.g. rendering being paused/restarted).'
      },
      {
        title: 'Forgetting the ref might be null on first render',
        wrong: `const ref = useRef(null);\nref.current.focus(); // ❌ throws if called before the element has mounted`,
        right: `useEffect(() => { ref.current?.focus(); }, []); // ✅ runs after mount; optional chaining guards against null`,
      }
    ]
  },

  bestPractices: [
    'Ask "should the UI update when this changes?" — if yes, use state; if no (it\'s bookkeeping for your code), use a ref.',
    'Only read/write ref.current inside event handlers and effects — never during the render itself.',
    'Initialize DOM refs to null (useRef(null)) and use optional chaining (ref.current?.focus()) to guard against the element not yet being mounted.',
    'Always clean up anything you store a handle to in a ref (clear timers, close connections) in your effect\'s cleanup function.',
    'Reach for useImperativeHandle (with forwardRef) when you need to expose a *controlled, limited* imperative API from a custom component to its parent.'
  ],

  interviewQuestions: [
    { q: 'What is useRef, and how is the object it returns different from a regular variable?', a: 'useRef(initialValue) returns a mutable object { current: initialValue } that React keeps as the *same object* across every render of the component — unlike a regular `let` variable, which is recreated fresh on each render. You can read and write .current freely, and doing so does not cause the component to re-render.' },
    { q: 'What are the two main use cases for useRef?', a: 'First, accessing and imperatively interacting with real DOM elements (focusing an input, scrolling an element into view, playing a video) by attaching the ref to JSX via the `ref` attribute. Second, storing any mutable value that needs to persist across renders but should NOT trigger a re-render when it changes — timer/interval IDs, previous prop values, render counters, instance-like variables.' },
    { q: 'Why doesn\'t changing ref.current cause a component to re-render, and why is that useful?', a: 'React only schedules re-renders in response to state updates (useState/useReducer setters); mutating a plain object property is invisible to it. This is useful precisely because some values genuinely shouldn\'t affect the UI — e.g. a setTimeout id — and triggering a re-render every time you updated them would be wasteful and potentially cause render loops.' },
    { q: 'Why is it unsafe to read or write ref.current during the component\'s render (rather than in an effect or event handler)?', a: 'Render functions are expected to be pure and predictable — React may call them multiple times (e.g. in Strict Mode, or while preparing concurrent updates) before committing to the screen. Mutating a ref during render introduces a side effect into that "pure" calculation, which can leave .current with an inconsistent value depending on how many times/when React happened to call render. Confining ref reads/writes to effects and event handlers keeps behaviour predictable.' },
    { q: 'How would you implement an "auto-focus on mount" input using useRef?', a: 'Create a ref with useRef(null), attach it to the input via the ref attribute (<input ref={inputRef} />), and inside a useEffect with an empty dependency array, call inputRef.current?.focus(). The effect runs once after the component mounts and the DOM node exists, so the optional-chained focus() call safely runs the moment the element is available.' }
  ],

  summary: {
    description: 'useRef gives you a mutable box that survives renders without ever triggering one — your escape hatch for imperative DOM access and "behind the scenes" bookkeeping. The golden rule: if the value should be reflected in the UI, it\'s state; if it\'s just for your code to track, it\'s a ref. Confine ref reads/writes to effects and event handlers, never to the render itself.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/referencing-values-with-refs and react.dev/learn/manipulating-the-dom-with-refs — the canonical guides distinguishing refs from state and covering DOM-ref patterns.' }
  ]
};

export default useRefContent;
