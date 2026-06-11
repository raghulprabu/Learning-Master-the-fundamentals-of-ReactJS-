const errorBoundariesContent = {
  id: 'errorBoundaries',
  title: 'Error Boundaries',
  icon: '🛡️',
  theme: 'rose',
  tagline: 'Error boundaries catch rendering errors and show a fallback UI so the whole app does not crash.',
  meta: 'Ecosystem · Resilience',

  whatIsIt: {
    description: [
      'An error boundary is a class component that catches JavaScript errors during rendering and shows a fallback UI instead of crashing the whole app.',
      'When a child component throws an error, the error boundary catches it, logs it, and shows a friendly message — the rest of the app keeps working.'
    ],
    points: [
      'Must be a class component — use the react-error-boundary package for a cleaner, function-component-friendly API.',
      'getDerivedStateFromError(error) — updates state to trigger the fallback render.',
      'componentDidCatch(error, info) — use for logging errors to a service like Sentry.',
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
      text: '"An error boundary is like a circuit breaker in an electrical panel. When one circuit fails, the breaker trips and that section shuts down — but the rest of the house still has power. Without circuit breakers, one fault would cut power to the whole house."'
    }
  },

  whyUsed: {
    description: 'Before error boundaries, any unhandled rendering error crashed the entire React app and showed a blank white screen. Error boundaries isolate failures to one section, keep the rest of the app working, and give you a hook for automatic error logging.',
    points: [
      'Prevents one rendering error from crashing the entire app.',
      'Other parts of the UI keep working when one section fails.',
      'componentDidCatch provides automatic logging to error-tracking services.',
      'Shows a clear "Something went wrong" message instead of a blank screen.'
    ]
  },

  whenToUse: {
    description: 'Wrap any important section that could fail on its own, where a failure should not take down the whole page.',
    points: [
      'Dashboard widgets — an analytics chart failing should not block the rest of the dashboard.',
      'Route-level components — one buggy page should not break navigation.',
      'Third-party components that might fail in unexpected ways.',
      'Features backed by external data or complex logic that could throw at runtime.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'Errors that error boundaries do NOT catch',
      text: '"Error boundaries only catch errors during RENDERING and React lifecycle methods. They do not catch errors in event handlers (use try/catch there), async code (fetch, setTimeout), or in the boundary itself."'
    }
  },

  howItWorks: {
    description: 'When a child throws during rendering, React looks for the nearest error boundary ancestor. It calls getDerivedStateFromError to update state (showing the fallback UI), then componentDidCatch for side effects like logging.',
    code: {
      title: 'react-error-boundary — recommended for function-component codebases',
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
      'react-error-boundary wraps the class component requirement and provides resetErrorBoundary so users can retry.',
      'Place boundaries at multiple levels — route-level for most things, widget-level for critical sections.',
      'Always connect componentDidCatch or onError to an error-tracking service so you know about production failures.'
    ]
  },

  flowDiagram: {
    title: 'How React handles a rendering error with an error boundary',
    steps: [
      { icon: '💥', label: 'Component throws during render', note: 'Unexpected error in child subtree' },
      { icon: '🔍', label: 'React finds nearest ErrorBoundary', note: 'Walks up the ancestor tree' },
      { icon: '🔧', label: 'getDerivedStateFromError(error)', note: 'State updated → re-render with fallback' },
      { icon: '📊', label: 'componentDidCatch(error, info)', note: 'Log to error tracker' },
      { icon: '🛡️', label: 'Fallback UI shown', note: 'Rest of app unaffected' }
    ]
  },

  realWorldExamples: {
    intro: 'Error boundaries are present in almost every production React app:',
    items: [
      { icon: '📊', title: 'Dashboard widgets', description: 'A data visualization widget that fails when the API returns bad data shows "Unable to load chart" inline — the rest of the dashboard works fine.' },
      { icon: '🗺️', title: 'Route-level boundaries', description: 'A buggy product detail page shows "Page not available" — the header and navigation remain usable.' },
      { icon: '🔌', title: 'Third-party integrations', description: 'A chatbot widget wrapped in a boundary — if the third-party code throws, it fails without crashing the checkout flow.' },
      { icon: '🔄', title: 'Retry-capable boundaries', description: 'A "Try again" button via resetErrorBoundary from react-error-boundary — good for transient data-loading failures.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Prevents one rendering error from crashing the entire app.',
      'First-class hook for error reporting to tracking services.',
      'Enables partial UI failure — some sections fail, others stay functional.',
      'react-error-boundary makes the pattern easy in function-component codebases.'
    ],
    cons: [
      'Must be a class component in raw React — react-error-boundary wraps this.',
      'Does NOT catch event handler errors, async errors, or errors in the boundary itself.',
      'Many granular boundaries add nesting complexity.',
      'Generic fallback UI may not tell users what failed or how to recover.'
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
// One bad API response → blank white screen`,
      note: 'No error boundary — one failing subtree removes the entire visible UI.'
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
// Same throw → "Unable to load recommendations."
// Header and Footer still render normally`,
      note: 'The boundary absorbs the failure; the rest of the app keeps working.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Expecting error boundaries to catch event handler errors',
        wrong: `<ErrorBoundary fallback={<p>Error</p>}>\n  <button onClick={() => { throw new Error(); }}>Click</button>\n</ErrorBoundary>`,
        right: `<button onClick={() => {\n  try { riskyOperation(); }\n  catch(e) { setError(e.message); }\n}}>Click</button>`,
        note: 'Error boundaries only catch errors during RENDERING. Errors in event handlers need standard try/catch.'
      },
      {
        title: 'Having only one root-level boundary',
        note: 'A single root boundary means any rendering error shows the same full-page fallback — the entire app goes dark. Place boundaries around independent sections for partial failure and a much better user experience.'
      },
      {
        title: 'Not logging errors in componentDidCatch',
        note: 'A boundary that only shows a fallback but does not log errors means production failures go unnoticed. Always connect componentDidCatch to an error-tracking service.'
      }
    ]
  },

  bestPractices: [
    'Use react-error-boundary in function-component codebases — cleaner, more flexible API.',
    'Place boundaries around independent sections (widgets, route pages) not just at the root.',
    'Always log errors in componentDidCatch or onError to an error-tracking service.',
    'Write useful fallback UIs with context-appropriate messages and a "Try again" button where possible.',
    'Handle event-handler and async errors separately with try/catch — error boundaries do not cover those.'
  ],

  interviewQuestions: [
    { q: 'What is an error boundary and what does it catch?', a: 'An error boundary is a class component that catches JavaScript errors during RENDERING and in React lifecycle methods within its subtree, showing a fallback UI instead of crashing the whole app. It does NOT catch errors in event handlers, async code (setTimeout, Promises), or in the boundary itself.' },
    { q: 'What is the difference between getDerivedStateFromError and componentDidCatch?', a: 'getDerivedStateFromError is called with the error to update state and trigger a fallback re-render — it controls "what to show." componentDidCatch is for side effects only (logging to error-tracking services) — it also receives a component stack trace for debugging.' },
    { q: 'Why must error boundaries be class components?', a: 'Error boundaries require specific lifecycle methods (getDerivedStateFromError, componentDidCatch) that have no equivalent Hooks API yet. The react-error-boundary package wraps this requirement and provides a cleaner function-component-friendly API.' },
    { q: 'How do you make an error boundary support retrying after a failure?', a: 'Use the react-error-boundary package. Its FallbackComponent receives a resetErrorBoundary prop — calling it resets the boundary and remounts the children so the user can try again.' },
    { q: 'How do you handle errors in event handlers where error boundaries do not help?', a: 'With standard try/catch: wrap the risky operation and use the catch block to set error state via useState that the component then renders. For async operations, use .catch() on the Promise or try/catch inside an async function.' }
  ],

  summary: {
    description: 'Error boundaries catch rendering errors in a subtree, log them to tracking services, and show fallback UI instead of crashing the app. Place them around independent sections for graceful partial failure. Handle event-handler and async errors separately with try/catch — error boundaries do not cover those cases.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary — canonical reference for the lifecycle methods.' },
    { label: 'Library', note: 'react-error-boundary on npm — recommended wrapper for function-component codebases.' }
  ]
};

export default errorBoundariesContent;
