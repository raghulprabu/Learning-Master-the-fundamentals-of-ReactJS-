const composition = {
  id: 'composition',
  title: 'Component Composition',
  icon: '🪆',
  theme: 'pink',
  tagline: 'Building complex UIs by combining small components together — React\'s answer to inheritance.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Composition is the practice of building complex components out of simpler ones by *combining* them — nesting components inside one another, passing components as props, and using the special `children` prop — rather than by *extending* them through class inheritance.',
      'The official React team\'s guidance is explicit: "React has a powerful composition model, and we recommend using composition instead of inheritance to reuse code between components."'
    ],
    points: [
      'Containment: a component doesn\'t know its children ahead of time — it just renders `{props.children}` wherever it wants (e.g. <Card>, <Modal>, <Layout>).',
      'Specialization: a "more specific" component renders a "more generic" one and configures it with props (e.g. <WelcomeDialog> renders <Dialog title="Welcome">).',
      'Slots: passing multiple distinct pieces of JSX as separate props (header, footer, sidebar) for layouts that need more than one "hole" to fill.'
    ],
    analogy: {
      icon: '🪆',
      title: 'Real-World Analogy',
      text: '"Composition is like Russian nesting dolls (matryoshka) combined with a sandwich shop. You build complex flavours by nesting/wrapping simple, well-made pieces inside one another — a <Page> wraps a <Layout>, which wraps a <Card>, which wraps your content — instead of trying to bake one giant cake that does everything at once."'
    }
  },

  whyUsed: {
    description: 'Other UI paradigms reuse code via class inheritance ("Dialog extends BaseDialog extends BaseModal..."). React deliberately steers away from that — deep inheritance hierarchies become rigid and hard to change. Composition keeps things flexible.',
    points: [
      'Avoids deep, fragile inheritance chains — instead you assemble independent pieces like building blocks.',
      'Makes components more flexible and reusable — a <Card> doesn\'t care *what* is inside it.',
      'Naturally solves "wrapper" problems: modals, layouts, providers, list containers, all without prop-explosion.',
      'Keeps each piece small, focused, and independently testable — composition is what lets "many small components" add up to a big app.'
    ]
  },

  whenToUse: {
    description: 'Composition isn\'t an optional add-on — it\'s the normal way you build any non-trivial React UI. Reach for these specific techniques when:',
    points: [
      'Containment (children): you\'re building a generic wrapper/container — Card, Modal, Layout, Tooltip, Provider.',
      'Specialization: you have several variants of a more general component — PrimaryButton/DangerButton built on a generic Button.',
      'Slots (multiple props holding JSX): a layout needs distinct named regions — <PageLayout sidebar={...} header={...}>{content}</PageLayout>.',
      'You catch yourself wanting to "extend" a component\'s behaviour — almost always, wrapping/composing is the React-idiomatic answer instead.'
    ]
  },

  howItWorks: {
    description: 'Composition leans on two simple mechanisms you already know: nesting JSX (which populates `props.children`), and passing components/elements as regular props. Combine these and you can build remarkably flexible, reusable building blocks.',
    code: {
      title: 'Containment, specialization, and slots',
      snippet: `// 1) CONTAINMENT — a generic wrapper that doesn't know its content
function Card({ children }) {
  return <div className="card">{children}</div>;
}
<Card><h2>Title</h2><p>Any content at all</p></Card>

// 2) SPECIALIZATION — a specific component built on a generic one
function Dialog({ title, children }) {
  return <Modal><h2>{title}</h2>{children}</Modal>;
}
function WelcomeDialog() {
  return <Dialog title="Welcome!">Thanks for visiting our spacecraft!</Dialog>;
}

// 3) SLOTS — multiple "named holes" via separate props
function PageLayout({ header, sidebar, children }) {
  return (
    <div className="page">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}
<PageLayout header={<Navbar />} sidebar={<FilterPanel />}>
  <ProductGrid />
</PageLayout>`
    }
  },

  flowDiagram: {
    title: 'Composing small pieces into a full page',
    steps: [
      { icon: '🧱', label: '<Button>', note: 'Smallest reusable piece' },
      { icon: '🃏', label: '<Card>', note: 'Wraps content via children' },
      { icon: '📐', label: '<Layout>', note: 'Slots: header / sidebar / main' },
      { icon: '📄', label: '<Page>', note: 'Composes Layout + Cards + Buttons' }
    ]
  },

  realWorldExamples: {
    intro: 'Composition is the secret behind every flexible, professional component library:',
    items: [
      { icon: '🪟', title: 'Modal / Dialog systems', description: 'A generic <Modal> handles overlay, focus-trapping, and closing — while consumers pass in completely different content as children.' },
      { icon: '🧭', title: 'Layout systems', description: 'A <DashboardLayout sidebar={...} header={...}> renders the same chrome around totally different page content across an app.' },
      { icon: '🔘', title: 'Themed buttons', description: '<PrimaryButton> and <DangerButton> are thin specializations that render a shared <Button variant="..."> with preset props.' },
      { icon: '🎛️', title: 'Provider stacking', description: '<ThemeProvider><AuthProvider><App /></AuthProvider></ThemeProvider> — composition is literally how cross-cutting concerns are layered.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Maximizes reuse and flexibility without rigid class hierarchies.',
      'Keeps components small, focused, and independently understandable.',
      'Solves "wrapper" UI problems (modals, layouts, providers) elegantly via children/slots.',
      'Mirrors how designers think (atoms -> molecules -> organisms -> pages), making collaboration smoother.'
    ],
    cons: [
      'Excessive nesting/wrapping ("wrapper hell") can make the component tree harder to navigate in DevTools.',
      'Choosing between "more props" vs "more composition" takes practice — both extremes have downsides.',
      'Slot-heavy APIs (many JSX-holding props) can become confusing if not named and documented clearly.'
    ]
  },

  comparison: {
    title: 'Composition vs. inheritance',
    intro: 'React deliberately favors one of these — knowing why will make your component APIs much cleaner:',
    left: {
      title: '✅ Composition (the React way)',
      tone: 'good',
      code: `function Button({ variant, children, ...props }) {
  return <button className={\`btn btn-\${variant}\`} {...props}>{children}</button>;
}
function DangerButton(props) {
  return <Button variant="danger" {...props} />;
}`,
      note: 'Flexible: combine small pieces however you like; no rigid hierarchy to maintain.'
    },
    right: {
      title: '❌ Inheritance (not the React way)',
      tone: 'bad',
      code: `class Button extends React.Component { /* ... */ }
class DangerButton extends Button { /* override render() */ }
// Brittle: deep chains become hard to change without breaking subclasses`,
      note: 'React components don\'t need (and the team explicitly recommends against) class-based inheritance for code reuse.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Adding more and more configuration props instead of composing',
        wrong: `<Card showHeader showFooter showIcon iconType="warning" headerText="..." footerLinks={[...]} />\n// ❌ a "god component" with 10+ booleans/strings controlling its shape`,
        right: `<Card>\n  <CardHeader>{...}</CardHeader>\n  <CardBody>{...}</CardBody>\n  <CardFooter>{...}</CardFooter>\n</Card>\n// ✅ composed from focused sub-components — far more flexible`,
        note: 'When a component\'s prop list balloons to control *what shape* it renders (not just its data), that\'s usually a sign to switch from configuration props to composition.'
      },
      {
        title: 'Forgetting that `children` is just a regular prop',
        note: 'Beginners sometimes think `children` is "magic". It isn\'t — it\'s simply the prop React populates with whatever JSX you nest between a component\'s tags. You can pass it explicitly too: <Card children={<p>Hi</p>} />, though nesting is far more readable.'
      }
    ]
  },

  bestPractices: [
    'Default to composition over configuration — prefer `<Card><Header/></Card>` over `<Card headerProps={...}>`.',
    'Use `children` for "fill in the blank" containers, and named JSX-holding props ("slots") when you need more than one region.',
    'Build specialized components as thin wrappers around generic ones (DangerButton wraps Button) rather than duplicating markup.',
    'Keep each composed piece small and focused — that\'s what makes the combinations powerful.',
    'When you find yourself wanting to "extend" a component\'s rendering, reach for composition (wrap it / pass it as a child) instead of inheritance.'
  ],

  interviewQuestions: [
    { q: 'What is "composition" in React, and why does the React team recommend it over inheritance?', a: 'Composition means building complex UIs by combining/nesting smaller components — via the children prop, passing components as props, or specialized wrappers around generic components — rather than via class inheritance. The React team recommends it because composition keeps components flexible and decoupled, while inheritance hierarchies tend to become rigid, deeply nested, and hard to change without breaking subclasses.' },
    { q: 'What is the `children` prop, and how does it enable the "containment" pattern?', a: 'children is a special prop automatically populated with whatever JSX is nested between a component\'s opening and closing tags. It lets you build generic "container" components (Card, Modal, Layout) that don\'t need to know in advance what content they will display — they simply render {children} wherever appropriate.' },
    { q: 'What is "specialization" in the context of composition, and can you give an example?', a: 'Specialization is when a more specific component is expressed in terms of a more generic one — e.g. a generic <Dialog title={...}> component is reused inside a more specific <WelcomeDialog> that supplies a fixed title and content. It\'s composition\'s answer to what inheritance ("WelcomeDialog extends Dialog") would otherwise be used for.' },
    { q: 'When would you choose composition over adding more configuration props to a component?', a: 'When a component\'s prop list is growing to control its *shape/structure* (lots of booleans/strings toggling whole sections) rather than just its data — that signals the component is trying to be too many things. Splitting it into smaller composable pieces (e.g. <Card><CardHeader/><CardBody/></Card>) is more flexible, readable, and maintainable than an ever-growing configuration API.' }
  ],

  summary: {
    description: 'Composition — nesting components, passing JSX via `children` and named "slot" props, and building specialized components on top of generic ones — is how React achieves flexible code reuse without inheritance. Internalize "containment, specialization, slots" and you\'ll naturally design component APIs the way the rest of the React ecosystem does.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-props-to-a-component#passing-jsx-as-children — passing JSX as children, the foundation of composition; also see the classic "Composition vs Inheritance" guidance in the React docs.' }
  ]
};

export default composition;
