const liftingStateUp = {
  id: 'liftingStateUp',
  title: 'Lifting State Up',
  icon: '⬆️',
  theme: 'blue',
  tagline: 'Sharing state between components by moving it to their closest common ancestor — the foundation of predictable data flow.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      '"Lifting state up" means: when two or more components need to reflect or react to the *same* changing data, you move that state out of them and into their closest shared parent — then pass it back down via props (data down, callbacks up).',
      'It is not a special API — just a pattern of restructuring where state lives so that a single source of truth can be shared.'
    ],
    points: [
      'Identify which components need the shared data.',
      'Find their closest common ancestor in the component tree.',
      'Move the state (useState/useReducer) to that ancestor.',
      'Pass the value down as props, and pass an updater function down so children can request changes.'
    ],
    analogy: {
      icon: '🏦',
      title: 'Real-World Analogy',
      text: '"Imagine two siblings each keeping their own private piggy bank to track the family\'s shared grocery budget — they will inevitably disagree about the balance. Lifting state up is like putting the money in one shared family jar (the parent) that both siblings can see and contribute to — now there\'s only one true balance, and everyone sees the same number."'
    }
  },

  whyUsed: {
    description: 'When sibling components each keep their own copy of what should be shared data, the copies inevitably drift out of sync — classic symptoms include "I changed it here but it didn\'t update there".',
    points: [
      'Creates one single source of truth that every interested component reads from.',
      'Keeps data flow predictable: down via props, up via callback functions — easy to trace and debug.',
      'Avoids duplicated, conflicting state scattered across sibling components.',
      'A natural stepping stone toward Context/state-management when "lifting" would mean going too many levels up.'
    ]
  },

  whenToUse: {
    description: 'Reach for this pattern the moment two components need to agree on the same piece of changing data.',
    points: [
      'A filter control and a results list that must stay in sync (filter lives in the parent; both children receive it via props).',
      'A form\'s individual fields that need to be validated together (e.g. "confirm password" depends on "password").',
      'An accordion where opening one panel should close the others (the "which panel is open" state lives in the parent).',
      'A shopping cart icon (in the header) that must reflect the same item count as the cart page.'
    ]
  },

  howItWorks: {
    description: 'You move the useState call from the child(ren) to their common parent. The parent then renders each child, passing the current value as a prop, and passing a function (often the setter itself, or a wrapper around it) so children can trigger updates — which re-render the parent and, in turn, every child that depends on that state.',
    code: {
      title: 'Two inputs that must always show the same temperature, in different units',
      snippet: `function TemperatureInput({ label, value, onChange }) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </fieldset>
  );
}

// The PARENT owns the single source of truth
function Calculator() {
  const [celsius, setCelsius] = useState('');

  const fahrenheit = celsius === '' ? '' : (Number(celsius) * 9/5 + 32).toFixed(1);

  return (
    <>
      <TemperatureInput label="Celsius" value={celsius} onChange={setCelsius} />
      <TemperatureInput
        label="Fahrenheit"
        value={fahrenheit}
        onChange={(f) => setCelsius(((Number(f) - 32) * 5/9).toFixed(1))}
      />
    </>
  );
}`
    },
    points: [
      'The "single source of truth" (celsius) lives in Calculator — both inputs derive their displayed value from it.',
      'Each child notifies the parent of changes via the `onChange` callback prop — it never manages its own copy of the shared value.',
      'This is the exact pattern the official React docs use to teach the concept (the "temperature converter" example).'
    ]
  },

  flowDiagram: {
    title: 'Data down, callbacks up',
    steps: [
      { icon: '👴', label: 'Parent owns state', note: 'const [value, setValue] = useState()' },
      { icon: '⬇️', label: 'Passes value via props', note: '<ChildA value={value} />' },
      { icon: '🧒', label: 'Child renders & reacts', note: 'Displays the shared value' },
      { icon: '📣', label: 'Child calls callback prop', note: 'onChange(newValue)' },
      { icon: '🔁', label: 'Parent updates & re-renders', note: 'All children stay in sync' }
    ]
  },

  realWorldExamples: {
    intro: 'Lifting state up is everywhere two or more pieces of UI must "agree":',
    items: [
      { icon: '🔎', title: 'Search filter + result list', description: 'The search/filter text lives in the parent; both the <FilterBar> and <ResultsList> read from and (for the bar) update it.' },
      { icon: '🛒', title: 'Cart icon + cart page', description: 'Cart items live in a parent (or context once it grows); the header badge and the cart page both reflect the same count.' },
      { icon: '🪗', title: 'Accordion / tabs', description: 'The "currently open panel/tab" index lives in the parent so opening one can automatically close the others.' },
      { icon: '🔑', title: 'Linked password fields', description: '"Password" and "Confirm password" both need to be compared — validation logic lives in the shared parent form.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Creates a clear single source of truth — eliminates "which copy is correct?" bugs.',
      'Keeps data flow traceable and debuggable (you can always find where state "really" lives).',
      'Requires no extra libraries — it is a pattern built entirely on props and callbacks.',
      'A natural, incremental step before reaching for Context or external state-management.'
    ],
    cons: [
      'If overused, the "common ancestor" can end up far away, causing deep prop drilling.',
      'The parent can become bloated with state and logic that conceptually belongs to its children.',
      'Every state change in the lifted state re-renders the parent and all subscribed children — usually fine, but worth knowing for performance-sensitive trees (memoization helps).'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Keeping duplicate state in both parent and child "just in case"',
        wrong: `// Child keeps its OWN copy as well as receiving a prop
function Input({ value }) {
  const [local, setLocal] = useState(value); // ❌ now there are two sources of truth
  ...
}`,
        right: `// Child is fully controlled by the parent — no local duplicate
function Input({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />; // ✅
}`,
        note: 'Once you lift state up, the child should be "dumb" about that piece of data — render what it\'s given, and ask the parent (via callback) to change it.'
      },
      {
        title: 'Lifting state too far up "just to be safe"',
        note: 'If only two sibling components need to share a value, lift it to *their* common parent — not all the way to the app root. Lifting further than necessary causes unnecessary prop drilling and re-renders of unrelated parts of the tree.'
      }
    ]
  },

  bestPractices: [
    'Lift state to the *closest* common ancestor that needs it — no further.',
    'Once lifted, make the children fully controlled by props — avoid keeping a duplicate local copy.',
    'Pass down small, focused callback props (onSelect, onChange) rather than the raw setState function when the child shouldn\'t know the shape of the state.',
    'If lifting would require passing data through many unrelated layers, consider Context or a state-management tool instead.',
    'Document (with comments or naming) which component "owns" a piece of shared state so it stays clear as the app grows.'
  ],

  interviewQuestions: [
    { q: 'What does "lifting state up" mean in React?', a: 'It means moving a piece of state from a child component (or several sibling components that each had their own copy) up to their closest common ancestor, so that single ancestor becomes the one source of truth — and passing the value down via props plus callback functions for children to request changes.' },
    { q: 'Why is it a problem for sibling components to each keep their own copy of shared data?', a: 'Each copy can be updated independently, so they inevitably drift out of sync — one component shows stale or different data than another, even though conceptually they represent "the same thing". This produces confusing bugs like "I updated it here, but it didn\'t change there".' },
    { q: 'How do you decide *where* to lift state to?', a: 'Find the closest common ancestor of every component that needs to read or write that state — not higher (to avoid unnecessary prop drilling and re-renders) and not lower (or some components won\'t have access to it).' },
    { q: 'How does data flow after you lift state up — and how do children request changes?', a: 'Data flows down from the parent to children as props (the current value). Children cannot modify props directly, so they call a callback function — also passed down as a prop (e.g. onChange) — which the parent uses to update its own state, triggering a re-render that flows the new value back down to everyone.' }
  ],

  summary: {
    description: 'Lifting state up is the simplest, no-library way to keep multiple components in sync: find their closest common ancestor, move the state there, and pass the value down as props with callbacks flowing changes back up. Master this pattern and you\'ll know exactly when (and when not) to reach for Context or external state management.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/sharing-state-between-components — the canonical "lifting state up" walkthrough (the temperature-converter example).' }
  ]
};

export default liftingStateUp;
