import React from "react";
import "./HocNote.css";

export default function HocNote() {
  return (
    <div className="doc-container">
      <div className="doc-card">
        <h2 className="doc-heading">Higher Order Component (HOC)</h2>
        <p className="doc-text">
          A <strong>Higher Order Component (HOC)</strong> is like a wrapper that
          adds extra features to your React components. 
        </p>
        <p className="doc-text">
          Think of it like putting a <strong>case on your phone</strong> – 
          the case adds new features (like water protection) without changing 
          the phone itself.
        </p>

        <h3 className="doc-subheading">📘 Real-time Example</h3>
        <p className="doc-text">
          Suppose you want to show whether a user is logged in. Instead of adding
          the same logic everywhere, you can create an HOC that wraps your
          component and gives it the login status.
        </p>

        <pre className="doc-code">
{`function withAuth(Component) {
  return function EnhancedComponent(props) {
    const isLoggedIn = true; // Example condition
    return <Component {...props} isLoggedIn={isLoggedIn} />;
  };
}

// Usage
function Profile(props) {
  return props.isLoggedIn 
    ? <h4>Welcome back!</h4> 
    : <h4>Please login</h4>;
}

const ProtectedProfile = withAuth(Profile);`}
        </pre>
      </div>
    </div>
  );
}
