const jsx = {
  id: 'jsx',
  title: 'JSX — JavaScript XML',
  icon: '📝',
  theme: 'orange',
  tagline: 'JSX lets you write HTML-like code inside JavaScript files.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'JSX is a syntax that looks like HTML but works inside JavaScript files. You use it to describe what your UI looks like.',
      'Browsers cannot run JSX directly. A tool called Babel converts it into plain JavaScript before it runs in the browser.'
    ],
    points: [
      'JSX looks like HTML but it is actually JavaScript.',
      'It gets converted to React.createElement() calls automatically.',
      'Every JSX block must have one root element (or use a Fragment <>).'
    ],
    analogy: {
      icon: '🥪',
      title: 'HTML + JavaScript together',
      text: '"JSX mixes HTML structure and JavaScript logic in one file. You can write your markup and the data that drives it — right next to each other."'
    }
  },

  whyUsed: {
    description: 'JSX makes your code much easier to read. Writing nested React.createElement() calls by hand is hard to understand.',
    points: [
      'You can see the UI structure just by reading the code.',
      'You can use { } to put JavaScript values directly in the markup.',
      'Typos in tag names are caught at compile time.',
      'Markup and its logic live in the same file.'
    ],
    code: {
      title: 'JSX vs. plain JavaScript (what it compiles to)',
      snippet: `// What you write (JSX)
const heading = <h1 className="title">Hello, {user.name}!</h1>;

// What it compiles to (plain JS — React.createElement)
const heading = React.createElement(
  'h1',
  { className: 'title' },
  'Hello, ', user.name, '!'
);`
    }
  },

  whenToUse: {
    description: 'You use JSX every time you write a React component. It is the standard way to describe UI in React.',
    points: [
      'When you need to render markup that uses JavaScript values.',
      'When you want to show or hide elements based on a condition.',
      'When you want to loop over a list and render items.',
      'Whenever you build any React component.'
    ]
  },

  howItWorks: {
    description: 'Babel converts your JSX tags into JavaScript function calls. React then uses those to build and update the browser DOM.',
    points: [
      '{ } embeds any JavaScript expression: variables, ternaries, .map() loops.',
      'Use className instead of class. Use onClick instead of onclick.',
      'Self-closing tags need a slash: <img />, <input />, <br />.',
      'Return only one root element. Use <></> (Fragment) to wrap multiple elements.'
    ],
    code: {
      title: 'JSX rules in action',
      snippet: `function ProfileCard({ user, isOnline }) {
  return (
    <> {/* Fragment — no extra wrapper div in the DOM */}
      <img className="avatar" src={user.avatarUrl} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{isOnline ? '🟢 Online' : '⚪ Offline'}</p>
      <ul>
        {user.skills.map(skill => <li key={skill}>{skill}</li>)}
      </ul>
    </>
  );
}`
    }
  },

  flowDiagram: {
    title: 'From JSX you write → to pixels on screen',
    steps: [
      { icon: '✍️', label: 'You write JSX', note: '<h1>{name}</h1>' },
      { icon: '🔧', label: 'Babel compiles', note: 'jsx("h1", { children: name })' },
      { icon: '🌳', label: 'React Element tree', note: 'Plain JS objects describing UI' },
      { icon: '🖥️', label: 'Rendered DOM', note: 'Real <h1> in the browser' }
    ]
  },

  realWorldExamples: {
    intro: 'JSX is used in every React file. Here are common examples:',
    items: [
      { icon: '🛍️', title: 'Product card', description: 'Mixing static markup with dynamic data: name, price, image, and a "Sale!" badge shown only when there is a discount.', code: `<div className="card">\n  <img src={product.image} alt={product.name} />\n  <h3>{product.name}</h3>\n  <p>₹{product.price}</p>\n  {product.discount > 0 && <span className="badge">Sale!</span>}\n</div>` },
      { icon: '📋', title: 'Dynamic list rendering', description: 'Looping over an array with .map() and giving each item a key.', code: `<ul>\n  {todos.map(todo => (\n    <li key={todo.id}>{todo.text}</li>\n  ))}\n</ul>` },
      { icon: '🔔', title: 'Conditional UI', description: 'Showing a notification badge only when there are unread messages.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Easy to read — you can see the UI structure at a glance.',
      'JavaScript values go directly into markup using { }.',
      'Good tool support: highlighting, autocompletion, error checks.',
      'Markup and logic stay in the same file.'
    ],
    cons: [
      'Needs a build step — cannot run JSX directly in the browser.',
      'Beginners sometimes forget it is JavaScript, not HTML.',
      'Deeply nested JSX can get hard to read without splitting into components.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using `class` instead of `className`',
        wrong: `<div class="card">...</div>  // ❌ "class" is a reserved JS word`,
        right: `<div className="card">...</div>  // ✅ maps to the DOM "class" attribute`,
        note: 'In JSX, use className instead of class, and htmlFor instead of for.'
      },
      {
        title: 'Forgetting the `key` when rendering lists',
        wrong: `{items.map(item => <li>{item.name}</li>)}  // ❌ React warns: missing "key"`,
        right: `{items.map(item => <li key={item.id}>{item.name}</li>)}  // ✅`,
        note: 'Keys help React track which items changed. Without keys, lists can re-render incorrectly.'
      },
      {
        title: 'Returning multiple elements without a wrapper',
        wrong: `return (\n  <h1>Title</h1>\n  <p>Text</p>\n);  // ❌ Adjacent JSX elements must be wrapped`,
        right: `return (\n  <>\n    <h1>Title</h1>\n    <p>Text</p>\n  </>\n);  // ✅ Fragment — no extra DOM node`,
        note: 'A component must return one root element. Use <></> to group elements without adding an extra div.'
      },
      {
        title: 'Using if/for statements inside { }',
        wrong: `<div>{ if (loggedIn) { 'Welcome' } }</div>  // ❌ if is a statement, not an expression`,
        right: `<div>{loggedIn ? 'Welcome' : 'Please log in'}</div>  // ✅ ternary is an expression`,
        note: 'Inside { } in JSX, use expressions (ternary, &&) — not if/for statements.'
      }
    ]
  },

  bestPractices: [
    'Wrap multi-line JSX in parentheses to avoid bugs.',
    'Put complex logic in a variable above the return, not inside JSX.',
    'Always use a stable, unique key (an id) when rendering lists.',
    'Use <></> instead of extra wrapper divs when not needed.',
    'If JSX is deeply nested, extract parts into smaller components.'
  ],

  interviewQuestions: [
    { q: 'What is JSX, and is it required to use React?', a: 'JSX is a syntax that lets you write HTML-like markup inside JavaScript. It is not required — you could use React.createElement() directly — but JSX is much more readable and almost all React code uses it.' },
    { q: 'How does JSX get converted into something the browser understands?', a: 'A tool called Babel converts JSX into JavaScript function calls at build time. These become plain JavaScript objects that React uses to build and update the real DOM.' },
    { q: 'Why do we write className instead of class in JSX?', a: 'Because JSX is JavaScript, and class is a reserved word in JavaScript. We use className instead. Similarly, we use htmlFor instead of for.' },
    { q: 'Why does React need a "key" for list items, and why is the array index a bad key?', a: 'Keys help React identify which items in a list changed, were added, or removed. Using the array index as a key causes problems when items are reordered or deleted — React may attach the wrong state to the wrong item. Always use a stable unique id from your data.' }
  ],

  summary: {
    description: 'JSX lets you write HTML-like code inside JavaScript. It gets compiled to plain JavaScript automatically. Remember: use className, add keys to list items, wrap multiple elements in <></>, and only use expressions (not statements) inside { }.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/writing-markup-with-jsx — the official guide to JSX rules.' }
  ]
};

export default jsx;
