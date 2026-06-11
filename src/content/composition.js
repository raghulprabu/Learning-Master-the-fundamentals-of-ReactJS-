const composition = {
  id: 'composition',
  title: 'Component Composition',
  icon: '🪆',
  theme: 'pink',
  tagline: 'Composition means building complex UIs by combining small components together.',
  meta: 'Foundations',

  whatIsIt: {
    description: [
      'Composition means building big components out of small ones by nesting them together.',
      'React recommends composition instead of inheritance to reuse code between components.'
    ],
    points: [
      'Containment: render `{props.children}` to accept any content inside.',
      'Specialization: a specific component wraps a generic one with preset props.',
      'Slots: pass multiple JSX pieces as separate props for named regions.'
    ],
    analogy: {
      icon: '🪆',
      title: 'Real-World Analogy',
      text: '"Composition is like nesting dolls. You put small pieces inside bigger pieces. A <Card> wraps a <Button>. A <Page> wraps a <Layout>. Each piece does one thing well."'
    }
  },

  whyUsed: {
    description: 'Inheritance creates long, rigid chains that are hard to change. Composition keeps components flexible and easy to reuse.',
    points: [
      'Avoids long, fragile inheritance chains.',
      'Makes components flexible — a <Card> works with any content.',
      'Solves wrapper problems: modals, layouts, providers.',
      'Keeps each piece small and independently testable.'
    ]
  },

  whenToUse: {
    description: 'Use composition whenever you build wrappers, containers, or variants of a component.',
    points: [
      'Containment: building Card, Modal, Layout, Tooltip.',
      'Specialization: PrimaryButton and DangerButton built on a generic Button.',
      'Slots: a layout needs separate header, sidebar, and main areas.',
      'When you want to "extend" a component — wrap it instead.'
    ]
  },

  howItWorks: {
    description: 'Nesting JSX fills `props.children`. You can also pass components as regular props for named slots.',
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
    intro: 'Composition is the secret behind every flexible component library:',
    items: [
      { icon: '🪟', title: 'Modal / Dialog systems', description: 'A generic <Modal> handles overlay and closing. Consumers pass in different content as children.' },
      { icon: '🧭', title: 'Layout systems', description: 'A <DashboardLayout> renders the same chrome around different page content across the app.' },
      { icon: '🔘', title: 'Themed buttons', description: '<PrimaryButton> and <DangerButton> are thin wrappers that render a shared <Button> with preset props.' },
      { icon: '🎛️', title: 'Provider stacking', description: '<ThemeProvider><AuthProvider><App /></AuthProvider></ThemeProvider> — composition layers cross-cutting concerns.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Maximizes reuse without rigid class hierarchies.',
      'Keeps components small and easy to understand.',
      'Solves modal, layout, and provider problems with children and slots.',
      'Matches how designers think: atoms to molecules to pages.'
    ],
    cons: [
      'Too much nesting can make the component tree hard to read in DevTools.',
      'Choosing "more props" vs "more composition" takes practice.',
      'Slot-heavy APIs can be confusing if not named clearly.'
    ]
  },

  comparison: {
    title: 'Composition vs. inheritance',
    intro: 'React deliberately favors composition. Here is why:',
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
      note: 'React components do not need class-based inheritance for code reuse.'
    }
  },

  commonMistakes: {
    items: [
      {
        title: 'Adding more and more configuration props instead of composing',
        wrong: `<Card showHeader showFooter showIcon iconType="warning" headerText="..." footerLinks={[...]} />\n// ❌ a "god component" with 10+ booleans controlling its shape`,
        right: `<Card>\n  <CardHeader>{...}</CardHeader>\n  <CardBody>{...}</CardBody>\n  <CardFooter>{...}</CardFooter>\n</Card>\n// ✅ composed from focused sub-components — far more flexible`,
        note: 'When a component\'s prop list grows to control its shape, switch to composition.'
      },
      {
        title: 'Forgetting that `children` is just a regular prop',
        note: '`children` is the prop React fills with whatever JSX you nest between a component\'s tags. You can also pass it explicitly: <Card children={<p>Hi</p>} />.'
      }
    ]
  },

  bestPractices: [
    'Default to composition over configuration.',
    'Use `children` for fill-in-the-blank containers.',
    'Use named JSX props (slots) when you need more than one region.',
    'Build specialized components as thin wrappers around generic ones.',
    'When you want to extend a component, wrap it instead.'
  ],

  interviewQuestions: [
    { q: 'What is "composition" in React, and why does the React team recommend it over inheritance?', a: 'Composition means building complex UIs by combining smaller components — using children, passing components as props, or wrapping generic components. The React team recommends it because it keeps components flexible and easy to change. Inheritance creates rigid hierarchies that break when you update a parent class.' },
    { q: 'What is the `children` prop, and how does it enable the "containment" pattern?', a: '`children` is a special prop filled with whatever JSX you nest between a component\'s tags. It lets you build generic container components like Card or Modal that do not need to know their content in advance.' },
    { q: 'What is "specialization" in the context of composition?', a: 'Specialization is when a specific component is built on top of a generic one. For example, a <WelcomeDialog> renders a generic <Dialog> with a fixed title and content. This is composition\'s answer to what inheritance would otherwise be used for.' },
    { q: 'When would you choose composition over adding more configuration props?', a: 'When a component\'s prop list is growing to control its shape — lots of booleans toggling whole sections — that is a sign to split it into composable pieces. <Card><CardHeader/><CardBody/></Card> is more flexible and readable than <Card headerProps={...} bodyProps={...} />.' }
  ],

  summary: {
    description: 'Composition — nesting components, using children, and building specialized wrappers on generic ones — is how React reuses code without inheritance. Learn containment, specialization, and slots to design clean component APIs.'
  },

  furtherReading: [
    { label: 'Official docs', note: 'react.dev/learn/passing-props-to-a-component#passing-jsx-as-children — passing JSX as children, the foundation of composition.' }
  ]
};

export default composition;
