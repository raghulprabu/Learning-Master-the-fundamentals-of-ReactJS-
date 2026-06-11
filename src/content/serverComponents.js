const serverComponentsContent = {
  id: 'serverComponents',
  title: 'React Server Components',
  icon: '🖥️',
  theme: 'indigo',
  tagline: 'Server Components run on the server only — no client JavaScript, direct database access, smaller bundles.',
  meta: 'Ecosystem · Modern React',

  whatIsIt: {
    description: [
      'React Server Components (RSC) are components that run only on the server — they are never sent to the browser as JavaScript, and they can directly access databases or files without an extra API.',
      'They are the default in Next.js 13+ App Router. The HTML is streamed to the browser. Only components marked with "use client" include JavaScript that runs in the browser.'
    ],
    points: [
      'Server Components: run on server, no useState/useEffect, can directly await databases, add zero JS to the client.',
      'Client Components ("use client"): the React you already know — run in the browser, have state, handle events.',
      'Pass Server Component output as props to Client Components — called the "donut" pattern.',
      'Context, hooks, and browser APIs only work in Client Components.'
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
      text: '"Think of a restaurant. The kitchen (Server Components) does all the heavy prep — sourcing ingredients (DB queries), cooking the meal (data transformation). The waiter (Client Components) takes the finished plate to the table and handles real-time interactions. The customer never sees the kitchen — only the finished dish."'
    }
  },

  whyUsed: {
    description: 'Traditional React apps need an API layer between the browser and the database. Server Components remove this — the component itself queries the database, adds zero client JS for display-only content, and supports streaming HTML.',
    points: [
      'Zero JavaScript for server-only components — display content does not add to the client bundle.',
      'No API boilerplate needed — directly query databases, CMS, or internal services.',
      'Streaming HTML (with Suspense) — faster Time to First Byte and progressive rendering.',
      'Server secrets (database credentials) never reach the client bundle.'
    ]
  },

  whenToUse: {
    description: 'Default to Server Components for any content that does not need interactivity. Add "use client" only when you need browser features.',
    points: [
      'Data-fetching components that read from a database or CMS — Server Component.',
      'Display-only components (blog posts, product descriptions, stats) — Server Component.',
      'Components using onClick, onChange, useState, useEffect, or browser APIs — Client Component.',
      'Context consumers and providers — typically Client Components.'
    ],
    analogy: {
      icon: '⚠️',
      title: 'The "use client" boundary',
      text: '"\'use client\' marks the boundary — this component and all its imports run in the browser. Server Components can render Client Components (passing serializable props). Client Components CANNOT import Server Components back. Data flows one way: server → client."'
    }
  },

  howItWorks: {
    description: 'The server renders Server Components to a special format (React Flight), streams it to the browser, and the client reconstructs the component tree — but only hydrates JavaScript for the Client Component parts. Server Component output is just HTML and serialized props — no hydration, no JavaScript.',
    code: {
      title: 'The "donut" pattern — server wraps client',
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

// Server Components can be async — await any Promise directly
// Client Components receive the already-fetched data as props` },
    points: [
      'Server Components can be async functions — await databases, fetch calls, or any Promise directly.',
      'Props from Server to Client must be serializable — strings, numbers, arrays, plain objects only. Not functions or class instances.',
      'Most practical today in Next.js App Router — direct use in plain Create React App is not supported.'
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
    intro: 'RSC shines in Next.js App Router:',
    items: [
      { icon: '🛍️', title: 'E-commerce product pages', description: 'Product details and descriptions are Server Components (direct DB, zero client JS). The "Add to Cart" button is a small Client Component.' },
      { icon: '📰', title: 'Content platforms', description: 'Full article content rendered server-side from a CMS — no client JS for the content itself. Social sharing buttons are Client Components.' },
      { icon: '📊', title: 'Server-side dashboards', description: 'Complex SQL aggregations run server-side in the component itself — no REST endpoint needed, results arrive as HTML.' },
      { icon: '🔐', title: 'Authenticated data access', description: 'User-specific data fetched server-side with direct access to auth session — no token-passing to the client.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Zero JavaScript cost for display-only components — directly reduces bundle size.',
      'Removes the REST/GraphQL boilerplate layer for many data-fetching patterns.',
      'Streaming HTML with Suspense — faster Time to First Byte and progressive rendering.',
      'Server secrets (DB credentials, API keys) never touch the client bundle.'
    ],
    cons: [
      'Requires a compatible framework — Next.js App Router is the main option as of 2025.',
      'Big mental model shift from pure client-side React — takes time to understand what runs where.',
      'No useState, useEffect, or browser APIs in Server Components.',
      'Props from Server to Client must be serializable — functions and class instances cannot cross.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Trying to use useState/useEffect in a Server Component',
        wrong: `// No "use client" at the top:\nfunction Dashboard() { const [count, setCount] = useState(0); // ❌ throws`,
        right: `'use client'; // ✅ add this at the top to make it a Client Component\nfunction Dashboard() { const [count, setCount] = useState(0); }`,
        note: 'Server Components run once on the server and produce HTML — they never update. Any component that needs state, effects, or event handlers must be a Client Component.'
      },
      {
        title: 'Importing a Server Component inside a Client Component',
        wrong: `'use client';\nimport ServerChart from './ServerChart'; // ❌ bundles server-only code into the client`,
        right: `// Pass the Server Component output as children from a parent Server Component\n// ServerDashboard.jsx: <ClientShell><ServerChart /></ClientShell>`,
        note: 'Client Components cannot import Server Components — it would bundle server-side code into the browser. Server Components CAN compose Client Components, not the reverse.'
      },
      {
        title: 'Passing non-serializable data across the Server/Client boundary',
        wrong: `<ClientButton onClick={() => handleServerAction()} /> // ❌ functions are not serializable`,
        right: `<ClientButton productId={product.id} /> // ✅ primitive value — serializable`,
        note: 'Props passed from Server to Client Components must be JSON-serializable. Functions, class instances, Maps, and Sets cannot cross this boundary.'
      }
    ]
  },

  bestPractices: [
    'Default to Server Components. Add "use client" only when you actually need browser features.',
    'Keep the "use client" boundary as low in the tree as possible — only the interactive part needs it.',
    'Pass pre-fetched data as serializable props from Server to Client Components.',
    'Use Suspense boundaries around async Server Components for streaming.',
    'Check what ends up in the client bundle — every import of a "use client" component includes it in the browser JS.'
  ],

  interviewQuestions: [
    { q: 'What is the key difference between a Server Component and a Client Component?', a: 'Server Components run only on the server — they query databases directly, produce HTML, and add zero JavaScript to the client bundle. They cannot use hooks or handle events. Client Components (marked "use client") are the React you already know — they run in the browser, support hooks and event handlers, and their code ships as JavaScript to the client.' },
    { q: 'Why use Server Components instead of a REST API + client-side fetch?', a: 'Server Components remove the extra API layer — the component itself queries the database, saving a network round trip and boilerplate code. Display-only components add zero client JavaScript. They also support streaming via Suspense for better perceived load time. The trade-off is they require Next.js App Router or a compatible framework.' },
    { q: 'What is the "use client" boundary?', a: '"use client" at the top of a file marks that component and all its imports as Client Components — they run in the browser, their code is bundled as JavaScript, and they can use hooks and event handlers. Server Components can render Client Components (passing serializable props). Client Components cannot import Server Components — it would bundle server-only code into the browser.' },
    { q: 'What types of props can be passed from a Server Component to a Client Component?', a: 'Only serializable values — strings, numbers, booleans, arrays, plain objects. These cross the React Flight serialization boundary. Functions, class instances, Maps, Sets, and JSX cannot be passed directly.' },
    { q: 'Can a Server Component use useState or useEffect?', a: 'No. Hooks require a browser environment and React\'s client rendering cycle. Server Components run once on the server and produce static output — there is no state to track or lifecycle to run. Any component needing hooks must be a Client Component marked with "use client".' }
  ],

  summary: {
    description: 'React Server Components let components run entirely on the server — querying databases, producing HTML, and contributing zero JavaScript to the client bundle. Default to Server Components for data fetching and display. Add "use client" only where you need interactivity. Available today in Next.js App Router.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'nextjs.org/docs/app/building-your-application/rendering/server-components — most complete production RSC documentation.' },
    { label: 'Related topic', note: 'See "Suspense" for streaming RSC output, and "Performance Optimization" for the bundle-size benefits.' }
  ]
};

export default serverComponentsContent;
