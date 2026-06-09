const forms = {
  id: 'forms',
  title: 'Forms',
  icon: '📝',
  theme: 'violet',
  tagline: 'Capturing, validating, and submitting user input — controlled vs. uncontrolled inputs and everything in between.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Forms are how users enter data: text fields, checkboxes, radios, selects, file uploads. In React, the central idea is the "controlled component" — an input whose value is driven by React state, and whose changes flow back into that state via onChange.',
      'The alternative, "uncontrolled components", let the DOM itself hold the input\'s value, and you read it on demand (typically with a ref) — closer to traditional HTML forms.'
    ],
    points: [
      'Controlled input: value comes from state, onChange updates that state — React is the "single source of truth".',
      'Uncontrolled input: the DOM holds the value; you read it via a ref (e.g. on submit) instead of tracking every keystroke.',
      'Form submission is handled with onSubmit on the <form> element, almost always paired with e.preventDefault().'
    ],
    analogy: {
      icon: '🎙️',
      title: 'Real-World Analogy',
      text: '"A controlled input is like a karaoke machine with a live lyrics display — every word you sing (type) is instantly captured and shown back to you (state -> value). An uncontrolled input is like singing into a recorder — your performance is captured, but nobody checks it in real time; someone listens to the whole recording only at the end (on submit)."'
    }
  },

  whyUsed: {
    description: 'Forms are the primary way users send information into your app — sign-ups, search, checkout, settings, comments. React\'s controlled-component pattern keeps form state predictable, validated, and easy to wire up to the rest of your UI.',
    points: [
      'Real-time validation & feedback: show "passwords don\'t match" as the user types, not only on submit.',
      'Conditional UI: enable/disable a submit button based on whether required fields are filled.',
      'Formatting on the fly: auto-uppercase, currency formatting, character counters.',
      'Single source of truth: the same state can drive the input, validation messages, previews, and the final submitted payload.'
    ]
  },

  whenToUse: {
    description: 'Forms appear anywhere the user provides structured input — and the choice between controlled/uncontrolled depends on how much you need to *react* to each change.',
    points: [
      'Use controlled inputs (the default, recommended approach) when you need live validation, conditional rendering based on input, formatting, or to keep multiple fields in sync.',
      'Consider uncontrolled inputs (with refs / `defaultValue`) for very simple forms, file inputs (which are inherently uncontrolled), or when integrating with non-React code/libraries.',
      'Use a form library (React Hook Form, Formik) for large/complex forms with many fields, async validation, and intricate submission flows.'
    ]
  },

  howItWorks: {
    description: 'Each input\'s `value` is bound to a piece of state, and its `onChange` handler updates that state with the new value (read from e.target.value, e.target.checked, etc.). Because the value always "comes from" state, React fully controls what\'s displayed — hence "controlled component".',
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
      'A single `name` attribute + one handleChange function can manage many fields via computed object keys ([name]: value).',
      'Checkboxes/radios read e.target.checked instead of e.target.value.',
      '<select> and <textarea> are controlled the same way as <input> in React (unlike raw HTML, where they behave differently).'
    ]
  },

  flowDiagram: {
    title: 'The controlled-input cycle',
    steps: [
      { icon: '⌨️', label: 'User types', note: 'Native "input" event fires' },
      { icon: '📨', label: 'onChange fires', note: 'e.target.value read' },
      { icon: '✏️', label: 'setState updates', note: 'form state gets new value' },
      { icon: '🔁', label: 'Component re-renders', note: 'value={form.field}' },
      { icon: '🖥️', label: 'Input shows new value', note: 'React is the source of truth' }
    ]
  },

  realWorldExamples: {
    intro: 'Forms power some of the most business-critical screens in any product:',
    items: [
      { icon: '🔐', title: 'Login / sign-up', description: 'Controlled fields with live validation, password-visibility toggles, and disabled submit buttons until inputs are valid.' },
      { icon: '🔎', title: 'Search bars with debouncing', description: 'A controlled input whose value, after a short debounce, triggers an API search request — see the dedicated Debouncing topic.' },
      { icon: '🧾', title: 'Multi-step checkout', description: 'Form state spans several "pages" (shipping, payment, review), often lifted into a parent or stored in context/a reducer.' },
      { icon: '⚙️', title: 'Settings/profile forms', description: 'Pre-filled from server data, edited in place, with a "Save changes" button enabled only when something actually changed.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Predictable: the input\'s displayed value is always exactly what\'s in state — easy to reason about and debug.',
      'Enables instant validation, conditional UI, formatting, and cross-field logic.',
      'Plays perfectly with React\'s data flow — no fighting the DOM for the "truth" about a value.',
      'Works great with form libraries that build on the controlled pattern (React Hook Form, Formik).'
    ],
    cons: [
      'Re-renders on every keystroke — usually negligible, but can matter for very large/complex forms (mitigated with field-level libraries or memoization).',
      'More boilerplate for large forms with many fields (one reason form libraries are popular).',
      'File inputs and some browser widgets are inherently uncontrolled — you must use refs/defaultValue for them.'
    ]
  },

  comparison: {
    title: 'Controlled vs. uncontrolled inputs',
    left: {
      title: '✅ Controlled (recommended default)',
      tone: 'good',
      code: `const [name, setName] = useState('');
<input
  value={name}
  onChange={e => setName(e.target.value)}
/>`,
      note: 'React state is the single source of truth — easy to validate, format, and react to changes live.'
    },
    right: {
      title: '🕰️ Uncontrolled (via ref)',
      tone: 'neutral',
      code: `const inputRef = useRef(null);
<input ref={inputRef} defaultValue="" />
// later, e.g. on submit:
console.log(inputRef.current.value);`,
      note: 'The DOM holds the value; you read it on demand. Simpler for trivial forms and required for things like <input type="file">.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Mixing controlled and uncontrolled (the "value without onChange" warning)',
        wrong: `<input value={name} />  // ❌ React warns: "You provided a \`value\` prop without an \`onChange\` handler"`,
        right: `<input value={name} onChange={e => setName(e.target.value)} />  // ✅ fully controlled\n<input defaultValue={name} />                                    // ✅ fully uncontrolled`,
        note: 'An input is either controlled (value + onChange) or uncontrolled (defaultValue, optionally a ref) — picking one half of each creates a "read-only-looking-but-not" input and a console warning.'
      },
      {
        title: 'Forgetting e.preventDefault() in onSubmit',
        wrong: `<form onSubmit={() => sendData(form)}>  // ❌ page reloads, losing all state`,
        right: `<form onSubmit={(e) => { e.preventDefault(); sendData(form); }}>  // ✅`,
      },
      {
        title: 'Validating only on submit (poor UX)',
        note: 'Waiting until submit to tell the user "email is invalid" after they\'ve filled out an entire form is frustrating. Validate as they type/blur, and surface errors near the relevant field for a much better experience.'
      }
    ]
  },

  bestPractices: [
    'Default to controlled components — they integrate best with React\'s data flow and validation patterns.',
    'Use one `handleChange` keyed by the input\'s `name` attribute to manage many fields with one function and one state object.',
    'Always call e.preventDefault() in onSubmit unless you intentionally want the browser\'s default behaviour.',
    'Show validation errors close to their field, and consider validating on blur/change in addition to submit.',
    'For large/complex forms, reach for a battle-tested form library (React Hook Form, Formik) instead of hand-rolling everything.'
  ],

  interviewQuestions: [
    { q: 'What is a "controlled component" in React?', a: 'An input whose displayed value is driven entirely by React state — its `value` prop comes from state, and its `onChange` handler updates that state with whatever the user typed/selected. React is the single source of truth for the input\'s value, which makes validation, formatting, and conditional logic straightforward.' },
    { q: 'What is the difference between controlled and uncontrolled components, and when would you use each?', a: 'Controlled components keep their value in React state (value + onChange); uncontrolled components let the DOM hold the value, which you read on demand via a ref (with defaultValue for an initial value). Controlled is the recommended default for most forms because it integrates with validation/conditional UI; uncontrolled is simpler for trivial cases and is required for things like file inputs.' },
    { q: 'Why does React warn "You provided a value prop to a form field without an onChange handler"?', a: 'Because providing only `value` (without onChange) creates an input that displays a value but can never change it via user typing — effectively a read-only-looking field that confuses users and signals you likely meant either a fully controlled input (value + onChange) or an uncontrolled one (defaultValue).' },
    { q: 'How would you handle a form with many input fields without writing a separate handler for each?', a: 'Give every input a `name` attribute matching a key in your state object, and write one handleChange function that reads e.target.name and e.target.value and updates the corresponding key: setForm(prev => ({ ...prev, [e.target.name]: e.target.value })).' },
    { q: 'How do you prevent a form submission from reloading the page?', a: 'Call e.preventDefault() inside the onSubmit handler attached to the <form> element. This stops the browser\'s default full-page submission/reload so your JavaScript can take over (validate, call an API, navigate programmatically, etc.).' }
  ],

  summary: {
    description: 'Default to controlled inputs — state drives the value, onChange updates it — giving you a predictable single source of truth you can validate, format, and react to instantly. Reserve uncontrolled inputs/refs for simple cases and DOM-only widgets like file pickers, and reach for a form library once forms grow large and complex.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/reference/react-dom/components/input — the controlled vs. uncontrolled component reference and usage notes for form elements.' }
  ]
};

export default forms;
