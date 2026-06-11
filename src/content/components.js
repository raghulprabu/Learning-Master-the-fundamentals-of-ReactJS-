const components = {
  id: 'components',
  title: 'Components',
  icon: '🧩',
  theme: 'purple',
  tagline: 'Components are the building blocks of a React app. Each component is a small, reusable piece of UI.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'A React component is a JavaScript function that returns JSX. JSX describes what should appear on the screen.',
      'You can reuse the same component many times with different data. This saves you from writing the same code again and again.'
    ],
    points: [
      'Component names must start with a capital letter: <Button />, not <button />.',
      'A component is just a function — it can use JavaScript logic and return JSX.',
      'Components can render other components, forming a tree.'
    ],
    analogy: {
      icon: '🧱',
      title: 'Think of it like furniture modules',
      text: '"Components are like custom drawer designs. You design a Drawer once, then reuse it in a wardrobe, a desk, and a kitchen — each with different sizes or colors (props), but built from the same blueprint."'
    }
  },

  whyUsed: {
    description: 'Without components, you would repeat the same code for every button, card, and form field. Components let you write the code once and reuse it everywhere.',
    points: [
      'Reusability: build a Button once, use it everywhere.',
      'Easy to update: change one component, it updates everywhere.',
      'Easier to test: small isolated pieces are simpler to check.',
      'Teamwork: different people can build different components at the same time.'
    ]
  },

  whenToUse: {
    description: 'Create a new component when a piece of UI is used in more than one place, or when it is complex enough to deserve its own file.',
    points: [
      'When a piece of UI is reused in multiple places (buttons, cards, modals).',
      'When a section of markup is large and hard to read as one block.',
      'When a piece has its own state or logic (like a dropdown).',
      'When you want to test or document a part of the UI in isolation.'
    ]
  },

  howItWorks: {
    description: 'A component receives data through props and returns JSX. Every time the props or state change, React runs the function again and updates the screen.',
    code: {
      title: 'Defining and composing components',
      snippet: `// A reusable "leaf" component
function Avatar({ src, name }) {
  return <img className="avatar" src={src} alt={name} />;
}

// A component that *composes* other components
function ProfileCard({ user }) {
  return (
    <div className="card">
      <Avatar src={user.avatarUrl} name={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </div>
  );
}

// The component tree: App -> ProfileCard -> Avatar
function App() {
  return <ProfileCard user={currentUser} />;
}`
    },
    points: [
      'React renders the top component and walks down the tree.',
      'Each component only knows about its own JSX and state.',
      'Data flows down through props. Events flow up through callback functions.'
    ]
  },

  flowDiagram: {
    title: 'A component tree (how the UI is structured)',
    steps: [
      { icon: '🌳', label: '<App />', note: 'Root component' },
      { icon: '🧭', label: '<Navbar />', note: 'Renders <Logo/>, <Links/>' },
      { icon: '📄', label: '<Page />', note: 'Renders <Sidebar/>, <Content/>' },
      { icon: '🧩', label: '<Card />', note: 'Reused many times with different props' }
    ]
  },

  realWorldExamples: {
    intro: 'Almost everything you see on a website is a tree of components:',
    items: [
      { icon: '🛍️', title: 'E-commerce product grid', description: 'One <ProductCard> component reused many times, each with a different product as props.' },
      { icon: '📰', title: 'Social media feed', description: '<Post>, <Avatar>, <LikeButton>, <CommentList> all compose together to make one feed item.' },
      { icon: '🧾', title: 'Admin dashboards', description: '<StatCard>, <Chart>, <DataTable> are independent components assembled into many pages.' },
      { icon: '🔘', title: 'Design systems', description: 'A shared <Button>, <Input>, <Modal> used consistently across all products.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Write once, reuse everywhere with different data via props.',
      'Fix a bug in one component — it fixes everywhere it is used.',
      'Mirrors how designers think: atoms → molecules → pages.',
      'Easy to test each component in isolation.'
    ],
    cons: [
      'Too many tiny components makes code hard to follow.',
      'Choosing the right split takes practice.',
      'Passing data through many layers (prop drilling) can get messy.'
    ]
  },

  comparison: {
    title: 'Function components vs. class components',
    intro: 'Modern React uses function components. You may see class components in older code — know how to read them, but write functions for new code.',
    left: {
      title: '✅ Function component (modern)',
      tone: 'good',
      code: `function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
      note: 'Short and simple. Uses Hooks for state. Easier to read and test.'
    },
    right: {
      title: '🕰️ Class component (legacy)',
      tone: 'neutral',
      code: `class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        Clicked {this.state.count} times
      </button>
    );
  }
}`,
      note: 'More code. Uses lifecycle methods. Still works, but rarely written in new projects.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Using a lowercase name for a component',
        wrong: `function profileCard() { return <div>...</div>; }\n<profileCard />  // ❌ React treats it as an HTML tag`,
        right: `function ProfileCard() { return <div>...</div>; }\n<ProfileCard />  // ✅ Capital letter means it is a component`,
        note: 'JSX uses the capital letter to know if it is a custom component or a built-in HTML tag.'
      },
      {
        title: 'Defining a component inside another component',
        wrong: `function ParentComponent() {\n  function ChildComponent() { return <p>Hi</p>; } // ❌ re-created every render\n  return <ChildComponent />;\n}`,
        right: `function ChildComponent() { return <p>Hi</p>; } // ✅ defined once at the top\n\nfunction ParentComponent() {\n  return <ChildComponent />;\n}`,
        note: 'Defining a component inside another component creates a brand new function on every render. This resets its state and hurts performance.'
      },
      {
        title: 'Making one component do too many things',
        note: 'A component that fetches data, manages many state values, and renders a large UI is hard to test. Split it into smaller components and custom hooks.'
      }
    ]
  },

  bestPractices: [
    'One component, one job — if you cannot describe it in one sentence, split it.',
    'Name it after what it shows: ProductCard, not Card2.',
    'Move shared state to the closest common parent.',
    'Keep display components separate from data-fetching logic.',
    'As the app grows, put each component in its own folder.'
  ],

  interviewQuestions: [
    { q: 'What is a React component?', a: 'A React component is a JavaScript function that accepts props and returns JSX. It is a reusable, self-contained piece of UI. You compose components together to build a full application.' },
    { q: 'What is the difference between a function component and a class component?', a: 'Function components are plain JavaScript functions. They use Hooks like useState and useEffect. Class components extend React.Component and use lifecycle methods like componentDidMount. Function components are the modern standard and should be used for all new code.' },
    { q: 'Why must component names start with a capital letter?', a: 'JSX uses capitalization to tell the difference between HTML tags and custom components. A lowercase name like <button> is treated as an HTML element. An uppercase name like <Button> is treated as a React component.' },
    { q: 'When should you break a component into smaller ones?', a: 'Break it when: the JSX is too long to read easily, a piece of UI is used in more than one place, a section has its own state or logic, or you want to test or reuse a part on its own.' }
  ],

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/your-first-component and react.dev/learn/importing-and-exporting-components — the official guide to components.' }
  ]
};

export default components;
