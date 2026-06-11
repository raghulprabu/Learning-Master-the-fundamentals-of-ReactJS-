const contextAPIContent = {
  id: 'contextAPI',
  title: 'Context API — Deep Dive',
  icon: '🌐',
  theme: 'teal',
  tagline: 'Context lets you share data across many components without passing props at every level.',
  meta: 'Ecosystem · State · Deep Dive',

  whatIsIt: {
    description: [
      'The Context API (createContext + Provider + useContext) is React\'s built-in solution for data that many components need — like the logged-in user, theme, or language — without passing it as props through every level.',
      'Advanced patterns include: multiple providers for separate concerns, combining Context with useReducer to build a lightweight global store, and memoizing the context value to avoid unnecessary re-renders.'
    ],
    points: [
      'createContext(defaultValue) — creates the context; the default is only used when there is no matching Provider above.',
      '<Context.Provider value={...}> — broadcasts a value to all descendants below it.',
      'useContext(Context) — reads the nearest Provider\'s value and re-renders when it changes.',
      'Context.displayName — set this so React DevTools shows a readable label instead of "Context.Provider".'
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
      text: '"Context is like an office intranet. The CEO broadcasts the company mission once to the whole building — every employee can read it without asking the CEO directly each time. Multiple broadcasts can run on different channels (separate contexts), and one floor can override the company signal with their own (nested Providers)."'
    }
  },

  whyUsed: {
    description: 'Context removes "prop drilling" — the tedious and fragile practice of passing data through every intermediate component that does not actually use it.',
    points: [
      'Eliminates prop drilling: one Provider at the top, consumers anywhere below.',
      'Decouples producers from consumers — the broadcaster does not need to know who reads it.',
      'Paired with useReducer, creates a complete lightweight store with no extra libraries.',
      'Nested Providers can supply different values to specific subtrees — great for themes and tests.'
    ]
  },

  whenToUse: {
    description: 'Context is ideal for data that changes infrequently and is needed by many components across the tree.',
    points: [
      'Global data: logged-in user, theme, language — changes rarely, needed broadly.',
      'Dependency injection: passing store references or service objects without prop chains.',
      'Multiple contexts for separate concerns — AuthContext, ThemeContext, CartContext separately.',
      'Avoid for high-frequency state — every consumer re-renders when the value changes.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'Context is not a state manager',
      text: '"Context broadcasts a value and re-renders every consumer when it changes. If your context value changes on every keystroke and 50 components consume it, all 50 will re-render. For frequent, fine-grained state shared across many components, use memoization, split contexts, or an external state library."'
    }
  },

  howItWorks: {
    description: 'Context works in three steps: createContext defines the channel, Provider broadcasts the value, and useContext subscribes a component to the nearest Provider\'s value and re-renders when it changes.',
    code: {
      title: 'Multi-context composition — the real-world provider pattern',
      snippet: `// Compose multiple providers near the app root — each stays focused
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
      'A consumer re-renders ONLY when the specific context it subscribes to changes — not when other unrelated contexts change.',
      'The default value from createContext is used only when there is no matching Provider ancestor — useful for isolated component tests.',
      'Set context.displayName = "CartContext" so DevTools shows helpful names instead of "Context.Provider".'
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
      { icon: '🔐', title: 'Auth context (useAuth)', description: 'The logged-in user plus login/logout functions — consumed by navigation, profile pages, protected routes, and API helpers across the app.' },
      { icon: '🌓', title: 'Theme context (useTheme)', description: 'Light/dark mode preference and color tokens — consumed by every styled component with zero prop chains.' },
      { icon: '🌍', title: 'Internationalization (useTranslation)', description: 'The active locale and a translate function — consumed by every text-rendering component, provided by one root LanguageProvider.' },
      { icon: '🛒', title: 'Shopping cart (useCart)', description: 'Cart items and add/remove/clear — consumed by the header badge, product buttons, and checkout page simultaneously.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Built in — no dependencies, no bundle overhead beyond React itself.',
      'Eliminates prop drilling for cross-cutting data.',
      'Combined with useReducer, provides a complete testable mini-store.',
      'Naturally scoped via nesting — subtrees can override context without affecting siblings.'
    ],
    cons: [
      'All consumers re-render when the context value changes — a performance issue if not managed.',
      'Not good for high-frequency or fine-grained state — external libraries with selectors scale better.',
      'Makes component dependencies implicit — you cannot tell from props alone what data a component needs.',
      'Overuse leads to "hidden globals" that are hard to trace as apps grow.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Passing a new object literal directly as the context value',
        wrong: `<CartContext.Provider value={{ cart, dispatch }}> // ❌ new object on every render → all consumers re-render`,
        right: `const value = useMemo(() => ({ cart, dispatch }), [cart]);\n<CartContext.Provider value={value}> // ✅ stable reference unless cart changes`,
        note: 'An inline object creates a new reference on every render. React compares context values by reference — a "new" object always looks changed, so all consumers re-render unnecessarily.'
      },
      {
        title: 'One giant context for everything',
        wrong: `const AppContext = createContext(); // user, theme, cart, notifications all in one`,
        right: `// Split: AuthContext, ThemeContext, CartContext — consumers only re-render for what they use`,
        note: 'A monolithic context means every change to any slice re-renders every consumer. Splitting by concern is the biggest performance improvement for Context-heavy apps.'
      },
      {
        title: 'Missing the null check in custom Hooks',
        wrong: `export const useCart = () => useContext(CartContext); // returns null outside Provider — confusing errors later`,
        right: `export function useCart() {\n  const ctx = useContext(CartContext);\n  if (!ctx) throw new Error('useCart must be inside <CartProvider>');\n  return ctx;\n}`,
        note: 'An early, clear error message points immediately to the missing Provider instead of failing mysteriously deep inside a consuming component.'
      }
    ]
  },

  bestPractices: [
    'Wrap each context in a dedicated Provider component and a custom useX() Hook — consumers never touch createContext/useContext directly.',
    'Memoize the context value object (useMemo) to prevent accidental mass re-renders from new object references.',
    'Split by concern — one context per domain (auth, theme, cart) — never one mega context.',
    'Provide a sensible defaultValue so components work in isolation (Storybook, unit tests) without a Provider.',
    'For large trees, split into separate data and dispatch contexts — dispatch is stable, data changes more often.'
  ],

  interviewQuestions: [
    { q: 'What is the difference between passing a value directly vs. memoizing it?', a: 'An inline object ({user, dispatch}) creates a new reference on every render of the Provider. React uses reference equality to detect context changes — a new object every render looks like a change every time, causing all consumers to re-render unnecessarily. useMemo(() => ({user, dispatch}), [user]) keeps the reference stable across renders where user has not changed.' },
    { q: 'How would you combine useReducer with Context to build a global store?', a: 'Create a Provider component that calls useReducer to get [state, dispatch], memoizes {state, dispatch} as the context value, and wraps children in a Provider. Expose custom Hooks (useAuth(), useCart()) that call useContext and throw if null. This gives typed, testable state transitions, a stable dispatch reference, and any component can read state or dispatch actions with no prop drilling.' },
    { q: 'When is Context a poor fit for shared state?', a: 'When state changes very frequently AND is consumed by many components — every change re-renders every consumer. External libraries like Redux or Zustand with selector support deliver updates only to components that care about the changed slice. Context is ideal for slowly-changing ambient data (auth, theme, locale) — not for high-frequency, fine-grained shared state.' },
    { q: 'What does createContext\'s defaultValue actually do?', a: 'It is the value returned by useContext when no matching Provider exists above the component. It is NOT the initial value that Providers start with — each Provider manages its own value independently. The default is useful for components rendered in isolation (unit tests, Storybook) without a Provider wrapper.' },
    { q: 'What is the "split context into data and dispatch" pattern?', a: 'dispatch from useReducer has a stable identity across renders, while state changes on every update. If they are in the same context, every state change re-renders ALL consumers — including ones that only dispatch and never read state. Splitting into a StateContext (for readers) and a DispatchContext (for dispatch-only components) means dispatch-only consumers never re-render on state changes.' }
  ],

  summary: {
    description: 'The Context API is React\'s built-in solution for sharing ambient, cross-cutting data (auth, theme, locale) without prop drilling. Use focused Providers, memoize the value, split contexts by concern, and expose everything through custom Hooks. Manage re-renders by keeping context changes infrequent and the value reference stable.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-data-deeply-with-context and react.dev/reference/react/createContext — canonical references for the full Context API.' },
    { label: 'Related topic', note: 'See "useContext" for the basics, "useReducer" for the store-building pattern, and "State Management" for when to use an external library.' }
  ]
};

export default contextAPIContent;
