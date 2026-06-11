const props = {
  id: 'props',
  title: 'Props',
  icon: '🔄',
  theme: 'indigo',
  tagline: 'Props are how you pass data from a parent component to a child component.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Props (short for "properties") are the inputs you pass to a component. They work like function arguments.',
      'A parent component passes data to a child using attributes in JSX. The child reads the data from its props.'
    ],
    points: [
      'Pass props like HTML attributes: <Greeting name="Raghul" age={25} />.',
      'Read props inside the component: function Greeting({ name, age }) { }.',
      'Props can be strings, numbers, arrays, objects, functions, or JSX.'
    ],
    analogy: {
      icon: '🎁',
      title: 'Like ordering a custom T-shirt',
      text: '"Props are like ordering a custom T-shirt. You (the parent) choose the size, color, and design (props). The printing shop (child component) makes exactly what you specified — it cannot change your order."'
    }
  },

  whyUsed: {
    description: 'Without props, every component would be hardcoded for one specific use. Props make components reusable.',
    points: [
      'Make a component configurable: the same <Button> can say "Save", "Cancel", or "Delete".',
      'One-way data flow: data goes from parent to child — easy to trace and debug.',
      'Pass behaviour too: you can pass a function as a prop (like onClick or onSubmit).',
      'Pass children: nest JSX inside a component with the special children prop.'
    ]
  },

  whenToUse: {
    description: 'Use props when a component needs information that comes from outside — from whoever is rendering it.',
    points: [
      'Passing data to render: text, numbers, images, lists.',
      'Passing event handlers so a child can tell its parent something happened.',
      'Passing configuration options: variant="primary", size="large", disabled.',
      'Passing JSX as children to wrapper components like <Modal> or <Card>.'
    ]
  },

  howItWorks: {
    description: 'When you write <UserCard name="Asha" role="Admin" />, React bundles these into a props object and passes it to the UserCard function. You can read any key you need — usually with destructuring.',
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
      'Default values: function Button({ variant = "primary" }) { } — used when the prop is not passed.',
      'children prop: whatever is nested inside a component\'s tags becomes its children.',
      'Spread props: <Avatar {...user} /> passes all keys of user as individual props.'
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
    intro: 'Props are used in almost every React component:',
    items: [
      { icon: '🛒', title: 'Product listing', description: 'A <ProductCard product={item} onAddToCart={handleAdd} /> used for every item — different data, same component.', code: `{products.map(p => (\n  <ProductCard key={p.id} product={p} onAddToCart={addToCart} />\n))}` },
      { icon: '🔘', title: 'Reusable Button', description: 'A <Button variant="danger" size="lg" onClick={handleDelete}>Delete</Button> configured entirely through props.' },
      { icon: '📦', title: 'Layout wrapper', description: 'A <Modal title="Confirm">{children}</Modal> that wraps any content you put inside it.' },
      { icon: '📝', title: 'Form fields', description: 'A <TextField label="Email" value={email} onChange={setEmail} error={errors.email} /> reused in every form.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Easy to follow: data flows only one way — down from parent to child.',
      'Makes components reusable with different data each time.',
      'Works well with TypeScript for catching errors early.',
      'Parent decides what to show; child decides how to show it.'
    ],
    cons: [
      'Prop drilling: passing the same prop through many layers that do not need it.',
      'Too many props on one component means it is doing too much.',
      'Passing new objects/functions as props on every render can cause extra re-renders.'
    ]
  },

  comparison: {
    title: 'Props vs. State',
    intro: 'This is one of the most common questions for beginners:',
    left: {
      title: '📥 Props',
      tone: 'good',
      note: 'Passed IN from a parent. Read-only inside the component. Used to configure or display data. The parent controls the value.'
    },
    right: {
      title: '🧠 State',
      tone: 'neutral',
      note: 'Owned and managed INSIDE the component. Can change using its setter function. Used for data that changes because of user actions.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Trying to change props directly',
        wrong: `function Profile(props) {\n  props.name = props.name.toUpperCase(); // ❌ never mutate props\n  return <h1>{props.name}</h1>;\n}`,
        right: `function Profile({ name }) {\n  return <h1>{name.toUpperCase()}</h1>; // ✅ create a new value instead\n}`,
        note: 'Props belong to the parent. Never mutate them. Compute a new value from the prop instead.'
      },
      {
        title: 'Passing props through too many layers (prop drilling)',
        note: 'Passing the same prop through 5 levels of components that do not use it is messy. Use the Context API for data that many components need, like the current user or theme.'
      },
      {
        title: 'Forgetting default values for optional props',
        wrong: `function Avatar({ size }) {\n  return <img width={size * 10} />; // ❌ NaN if size is not passed\n}`,
        right: `function Avatar({ size = 4 }) {\n  return <img width={size * 10} />; // ✅ uses 4 if size is not passed\n}`,
      }
    ]
  },

  bestPractices: [
    'Destructure props in the function signature — it shows exactly what the component needs.',
    'Give props clear names: onSave, isLoading, items — not data, flag, x.',
    'Always provide default values for optional props.',
    'Use TypeScript or PropTypes to catch wrong prop types early.',
    'When passing through 3+ layers, switch to Context or state management.'
  ],

  interviewQuestions: [
    { q: 'What are props in React?', a: 'Props are read-only inputs passed from a parent to a child component. They work like function arguments — you pass data in and the child uses it to render. Props make components reusable with different data each time.' },
    { q: 'Why are props read-only?', a: 'Data flows only one way in React — from parent to child. If a child changed its own props, the parent would not know, breaking predictability. Instead, the child calls a callback function (like onChange) to ask the parent to update the data.' },
    { q: 'What is the difference between props and state?', a: 'Props are passed into a component from outside by the parent. They are read-only. State is data the component owns and manages itself. State can change — when it does, the component re-renders.' },
    { q: 'What is "prop drilling" and how do you avoid it?', a: 'Prop drilling is passing a prop through many levels of components that do not use it themselves. You can avoid it with the Context API for shared data, or by composing components differently (passing JSX as children).' },
    { q: 'What is the children prop?', a: 'The children prop holds whatever JSX is nested between a component\'s opening and closing tags. For example, <Card><p>Hello</p></Card> gives Card a children prop equal to <p>Hello</p>. It is used for wrapper components like Modal, Card, and Layout.' }
  ],

  summary: {
    description: 'Props are how parent components pass data to child components. They are read-only and flow one way — from parent to child. The key difference: props come from outside and cannot be changed inside. State is owned inside and can change. Together they control how data moves through a React app.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-props-to-a-component — the official guide to passing, destructuring, and using props.' }
  ]
};

export default props;
