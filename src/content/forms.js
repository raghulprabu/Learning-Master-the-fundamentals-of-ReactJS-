const forms = {
  id: 'forms',
  title: 'Forms',
  icon: '📝',
  theme: 'violet',
  tagline: 'Forms let users enter data. In React, you usually connect each input to state so you can read and validate the value.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Forms collect input from users — text, checkboxes, dropdowns, radio buttons. In React, the standard approach is a "controlled component": the input\'s value comes from state, and you update that state on every change.',
      'The alternative is an "uncontrolled component": the DOM holds the value and you read it only when you need it (usually on submit) using a ref.'
    ],
    points: [
      'Controlled input: value comes from state, onChange updates the state. React controls the value.',
      'Uncontrolled input: the DOM holds the value. You read it with a ref (ref.current.value).',
      'Form submission uses onSubmit on the <form> element, always paired with e.preventDefault().'
    ],
    analogy: {
      icon: '🎙️',
      title: 'Controlled vs. uncontrolled',
      text: '"A controlled input is like a karaoke display that shows every word as you type. An uncontrolled input is like a voice recorder — it captures everything but nobody checks it until the end."'
    }
  },

  whyUsed: {
    description: 'Forms are how users send data into your app — sign-ups, search, settings, comments. Connecting inputs to state makes validation and dynamic behaviour easy.',
    points: [
      'Real-time validation: show "password too short" as the user types.',
      'Conditional UI: disable the submit button until all fields are filled.',
      'Formatting: auto-format phone numbers or currency as the user types.',
      'One source of truth: the same state drives the input, validation, preview, and submit.'
    ]
  },

  whenToUse: {
    description: 'Use controlled inputs (the default) whenever you need to react to each change. Use uncontrolled inputs for simple forms or file uploads.',
    points: [
      'Use controlled when you need live validation, dependent fields, or real-time formatting.',
      'Use uncontrolled (with refs) for simple forms or file inputs (which are always uncontrolled).',
      'For large forms with many fields, use a library like React Hook Form or Formik.'
    ]
  },

  howItWorks: {
    description: 'Each input\'s value is bound to a state value. The onChange handler updates the state with the new value every time the user types. React then re-renders the input with the updated value.',
    code: {
      title: 'A controlled sign-up form with validation',
      snippet: `function SignUpForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email.includes('@')) newErrors.email = 'Enter a valid email';
    if (form.password.length < 8) newErrors.password = 'Min 8 characters';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) submitToServer(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      {errors.email && <p className="error">{errors.email}</p>}
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      {errors.password && <p className="error">{errors.password}</p>}
      <button type="submit">Create account</button>
    </form>
  );
}`
    },
    points: [
      'One handleChange can manage many fields using the input\'s name attribute: [e.target.name]: value.',
      'Checkboxes read e.target.checked instead of e.target.value.',
      'In React, <select> and <textarea> work the same way as <input>.'
    ]
  },

  flowDiagram: {
    title: 'The controlled input cycle',
    steps: [
      { icon: '⌨️', label: 'User types', note: 'Native "input" event fires' },
      { icon: '📨', label: 'onChange fires', note: 'e.target.value is read' },
      { icon: '✏️', label: 'State updates', note: 'form state gets new value' },
      { icon: '🔁', label: 'Component re-renders', note: 'value={form.field}' },
      { icon: '🖥️', label: 'Input shows new value', note: 'React is the source of truth' }
    ]
  },

  realWorldExamples: {
    intro: 'Forms are in almost every important screen of any app:',
    items: [
      { icon: '🔐', title: 'Login / sign-up', description: 'Controlled fields with live validation, password visibility toggle, and a disabled submit button until all fields are valid.' },
      { icon: '🔎', title: 'Search bars with debouncing', description: 'A controlled input that triggers an API search after a short delay. See the Debouncing topic.' },
      { icon: '🧾', title: 'Multi-step checkout', description: 'Form state for shipping, payment, and review steps. Lifted to a parent or stored in context.' },
      { icon: '⚙️', title: 'Settings forms', description: 'Pre-filled from the server. "Save changes" button only enables when something actually changed.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Predictable: the input always shows exactly what is in state.',
      'Easy live validation, formatting, and conditional UI.',
      'Fits naturally with React\'s one-way data flow.',
      'Works well with form libraries like React Hook Form.'
    ],
    cons: [
      'Re-renders on every keystroke — usually fine, can matter for very large forms.',
      'More code for large forms with many fields.',
      'File inputs and some browser widgets are always uncontrolled.'
    ]
  },

  comparison: {
    title: 'Controlled vs. uncontrolled inputs',
    left: {
      title: '✅ Controlled (recommended)',
      tone: 'good',
      code: `const [name, setName] = useState('');
<input
  value={name}
  onChange={e => setName(e.target.value)}
/>`,
      note: 'React state holds the value. Easy to validate and react to changes live.'
    },
    right: {
      title: '🕰️ Uncontrolled (via ref)',
      tone: 'neutral',
      code: `const inputRef = useRef(null);
<input ref={inputRef} defaultValue="" />
// later, e.g. on submit:
console.log(inputRef.current.value);`,
      note: 'The DOM holds the value. You read it when you need it. Simpler for trivial forms.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Setting value without onChange (read-only input)',
        wrong: `<input value={name} />  // ❌ React warns: no onChange handler`,
        right: `<input value={name} onChange={e => setName(e.target.value)} />  // ✅ controlled\n<input defaultValue={name} />  // ✅ uncontrolled`,
        note: 'An input must be either fully controlled (value + onChange) or fully uncontrolled (defaultValue). Mixing them creates a broken read-only input.'
      },
      {
        title: 'Forgetting e.preventDefault() in onSubmit',
        wrong: `<form onSubmit={() => sendData(form)}>  // ❌ page reloads`,
        right: `<form onSubmit={(e) => { e.preventDefault(); sendData(form); }}>  // ✅`,
      },
      {
        title: 'Validating only on submit',
        note: 'Showing all errors only after the user submits is frustrating. Validate as the user types or when they leave a field. Show errors near the relevant field.'
      }
    ]
  },

  bestPractices: [
    'Default to controlled components — they work best with React.',
    'Use one handleChange with the input\'s name attribute to manage many fields with one function.',
    'Always call e.preventDefault() in onSubmit.',
    'Show validation errors near the field, ideally as the user types.',
    'For large forms, use React Hook Form or Formik.'
  ],

  interviewQuestions: [
    { q: 'What is a "controlled component" in React?', a: 'A controlled component is an input whose value is driven by React state. The value prop comes from state, and the onChange handler updates that state. React is the single source of truth for the input\'s value.' },
    { q: 'What is the difference between controlled and uncontrolled inputs?', a: 'Controlled: value comes from state, every change updates state. Uncontrolled: the DOM holds the value, you read it with a ref when you need it. Use controlled for most forms. Use uncontrolled for simple cases or file inputs.' },
    { q: 'Why does React warn about a value prop without an onChange handler?', a: 'Because giving an input a value but no onChange makes it a read-only input that the user cannot change. You either need onChange to make it fully controlled, or use defaultValue to make it uncontrolled.' },
    { q: 'How do you handle many input fields with one function?', a: 'Give every input a name attribute matching a key in your state object. Write one handleChange that reads e.target.name and e.target.value and updates the state: setForm(prev => ({ ...prev, [e.target.name]: e.target.value })).' },
    { q: 'How do you stop a form from reloading the page on submit?', a: 'Call e.preventDefault() inside the onSubmit handler on the <form> element. This stops the browser\'s default submission behaviour so your JavaScript can take over.' }
  ],

  summary: {
    description: 'Use controlled inputs by default: state drives the value, onChange updates it. This gives you a predictable single source of truth that is easy to validate. Call e.preventDefault() on submit. For large forms, use a library like React Hook Form.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react-dom/components/input — the official guide to controlled and uncontrolled form elements.' }
  ]
};

export default forms;
