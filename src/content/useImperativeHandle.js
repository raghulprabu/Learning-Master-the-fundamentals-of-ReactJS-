const useImperativeHandleContent = {
  id: 'useImperativeHandle',
  title: 'useImperativeHandle Hook',
  icon: '🎛️',
  theme: 'indigo',
  tagline: 'Customize exactly what a parent can do via ref to your component — a controlled, limited imperative API.',
  meta: 'Hooks · Advanced',

  whatIsIt: {
    description: [
      'useImperativeHandle lets a component customize the "handle" (the object) that\'s exposed to a parent when that parent attaches a ref to it — instead of exposing the raw underlying DOM node, you expose a deliberately-curated set of methods/values.',
      'It\'s almost always used together with forwardRef (or, in React 19, the `ref` prop passed directly to function components): forwardRef lets a parent pass a ref down to a child at all, and useImperativeHandle lets that child decide exactly what the parent receives through it.'
    ],
    points: [
      'Syntax: useImperativeHandle(ref, () => ({ /* curated methods/values */ }), [deps]);',
      'The factory function returns a plain object — typically a small set of imperative methods like focus(), scrollTo(), or reset().',
      'The parent\'s ref.current becomes that curated object — NOT the underlying DOM node or component instance.'
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
      text: '"Think of a TV remote control. You don\'t get to reach inside the television and rewire its circuit board (the raw DOM/internals) — you get a deliberately small, well-labeled set of buttons: Power, Volume, Channel. useImperativeHandle is the manufacturer DESIGNING that remote: deciding exactly which capabilities to expose to the outside world, and hiding all the complex internals behind a clean, intentional, limited interface."'
    }
  },

  whyUsed: {
    description: 'Refs to DOM elements expose the *entire* element — every property and method, including ones you never intended consumers to touch. For custom components, exposing "everything" breaks encapsulation: parents can reach in and manipulate internals in ways that bypass your component\'s logic entirely. useImperativeHandle lets you publish a small, deliberate, stable imperative API instead.',
    points: [
      'Encapsulation: hides internal DOM structure/implementation details, exposing only a curated, intentional set of capabilities.',
      'Stability: the exposed API can stay the same even if you completely refactor the component\'s internals.',
      'Safety: prevents parents from calling arbitrary DOM methods or mutating internals in ways that could break your component\'s invariants.',
      'Clarity: the object you return *is* the component\'s public imperative contract — self-documenting by design.'
    ]
  },

  whenToUse: {
    description: 'This is an advanced "escape hatch" — reach for it only when a parent genuinely needs to *imperatively command* a child component in ways that can\'t be expressed through props alone.',
    points: [
      'Building reusable input/media/canvas components that need to expose focus(), play(), reset(), scrollIntoView(), or similar imperative actions.',
      'Wrapping a third-party widget (rich text editor, chart, map) and exposing a small, intentional slice of its imperative API to your app.',
      'Building modal/dialog/drawer components where a parent needs to imperatively open()/close() them.',
      'Any case where you\'d otherwise be tempted to forward the raw DOM ref — but want to deliberately limit and shape what\'s exposed.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to use useImperativeHandle',
      text: '"If something CAN be expressed declaratively through props — \'show this error\', \'display this value\', \'be in this open/closed state\' — it should be. Reach for imperative handles only for actions that are inherently imperative by nature (commanding focus, triggering playback, scrolling) and that don\'t fit naturally into a render-driven, prop-based model. Overusing imperative APIs fights React\'s declarative strengths."'
    }
  },

  howItWorks: {
    description: 'forwardRef gives your component access to the ref a parent attached to it. Inside, useImperativeHandle(ref, factory, deps) tells React: "whenever this ref is attached, set ref.current to whatever this factory function returns" — rather than the component\'s default (the underlying DOM node, or nothing for plain function components).',
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
}`
    },
    points: [
      'The factory function re-runs when its dependency array changes — just like useMemo/useCallback — keeping the exposed handle fresh and stable when possible.',
      'You typically combine an internal useRef (for the real DOM node) with useImperativeHandle (to expose a curated API derived from it) — the parent never sees the internal ref.',
      'In React 19, function components can receive `ref` as a regular prop without forwardRef — but the useImperativeHandle pattern for curating the exposed handle remains the same.'
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
    intro: 'useImperativeHandle is the backbone of well-designed, reusable component APIs in production component libraries:',
    items: [
      { icon: '🎥', title: 'Media players', description: 'A custom <VideoPlayer> exposes play(), pause(), and seek(time) — letting a parent control playback from an external button bar without ever touching the raw <video> element.' },
      { icon: '🔍', title: 'Search inputs with imperative focus/clear', description: 'A reusable <SearchBox> exposes focus() and clear() — so a parent\'s "⌘K to search" shortcut or a "reset filters" button can command it directly.' },
      { icon: '🗨️', title: 'Modals, drawers, and toasts', description: 'Dialog-style components expose open()/close()/dismiss() — letting any part of the app trigger them imperatively, exactly the kind of action that doesn\'t map cleanly to a prop.' },
      { icon: '📈', title: 'Chart and canvas wrappers', description: 'Wrapping a charting library, you might expose exportAsImage() or resetZoom() — a small, intentional slice of that library\'s much larger imperative surface.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Lets you expose a small, intentional, well-named imperative API instead of leaking raw DOM nodes or internals.',
      'Keeps your component free to refactor its internals completely, as long as the exposed handle\'s contract stays the same.',
      'Makes genuinely-imperative interactions (focus, playback, scrolling, opening/closing) clean and explicit, rather than forced into awkward prop-based workarounds.',
      'Self-documents a component\'s "public imperative contract" — the returned object IS the API.'
    ],
    cons: [
      'An advanced escape hatch — overusing it reintroduces the kind of imperative, hard-to-trace code React\'s declarative model is designed to avoid.',
      'Requires pairing with forwardRef (extra boilerplate, an extra concept) in versions/patterns where that\'s needed.',
      'Can make data flow harder to follow — "what does this ref do?" requires reading the child\'s implementation, unlike props which are visible at the call site.',
      'Easy to reach for when a declarative, prop-driven solution (passing `isOpen` instead of exposing open()/close()) would be simpler and more idiomatic.'
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
      note: 'The parent can do absolutely anything to the underlying element — including things that corrupt your component\'s internal assumptions.'
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
      note: 'The parent gets exactly the capabilities you designed for — nothing more, nothing that could violate your component\'s invariants.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Reaching for it when a declarative prop would do',
        wrong: `// ❌ exposing open()/close() when a simple boolean prop is more idiomatic\nuseImperativeHandle(ref, () => ({ open: () => setIsOpen(true), close: () => setIsOpen(false) }));`,
        right: `// ✅ let the parent simply own and pass the open state — fully declarative\nfunction Modal({ isOpen, onClose, children }) { /* render based on isOpen */ }`,
        note: 'Before reaching for an imperative handle, ask: "could the parent just pass a prop describing the desired STATE instead of commanding an ACTION?" If yes, the declarative prop-based approach is usually simpler, more testable, and more idiomatic React.'
      },
      {
        title: 'Exposing too much — defeating the purpose of curation',
        wrong: `useImperativeHandle(ref, () => ({\n  ...videoRef.current, // ❌ spreads the ENTIRE DOM element — same problem as raw forwardRef!\n  customMethod() { /* ... */ }\n}));`,
        right: `useImperativeHandle(ref, () => ({\n  play: () => videoRef.current.play(),\n  pause: () => videoRef.current.pause()\n  // ✅ only the specific, intentional capabilities — nothing more\n}));`,
        note: 'The entire point of useImperativeHandle is deliberate curation. Spreading the underlying element/instance into the returned object reintroduces exactly the "expose everything" problem it exists to solve.'
      },
      {
        title: 'Forgetting the dependency array, causing a fresh object every render',
        wrong: `useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() })); // ❌ no deps — recreated every render`,
        right: `useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }), []); // ✅ stable across renders when deps are unchanged`,
        note: 'Like useMemo/useCallback, the factory function should be paired with a dependency array — an empty array for handles whose methods don\'t depend on changing values, or a populated one when they genuinely do.'
      }
    ]
  },

  bestPractices: [
    'Default to declarative props; reach for useImperativeHandle only for genuinely imperative actions (focus, playback, scrolling, opening/closing) that don\'t map cleanly to render-driven state.',
    'Curate deliberately — expose the smallest, most intention-revealing set of methods/values; never spread the underlying DOM node or instance into the handle.',
    'Pair it with an internal useRef to the real element/instance — the parent should only ever see the curated object, never the raw thing underneath.',
    'Treat the returned object as your component\'s public contract — name methods clearly (play/pause/reset, not doThing/internalAction) and keep it stable across refactors.',
    'Always provide a dependency array to the factory function, mirroring how you\'d treat useMemo/useCallback.'
  ],

  interviewQuestions: [
    { q: 'What does useImperativeHandle do, and what is it almost always used together with?', a: 'It customizes the value exposed to a parent component when that parent attaches a ref to your component — letting you return a deliberately-curated object (typically a small set of methods like focus()/play()/reset()) instead of the raw underlying DOM node. It\'s almost always paired with forwardRef (or, in React 19, the direct `ref` prop on function components), since that\'s what makes the parent\'s ref reach the child component in the first place.' },
    { q: 'Why would you use useImperativeHandle instead of just forwarding the ref directly to the underlying DOM element?', a: 'Forwarding the raw ref exposes the ENTIRE underlying element — every property and method, including ones that could let a parent bypass your component\'s logic (directly mutating .value, removing the node from the DOM, overriding styles) and corrupt its internal assumptions. useImperativeHandle lets you instead publish a small, deliberate, well-named imperative API — preserving encapsulation, letting you refactor internals freely, and preventing misuse.' },
    { q: 'Give an example of a good use case for useImperativeHandle, and an example of when you should avoid it in favor of props.', a: 'A good use case: a reusable <VideoPlayer> exposing play()/pause()/seek(time) — these are inherently imperative actions that don\'t map naturally to a render-driven prop. A case to avoid it: a <Modal> exposing open()/close() methods, when instead the parent could simply own an `isOpen` boolean and pass it down as a prop — fully declarative, easier to test, and more idiomatic React. The rule of thumb: if something can be expressed as "what state should this be in", prefer props; reserve imperative handles for actions that are inherently commands.' },
    { q: 'What does the factory function passed to useImperativeHandle return, and how does its dependency array work?', a: 'It returns a plain JavaScript object — whatever you want the parent\'s ref.current to be (typically an object of methods, sometimes including derived values). The dependency array works exactly like useMemo/useCallback\'s: React only re-runs the factory (producing a new handle object) when one of the listed dependencies changes; otherwise it reuses the previous handle, keeping its identity stable across renders.' },
    { q: 'What\'s a common mistake when designing the object returned from useImperativeHandle, and why does it defeat the Hook\'s purpose?', a: 'A common mistake is spreading the underlying DOM node or instance into the returned object (e.g. `{ ...videoRef.current, customMethod }`) — this re-exposes every property and method of the raw element, recreating the exact "expose everything, allow any misuse" problem that useImperativeHandle exists to prevent. The whole value of the Hook comes from DELIBERATE curation: returning only the small, specific, well-named set of capabilities you intend the parent to use.' }
  ],

  summary: {
    description: 'useImperativeHandle lets a component design its own "remote control" — publishing a small, deliberate, well-named imperative API to parents via ref, instead of leaking its raw DOM node or internals. Pair it with forwardRef and an internal useRef, curate the exposed object tightly (never spread the underlying element), and reserve it for genuinely imperative actions that don\'t map cleanly to declarative props — which should remain your default.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/useImperativeHandle — the canonical reference, including the "Exposing a custom imperative handle" walkthrough with forwardRef.' },
    { label: 'Related topic', note: 'See "useRef" for the foundational Hook this one builds on, and "Component Composition" for when a declarative, prop-driven design is the better fit.' }
  ]
};

export default useImperativeHandleContent;
