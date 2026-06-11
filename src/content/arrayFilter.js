const arrayFilterContent = {
  id: 'arrayFilter',
  title: 'Array.filter() — Searching & Filtering in React',
  icon: '🧹',
  theme: 'emerald',
  tagline: 'Use Array.filter() to show only the items that match a search or category — no extra state needed.',
  meta: 'Patterns · Arrays · Worked Example',

  whatIsIt: {
    description: [
      'Array.filter() creates a new array with only the elements that pass a test function. It never changes the original array.',
      'In React, you keep the full list in state and the search text in state, then derive the visible subset with .filter() during render — no separate filtered-list state needed.'
    ],
    points: [
      'Syntax: const filtered = array.filter(item => /* return true to keep */);',
      'Returns a new array — the original is untouched.',
      'Chain with .map() and .sort() to build a full search-filter-render pipeline.'
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
      text: '"Picture a coin sorter. You pour in a jar of mixed coins (your full array). It asks one yes/no question of every coin — \'are you a quarter?\' — letting quarters fall into a new tray while everything else is set aside. The original jar is never altered."'
    }
  },

  whyUsed: {
    description: '.filter() gives you a clean, declarative way to derive "the subset I care about right now" from a larger dataset — exactly the shape of every search and filter feature.',
    points: [
      'Declarative — describe what should remain, not how to loop manually.',
      'Pure and non-mutating — returns a new array, leaves the original unchanged.',
      'Chains naturally with .map(), .sort(), and .slice().',
      'Eliminates bugs that come from mutating arrays in loops.'
    ]
  },

  whenToUse: {
    description: 'Use .filter() any time the UI should show a subset of data based on criteria that can change.',
    points: [
      'Live search boxes — show items whose name matches the typed query.',
      'Category or status filters — "Show: Electronics / All".',
      'Dashboard tables — filter rows by date range, region, or status.',
      'Permission logic — show only items the current user can see.'
    ],
    analogy: {
      icon: '💡',
      title: 'The "derive, don\'t duplicate" principle',
      text: '"A common beginner mistake is creating a SEPARATE piece of state for \'the filtered list\' and using useEffect to sync it. Do not do this — it creates two sources of truth that can drift. Keep only the raw data and the search criteria in state. Compute the filtered list fresh on every render with .filter(). It is simpler and always correct."'
    }
  },

  howItWorks: {
    description: '.filter() walks through every element, calls your test function once per element, and builds a new array from the ones that returned true. Combined with state for the data and query, this creates a live search with no extra state.',
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
      '.filter() is fast — rarely a performance concern for lists up to a few thousand items.',
      'Chain multiple .filter() calls — one per criterion — for readable, independent conditions.',
      'Wrap in useMemo only after profiling shows it is genuinely slow.'
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
    intro: 'The "keep raw data + criteria in state, derive the view with .filter()" pattern appears everywhere:',
    items: [
      { icon: '🛍️', title: 'E-commerce product search', description: 'Search text plus sidebar category checkboxes — multiple chained .filter() calls narrow down a catalog.' },
      { icon: '👥', title: 'Filtering user lists', description: 'Admin dashboards filter a table by name, role, and status using combined text search and dropdowns.' },
      { icon: '📊', title: 'Dashboard tables', description: 'Filter rows by date range, status, or region using active filter chips — each chip adds a .filter() condition.' },
      { icon: '✅', title: 'Todo list views', description: 'The classic "All / Active / Completed" toggle — three different .filter() predicates over the same array.' },
      { icon: '🔖', title: 'Tag-based filtering', description: 'Show only items containing selected tags: .filter(item => selectedTags.every(tag => item.tags.includes(tag))).' }
    ]
  },

  prosAndCons: {
    pros: [
      'Declarative and readable — code reads like the requirement.',
      'Pure and non-mutating — matches React\'s "derive during render" philosophy.',
      'Composable — chains naturally with .map() and .sort().',
      'No extra state to manage — the filtered view is always accurate.'
    ],
    cons: [
      'Recomputes the full array on every render — can be slow for very large datasets.',
      'Chaining many .filter() calls makes multiple passes — usually fine.',
      'Returns a new reference every render — can defeat React.memo on children.',
      'Easy to write a wrong predicate that silently shows or hides the wrong items.'
    ]
  },

  comparison: {
    title: '"Filtered list as state" vs. "derived during render"',
    intro: 'Building a search box for a list of users:',
    left: {
      title: '😕 Anti-pattern — separate state + useEffect',
      tone: 'bad',
      code: `const [users, setUsers] = useState(allUsers);
const [query, setQuery] = useState('');
const [filteredUsers, setFilteredUsers] = useState(allUsers); // ❌ extra state

useEffect(() => {
  setFilteredUsers(users.filter(u => u.name.includes(query))); // ❌ extra render + sync risk
}, [users, query]);`,
      note: 'Two sources of truth — easy to miss a dependency, causes an extra render, can briefly show stale results.'
    },
    right: {
      title: '✅ Idiomatic — derive directly during render',
      tone: 'good',
      code: `const [users, setUsers] = useState(allUsers);
const [query, setQuery] = useState('');

// No extra state. Always correct. Always in sync. One render.
const filteredUsers = users.filter(u =>
  u.name.toLowerCase().includes(query.trim().toLowerCase())
);`,
      note: 'One source of truth — the filtered view is computed, always consistent, with zero risk of drift.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Storing the filtered result in state and syncing with useEffect',
        wrong: `const [filtered, setFiltered] = useState([]);\nuseEffect(() => { setFiltered(items.filter(predicate)); }, [items, query]); // ❌ unnecessary state`,
        right: `const filtered = items.filter(predicate); // ✅ just derive it — no state, no effect`,
        note: 'If a value can be computed from existing state during render, it should be. Never mirror it into separate state with useEffect.'
      },
      {
        title: 'Case-sensitive or whitespace-sensitive comparisons',
        wrong: `items.filter(item => item.name.includes(query)); // ❌ "Mouse" won't match "mouse" or " mouse "`,
        right: `items.filter(item =>\n  item.name.toLowerCase().includes(query.trim().toLowerCase())\n); // ✅ normalizes both sides`,
        note: 'Real users type with mixed case and extra spaces. Normalize both sides before comparing or the search feels broken.'
      },
      {
        title: 'Mutating the array while filtering manually',
        wrong: `const result = [];\nfor (const item of items) {\n  if (test(item)) items.splice(items.indexOf(item), 1); // ❌ mutates mid-iteration\n}`,
        right: `const result = items.filter(test); // ✅ always safe — returns a fresh array`,
        note: 'Mutating an array while iterating it causes skipped elements and subtle bugs. .filter() always returns a fresh array and sidesteps the problem.'
      },
      {
        title: 'Not handling the "no results" empty state',
        wrong: `<ul>{filtered.map(item => <li key={item.id}>{item.name}</li>)}</ul>\n{/* ❌ shows a silently empty <ul> when nothing matches */}`,
        right: `{filtered.length === 0\n  ? <p>No results match "{query}".</p>\n  : <ul>{filtered.map(item => <li key={item.id}>{item.name}</li>)}</ul>} {/* ✅ */}`,
        note: 'An empty list with no message looks broken to users. Always show an explicit empty-state message.'
      }
    ]
  },

  bestPractices: [
    'Derive filtered lists during render — never store them in separate state with useEffect.',
    'Normalize both sides of a text comparison with .toLowerCase().trim().',
    'Pair a fast-changing search input with debouncing when filtering triggers an API call or very large list.',
    'Wrap in useMemo only after profiling shows genuine slowness.',
    'Always design and test the empty-results state — it is part of the feature.'
  ],

  interviewQuestions: [
    { q: 'What does Array.prototype.filter() do, and how is it different from .map() and .forEach()?', a: '.filter() returns a new array containing only the elements that pass a test function — it changes which items are included. .map() returns a new array of the same length but transforms each element. .forEach() returns nothing — it is used only for side effects. In short: filter = "which ones?", map = "turned into what?", forEach = "do something with each".' },
    { q: 'Why is it better to compute the filtered list during render rather than storing it in state?', a: 'Storing it creates a second source of truth that must be kept in sync — typically via useEffect, which adds an extra render and risks the two drifting apart. Deriving it during render with items.filter(predicate) guarantees it is always perfectly consistent with the current data and criteria, with less code and no sync bugs.' },
    { q: 'Why does .filter() never mutate the original array, and why does that matter in React?', a: '.filter() always builds and returns a brand-new array, leaving the original untouched. This matters in React because state must never be mutated directly. Using non-mutating methods like .filter() and .map() is what makes "derive a new array from state" safe and idiomatic.' },
    { q: 'How would you implement a search box that feels natural to real users?', a: 'Keep the raw products and the search query in state, then derive the visible list: products.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase())). Normalizing both sides with .toLowerCase().trim() makes the search case-insensitive and forgiving of extra spaces.' },
    { q: 'When would filtering on every render become a performance concern?', a: 'For very large arrays (tens of thousands of items) or predicates that do expensive per-item work. The fix is to wrap the derivation in useMemo(() => items.filter(predicate), [items, query]) so it is skipped unless its actual dependencies change. Always measure with the Profiler before adding useMemo.' }
  ],

  summary: {
    description: '.filter() is the clean, non-mutating way to derive the visible subset from a larger dataset. Keep raw data and criteria in state, compute the filtered view during render, normalize comparisons, and always design an empty state. Add useMemo only when profiling proves it is needed.'
  },

  furtherReading: [
    { label: 'Related topic', note: 'See "Debouncing in React" for pairing a live search input with .filter() without firing on every keystroke.' },
    { label: 'Related topic', note: 'See "useMemo" for when to memoize an expensive .filter() pipeline over large datasets.' },
    { label: 'Related topic', note: 'See "Lists and Keys" for rendering the filtered array correctly with stable key props.' }
  ]
};

export default arrayFilterContent;
