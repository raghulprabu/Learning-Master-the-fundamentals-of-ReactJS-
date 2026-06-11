const testingContent = {
  id: 'testing',
  title: 'Testing React Apps',
  icon: '🧪',
  theme: 'emerald',
  tagline: 'Test your components the way users use them — React Testing Library, Vitest, and good testing habits.',
  meta: 'Ecosystem · Quality',

  whatIsIt: {
    description: [
      'Testing in React means checking that your components show the right output and work correctly when users interact with them — not that their internal code works a certain way.',
      'The standard tools: Vitest (or Jest) as the test runner, React Testing Library (RTL) for rendering and interacting with components, and MSW (Mock Service Worker) for mocking API calls.'
    ],
    points: [
      'React Testing Library: renders components in a fake browser, gives you queries (getByRole, getByText) and user-event to click and type.',
      'Vitest: fast, modern test runner. Jest is the traditional alternative. Both work with RTL.',
      'MSW: intercepts real HTTP requests in tests and returns fake responses — your actual fetch code runs.',
      'Testing pyramid: many unit tests → fewer integration tests → few E2E tests (Playwright).'
    ],
    code: { title: 'RTL component test — the basic pattern', snippet: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Counter from './Counter';

describe('Counter component', () => {
  it('starts at 0 and increments on button click', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    // Query by ROLE (accessible, resilient) — not by class or test-id
    expect(screen.getByRole('heading', { name: 'Count: 0' })).toBeInTheDocument();

    const incrementButton = screen.getByRole('button', { name: /increment/i });
    await user.click(incrementButton);

    expect(screen.getByRole('heading', { name: 'Count: 1' })).toBeInTheDocument();
  });

  it('does not allow count below 0', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole('button', { name: /decrement/i }));
    // Count stays at 0, not -1
    expect(screen.getByRole('heading', { name: 'Count: 0' })).toBeInTheDocument();
  });
});` },
    analogy: {
      icon: '🔬',
      title: 'Real-World Analogy',
      text: '"Testing a React component from the user\'s view is like testing a coffee machine as a customer — not as an engineer. You do not open the machine to check if the pump runs exactly 3.2 cycles. You press Espresso and check if you get an espresso. RTL works the same way: you click buttons and read text — just like a real user."'
    }
  },

  whyUsed: {
    description: 'Tests catch bugs before users do. They also let you refactor code safely — if tests pass, behavior is unchanged.',
    points: [
      'Catch regressions before they reach users — especially for complex component logic.',
      'Refactor freely — if behavior tests pass, internal changes are safe.',
      'Document intended behavior — a well-named test shows what a component should do.',
      'Reduce manual testing time for common user flows.'
    ]
  },

  whenToUse: {
    description: 'Test behavior that matters to users — not internal code details.',
    points: [
      'Component tests: any component with UI logic — forms, conditionals, user interactions.',
      'Custom Hooks: use renderHook from RTL to test hook logic without a full component.',
      'Integration tests: a full user flow (fill form → submit → see confirmation) with MSW for API calls.',
      'E2E tests (Playwright): critical user paths (login, checkout) in a real browser.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'What NOT to test',
      text: '"Do not test implementation details: internal state values, class names, or exact DOM structure. These make tests break on every refactor even when the user experience is unchanged. Test what users see: \'after clicking Submit, the form shows a success message\' — not \'setIsSubmitted is called with true\'."'
    }
  },

  howItWorks: {
    description: 'RTL renders your component into a fake browser (jsdom). You query what is visible (by role, text, or label) and simulate user actions with userEvent. Assertions check the DOM matches the expected state.',
    code: {
      title: 'Testing an async component with API calls (MSW)',
      snippet: `// msw handlers — mock the API at the network level (not with jest.mock)
import { http, HttpResponse } from 'msw';
export const handlers = [
  http.get('/api/products', () =>
    HttpResponse.json([{ id: 1, name: 'Keyboard', price: 80 }])
  ),
];

// test
import { render, screen, waitFor } from '@testing-library/react';
import { server } from './mswServer'; // MSW server configured in setupFiles
import ProductList from './ProductList';

it('loads and displays products from the API', async () => {
  render(<ProductList />);

  // While loading — spinner is present
  expect(screen.getByRole('status')).toBeInTheDocument(); // aria-role="status" on spinner

  // Wait for the async operation to complete and data to render
  expect(await screen.findByText('Keyboard')).toBeInTheDocument();
  expect(screen.getByText('$80')).toBeInTheDocument();

  // Spinner is gone
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('shows error message on API failure', async () => {
  server.use(http.get('/api/products', () => HttpResponse.error())); // override handler for this test
  render(<ProductList />);
  expect(await screen.findByRole('alert')).toBeInTheDocument();
});` },
    points: [
      'findBy* queries are async — they wait for the element to appear. Use for anything shown after a fetch or async action.',
      'queryBy* returns null instead of throwing when the element is not found — use to assert something does NOT exist.',
      'getBy* throws immediately if the element is missing — use when the element should already be on screen.'
    ]
  },

  flowDiagram: {
    title: 'Test types and what each covers',
    steps: [
      { icon: '🔩', label: 'Unit tests', note: 'Pure functions, reducers, utility logic' },
      { icon: '🧩', label: 'Component tests (RTL)', note: 'Render + query + interact + assert' },
      { icon: '🔗', label: 'Integration tests', note: 'Multiple components + API mocks (MSW)' },
      { icon: '🌐', label: 'E2E tests (Playwright)', note: 'Real browser, real backend/staging' }
    ]
  },

  realWorldExamples: {
    intro: 'Good React tests follow consistent patterns:',
    items: [
      { icon: '📝', title: 'Form with validation', description: 'Render form → submit empty → check validation errors appear. Fill valid data → submit → check success message. Mock the API with MSW.' },
      { icon: '🛍️', title: 'Cart with add/remove', description: 'Render product list → click Add to Cart → check cart count increases. Click Remove → check item is gone. No direct state access needed.' },
      { icon: '🔐', title: 'Auth-dependent UI', description: 'Render component inside a mock AuthProvider — test both the logged-in and logged-out versions by providing user or null.' },
      { icon: '🎣', title: 'Custom Hooks', description: 'renderHook(() => useDebounce("hello", 400)) → advance fake timers → check debounced value updated. Test the hook\'s public output, not its setTimeout internals.' }
    ]
  },

  prosAndCons: {
    pros: [
      'RTL\'s role/text queries produce tests that survive refactors but break on real behavior changes.',
      'MSW intercepts at the network level — real fetch code is tested, not mocked module internals.',
      'Vitest is very fast for Vite projects — native ESM, parallel, minimal setup.',
      'Good tests document behavior — a new developer reading tests understands what a component should do.'
    ],
    cons: [
      'Testing async components (loading states, API data) needs extra care: findBy, waitFor, MSW setup.',
      'jsdom lacks some browser APIs — canvas, WebGL, or specific browser behaviors may need polyfills.',
      'A slow test suite in CI creates friction — tests must stay fast to stay useful.',
      'Testing implementation details makes tests brittle — they break on refactors and destroy confidence.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Querying by class names or test IDs instead of accessible roles',
        wrong: `screen.getByTestId('submit-btn'); // ❌ leaks internal detail — breaks on any ID rename\nscreen.getByClassName('submit-button'); // ❌ tests styling, not behavior`,
        right: `screen.getByRole('button', { name: /submit/i }); // ✅ what a user and screen reader sees\nscreen.getByLabelText('Email'); // ✅ user-visible label`,
        note: 'Tests that use testId or class names break whenever you rename an ID or class — even when the user experience is identical. Role/text queries only break when user-visible behavior changes — exactly when tests should fail.'
      },
      {
        title: 'Using fireEvent instead of userEvent',
        wrong: `fireEvent.click(button); // ❌ fires only one synthetic click event — misses focus, hover, keyboard`,
        right: `await userEvent.click(button); // ✅ simulates a full user interaction with all browser events`,
        note: 'userEvent simulates realistic interactions — pointerdown, mousedown, mouseup, click, focus — the full sequence a real browser triggers. fireEvent fires only one synthetic event and misses handlers that depend on the full cascade.'
      },
      {
        title: 'Not resetting MSW handlers between tests',
        note: 'server.use() overrides in individual tests persist to later tests unless reset. Call server.resetHandlers() in afterEach so each test starts fresh with the default handlers.'
      }
    ]
  },

  bestPractices: [
    'Write tests from the user\'s view — what they see (text, roles, labels) and what they do (click, type, submit).',
    'Use getByRole as your first query choice — it tests accessibility and behavior at the same time.',
    'Use userEvent over fireEvent — it simulates realistic interactions.',
    'Mock APIs with MSW, not jest.mock — your actual fetch code gets tested.',
    'For async operations use findBy* or waitFor — never a fixed sleep() in tests.'
  ],

  interviewQuestions: [
    { q: 'What is React Testing Library\'s core testing philosophy?', a: 'Test behavior from the user\'s view, not implementation details. Queries should reflect what a user can see (role, text, label) — not internal details like class names, test IDs, or state values. Tests should break when behavior changes and survive refactors. If the user experience is the same, passing tests should remain passing.' },
    { q: 'What is the difference between getBy*, findBy*, and queryBy* queries?', a: 'getBy* throws immediately if the element is not found — use when the element should already be present. findBy* is async — it retries until the element appears (or times out) — use for elements that appear after data loading or async actions. queryBy* returns null instead of throwing — use specifically to assert that something does NOT exist.' },
    { q: 'What is MSW and why is it preferred over jest.mock for API calls?', a: 'MSW intercepts HTTP requests at the network level. Your actual fetch/Axios code runs normally — MSW just returns configured responses. jest.mock replaces the module entirely, so your data-fetching code is never tested. MSW tests more real code paths (error handling, response parsing) and keeps tests closer to production behavior.' },
    { q: 'How would you test a component that fetches data and shows a loading spinner?', a: 'Render inside the MSW environment. Assert the spinner is visible immediately. Then await screen.findByText(\'expected data\') — findBy waits for the async operation to complete. Finally assert the spinner is gone with queryByRole returning null. This tests the full loading → data lifecycle.' },
    { q: 'How do you test a custom React Hook in isolation?', a: 'Use renderHook from @testing-library/react: const { result } = renderHook(() => useMyHook(args)). Access the return value via result.current. For hooks with async behavior, use act() or waitFor. For timer-based hooks (like useDebounce), combine with vitest.useFakeTimers() and vi.advanceTimersByTime().' }
  ],

  summary: {
    description: 'Test React components from the user\'s view — what they see (role, text, label queries) and what they do (userEvent) — not internal details. RTL + Vitest + MSW is the standard stack: RTL for components, renderHook for custom hooks, MSW for realistic network-level API mocking. Write tests that break when behavior changes and survive refactors.'
  },

  furtherReading: [
    { label: 'React Testing Library docs', note: 'testing-library.com/docs/react-testing-library/intro — the canonical RTL docs including the query priority guide.' },
    { label: 'MSW docs', note: 'mswjs.io — how to set up network-level API mocking in tests.' }
  ]
};

export default testingContent;
