import React from 'react';
import './hook.css';

const ReactHooks = () => {
  return (
    <div className="docs-container">
      <header className="hook-header">
        <h1 className="main-title">React Hooks</h1>
        <p className="subtitle">Special functions to add superpowers to functional components</p>
      </header>

      <main className="docs-content">
        <section className="intro-section">
          <div className="card">
            <h2>🖐️ What is a Hook?</h2>
            <div className="hook-features">
              <div className="feature-item">
                <span className="thumbs">👍</span>
                <span>Hooks are functions that let you "hook into" React state and lifecycle features from functional components.</span>
              </div>
              <div className="feature-item">
                <span className="thumbs">👍</span>
                <span>A common way to optimize re-rendering performance is to skip unnecessary work.</span>
              </div>
              <div className="feature-item">
                <span className="thumbs">👍</span>
                <span>It is Special functions for functional components.</span>
              </div>
            </div>
            
            <div className="analogy-box">
              <div className="analogy-icon">🎣</div>
              <div className="analogy-content">
                <h4>Real-World Analogy:</h4>
                <p>"Think of hooks like fishing hooks that let you 'catch' special React features. Just like how a fishing hook lets you catch fish from the water, React hooks let you catch state and lifecycle features for your components."</p>
              </div>
            </div>
          </div>
        </section>

        <section className="why-needed-section">
          <div className="card">
            <h2>🖐️ Why needed?</h2>
            <div className="why-content">
              <p className="why-description">
                Before hooks, we had to use class components for things like state and lifecycle. 
                Hooks make it possible in function components, which are simpler.
              </p>
            </div>
            
            <div className="before-after-comparison">
              <div className="comparison-item before">
                <h4>❌ Before Hooks (Class Components)</h4>
                <div className="code-block">
                  <pre>
{`class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => 
          this.setState({count: this.state.count + 1})
        }>
          Increment
        </button>
      </div>
    );
  }
}`}
                  </pre>
                </div>
                <p className="comparison-note">Complex - Need classes, constructors, this.state</p>
              </div>
              
              <div className="comparison-item after">
                <h4>✅ After Hooks (Functional Components)</h4>
                <div className="code-block">
                  <pre>
{`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
                  </pre>
                </div>
                <p className="comparison-note">Simple - Clean functions, easy to understand</p>
              </div>
            </div>
            
            <div className="concept-note">
              <p><strong>👉 Think of hooks as shortcuts to add special powers to your components.</strong></p>
            </div>
            
            <div className="analogy-box">
              <div className="analogy-icon">🔌</div>
              <div className="analogy-content">
                <h4>Real-World Example:</h4>
                <p>"Like plugging accessories into your laptop. Before hooks, you needed a big desktop computer (class component) to use advanced features. Now with hooks, you can plug those same features into your lightweight laptop (functional component)."</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rules-section">
          <div className="card">
            <h2>🚩 Hook Rules</h2>
            <p className="rules-intro">There are 3 rules for hooks:</p>
            
            <div className="rules-list">
              <div className="rule-item">
                <div className="rule-number">1</div>
                <div className="rule-content">
                  <h4>👉 Hooks can only be called inside React function components.</h4>
                  <div className="rule-example">
                    <div className="example-grid">
                      <div className="example-item correct">
                        <h5>✅ Correct</h5>
                        <div className="code-block">
                          <pre>
{`function MyComponent() {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}`}
                          </pre>
                        </div>
                      </div>
                      <div className="example-item incorrect">
                        <h5>❌ Incorrect</h5>
                        <div className="code-block">
                          <pre>
{`function regularFunction() {
  const [state, setState] = useState(0); // ❌
  return state;
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rule-item">
                <div className="rule-number">2</div>
                <div className="rule-content">
                  <h4>👉 Hooks can only be called at the top level of a component.</h4>
                  <div className="import-example">
                    <p><strong>Import example:</strong> <code>import {`{ useState }`} from 'react';</code></p>
                  </div>
                  <div className="rule-example">
                    <div className="example-grid">
                      <div className="example-item correct">
                        <h5>✅ Correct - Top Level</h5>
                        <div className="code-block">
                          <pre>
{`function MyComponent() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  
  if (name) {
    return <div>Hello {name}</div>;
  }
  return <div>Enter name</div>;
}`}
                          </pre>
                        </div>
                      </div>
                      <div className="example-item incorrect">
                        <h5>❌ Incorrect - Inside Condition</h5>
                        <div className="code-block">
                          <pre>
{`function MyComponent() {
  if (someCondition) {
    const [name, setName] = useState(''); // ❌
  }
  return <div>Hello</div>;
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rule-item">
                <div className="rule-number">3</div>
                <div className="rule-content">
                  <h4>👉 Hooks cannot be conditional</h4>
                  <div className="rule-example">
                    <div className="example-grid">
                      <div className="example-item correct">
                        <h5>✅ Correct - Always Called</h5>
                        <div className="code-block">
                          <pre>
{`function MyComponent({ shouldShow }) {
  const [count, setCount] = useState(0);
  
  if (shouldShow) {
    return <div>{count}</div>;
  }
  return null;
}`}
                          </pre>
                        </div>
                      </div>
                      <div className="example-item incorrect">
                        <h5>❌ Incorrect - Conditional Hook</h5>
                        <div className="code-block">
                          <pre>
{`function MyComponent({ shouldShow }) {
  if (shouldShow) {
    const [count, setCount] = useState(0); // ❌
  }
  return <div>Hello</div>;
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="note-box">
              <p><strong>Note:</strong> Hooks will not work in React class components.</p>
            </div>
            
            <div className="analogy-box">
              <div className="analogy-icon">🏗️</div>
              <div className="analogy-content">
                <h4>Real-World Example:</h4>
                <p>"Think of hook rules like building a house foundation. You must lay the foundation (hooks) first, in order, and completely - you can't decide halfway through construction to add or skip foundation blocks based on weather conditions."</p>
              </div>
            </div>
          </div>
        </section>

        <section className="summary-section">
          <div className="card">
            <h2>Summary (Concept → Example → Real-Time)</h2>
            
            <div className="summary-definition">
              <h3>Hooks = Special functions for functional components.</h3>
            </div>
            
            <div className="hooks-examples">
              <div className="hook-example-card">
                <h4>useState → Store values</h4>
                <p className="hook-description">(like variables that survive renders)</p>
                <div className="real-example">
                  <span className="example-icon">🛒</span>
                  <span><strong>Example:</strong> Cart items, dark/light mode toggle.</span>
                </div>
                <div className="code-snippet">
                  <div className="code-block">
                    <pre>
{`// Shopping cart example
const [cartItems, setCartItems] = useState([]);
const [isDarkMode, setIsDarkMode] = useState(false);

// Add item to cart
const addToCart = (item) => {
  setCartItems([...cartItems, item]);
};

// Toggle theme
const toggleTheme = () => {
  setIsDarkMode(!isDarkMode);
};`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="hook-example-card">
                <h4>useEffect → Run side effects</h4>
                <div className="real-example">
                  <span className="example-icon">🌐</span>
                  <span><strong>Example:</strong> Fetch API data when page loads.</span>
                </div>
                <div className="code-snippet">
                  <div className="code-block">
                    <pre>
{`// Fetch user data when component loads
useEffect(() => {
  fetch('/api/users')
    .then(response => response.json())
    .then(data => setUsers(data));
}, []); // Empty array means run once on load

// Update document title
useEffect(() => {
  document.title = \`Cart (\${cartItems.length} items)\`;
}, [cartItems]); // Run when cartItems changes`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="hook-example-card">
                <h4>Other Hooks</h4>
                <p className="hook-description">For context, optimization, and DOM access.</p>
                <div className="other-hooks-list">
                  <div className="other-hook-item">
                    <strong>useContext:</strong> Share data without props drilling
                  </div>
                  <div className="other-hook-item">
                    <strong>useRef:</strong> Access DOM elements directly
                  </div>
                  <div className="other-hook-item">
                    <strong>useMemo:</strong> Cache expensive calculations
                  </div>
                  <div className="other-hook-item">
                    <strong>useCallback:</strong> Cache functions to prevent re-renders
                  </div>
                </div>
              </div>
            </div>
            
            <div className="real-time-usage">
              <h3>🚀 Real-Time Usage</h3>
              <p>Every app (Login, Dashboard, E-commerce, Todo) uses hooks heavily.</p>
              
              <div className="app-examples">
                <div className="app-example">
                  <h4>🔐 Login App</h4>
                  <ul>
                    <li><code>useState</code> for username/password</li>
                    <li><code>useEffect</code> to check if user is logged in</li>
                    <li><code>useContext</code> to share user data globally</li>
                  </ul>
                </div>
                
                <div className="app-example">
                  <h4>📊 Dashboard App</h4>
                  <ul>
                    <li><code>useState</code> for charts data and filters</li>
                    <li><code>useEffect</code> to fetch analytics data</li>
                    <li><code>useMemo</code> to cache heavy calculations</li>
                  </ul>
                </div>
                
                <div className="app-example">
                  <h4>🛍️ E-commerce App</h4>
                  <ul>
                    <li><code>useState</code> for cart, wishlist, search</li>
                    <li><code>useEffect</code> to load products, track views</li>
                    <li><code>useContext</code> for cart data across pages</li>
                  </ul>
                </div>
                
                <div className="app-example">
                  <h4>✅ Todo App</h4>
                  <ul>
                    <li><code>useState</code> for todo list and filters</li>
                    <li><code>useEffect</code> to save to localStorage</li>
                    <li><code>useRef</code> to focus on new todo input</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="analogy-box">
              <div className="analogy-icon">🎮</div>
              <div className="analogy-content">
                <h4>Real-World Example:</h4>
                <p>"Think of hooks like game power-ups. useState is like a health potion (keeps your data alive), useEffect is like a radar (watches for changes and reacts), and other hooks are like special abilities that make your game character (component) more powerful and efficient."</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReactHooks;