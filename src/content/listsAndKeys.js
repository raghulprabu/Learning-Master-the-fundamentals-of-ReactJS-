const listsAndKeys = {
  id: 'listsAndKeys',
  title: 'Lists and Keys',
  icon: '📋',
  theme: 'cyan',
  tagline: 'Rendering collections of data efficiently — and helping React track each item across re-renders with keys.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Rendering "lists" means turning an array of data into an array of JSX elements — typically with Array.prototype.map(). "Keys" are special string props you give each item in that list so React can uniquely identify it across renders.',
      'Keys are not visible in the UI and aren\'t passed to your component as a prop — they are metadata React uses internally for its reconciliation (diffing) algorithm.'
    ],
    points: [
      '.map() transforms an array of data into an array of elements: items.map(item => <li key={item.id}>{item.name}</li>).',
      'Keys must be unique *among siblings* (not globally unique across the whole app).',
      'Good keys come from your data — a database id, a slug, an order number — not from the array index.'
    ],
    analogy: {
      icon: '🎫',
      title: 'Real-World Analogy',
      text: '"Keys are like name tags at a conference. Without tags, if people swap seats, the organizer (React) can\'t tell who moved where — it might think someone left and a stranger arrived. With name tags (stable keys), the organizer instantly knows: \'oh, Asha just moved from seat 3 to seat 7\' — and can update the seating chart efficiently instead of reprinting it from scratch."'
    }
  },

  whyUsed: {
    description: 'Apps constantly render collections — product grids, comment threads, todo lists, search results, table rows. Keys exist purely so React\'s diffing algorithm can do this efficiently and correctly.',
    points: [
      'Without keys, React falls back to comparing items by position — which breaks badly when items are reordered, inserted, or removed.',
      'With stable keys, React can detect "this exact item moved from position 2 to position 5" and simply move its DOM node and state, instead of destroying and recreating it.',
      'Correct keys prevent subtle bugs: form inputs retaining the wrong value, animations replaying incorrectly, component state "leaking" onto the wrong row.'
    ]
  },

  whenToUse: {
    description: 'Any time you render an array of similar elements with .map() (or similar), every top-level element in that array needs a `key`.',
    points: [
      'Lists of cards, table rows, comments, chat messages, search results, navigation items.',
      'Any dynamically-generated set of sibling elements — even if there\'s currently only one item, if it *can* become a list, plan for keys from day one.',
      'Nested lists: each level of nested .map() needs its own keys, scoped to its own siblings.'
    ]
  },

  howItWorks: {
    description: 'When React re-renders a list, it uses keys to match new elements to old ones. A matched element keeps its DOM node and internal state and simply gets updated; an unmatched old element is removed, and an unmatched new element is created fresh.',
    code: {
      title: 'Rendering a list correctly',
      snippet: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.done} readOnly />
          <span>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
}

// todos = [
//   { id: 'a1', text: 'Learn React', done: true },
//   { id: 'b2', text: 'Build a project', done: false },
// ]`
    },
    points: [
      'The key goes on the outermost element returned inside the .map() callback — not on its children.',
      'Keys only need to be unique among siblings produced by the *same* .map() call — two different lists can reuse the same key values safely.',
      'If your data genuinely has no stable id, generate one when the data is created (e.g. crypto.randomUUID()) — not at render time.'
    ]
  },

  flowDiagram: {
    title: 'How keys help React reconcile a re-ordered list',
    steps: [
      { icon: '📜', label: 'Old list', note: '[A(key=1), B(key=2), C(key=3)]' },
      { icon: '🔀', label: 'New order arrives', note: '[C(key=3), A(key=1), B(key=2)]' },
      { icon: '🔑', label: 'React matches by key', note: 'Same elements, new positions' },
      { icon: '🚚', label: 'DOM nodes are moved', note: 'Not destroyed & recreated' },
      { icon: '✅', label: 'State & focus preserved', note: 'Inputs keep their values' }
    ]
  },

  realWorldExamples: {
    intro: 'Lists and keys show up in essentially every data-driven screen:',
    items: [
      { icon: '🛍️', title: 'Product / search-result grids', description: 'Each <ProductCard key={product.id} /> keeps its own image-load state and animations stable as filters change the order.' },
      { icon: '💬', title: 'Chat / comment threads', description: 'New messages append to the list; keyed by message id so existing messages don\'t flicker or lose scroll position.' },
      { icon: '📊', title: 'Sortable data tables', description: 'Clicking a column header re-orders rows — stable keys let React smoothly animate/move rows instead of re-mounting the entire table.' },
      { icon: '✅', title: 'Todo apps', description: 'Each <TodoItem key={todo.id} /> retains its own "editing" state correctly even as items are completed, deleted, or reordered.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Enables React to update lists efficiently — minimal DOM operations, smoother UI.',
      'Preserves component state and input focus correctly across re-orders/insertions/removals.',
      'Makes list-heavy UIs (feeds, tables, grids) feel fast and "just work" correctly.'
    ],
    cons: [
      'Choosing the *wrong* key (like array index) can silently cause bugs that only appear when items are reordered/removed — easy to miss in testing.',
      'Generating new keys on every render (e.g. Math.random() or Date.now() inline) defeats the purpose entirely and hurts performance.',
      'Requires your data to have (or be given) a stable, unique identifier — not always trivial for ad-hoc/derived lists.'
    ]
  },

  comparison: {
    title: 'Stable ID vs. array index as a key',
    intro: 'This is the single most common "key" mistake — understanding why index keys are risky will save you real debugging time:',
    left: {
      title: '✅ Stable ID from your data',
      tone: 'good',
      code: `{todos.map(todo => (
  <TodoItem key={todo.id} todo={todo} />
))}`,
      note: 'Each item keeps its identity (and state) no matter how the list is sorted, filtered, or mutated.'
    },
    right: {
      title: '❌ Array index as key',
      tone: 'bad',
      code: `{todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
))}`,
      note: 'Works fine for static lists that never reorder/insert/delete — but breaks subtly the moment they do (wrong item gets the wrong state).'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Using the array index as a key for dynamic lists',
        wrong: `{comments.map((c, i) => <Comment key={i} data={c} />)}\n// ❌ deleting comment #1 makes every later comment "shift" keys`,
        right: `{comments.map(c => <Comment key={c.id} data={c} />)}\n// ✅ each comment keeps its identity no matter what changes`,
        note: 'When an item is removed/inserted/reordered, index-based keys cause React to match the wrong old element to the wrong new one — leading to stale state, broken inputs, or odd animations on the wrong rows.'
      },
      {
        title: 'Forgetting the key entirely',
        wrong: `{users.map(u => <UserCard user={u} />)}  // ❌ React logs: "Each child in a list should have a unique key"`,
        right: `{users.map(u => <UserCard key={u.id} user={u} />)}  // ✅`,
      },
      {
        title: 'Generating a new random key on every render',
        wrong: `{items.map(item => <Item key={Math.random()} item={item} />)}\n// ❌ a brand-new key every render -> React unmounts & remounts EVERYTHING`,
        right: `{items.map(item => <Item key={item.id} item={item} />)}\n// ✅ stable across renders -> React reuses existing DOM/state`,
        note: 'A key must be stable across renders for the same logical item. Random/time-based keys defeat React\'s matching entirely — the worst possible performance and a loss of all component state on every render.'
      }
    ]
  },

  bestPractices: [
    'Always use a stable, unique identifier from your data (id, uuid, slug) as the key.',
    'Only use the array index as a last resort, and only for lists that are static — never sorted, filtered, reordered, or mutated.',
    'Put the key on the outermost element returned from the .map() callback, not on a nested child.',
    'If your data lacks an id, generate one when the data is *created* (not at render time) — e.g. with crypto.randomUUID().',
    'Remember: keys are scoped to siblings within one .map() — you don\'t need globally unique values.'
  ],

  interviewQuestions: [
    { q: 'Why does React need a "key" prop when rendering lists?', a: 'Keys give React a stable identity for each element across renders, so its reconciliation algorithm can correctly determine which items were added, removed, reordered, or updated. Without keys (or with unstable ones), React falls back to comparing by position, which can cause it to match the wrong old element to the wrong new one.' },
    { q: 'Why is using the array index as a key considered an anti-pattern?', a: 'The index reflects an item\'s *position*, not its *identity*. If the list is reordered, filtered, or has items inserted/removed, the same index now points to a different logical item — causing React to reuse DOM nodes/state for the wrong item (e.g. an input keeps the wrong value, or the wrong row appears "selected"). It\'s acceptable only for lists that never change order or membership.' },
    { q: 'Do keys need to be globally unique across the whole application?', a: 'No — keys only need to be unique among siblings produced by the same list/render. Two completely separate lists elsewhere in the app can reuse the same key values without any conflict.' },
    { q: 'What happens if you forget to add a key when rendering a list?', a: 'React renders the list (it still works visually) but logs a console warning: "Each child in a list should have a unique key prop." Internally it falls back to index-based matching, which carries all the risks of unstable keys described above.' }
  ],

  summary: {
    description: 'Use .map() to turn data into JSX, and give every item a stable, unique key drawn from your data — never the array index for dynamic lists, and never a freshly-generated random value. Get this right and React can efficiently and correctly add, remove, reorder, and update list items without losing state or performance.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/rendering-lists — the canonical guide to rendering arrays of data and choosing good keys.' }
  ]
};

export default listsAndKeys;
