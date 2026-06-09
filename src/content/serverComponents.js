const serverComponentsContent = {
  id: 'serverComponents',
  title: 'React Server Components',
  icon: '🖥️',
  theme: 'indigo',
  tagline: 'Components that run only on the server — zero client-side JavaScript, direct database access, and smaller bundles.',
  meta: 'Ecosystem · Modern React',

  whatIsIt: {
    description: [
      'React Server Components (RSC) are a new type of React component that run exclusively on the server — they\'re never sent to the client as JavaScript, never re-render in the browser, and can directly access server-side resources (databases, file systems, server-side APIs) without an extra API layer.',
      'They\'re the default in Next.js 13+ App Router. The resulting HTML is streamed to the browser; only "Client Components" (marked with "use client") include JavaScript that runs in the browser.'
    ],
    points: [
      '"use server" components (Server Components): run on server, have no useState/useEffect, can directly await databases, add zero JS to the client bundle.',
      '"use client" components (Client Components): what you\'ve been writing all along — run in the browser, have state, handle events.',
      'Passing Server Component output as props to Client Components — the "donut" pattern — is the key composition model.',
      'Context, hooks, and browser APIs are only available in Client Components.'
    ],
    code: { title: 'Server Component + Client Component composition', snippet: `// ProductPage.jsx — a Server Component (default in Next.js App Router)
// Runs ONLY on the server. Never ships as JS to the browser.
// Can directly access the database with no API layer needed.
async function ProductPage({ params }) {
  const product = await db.products.findById(params.id); // ✅ direct DB access
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* Pass pre-fetched data to a Client Component that handles interaction */}
      <AddToCartButton product={product} />
    </div>
  );
}

// AddToCartButton.jsx — "use client" marks this as a Client Component
'use client';
function AddToCartButton({ product }) {
  const { dispatch } = useCart(); // ✅ hooks work here — this runs in the browser
  return <button onClick={() => dispatch({ type: 'add', item: product })}>
    Add to Cart
  </button>;
}` },
    analogy: {
      icon: '🍩',
      title: 'Real-World Analogy',
      text: '"Think of a restaurant\'s front-of-house and kitchen. The kitchen (Server Components) does all the heavy prep work — sourcing ingredients (DB queries), cooking the meal (data transformation) — and the result stays in the kitchen until it\'s plated. The waiter (Client Components) only takes the finished plate to the customer\'s table and handles real-time interactions (taking the order for dessert, bringing the bill). The customer never sees the kitchen or its equipment — only the finished dish."'
    }
  },

  whyUsed: {
    description: 'Traditional React apps require an API layer (REST/GraphQL) between the browser and the database — extra code, extra round trips, extra JavaScript in the client bundle. Server Components collapse this: the component itself IS the API. Server-side data fetching + HTML generation, zero client JavaScript for purely-display components, and smaller bundles.',
    points: [
      'Zero JavaScript overhead for server-only components — display-only content doesn\'t add to the client bundle.',
      'Eliminates the API boilerplate layer for many data-fetching patterns — directly query databases, CMS, or internal services.',
      'Naturally enables streaming HTML (combined with Suspense) — faster Time to First Byte and progressive rendering.',
      'Security: server-only data (database credentials, private keys) never touch the client bundle.'
    ]
  },

  whenToUse: {
    description: 'Default to Server Components for any content that doesn\'t need interactivity; reach for "use client" only when you actually need browser-specific features.',
    points: [
      'Data-fetching components that read from a database, CMS, or server-side API — Server Component.',
      'Pure display components (blog posts, product descriptions, stats dashboards) — Server Component.',
      'Components using event handlers (onClick, onChange), state (useState), effects (useEffect), or browser APIs — Client Component.',
      'Context consumers and providers — typically Client Components (context values need to exist in the browser).'
    ],
    analogy: {
      icon: '⚠️',
      title: 'The "use client" boundary',
      text: '"\'use client\' doesn\'t mean \'this file runs only on the client\' — it means \'this is the boundary; this component and all its imports render in the browser\'. Server Components can RENDER Client Components (passing serializable props); Client Components CANNOT import Server Components back (that would send server code to the browser). Data flows one way: server → client."'
    }
  },

  howItWorks: {
    description: 'The server renders Server Components to a special serialized format (React Flight), streams it to the browser, and the client reconstructs the component tree — but only instantiates JavaScript for the Client Component portions. The Server Component output is just HTML and serialized props — no hydration, no JavaScript for those parts.',
    code: {
      title: 'The "donut" composition pattern — server wraps client',
      snippet: `// Pattern: pass SERVER-FETCHED data down to a CLIENT component
// The outer "ring" is server-rendered; the "hole" is a client island

// ServerPage.jsx (Server Component — runs on server only)
async function BlogPage() {
  const posts = await cms.getPosts(); // DB/CMS — fine here; never sent to browser
  return (
    <main>
      <h1>Blog</h1>
      {/* PostList could be a Server Component for static display... */}
      <PostList posts={posts} />
      {/* ...while a Client Component handles interactive likes/bookmarks */}
      <InteractivePostActions postIds={posts.map(p => p.id)} />
    </main>
  );
}

// Server Components can be async — await fetches directly
// Client Components receive the already-fetched data as props
// No waterfall: the server fetches, the client just renders` },
    points: [
      'Server Components can be async functions — await any Promise (database queries, fetch calls) directly.',
      'Props from Server to Client Components must be serializable (strings, numbers, arrays, plain objects) — not functions, class instances, or JSX.',
      'Currently most usable in Next.js App Router — direct usage in raw React requires a supported bundler setup.'
    ]
  },

  flowDiagram: {
    title: 'Request lifecycle with Server Components',
    steps: [
      { icon: '🌐', label: 'User requests /products/42', note: 'HTTP request hits server' },
      { icon: '🖥️', label: 'Server runs ProductPage', note: 'Awaits DB query — no client JS' },
      { icon: '📡', label: 'HTML + React Flight streamed', note: 'Fast TTFB; progressive streaming' },
      { icon: '💧', label: 'Browser hydrates Client Components only', note: 'Server Components are already HTML' },
      { icon: '🖥️', label: 'Interactive parts become active', note: 'Minimal JS — only what "use client" needs' }
    ]
  },

  realWorldExamples: {
    intro: 'RSC shines in frameworks like Next.js App Router:',
    items: [
      { icon: '🛍️', title: 'E-commerce product pages', description: 'Product details, images, descriptions — all Server Components (direct DB, zero client JS). The "Add to Cart" button is a small Client Component. Net result: huge page with minimal client-side JavaScript.' },
      { icon: '📰', title: 'Content/blog platforms', description: 'Entire article content rendered server-side via a CMS query — no client JS for the content itself. Social sharing buttons and comment forms are Client Components.' },
      { icon: '📊', title: 'Dashboards with server-side aggregations', description: 'Complex SQL aggregations (totals, trends, breakdowns) run server-side in the component itself — no REST endpoint needed, results arrive as HTML.' },
      { icon: '🔐', title: 'Authenticated data access', description: 'User-specific data fetched server-side with direct access to auth session and database — no token-passing to the client, no API exposure of private fields.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Zero JavaScript cost for display-only components — directly reduces bundle size.',
      'Eliminates the REST/GraphQL boilerplate layer for many data-fetching patterns.',
      'Enables streaming HTML with Suspense — faster Time to First Byte and progressive rendering.',
      'Server-side secrets (DB credentials, API keys) stay on the server — never in the client bundle.'
    ],
    cons: [
      'Requires a compatible framework (Next.js App Router is the primary production option as of 2025) — not usable in vanilla CRA.',
      'Significant mental model shift from pure CSR React — understanding what can/cannot run where takes time.',
      'No useState, useEffect, or browser APIs in Server Components — understanding the "use client" boundary is critical.',
      'Props from Server → Client must be serializable — no passing functions, class instances, or live React state.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Trying to use useState/useEffect in a Server Component',
        wrong: `// ServerDashboard.jsx (no "use client"):\nfunction Dashboard() { const [count, setCount] = useState(0); // ❌ — throws; Server Components can't use hooks`,
        right: `// Mark it as a Client Component if it needs hooks:\n"use client";\nfunction Dashboard() { const [count, setCount] = useState(0); // ✅ }`,
        note: 'Server Components are not interactive — they run once on the server, produce HTML, and never update. Any component that needs state, effects, or event handlers must be a Client Component ("use client").'
      },
      {
        title: 'Importing a Server Component inside a Client Component',
        wrong: `"use client";\nimport ServerChart from './ServerChart'; // ❌ would bundle server-only code into the client`,
        right: `// Pass the server component\'s output as a prop/children from a Server Component wrapper\n// ServerDashboard.jsx: <ClientShell><ServerChart /></ClientShell>\n// ClientShell.jsx ("use client"): function ClientShell({ children }) { return <>{children}</>; }`,
        note: 'Client Components cannot import Server Components — it would bundle server-side code (e.g. DB drivers) into the browser bundle. Server Components CAN compose Client Components; the reverse is not allowed.'
      },
      {
        title: 'Passing non-serializable data across the Server/Client boundary',
        wrong: `<ClientButton onClick={() => handleServerAction()} /> // ❌ functions aren't serializable across the boundary`,
        right: `// Server Actions (React 19) or passing serializable data only:\n<ClientButton productId={product.id} /> // ✅ primitive, serializable`,
        note: 'Props passed from Server to Client Components travel across a serialization boundary (React Flight). Only JSON-serializable values (strings, numbers, arrays, plain objects, Dates) can cross — not functions, class instances, Maps, Sets, or JSX.'
      }
    ]
  },

  bestPractices: [
    'Default to Server Components; add "use client" only when you actually need browser-specific features (hooks, event handlers, browser APIs).',
    'Keep the "use client" boundary as LOW in the tree as possible — only the interactive island needs it, not its parents.',
    'Pass pre-fetched data as serializable props from Server to Client Components instead of fetching again on the client.',
    'Use React Suspense boundaries around async Server Components for streaming and progressive loading.',
    'Be aware of what ends up in the client bundle — importing a package from a "use client" component includes it in client JS.'
  ],

  interviewQuestions: [
    { q: 'What is the key difference between a Server Component and a Client Component?', a: 'Server Components run exclusively on the server — they can directly access databases, file systems, and server-side services, produce HTML that\'s sent to the browser, and contribute zero JavaScript to the client bundle. They cannot use hooks, handle events, or access browser APIs. Client Components (marked "use client") are what we\'ve always written — they run in the browser, support hooks and event handlers, and their code ships as JavaScript to the client.' },
    { q: 'Why would you use Server Components instead of a traditional REST API + client-side fetch pattern?', a: 'Server Components collapse the API layer — the component itself can directly query the database, removing the round trip and boilerplate of a separate API endpoint. For display-only content, they add zero JavaScript to the client bundle (no hydration, no re-rendering). They also naturally support streaming via Suspense, improving perceived load time. The tradeoff is they require a supported framework (like Next.js App Router) and a new mental model.' },
    { q: 'What is the "use client" boundary, and what happens at it?', a: '"use client" at the top of a file marks that component and all its imports as Client Components — they run in the browser, their code is bundled into client-side JavaScript, and they can use hooks and event handlers. Server Components can render Client Components (passing data as serializable props across the boundary); the reverse — Client Components importing Server Components — is not allowed, as it would bundle server-only code into the browser.' },
    { q: 'What types of props can be passed from a Server Component to a Client Component?', a: 'Only serializable values — strings, numbers, booleans, arrays, plain objects, Dates, and BigInts. These travel across the React Flight serialization boundary. Functions, class instances, Maps, Sets, and JSX cannot be passed directly. If you need to trigger a server-side action from a client component, React 19 introduces "Server Actions" for that purpose.' },
    { q: 'Can a Server Component use useState or useEffect?', a: 'No — useState, useEffect, and all other Hooks require a browser environment and React\'s rendering cycle on the client. Server Components run once on the server and produce static output — there\'s no state to track or lifecycle to hook into. Any component needing these features must be a Client Component (marked "use client"). Trying to use hooks in a Server Component throws an error.' }
  ],

  summary: {
    description: 'React Server Components let components run entirely on the server — directly querying databases, producing HTML, and contributing zero JavaScript to the client bundle. The key mental shift: default to Server Components for data fetching and display; add "use client" only where you need interactivity. Available today in Next.js App Router, they represent React\'s evolving architecture for the performance- and DX-critical cases where the traditional CSR + API split creates unnecessary overhead.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023 and the Next.js App Router docs at nextjs.org/docs for the most complete production-ready RSC documentation.' },
    { label: 'Related topic', note: 'See "Suspense" for streaming RSC output progressively, "Rendering Lifecycle" for how RSC fits into the full rendering pipeline, and "Performance Optimization" for the bundle-size benefits.' }
  ]
};

export default serverComponentsContent;
