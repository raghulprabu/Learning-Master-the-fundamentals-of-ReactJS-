import React, { useState } from 'react';
import './home.css';

// Import your actual components
import Firstreact from "./First-React/react.jsx";
import JSX from "./JSX/Jsxapp.jsx";
import Component from "./Componenets/CompApp.jsx";
import Props from "./Props/propsapp.jsx";
import Hoc from "./Hoc/Hocapp.jsx";
import Hooks from "./Hooks/hook.jsx";

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');

  const navigationItems = [
    {
      id: 'react',
      title: 'First React',
      description: 'Get started with React fundamentals',
      icon: '⚛️',
      component: <Firstreact />
    },
    {
      id: 'jsx',
      title: 'JSX',
      description: 'JavaScript XML syntax',
      icon: '📝',
      component: <JSX />
    },
    {
      id: 'components',
      title: 'Components',
      description: 'Building blocks of React',
      icon: '🧩',
      component: <Component />
    },
    {
      id: 'props',
      title: 'Props',
      description: 'Data flow and communication',
      icon: '🔄',
      component: <Props />
    },
    {
      id: 'hoc',
      title: 'HOC',
      description: 'Higher Order Components',
      icon: '🚀',
      component: <Hoc />
    },
    {
      id: 'hooks',
      title: 'Hooks',
      description: 'Modern React features',
      icon: '🪝',
      component: <Hooks />
    }
  ];

  const renderContent = () => {
    if (activeSection === 'home') {
      return (
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Master React Development
            </h1>
            <p className="hero-subtitle">
              Complete guide to modern React development with hands-on examples and real-world patterns
            </p>
            
            <div className="feature-grid">
              {navigationItems.map((item) => (
                <div 
                  key={item.id}
                  className="feature-card"
                  onClick={() => setActiveSection(item.id)}
                >
                  <div className="feature-icon">{item.icon}</div>
                  <h3 className="feature-title">{item.title}</h3>
                  <p className="feature-description">{item.description}</p>
                  <div className="feature-arrow">→</div>
                </div>
              ))}
            </div>

            {/* <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">6</div>
                <div className="stat-label">Core Topics</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Examples</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Hands-on</div>
              </div>
            </div> */}
          </div>
        </div>
      );
    }

    const currentItem = navigationItems.find(item => item.id === activeSection);
    return currentItem ? currentItem.component : null;
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">React Docs</div>
            <div className="version">v18.0</div>
          </div>
          
          <nav className="main-nav">
            <button 
              className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => setActiveSection('home')}
            >
              Home
            </button>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.title}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button className="action-btn search-btn">
              <span>🔍</span>
            </button>
            <button className="action-btn theme-btn">
              <span>🌙</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 React Documentation. Built with React and modern web technologies.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;