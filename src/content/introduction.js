const introduction = {
  id: 'introduction',
  title: 'Introduction to React',
  icon: '⚛️',
  theme: 'sky',
  tagline: 'A JavaScript library for building fast, interactive user interfaces out of small reusable pieces called components.',
  meta: 'Foundations · Start here',

  whatIsIt: {
    description: [
      'React is an open-source JavaScript library (created by Facebook/Meta) used to build user interfaces — especially single-page applications where data changes over time without reloading the page.',
      'Instead of writing one giant HTML page, you break the UI into small, independent, reusable pieces called "components". React then takes care of efficiently updating the screen whenever your data (state) changes.'
    ],
    points: [
      'A library (not a full framework) focused purely on the "view" layer — what the user sees.',
      'Lets you describe *what* the UI should look like for a given state, and React figures out *how* to update the DOM to match.',
      'Built around components, JSX, props, state and a virtual DOM diffing algorithm.'
    ],
    analogy: {
      icon: '🧱',
      title: 'Real-World Analogy',
      text: '"Think of React like LEGO bricks. Instead of carving one giant statue (a traditional HTML page), you build small reusable bricks (components) — a button brick, a card brick, a navbar brick — and snap them together to build anything from a small toy to a massive castle (your app)."'
    }
  },

  whyUsed: {
    description: 'Before React, updating a web page meant manually finding DOM elements and mutating them — slow, error-prone, and hard to scale as an app grows. React solves this by letting you just describe your UI as a function of your data.',
    points: [
      'Declarative: you say "show this when state is X" — React handles the DOM updates for you.',
      'Component-based: UI is split into independent, reusable, testable pieces.',
      'Virtual DOM: React calculates the minimal set of real DOM changes needed, making updates fast.',
      'Huge ecosystem: routing, state management, styling, testing — there is a mature tool for everything.',
      'One codebase, many platforms: React Native lets you reuse React skills/concepts to build mobile apps.'
    ]
  },

  whenToUse: {
    description: 'Reach for React when your UI is dynamic, data-driven, or interactive — not for a static brochure page that never changes.',
    points: [
      'Single-page applications (dashboards, admin panels, social feeds, e-commerce sites).',
      'Apps where the UI must update instantly in response to user actions or live data (chat apps, stock tickers, notifications).',
      'Projects that will grow large and need a maintainable, component-based structure.',
      'Teams that want a huge hiring pool, mature tooling, and long-term community support.'
    ]
  },

  howItWorks: {
    description: 'React keeps an in-memory representation of the UI called the Virtual DOM. When your state changes, React re-renders the affected components in memory, compares ("diffs") the new virtual tree with the previous one, and applies only the minimal real-DOM updates needed.',
    steps: [
      'You describe the UI with components and JSX: "render this markup for this data".',
      'When state/props change, React re-runs the component function to get a new virtual tree.',
      'React diffs the new tree against the previous one (reconciliation).',
      'React commits only the changed parts to the real browser DOM — fast and efficient.'
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
      title: 'Real-World Analogy',
      text: '"React is like a smart film editor. You hand it the new script (new state), and instead of re-shooting the whole movie, it compares the new script to the old one and only re-shoots the scenes that actually changed."'
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
    intro: 'React powers many of the apps you already use every day:',
    items: [
      { icon: '📘', title: 'Facebook & Instagram', description: 'News feeds that update live as you scroll, like, and comment — all without reloading the page.' },
      { icon: '🎬', title: 'Netflix', description: 'Browsing rows of movies, hovering for previews, and instant page transitions are powered by component-based UIs.' },
      { icon: '🛒', title: 'E-commerce dashboards', description: 'Product listings, carts, filters and checkout flows that react instantly to user input.' },
      { icon: '💬', title: 'Real-time chat apps', description: 'Messages appear instantly and the UI updates as new data streams in over WebSockets.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Component reusability dramatically speeds up development.',
      'Virtual DOM makes UI updates fast and efficient.',
      'Massive ecosystem and community — answers to almost any problem already exist.',
      'Backed by Meta and used at enormous scale — battle-tested in production.',
      'Easy to learn the basics; JSX feels natural once you know HTML/JS.'
    ],
    cons: [
      'It is "just a library" — you must choose your own router, state manager, form library, etc.',
      'JSX and the build tooling (bundlers, transpilers) add a learning curve for absolute beginners.',
      'Fast pace of change in the ecosystem can feel overwhelming ("framework fatigue").',
      'SEO and first-paint performance need extra work (SSR/SSG via Next.js, etc.) for content-heavy sites.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Treating React like a full framework',
        note: 'React only handles the view layer. Beginners often expect routing, HTTP requests, or global state to come "built in" — they don\'t. You add libraries like React Router, Axios/fetch, and Redux/Zustand/Context as needed.'
      },
      {
        title: 'Manipulating the DOM directly',
        wrong: `// ❌ Fighting React by reaching into the DOM
document.getElementById('title').innerText = 'New Title';`,
        right: `// ✅ Let state drive the UI — React updates the DOM for you
const [title, setTitle] = useState('Old Title');
return <h1>{title}</h1>;`,
        note: 'Direct DOM manipulation conflicts with React\'s rendering model and causes hard-to-debug inconsistencies.'
      }
    ]
  },

  bestPractices: [
    'Start by sketching your UI as a tree of components before writing code.',
    'Keep components small and focused on one responsibility ("single responsibility principle").',
    'Let state drive the UI — never manually touch the DOM in a React app.',
    'Use the official docs (react.dev) and React DevTools from day one to understand what is rendering and why.',
    'Learn modern JavaScript (ES6+: arrow functions, destructuring, spread/rest, modules) alongside React — React leans on it heavily.'
  ],

  interviewQuestions: [
    { q: 'What is React and why was it created?', a: 'React is a JavaScript library for building user interfaces by composing small, reusable components. It was created at Facebook to solve the problem of keeping complex, frequently-changing UIs in sync with underlying data efficiently and predictably.' },
    { q: 'Is React a framework or a library? What is the difference for you as a developer?', a: 'React is a library focused on the view layer. Unlike a full framework (e.g. Angular), it does not dictate how you handle routing, HTTP requests or state management — you choose and combine those tools yourself, which gives flexibility but requires more upfront decisions.' },
    { q: 'What problem does the Virtual DOM solve?', a: 'Directly mutating the real DOM is slow because it triggers layout/paint work. The Virtual DOM lets React compute the minimal set of real changes in memory first (diffing), then apply just those changes — making UI updates much faster.' },
    { q: 'What does "declarative UI" mean, and how is it different from "imperative"?', a: 'Declarative means you describe *what* the UI should look like for a given state ("show a spinner while loading"), and the library figures out *how* to make the DOM match. Imperative means you write step-by-step instructions to manually change the DOM yourself.' }
  ],

  summary: {
    description: 'React lets you build UIs by composing small, reusable components, describing what the screen should look like for any given state — and letting React efficiently handle updating the real DOM. Master components, JSX, props and state, and the rest of the ecosystem (hooks, routing, performance) builds naturally on top.',
    analogy: {
      icon: '🚦',
      title: 'Real-World Analogy',
      text: '"Learning React is like learning to drive: components/JSX/props/state are the steering wheel and pedals — the fundamentals you must master first. Hooks, routing, and performance optimization are like learning to merge onto highways and parallel park — advanced skills that build on the basics."'
    }
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn — the canonical, up-to-date guide this app is structured to complement.' },
    { label: 'React reference', note: 'react.dev/reference/react — full API reference for every hook and API mentioned across this app.' }
  ]
};

export default introduction;
