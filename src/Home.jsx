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
    },
    {
      id: 'UseState',
      title: 'UseState',
      description: 'Modern React features',
      icon: '🛰️',
      // component: <Hooks />

    },
    {
      id: 'UseEffect',
      title: 'UseEffect',
      description: 'Modern React features',
      icon: '🧗‍♂️',
      // component: <Hooks />
    },
    {
      id: 'UseCallBack',
      title: 'UseCallBack',
      description: 'Modern React features',
      icon: '📲',
      // component: <Hooks />
    },
    {
      id: 'useContext',
      title: 'useContext',
      description: 'Modern React features',
      icon: '☎️',
      // component: <Hooks />
    },
    {
      id: 'useReducer',
      title: 'useReducer',
      description: 'Modern React features',
      icon: '🔇',
      // component: <Hooks />
    },
    {
      id:'useRef',
      title:'useRef',
      description: 'Modern React features',
      icon: '🔃',
      // component: <Hooks />
    },
    {
      id:'useMemo',
      title:'useMemo',
      description: 'Modern React features',
      icon: '💭',
      // component: <Hooks />
    }
  ];

  const renderContent = () => {
    if (activeSection === 'home') {
      return (
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Master Front-End Development
            </h1>
            <p className="hero-subtitle">
              Complete guide to modern Front-End  development with hands-on examples and real-world patterns
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

          </div>
        </div>
      );
    }

    const currentItem = navigationItems.find(item => item.id === activeSection);
    return currentItem ? currentItem.component : null;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
           <div className="logo-section">
            <div className="logo"> Front- End  Docs</div>
          </div>
          <nav className="main-nav">
            <button 
              className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => setActiveSection('home')}
            >
              React Js Libarary
          <div className="version">version is 19.1.1</div>
            </button>

            <button 
              className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
              // onClick={() => setActiveSection('home')}
            >
              JavaScript 
          <div className="version">Es6  Version</div>
            </button>

            <button 
              className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
              // onClick={() => setActiveSection('home')}
            >
              Next js FrameWork
          <div className="version">version is 15.5.4</div>
            </button>


          </nav>
        </div>
      </header>
      <main className="main-content">
        {renderContent()}
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 React Documentation. Built with React and modern web technologies.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;