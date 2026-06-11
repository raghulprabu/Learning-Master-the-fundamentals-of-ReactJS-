const advancedPatternsContent = {
  id: 'advancedPatterns',
  title: 'Advanced React Patterns',
  icon: '🎨',
  theme: 'purple',
  tagline: 'HOCs, Render Props, Compound Components, and the patterns that power great React libraries.',
  meta: 'Patterns · Architecture',

  whatIsIt: {
    description: [
      'Advanced React patterns are reusable solutions to common problems in component composition and logic sharing. They describe how to structure components and hooks so behavior and state can be shared and extended without tight coupling.',
      'The most important patterns: Higher-Order Components (HOC), Render Props, Compound Components, the Provider Pattern, and Controlled/Uncontrolled components. Custom hooks now replace most Render Props use cases.'
    ],
    points: [
      'Higher-Order Components (HOC): a function that takes a component and returns an enhanced one — used for auth checks, logging, and data fetching.',
      'Render Props: a component delegates "what to render" via a function prop — flexible, but largely replaced by custom hooks.',
      'Compound Components: multiple components working together via shared implicit state (e.g. <Tabs> + <Tabs.Tab>) — powers most component libraries.',
      'Controlled Components: the parent fully controls state via props + onChange — maximum flexibility for consumers.',
      'Provider Pattern: wraps children with Context.Provider to share state — the foundation of React Router, TanStack Query, and auth libraries.'
    ],
    code: { title: 'The four patterns at a glance', snippet: `// 1. HIGHER-ORDER COMPONENT
const withAuth = (WrappedComponent) => (props) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <WrappedComponent {...props} user={user} />;
};
const ProtectedDashboard = withAuth(Dashboard);

// 2. RENDER PROPS (modern: via children function)
function DataFetcher({ url, children }) {
  const { data, isLoading, error } = useFetch(url);
  return children({ data, isLoading, error }); // caller decides how to render
}
<DataFetcher url="/api/user">{({ data }) => <Avatar user={data} />}</DataFetcher>

// 3. COMPOUND COMPONENTS
function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return <TabContext.Provider value={{ active, setActive }}>{children}</TabContext.Provider>;
}
Tabs.Tab = function Tab({ id, children }) {
  const { active, setActive } = useContext(TabContext);
  return <button className={active === id ? 'active' : ''} onClick={() => setActive(id)}>{children}</button>;
};
// Usage:
<Tabs defaultTab="profile">
  <Tabs.Tab id="profile">Profile</Tabs.Tab>
  <Tabs.Tab id="settings">Settings</Tabs.Tab>
</Tabs>

// 4. CONTROLLED COMPONENT PATTERN
function RatingInput({ value, onChange }) { // fully controlled by parent
  return [1,2,3,4,5].map(n => (
    <Star key={n} filled={n <= value} onClick={() => onChange(n)} />
  ));
}
// Parent owns the state — caller has full control
const [rating, setRating] = useState(0);
<RatingInput value={rating} onChange={setRating} />` },
    analogy: {
      icon: '🧰',
      title: 'Real-World Analogy',
      text: '"These patterns are like LEGO system design. HOCs are factory machines — you put a plain brick in, a pre-assembled structure comes out. Render Props are moulds — you choose what material to fill them with. Compound Components are LEGO sets where individual pieces (head, body, legs) share a hidden connector. The Provider Pattern is a shared parts bin everyone at the same table can reach into without asking."'
    }
  },

  whyUsed: {
    description: 'Prop-drilling and copy-pasting logic do not scale. Each pattern solves a specific composition or logic-sharing challenge that appears as apps grow.',
    points: [
      'HOCs apply cross-cutting concerns (auth, analytics, feature flags) to components without modifying them.',
      'Render Props and custom hooks share stateful logic without imposing a render structure.',
      'Compound Components model naturally grouped UI elements where children share implicit state.',
      'Controlled components give consumers full control over state — critical for form libraries and design systems.'
    ]
  },

  whenToUse: {
    description: 'Modern React leans on custom hooks — but these patterns remain essential when building component libraries.',
    points: [
      'HOC: apply one behavior to many components without editing each (auth wrapper, feature flag, analytics tracking).',
      'Render Props: legacy code or when a render function must be passed directly as a prop. New code: use a custom hook instead.',
      'Compound Components: library elements with strongly related subcomponents (Tabs+Tab, Menu+MenuItem, Accordion+Panel).',
      'Controlled pattern: any reusable input — always expose value+onChange to give consumers control over state.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When to prefer custom hooks over these patterns',
      text: '"Custom hooks replaced Render Props for almost all logic-sharing in React 16.8+. Before hooks, sharing \'is the user online?\' state meant writing a <NetworkStatus render={isOnline => ...}> component. Now you write useNetworkStatus() — same logic, simpler API, composable with other hooks, no extra component in the tree. Choose render props only when the caller genuinely needs to control rendering. For logic sharing, use a hook."'
    }
  },

  howItWorks: {
    description: 'Each pattern uses a different mechanism: HOCs use function composition; Render Props use function children; Compound Components use Context for implicit state sharing; Controlled Components use props as the source of truth.',
    code: {
      title: 'Compound component pattern — full implementation',
      snippet: `// A fully-featured Accordion compound component
const AccordionContext = createContext(null);

function Accordion({ children, defaultOpen = null, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(defaultOpen ? [defaultOpen] : []);

  const toggle = useCallback((id) => {
    setOpenItems(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  }, [allowMultiple]);

  const isOpen = useCallback((id) => openItems.includes(id), [openItems]);

  const value = useMemo(() => ({ toggle, isOpen }), [toggle, isOpen]);
  return <AccordionContext.Provider value={value}>{children}</AccordionContext.Provider>;
}

Accordion.Item = function AccordionItem({ id, children }) {
  const { toggle, isOpen } = useContext(AccordionContext);
  const open = isOpen(id);
  return (
    <div className="accordion-item">
      <button
        onClick={() => toggle(id)}
        aria-expanded={open}
        aria-controls={\`panel-\${id}\`}
      >
        {children[0]}
        <span>{open ? '▲' : '▼'}</span>
      </button>
      <div id={\`panel-\${id}\`} hidden={!open}>{children[1]}</div>
    </div>
  );
};

// Usage — clean, self-describing, no external state needed
<Accordion defaultOpen="q1">
  <Accordion.Item id="q1">
    <span>What is React?</span>
    <p>A JavaScript library for building user interfaces...</p>
  </Accordion.Item>
  <Accordion.Item id="q2">
    <span>What are hooks?</span>
    <p>Functions that let you use state in function components...</p>
  </Accordion.Item>
</Accordion>` },
    points: [
      'The dot notation API (Accordion.Item, Tabs.Tab) is made by attaching the subcomponent as a property: Accordion.Item = function(...) {}. Groups related components under one namespace.',
      'Two <Accordion> instances on the same page each get their own independent Context value — the same Context object is scoped to each provider\'s subtree.',
      'Support both controlled and uncontrolled modes for compound components — let consumers optionally lift control out if needed.'
    ]
  },

  flowDiagram: {
    title: 'Choosing the right pattern',
    steps: [
      { icon: '🤔', label: 'Need to share LOGIC across components?', note: 'Custom hook — cleanest for most cases' },
      { icon: '🎁', label: 'Need to wrap component with BEHAVIOR?', note: 'HOC — auth wrapper, loading, error boundary' },
      { icon: '🧩', label: 'Components naturally work TOGETHER?', note: 'Compound Components via Context' },
      { icon: '🎛️', label: 'Should parent CONTROL the state?', note: 'Controlled Component: value + onChange' },
      { icon: '🌳', label: 'Multiple components need SHARED state?', note: 'Provider Pattern (Context + custom hook)' }
    ]
  },

  realWorldExamples: {
    intro: 'These patterns power the most-used React libraries:',
    items: [
      {
        icon: '🧩',
        title: 'Radix UI — Compound Components in production',
        description: '<Dialog.Root>, <Dialog.Trigger>, <Dialog.Content>, <Dialog.Close> — each is simple and focused, sharing implicit state through Context. Consumers compose exactly the UI they need; the library handles accessibility and focus trapping.'
      },
      {
        icon: '🛡️',
        title: 'React Router protected routes',
        description: '<Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>}> — ProtectedRoute is effectively an HOC in component form: it wraps the child and adds auth-checking without Dashboard knowing about authentication.',
        code: `// The "component-form HOC" — same concept as withAuth, different syntax
function ProtectedRoute({ children }) {
  const { user, status } = useAuth();
  if (status === 'loading') return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}`
      },
      {
        icon: '⚛️',
        title: 'react-hook-form — Controlled + Uncontrolled hybrid',
        description: 'Uses uncontrolled inputs (ref-based) internally for performance, but exposes a controlled-looking API via Controller and register. Combines the speed of uncontrolled inputs with the ergonomics of controlled ones.'
      },
      {
        icon: '🎣',
        title: 'TanStack Query — Provider + custom hooks',
        description: '<QueryClientProvider> wraps the app (Provider Pattern), making the cache available everywhere. useQuery() and useMutation() are custom hooks that read from that provider. One Provider at root, hooks for consumption — the standard React library architecture.'
      }
    ]
  },

  prosAndCons: {
    pros: [
      'HOCs apply cross-cutting concerns to many components without modifying each one.',
      'Compound Components give the most natural, composable API for grouped UI elements.',
      'Controlled Components give consumers complete state control — enables every possible integration.',
      'Provider Pattern scales to arbitrarily complex shared state without prop drilling.'
    ],
    cons: [
      'HOCs: stacking multiple HOCs creates deep wrapper trees that are hard to debug in DevTools.',
      'Render Props: verbose nested-function syntax — replaced by custom hooks for most cases.',
      'Compound Components: more complex to build than a single component; needs careful accessibility work.',
      'Controlled Components: parent must manage state — more verbose for simple use cases.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using a HOC when a custom hook would be simpler',
        wrong: `// ❌ HOC just to share data-fetching logic — no rendering change needed
const withUserData = (WrappedComponent) => (props) => {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  return <WrappedComponent {...props} user={user} />;
};`,
        right: `// ✅ Custom hook — same logic, no extra component layer
function useUserData() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  return user;
}`,
        note: 'If the HOC does not add any rendering — no conditional return, no wrapper DOM — it is just sharing logic. Custom hooks do that with no component overhead and compose better with other hooks.'
      },
      {
        title: 'Using a Compound Component subcomponent outside its parent',
        wrong: `// ❌ Using Tabs.Tab without Tabs — Context is null → runtime crash\n<div><Tabs.Tab id="profile">Profile</Tabs.Tab></div>`,
        right: `// ✅ Add a guard in the subcomponent\nfunction Tab({ id, children }) {\n  const ctx = useContext(TabContext);\n  if (!ctx) throw new Error('<Tabs.Tab> must be used inside <Tabs>');\n  // ...\n}`,
        note: 'Always guard Context consumption in compound components. Throw a clear error rather than silently rendering incorrectly — this makes debugging much faster for consumers.'
      },
      {
        title: 'Making a component always uncontrolled when it should support both',
        wrong: `// ❌ Component uses only internal state — consumers cannot control it\nfunction Toggle({ label }) {\n  const [on, setOn] = useState(false);\n  return <button onClick={() => setOn(v => !v)}>{label}: {on ? 'on' : 'off'}</button>;\n}`,
        right: `// ✅ Support both — uncontrolled by default, controlled when value prop provided\nfunction Toggle({ label, value, onChange, defaultValue = false }) {\n  const [internal, setInternal] = useState(defaultValue);\n  const isControlled = value !== undefined;\n  const on = isControlled ? value : internal;\n  const handleClick = () => {\n    if (!isControlled) setInternal(v => !v);\n    onChange?.(!on);\n  };\n  return <button onClick={handleClick}>{label}: {on ? 'on' : 'off'}</button>;\n}`,
        note: 'Any reusable component that holds display state should support both modes: controlled (value prop provided by parent) and uncontrolled (manages its own state). This is the contract that HTML inputs and every well-designed library component follow.'
      }
    ]
  },

  bestPractices: [
    'Prefer custom hooks over Render Props for logic sharing — hooks compose better and appear as named hooks in DevTools.',
    'Use HOCs for behavior that adds rendering (auth check, loading wrapper) — keep each HOC single-purpose with a clear name (withAuth, withErrorBoundary).',
    'In Compound Components, always throw a clear error when a subcomponent is used outside its parent.',
    'Support both controlled and uncontrolled modes for any reusable input — defaultValue + value + onChange is the established pattern.',
    'Memoize Context values in Providers with useMemo and useCallback — prevents consumers re-rendering from unrelated parent updates.',
    'Document the compound component API — which subcomponents exist, which are optional, and what props they accept.'
  ],

  interviewQuestions: [
    { q: 'What is a Higher-Order Component (HOC) and what problems does it solve?', a: 'A HOC is a function that takes a component and returns a new, enhanced component. It implements the Decorator design pattern. HOCs solve cross-cutting concerns — applying the same behavior (auth checking, analytics tracking, feature flag gating) to many components without modifying each one. The wrapped component knows nothing about the added behavior. Modern React often uses HOC-style wrappers (route protection, error boundaries) while extracting most logic into custom hooks.' },
    { q: 'What is the Compound Component pattern and when do you use it?', a: 'Compound Components are multiple components designed to work together, sharing implicit state through React Context. <Tabs> provides active tab state via Context; <Tabs.Tab> reads that Context to know which tab is active. Use it when: subcomponents have a strong conceptual grouping (always used together), they need to share state without prop drilling between siblings, and you want a composable API that lets consumers control the structure rather than a monolithic config-driven component.' },
    { q: 'What is the difference between controlled and uncontrolled components?', a: 'A controlled component receives its value via a prop and signals changes via onChange — the parent owns the state. An uncontrolled component manages its own internal state — the parent can give a defaultValue and an optional onChange callback. Controlled gives total visibility and control (real-time validation, cross-field dependencies). Uncontrolled is simpler when the parent only needs the value on submit. Well-designed reusable components support both modes.' },
    { q: 'When would you use Render Props vs. Custom Hooks vs. HOCs?', a: 'Custom Hooks are the default for sharing stateful logic — they compose cleanly and work with other hooks. Use for API fetching, subscriptions, media queries, and virtually any logic-sharing need. Render Props are useful when a component genuinely needs to delegate rendering as a prop — rare in modern code. HOCs are most appropriate when you want to apply behavior at the component level (conditional rendering, error wrapping) without modifying the component\'s function body. In modern apps, write custom hooks and encounter HOCs in library code.' },
    { q: 'How does the Provider Pattern differ from prop drilling?', a: 'The Provider Pattern uses React Context to make a value available to any descendant without passing it through every intermediate component. A Context.Provider at the top makes the value accessible to any descendant calling useContext, regardless of depth. Trade-offs: eliminates prop-drilling pain but introduces coupling — any component in the tree can read that Context. Context updates re-render all consumers — mitigated by memoizing the value and splitting contexts by update frequency.' }
  ],

  summary: {
    description: 'Advanced React patterns — HOCs, Render Props, Compound Components, Controlled Components, and the Provider Pattern — solve specific composition problems at scale. In modern React, custom hooks replace Render Props for logic sharing, HOCs add rendering-level behavior, Compound Components give natural APIs for component libraries, and the Provider Pattern powers virtually every major React library. Know all of them; default to custom hooks for logic; reach for the others when their specific strengths apply.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-data-deeply-with-context and react.dev/learn/reusing-logic-with-custom-hooks — canonical references for modern React composition.' },
    { label: 'Related topics', note: 'See "Custom Hooks" for the hook-based alternative to Render Props, "Context API" for the Provider Pattern deep-dive, "Performance Optimization" for memoizing Context values.' }
  ]
};

export default advancedPatternsContent;
