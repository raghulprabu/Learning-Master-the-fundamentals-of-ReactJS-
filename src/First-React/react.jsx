// import React from 'react';

import './style.css';

const ReactDocs = () => {
    return (
        <div className="docs-container">
            <header className="docs-header">
                <h1 className="main-title"> 👋 Welcome React World </h1>
                <p className="subtitle"> The library for web and native user interfaces</p>
            </header>

            <main className="docs-content">
                <section className="intro-section">
                    <div className="card">
                        <h2>Getting Started with React</h2>
                        <div className="code-block">
                            <pre>
                                {`import React from 'react'  //!  first set up to start React js 
const react = () => {
  return (
    <div style={{display:"flex", alignItems:'center', flexDirection:'column' }}>
        <h1> Hello ✌️ React World  </h1>
        <h1> ➡️ How to Work virtual DOM </h1>
    </div>
  )
}
export default react`}
                            </pre>
                        </div>
                    </div>
                </section>

                <section className="overview-section">
                    <div className="card">
                        <h2>What is React?</h2>
                        <div className="feature-list">
                            <div className="feature-item">
                                <span className="arrow">➡️</span>
                                <span>React is a JavaScript library for building user interfaces.</span>
                            </div>
                            <div className="feature-item">
                                <span className="arrow">➡️</span>
                                <span>React is used to build single-page applications.</span>
                            </div>
                            <div className="feature-item">
                                <span className="arrow">➡️</span>
                                <span>React allows us to create reusable UI components.</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="virtual-dom-section">
                    <div className="card">
                        <h2>❤️ How does React Work?</h2>
                        <div className="content-block">
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>React creates a VIRTUAL DOM in memory.</span>
                            </div>
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>React creates a virtual DOM, which is the lightweight copy of the real DOM in the object form. What the changes are visible immediately after you save the file, you do not have to reload the browser!</span>
                            </div>
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>With every change in the component state or props, React creates a new virtual DOM compare/analyze the changes between the new virtual DOM</span>
                            </div>
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>Updating a virtual DOM is much faster and efficient than the actual DOM, as updating a virtual DOM does not require heavy web browser processing like painting and recalibrating the space. It involves updating the JavaScript object directly</span>
                            </div>
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>When the root elements of the Virtual DOM trees have different types, React's diffing algorithm discards the entire old DOM tree and constructs a new one from scratch</span>
                            </div>
                        </div>
                        <div className="virtual-image-container">
                            <img src="/Gif/work dom.webp" alt="Virtual DOM Diagram WebP" className="virtual-image" />
                        </div>
                    </div>
                </section>

                <section className="render-section">
                    <div className="card">
                        <h2>👋 React Render HTML</h2>
                        <div className="content-block">
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>React renders HTML to the web page via a container, and a function called createRoot().</span>
                            </div>
                        </div>

                        <h3>👋 The Container</h3>
                        <div className="content-block">
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>This container is a &lt;div id="root"&gt;&lt;/div&gt; element in the index.html file.</span>
                            </div>
                        </div>

                        <h3>👋 The createRoot Function</h3>
                        <div className="content-block">
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>The createRoot() function takes one argument, an HTML element.</span>
                            </div>
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>The purpose of the function is to define the HTML element where a React component should be displayed.</span>
                            </div>
                        </div>

                        <h3>👋 The render Method</h3>
                        <div className="content-block">
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>Did you notice the render method?</span>
                            </div>
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>The render method defines what to render in the HTML container.</span>
                            </div>
                            <div className="highlight-item">
                                <span className="thumbs">👍</span>
                                <span>The result is displayed in the &lt;div id="root"&gt; element.</span>
                            </div>
                        </div>

                        <div className="code-block">
                            <pre>
                                {`import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')).render(
   <p>Welcome!</p>
)`}
                            </pre>
                        </div>
                        <p className="note">Note: the element id does not have to be "root", but this is the standard convention.</p>
                    </div>
                </section>

                <section className="thinking-section">
                    <div className="card">
                        <h2>Thinking React</h2>
                        <div className="content-block">
                            <div className="concept-item">
                                <span className="peace">✌️</span>
                                <span><strong>React idea</strong> → Break your app into small pieces (called components).</span>
                                <p className="example">Example: Button, Search bar, Table row.</p>
                            </div>
                            <div className="concept-item">
                                <span className="peace">✌️</span>
                                <span><strong>Visual states</strong> → Each component can look different depending on data.</span>
                                <p className="example">Example: "Out of stock" text turns red.</p>
                            </div>
                            <div className="concept-item">
                                <span><strong>Data flow</strong> → Components are connected, and data passes from parent → child.</span>
                                <p className="example">Example: Search bar sends text → table filters products.</p>
                            </div>
                        </div>

                        <h3>👉 In the tutorial, they show this by building a searchable product table:</h3>
                        <ul className="tutorial-list">
                            <li>Split into SearchBar + ProductTable + ProductRow.</li>
                            <li>Add states like "in stock / not in stock".</li>
                            <li>Connect them so typing in search updates the table.</li>
                        </ul>

                        <div className="conclusion">
                            <p>That's all React is: break into components → handle states → connect with data flow 🚀</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ReactDocs;