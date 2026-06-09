const errorBoundariesContent = {
  id: 'errorBoundaries',
  title: 'Error Boundaries',
  icon: '🛡️',
  theme: 'rose',
  tagline: 'Catch JavaScript errors during rendering and show a fallback UI — React\'s equivalent of try/catch for component trees.',
  meta: 'Ecosystem · Resilience',

  whatIsIt: {
    description: [
      'An error boundary is a class component (as of React 18 — function component support not yet native) that implements either getDerivedStateFromError() or componentDidCatch() — or both. It catches JavaScript errors that occur during rendering, in lifecycle methods, and in constructors of any component in its subtree.',
      'When a child throws, the error boundary "catches" the error and renders a fallback UI instead of crashing the entire app — giving users a graceful experience and developers an actionable error report.'
    ],
    points: [
      'Must be a class component — there\'s no function-component-native equivalent yet (as of React 19); third-party packages like `react-error-boundary` provide a more ergonomic API.',
      'getDerivedStateFromError(error) — static, updates state to trigger a fallback render.',
      'componentDidCatch(error, info) — side effects only (logging to error-tracking services); receives a component stack trace.',
      'Does NOT catch errors in: event handlers, async code (setTimeout/Promises), server-side rendering.'
    ],
    code: { title: 'A production-ready error boundary', snippet: `class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to your error-tracking service (Sentry, Datadog, etc.)
    errorTracker.captureException(error, {
      extra: { componentStack: info.componentStack }
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Usage — wrap the sections you want to isolate:
<ErrorBoundary fallback={<p>Something went wrong loading this section.</p>}>
  <ProductRecommendations />
</ErrorBoundary>` },
    analogy: {
      icon: '⚡',
      title: 'Real-World Analogy',
      text: '"An error boundary is like a circuit breaker in an electrical panel. When a fault occurs in one circuit (one section of your component tree), the breaker trips — that circuit shuts down (shows a fallback), but the rest of the house still has power (the rest of the app still works). Without circuit breakers, one fault would blow the entire house\'s electricity (crash the whole app)."'
    }
  },

  whyUsed: {
    description: 'Before error boundaries, any unhandled error during rendering would crash the entire React app and show a blank white screen — with no user feedback and no chance for other parts of the app to keep working. Error boundaries make apps resilient: failures are isolated to a subtree, reported to error tracking, and shown with graceful fallback UI.',
    points: [
      'Prevents a rendering error in one component from crashing the entire app.',
      'Enables graceful degradation — other parts of the UI continue working when one section fails.',
      'Provides a hook (componentDidCatch) for automatically logging errors to tracking services (Sentry, LogRocket).',
      'Improves user experience: clear, actionable "Something went wrong" message instead of a blank white screen.'
    ]
  },

  whenToUse: {
    description: 'Wrap any significant subtree that could fail independently and where a failure shouldn\'t take down the whole app.',
    points: [
      'Individual sections/widgets of a dashboard (errors in analytics charts shouldn\'t block the whole dashboard).',
      'Route-level components in a router — one failing page shouldn\'t break navigation.',
      'Third-party components and dynamically-loaded code that might fail in unpredictable ways.',
      'Any feature backed by external data or complex business logic that could encounter unexpected runtime errors.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'Errors error boundaries do NOT catch',
      text: '"Error boundaries only catch errors during RENDERING and React lifecycle methods. They don\'t catch: errors in event handlers (use try/catch there), errors in async code (fetch, setTimeout), errors in the error boundary itself. For event-handler errors, use try/catch; for async errors, use catch handlers or Promises\' .catch()."'
    }
  },

  howItWorks: {
    description: 'When a child component throws during rendering or in a lifecycle method, React unwinds up the tree looking for the nearest error boundary ancestor. Found: the boundary calls getDerivedStateFromError to update state (triggering a re-render into fallback UI), then componentDidCatch for side effects (logging). Not found: the error propagates to the root and crashes the app.',
    code: {
      title: 'Wrapping react-error-boundary (recommended for function-component codebases)',
      snippet: `// npm install react-error-boundary
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => errorTracker.captureException(error, { extra: info })}
      onReset={() => { /* optionally reset your app state */ }}
    >
      <ProductDashboard />
    </ErrorBoundary>
  );
}`
    },
    points: [
      'react-error-boundary is the recommended approach for modern, function-component-based codebases — it wraps the class-component requirement and provides convenient props like `onReset`.',
      'resetErrorBoundary (from react-error-boundary) lets the user explicitly retry after an error, making the boundary interactive rather than terminal.',
      'Multiple error boundaries at different tree levels gives you granular recovery: route-level for most things, widget-level for critical but non-blocking sections.'
    ]
  },

  flowDiagram: {
    title: 'How React handles a rendering error with an error boundary',
    steps: [
      { icon: '💥', label: 'Component throws during render', note: 'Unexpected error in child subtree' },
      { icon: '🔍', label: 'React looks for nearest ErrorBoundary', note: 'Walks up the ancestor tree' },
      { icon: '🔧', label: 'getDerivedStateFromError(error)', note: 'State updated → re-render with fallback' },
      { icon: '📊', label: 'componentDidCatch(error, info)', note: 'Log to Sentry / error tracker' },
      { icon: '🛡️', label: 'Fallback UI rendered', note: 'Rest of app unaffected' }
    ]
  },

  realWorldExamples: {
    intro: 'Error boundaries are quietly present in almost every production React app:',
    items: [
      { icon: '📊', title: 'Dashboard widgets', description: 'A data visualization widget that might fail when the API returns malformed data shows an inline "Unable to load chart" message — the rest of the dashboard works fine.' },
      { icon: '🗺️', title: 'Route-level boundaries', description: 'Each route wrapped in an error boundary: a buggy product detail page shows "Page not available" and the header/nav remain usable.' },
      { icon: '🔌', title: 'Third-party integrations', description: 'A chatbot widget or payment form wrapped in a boundary — if the third-party code throws, it fails gracefully without crashing checkout flow.' },
      { icon: '🔄', title: 'Retry-capable boundaries', description: 'User-facing "Try again" button via resetErrorBoundary from react-error-boundary — for transient data-loading failures.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Prevents a single rendering error from crashing the entire app — critical for production resilience.',
      'Provides a first-class hook for error reporting to tracking services.',
      'Enables partial UI failure — some sections fail, others remain functional.',
      'react-error-boundary makes the pattern ergonomic in function-component codebases.'
    ],
    cons: [
      'Must be a class component in raw React — native function-component support not yet available (react-error-boundary paper over this).',
      'Does NOT catch event handler errors, async errors, or errors in the boundary itself — requires separate handling.',
      'Granular boundaries add nesting complexity.',
      'Fallback UI can be generic — users may not know what exactly failed or how to recover without thoughtful error messaging.'
    ]
  },

  comparison: {
    title: 'Without vs. with an error boundary',
    left: {
      title: '❌ No boundary — entire app crashes',
      tone: 'bad',
      code: `function App() {
  return (
    <>
      <Header />
      <ProductRecommendations /> {/* throws! */}
      <Footer />
    </>
  );
}
// One bad API response → blank white screen → user sees nothing`,
      note: 'No error boundary = a single failing subtree nukes the entire visible UI.'
    },
    right: {
      title: '✅ With boundary — isolated, graceful failure',
      tone: 'good',
      code: `function App() {
  return (
    <>
      <Header />
      <ErrorBoundary fallback={<p>Unable to load recommendations.</p>}>
        <ProductRecommendations />
      </ErrorBoundary>
      <Footer />
    </>
  );
}
// Same throw → "Unable to load recommendations." message
// Header and Footer still render normally`,
      note: 'The boundary absorbs the failure; the rest of the app continues working.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Expecting error boundaries to catch event handler errors',
        wrong: `<ErrorBoundary fallback={<p>Error</p>}>\n  <button onClick={() => { throw new Error(); }}>Click</button>\n</ErrorBoundary>`,
        right: `<button onClick={() => {\n  try { riskyOperation(); }\n  catch(e) { setError(e.message); }\n}}>Click</button>`,
        note: 'Error boundaries only catch errors during RENDERING and React lifecycle methods. Errors in event handlers, setTimeout, or Promises require standard try/catch or .catch() handling.'
      },
      {
        title: 'Having one root-level boundary and nothing more granular',
        note: 'A single root boundary is better than nothing, but it means any rendering error shows the same full-page fallback — the entire app goes dark. Placing boundaries around independent sections (widgets, route segments) enables partial failure and a much better user experience.'
      },
      {
        title: 'Not logging errors in componentDidCatch',
        note: 'An error boundary that only shows fallback UI but doesn\'t log errors means runtime failures silently go unnoticed in production. Always connect componentDidCatch to an error-tracking service (Sentry, Datadog, Bugsnag) so your team learns about real failures.'
      }
    ]
  },

  bestPractices: [
    'Use react-error-boundary package in function-component codebases — it provides a cleaner, more flexible API.',
    'Place boundaries around independently-failing sections (widgets, route pages) not just at the root — for granular failure isolation.',
    'Always log errors in componentDidCatch / onError to an error-tracking service; silent failures are worse than visible ones.',
    'Write useful fallback UIs with context-appropriate messages and, where possible, a "Try again" recovery action.',
    'Handle event-handler and async errors separately (try/catch, .catch()) — error boundaries don\'t cover those cases.'
  ],

  interviewQuestions: [
    { q: 'What is an error boundary and what does it catch?', a: 'An error boundary is a class component that implements getDerivedStateFromError and/or componentDidCatch — it catches JavaScript errors that occur during RENDERING and in React lifecycle methods within its subtree, showing a fallback UI instead of crashing the whole app. It does NOT catch: errors in event handlers, async errors (setTimeout, Promises), or errors in the boundary itself.' },
    { q: 'What is the difference between getDerivedStateFromError and componentDidCatch?', a: 'getDerivedStateFromError is a static method called with the error to update state, triggering a re-render with the fallback UI — it\'s for "what to show". componentDidCatch is called after the component tree has re-rendered and is for side effects only (logging to error-tracking services) — it also receives a second argument with the component stack trace for debugging.' },
    { q: 'Why must error boundaries be class components in raw React (as of React 19)?', a: 'Error boundaries require implementing specific lifecycle methods (getDerivedStateFromError, componentDidCatch) that have no equivalent Hooks API yet. The React team has discussed but not yet shipped a native function-component error boundary mechanism. The react-error-boundary package wraps the class component requirement and provides a function-component-friendly API for most use cases.' },
    { q: 'How would you make an error boundary support retrying after a failure?', a: 'Use the react-error-boundary package\'s <ErrorBoundary> with a FallbackComponent that receives the `resetErrorBoundary` prop — calling it resets the boundary\'s error state and remounts the children. In the raw class component version, provide a "Try again" button that calls this.setState({ hasError: false }) — though you may also need to reset any upstream state that caused the error.' },
    { q: 'How do you handle errors in event handlers in React (where error boundaries don\'t help)?', a: 'With standard JavaScript try/catch: wrap the risky operation in a try block and use the catch block to set error state (via useState) that the component can then render. For async operations (fetch, await), use .catch() on the Promise or try/catch inside an async function to handle rejection and update component state accordingly.' }
  ],

  summary: {
    description: 'Error boundaries are React\'s try/catch for rendering — class components (or react-error-boundary\'s wrapper) that absorb rendering errors in a subtree, log them to tracking services, and display fallback UI instead of crashing the app. Strategic placement around independent sections enables graceful partial failure; event-handler and async errors need separate try/catch handling.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary — the canonical reference for the class component lifecycle methods.' },
    { label: 'Library', note: 'react-error-boundary on npm — the recommended wrapper for function-component codebases, providing `resetErrorBoundary`, `useErrorBoundary`, and `withErrorBoundary` HOC.' }
  ]
};

export default errorBoundariesContent;
