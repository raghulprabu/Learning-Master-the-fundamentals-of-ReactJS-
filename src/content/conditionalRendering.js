const conditionalRendering = {
  id: 'conditionalRendering',
  title: 'Conditional Rendering',
  icon: '🔀',
  theme: 'teal',
  tagline: 'Conditional rendering shows different UI based on a condition — like if/else for your JSX.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Conditional rendering means showing different things on screen depending on a condition. For example: show a loading spinner while data loads, or show an error message if something went wrong.',
      'There is no special React syntax for this. You use regular JavaScript: ternary operators, the && operator, or if/return statements.'
    ],
    points: [
      'Ternary: {isLoggedIn ? <Dashboard /> : <LoginForm />}',
      'Logical AND: {hasError && <ErrorBanner />} — renders only when the condition is true.',
      'Early return: if (!user) return <Spinner />; — before your main JSX.',
      'Variable: compute the JSX to show in a variable, then use that variable in the return.'
    ],
    analogy: {
      icon: '🚦',
      title: 'Like a traffic light',
      text: '"Conditional rendering is like a traffic light. Red = show the error screen. Yellow = show the loading spinner. Green = show the actual content. Your state value decides which screen shows at any moment."'
    }
  },

  whyUsed: {
    description: 'Real apps are never one fixed screen. They have loading states, error states, empty states, and different views for different users. Conditional rendering handles all of these.',
    points: [
      'Shows loading, success, error, and empty states correctly.',
      'Hides or shows features based on user permissions.',
      'Improves UX with loading skeletons, empty-state messages, and helpful hints.',
      'Keeps one component flexible for many different situations.'
    ]
  },

  whenToUse: {
    description: 'Use conditional rendering whenever what should be on screen depends on data that can change.',
    points: [
      'Authentication: show different nav for logged-in vs. logged-out users.',
      'Async data: show spinner → error message → actual content.',
      'Empty states: show "No results found" when a list is empty.',
      'Permissions: show admin buttons only to admin users.',
      'Toggles: show or hide a dropdown or sidebar based on state.'
    ]
  },

  howItWorks: {
    description: 'JSX is just JavaScript. You use JavaScript conditionals that return JSX or null. Returning null, false, or undefined renders nothing.',
    code: {
      title: 'The four common patterns',
      snippet: `function Dashboard({ user, isLoading, error, notifications }) {
  // 1) Early return — for whole-screen states
  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      {/* 2) Ternary — choose between two pieces of UI */}
      {user ? <WelcomeBanner name={user.name} /> : <GuestBanner />}

      {/* 3) Logical AND — show something or nothing */}
      {notifications.length > 0 && (
        <Badge count={notifications.length} />
      )}

      {/* 4) Variable holding JSX */}
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
    title: 'A typical async data state machine',
    steps: [
      { icon: '⏳', label: 'Loading', note: 'isLoading === true → <Spinner />' },
      { icon: '❌', label: 'Error', note: 'error !== null → <ErrorBanner />' },
      { icon: '📭', label: 'Empty', note: 'data.length === 0 → <EmptyState />' },
      { icon: '✅', label: 'Success', note: 'data.length > 0 → <DataList />' }
    ]
  },

  realWorldExamples: {
    intro: 'Conditional rendering is used in almost every screen with real data:',
    items: [
      { icon: '🔐', title: 'Auth-aware navbar', description: 'Shows "Login / Sign up" for guests and "Profile / Logout" for users — same navbar, different content.', code: `{user ? <UserMenu user={user} /> : <AuthLinks />}` },
      { icon: '⏳', title: 'Data fetching states', description: 'A dashboard widget shows a skeleton while loading, an error card on failure, and the data when ready.' },
      { icon: '🛒', title: 'Empty cart state', description: 'Shows a friendly "Your cart is empty!" message when there are zero items.' },
      { icon: '🛡️', title: 'Role-based UI', description: 'Admin buttons render only when currentUser.role === "admin".' }
    ]
  },

  prosAndCons: {
    pros: [
      'No new syntax — just JavaScript you already know.',
      'Logic lives right next to the markup it affects.',
      'Scales from simple toggles to complex multi-state screens.'
    ],
    cons: [
      'Too many nested ternaries become hard to read ("ternary hell").',
      'The && operator can accidentally render "0" when a number is falsy.',
      'Many conditions scattered through a component can be hard to follow.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'The && zero bug',
        wrong: `{count && <Badge count={count} />}\n// ❌ when count is 0, React renders the number "0" on screen!`,
        right: `{count > 0 && <Badge count={count} />}\n// ✅ explicit boolean — renders nothing when 0`,
        note: '0 is falsy but it is also a renderable value. {0 && <X/>} renders "0". Always use an explicit comparison like count > 0 when the left side is a number.'
      },
      {
        title: 'Nesting ternaries until they are unreadable',
        wrong: `{status === 'loading' ? <Spinner /> : status === 'error' ? <Err /> : status === 'empty' ? <Empty /> : <List />}  // ❌ hard to read`,
        right: `if (status === 'loading') return <Spinner />;\nif (status === 'error') return <Err />;\nif (status === 'empty') return <Empty />;\nreturn <List />;  // ✅ easy to read top-to-bottom`,
        note: 'When you have 3 or more branches, use early returns instead of chained ternaries.'
      }
    ]
  },

  bestPractices: [
    'Use early returns for whole-screen states like loading and error.',
    'Use ternaries for simple either/or choices.',
    'Use && (with explicit boolean conditions) to show something or nothing.',
    'Always design for loading, error, and empty states — not just the success case.',
    'Returning null from a component renders nothing — useful and valid.'
  ],

  interviewQuestions: [
    { q: 'How do you conditionally render UI in React?', a: 'You use JavaScript expressions: ternary (cond ? a : b) for either/or choices, && (cond && jsx) to show something or nothing, early returns for whole-component states, or variables that hold the JSX to render.' },
    { q: 'Why does {count && <Badge />} sometimes render "0" on the page?', a: 'Because && returns its left side when it is falsy. If count is 0, the expression returns 0 — and React renders the number 0 on screen (0 is a valid renderable value, unlike false or null). Fix it with an explicit comparison: count > 0 && <Badge />.' },
    { q: 'What does returning null from a component do?', a: 'It tells React to render nothing for that component. No DOM node is created. Useful for components that should sometimes be invisible, like tooltips or dismissed banners.' },
    { q: 'When do you use an early return instead of a ternary?', a: 'When a condition controls the entire output of the component — like showing only a spinner while loading, or only an error screen on failure. Early returns keep the main render path clean and avoid deeply nested ternaries.' }
  ],

  summary: {
    description: 'Conditional rendering is just JavaScript conditionals that return JSX or null. Use ternaries and && for small inline decisions. Use early returns for whole-screen loading/error states. Always handle loading, error, and empty — not just the happy path when data is ready.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/conditional-rendering — covers all four patterns with examples.' }
  ]
};

export default conditionalRendering;
