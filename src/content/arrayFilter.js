const arrayFilterContent = {
  id: 'arrayFilter',
  title: 'Array.filter() — Searching & Filtering in React',
  icon: '🧹',
  theme: 'emerald',
  tagline: 'Build live search boxes, product filters, and dashboard views by deriving filtered lists during render.',
  meta: 'Patterns · Arrays · Worked Example',

  whatIsIt: {
    description: [
      'Array.prototype.filter() is a built-in JavaScript array method that creates a *brand-new array* containing only the elements for which a given test function returns true. It never modifies the original array — it always returns a fresh one.',
      'In React, .filter() is the workhorse behind nearly every "search box", "category filter", or "show only active items" feature: you keep the *full* dataset in state, keep the *search/filter criteria* in state, and *derive* the visible subset during render with .filter() — no extra state needed for "the filtered list" itself.'
    ],
    points: [
      'Syntax: const filtered = array.filter((item, index, arr) => /* return true to KEEP this item */);',
      'Returns a new array — the original is untouched (a "non-mutating" / pure operation, exactly what React\'s rendering model wants).',
      'Often chained with .map() (transform what you keep) and .sort() (order what you keep) to build a full "search → filter → sort → render" pipeline.'
    ],
    code: { title: 'The basic shape', snippet: `const products = [
  { id: 1, name: 'Wireless Mouse',  category: 'Electronics', price: 25, inStock: true  },
  { id: 2, name: 'Office Chair',    category: 'Furniture',   price: 120, inStock: false },
  { id: 3, name: 'Mechanical Keyboard', category: 'Electronics', price: 80, inStock: true },
];

const inStockOnly = products.filter(p => p.inStock);
// → [{ id:1, name:'Wireless Mouse', ... }, { id:3, name:'Mechanical Keyboard', ... }]
// 'Office Chair' is EXCLUDED — the test (p.inStock) returned false for it.
// 'products' itself is completely unchanged.` },
    analogy: {
      icon: '🪙',
      title: 'Real-World Analogy',
      text: '"Picture a coin sorter: you pour a mixed jar of coins (your full array) onto the machine, and it asks ONE yes/no question of every single coin — \'are you a quarter?\' — letting quarters fall into a new tray (the new array) while everything else is set aside untouched. The original jumbled jar is never altered; you simply end up with a brand-new, smaller pile containing only the coins that passed the test."'
    }
  },

  whyUsed: {
    description: '.filter() gives you a clean, declarative, and predictable way to derive "the subset I care about right now" from a larger dataset — which is *exactly* the shape of nearly every search/filter feature: "show me the products matching my search text", "show me only the completed todos", "show me users in the Engineering department".',
    points: [
      'Declarative: you describe *what* should remain ("items whose name includes my search text"), not *how* to loop and build a new array by hand.',
      'Pure & non-mutating: returns a new array, leaving the original untouched — a perfect match for React\'s "never mutate state directly" rule.',
      'Composable: chains naturally with .map(), .sort(), .slice() to build full data-transformation pipelines in a single, readable expression.',
      'Eliminates a whole category of bugs that come from manually mutating arrays (push/splice) inside loops while iterating them.'
    ]
  },

  whenToUse: {
    description: 'Reach for .filter() — computed fresh during render — anytime the UI should show a *subset* of data based on some criteria that can change (search text, selected category, toggle switches, date ranges).',
    points: [
      'Live search boxes: showing only items whose name/description matches the typed query.',
      'Category/tag/status filters: "Show: [ ] Electronics [ ] Furniture" or "Status: Active / Completed / All".',
      'Dashboards & tables: filtering rows by date range, region, owner, or any combination of active filter chips.',
      'Permission/visibility logic: showing only the items the current user is allowed to see or act on.'
    ],
    analogy: {
      icon: '💡',
      title: 'The "derive, don\'t duplicate" principle',
      text: '"A very common beginner instinct is to create a SEPARATE piece of state for \'the filtered list\' and useEffect to keep it in sync with the search text. Don\'t — that\'s two sources of truth that can drift out of sync, plus an extra render. Instead, keep only the RAW data and the search/filter criteria in state, and compute the filtered list fresh on every render with .filter(). It\'s simpler, always consistent, and — for all but enormous datasets — plenty fast."'
    }
  },

  howItWorks: {
    description: '.filter() walks through every element of the array, calls your test function once per element, and builds a new array containing only the elements where that function returned a truthy value. Combined with React state for the raw data and the search query, this becomes a tiny, self-contained "search engine" computed fresh on every render.',
    code: {
      title: 'A complete live-search feature — the canonical pattern',
      snippet: `function ProductSearch({ products }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  // 🔑 DERIVED during render — no extra state, always in sync, always correct
  const visibleProducts = products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option>All</option><option>Electronics</option><option>Furniture</option>
      </select>

      {visibleProducts.length === 0
        ? <p>No products match "{query}".</p>
        : <ul>{visibleProducts.map(p => <li key={p.id}>{p.name} — \${p.price}</li>)}</ul>}
    </>
  );
}`
    },
    points: [
      'The filtered list is recomputed on every render — but since .filter() is fast (O(n)) and React only re-renders when state changes, this is rarely a performance concern for lists up to a few thousand items.',
      'Chaining multiple .filter() calls (one per criterion) keeps each condition readable in isolation — or combine them into one test with && for a single pass over the array.',
      'For genuinely large datasets or expensive per-item tests, wrap the derivation in useMemo so it\'s skipped on renders where neither `products`, `query`, nor `category` changed.'
    ]
  },

  flowDiagram: {
    title: 'From keystroke to filtered list, on every render',
    steps: [
      { icon: '⌨️', label: 'User types in search box', note: 'setQuery("key") triggers re-render' },
      { icon: '🔁', label: 'Component re-renders', note: 'Latest `query` and `products` available' },
      { icon: '🧹', label: '.filter() runs fresh', note: 'Tests every product against the query' },
      { icon: '📋', label: 'New array returned', note: 'Only matching products remain' },
      { icon: '🖼️', label: 'UI renders the subset', note: '.map() turns it into <li> elements' }
    ]
  },

  realWorldExamples: {
    intro: 'This exact "keep raw data + criteria in state, derive the view with .filter()" pattern appears constantly:',
    items: [
      { icon: '🛍️', title: 'E-commerce product search & category filters', description: 'Amazon-style "Search within results" + sidebar category checkboxes — multiple .filter() calls chained to narrow down a large catalog to exactly what the shopper wants.' },
      { icon: '👥', title: 'Filtering user/member lists', description: 'Admin dashboards that filter a user table by name, role, status (active/invited/suspended), or department — often combining a text search with several dropdown filters.' },
      { icon: '📊', title: 'Dashboard tables & data grids', description: 'Filtering rows of orders, transactions, or logs by date range, status, region, or any combination of active "filter chips" — each chip simply adds another .filter() condition.' },
      { icon: '✅', title: 'Todo / task list views', description: 'The classic "All / Active / Completed" filter toggle — three different .filter() predicates over the same underlying todos array, switched by a single piece of state.' },
      { icon: '🔖', title: 'Tag- and label-based filtering', description: 'Blog post or issue-tracker views that show only items containing one or more selected tags — .filter(item => selectedTags.every(tag => item.tags.includes(tag))).' }
    ]
  },

  prosAndCons: {
    pros: [
      'Declarative and highly readable — the code reads almost like the requirement ("keep products whose name includes the query").',
      'Pure and non-mutating — perfectly matches React\'s "derive during render, never mutate state" philosophy; impossible to get the original data corrupted.',
      'Composable — chains naturally with .map()/.sort()/.slice() into a single, fluent data pipeline.',
      'No extra state to manage or keep in sync — the filtered view is always a perfectly accurate reflection of the current data + criteria.'
    ],
    cons: [
      'Recomputes the full pass over the array on every render — can become a measurable cost for very large datasets (tens of thousands+ of rows) with expensive per-item tests.',
      'Chaining many .filter() calls makes multiple full passes over the array — usually fine, but a single combined predicate (or a .reduce()) can be more efficient for hot paths.',
      'Returns a NEW array reference every render — passing it directly to a memoized child (React.memo) will defeat that memoization unless wrapped in useMemo.',
      'Easy to write a subtly-wrong predicate (case sensitivity, untrimmed whitespace, missing null-checks) that silently hides or shows the wrong items.'
    ]
  },

  comparison: {
    title: '"Filtered list as state" vs. "filtered list derived during render"',
    intro: 'Building a search box for a list of users:',
    left: {
      title: '😕 Anti-pattern — separate state + useEffect to sync it',
      tone: 'bad',
      code: `const [users, setUsers] = useState(allUsers);
const [query, setQuery] = useState('');
const [filteredUsers, setFilteredUsers] = useState(allUsers); // ❌ extra state

useEffect(() => {
  setFilteredUsers(users.filter(u => u.name.includes(query))); // ❌ extra render + sync risk
}, [users, query]);`,
      note: 'Two sources of truth that must be kept in sync manually — easy to forget a dependency, causes an extra render, and can briefly show stale results.'
    },
    right: {
      title: '✅ Idiomatic — derive it directly during render',
      tone: 'good',
      code: `const [users, setUsers] = useState(allUsers);
const [query, setQuery] = useState('');

// No extra state. Always correct. Always in sync. One render.
const filteredUsers = users.filter(u =>
  u.name.toLowerCase().includes(query.trim().toLowerCase())
);`,
      note: 'One source of truth (users + query); the filtered view is simply *computed*, guaranteed consistent, with zero risk of drift.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Storing the filtered result in state and syncing it with useEffect',
        wrong: `const [filtered, setFiltered] = useState([]);\nuseEffect(() => { setFiltered(items.filter(predicate)); }, [items, query]); // ❌ unnecessary state + extra render`,
        right: `const filtered = items.filter(predicate); // ✅ just derive it — no state, no effect, no sync bugs`,
        note: 'If a value can be computed from existing props/state during render, it should be — not stored as its own state. This is the single most common React anti-pattern around filtering ("You Might Not Need an Effect").'
      },
      {
        title: 'Case-sensitive or whitespace-sensitive comparisons',
        wrong: `items.filter(item => item.name.includes(query)); // ❌ "Mouse" won't match a search for "mouse" or " mouse "`,
        right: `items.filter(item =>\n  item.name.toLowerCase().includes(query.trim().toLowerCase())\n); // ✅ normalizes both sides before comparing`,
        note: 'Real users type inconsistently — mixed case, leading/trailing spaces. Normalize both the haystack and the needle the same way before comparing, or the search will feel "broken" for common input.'
      },
      {
        title: 'Mutating the array while "filtering" it manually',
        wrong: `const result = [];\nfor (const item of items) {\n  if (test(item)) items.splice(items.indexOf(item), 1); // ❌ mutates the array mid-iteration — chaos\n}`,
        right: `const result = items.filter(test); // ✅ .filter() never touches the original array — always safe`,
        note: 'Manually mutating an array (push/splice/sort in place) while iterating it is a classic source of skipped elements and subtle bugs. .filter() sidesteps the entire problem by always returning a fresh array.'
      },
      {
        title: 'Not handling the "no results" / empty-array case in the UI',
        wrong: `<ul>{filtered.map(item => <li key={item.id}>{item.name}</li>)}</ul>\n{/* ❌ shows a silently empty <ul> when nothing matches — looks broken */}`,
        right: `{filtered.length === 0\n  ? <p>No results match "{query}".</p>\n  : <ul>{filtered.map(item => <li key={item.id}>{item.name}</li>)}</ul>} {/* ✅ */}`,
        note: 'An empty list with no explanation reads as "broken" to users. Always render explicit empty-state messaging — it\'s a small touch that meaningfully improves perceived quality.'
      }
    ]
  },

  bestPractices: [
    'Derive filtered/searched lists directly during render — never mirror them into separate state with useEffect ("You Might Not Need an Effect").',
    'Normalize both sides of a text comparison the same way (.toLowerCase().trim()) so search feels forgiving and natural to real users.',
    'Pair a fast-changing search input with debouncing (see "Debouncing in React") when filtering triggers something expensive — an API call, or filtering tens of thousands of rows.',
    'Wrap the derivation in useMemo only after profiling shows it\'s genuinely slow — for most lists (hundreds to a few thousand items), plain .filter() on every render is plenty fast.',
    'Always design and test the empty-results state — "No items match your search" is part of the feature, not an afterthought.',
    'Combine multiple criteria with a single composed predicate (or chained .filter() calls) — keep each condition small, named, and independently readable/testable.'
  ],

  interviewQuestions: [
    { q: 'What does Array.prototype.filter() do, and how is it different from .map() and .forEach()?', a: '.filter() takes a test function and returns a NEW array containing only the elements for which that function returned a truthy value — it changes the LENGTH/membership of the collection but not the shape of each element. .map() also returns a new array of the same length, but TRANSFORMS each element rather than including/excluding it. .forEach() returns nothing (undefined) — it\'s used purely for side effects, not for producing a derived array. In short: .filter() = "which ones?", .map() = "turned into what?", .forEach() = "do something with each".' },
    { q: 'In a React search/filter feature, why is it usually better to compute the filtered list during render rather than storing it in its own state?', a: 'If the filtered list can be derived from existing state (the raw data + the search criteria), storing it separately creates a second source of truth that must be manually kept in sync — typically via useEffect, which adds an extra render and a real risk of the two drifting apart (e.g. if a dependency is missed). Deriving it directly during render — `const filtered = items.filter(predicate)` — guarantees it\'s always perfectly consistent with the current data and criteria, with less code and no synchronization bugs. This is a specific case of the general "you might not need an Effect" guidance.' },
    { q: 'Why does .filter() never mutate the original array, and why does that matter in React?', a: '.filter() always builds and returns a brand-new array, leaving the original completely untouched — it\'s a "pure"/non-mutating operation. This matters enormously in React because state must never be mutated directly (React detects changes by comparing references) — using non-mutating array methods like .filter(), .map(), and the spread operator is what makes "derive a new array from state" both safe and idiomatic.' },
    { q: 'How would you implement a search box that filters a list of products by name, in a way that feels natural to real users?', a: 'Keep the raw products and the search query in state, then derive the visible list with something like `products.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()))`. Normalizing both sides with .toLowerCase().trim() ensures the search is case-insensitive and forgiving of stray whitespace — small details that make the feature feel polished rather than finicky. For large datasets or when filtering triggers an API call, you\'d typically pair this with debouncing the query.' },
    { q: 'When would filtering on every render become a performance concern, and how would you address it?', a: 'For very large arrays (tens of thousands of items) or predicates that do expensive per-item work (deep comparisons, regex, nested lookups), recomputing the filter on every render — including renders triggered by unrelated state changes — can become measurably slow. The fix is to wrap the derivation in useMemo(() => items.filter(predicate), [items, query]) so it\'s skipped unless its actual dependencies change — but this should be a deliberate response to *measured* slowness (via the Profiler), not a reflexive default, since useMemo has its own (usually larger, for small lists) overhead.' }
  ],

  summary: {
    description: '.filter() is the clean, declarative, non-mutating way to derive "the subset that matters right now" from a larger dataset — and that derivation pattern (raw data + criteria in state, filtered view computed during render) is the backbone of nearly every search box, category filter, and dashboard view in React. Keep it simple: one source of truth, normalized comparisons, a thoughtful empty state, and useMemo only when profiling proves it\'s needed.'
  },

  furtherReading: [
    { label: 'Related topic', note: 'See "Debouncing in React" for how to pair a live search input with .filter() (or an API call) without firing on every keystroke.' },
    { label: 'Related topic', note: 'See "useMemo" for when and how to memoize an expensive .filter()/.sort() pipeline over large datasets.' },
    { label: 'Related topic', note: 'See "Lists and Keys" for rendering the resulting filtered array correctly with stable, unique `key` props.' }
  ]
};

export default arrayFilterContent;
