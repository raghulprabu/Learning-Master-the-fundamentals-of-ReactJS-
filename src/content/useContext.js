const useContextContent = {
  id: 'useContext',
  title: 'useContext Hook',
  icon: '☎️',
  theme: 'indigo',
  tagline: 'useContext lets you share data across components without passing props through every level.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useContext lets a component read a shared value from the nearest Provider above it in the tree — no matter how many layers of components are in between.',
      'It always works with createContext() (to create the channel) and a <Context.Provider> (to share the value down the tree).'
    ],
    points: [
      'Step 1: const ThemeContext = createContext(defaultValue); — create the context.',
      'Step 2: <ThemeContext.Provider value={theme}>...</ThemeContext.Provider> — share a value.',
      'Step 3: const theme = useContext(ThemeContext); — read it from any child, at any depth.'
    ],
    code: { title: 'The three pieces', snippet: `const ThemeContext = createContext('light');     // 1) create

function App() {
  return (
    <ThemeContext.Provider value="dark">      {/* 2) provide */}
      <Page />
    </ThemeContext.Provider>
  );
}

function DeeplyNestedButton() {
  const theme = useContext(ThemeContext);        // 3) consume — any depth!
  return <button className={theme}>Click</button>;
}` },
    analogy: {
      icon: '📻',
      title: 'Real-World Analogy',
      text: '"Context is like a radio broadcast. The station (Provider) transmits on a frequency (the Context object). Any radio (component) tuned to that frequency (useContext) can pick up the signal directly — no matter how many rooms (layers) are between them."'
    }
  },

  whyUsed: {
    description: 'Some data is needed by many components at different depths — like the current user or active theme. Passing it down as props through every layer ("prop drilling") is tedious. Context provides a direct line from provider to consumer.',
    points: [
      'Removes prop drilling for cross-cutting app-wide data.',
      'Keeps intermediate components clean — they do not need to forward data they do not use.',
      'Change the value in one place (the Provider) and every consumer updates automatically.',
      'A lighter alternative to a full state management library for many apps.'
    ]
  },

  whenToUse: {
    description: 'Use Context when several components at different depths need the same slowly-changing, broadly-relevant data.',
    points: [
      'Theme (light/dark mode) used by many unrelated components.',
      'Authenticated user and session info needed by the navbar, profile page, and protected routes.',
      'Language or locale preference read by text throughout the app.',
      'App-wide settings or feature flags that many components must check.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to reach for Context',
      text: '"If only one or two nearby components need to share data, lifting state up is simpler. Context is not a general-purpose state manager — for state that changes very often and is read by many components, a dedicated library or more granular contexts will perform better."'
    }
  },

  howItWorks: {
    description: 'createContext returns a Context object with a Provider. Any component below that Provider can call useContext to read the current value. React re-renders consumers automatically when the Provider value changes.',
    code: {
      title: 'A real authentication context',
      snippet: `const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (credentials) => api.login(credentials).then(setUser);
  const logout = () => { api.logout(); setUser(null); };

  // Memoize the object so consumers don't re-render on every AuthProvider render
  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Anywhere below <AuthProvider>, at any depth:
function ProfileButton() {
  const { user, logout } = useContext(AuthContext);
  return user ? <button onClick={logout}>Log out {user.name}</button> : <LoginLink />;
}` },
    points: [
      'If no Provider exists above, useContext returns the default value from createContext().',
      'Multiple Providers can be nested — a consumer always reads the nearest one above it.',
      'Wrap useContext in a custom hook (useAuth, useTheme) for a cleaner API.'
    ]
  },

  flowDiagram: {
    title: 'Context: from Provider to any-depth Consumer',
    steps: [
      { icon: '🏭', label: 'createContext()', note: 'Defines the "channel"' },
      { icon: '📡', label: '<Provider value={...}>', note: 'Broadcasts down the tree' },
      { icon: '🌳', label: 'Any depth of nesting', note: 'No prop drilling needed' },
      { icon: '📻', label: 'useContext(Ctx)', note: 'Reads the current value' },
      { icon: '🔁', label: 'Auto re-render on change', note: 'When Provider value updates' }
    ]
  },

  realWorldExamples: {
    intro: 'Context works best for data that is "ambient" to a whole section of the app:',
    items: [
      { icon: '🌓', title: 'Theme (dark/light mode)', description: 'A ThemeContext lets every button, card, and page read the current theme without any component passing it along manually.' },
      { icon: '🔐', title: 'Authentication / current user', description: 'An AuthContext makes the logged-in user, login(), and logout() available to the navbar, profile pages, and protected routes.' },
      { icon: '🌍', title: 'Internationalization (i18n)', description: 'A LanguageContext provides the active locale and a t(key) translation function to any text-rendering component.' },
      { icon: '🛒', title: 'Shopping cart (small apps)', description: 'A CartContext shares cart items and add/remove actions between the product grid, header badge, and checkout page.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Removes prop drilling for genuinely shared, cross-cutting data.',
      'Built into React — no extra libraries needed for most apps.',
      'Keeps intermediate components free of props they do not use.',
      'Pairs naturally with useReducer for a lightweight global store.'
    ],
    cons: [
      'Every consumer re-renders whenever the Provider value changes — even if it only uses part of it.',
      'Not optimized for high-frequency updates shared across many components.',
      'Makes a component\'s dependencies less visible from its props.',
      'Overusing Context for everything can be hard to trace and debug.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Passing a new object as the Provider value every render',
        wrong: `<AuthContext.Provider value={{ user, login, logout }}>  {/* ❌ new object every render -> ALL consumers re-render */}`,
        right: `const value = useMemo(() => ({ user, login, logout }), [user]);\n<AuthContext.Provider value={value}>  {/* ✅ stable reference unless "user" changes */}`,
        note: 'Object literals create a new reference on every render. React compares the value reference to decide whether consumers should re-render.'
      },
      {
        title: 'Using one giant context for everything',
        wrong: `const AppContext = createContext(); // ❌ user, theme, cart, notifications, settings... all in one`,
        right: `// ✅ split into focused contexts — consumers only re-render for what they use\nconst AuthContext = createContext();\nconst ThemeContext = createContext();\nconst CartContext = createContext();`,
        note: 'One monolithic context means any change to any piece of data re-renders every consumer, even ones that only care about a different slice.'
      },
      {
        title: 'Forgetting the default value',
        wrong: `const ThemeContext = createContext(); // ❌ undefined if no Provider`,
        right: `const ThemeContext = createContext('light'); // ✅ sensible default, works without a Provider`,
      }
    ]
  },

  bestPractices: [
    'Memoize the Provider value with useMemo to avoid unnecessary consumer re-renders.',
    'Split unrelated data into separate, focused contexts (AuthContext, ThemeContext).',
    'Wrap useContext in a small custom hook (useAuth(), useTheme()) for a cleaner API.',
    'Provide sensible default values via createContext(defaultValue) for tests and Storybook.',
    'Use Context for slowly-changing cross-cutting data — for everything else, props are simpler.'
  ],

  interviewQuestions: [
    { q: 'What problem does the Context API solve?', a: '"Prop drilling" — having to pass data through many intermediate components that do not use it themselves. Context lets a Provider broadcast a value that any descendant can read directly via useContext, no matter how deep.' },
    { q: 'What three pieces make up the Context pattern?', a: 'createContext(defaultValue) creates the Context object with a default value; <Context.Provider value={...}> broadcasts a value to all descendants; and useContext(Context) lets any descendant read the nearest Provider\'s current value.' },
    { q: 'Why is it important to memoize the value passed to a Context Provider?', a: 'React re-renders consumers when the Provider value reference changes. An inline object literal creates a new reference on every render, causing every consumer to re-render even when nothing changed. useMemo keeps the reference stable unless the real data changes.' },
    { q: 'When would you choose Context over lifting state up?', a: 'Choose Context when data is needed by many components at varying depths and prop drilling becomes painful. Prefer lifting state up when only a couple of nearby components need to share something — it is simpler and more explicit.' },
    { q: 'What does useContext return if there is no matching Provider above the component?', a: 'It returns the default value that was passed to createContext(defaultValue). This is why a sensible default matters — it lets components work in isolation (tests, Storybook) even without a Provider.' }
  ],

  summary: {
    description: 'useContext, createContext, and Provider together solve prop drilling by letting you share a value down the tree and read it from any depth. Use it for cross-cutting data like theme and auth. Keep contexts focused and their values memoized.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-data-deeply-with-context and react.dev/reference/react/useContext — guides to creating, providing, and consuming context.' },
    { label: 'Related topic', note: 'See "Context API" under Ecosystem & Advanced for a deeper dive into Provider patterns and performance.' }
  ]
};

export default useContextContent;
