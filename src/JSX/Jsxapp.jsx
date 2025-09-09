import React from 'react';
import './jsx.css';

const ReactJSX = () => {
  return (
    <div className="docs-container">
      <header className="jsx-header">
        <h1 className="main-title">JSX</h1>
        <p className="subtitle">JavaScript XML - Write HTML in React</p>
      </header>

      <main className="docs-content">
        <section className="intro-section">
          <div className="card">
            <h2>👋 What is JSX</h2>
            <div className="jsx-features">
              <div className="feature-item">
                <span className="thumbs">👍</span>
                <span>JSX stands for JavaScript XML.</span>
              </div>
              <div className="feature-item">
                <span className="thumbs">👍</span>
                <span>JSX allows us to write HTML in React. Convert html tag into React.</span>
              </div>
              <div className="feature-item">
                <span className="thumbs">👍</span>
                <span>JSX makes it easier to write and add HTML in React.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="optional-section">
          <div className="card">
            <h2>JSX Usage</h2>
            <div className="usage-points">
              <div className="usage-item">
                <span className="arrow">➡️</span>
                <span>You are not required to use JSX, but JSX makes it easier to write React applications.</span>
              </div>
              <div className="usage-item">
                <span className="arrow">➡️</span>
                <span>JSX and React are two separate things. They're often used together, but you can use them independently of each other. JSX is a syntax extension, while React is a JavaScript library.</span>
              </div>
              <div className="usage-item">
                <span className="arrow">➡️</span>
                <span>JSX is an extension of the JavaScript language based on ES6, and is translated into regular JavaScript at runtime.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="expressions-section">
          <div className="card">
            <h2>👋 Expressions</h2>
            <div className="expressions-content">
              <div className="expression-item">
                <span className="thumbs">👍</span>
                <span>You can insert any valid JavaScript expression inside JSX by wrapping it in curly braces <code>{`{ }`}</code>.</span>
              </div>
              <div className="expression-item">
                <span className="thumbs">👍</span>
                <span>React will evaluate the expression and render the result in the DOM.</span>
              </div>
            </div>
            <div className="code-example">
              <h3>Example:</h3>
              <div className="code-block">
                <pre>
                  {`const name = "World";
const element = <h1>Hello, {name}!</h1>;

// JSX with expressions
const user = {
  firstName: 'John',
  lastName: 'Doe'
};

const greeting = (
  <h1>
    Hello, {user.firstName} {user.lastName}!
  </h1>
);`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="compiler-section">
          <div className="card">
            <h2>👋 How JS Works and What is Compiler in React And JS</h2>

            <div className="compiler-intro">
              <div className="compiler-item">
                <span className="arrow">➡️</span>
                <span>Babel is used in React for Convert JSX to actual JavaScript</span>
              </div>
              <div className="compiler-item">
                <span className="arrow">➡️</span>
                <span>A React compiler is any tool that transforms React code (JSX + modern JavaScript) into executable JavaScript that browsers can understand.</span>
              </div>
            </div>

            <div className="babel-features">
              <h3>Babel Compiler Features</h3>
              <div className="babel-grid">
                <div className="babel-feature">
                  <span className="thumbs">👍</span>
                  <span>Babel is a JS compiler and transpiler.</span>
                </div>
                <div className="babel-feature">
                  <span className="thumbs">👍</span>
                  <span>Transforms modern JS, JSX, and TypeScript to compatible JS.</span>
                </div>
                <div className="babel-feature">
                  <span className="thumbs">👍</span>
                  <span>Works in three steps: parse → transform → generate code.</span>
                </div>
                <div className="babel-feature">
                  <span className="thumbs">👍</span>
                  <span>Essential in React projects to handle JSX and ES6+ features.</span>
                </div>
                <div className="babel-feature">
                  <span className="thumbs">👍</span>
                  <span>Supports plugins, presets, and polyfills for custom transformations.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="transformation-section">
          <div className="card">
            <h2>JSX Transformation Process</h2>
            <div className="transformation-flow">
              <div className="transform-step">
                <h3>1. JSX Code</h3>
                <div className="code-block">
                  <pre>
                    {`const element = <h1>Hello World!</h1>;`}
                  </pre>
                </div>
              </div>
              <div className="transform-arrow">↓ Babel Transform ↓</div>
              <div className="transform-step">
                <h3>2. JavaScript Code</h3>
                <div className="code-block">
                  <pre>
                    {`const element = React.createElement(
  'h1',
  null,
  'Hello World!'
);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <div className="card">
            <h2>JSX Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">📝</div>
                <h3>Familiar Syntax</h3>
                <p>Write HTML-like syntax in JavaScript</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🔄</div>
                <h3>Dynamic Content</h3>
                <p>Embed JavaScript expressions easily</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🛠️</div>
                <h3>Tool Support</h3>
                <p>Better IDE support and error checking</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">⚡</div>
                <h3>Performance</h3>
                <p>Optimized compilation to JavaScript</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReactJSX;