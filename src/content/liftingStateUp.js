const liftingStateUp = {
  id: 'liftingStateUp',
  title: 'Lifting State Up',
  icon: '⬆️',
  theme: 'blue',
  tagline: 'When two components need the same data, move that state to their common parent and pass it down as props.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      '"Lifting state up" means moving state from a child component to its parent — so that multiple children can share the same data.',
      'It is not a special API. It is just a pattern: move state up, pass the value down as props, and pass a setter function down so children can request changes.'
    ],
    points: [
      'Find the components that need the shared data.',
      'Find their closest common parent in the component tree.',
      'Move the useState call to that parent.',
      'Pass the value down as props. Pass the setter down as a callback.'
    ],
    analogy: {
      icon: '🏦',
      title: 'Like a shared family jar',
      text: '"Two siblings each keeping their own piggy bank for the same shared budget will disagree. Lifting state up is like putting the money in one shared family jar (the parent). Both siblings see the same balance. There is only one source of truth."'
    }
  },

  whyUsed: {
    description: 'When sibling components each have their own copy of shared data, the copies get out of sync. One shows old data while the other shows new data.',
    points: [
      'Creates one single source of truth for shared data.',
      'Data flows one way: down via props, up via callbacks — easy to trace.',
      'Eliminates the "I changed it here but it did not update there" bug.',
      'A natural step before using Context or a state management library.'
    ]
  },

  whenToUse: {
    description: 'Use this pattern the moment two components need to agree on the same piece of changing data.',
    points: [
      'A filter control and a results list that must stay in sync.',
      'A form with fields that need to be validated together.',
      'An accordion where opening one panel closes the others.',
      'A cart icon in the header that shows the same count as the cart page.'
    ]
  },

  howItWorks: {
    description: 'Move the useState call from the child to the parent. The parent passes the current value down as a prop and passes the setter down as a callback. When the child calls the callback, the parent updates its state and re-renders all children.',
    code: {
      title: 'Two inputs that stay in sync — temperature converter',
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
      'The single source of truth (celsius) lives in Calculator — both inputs get their value from it.',
      'Each child tells the parent about changes via the onChange callback prop.',
      'The child never manages its own copy of the shared value.'
    ]
  },

  flowDiagram: {
    title: 'Data down, callbacks up',
    steps: [
      { icon: '👴', label: 'Parent owns state', note: 'const [value, setValue] = useState()' },
      { icon: '⬇️', label: 'Passes value via props', note: '<ChildA value={value} />' },
      { icon: '🧒', label: 'Child renders the value', note: 'Displays the shared data' },
      { icon: '📣', label: 'Child calls callback prop', note: 'onChange(newValue)' },
      { icon: '🔁', label: 'Parent updates and re-renders', note: 'All children stay in sync' }
    ]
  },

  realWorldExamples: {
    intro: 'Lifting state up is used wherever two or more pieces of UI must agree:',
    items: [
      { icon: '🔎', title: 'Search filter + result list', description: 'The search text lives in the parent. Both the <FilterBar> and <ResultsList> read from it.' },
      { icon: '🛒', title: 'Cart icon + cart page', description: 'Cart items live in a parent (or context). The header badge and cart page both show the same count.' },
      { icon: '🪗', title: 'Accordion / tabs', description: '"Which tab is open" lives in the parent so opening one closes the others.' },
      { icon: '🔑', title: 'Password + confirm password', description: 'Both fields need to be compared in the same parent form.' }
    ]
  },

  prosAndCons: {
    pros: [
      'One source of truth — no "which copy is correct?" bugs.',
      'Data flow is easy to trace: it goes down as props and up as callbacks.',
      'No extra libraries — just props and callbacks.',
      'A natural step before using Context.'
    ],
    cons: [
      'If the parent is far away, you get deep prop drilling.',
      'The parent can get bloated with state that logically belongs to its children.',
      'Every state change re-renders the parent and all children that use that state.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Keeping a duplicate copy of state in the child',
        wrong: `// Child keeps its own copy AND receives a prop
function Input({ value }) {
  const [local, setLocal] = useState(value); // ❌ two sources of truth
  ...
}`,
        right: `// Child is fully controlled — no local copy
function Input({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />; // ✅
}`,
        note: 'Once state is lifted to the parent, the child should just use the value from props. Do not keep a duplicate in the child.'
      },
      {
        title: 'Lifting state too far up',
        note: 'Lift state to the closest parent that needs it — not all the way to the app root. Lifting too far causes unnecessary prop drilling and re-renders.'
      }
    ]
  },

  bestPractices: [
    'Lift state to the closest common ancestor — no further.',
    'Once lifted, make the child fully controlled by props — no duplicate local state.',
    'Pass small, focused callbacks (onSelect, onChange) rather than the raw setState.',
    'If prop drilling gets deep (3+ levels), use Context instead.',
    'Document which component "owns" a piece of shared state.'
  ],

  interviewQuestions: [
    { q: 'What does "lifting state up" mean in React?', a: 'It means moving a piece of state from a child component (or sibling components) up to their closest common ancestor. That ancestor becomes the single source of truth. The value is passed down as props, and children call a callback prop to request changes.' },
    { q: 'Why is it a problem for siblings to each keep their own copy of shared data?', a: 'Each copy is updated independently, so they will drift out of sync. You get bugs like "I updated it here but it did not change there." There is no single source of truth.' },
    { q: 'How do you decide where to lift state to?', a: 'Find the closest common ancestor of every component that needs to read or write that data. Lift it there — not higher (to avoid prop drilling) and not lower (or some components will not have access).' },
    { q: 'How do children request changes after state is lifted to the parent?', a: 'The parent passes a callback function as a prop (like onChange). When the child needs to update the data, it calls that callback with the new value. The parent updates its state and re-renders, sending the new value back down to all children.' }
  ],

  summary: {
    description: 'Lifting state up is the simplest way to share data between components. Move the state to the closest common parent, pass the value down as props, and pass a callback down so children can request changes. Master this pattern before reaching for Context or state management libraries.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/sharing-state-between-components — the official lifting state up guide with the temperature-converter example.' }
  ]
};

export default liftingStateUp;
