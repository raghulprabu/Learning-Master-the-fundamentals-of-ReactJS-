import React from 'react';
import './component.css';

const ReactComponents = () => {
  return (
    <div className="docs-container">
      <header className="comp-header">
        <h1 className="main-title">React Components</h1>
        <p className="subtitle">Independent and reusable pieces of code</p>
      </header>

      <main className="docs-content">
        <section className="intro-section">
          <div className="card">
            <h2>➡️ What is Components</h2>
            <div className="definition-block">
              <p className="main-definition">
                Components are <strong>Independent</strong> and <strong>Reusable</strong> bit of code. 
                They serve the same purposes as JavaScript Function code but working isolated and return HTML.
              </p>
            </div>
          </div>
        </section>

        <section className="types-section">
          <div className="card">
            <h2>✌️ Component Types</h2>
            <div className="types-grid">
              <div className="type-card">
                <h3>Function Based Components</h3>
                <p>Modern approach using JavaScript functions</p>
              </div>
              <div className="type-card">
                <h3>Class Based Components</h3>
                <p>Traditional approach using ES6 classes</p>
              </div>
            </div>
          </div>
        </section>

        <section className="syntax-section">
          <div className="card">
            <h2>➡️ Syntax</h2>
            <div className="syntax-explanation">
              <p className="syntax-note">Function name starts with uppercase</p>
            </div>
            <div className="code-block">
              <pre>
{`const Components = () => {  ---> function name start with uppercase 
  return (
    <>
      
    </>
  )
}
export default Components`}
              </pre>
            </div>
          </div>
        </section>

        <section className="concepts-section">
          <div className="card">
            <h2>React Component Concepts</h2>
            
            <div className="concept-group">
              <div className="concept-item">
                <h3>➡️ React Idea</h3>
                <p className="concept-description">
                  Break your app into small pieces (called components).
                </p>
                <div className="example-box">
                  <span className="example-label">Example:</span>
                  <span className="example-text">Button, Search bar, Table row.</span>
                </div>
              </div>

              <div className="concept-item">
                <h3>✌️ Visual States</h3>
                <p className="concept-description">
                  Each component can look different depending on data.
                </p>
                <div className="example-box">
                  <span className="example-label">Example:</span>
                  <span className="example-text">"Out of stock" text turns red.</span>
                </div>
              </div>

              <div className="concept-item">
                <h3>✌️ Data Flow</h3>
                <p className="concept-description">
                  Components are connected, and data passes from parent → child.
                </p>
                <div className="example-box">
                  <span className="example-label">Example:</span>
                  <span className="example-text">Search bar sends text → table filters products.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="key-points-section">
          <div className="card">
            <h2>Key Component Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔄</div>
                <h3>Reusable</h3>
                <p>Write once, use anywhere in your application</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏗️</div>
                <h3>Independent</h3>
                <p>Each component works in isolation with its own logic</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📋</div>
                <h3>Returns HTML</h3>
                <p>Components return JSX that renders as HTML</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔧</div>
                <h3>Function-like</h3>
                <p>Similar to JavaScript functions but for UI elements</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReactComponents;