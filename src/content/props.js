const props = {
  id: 'props',
  title: 'Props',
  icon: '🔄',
  theme: 'indigo',
  tagline: 'How data flows from parent components into child components — React\'s "function arguments" for UI.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Props ("properties") are the inputs you pass to a component, the same way you pass arguments to a function. A parent component passes data down to a child via attributes in JSX, and the child reads them through its single function argument.',
      'Props are **read-only** — a component must never modify the props it receives. If something needs to change, that change should happen in the component that owns the data (and flow back down again as new props).'
    ],
    points: [
      'Passed like HTML attributes: <Greeting name="Raghul" age={25} />.',
      'Received as a single object, usually destructured: function Greeting({ name, age }) { ... }.',
      'Can be any JavaScript value: strings, numbers, arrays, objects, functions, even other components (children).'
    ],
    analogy: {
      icon: '🎁',
      title: 'Real-World Analogy',
      text: '"Props are like ordering a custom T-shirt online. You (the parent) choose the size, color and design (props) and send that order to the printing shop (the child component). The shop prints exactly what you specified — it doesn\'t get to change your order."'
    }
  },

  whyUsed: {
    description: 'Without props, every component would need to be hard-coded for one specific use — defeating the entire purpose of reusability. Props let one component definition serve countless different scenarios.',
    points: [
      'Make components configurable and reusable — the same <Button> can be "Save", "Cancel" or "Delete" just by changing its label/color props.',
      'Establish a clear, predictable one-way data flow: data flows down from parent to child, which makes apps easier to debug.',
      'Allow parent components to pass not just data, but *behaviour* too — via callback functions (e.g. onClick, onSubmit).',
      'Enable component composition — the special `children` prop lets you nest arbitrary content inside a wrapper component.'
    ]
  },

  whenToUse: {
    description: 'Use props any time a component needs information that comes from "outside itself" — i.e. from whoever is rendering it.',
    points: [
      'Passing data down to render (text, numbers, images, lists, objects).',
      'Passing event handlers down so a child can notify its parent of something ("the user clicked save").',
      'Passing configuration/appearance options (variant="primary", size="large", disabled).',
      'Passing JSX/components as `children` to build flexible wrapper/layout components (<Modal>, <Card>, <Layout>).'
    ]
  },

  howItWorks: {
    description: 'When you write <UserCard name="Asha" role="Admin" />, React packages { name: "Asha", role: "Admin" } into a single object and passes it as the first argument to the UserCard function. Inside, you read whatever keys you need — usually via destructuring right in the function signature.',
    code: {
      title: 'Passing and receiving props',
      snippet: `// Parent passes data down
function App() {
  return (
    <UserCard
      name="Asha Patel"
      role="Admin"
      isOnline={true}
      onMessage={() => alert('Opening chat…')}
    />
  );
}

// Child receives & uses props (destructured)
function UserCard({ name, role, isOnline, onMessage }) {
  return (
    <div className="card">
      <h3>{name} {isOnline && '🟢'}</h3>
      <p>{role}</p>
      <button onClick={onMessage}>Message</button>
    </div>
  );
}`
    },
    points: [
      'Default values: function Button({ variant = \'primary\' }) { ... } — used when the prop isn\'t passed.',
      'The special `children` prop holds whatever is nested between a component\'s opening/closing tags: <Card><p>Hello</p></Card>.',
      'Spreading props: <Avatar {...user} /> forwards every key of `user` as individual props — handy, but use sparingly so it stays clear what a component expects.'
    ]
  },

  flowDiagram: {
    title: 'One-way data flow with props',
    steps: [
      { icon: '🏠', label: 'Parent owns data', note: 'const [user] = useState(...)' },
      { icon: '⬇️', label: 'Passes via props', note: '<Profile user={user} />' },
      { icon: '🧩', label: 'Child renders it', note: 'function Profile({ user })' },
      { icon: '📣', label: 'Child notifies parent', note: 'via callback prop, e.g. onSave()' }
    ]
  },

  realWorldExamples: {
    intro: 'Props are how nearly every dynamic UI gets its data — here are everyday patterns:',
    items: [
      { icon: '🛒', title: 'Product listing', description: 'A <ProductCard product={item} onAddToCart={handleAdd} /> reused for every item — different data and behaviour, same component.', code: `{products.map(p => (\n  <ProductCard key={p.id} product={p} onAddToCart={addToCart} />\n))}` },
      { icon: '🔘', title: 'Reusable Button', description: 'A design-system <Button variant="danger" size="lg" onClick={handleDelete}>Delete</Button> configured purely through props.' },
      { icon: '📦', title: 'Layout/wrapper components', description: 'A <Modal title="Confirm"> {children} </Modal> that wraps any nested JSX you give it via the `children` prop.' },
      { icon: '📝', title: 'Form fields', description: 'A shared <TextField label="Email" value={email} onChange={setEmail} error={errors.email} /> reused across every form in the app.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Predictable, easy-to-trace data flow ("data flows down") makes debugging straightforward.',
      'Makes components generic and reusable across many contexts.',
      'Plays well with TypeScript/PropTypes for compile-time/runtime type safety.',
      'Encourages a clean separation: parent decides *what*, child decides *how to render it*.'
    ],
    cons: [
      'Deeply nested trees can suffer from "prop drilling" — passing the same prop through many intermediate components that don\'t use it themselves.',
      'Too many props on one component can be a sign it is doing too much / needs restructuring.',
      'Passing new inline objects/functions as props on every render can cause unnecessary re-renders of memoized children (solvable with useMemo/useCallback).'
    ]
  },

  comparison: {
    title: 'Props vs. State',
    intro: 'These two are the most commonly confused concepts for beginners — keep this distinction front of mind:',
    left: {
      title: '📥 Props',
      tone: 'good',
      note: 'Passed IN from a parent. Read-only inside the component. Used to configure/customize. Changing them means the parent re-renders the child with new values.'
    },
    right: {
      title: '🧠 State',
      tone: 'neutral',
      note: 'Owned and managed INSIDE a component (via useState/useReducer). Mutable via its setter. Used for data that changes over time due to user interaction or events.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Trying to mutate props directly',
        wrong: `function Profile(props) {\n  props.name = props.name.toUpperCase(); // ❌ never mutate props\n  return <h1>{props.name}</h1>;\n}`,
        right: `function Profile({ name }) {\n  return <h1>{name.toUpperCase()}</h1>; // ✅ derive a new value instead\n}`,
        note: 'Props are owned by the parent. Mutating them breaks React\'s data-flow guarantees and can cause confusing bugs. Compute a new value instead.'
      },
      {
        title: 'Excessive prop drilling',
        note: 'Passing `theme` or `currentUser` down through five layers of components that don\'t use it themselves makes refactors painful. When this happens, reach for the Context API (or a state-management library) instead of threading props through every level.'
      },
      {
        title: 'Forgetting default values for optional props',
        wrong: `function Avatar({ size }) {\n  return <img width={size * 10} />; // ❌ NaN if size is undefined\n}`,
        right: `function Avatar({ size = 4 }) {\n  return <img width={size * 10} />; // ✅ falls back to a sensible default\n}`,
      }
    ]
  },

  bestPractices: [
    'Destructure props in the function signature — it documents exactly what a component expects at a glance.',
    'Give props clear, descriptive names (onSave, isLoading, items) rather than vague ones (data, flag, x).',
    'Provide sensible default values for optional props.',
    'Validate prop shapes with PropTypes or TypeScript so mistakes surface early, not in production.',
    'When prop drilling gets deep (3+ levels), consider Context, composition (passing JSX as children), or a state-management tool.'
  ],

  interviewQuestions: [
    { q: 'What are props in React?', a: 'Props ("properties") are read-only inputs passed from a parent component to a child, similar to function arguments. They let you configure and customize a reusable component\'s output and behaviour with different data each time it is used.' },
    { q: 'Why are props described as "read-only" — what happens if you try to change them?', a: 'React\'s data flow is one-directional: parents own their data and pass it down. If a child mutated its props, the parent (the actual owner of that data) would have no idea its data changed, breaking predictability. React doesn\'t actually "prevent" mutation at runtime in all cases, but doing so violates the contract and leads to bugs — instead, a child should call a callback prop to ask the parent to update the data.' },
    { q: 'What is the difference between props and state?', a: 'Props are passed into a component from the outside (by its parent) and are read-only from the component\'s perspective. State is data a component manages internally (via useState/useReducer) and can change over time, typically in response to user interaction — triggering a re-render when updated.' },
    { q: 'What is "prop drilling" and how can you avoid it?', a: 'Prop drilling is passing a prop through several intermediate components that don\'t need it themselves, just so a deeply nested component can use it. You can avoid it with the Context API (for cross-cutting data like theme/user), composition (passing JSX as children so intermediate components don\'t need to know about the data), or a global state-management library for larger apps.' },
    { q: 'What is the `children` prop and when would you use it?', a: 'children is a special prop that contains whatever is nested between a component\'s opening and closing tags, e.g. <Card><p>Hi</p></Card> gives Card a children prop equal to <p>Hi</p>. It\'s used to build flexible wrapper/layout components (Modal, Card, Layout) that don\'t need to know in advance what they will render inside.' }
  ],

  summary: {
    description: 'Props are how parents configure and supply data/behaviour to children — read-only, flowing one way down the component tree. Master the props ↔ state distinction early: props come from outside and shouldn\'t change inside; state lives inside and changes over time. Together they are the backbone of how data moves through a React app.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-props-to-a-component — the canonical guide to passing, destructuring, defaulting, and spreading props, plus passing JSX as children.' }
  ]
};

export default props;
