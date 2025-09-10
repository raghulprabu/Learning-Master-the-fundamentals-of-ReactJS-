import React from 'react';
import './prop.css';

const ReactProps = () => {
    return (
        <div className="docs-container">
            <header className="prop-header">
                <h1 className="main-title">React Props</h1>
                <p className="subtitle">Pass data from parent to child components</p>
            </header>

            <main className="docs-content">
                <section className="intro-section">
                    <div className="card">
                        <h2>👋 What are Props in React?</h2>
                        <div className="definition-block">
                            <h3>Definition:</h3>
                            <p className="main-definition">
                                <strong>props</strong> (short for properties) are used to pass data from a parent component to a child component.
                            </p>
                            <div className="props-features">
                                <div className="feature-item">
                                    <span className="arrow">➡️</span>
                                    <span>They work like function parameters and are read-only.</span>
                                </div>
                                <div className="feature-item">
                                    <span className="arrow">➡️</span>
                                    <span>In HTML terms, they're similar to attributes.</span>
                                </div>
                            </div>
                        </div>

                        <div className="analogy-box">
                            <div className="analogy-icon">💡</div>
                            <div className="analogy-content">
                                <h4>Real-World Analogy:</h4>
                                <p>"Think of props like filling out a form with different information. The form template stays the same, but you can fill it with different names, ages, and details for different people."</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="syntax-section">
                    <div className="card">
                        <h2>Syntax Example</h2>
                        <div className="code-example">
                            <h3>Parent Component (Sending Data)</h3>
                            <div className="code-block">
                                <pre>
                                    {`// Parent Component
import React from "react";
import Greeting from "./Greeting";

function App() {
  return (
    <div>
      <Greeting name="Raghul" />
      <Greeting name="Prabu" />
    </div>
  );
}

export default App;`}
                                </pre>
                            </div>

                            <h3>Child Component (Receiving Data)</h3>
                            <div className="code-block">
                                <pre>
                                    {`// Child Component
function Greeting(props) {
  return <h2>Hello, {props.name} 👋</h2>;
}`}
                                </pre>
                            </div>
                        </div>

                        <div className="concept-note">
                            <p><strong>Think of them like arguments in a function.</strong></p>
                        </div>
                    </div>
                </section>

                <section className="why-props-section">
                    <div className="card">
                        <h2>❤️ Why we need props</h2>
                        <div className="why-content">
                            <p className="why-description">
                                React components are reusable. Instead of hardcoding data, we make components dynamic using props.
                            </p>
                        </div>

                        <div className="example-comparison">
                            <div className="comparison-item bad">
                                <h4>❌ Without Props (Hardcoded)</h4>
                                <div className="code-block">
                                    <pre>
                                        {`function UserCard() {
  return (
    <div className="card">
      <h3>John Doe</h3>
      <p>Software Developer</p>
    </div>
  );
}`}
                                    </pre>
                                </div>
                                <p className="comparison-note">Limited - can only show John Doe</p>
                            </div>

                            <div className="comparison-item good">
                                <h4>✅ With Props (Dynamic)</h4>
                                <div className="code-block">
                                    <pre>
                                        {`function UserCard(props) {
  return (
    <div className="card">
      <h3>{props.name}</h3>
      <p>{props.job}</p>
    </div>
  );
}

// Can be reused for anyone!
<UserCard name="John Doe" job="Software Developer" />
<UserCard name="Jane Smith" job="Designer" />
<UserCard name="Mike Johnson" job="Manager" />`}
                                    </pre>
                                </div>
                                <p className="comparison-note">Flexible - can show any user</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="importance-section">
                    <div className="card">
                        <h2>👋 Why Props are Important</h2>
                        <div className="importance-grid">
                            <div className="importance-item">
                                <span className="peace">✌️</span>
                                <span>They make components reusable and dynamic.</span>
                            </div>
                            <div className="importance-item">
                                <span className="peace">✌️</span>
                                <span>Instead of hardcoding values, you pass them in.</span>
                            </div>
                            <div className="importance-item">
                                <span className="peace">✌️</span>
                                <span>Props allow data flow from parent → child (one-way binding).</span>
                            </div>
                        </div>

                        <div className="analogy-box">
                            <div className="analogy-icon">🏪</div>
                            <div className="analogy-content">
                                <h4>Real-World Example:</h4>
                                <p>"Like a coffee shop menu template. The menu design stays the same, but you can change the coffee names, prices, and descriptions for different locations."</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="prop-types-section">
                    <div className="card">
                        <h2>👋 Props Can Be Anything</h2>
                        <p className="section-description">Props are not limited to strings/numbers. They can be:</p>

                        <div className="prop-types-grid">
                            <div className="prop-type-card">
                                <h3>📝 Strings</h3>
                                <div className="code-block">
                                    <pre>{`<Welcome message="Hello World" />`}</pre>
                                </div>
                            </div>

                            <div className="prop-type-card">
                                <h3>🔢 Numbers</h3>
                                <div className="code-block">
                                    <pre>{`<Counter count={42} />`}</pre>
                                </div>
                            </div>

                            <div className="prop-type-card">
                                <h3>📋 Arrays</h3>
                                <div className="code-block">
                                    <pre>{`<List items={['Apple', 'Banana', 'Orange']} />`}</pre>
                                </div>
                            </div>

                            <div className="prop-type-card">
                                <h3>📦 Objects</h3>
                                <div className="code-block">
                                    <pre>{`<Profile user={{name: 'John', age: 25}} />`}</pre>
                                </div>
                            </div>

                            <div className="prop-type-card">
                                <h3>⚡ Functions</h3>
                                <div className="code-block">
                                    <pre>{`<Button onClick={() => alert('Clicked!')} />`}</pre>
                                </div>
                            </div>
                        </div>

                        <div className="analogy-box">
                            <div className="analogy-icon">📦</div>
                            <div className="analogy-content">
                                <h4>Real-World Example:</h4>
                                <p>"Like shipping different types of packages - you can send letters (strings), boxes of items (arrays), electronic devices (objects), or even instruction manuals (functions)."</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="children-section">
                    <div className="card">
                        <h2>🖐️ Prop Children</h2>
                        <div className="children-content">
                            <div className="feature-item">
                                <span className="thumbs">👍</span>
                                <span>In React, you can send the content between the opening and closing tags of a component, to another component.</span>
                            </div>
                        </div>

                        <div className="children-example">
                            <h3>Example:</h3>
                            <div className="code-block">
                                <pre>
                                    {`<Childrenchild>
  <h1>This is Front end development courses</h1>
  <h1>This is react js courses complete</h1>
</Childrenchild>`}
                                </pre>
                            </div>

                            <p className="children-note">
                                This can be accessed in the other component using the <code>props.children</code> property.
                            </p>

                            <div className="code-block">
                                <pre>
                                    {`function Childrenchild(props) {
  return (
    <div className="container">
      {props.children}
    </div>
  );
}`}
                                </pre>
                            </div>
                        </div>

                        <div className="analogy-box">
                            <div className="analogy-icon">📄</div>
                            <div className="analogy-content">
                                <h4>Real-World Example:</h4>
                                <p>"Like a picture frame - the frame design stays the same, but you can put any photo or artwork inside it. The 'children' are whatever you put inside the frame."</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="destructuring-section">
                    <div className="card">
                        <h2>🖐️ Props Destructuring</h2>
                        <div className="destructuring-content">
                            <div className="feature-item">
                                <span className="thumbs">👍</span>
                                <span>Instead of writing props.name or props.age repeatedly, we can destructure props directly inside the function parameters.</span>
                            </div>
                        </div>

                        <div className="destructuring-comparison">
                            <div className="comparison-item">
                                <h4>Before Destructuring</h4>
                                <div className="code-block">
                                    <pre>
                                        {`function User(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>Job: {props.job}</p>
    </div>
  );
}`}
                                    </pre>
                                </div>
                            </div>

                            <div className="comparison-item">
                                <h4>After Destructuring ✨</h4>
                                <div className="code-block">
                                    <pre>
                                        {`function User({ name, age, job }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Job: {job}</p>
    </div>
  );
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="usage-example">
                            <h3>Usage:</h3>
                            <div className="code-block">
                                <pre>
                                    {`<User name="Raghul" age={22} job="Developer" />
<User name="Prabu" age={25} job="Designer" />`}
                                </pre>
                            </div>
                        </div>

                        <div className="note-box">
                            <p><strong>Note:</strong> React uses curly brackets to destructure props: <code>{`{color}`}</code>.</p>
                        </div>

                        <div className="analogy-box">
                            <div className="analogy-icon">📋</div>
                            <div className="analogy-content">
                                <h4>Real-World Example:</h4>
                                <p>"Like unpacking a delivery box immediately when it arrives. Instead of saying 'box.phone', 'box.charger', 'box.manual' every time, you unpack everything at once: phone, charger, manual."</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ReactProps;