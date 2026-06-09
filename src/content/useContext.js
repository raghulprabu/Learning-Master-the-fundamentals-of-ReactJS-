const useContextContent = {
  id: 'useContext',
  title: 'useContext Hook',
  icon: '☎️',
  theme: 'indigo',
  tagline: 'Read shared, app-wide data — like the current user or theme — without threading props through every level.',
  meta: 'Hooks · Core',

  whatIsIt: {
    description: [
      'useContext lets a component read a value from the nearest matching <SomeContext.Provider> above it in the tree — no matter how many layers of components sit in between, and without passing that value down as a prop through each one.',
      'It always pairs with `createContext()` (to create the "channel") and a `<Context.Provider value={...}>` (to broadcast a value down the tree).'
    ],
    points: [
      'Step 1: const ThemeContext = createContext(defaultValue); — create the context.',
      'Step 2: <ThemeContext.Provider value={theme}>...</ThemeContext.Provider> — broadcast a value to descendants.',
      'Step 3: const theme = useContext(ThemeContext); — read it from any descendant, at any depth.'
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
      text: '"Context is like a radio broadcast. The radio station (Provider) transmits on a frequency (the Context object). Any radio (component) tuned to that frequency (useContext) can pick up the signal directly — no matter how many rooms (component layers) are between the station and the radio. Nobody has to physically relay the message room to room (prop drilling)."'
    }
  },

  whyUsed: {
    description: 'Some data is genuinely "global" to a section of your app — the logged-in user, the active theme, the selected language, feature flags. Passing it down as props through every intermediate component ("prop drilling") becomes tedious and brittle. Context provides a direct line from provider to consumer.',
    points: [
      'Eliminates prop drilling for cross-cutting/app-wide data.',
      'Keeps intermediate components clean — they don\'t need to know about or forward data they don\'t use.',
      'Lets you change a shared value in one place (the Provider) and have every consumer update automatically.',
      'A natural lighter-weight alternative to a full external state-management library for many apps.'
    ]
  },

  whenToUse: {
    description: 'Reach for Context when several components, at different depths, need the *same* piece of slowly-changing, broadly-relevant data — not for everything.',
    points: [
      'Theme (light/dark mode) used by many unrelated components across the tree.',
      'Authenticated user / session info needed by the navbar, profile page, protected routes, etc.',
      'Localization / language preference read by text throughout the app.',
      'App-wide settings or feature flags that many components must check.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'When NOT to reach for Context',
      text: '"If only one or two components (close together) need to share data, lifting state up is simpler and keeps things explicit. And Context isn\'t a general-purpose state manager — for state that changes very frequently and is read by many components (e.g. real-time form values across a big form), a dedicated state-management library or more granular contexts will perform better."'
    }
  },

  howItWorks: {
    description: 'createContext(defaultValue) returns a Context object with a Provider component. Any component below a Provider in the tree can call useContext(MyContext) to read the *current* value of the nearest enclosing Provider — React re-renders consumers automatically whenever that Provider\'s `value` changes.',
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
}`
    },
    points: [
      'If no Provider exists above a consumer, useContext returns the *default value* passed to createContext().',
      'Multiple Providers can be nested — a consumer always reads from the *nearest* one above it.',
      'Custom hook wrappers (e.g. useAuth() { return useContext(AuthContext); }) make consuming context cleaner and centralize null-checks.'
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
    intro: 'Context shines for data that is genuinely "ambient" to a whole section of an app:',
    items: [
      { icon: '🌓', title: 'Theme (dark/light mode)', description: 'A ThemeContext lets every button, card, and page read the current theme without any component passing it along manually.' },
      { icon: '🔐', title: 'Authentication / current user', description: 'An AuthContext makes the logged-in user, login(), and logout() available to the navbar, profile pages, and protected-route guards alike.' },
      { icon: '🌍', title: 'Internationalization (i18n)', description: 'A LanguageContext provides the active locale and a t(key) translation function to any text-rendering component.' },
      { icon: '🛒', title: 'Shopping cart (small-to-medium apps)', description: 'A CartContext shares cart items and add/remove actions between the product grid, the header badge, and the checkout page.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Eliminates tedious, brittle prop drilling for genuinely shared, cross-cutting data.',
      'Built into React — no extra dependency required for small-to-medium apps.',
      'Keeps intermediate components free of irrelevant props they\'d otherwise have to forward.',
      'Pairs naturally with useReducer for a lightweight, app-specific "store".'
    ],
    cons: [
      'Every consumer re-renders whenever the Provider\'s `value` changes — even if the consumer only uses part of it (mitigate by splitting contexts or memoizing).',
      'Not optimized for high-frequency updates shared across many components — a dedicated state library may scale better.',
      'Can make a component\'s dependencies less explicit (you can\'t tell what data it needs just by looking at its props).',
      'Overusing Context for everything turns it into "implicit global state", which can be as hard to trace as poorly-managed globals in any language.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Passing a brand-new object/array as the Provider value every render',
        wrong: `<AuthContext.Provider value={{ user, login, logout }}>  {/* ❌ new object every render -> ALL consumers re-render every time */}`,
        right: `const value = useMemo(() => ({ user, login, logout }), [user]);\n<AuthContext.Provider value={value}>  {/* ✅ stable reference unless "user" changes */}`,
        note: 'Object/array literals create a new reference on every render. Since React decides whether consumers should re-render by comparing the value reference, an unstable value defeats memoization and causes every consumer to re-render constantly.'
      },
      {
        title: 'Using one giant context for everything',
        wrong: `const AppContext = createContext(); // ❌ user, theme, cart, notifications, settings... all in one`,
        right: `// ✅ split into focused contexts — consumers only re-render for what they actually use\nconst AuthContext = createContext();\nconst ThemeContext = createContext();\nconst CartContext = createContext();`,
        note: 'A monolithic context means any change to *any* piece of data re-renders *every* consumer of the whole context — even ones that only cared about an unrelated slice.'
      },
      {
        title: 'Forgetting the default value / not handling "no Provider" case',
        wrong: `const ThemeContext = createContext(); // ❌ undefined if no Provider — easy to forget a null-check`,
        right: `const ThemeContext = createContext('light'); // ✅ sensible default, works even without a Provider (e.g. in tests/Storybook)`,
      }
    ]
  },

  bestPractices: [
    'Memoize the value passed to a Provider (useMemo) so it has a stable reference and doesn\'t cause needless consumer re-renders.',
    'Split unrelated data into separate, focused contexts (AuthContext, ThemeContext) rather than one giant "app context".',
    'Wrap useContext in a small custom hook (useAuth(), useTheme()) — it centralizes null-checks and gives you a nicer API.',
    'Provide sensible default values via createContext(defaultValue) so components work in isolation (tests, Storybook) even without a Provider.',
    'Reserve Context for genuinely cross-cutting, infrequently-changing data — for everything else, props and lifting state up are simpler and more explicit.'
  ],

  interviewQuestions: [
    { q: 'What problem does the Context API solve?', a: '"Prop drilling" — having to pass a piece of data down through many intermediate components that don\'t use it themselves, just so a deeply nested component can access it. Context lets a Provider broadcast a value that any descendant can read directly via useContext, no matter how deep, bypassing all the components in between.' },
    { q: 'What three pieces make up the Context pattern, and what does each do?', a: 'createContext(defaultValue) creates a Context object (the "channel") with a default value used when no Provider is present; <Context.Provider value={...}> broadcasts a value to every descendant; and useContext(Context) lets any descendant read the nearest enclosing Provider\'s current value, re-rendering automatically when it changes.' },
    { q: 'Why is it important to memoize the value passed to a Context Provider?', a: 'React decides whether to re-render consumers based on whether the Provider\'s `value` reference changed. An inline object/array literal (value={{ user, login }}) creates a brand-new reference on every render of the Provider, causing every consumer to re-render even when nothing meaningful changed. Wrapping it in useMemo(() => ({ user, login }), [user]) keeps the reference stable unless its actual dependencies change.' },
    { q: 'When would you choose Context over lifting state up — and when would you avoid Context altogether?', a: 'Choose Context when data is needed by many components at varying depths and prop drilling becomes painful (theme, auth, locale). Prefer lifting state up when only a couple of nearby components need to share something — it\'s simpler and more explicit. Avoid Context for very high-frequency updates shared by many consumers (it can cause broad re-renders); a dedicated state-management library or more granular contexts usually fits better there.' },
    { q: 'What value does useContext return if there is no matching Provider above the component in the tree?', a: 'It returns the default value that was passed to createContext(defaultValue) when the context was created. This is why providing a sensible default matters — it lets components relying on the context still work (e.g. in isolated tests or Storybook stories) even without wrapping them in a Provider.' }
  ],

  summary: {
    description: 'useContext + createContext + Provider together solve prop drilling by letting you broadcast a value down the tree and read it from any depth. Use it for genuinely cross-cutting data (theme, auth, locale), keep contexts focused and their values memoized, and wrap consumption in small custom hooks for a clean API — and remember it complements, rather than replaces, props and local state.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-data-deeply-with-context and react.dev/reference/react/useContext — the canonical guides to creating, providing, and consuming context, plus when to avoid it.' },
    { label: 'Related topic', note: 'See "Context API" under Ecosystem & Advanced for a deeper dive into Provider patterns, performance, and combining Context with useReducer.' }
  ]
};

export default useContextContent;
