const components = {
  id: 'components',
  title: 'Components',
  icon: '🧩',
  theme: 'purple',
  tagline: 'Independent, reusable pieces of UI — the fundamental building blocks of every React application.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'A component is a JavaScript function that returns markup (JSX) describing a piece of UI. Once defined, you can reuse it as many times as you like, with different data, anywhere in your app.',
      'Modern React almost exclusively uses **function components** — plain functions that accept "props" and return JSX. (Older code may use class components; you should be able to read them, but write function components.)'
    ],
    points: [
      'A component name must start with a capital letter (<Profile />, not <profile />) so React can tell it apart from a regular HTML tag.',
      'A component is just a function — it can contain JavaScript logic, call hooks, and return JSX.',
      'Components can be composed: a component\'s JSX can render other components, forming a tree.'
    ],
    analogy: {
      icon: '🧱',
      title: 'Real-World Analogy',
      text: '"Components are like custom-made furniture modules. You design a `Drawer` once, then reuse that same drawer design across a wardrobe, a desk, and a kitchen cabinet — each with different colors/sizes (props), but all built from the same blueprint."'
    }
  },

  whyUsed: {
    description: 'Without components, you would write one giant block of markup and logic for an entire page — duplicating code for every button, card, or form field, and making changes a nightmare.',
    points: [
      'Reusability: build a `Button` once, use it everywhere — change it once, it updates everywhere.',
      'Separation of concerns: each component owns its own markup, styles and logic.',
      'Easier testing & debugging: small, isolated units are simpler to reason about and test.',
      'Enables teams to work in parallel — different people can build different components independently.',
      'Encourages a clear mental model: "the UI is a tree of components", which scales to huge apps.'
    ]
  },

  whenToUse: {
    description: 'You are always "using components" in React — the real question is *when to create a new one*.',
    points: [
      'When a piece of UI is reused in more than one place (buttons, cards, modals, form fields).',
      'When a section of markup is large/complex enough that extracting it improves readability.',
      'When a piece of UI has its own independent state or logic (e.g. a dropdown that manages its own open/closed state).',
      'When you want to test, document or reason about a piece of the UI in isolation.'
    ]
  },

  howItWorks: {
    description: 'A function component receives a single "props" object as its argument and returns JSX describing what should appear on screen for that data. React calls your function, gets back a tree of elements, and keeps the DOM in sync with what you returned — every time props or state change, your function runs again and returns fresh JSX.',
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
      'React renders your top-level component (e.g. <App />) and walks down the tree, rendering each child component it encounters.',
      'Every component is independent — it manages its own JSX/state and doesn\'t need to know how its parent or children are implemented.',
      'Data flows down the tree via props; events flow up via callback functions passed as props.'
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
    intro: 'Almost everything you see on a polished web app is a composed tree of small components:',
    items: [
      { icon: '🛍️', title: 'E-commerce product grid', description: 'One <ProductCard> component reused 50 times, each rendered with a different product object as props.' },
      { icon: '📰', title: 'Social media feed', description: '<Post>, <Avatar>, <LikeButton>, <CommentList> compose together to build each feed item — all reused per-post.' },
      { icon: '🧾', title: 'Admin dashboards', description: '<StatCard>, <Chart>, <DataTable>, <FilterBar> are independent components assembled into many different dashboard pages.' },
      { icon: '🔘', title: 'Design systems', description: 'A shared <Button>, <Input>, <Modal> library used consistently across an entire company\'s products.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Massive reuse — write once, use everywhere, with different data via props.',
      'Improves maintainability — fixing a bug in one component fixes it everywhere it is used.',
      'Encourages a clean mental model that mirrors how designers think (atoms → molecules → pages).',
      'Plays perfectly with testing tools — render a component in isolation and assert on its output.'
    ],
    cons: [
      'Over-extracting tiny components everywhere can add indirection and make code harder to follow ("component soup").',
      'Choosing the right component boundaries takes practice — too coarse and you lose reuse; too fine and you lose readability.',
      'Deep component trees can make prop-passing ("prop drilling") tedious without context/state-management tools.'
    ]
  },

  comparison: {
    title: 'Function components vs. class components',
    intro: 'Modern React code is written with function components + hooks. You may still encounter class components in older codebases — know how to read them, but prefer functions for new code.',
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
      note: 'Concise, uses Hooks for state/lifecycle, easier to test and compose.'
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
      note: 'More boilerplate (constructor, this binding, lifecycle methods). Still supported, rarely written in new code.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Naming a component with a lowercase letter',
        wrong: `function profileCard() { return <div>...</div>; }\n<profileCard />  // ❌ React treats it as an HTML tag <profilecard>`,
        right: `function ProfileCard() { return <div>...</div>; }\n<ProfileCard />  // ✅ Capital letter -> React knows it's a component`,
        note: 'JSX uses the capitalization to decide whether a tag is a built-in HTML element or your custom component.'
      },
      {
        title: 'Defining a component inside another component',
        wrong: `function ParentComponent() {\n  function ChildComponent() { return <p>Hi</p>; } // ❌ re-created every render\n  return <ChildComponent />;\n}`,
        right: `function ChildComponent() { return <p>Hi</p>; } // ✅ defined once, at module level\n\nfunction ParentComponent() {\n  return <ChildComponent />;\n}`,
        note: 'Defining components inside other components recreates them on every render, which resets their state and hurts performance.'
      },
      {
        title: 'Making components do too much',
        note: 'A component that fetches data, manages five pieces of state, and renders a huge UI is hard to test and reuse. Split it: separate data-fetching/logic (custom hooks) from presentation (smaller, focused components).'
      }
    ]
  },

  bestPractices: [
    'One component, one responsibility — if you can\'t describe what it does in one sentence, consider splitting it.',
    'Name components after what they represent (ProductCard, not Card2) and keep the file name matching the component name.',
    'Lift shared state to the closest common ancestor instead of duplicating it across siblings.',
    'Keep presentational ("dumb") components separate from logic-heavy ("container"/"smart") components or custom hooks.',
    'Co-locate a component with its styles/tests/sub-components in its own folder as your app grows.'
  ],

  interviewQuestions: [
    { q: 'What is a React component?', a: 'A component is a self-contained, reusable piece of UI — typically a JavaScript function that accepts a "props" object and returns JSX describing what should be rendered. Components can be composed together to build complex UIs from simple building blocks.' },
    { q: 'What is the difference between a function component and a class component?', a: 'Function components are plain JavaScript functions that use Hooks (useState, useEffect, etc.) for state and side effects — they are the modern standard. Class components extend React.Component, manage state via this.state/this.setState, and use lifecycle methods (componentDidMount, etc.). Function components are more concise and are what new code should use.' },
    { q: 'Why must component names start with a capital letter?', a: 'JSX uses capitalization as a convention to distinguish your custom components from built-in HTML elements. <div> is treated as a DOM tag, while <Profile /> is looked up as a variable/component in scope. A lowercase name would be (incorrectly) treated as an HTML tag.' },
    { q: 'How do you decide when to break a big component into smaller ones?', a: 'Common signals: the JSX is hard to read/scroll through, a piece of UI is duplicated elsewhere, a section has its own independent state/behaviour, or you want to test/reuse a part in isolation. Extracting it into a focused component with clear props improves readability, testability and reuse.' }
  ],

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/your-first-component and react.dev/learn/importing-and-exporting-components — the canonical introduction to building and composing components.' }
  ]
};

export default components;
