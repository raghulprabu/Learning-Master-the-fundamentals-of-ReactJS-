const advancedPatternsContent = {
  id: 'advancedPatterns',
  title: 'Advanced React Patterns',
  icon: '🎨',
  theme: 'purple',
  tagline: 'Higher-Order Components, Render Props, Compound Components, and the patterns that power great React libraries.',
  meta: 'Patterns · Architecture',

  whatIsIt: {
    description: [
      'Advanced React patterns are reusable, battle-tested solutions to common component composition and logic-sharing problems. They describe HOW to structure components and hooks so that behavior, state, and rendering concerns can be shared, configured, and extended without tight coupling.',
      'The most important patterns: Higher-Order Components (HOC), Render Props, Compound Components, the Provider Pattern, and Controlled/Uncontrolled components. Each solves a specific problem; knowing which to reach for (and when custom hooks are better) is the skill.'
    ],
    points: [
      'Higher-Order Components (HOC): a function that takes a component and returns an enhanced component — used for cross-cutting concerns like auth checks, logging, data fetching.',
      'Render Props: a component that delegates "what to render" via a prop that is a function — flexible, but largely superseded by custom hooks.',
      'Compound Components: multiple components working together with shared implicit state (e.g. <Select> + <Select.Option>) — the pattern that powers most component libraries.',
      'Controlled Components: the parent fully controls state via props + onChange — enables maximum flexibility for consumers.',
      'Provider Pattern: wraps children with a Context.Provider to supply shared state/logic — the foundation of React libraries like React Router, React Query, Zustand, and auth libraries.'
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
      text: '"Advanced React patterns are like LEGO system design: HOCs are like factory machines (you put a plain brick in, a pre-assembled structure comes out); Render Props are like a mould that lets you choose what material to fill it with; Compound Components are like a LEGO set where individual pieces (head, body, legs) are designed to work together and share a hidden connector system; the Provider Pattern is like a shared parts bin that all builders at the same table can reach into without asking each other for pieces."'
    }
  },

  whyUsed: {
    description: 'These patterns exist because simple prop-drilling and copy-pasting logic don\'t scale. Each pattern solves a specific composition or sharing challenge that arises as apps grow more complex.',
    points: [
      'HOCs allow cross-cutting concerns (auth, analytics, feature flags, error boundaries) to be applied to components without modifying them.',
      'Render Props (and custom hooks) allow stateful logic to be shared without imposing a rendering structure.',
      'Compound Components model naturally "grouped" UI elements where children need to share implicit state (like <select> + <option> in HTML).',
      'Controlled components give consumers full control over state — critical for form libraries, design systems, and any reusable input component.'
    ]
  },

  whenToUse: {
    description: 'Modern React leans heavily on custom hooks — but these patterns remain essential in specific contexts, especially when building component libraries.',
    points: [
      'HOC: apply behavior to 3+ components without modifying each (auth wrapper, feature flag gate, analytics tracking); but prefer hooks when logic doesn\'t need to add rendering.',
      'Render Props: legacy codebases or when a render function must be passed directly as a prop. New code: almost always use a custom hook instead.',
      'Compound Components: component library elements that have strongly-related subcomponents (Tabs+Tab, Menu+MenuItem, Accordion+Panel).',
      'Controlled pattern: any input component intended for reuse — always expose value+onChange to give consumers control over state.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When to prefer custom hooks over these patterns',
      text: '"Custom hooks replaced Render Props for almost all logic-sharing use cases in React 16.8+. Before hooks, sharing \'is the user online?\' state meant writing a <NetworkStatus render={isOnline => ...}> render-prop component. Now you write useNetworkStatus() — same logic, simpler API, composable with other hooks, no extra component in the tree. Choose render props when the caller genuinely needs to control the rendering; choose a hook when you\'re just sharing logic."'
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
      'The "dot notation" API (Accordion.Item, Tabs.Tab) is implemented by attaching the subcomponent as a property on the parent function: Accordion.Item = function(...) {...}. This groups related components under one namespace without a named export for each.',
      'Uncontrolled variant of Compound Components: let consumers optionally pass open/onOpenChange to "lift" control out if needed — the "controlled/uncontrolled escape hatch" pattern used by Radix UI, Headless UI, and React Aria.',
      'Context is scoped to the subtree — two <Accordion> instances on the same page each have their own independent Context value, even though they use the same Context object.'
    ]
  },

  flowDiagram: {
    title: 'Choosing the right pattern',
    steps: [
      { icon: '🤔', label: 'Need to share LOGIC across components?', note: 'Custom hook — cleanest for most cases' },
      { icon: '🎁', label: 'Need to wrap component with BEHAVIOR (auth, loading)?', note: 'HOC — or React Router\'s protected route pattern' },
      { icon: '🧩', label: 'Components naturally work TOGETHER (Tabs, Select)?', note: 'Compound Components via Context' },
      { icon: '🎛️', label: 'Component should be CONTROLLED by parent?', note: 'Controlled Component pattern: value + onChange' },
      { icon: '🌳', label: 'Multiple components need SHARED state/services?', note: 'Provider Pattern (Context + custom hook)' }
    ]
  },

  realWorldExamples: {
    intro: 'These patterns power the React ecosystem\'s most-used libraries:',
    items: [
      {
        icon: '🧩',
        title: 'Radix UI Primitives — Compound Components in production',
        description: '<Dialog.Root>, <Dialog.Trigger>, <Dialog.Content>, <Dialog.Close> — each component is simple and focused, sharing implicit state through the Dialog\'s Context. Consumers compose the exact UI they want; the library handles accessibility, focus trapping, and aria attributes.'
      },
      {
        icon: '🛡️',
        title: 'React Router\'s nested route HOC pattern',
        description: '<Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>}> — ProtectedRoute is effectively an HOC in component form: it wraps the child and adds auth-check behavior without Dashboard knowing about authentication at all.',
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
        description: 'Uses uncontrolled inputs (ref-based) internally for performance, but exposes a controlled-looking API via the Controller component and register function — combining the performance of uncontrolled inputs with the ergonomics of controlled ones. This "control inversion" pattern is what makes it so fast.'
      },
      {
        icon: '🎣',
        title: 'TanStack Query\'s Provider + custom hooks',
        description: '<QueryClientProvider client={queryClient}> wraps the app (Provider Pattern), making the cache available everywhere. useQuery(), useMutation() are custom hooks that read from that provider. The pattern: one Provider at the root, custom hooks for consumption — the same architecture as any well-designed React library.'
      }
    ]
  },

  prosAndCons: {
    pros: [
      'HOCs: apply cross-cutting concerns (auth, analytics, theming) across many components without modifying each one.',
      'Compound Components: the most ergonomic API for grouping related components — as natural to use as HTML\'s <select>/<option>.',
      'Controlled Components: give consumers of your component complete control over state — enables every conceivable integration.',
      'Provider Pattern: scales to arbitrarily complex shared state without prop drilling; the foundation of every major React library.'
    ],
    cons: [
      'HOCs: "wrapper hell" — multiple HOCs stacked on a component create deeply nested trees that are hard to debug in DevTools. Custom hooks are usually cleaner.',
      'Render Props: verbose syntax with nested function calls; replaced by custom hooks for most use cases in modern React.',
      'Compound Components: more complex to implement than a single-component API; requires careful Context design and accessible keyboard/aria attribute management.',
      'Controlled Components: require the parent to manage state — more verbose for simple use cases where "just works" would be preferred.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using HOC instead of a custom hook when there\'s no rendering involved',
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
        note: 'If the HOC isn\'t adding any rendering (no conditional return, no wrapper DOM, no additional JSX) — it\'s just sharing logic. Custom hooks do that with zero component overhead and compose better with other hooks.'
      },
      {
        title: 'Breaking Compound Component implicit contract by rendering children outside the parent',
        wrong: `// ❌ Using Tabs.Tab without a Tabs parent — Context is null → runtime crash
<div><Tabs.Tab id="profile">Profile</Tabs.Tab></div>`,
        right: `// ✅ Add a guard in the subcomponent
function Tab({ id, children }) {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('<Tabs.Tab> must be used inside <Tabs>');
  // ...
}`,
        note: 'Always add a null-check guard when consuming a compound component\'s Context. Throw a descriptive error rather than silently rendering incorrectly — this dramatically speeds up debugging for consumers of the library.'
      },
      {
        title: 'Making a component always uncontrolled when it should support both',
        wrong: `// ❌ Component uses internal state — consumers can't control it
function Toggle({ label }) {
  const [on, setOn] = useState(false); // always uncontrolled
  return <button onClick={() => setOn(v => !v)}>{label}: {on ? 'on' : 'off'}</button>;
}`,
        right: `// ✅ Support both — uncontrolled by default, controlled when value prop provided
function Toggle({ label, value, onChange, defaultValue = false }) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const on = isControlled ? value : internal;
  const handleClick = () => {
    if (!isControlled) setInternal(v => !v);
    onChange?.(!on);
  };
  return <button onClick={handleClick}>{label}: {on ? 'on' : 'off'}</button>;
}`,
        note: 'Any reusable component that holds display state should support the controlled/uncontrolled pattern: if the value prop is provided, the component is controlled; otherwise it manages its own state internally. This is the contract that input, select, textarea, and every well-designed React library component follows.'
      }
    ]
  },

  bestPractices: [
    'Prefer custom hooks over Render Props for logic-sharing — hooks compose better, have cleaner syntax, and show up as named hooks in DevTools.',
    'Prefer HOCs for behavior that adds rendering (conditional render, loading wrapper) — but name them clearly (withAuth, withErrorBoundary) and keep each HOC single-purpose.',
    'In Compound Components, always guard Context consumption with a throw if the component is used outside its parent — it produces clear, immediate error messages.',
    'Support both controlled and uncontrolled modes for any reusable input/display component — defaultValue + value + onChange is the established React contract.',
    'Memoize Context values in Provider implementations (useMemo + useCallback) — prevents every consumer from re-rendering when an unrelated part of the provider\'s parent re-renders.',
    'Document the compound component contract — which subcomponents exist, which are optional, and what props they accept. The "dot notation" API is only ergonomic when it\'s discoverable.'
  ],

  interviewQuestions: [
    {
      q: 'What is a Higher-Order Component (HOC) and what problems does it solve?',
      a: 'A HOC is a function that takes a component and returns a new, enhanced component. It\'s the React implementation of the Decorator design pattern. HOCs solve cross-cutting concerns: applying the same behavior (auth checking, analytics event tracking, feature flag gating, loading/error wrapping) to many different components without modifying each one. The wrapped component knows nothing about the added behavior. Modern React code often uses React Router\'s route-level wrappers and react-error-boundary\'s withErrorBoundary as HOCs, while extracting most logic into custom hooks instead.'
    },
    {
      q: 'What is the Compound Component pattern and when would you use it?',
      a: 'The Compound Component pattern is when multiple components are designed to work together, sharing implicit state through React Context. The classic example is a Tabs component: <Tabs> provides active tab state through a Context, and <Tabs.Tab> consumes that Context to know which tab is active and trigger changes. This pattern is most appropriate when: multiple subcomponents have a strong conceptual grouping (they\'re always used together), the subcomponents need to share state without prop drilling between siblings, and you want a composable API that lets consumers control the structure (as opposed to a monolithic component with many config props).'
    },
    {
      q: 'What is the difference between controlled and uncontrolled components?',
      a: 'A controlled component receives its current value via a prop (value) and signals changes via a callback (onChange) — the parent owns the state and passes it down. An uncontrolled component manages its own internal state — the parent can provide an initial value (defaultValue) and optionally a callback (onChange), but the component itself is the source of truth. Controlled gives the parent total visibility and control (enabling things like real-time validation or cross-field dependencies). Uncontrolled is simpler for cases where the parent only needs the value on submission. Well-designed reusable components support BOTH modes.'
    },
    {
      q: 'When would you use Render Props vs. Custom Hooks vs. HOCs?',
      a: 'Custom Hooks are the default for sharing stateful logic between components — they compose cleanly, are named in DevTools, and work with other hooks. Use them for: API fetching, media queries, subscriptions, debouncing, and virtually any logic-sharing need. Render Props remain useful when a component genuinely needs to delegate "how to render a piece of UI" as a prop — though this is rare in modern code. HOCs are most appropriate when you want to apply a behavior to a component AT THE COMPONENT LEVEL (conditional rendering, wrapping with a boundary) rather than inside its function body — particularly when adding behavior to a component you can\'t or don\'t want to modify. In most modern React, you encounter HOCs in library code but write custom hooks in application code.'
    },
    {
      q: 'How does the Provider Pattern differ from simply prop drilling? What are its trade-offs?',
      a: 'The Provider Pattern uses React Context to make a value available to any descendant component without passing it through every intermediate component (prop drilling). A <Context.Provider value={...}> at the top makes the value accessible to any descendant that calls useContext(Context), regardless of depth. Trade-offs: it eliminates prop-drilling pain but introduces coupling (any component in the tree can read that Context, which can make data flow harder to trace); and Context updates re-render ALL consuming components (mitigated by memoizing the context value and splitting contexts by update frequency). It\'s appropriate for "global" data (auth, theme, locale) and the internal state of compound component systems.'
    }
  ],

  summary: {
    description: 'Advanced React patterns — HOCs, Render Props, Compound Components, Controlled Components, and the Provider Pattern — are solutions to specific component composition problems that arise at scale. In modern React, custom hooks replace Render Props for logic-sharing, HOCs are most valuable for behavior-adding wrapping (auth, error boundaries), Compound Components power component libraries with natural composable APIs, and the Provider Pattern (Context + hooks) is the foundation of virtually every major React library. Know all of them; default to custom hooks for logic; reach for the others when their specific strengths apply.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-data-deeply-with-context and react.dev/learn/reusing-logic-with-custom-hooks — the two canonical references for modern React composition.' },
    { label: 'Related topics', note: 'See "Custom Hooks" for the hook-based alternative to Render Props, "Context API" for the Provider Pattern deep-dive, "Performance Optimization" for memoizing Context values, and "Component Composition" in Foundations for the basics of the children prop and composition.' }
  ]
};

export default advancedPatternsContent;
