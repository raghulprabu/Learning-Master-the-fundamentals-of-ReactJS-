const useRefContent = {
  id: 'useRef',
  title: 'useRef Hook',
  icon: '🔃',
  theme: 'amber',
  tagline: 'useRef gives you a box that stores a value without triggering re-renders.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useRef returns a plain object — { current: initialValue } — that React keeps stable across all renders. You can read and write .current freely, and changing it does NOT trigger a re-render.',
      'It has two main uses: (1) holding a reference to a DOM element so you can interact with it directly, and (2) storing a value that should persist across renders but not appear in the UI.'
    ],
    points: [
      'Syntax: const ref = useRef(initialValue); — ref.current holds the value.',
      'Attach to a DOM element: <input ref={inputRef} /> — React sets inputRef.current to the DOM node.',
      'Changing ref.current never triggers a re-render.'
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
      text: '"useRef is like a sticky note on the side of your monitor. You can write on it and read it anytime. It stays put no matter how many times the screen refreshes. But writing on it does not make the monitor refresh."'
    }
  },

  whyUsed: {
    description: 'Sometimes you need to command a DOM element directly (focus, scroll, play video), or remember a value that should not trigger a re-render when it changes (a timer ID, a previous prop).',
    points: [
      'Direct DOM access: .focus(), .play(), .scrollIntoView().',
      'Store timer IDs, WebSocket connections, or render counts.',
      'Avoid re-renders for bookkeeping data the UI does not directly show.',
      'Integrate non-React libraries that need a real DOM node.'
    ]
  },

  whenToUse: {
    description: 'Use useRef as an escape hatch from React\'s declarative rendering — not as a general-purpose state container.',
    points: [
      'Managing focus, text selection, or media playback.',
      'Measuring element size or triggering animations.',
      'Storing a mutable value that, when changed, should NOT re-render.',
      'Integrating third-party DOM libraries that need a real node.'
    ],
    analogy: {
      icon: '🚫',
      title: 'When NOT to use useRef',
      text: '"If a value should appear in the UI and the UI should update when it changes, use state — not a ref. Refs are for values that live \'behind the scenes\', outside the render output."'
    }
  },

  howItWorks: {
    description: 'useRef(initialValue) creates { current: initialValue } once and returns the same object on every render. When you pass a ref to a JSX element\'s ref attribute, React sets .current to the DOM node after mount and back to null on unmount.',
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
      'Store the previous value of a prop by updating a ref inside useEffect.',
      'forwardRef and useImperativeHandle let a parent get a ref to child methods.',
      'Unlike state, ref writes are synchronous and immediate — no batching.'
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
      { icon: '🔍', title: 'Auto-focus a search input', description: 'Focus the input the instant a page or modal opens.', code: `const inputRef = useRef(null);\nuseEffect(() => { inputRef.current?.focus(); }, []);\n<input ref={inputRef} />` },
      { icon: '📜', title: 'Scroll to a message', description: 'Chat apps scroll to the latest message using a ref to the bottom element.', code: `const bottomRef = useRef(null);\nuseEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);` },
      { icon: '⏱️', title: 'Storing timer IDs', description: 'A debounce implementation stores its setTimeout id in a ref to clear it later without extra renders.', code: `const timerRef = useRef(null);\nclearTimeout(timerRef.current);\ntimerRef.current = setTimeout(doSearch, 500);` },
      { icon: '📈', title: 'Tracking the previous value of a prop', description: 'Compare previous vs. current to animate only on increase — stash the last-seen value in a ref.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Escape hatch for imperative DOM APIs that declarative props cannot express.',
      'Persists values across renders without triggering a re-render.',
      'Synchronous, immediate reads and writes — no batching surprises.',
      'Essential for integrating non-React libraries that need real DOM nodes.'
    ],
    cons: [
      'Easy to misuse as "silent state" — UI-relevant data belongs in state, not a ref.',
      'Encourages imperative patterns that fight React\'s declarative model if overused.',
      'Reading or writing .current during render is unsafe and can produce inconsistent results.',
      'Ref changes are invisible to React DevTools render highlighting.'
    ]
  },

  comparison: {
    title: 'useRef vs. useState — the defining difference',
    left: {
      title: '🧠 useState — for renderable data',
      tone: 'good',
      code: `const [query, setQuery] = useState('');
// changing it -> component re-renders -> <p>{query}</p> updates on screen`,
      note: 'Use when the value is part of what the user sees.'
    },
    right: {
      title: '📌 useRef — for "behind the scenes" data',
      tone: 'neutral',
      code: `const timerId = useRef(null);
// changing it -> nothing visibly updates; it's just bookkeeping for YOUR code`,
      note: 'Use when the UI does not directly reflect the value.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Storing UI-relevant data in a ref',
        wrong: `const countRef = useRef(0);\n<button onClick={() => { countRef.current++; }}>\n  Clicked {countRef.current} times {/* ❌ never updates on screen! */}\n</button>`,
        right: `const [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>Clicked {count} times</button> {/* ✅ */}`,
        note: 'Mutating ref.current never schedules a re-render. If the value should appear in the UI, use state.'
      },
      {
        title: 'Reading or writing ref.current during rendering',
        wrong: `function Component() {\n  myRef.current = computeSomething(); // ❌ side effect during render — unpredictable\n  return <div>{myRef.current}</div>;\n}`,
        right: `useEffect(() => {\n  myRef.current = computeSomething(); // ✅ confined to an effect (or event handler)\n});`,
        note: 'Render functions must be pure. Confine ref reads and writes to effects and event handlers.'
      },
      {
        title: 'Forgetting the ref might be null on first render',
        wrong: `const ref = useRef(null);\nref.current.focus(); // ❌ throws if called before the element has mounted`,
        right: `useEffect(() => { ref.current?.focus(); }, []); // ✅ runs after mount; optional chaining guards against null`,
      }
    ]
  },

  bestPractices: [
    'Ask "should the UI update when this changes?" — yes means state, no means ref.',
    'Only read or write ref.current inside effects and event handlers, never during render.',
    'Initialize DOM refs to null and use optional chaining (ref.current?.focus()) as a guard.',
    'Always clean up timers and connections you store in a ref inside the effect cleanup.',
    'Use useImperativeHandle with forwardRef to expose a limited API from a child to its parent.'
  ],

  interviewQuestions: [
    { q: 'What is useRef, and how is the object it returns different from a regular variable?', a: 'useRef(initialValue) returns { current: initialValue } and React keeps it as the same object across every render. A regular let variable is recreated on each render. You can read and write .current freely, and doing so does not cause a re-render.' },
    { q: 'What are the two main use cases for useRef?', a: 'First, accessing and interacting with DOM elements — like focusing an input or scrolling. Second, storing a mutable value that must persist across renders but should NOT trigger a re-render — like a timer ID or a previous prop value.' },
    { q: 'Why does changing ref.current not cause a re-render?', a: 'React only schedules re-renders when you call state setters. Mutating a plain object property is invisible to React. This is useful for values like timer IDs that should not affect the UI.' },
    { q: 'Why is it unsafe to read or write ref.current during rendering?', a: 'Render functions must be pure. React may call them multiple times in Strict Mode or during concurrent rendering. Mutating a ref during render introduces a side effect into a pure calculation and can produce inconsistent values.' },
    { q: 'How do you auto-focus an input on mount using useRef?', a: 'Create a ref with useRef(null), attach it to the input via the ref attribute, and inside a useEffect with an empty dependency array, call ref.current?.focus(). The effect runs once after mount when the DOM node is available.' }
  ],

  summary: {
    description: 'useRef gives you a mutable box that survives renders without triggering one. Use it for direct DOM access and behind-the-scenes bookkeeping. If a value should be reflected in the UI, it belongs in state — not a ref.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/referencing-values-with-refs and react.dev/learn/manipulating-the-dom-with-refs — guides distinguishing refs from state and covering DOM-ref patterns.' }
  ]
};

export default useRefContent;
