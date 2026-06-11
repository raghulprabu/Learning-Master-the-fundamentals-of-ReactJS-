const introduction = {
  id: 'introduction',
  title: 'Introduction to React',
  icon: '⚛️',
  theme: 'sky',
  tagline: 'React is a JavaScript library for building user interfaces.',
  meta: 'Foundations · Start here',

  whatIsIt: {
    description: [
      'React is a JavaScript library created by Facebook. It is used to build the visible parts of a website — what the user sees on screen.',
      'You break your UI into small, reusable pieces called components. When your data changes, React automatically updates the screen.'
    ],
    points: [
      'React is a library — not a full framework.',
      'You describe what the UI should look like. React handles all DOM updates.',
      'React uses components, JSX, props, and state.'
    ],
    analogy: {
      icon: '🧱',
      title: 'Think of it like LEGO',
      text: '"React is like LEGO bricks. You make small reusable bricks (components) — a button, a card, a navbar — and snap them together to build your app."'
    }
  },

  whyUsed: {
    description: 'Before React, updating a web page meant manually finding and changing HTML elements. That was slow and hard to manage. React makes it easy.',
    points: [
      'Declarative: you say what to show — React does the update.',
      'Component-based: build once, reuse everywhere.',
      'Fast: React only updates the parts that changed.',
      'Huge community: there is a library for almost everything.',
      'React Native: use the same skills to build mobile apps too.'
    ]
  },

  whenToUse: {
    description: 'Use React when your page is interactive — when data changes based on what the user does.',
    points: [
      'Dashboards, social feeds, e-commerce sites.',
      'Apps where the UI must update instantly (chat, notifications).',
      'Projects that will grow large and need organized code.',
      'Teams that want a big community and long-term support.'
    ]
  },

  howItWorks: {
    description: 'React keeps a copy of your UI in memory called the Virtual DOM. When data changes, it compares the old and new versions and only updates what changed in the real browser.',
    steps: [
      'You write components and JSX to describe the UI.',
      'When state or props change, React re-runs the component.',
      'React compares the new UI with the old one.',
      'React updates only the parts that actually changed.'
    ],
    code: {
      title: 'Your first React component',
      snippet: `function Welcome({ name }) {
  return <h1>Hello, {name}! 👋</h1>;
}

// Usage
<Welcome name="Raghul" />
// Renders: <h1>Hello, Raghul! 👋</h1>`
    },
    analogy: {
      icon: '🎬',
      title: 'Smart film editor',
      text: '"React is like a smart editor. Instead of re-shooting the whole movie, it only re-shoots the scenes that actually changed."'
    }
  },

  flowDiagram: {
    title: 'How a React update reaches the screen',
    steps: [
      { icon: '🖱️', label: 'User Interaction', note: 'Click, type, scroll…' },
      { icon: '🔄', label: 'State Updates', note: 'setState() / dispatch()' },
      { icon: '🧠', label: 'Re-render', note: 'Component function re-runs' },
      { icon: '🪞', label: 'Virtual DOM Diff', note: 'React compares old vs new tree' },
      { icon: '🖥️', label: 'DOM Update', note: 'Only changed parts are painted' }
    ]
  },

  realWorldExamples: {
    intro: 'React powers many of the apps you use every day:',
    items: [
      { icon: '📘', title: 'Facebook & Instagram', description: 'Feeds that update live as you scroll and like — no page reload needed.' },
      { icon: '🎬', title: 'Netflix', description: 'Browsing movies and instant page transitions are built with React components.' },
      { icon: '🛒', title: 'E-commerce sites', description: 'Product listings, carts, and filters that update instantly when you interact.' },
      { icon: '💬', title: 'Chat apps', description: 'Messages appear in real time as new data arrives.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Reuse components — write once, use many times.',
      'Fast updates — React only changes what needs to change.',
      'Huge community — answers and libraries for everything.',
      'Easy to learn the basics if you know HTML and JavaScript.'
    ],
    cons: [
      'It is just a library — you need to pick your own router and state manager.',
      'JSX and build tools take some time to learn for beginners.',
      'The ecosystem changes fast — can feel overwhelming at first.',
      'SEO and first-load speed need extra work (like Next.js).'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Thinking React handles everything',
        note: 'React only handles the view layer. Routing, API calls, and global state need separate libraries like React Router, fetch, and Redux/Context.'
      },
      {
        title: 'Changing the DOM directly',
        wrong: `// ❌ Fighting React by reaching into the DOM
document.getElementById('title').innerText = 'New Title';`,
        right: `// ✅ Let state drive the UI — React updates the DOM for you
const [title, setTitle] = useState('Old Title');
return <h1>{title}</h1>;`,
        note: 'Never manually touch the DOM in React. Let state and JSX control what shows on screen.'
      }
    ]
  },

  bestPractices: [
    'Draw your UI as a tree of components before writing code.',
    'Keep each component small — it should do one thing only.',
    'Never touch the DOM directly. Use state instead.',
    'Use React DevTools to see what is rendering and why.',
    'Learn modern JavaScript (ES6+) alongside React.'
  ],

  interviewQuestions: [
    { q: 'What is React and why was it created?', a: 'React is a JavaScript library for building user interfaces. Facebook created it to manage complex, frequently-changing UIs. It uses small reusable components to keep the UI in sync with data.' },
    { q: 'Is React a framework or a library?', a: 'React is a library. It only handles the view layer. You choose your own tools for routing, HTTP calls, and state management. A full framework like Angular includes all of these.' },
    { q: 'What problem does the Virtual DOM solve?', a: 'Changing the real DOM directly is slow. The Virtual DOM lets React calculate the minimum changes needed in memory first, then apply only those to the real DOM — making updates much faster.' },
    { q: 'What does "declarative UI" mean?', a: 'Declarative means you describe what the UI should look like for a given state. React figures out how to update the DOM. The opposite — imperative — means you write step-by-step instructions to manually change the DOM yourself.' }
  ],

  summary: {
    description: 'React lets you build UIs with small, reusable components. You describe what the screen should show for any given data, and React handles updating the DOM efficiently. Learn components, JSX, props, and state first — everything else builds on top of these basics.',
    analogy: {
      icon: '🚦',
      title: 'Learning React',
      text: '"Learning React is like learning to drive. Components, JSX, props, and state are the steering wheel and pedals — master these first. Hooks, routing, and performance are the advanced skills you learn later."'
    }
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn — the official guide to React, updated for React 18+.' },
    { label: 'React reference', note: 'react.dev/reference/react — full reference for every hook and API.' }
  ]
};

export default introduction;
