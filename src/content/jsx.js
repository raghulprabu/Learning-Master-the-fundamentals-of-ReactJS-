const jsx = {
  id: 'jsx',
  title: 'JSX — JavaScript XML',
  icon: '📝',
  theme: 'orange',
  tagline: 'A syntax extension that lets you write HTML-like markup directly inside JavaScript.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'JSX (JavaScript XML) is a syntax extension for JavaScript that looks like HTML but works inside .js/.jsx files. It lets you describe what the UI should look like using a markup-like syntax, while still being plain JavaScript under the hood.',
      'Browsers can\'t run JSX directly — tools like Babel compile it into regular JavaScript function calls (React.createElement(...)) before the code ships.'
    ],
    points: [
      'Looks like HTML, but it is actually syntactic sugar for React.createElement() calls.',
      'Lets you mix markup and JavaScript logic in the same file — e.g. {user.name} inside a <h1>.',
      'Every JSX expression must return a single root element (or a Fragment <>...</>).'
    ],
    analogy: {
      icon: '🥪',
      title: 'Real-World Analogy',
      text: '"JSX is like a sandwich that mixes bread (HTML structure) and filling (JavaScript logic) in one bite. You don\'t have to keep switching between separate template files and script files — everything that describes one piece of UI lives together."'
    }
  },

  whyUsed: {
    description: 'JSX exists because describing UI is naturally visual — and writing nested React.createElement() calls by hand is verbose and hard to read.',
    points: [
      'Much more readable than nested function calls — you can "see" the UI structure at a glance.',
      'Lets you embed dynamic JavaScript values directly into markup using curly braces { }.',
      'Catches more errors at compile time (e.g. typos in tag names) thanks to tooling support.',
      'Keeps related rendering logic and markup together instead of spreading them across template files.'
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
    description: 'You use JSX every time you write a React component\'s render output — it is the default, idiomatic way to describe UI in React (you could use createElement() directly, but virtually nobody does).',
    points: [
      'Whenever you need to render markup that depends on JavaScript values (props, state, computed data).',
      'When you need to conditionally show/hide elements, loop over lists, or compose components together.',
      'Any time you want your markup and the logic that drives it to live side-by-side for readability.'
    ]
  },

  howItWorks: {
    description: 'Babel (the compiler React projects use) transforms JSX tags into React.createElement(type, props, children) calls (or, with the modern JSX transform, calls to jsx()/jsxs() from react/jsx-runtime). React then turns those calls into a tree of "React elements" — lightweight JS objects describing the UI — which it uses to build and update the real DOM.',
    points: [
      'Curly braces { } embed any JavaScript expression: variables, function calls, ternaries, map() loops.',
      'JSX attributes use camelCase (className instead of class, onClick instead of onclick) because they map to DOM/JS properties.',
      'Self-closing tags need a trailing slash: <img />, <input />, <br />.',
      'A component must return a single parent — wrap multiple siblings in a <div> or a Fragment <>...</>.'
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
    intro: 'JSX is the bread-and-butter of every React file you will ever write:',
    items: [
      { icon: '🛍️', title: 'Product card', description: 'Mixing static markup with dynamic data: name, price, image, and a "Sale!" badge shown only when discount > 0.', code: `<div className="card">\n  <img src={product.image} alt={product.name} />\n  <h3>{product.name}</h3>\n  <p>₹{product.price}</p>\n  {product.discount > 0 && <span className="badge">Sale!</span>}\n</div>` },
      { icon: '📋', title: 'Dynamic list rendering', description: 'Looping over an array of todos with .map() and giving each item a stable key.', code: `<ul>\n  {todos.map(todo => (\n    <li key={todo.id}>{todo.text}</li>\n  ))}\n</ul>` },
      { icon: '🔔', title: 'Conditional UI', description: 'Showing a notification badge only when there are unread messages, using a ternary or &&.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Highly readable — UI structure is visible at a glance, close to the final HTML.',
      'Embeds JavaScript logic directly where it is needed, reducing context-switching.',
      'Strong tooling support: syntax highlighting, autocompletion, compile-time error checks.',
      'Encourages component composition because nesting markup feels natural.'
    ],
    cons: [
      'Requires a build step (Babel/compiler) — cannot run directly in the browser.',
      'New developers sometimes confuse it with HTML and forget it is "JavaScript in disguise" (camelCase props, expressions only — no statements).',
      'Large, deeply-nested JSX trees can become hard to read if components aren\'t broken down.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Using `class` instead of `className`',
        wrong: `<div class="card">...</div>  // ❌ "class" is a reserved JS word`,
        right: `<div className="card">...</div>  // ✅ maps to the DOM "class" attribute`,
        note: 'Because JSX is JavaScript, reserved words like class and for must be renamed to className and htmlFor.'
      },
      {
        title: 'Forgetting a unique `key` when rendering lists',
        wrong: `{items.map(item => <li>{item.name}</li>)}  // ❌ React warns: missing "key"`,
        right: `{items.map(item => <li key={item.id}>{item.name}</li>)}  // ✅`,
        note: 'Keys help React identify which items changed, were added, or removed — without them, lists can re-render incorrectly or lose state.'
      },
      {
        title: 'Returning multiple top-level elements without a wrapper',
        wrong: `return (\n  <h1>Title</h1>\n  <p>Text</p>\n);  // ❌ Adjacent JSX elements must be wrapped`,
        right: `return (\n  <>\n    <h1>Title</h1>\n    <p>Text</p>\n  </>\n);  // ✅ Fragment — no extra DOM node`,
        note: 'A component must return one root node. Fragments (<>...</>) let you group elements without adding an extra <div> to the DOM.'
      },
      {
        title: 'Putting statements (if/for) directly inside { }',
        wrong: `<div>{ if (loggedIn) { 'Welcome' } }</div>  // ❌ if is a statement, not an expression`,
        right: `<div>{loggedIn ? 'Welcome' : 'Please log in'}</div>  // ✅ ternary is an expression`,
        note: 'Curly braces in JSX only accept *expressions* (things that produce a value) — use ternaries, &&, or extract logic into a variable/function before the return.'
      }
    ]
  },

  bestPractices: [
    'Wrap multi-line JSX in parentheses for readability and to avoid automatic-semicolon-insertion bugs.',
    'Extract complex conditional or list-rendering logic into named variables/functions before the `return` to keep JSX scannable.',
    'Always provide a stable, unique `key` (an id, not the array index) when rendering lists.',
    'Use Fragments (<>...</>) instead of wrapper <div>s when you don\'t need an extra DOM node.',
    'Keep JSX trees shallow — if a block is nested 4-5 levels deep, it is a sign to extract a child component.'
  ],

  interviewQuestions: [
    { q: 'What is JSX, and is it required to use React?', a: 'JSX is a syntax extension that lets you write UI markup inside JavaScript. It is not strictly required — you could call React.createElement() directly — but JSX is dramatically more readable and is the convention used in virtually all React code.' },
    { q: 'How does JSX get converted into something the browser understands?', a: 'A compiler such as Babel transforms JSX tags at build time into React.createElement(type, props, children) calls (or jsx()/jsxs() calls with the modern automatic runtime), producing plain JavaScript objects (React elements) that the browser and React can work with.' },
    { q: 'Why do we write className instead of class, and onClick instead of onclick in JSX?', a: 'Because JSX is JavaScript, `class` is a reserved keyword, so React uses `className` (mirroring the DOM property `element.className`). Event handlers use camelCase (onClick, onChange) to match how DOM event properties are named in JavaScript, and to clearly signal they take a function, not a string.' },
    { q: 'Why does React want a unique "key" prop when rendering lists, and why is the array index a bad choice?', a: 'Keys give React a stable identity for each list item across renders, so it can correctly match, reorder, add or remove DOM nodes and preserve component state. The array index changes whenever items are inserted/removed/reordered, which can cause React to mismatch items and produce subtle bugs (wrong state attached to the wrong row) — a stable id from your data is the right choice.' }
  ],

  summary: {
    description: 'JSX is "HTML-flavoured JavaScript" — a readable way to describe UI that compiles down to plain JS function calls. Remember: it\'s expressions only inside { }, camelCase attributes, a single root element (or Fragment), and unique keys for lists. Master these rules and JSX will feel as natural as writing HTML.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/writing-markup-with-jsx — the canonical walkthrough of JSX rules and the "Rules of JSX".' }
  ]
};

export default jsx;
