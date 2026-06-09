const contextAPIContent = {
  id: 'contextAPI',
  title: 'Context API — Deep Dive',
  icon: '🌐',
  theme: 'teal',
  tagline: 'The full Context API: advanced patterns, performance, composing providers, and combining with useReducer.',
  meta: 'Ecosystem · State · Deep Dive',

  whatIsIt: {
    description: [
      'The Context API (createContext + Provider + useContext) is React\'s built-in solution for "ambient data" — values needed by many components at different tree depths without manual prop-passing at every level.',
      'While useContext covers day-to-day consumption, the full API includes advanced patterns: multiple providers, context composition, performance optimization via memoization, and the classic "lightweight Redux" pattern of combining Context with useReducer.'
    ],
    points: [
      'createContext(defaultValue) — creates the context object; the default is used only when there is NO matching Provider above a consumer.',
      '<Context.Provider value={...}> — broadcasts a value to all descendants; nesting providers creates scoped overrides.',
      'useContext(Context) — reads the nearest ancestor Provider\'s value, subscribing the component to updates.',
      'Context.displayName — set this on your context object for cleaner React DevTools labeling.'
    ],
    code: { title: 'Production-ready Context + useReducer store', snippet: `const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'add':    return [...state, action.item];
    case 'remove': return state.filter(i => i.id !== action.id);
    case 'clear':  return [];
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const value = useMemo(() => ({ cart, dispatch }), [cart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}` },
    analogy: {
      icon: '🌐',
      title: 'Real-World Analogy',
      text: '"Context is the office intranet — not every employee asks the CEO directly for the company\'s mission statement each morning. It\'s broadcast once to the whole building, and anyone who needs it can tune in. Multiple \'broadcasts\' can coexist on different \'channels\' (separate contexts), and a specific floor can override the company-wide signal with their own (nested Providers)."'
    }
  },

  whyUsed: {
    description: 'The Context API removes "prop drilling" — the tedious and brittle practice of passing data through every intermediate component. It\'s the right choice for genuinely cross-cutting, ambient data (auth, theme, locale, feature flags) that many components need without being directly related to each other.',
    points: [
      'Eliminates prop drilling: a Provider at the top, consumers anywhere below — no middlemen.',
      'Decouples producers from consumers: the component broadcasting the value doesn\'t need to know who reads it.',
      'Paired with useReducer, becomes a no-dependency global-store substitute for moderate apps.',
      'Enables scoped overrides: a nested Provider can supply a different value to a subtree, ideal for themes, i18n variants, or test fixtures.'
    ]
  },

  whenToUse: {
    description: 'Context is ideal for cross-cutting "ambient" data that changes infrequently and is needed broadly. It\'s NOT a silver bullet for all shared state.',
    points: [
      'Shared global data: auth user, theme, locale, feature flags — changes infrequently, needed broadly.',
      'Dependency injection: passing store references, router instances, or service objects deep without prop chains.',
      'Multiple contexts for separate concerns — split CartContext, AuthContext, ThemeContext rather than one mega context.',
      'Avoid for high-frequency state (e.g. every-keystroke form values) shared across many components — every consumer re-renders on change.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'Context is not a state manager',
      text: '"Context broadcasts a value and triggers re-renders in every consumer when it changes. It doesn\'t batch or optimize — if your context value changes on every keystroke and 50 components consume it, all 50 will re-render. For frequent state shared widely, pair with memoization, split contexts, or reach for an external state library."'
    }
  },

  howItWorks: {
    description: 'Context works in three layers: creation (createContext defines the channel and default), provision (Provider broadcasts a value down the tree), and consumption (useContext subscribes a component to the nearest Provider\'s current value and re-renders it when that value changes).',
    code: {
      title: 'Multi-context composition — the real-world provider pattern',
      snippet: `// Compose multiple providers near the app root — each context stays focused
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Each provider stays small and focused on one concern
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Consumers stay clean via custom hooks
function CheckoutButton() {
  const { user } = useAuth();
  const { cart } = useCart();
  if (!user) return <LoginPrompt />;
  return <button disabled={cart.length === 0}>Checkout ({cart.length})</button>;
}`
    },
    points: [
      'A consumer re-renders ONLY when the value of the specific context it subscribes to changes — not when other, unrelated contexts change.',
      'The default value (from createContext) is used as a fallback ONLY when there\'s no matching Provider ancestor — useful for components used in isolation (tests, Storybook).',
      'context.displayName = "CartContext" makes the Provider/Consumer names appear helpfully in React DevTools instead of "Context.Provider".'
    ]
  },

  flowDiagram: {
    title: 'Context data flow — creation → provision → consumption',
    steps: [
      { icon: '🏭', label: 'createContext(default)', note: 'Creates the "broadcast channel"' },
      { icon: '📡', label: '<Provider value={...}>', note: 'Broadcasts value to descendant tree' },
      { icon: '🔄', label: 'Value changes', note: 'Provider re-renders with new value' },
      { icon: '🔔', label: 'All consumers notified', note: 'React queues re-renders for each' },
      { icon: '🖥️', label: 'Consumers re-render', note: 'Show the new ambient value' }
    ]
  },

  realWorldExamples: {
    intro: 'Context powers the "ambient infrastructure" of nearly every medium-to-large React app:',
    items: [
      { icon: '🔐', title: 'Auth context (useAuth)', description: 'The logged-in user, login/logout/refresh functions — consumed by navigation, profile pages, protected routes, and API-call helpers throughout the app.' },
      { icon: '🌓', title: 'Theme context (useTheme)', description: 'Light/dark mode preference, shared color tokens — consumed by every styled component, button, and layout container with zero prop chains.' },
      { icon: '🌍', title: 'Internationalization (useIntl / useTranslation)', description: 'The active locale and a t(key) translation function — consumed by every piece of text-rendering UI, provided by a single root-level LanguageProvider.' },
      { icon: '🛒', title: 'Shopping cart context (useCart)', description: 'Cart items, add/remove/clear — consumed by the header quantity badge, product grid add-buttons, and the checkout page simultaneously.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Built in — no dependencies, no bundle overhead beyond React itself.',
      'Eliminates prop drilling for cross-cutting data, keeping intermediate components clean.',
      'Combined with useReducer, provides a complete, testable "mini-store" for moderate apps.',
      'Naturally scoped via nesting — subtrees can override context without affecting siblings.'
    ],
    cons: [
      'All consumers re-render when the context value changes — a performance cliff if not managed (memoization, value stability).',
      'Not optimized for high-frequency or highly granular state — external libraries with selectors scale better there.',
      'Can make component dependencies implicit (you can\'t tell from a component\'s props alone what data it needs).',
      'Overuse leads to "hidden globals" — context that seems convenient initially but becomes hard to trace as apps grow.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Passing a new object literal directly as the context value',
        wrong: `<CartContext.Provider value={{ cart, dispatch }}> // ❌ new object on every render → every consumer re-renders`,
        right: `const value = useMemo(() => ({ cart, dispatch }), [cart]);\n<CartContext.Provider value={value}> // ✅ stable reference unless cart changes`,
        note: 'An inline object literal creates a new reference on every render. React compares context values by reference — a "new" object always looks like "changed", causing all consumers to re-render even when nothing meaningful changed.'
      },
      {
        title: 'One giant "AppContext" for everything',
        wrong: `const AppContext = createContext(); // user, theme, cart, notifications, settings all in one`,
        right: `// Split: AuthContext, ThemeContext, CartContext — consumers only re-render for what they use`,
        note: 'A monolithic context means every change to ANY slice re-renders EVERY consumer. Splitting by concern is the single most impactful performance improvement for Context-heavy apps.'
      },
      {
        title: 'Missing the null check in custom hooks',
        wrong: `export const useCart = () => useContext(CartContext); // returns null outside Provider — confusing errors later`,
        right: `export function useCart() {\n  const ctx = useContext(CartContext);\n  if (!ctx) throw new Error('useCart must be inside <CartProvider>');\n  return ctx;\n}`,
        note: 'An early, explicit throw with a clear message points immediately to the missing Provider, rather than cryptically failing deep in the consuming component later.'
      }
    ]
  },

  bestPractices: [
    'Wrap each context in a dedicated Provider component and a custom useX() hook — consumers never deal with createContext/useContext directly.',
    'Memoize the context value object (useMemo) to prevent accidental mass re-renders from unstable value references.',
    'Split by concern — one context per domain (auth, theme, cart) — never one mega context.',
    'Provide a sensible defaultValue to createContext so components work in isolation (Storybook, unit tests) without a Provider.',
    'For read-heavy contexts with fine-grained access, consider splitting into separate "data" and "dispatch" contexts — dispatch is stable, data may change more often.'
  ],

  interviewQuestions: [
    { q: 'What is the difference between passing a value directly as the context value vs. memoizing it?', a: 'An inline object literal ({user, dispatch}) creates a new reference on every render of the Provider component. React uses Object.is (reference equality) to determine whether a context value changed and consumers need to re-render — so a brand-new object every render looks like a change every time, causing all consumers to re-render unnecessarily. Wrapping it in useMemo(() => ({user, dispatch}), [user]) keeps the reference stable across renders where `user` hasn\'t actually changed.' },
    { q: 'How would you combine useReducer with Context to build a global store?', a: 'Create a Provider component that calls useReducer to get [state, dispatch], memoizes { state, dispatch } as the context value, and wraps children in a Provider. Expose custom hooks (useAuth(), useCart()) that call useContext and throw if the context is null. This gives you typed, testable state transitions (the reducer), a stable dispatch reference, and any component in the tree can read state or dispatch actions with zero prop drilling.' },
    { q: 'When is Context a poor fit for shared state, and what should you use instead?', a: 'When state changes very frequently (e.g. real-time position of a drag handle, every keystroke in a form field) AND is consumed by many components — every change triggers re-renders in every consumer. External state-management libraries (Redux, Zustand, Jotai) with selector support can deliver updates only to components that actually care about the changed slice. Context is ideal for slowly-changing, broadly-relevant ambient data (auth, theme, locale) — not for fine-grained, high-frequency shared state.' },
    { q: 'What does createContext\'s defaultValue actually do, and when is it used?', a: 'It\'s the value returned by useContext when NO matching Provider exists above the component in the tree. It\'s NOT the initial value that Providers start with — each Provider manages its own value independently. The default is useful for components rendered in isolation (unit tests, Storybook stories) without a Provider wrapper, providing a predictable fallback rather than null/undefined.' },
    { q: 'What is the "split context into data and dispatch" pattern, and why does it help performance?', a: 'Because dispatch (from useReducer) has a stable identity across renders, while state changes on every update. If you put them in the same context, every state change re-renders ALL consumers — including ones that only dispatch and never read state. By splitting into a StateContext (for state readers) and a DispatchContext (for dispatch-only components), components that only dispatch actions never re-render when state changes, reducing unnecessary work significantly in large trees.' }
  ],

  summary: {
    description: 'The Context API is the clean, dependency-free solution for broadcasting ambient, cross-cutting data (auth, theme, locale) through a React tree. Its power comes from focused, well-memoized providers composed together, paired with thin custom hooks for clean consumption — and its limitations (all-or-nothing re-renders) are managed through split contexts and stable value references rather than fighting the API.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-data-deeply-with-context and react.dev/reference/react/createContext — the canonical references for the full Context API surface.' },
    { label: 'Related topic', note: 'See "useContext" for the consumption-side basics, "useReducer" for the store-building pattern, and "State Management" for when to graduate to an external library.' }
  ]
};

export default contextAPIContent;
