const testingContent = {
  id: 'testing',
  title: 'Testing React Apps',
  icon: '🧪',
  theme: 'emerald',
  tagline: 'Test components the way users use them — React Testing Library, Vitest/Jest, and testing best practices.',
  meta: 'Ecosystem · Quality',

  whatIsIt: {
    description: [
      'Testing in React means verifying that components render the right output and behave correctly when users interact with them — not that their internal implementation details work a certain way. The dominant philosophy is "test behavior, not implementation".',
      'The standard toolkit: Vitest (or Jest) as the test runner + assertion library; React Testing Library (RTL) as the component rendering/interaction layer; and MSW (Mock Service Worker) for API mocking in tests.'
    ],
    points: [
      'React Testing Library: renders components in a jsdom environment, provides queries (getByRole, getByText) and user-event for interaction — encourages testing from the user\'s perspective.',
      'Vitest: fast, Vite-native test runner; Jest is the traditional alternative. Both work with RTL.',
      'MSW (Mock Service Worker): intercepts HTTP requests at the network level — tests fire real fetch() calls but receive mocked responses.',
      'Testing pyramid: many unit tests → fewer integration tests → few E2E tests (Playwright/Cypress).'
    ],
    code: { title: 'RTL component test — the idiomatic pattern', snippet: `import { render, screen } from '@testing-library/react';
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
      text: '"Testing a React component from the user\'s perspective is like quality-testing a coffee machine as a customer, not as an engineer. You don\'t open it up and check if the internal water pump executes exactly 3.2 pump cycles — you press \'Espresso\', wait, and check if you got an espresso. RTL enforces this philosophy: tests query what a user can SEE (text, buttons, headings) and simulate what they DO (click, type, submit) — implementation details are irrelevant."'
    }
  },

  whyUsed: {
    description: 'Tests catch regressions — when a future change inadvertently breaks something that was working. They also serve as living documentation of how components are supposed to behave, and give developers the confidence to refactor safely.',
    points: [
      'Catch regressions before they reach users — especially for complex business logic in components.',
      'Enable fearless refactoring — if behavior tests pass, you can freely change implementation details.',
      'Document intended behavior — a well-named test is the clearest specification of what a component should do.',
      'Reduce manual QA time for common workflows.'
    ]
  },

  whenToUse: {
    description: 'Test behavior that matters to users — not every internal implementation detail.',
    points: [
      'Component tests: any component with meaningful UI logic (form validation, conditional rendering, user interactions).',
      'Custom Hooks: use renderHook from RTL to test Hook logic in isolation.',
      'Integration tests: test a full user workflow (fill form → submit → see confirmation) with MSW for API mocking.',
      'E2E tests (Playwright/Cypress): for critical user paths (sign up, checkout, login) in a real browser against a real or staging backend.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'What NOT to test',
      text: '"Don\'t test implementation details: internal state values, specific method call counts, class names, or exact DOM structure. These make tests brittle — every refactor breaks them even when behavior is unchanged. Test what users see and do: \'after clicking Submit, the form shows a success message\' — not \'after clicking Submit, setIsSubmitted is called with true\'."'
    }
  },

  howItWorks: {
    description: 'RTL renders a component into a jsdom environment (a headless DOM in Node.js). You then query the rendered output using accessible queries (by role, by text, by label) and simulate user interactions with userEvent. Assertions verify the DOM reflects the expected state after interactions.',
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
      'findBy* queries are async — they wait (with timeout) for the element to appear in the DOM. Use them for anything that appears after an async operation.',
      'queryBy* returns null instead of throwing when element is not found — use it for asserting elements DON\'T exist.',
      'getBy* throws immediately if element is not found — use it for elements that should definitely be present already.'
    ]
  },

  flowDiagram: {
    title: 'The test types and what each covers',
    steps: [
      { icon: '🔩', label: 'Unit tests', note: 'Functions, reducers, pure logic — no DOM' },
      { icon: '🧩', label: 'Component tests (RTL)', note: 'Render + query + interact + assert' },
      { icon: '🔗', label: 'Integration tests', note: 'Multiple components + API mocks (MSW)' },
      { icon: '🌐', label: 'E2E tests (Playwright)', note: 'Real browser, real backend/staging' }
    ]
  },

  realWorldExamples: {
    intro: 'Well-tested React code follows predictable patterns:',
    items: [
      { icon: '📝', title: 'Form with validation', description: 'Render form → submit empty → assert validation errors appear. Fill valid data → submit → assert success message. Mock the API call with MSW.' },
      { icon: '🛍️', title: 'Cart with add/remove', description: 'Render product list → click Add to Cart → assert cart count increases. Click Remove → assert item gone. All without touching internal cart state directly.' },
      { icon: '🔐', title: 'Auth-dependent UI', description: 'Render component inside a mock AuthProvider — test the authenticated version and the unauthenticated version in separate tests, providing the relevant user/null value.' },
      { icon: '🎣', title: 'Custom Hooks', description: 'renderHook(() => useDebounce("hello", 400)) → advance timers → assert debounced value updated. Test the hook\'s public contract, not its internal setTimeout calls.' }
    ]
  },

  prosAndCons: {
    pros: [
      'RTL\'s "query by role/text" approach produces tests that are resilient to refactors but break on real behavior changes.',
      'MSW intercepts at the network level — tests exercise real fetch() code instead of mocked module internals.',
      'vitest is extremely fast (native ESM, parallel, no transform overhead for Vite projects).',
      'Good tests document intended behavior — a new developer reading tests understands what a component should do.'
    ],
    cons: [
      'Testing async components (loading states, API data) requires extra care (findBy, waitFor, MSW setup).',
      'jsdom lacks some browser APIs — tests for canvas, WebGL, or specific browser behaviors may not work without polyfills.',
      'A slow test suite (especially E2E) creates friction in CI — tests must be kept fast to stay useful.',
      'Over-testing implementation details creates brittle tests that break on refactors and erode developer trust in the test suite.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Querying by implementation details (class names, test-ids) instead of accessible roles',
        wrong: `screen.getByTestId('submit-btn'); // ❌ tests an arbitrary ID that leaks implementation details\nscreen.getByClassName('submit-button'); // ❌ tests styling choices, not behavior`,
        right: `screen.getByRole('button', { name: /submit/i }); // ✅ queries what a user and screen reader would see\nscreen.getByLabelText('Email'); // ✅ queries the label text — user-visible`,
        note: 'Tests that query by testId or class name break on any internal renaming/restructuring even when behavior is unchanged. Role/text/label queries break only when the USER-VISIBLE behavior changes — which is exactly when a test should break.'
      },
      {
        title: 'Using fireEvent instead of userEvent',
        wrong: `fireEvent.click(button); // ❌ fires only a synthetic click event — misses focus, hover, keyboard interactions`,
        right: `await userEvent.click(button); // ✅ simulates a full browser-level interaction including pointer events, focus, etc.`,
        note: 'userEvent from @testing-library/user-event simulates realistic user interactions — it triggers the full cascade of browser events (pointerdown, mousedown, mouseup, click, focus, etc.) that a real browser interaction would. fireEvent only fires one synthetic event, which can miss event handlers that depend on the full interaction cascade.'
      },
      {
        title: 'Not cleaning up between tests when using MSW',
        note: 'MSW server.use() calls in individual tests add handler OVERRIDES that persist for subsequent tests unless reset. Always call server.resetHandlers() in afterEach to ensure each test starts with the default handlers. The MSW docs recommend configuring this in setupFiles or beforeEach.'
      }
    ]
  },

  bestPractices: [
    'Write tests from the user\'s perspective — what they see (text, roles, labels) and what they do (click, type, submit).',
    'Use getByRole as your first-choice query — it tests accessibility and behavior simultaneously.',
    'Use userEvent over fireEvent — it simulates realistic user interactions.',
    'Mock APIs with MSW instead of jest.mock — your fetch() code is actually tested, not bypassed.',
    'For async operations, use findBy* (async query) or waitFor — never arbitrary sleep() calls in tests.'
  ],

  interviewQuestions: [
    { q: 'What is React Testing Library\'s core testing philosophy?', a: 'RTL\'s philosophy is "test behavior, not implementation details" — tests should verify what the user sees and experiences, not how the component works internally. Queries should reflect user-visible content (role, text, label) rather than implementation details (class names, test IDs, internal state values). The goal is tests that break when behavior changes but survive refactors — because if behavior hasn\'t changed, neither should a passing test.' },
    { q: 'What is the difference between getBy*, findBy*, and queryBy* queries in RTL?', a: 'getBy* throws immediately if the element isn\'t found — use for elements that should be present right now. findBy* is async — it retries until the element appears (or times out) — use for elements that appear after async operations (data loading, animations). queryBy* returns null instead of throwing — use specifically for asserting that an element does NOT exist (screen.queryByRole(\'alert\') returns null if no alert is shown).' },
    { q: 'What is Mock Service Worker (MSW) and why is it preferred over jest.mock for API testing?', a: 'MSW intercepts HTTP requests at the network level (using a Service Worker in browsers, or interceptors in Node/test environments). Your actual fetch/Axios code runs normally — MSW simply intercepts the network call and returns a configured response. jest.mock replaces the module entirely, meaning your actual data-fetching code isn\'t tested. MSW tests more code paths (error handling in your fetch wrapper, response parsing, etc.) and keeps tests more realistic — closer to production behavior.' },
    { q: 'How would you test a component that fetches data from an API and shows a loading spinner?', a: 'Render the component inside the MSW-mock environment. Assert the spinner/loading indicator is visible immediately (getByRole(\'status\') or similar). Then await screen.findByText(\'expected data\') — findBy* waits for the async operation to complete and the data to appear. Finally, assert the spinner is gone (screen.queryByRole(\'status\')) returns null). This tests the full lifecycle: loading → data present, which is exactly what a user experiences.' },
    { q: 'How do you test a custom React Hook in isolation?', a: 'Use renderHook from @testing-library/react: const { result } = renderHook(() => useMyHook(initialArgs)). This renders the hook into a minimal component context without needing a real component. Access the hook\'s return value via result.current. For hooks that update state asynchronously, wrap actions in act() or use waitFor() from RTL. For hooks that use timers (like useDebounce), combine with vitest.useFakeTimers() and vi.advanceTimersByTime().' }
  ],

  summary: {
    description: 'Testing React components effectively means testing behavior from the user\'s perspective — what they see (role, text, label queries) and what they do (userEvent interactions) — not internal implementation details. RTL + Vitest/Jest + MSW form the standard toolkit: RTL for components, renderHook for custom hooks, MSW for realistic API mocking that actually tests your fetch code. Write tests that break when behavior changes, survive refactors, and serve as documentation for future developers.'
  },

  furtherReading: [
    { label: 'React Testing Library docs', note: 'testing-library.com/docs/react-testing-library/intro — the canonical RTL docs including which queries to use when.' },
    { label: 'MSW docs', note: 'mswjs.io — the Mock Service Worker documentation for setting up network-level API mocking in tests.' }
  ]
};

export default testingContent;
