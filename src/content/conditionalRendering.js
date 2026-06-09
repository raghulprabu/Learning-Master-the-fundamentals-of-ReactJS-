const conditionalRendering = {
  id: 'conditionalRendering',
  title: 'Conditional Rendering',
  icon: '🔀',
  theme: 'teal',
  tagline: 'Showing different UI depending on the current state — the "if/else" of JSX.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Conditional rendering is the technique of deciding *what* to render based on a condition — show a spinner while loading, an error message if something failed, or the actual content once it\'s ready. There\'s no special "if" syntax in JSX; you simply use regular JavaScript expressions.',
      'Because JSX curly braces { } only accept *expressions*, you reach for ternaries (cond ? a : b), logical AND (cond && jsx), early returns, or variables holding JSX.'
    ],
    points: [
      'Ternary operator: {isLoggedIn ? <Dashboard /> : <LoginForm />}',
      'Logical AND: {hasError && <ErrorBanner message={error} />} — renders the right side only when the left is truthy.',
      'Early return: `if (!user) return <Spinner />;` before the main return statement.',
      'Variables holding JSX: compute the JSX to render in a variable, then reference it in the return.'
    ],
    analogy: {
      icon: '🚦',
      title: 'Real-World Analogy',
      text: '"Conditional rendering is a traffic light for your UI. Red = show the error screen, yellow = show the loading spinner, green = show the actual content. The light (your state) decides which screen passes through at any moment."'
    }
  },

  whyUsed: {
    description: 'Real apps are rarely "one fixed screen" — they have loading states, empty states, error states, permission-based views, and dynamic content. Conditional rendering is what makes a UI adapt to the current situation instead of always looking the same.',
    points: [
      'Reflects application state visually: loading / success / error / empty.',
      'Implements access control: show admin tools only to admins, login prompts only to guests.',
      'Improves UX: skeleton loaders, empty-state illustrations, contextual hints all rely on it.',
      'Keeps a single component flexible enough to handle many scenarios cleanly.'
    ]
  },

  whenToUse: {
    description: 'Use it whenever "what should be on screen" depends on data that can vary.',
    points: [
      'Authentication: logged-in vs logged-out views.',
      'Async data: loading spinner → error message → loaded content.',
      'Empty states: "No results found" vs a populated list.',
      'Feature flags / permissions: showing/hiding admin or premium-only sections.',
      'Responsive behaviour driven by state (e.g. collapsed vs expanded menus).'
    ]
  },

  howItWorks: {
    description: 'JSX is just JavaScript, so "conditional rendering" is really just "conditional expressions that return JSX (or null)". React renders whatever your component function returns; returning null, false, or undefined renders nothing.',
    code: {
      title: 'The four common patterns side by side',
      snippet: `function Dashboard({ user, isLoading, error, notifications }) {
  // 1) Early return — guard clauses for whole-screen states
  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      {/* 2) Ternary — choose between two pieces of UI */}
      {user ? <WelcomeBanner name={user.name} /> : <GuestBanner />}

      {/* 3) Logical AND — render something or nothing */}
      {notifications.length > 0 && (
        <Badge count={notifications.length} />
      )}

      {/* 4) Variable holding JSX — for more complex branching */}
      {(() => {
        if (notifications.length === 0) return <EmptyState text="You're all caught up!" />;
        return <NotificationList items={notifications} />;
      })()}
    </div>
  );
}`
    }
  },

  flowDiagram: {
    title: 'A typical async data UI state machine',
    steps: [
      { icon: '⏳', label: 'Loading', note: 'isLoading === true → <Spinner />' },
      { icon: '❌', label: 'Error', note: 'error !== null → <ErrorBanner />' },
      { icon: '📭', label: 'Empty', note: 'data.length === 0 → <EmptyState />' },
      { icon: '✅', label: 'Success', note: 'data.length > 0 → <DataList />' }
    ]
  },

  realWorldExamples: {
    intro: 'Almost every screen with real data leans on conditional rendering:',
    items: [
      { icon: '🔐', title: 'Auth-aware navbar', description: 'Shows "Login / Sign up" for guests, and "Profile / Logout" for authenticated users — the same navbar, different content.', code: `{user ? <UserMenu user={user} /> : <AuthLinks />}` },
      { icon: '⏳', title: 'Data fetching states', description: 'A dashboard widget shows a skeleton while loading, an error card on failure, and the chart once data arrives.' },
      { icon: '🛒', title: 'Empty cart state', description: 'An e-commerce cart shows a friendly "Your cart is empty — start shopping!" illustration when there are zero items.' },
      { icon: '🛡️', title: 'Role-based UI', description: 'Admin-only buttons ("Delete user", "Edit settings") render only when currentUser.role === "admin".' }
    ]
  },

  prosAndCons: {
    pros: [
      'No new syntax to learn — it\'s just JavaScript expressions you already know.',
      'Keeps UI logic declarative and colocated with the markup it affects.',
      'Scales naturally from simple toggles to complex multi-state screens.'
    ],
    cons: [
      'Deeply nested ternaries quickly become unreadable ("ternary hell").',
      '`&&` with numeric/zero values can accidentally render a stray "0" on screen.',
      'Scattering many conditions through a render can make a component hard to follow — sometimes a dedicated state-machine/early-return structure is clearer.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'The classic `&&` zero bug',
        wrong: `{count && <Badge count={count} />}\n// ❌ when count is 0, JSX renders the literal "0" on screen!`,
        right: `{count > 0 && <Badge count={count} />}\n// ✅ explicit boolean condition — renders nothing when 0`,
        note: '0 is falsy, but it is also a valid, renderable value — so {0 && <X/>} evaluates to 0, and React renders that "0". Always use an explicit comparison (count > 0) when the left side could be a number.'
      },
      {
        title: 'Nesting ternaries until they\'re unreadable',
        wrong: `{status === 'loading' ? <Spinner /> : status === 'error' ? <Err /> : status === 'empty' ? <Empty /> : <List />}  // ❌ hard to scan`,
        right: `if (status === 'loading') return <Spinner />;\nif (status === 'error') return <Err />;\nif (status === 'empty') return <Empty />;\nreturn <List />;  // ✅ early returns read top-to-bottom`,
        note: 'When you have 3+ branches, prefer early returns or a lookup map over chained ternaries — your future self (and reviewers) will thank you.'
      }
    ]
  },

  bestPractices: [
    'Use early returns ("guard clauses") for whole-component states like loading/error — keeps the main render path clean.',
    'Use ternaries for simple either/or choices, and `&&` (with explicit boolean conditions) for "render or nothing".',
    'Extract complex branching into a small helper function or a lookup object keyed by status.',
    'Always design for the loading, error, and empty states — not just the "happy path" with data.',
    'Remember: returning null, false, or undefined from a component renders nothing — perfectly valid and often useful.'
  ],

  interviewQuestions: [
    { q: 'How do you conditionally render UI in React?', a: 'Since JSX is just JavaScript, you use normal expressions: ternary operators (cond ? a : b) for either/or choices, logical AND (cond && jsx) to render something or nothing, early returns/guard clauses for whole-component states, or variables/helper functions that compute the JSX to render before the main return.' },
    { q: 'Why does `{count && <Badge />}` sometimes render a stray "0" on the page?', a: 'Because `&&` returns its left operand when that operand is falsy. If count is 0, the expression evaluates to 0 — and React happily renders the number 0 to the screen (0 is a valid renderable value, unlike false/null/undefined which render nothing). The fix is to make the condition explicitly boolean, e.g. count > 0 && <Badge />.' },
    { q: 'What does returning `null` from a component do?', a: 'It tells React to render nothing for that component — no DOM node is created. This is useful for components that should sometimes simply not appear (e.g. a tooltip that only shows when hovered, or a banner that\'s dismissed).' },
    { q: 'When would you choose an early return over a ternary for conditional rendering?', a: 'When a condition determines the *entire* output of the component (e.g. "if loading, show only a spinner; if error, show only an error screen") rather than just one piece of it. Early returns ("guard clauses") keep the main render path focused on the success case and avoid deeply nested or chained ternaries that are hard to read.' }
  ],

  summary: {
    description: 'Conditional rendering is just JavaScript conditionals producing JSX (or null). Reach for ternaries and `&&` for small inline decisions, and early returns for whole-screen states like loading/error/empty. Always design explicitly for all the states your data can be in — not just the happy path.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/conditional-rendering — covers if/else, ternaries, logical &&, and preventing components from rendering.' }
  ]
};

export default conditionalRendering;
