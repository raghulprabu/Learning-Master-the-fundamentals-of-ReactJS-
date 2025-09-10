import React, { useState, useEffect } from 'react';
import "./Hoc.css"

// HOC Example Components
const withLoading = (Component) => {
  return function WithLoadingComponent(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
};

const withAuth = (Component) => {
  return function WithAuthComponent(props) {
    const [isAuthenticated] = useState(true); // Simulated auth state

    if (!isAuthenticated) {
      return <div>Please log in to continue</div>;
    }

    return <Component {...props} />;
  };
};

// Sample components
const UserProfile = ({ name }) => (
  <div style={{ padding: '1rem', background: '#e8f5e8', borderRadius: '4px' }}>
    <h3>User Profile</h3>
    <p>Welcome, {name}!</p>
  </div>
);

const Dashboard = () => (
  <div style={{ padding: '1rem', background: '#e8f0ff', borderRadius: '4px' }}>
    <h3>Dashboard</h3>
    <p>Your dashboard content here...</p>
  </div>
);

// Enhanced components using HOCs
const UserProfileWithLoading = withLoading(UserProfile);
const DashboardWithAuth = withAuth(Dashboard);
const SuperEnhancedProfile = withAuth(withLoading(UserProfile));

export default function HOCNotes() {
  return (
    <>
      <div className="docs-container">
        <header className="header">
          <h1 className="main-title">Higher Order Components (HOC)</h1>
          <p className="subtitle">Advanced React Pattern for Component Enhancement</p>
        </header>

        <div className="card">
          <div className="card-header">
            <span className="icon">🖐️</span>
            <h2 className="card-title">What is a Higher Order Component?</h2>
          </div>
          
          <div className="definition">
            <p><strong>A Higher Order Component (HOC) is like a wrapper that adds extra features to your React components.</strong></p>
            <p><strong>Note:</strong> HOCs are functions that take a component and return an enhanced version of that component.</p>
          </div>

          <div className="analogy">
            <div className="analogy-text">
              "Think of it like putting a case on your phone - the case adds new features (like water protection) without changing the phone itself."
            </div>
          </div>

          <div className="key-points">
            <h3>Key Points:</h3>
            <ul>
              <li>HOCs are functions, not components</li>
              <li>They take a component as input and return a new component</li>
              <li>They don't modify the original component</li>
              <li>They enable code reuse and separation of concerns</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="icon">⚡</span>
            <h2 className="card-title">Real-time Examples</h2>
          </div>

          <div className="code-section">
            <h3 className="code-title">1. Loading HOC Example</h3>
            <div className="code-block">
{`const withLoading = (Component) => {
  return function WithLoadingComponent(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
};`}
            </div>

            <div className="live-example">
              <div className="example-title">Live Demo: Component with Loading</div>
              <div className="demo-component">
                <UserProfileWithLoading name="John Doe" />
              </div>
              <p><em>This component shows "Loading..." for 2 seconds, then displays the actual content.</em></p>
            </div>
          </div>

          <div className="code-section">
            <h3 className="code-title">2. Authentication HOC Example</h3>
            <div className="code-block">
{`const withAuth = (Component) => {
  return function WithAuthComponent(props) {
    const [isAuthenticated] = useState(true);

    if (!isAuthenticated) {
      return <div>Please log in to continue</div>;
    }

    return <Component {...props} />;
  };
};`}
            </div>

            <div className="live-example">
              <div className="example-title">Live Demo: Protected Component</div>
              <div className="demo-component">
                <DashboardWithAuth />
              </div>
              <p><em>This component checks authentication before rendering. Try changing isAuthenticated to false!</em></p>
            </div>
          </div>

          <div className="code-section">
            <h3 className="code-title">3. Composing Multiple HOCs</h3>
            <div className="code-block">
{`// You can combine multiple HOCs
const SuperEnhancedProfile = withAuth(withLoading(UserProfile));

// Or use a compose function
const enhance = compose(withAuth, withLoading);
const EnhancedProfile = enhance(UserProfile);`}
            </div>

            <div className="live-example">
              <div className="example-title">Live Demo: Multiple HOCs Combined</div>
              <div className="demo-component">
                <SuperEnhancedProfile name="Jane Smith" />
              </div>
              <p><em>This component has both authentication and loading features!</em></p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="icon">🔄</span>
            <h2 className="card-title">Before vs After Pattern</h2>
          </div>

          <div className="pattern-showcase">
            <div className="before-after">
              <h4>❌ Without HOC (Repetitive)</h4>
              <div className="code-block" style={{ fontSize: '0.8rem' }}>
{`function UserProfile() {
  const [loading, setLoading] = useState(true);
  // Loading logic...
  
  if (loading) return <div>Loading...</div>;
  return <div>User Profile Content</div>;
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  // Same loading logic repeated...
  
  if (loading) return <div>Loading...</div>;
  return <div>Dashboard Content</div>;
}`}
              </div>
            </div>

            <div className="before-after">
              <h4>✅ With HOC (Reusable)</h4>
              <div className="code-block" style={{ fontSize: '0.8rem' }}>
{`const withLoading = (Component) => {
  return function(props) {
    const [loading, setLoading] = useState(true);
    // Loading logic in one place
    
    if (loading) return <div>Loading...</div>;
    return <Component {...props} />;
  };
};

const UserProfile = withLoading(UserProfileBase);
const Dashboard = withLoading(DashboardBase);`}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="icon">📝</span>
            <h2 className="card-title">Common HOC Patterns</h2>
          </div>

          <div className="code-section">
            <h3 className="code-title">Popular HOC Use Cases:</h3>
            <div className="key-points">
              <ul>
                <li><strong>withRouter</strong> - Adds routing props to components</li>
                <li><strong>withAuth</strong> - Handles authentication logic</li>
                <li><strong>withLoading</strong> - Manages loading states</li>
                <li><strong>withErrorBoundary</strong> - Wraps components with error handling</li>
                <li><strong>withTheme</strong> - Injects theme props</li>
                <li><strong>connect()</strong> - Redux's HOC for connecting to store</li>
              </ul>
            </div>
          </div>

          <div className="analogy">
            <div className="analogy-text">
              "Just like how you can add different accessories to your car (GPS, phone holder, seat covers) without modifying the car itself, HOCs add different functionalities to your components without changing their core logic."
            </div>
          </div>
        </div>
      </div>
      </>
  );
}