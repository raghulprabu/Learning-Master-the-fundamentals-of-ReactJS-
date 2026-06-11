const useImperativeHandleContent = {
  id: 'useImperativeHandle',
  title: 'useImperativeHandle Hook',
  icon: '🎛️',
  theme: 'indigo',
  tagline: 'useImperativeHandle lets you control exactly what a parent can do via ref to your component.',
  meta: 'Hooks · Advanced',

  whatIsIt: {
    description: [
      'useImperativeHandle lets a component customize what a parent receives when that parent attaches a ref to it — instead of the raw underlying DOM node, you expose a small, deliberate set of methods.',
      'It is almost always used together with forwardRef, which lets the parent pass a ref down to a child in the first place.'
    ],
    points: [
      'Syntax: useImperativeHandle(ref, () => ({ /* curated methods */ }), [deps]);',
      'The factory function returns a plain object — typically a small set of methods like focus(), play(), or reset().',
      'The parent\'s ref.current becomes that curated object — NOT the raw DOM node.'
    ],
    code: { title: 'The basic shape', snippet: `const VideoPlayer = forwardRef(function VideoPlayer(props, ref) {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play()  { videoRef.current.play(); },
    pause() { videoRef.current.pause(); },
    seek(time) { videoRef.current.currentTime = time; }
    // 👆 Notice: NOT exposing the raw <video> element itself —
    //    just this small, deliberate, well-named API surface
  }), []);

  return <video ref={videoRef} {...props} />;
});

// Parent:
const playerRef = useRef(null);
<VideoPlayer ref={playerRef} src="..." />
<button onClick={() => playerRef.current.play()}>▶ Play</button>` },
    analogy: {
      icon: '🕹️',
      title: 'Real-World Analogy',
      text: '"Think of a TV remote. You do not get to reach inside the television and rewire its circuit board. You get a small, well-labeled set of buttons: Power, Volume, Channel. useImperativeHandle is the manufacturer designing that remote — deciding exactly which capabilities to expose, and hiding all the complex internals behind a clean, limited interface."'
    }
  },

  whyUsed: {
    description: 'Refs to DOM elements expose the entire element — every property and method, including ones parents should never touch. useImperativeHandle lets you publish a small, deliberate, stable API instead.',
    points: [
      'Encapsulation — hide internal DOM details, expose only intended capabilities.',
      'Stability — the exposed API stays the same even if you refactor the internals.',
      'Safety — parents cannot call arbitrary DOM methods that could break your component.',
      'Clarity — the returned object IS the component\'s public imperative contract.'
    ]
  },

  whenToUse: {
    description: 'This is an advanced escape hatch — use it only when a parent genuinely needs to imperatively command a child in ways that cannot be expressed through props.',
    points: [
      'Reusable input or media components that need to expose focus(), play(), reset().',
      'Wrapping a third-party widget and exposing a small slice of its imperative API.',
      'Modal or dialog components where a parent needs to imperatively open() or close().',
      'When you would otherwise forward the raw DOM ref but want to limit what is exposed.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use useImperativeHandle',
      text: '"If something CAN be expressed as a prop — \'show this error\', \'be in this open/closed state\' — it should be. Reach for imperative handles only for actions that are inherently imperative (commanding focus, triggering playback) and that do not fit a prop-based model."'
    }
  },

  howItWorks: {
    description: 'forwardRef gives your component access to the ref a parent attached. useImperativeHandle(ref, factory, deps) sets ref.current to whatever the factory function returns — instead of the underlying DOM node.',
    code: {
      title: 'A reusable, imperatively-controllable Modal',
      snippet: `const Modal = forwardRef(function Modal({ children }, ref) {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open()  { dialogRef.current.showModal(); },
    close() { dialogRef.current.close();    }
    // The parent can OPEN and CLOSE — but can't reach in and
    // mess with the <dialog>'s other attributes/children directly
  }), []);

  return <dialog ref={dialogRef}>{children}<CloseButton /></dialog>;
});

function ConfirmDeletePage() {
  const modalRef = useRef(null);
  return (
    <>
      <button onClick={() => modalRef.current.open()}>Delete account</button>
      <Modal ref={modalRef}>
        <p>Are you sure? This can't be undone.</p>
        <button onClick={() => modalRef.current.close()}>Cancel</button>
      </Modal>
    </>
  );
}` },
    points: [
      'The factory function re-runs when its dependencies change — just like useMemo.',
      'Combine an internal useRef (for the real DOM node) with useImperativeHandle (for the curated API).',
      'In React 19, function components can receive ref as a regular prop without forwardRef.'
    ]
  },

  flowDiagram: {
    title: 'From parent ref to curated handle',
    steps: [
      { icon: '👨‍👧', label: 'Parent: <Child ref={childRef} />', note: 'Wants to imperatively command the child' },
      { icon: '➡️', label: 'forwardRef passes the ref down', note: 'Child receives it as its 2nd argument' },
      { icon: '🛠️', label: 'useImperativeHandle(ref, factory)', note: 'Child builds a curated object' },
      { icon: '🎯', label: 'childRef.current = { play, pause }', note: 'Parent only sees what the child chose to expose' }
    ]
  },

  realWorldExamples: {
    intro: 'useImperativeHandle is the backbone of well-designed reusable component APIs:',
    items: [
      { icon: '🎥', title: 'Media players', description: 'A custom <VideoPlayer> exposes play(), pause(), and seek(time) — letting a parent control playback from an external button bar without touching the raw <video> element.' },
      { icon: '🔍', title: 'Search inputs with focus/clear', description: 'A reusable <SearchBox> exposes focus() and clear() so a parent\'s keyboard shortcut or reset button can command it directly.' },
      { icon: '🗨️', title: 'Modals, drawers, and toasts', description: 'Dialog-style components expose open()/close()/dismiss() — letting any part of the app trigger them imperatively.' },
      { icon: '📈', title: 'Chart and canvas wrappers', description: 'Wrapping a charting library, you might expose exportAsImage() or resetZoom() — a small intentional slice of the library\'s larger imperative surface.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Expose a small, intentional imperative API instead of leaking raw DOM nodes.',
      'Free to refactor internals completely while keeping the exposed handle the same.',
      'Makes genuinely imperative interactions (focus, playback, scrolling) clean and explicit.',
      'The returned object documents the component\'s public imperative contract.'
    ],
    cons: [
      'Advanced escape hatch — overusing it reintroduces imperative, hard-to-trace code.',
      'Requires pairing with forwardRef in most cases — extra boilerplate.',
      'Makes data flow harder to follow — "what does this ref do?" requires reading the child.',
      'Easy to reach for when a declarative, prop-driven solution would be simpler.'
    ]
  },

  comparison: {
    title: 'Exposing the raw DOM node vs. a curated handle',
    left: {
      title: '😬 Raw forwardRef — exposes EVERYTHING',
      tone: 'bad',
      code: `const TextInput = forwardRef((props, ref) => <input ref={ref} {...props} />);

// Parent now has the ENTIRE <input> element:
inputRef.current.value = 'hacked';     // bypasses React state entirely!
inputRef.current.style.display = 'none'; // breaks layout assumptions
inputRef.current.remove();               // removes it from the DOM!`,
      note: 'The parent can do absolutely anything to the underlying element — including things that corrupt internal assumptions.'
    },
    right: {
      title: '✅ useImperativeHandle — exposes a CURATED handle',
      tone: 'good',
      code: `const TextInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; }
  }), []);
  return <input ref={inputRef} {...props} />;
});

// Parent can ONLY do what you intentionally exposed:
inputRef.current.focus(); // ✅
inputRef.current.clear(); // ✅
inputRef.current.remove(); // ❌ TypeError — not exposed, impossible to misuse`,
      note: 'The parent gets exactly the capabilities you designed — nothing that could violate the component\'s invariants.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Reaching for it when a declarative prop would do',
        wrong: `// ❌ exposing open()/close() when a boolean prop is more idiomatic\nuseImperativeHandle(ref, () => ({ open: () => setIsOpen(true), close: () => setIsOpen(false) }));`,
        right: `// ✅ let the parent simply own and pass the open state\nfunction Modal({ isOpen, onClose, children }) { /* render based on isOpen */ }`,
        note: 'Before reaching for an imperative handle, ask: "could the parent pass a prop describing the desired state instead?" If yes, the declarative approach is usually simpler and more idiomatic.'
      },
      {
        title: 'Exposing too much — spreading the underlying element',
        wrong: `useImperativeHandle(ref, () => ({\n  ...videoRef.current, // ❌ spreads the ENTIRE DOM element\n  customMethod() { /* ... */ }\n}));`,
        right: `useImperativeHandle(ref, () => ({\n  play: () => videoRef.current.play(),\n  pause: () => videoRef.current.pause()\n  // ✅ only the specific, intentional capabilities\n}));`,
        note: 'The whole point of useImperativeHandle is deliberate curation. Spreading the underlying element reintroduces the "expose everything" problem it exists to solve.'
      },
      {
        title: 'Forgetting the dependency array',
        wrong: `useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() })); // ❌ recreated every render`,
        right: `useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }), []); // ✅ stable`,
        note: 'Like useMemo, pair the factory with a dependency array — empty for handles whose methods do not depend on changing values.'
      }
    ]
  },

  bestPractices: [
    'Default to declarative props. Use useImperativeHandle only for genuinely imperative actions.',
    'Curate deliberately — expose the smallest set of well-named methods; never spread the underlying DOM node.',
    'Pair it with an internal useRef to the real element — the parent should never see the raw thing underneath.',
    'Treat the returned object as the component\'s public contract — name methods clearly and keep it stable.',
    'Always provide a dependency array to the factory function, like you would with useMemo.'
  ],

  interviewQuestions: [
    { q: 'What does useImperativeHandle do, and what is it almost always used together with?', a: 'It customizes the value exposed to a parent when that parent attaches a ref — letting you return a curated object (typically a small set of methods like focus() or play()) instead of the raw DOM node. It is almost always paired with forwardRef, which makes the parent\'s ref reach the child component.' },
    { q: 'Why use useImperativeHandle instead of just forwarding the ref to the DOM element?', a: 'Forwarding the raw ref exposes the entire element — including properties that could let a parent bypass your component\'s logic and corrupt internal assumptions. useImperativeHandle lets you publish a small, deliberate API that preserves encapsulation and prevents misuse.' },
    { q: 'Give a good use case and a case to avoid it.', a: 'Good use case: a <VideoPlayer> exposing play()/pause() — these are inherently imperative actions that do not map to props. Case to avoid: a <Modal> exposing open()/close() when the parent could simply own an isOpen boolean and pass it down as a prop. If something can be expressed as "what state should this be in", prefer props.' },
    { q: 'How does the dependency array work in useImperativeHandle?', a: 'It works exactly like useMemo. React only re-runs the factory and produces a new handle when one of the listed dependencies changes. Use an empty array for handles whose methods do not depend on changing values.' },
    { q: 'What is a common mistake when designing the returned object?', a: 'A common mistake is spreading the underlying DOM node or instance into the returned object. This re-exposes every property and method, defeating the purpose of useImperativeHandle. The value comes entirely from deliberate curation — returning only the specific, well-named capabilities you intend the parent to use.' }
  ],

  summary: {
    description: 'useImperativeHandle lets a component design its own remote control — publishing a small, deliberate imperative API to parents via ref instead of leaking the raw DOM node. Pair it with forwardRef, curate the exposed object tightly, and reserve it for genuinely imperative actions that do not map cleanly to declarative props.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useImperativeHandle — the canonical reference with the forwardRef walkthrough.' },
    { label: 'Related topic', note: 'See "useRef" for the foundational Hook, and "Component Composition" for when a declarative, prop-driven design fits better.' }
  ]
};

export default useImperativeHandleContent;
