const listsAndKeys = {
  id: 'listsAndKeys',
  title: 'Lists and Keys',
  icon: '📋',
  theme: 'cyan',
  tagline: 'Use .map() to render a list of items. Give each item a unique "key" so React can track them.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Rendering a list means turning an array of data into an array of JSX elements. You do this with the JavaScript .map() method.',
      'Each item in the list needs a special "key" prop. The key helps React know which item changed, was added, or was removed.'
    ],
    points: [
      '.map() turns data into elements: items.map(item => <li key={item.id}>{item.name}</li>).',
      'Keys must be unique among siblings in the same list.',
      'Good keys come from your data — a database ID, not the array index.'
    ],
    analogy: {
      icon: '🎫',
      title: 'Like name tags at a conference',
      text: '"Keys are like name tags. Without name tags, if people swap seats, the organizer cannot tell who moved. With name tags, the organizer instantly knows: Asha moved from seat 3 to seat 7. React works the same way with keys."'
    }
  },

  whyUsed: {
    description: 'Apps constantly show lists — product grids, comments, search results, table rows. Keys let React update these lists efficiently and correctly.',
    points: [
      'Without keys, React compares items by position — this breaks when items are reordered or deleted.',
      'With stable keys, React knows exactly which item moved and just moves its DOM node.',
      'Correct keys prevent bugs: form inputs keeping the wrong value, wrong item appearing selected.'
    ]
  },

  whenToUse: {
    description: 'Any time you use .map() to render an array of elements, every top-level element in that array needs a key.',
    points: [
      'Lists of cards, table rows, comments, chat messages, search results.',
      'Any set of sibling elements generated from an array.',
      'Nested lists: each level of .map() needs its own keys.'
    ]
  },

  howItWorks: {
    description: 'When React re-renders a list, it matches new elements to old ones using keys. A matched element keeps its DOM node and state. An unmatched old element is removed. An unmatched new element is created.',
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
      'Put the key on the outermost element returned inside .map(), not on a nested child.',
      'Keys only need to be unique within the same list, not across the whole app.',
      'If your data has no ID, create one when the data is created — not during render.'
    ]
  },

  flowDiagram: {
    title: 'How keys help React update a re-ordered list',
    steps: [
      { icon: '📜', label: 'Old list', note: '[A(key=1), B(key=2), C(key=3)]' },
      { icon: '🔀', label: 'New order arrives', note: '[C(key=3), A(key=1), B(key=2)]' },
      { icon: '🔑', label: 'React matches by key', note: 'Same elements, new positions' },
      { icon: '🚚', label: 'DOM nodes are moved', note: 'Not destroyed and recreated' },
      { icon: '✅', label: 'State and focus preserved', note: 'Inputs keep their values' }
    ]
  },

  realWorldExamples: {
    intro: 'Lists and keys are used in almost every data-driven screen:',
    items: [
      { icon: '🛍️', title: 'Product grids', description: 'Each <ProductCard key={product.id} /> keeps its own state stable as filters change the order.' },
      { icon: '💬', title: 'Chat messages', description: 'New messages append to the list. Keys by message ID prevent existing messages from flickering.' },
      { icon: '📊', title: 'Sortable tables', description: 'Clicking a column re-orders rows. Keys let React move rows instead of re-creating the whole table.' },
      { icon: '✅', title: 'Todo apps', description: 'Each <TodoItem key={todo.id} /> keeps its own state correctly even as items are completed or deleted.' }
    ]
  },

  prosAndCons: {
    pros: [
      'React updates lists efficiently — minimal DOM operations.',
      'Component state and input focus are preserved correctly when items move.',
      'Makes list-heavy UIs feel fast and work correctly.'
    ],
    cons: [
      'Using the wrong key (like array index) silently causes bugs that only appear when items change order.',
      'Generating random keys on every render destroys performance and all component state.',
      'Your data needs a stable unique ID — not always easy for ad-hoc data.'
    ]
  },

  comparison: {
    title: 'Stable ID vs. array index as a key',
    intro: 'This is the most common key mistake. Understanding why index keys fail will save you debugging time:',
    left: {
      title: '✅ Stable ID from your data',
      tone: 'good',
      code: `{todos.map(todo => (
  <TodoItem key={todo.id} todo={todo} />
))}`,
      note: 'Each item keeps its identity (and state) no matter how the list is sorted, filtered, or changed.'
    },
    right: {
      title: '❌ Array index as key',
      tone: 'bad',
      code: `{todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
))}`,
      note: 'Works for static lists that never change order — breaks when items are added, removed, or reordered.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Using array index as a key for dynamic lists',
        wrong: `{comments.map((c, i) => <Comment key={i} data={c} />)}\n// ❌ deleting one comment shifts all other keys`,
        right: `{comments.map(c => <Comment key={c.id} data={c} />)}\n// ✅ each comment keeps its identity`,
        note: 'When an item is removed or reordered, index-based keys cause React to match the wrong old element to the wrong new one. This leads to stale state and broken inputs.'
      },
      {
        title: 'Forgetting the key entirely',
        wrong: `{users.map(u => <UserCard user={u} />)}  // ❌ React warns: missing key`,
        right: `{users.map(u => <UserCard key={u.id} user={u} />)}  // ✅`,
      },
      {
        title: 'Using Math.random() as a key',
        wrong: `{items.map(item => <Item key={Math.random()} item={item} />)}\n// ❌ new key every render → React unmounts and remounts everything`,
        right: `{items.map(item => <Item key={item.id} item={item} />)}\n// ✅ stable key → React reuses existing DOM nodes`,
        note: 'A key must be stable across renders for the same item. Random keys force React to destroy and recreate every item on every render.'
      }
    ]
  },

  bestPractices: [
    'Always use a stable unique ID from your data as the key.',
    'Only use array index for truly static lists that never change order.',
    'Put the key on the outermost element in the .map() callback.',
    'If data has no ID, generate one when creating the data — not at render time.',
    'Keys are scoped to siblings — no need for globally unique values.'
  ],

  interviewQuestions: [
    { q: 'Why does React need a "key" prop for lists?', a: 'Keys give React a stable identity for each element. When the list updates, React uses keys to match new elements to old ones — correctly adding, removing, and reordering without losing state. Without keys, React compares by position, which breaks when items are reordered.' },
    { q: 'Why is using array index as a key a problem?', a: 'Index reflects position, not identity. When an item is removed or the list is reordered, the same index now points to a different item. React matches the wrong old element to the wrong new one, causing bugs like inputs showing the wrong value or wrong state on a row.' },
    { q: 'Do keys need to be globally unique across the whole app?', a: 'No. Keys only need to be unique among siblings in the same list. Two separate lists can reuse the same key values.' },
    { q: 'What happens if you forget to add a key?', a: 'React still renders the list but shows a console warning: "Each child in a list should have a unique key prop." Internally it falls back to index-based matching, which has all the problems of index keys.' }
  ],

  summary: {
    description: 'Use .map() to turn arrays into JSX. Give every item a stable, unique key from your data — never the array index for dynamic lists, and never a random value. Get this right and React can efficiently add, remove, reorder, and update list items without losing state.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/rendering-lists — the official guide to rendering arrays and choosing good keys.' }
  ]
};

export default listsAndKeys;
