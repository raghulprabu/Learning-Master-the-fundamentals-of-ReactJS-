import React, { useState, useEffect, useRef } from 'react';
import './home.css';

import ConceptPage from './concept/ConceptPage.jsx';

// Foundations
import introductionContent from './content/introduction.js';
import jsxContent from './content/jsx.js';
import componentsContent from './content/components.js';
import propsContent from './content/props.js';
import stateContent from './content/state.js';
import eventsContent from './content/events.js';
import conditionalRenderingContent from './content/conditionalRendering.js';
import listsAndKeysContent from './content/listsAndKeys.js';
import formsContent from './content/forms.js';
import liftingStateUpContent from './content/liftingStateUp.js';
import compositionContent from './content/composition.js';

// Core Hooks
import useStateContent from './content/useState.js';
import useEffectContent from './content/useEffect.js';
import useContextContent from './content/useContext.js';
import useReducerContent from './content/useReducer.js';
import useRefContent from './content/useRef.js';
import useMemoContent from './content/useMemo.js';
import useCallbackContent from './content/useCallback.js';
import customHooksContent from './content/customHooks.js';

// Deep Dives
import debouncingContent from './content/debouncing.js';
import arrayFilterContent from './content/arrayFilter.js';

// Modern Hooks
import useTransitionContent from './content/useTransition.js';
import useDeferredValueContent from './content/useDeferredValue.js';
import useIdContent from './content/useId.js';
import useImperativeHandleContent from './content/useImperativeHandle.js';
import useLayoutEffectContent from './content/useLayoutEffect.js';
import useSyncExternalStoreContent from './content/useSyncExternalStore.js';
import useInsertionEffectContent from './content/useInsertionEffect.js';

// Ecosystem & Advanced
import contextAPIContent from './content/contextAPI.js';
import reactRouterContent from './content/reactRouter.js';
import errorBoundariesContent from './content/errorBoundaries.js';
import codeSplittingContent from './content/codeSplitting.js';
import suspenseContent from './content/suspense.js';
import performanceOptimizationContent from './content/performanceOptimization.js';
import reactDevToolsContent from './content/reactDevTools.js';
import serverComponentsContent from './content/serverComponents.js';
import renderingLifecycleContent from './content/renderingLifecycle.js';
import concurrentFeaturesContent from './content/concurrentFeatures.js';
import stateManagementContent from './content/stateManagement.js';
import apiIntegrationContent from './content/apiIntegration.js';
import authenticationContent from './content/authentication.js';
import testingContent from './content/testing.js';
import deploymentContent from './content/deployment.js';
import bestPracticesContent from './content/bestPractices.js';
import advancedPatternsContent from './content/advancedPatterns.js';

const STORAGE_KEY = 'activeSectionId';

const navigationSections = [
  {
    id: 'foundations',
    label: 'Foundations',
    emoji: '🏗️',
    items: [
      { id: 'introduction',         icon: '⚛️', title: 'Introduction to React',  description: 'What React is and why it exists',              content: introductionContent },
      { id: 'jsx',                  icon: '📝', title: 'JSX',                     description: 'JavaScript XML syntax',                        content: jsxContent },
      { id: 'components',           icon: '🧩', title: 'Components',              description: 'Building blocks of React',                     content: componentsContent },
      { id: 'props',                icon: '🔄', title: 'Props',                   description: 'Data flow and communication',                  content: propsContent },
      { id: 'state',                icon: '🧠', title: 'State',                   description: 'Dynamic data inside components',               content: stateContent },
      { id: 'events',               icon: '🖱️', title: 'Event Handling',         description: 'Responding to user interactions',              content: eventsContent },
      { id: 'conditionalRendering', icon: '🔀', title: 'Conditional Rendering',  description: 'Show/hide UI based on state',                  content: conditionalRenderingContent },
      { id: 'listsAndKeys',         icon: '📋', title: 'Lists & Keys',           description: 'Rendering dynamic lists correctly',            content: listsAndKeysContent },
      { id: 'forms',                icon: '📝', title: 'Forms',                  description: 'Controlled inputs & form handling',            content: formsContent },
      { id: 'liftingStateUp',       icon: '⬆️', title: 'Lifting State Up',       description: 'Sharing state between components',             content: liftingStateUpContent },
      { id: 'composition',          icon: '🪆', title: 'Composition',            description: 'children prop & component composition',        content: compositionContent },
    ]
  },
  {
    id: 'hooks',
    label: 'Core Hooks',
    emoji: '🪝',
    items: [
      { id: 'useState',    icon: '🛰️', title: 'useState',     description: 'Store dynamic data in components',          content: useStateContent },
      { id: 'useEffect',   icon: '🧗',  title: 'useEffect',   description: 'Sync with APIs, DOM, timers',               content: useEffectContent },
      { id: 'useContext',  icon: '☎️', title: 'useContext',   description: 'Read from a Context without prop drilling',  content: useContextContent },
      { id: 'useReducer',  icon: '🔇', title: 'useReducer',   description: 'Manage complex state with actions',          content: useReducerContent },
      { id: 'useRef',      icon: '🔃', title: 'useRef',       description: 'Reference DOM elements & persist values',    content: useRefContent },
      { id: 'useMemo',     icon: '💭', title: 'useMemo',      description: 'Cache expensive computed values',            content: useMemoContent },
      { id: 'useCallback', icon: '📲', title: 'useCallback',  description: 'Stable function references across renders',  content: useCallbackContent },
      { id: 'customHooks', icon: '🧪', title: 'Custom Hooks', description: 'Extract & reuse stateful logic',             content: customHooksContent },
    ]
  },
  {
    id: 'deepdives',
    label: 'Deep Dives',
    emoji: '🔍',
    items: [
      { id: 'debouncing',  icon: '⏳', title: 'Debouncing',     description: 'Delay rapid events — search, auto-suggest', content: debouncingContent },
      { id: 'arrayFilter', icon: '🧹', title: 'Array.filter()', description: 'Derive filtered views — search & dashboard', content: arrayFilterContent },
    ]
  },
  {
    id: 'modernHooks',
    label: 'Modern Hooks',
    emoji: '⚡',
    items: [
      { id: 'useTransition',        icon: '🚦', title: 'useTransition',        description: 'Mark state updates as non-urgent',         content: useTransitionContent },
      { id: 'useDeferredValue',     icon: '⏱️', title: 'useDeferredValue',     description: 'Defer rendering of a value',               content: useDeferredValueContent },
      { id: 'useId',                icon: '🆔', title: 'useId',                description: 'Stable IDs for accessibility',             content: useIdContent },
      { id: 'useImperativeHandle',  icon: '🎛️', title: 'useImperativeHandle',  description: 'Curate what forwardRef exposes',            content: useImperativeHandleContent },
      { id: 'useLayoutEffect',      icon: '📐', title: 'useLayoutEffect',      description: 'Run effects before browser paints',        content: useLayoutEffectContent },
      { id: 'useSyncExternalStore', icon: '🔌', title: 'useSyncExternalStore', description: 'Subscribe to external stores safely',      content: useSyncExternalStoreContent },
      { id: 'useInsertionEffect',   icon: '💉', title: 'useInsertionEffect',   description: 'CSS-in-JS injection before layout',        content: useInsertionEffectContent },
    ]
  },
  {
    id: 'ecosystem',
    label: 'Ecosystem & Advanced',
    emoji: '🌐',
    items: [
      { id: 'contextAPI',              icon: '🌐', title: 'Context API',           description: 'Global state without external libraries',       content: contextAPIContent },
      { id: 'reactRouter',             icon: '🧭', title: 'React Router',          description: 'Client-side routing with React Router v6',      content: reactRouterContent },
      { id: 'errorBoundaries',         icon: '🛡️', title: 'Error Boundaries',      description: 'Catch render errors gracefully',                 content: errorBoundariesContent },
      { id: 'codeSplitting',           icon: '✂️', title: 'Code Splitting',        description: 'Lazy-load routes with React.lazy + Suspense',   content: codeSplittingContent },
      { id: 'suspense',                icon: '⏸️', title: 'Suspense',              description: 'Declarative loading states',                     content: suspenseContent },
      { id: 'performanceOptimization', icon: '⚡', title: 'Performance',           description: 'memo, useMemo, useCallback, virtualization',     content: performanceOptimizationContent },
      { id: 'reactDevTools',           icon: '🔬', title: 'React DevTools',        description: 'Debug and profile React apps',                   content: reactDevToolsContent },
      { id: 'serverComponents',        icon: '🖥️', title: 'Server Components',     description: 'React Server Components & "use client"',         content: serverComponentsContent },
      { id: 'renderingLifecycle',      icon: '🔄', title: 'Rendering Lifecycle',   description: 'Trigger → render → commit → effects',           content: renderingLifecycleContent },
      { id: 'concurrentFeatures',      icon: '🌀', title: 'Concurrent Features',   description: 'createRoot, automatic batching',                 content: concurrentFeaturesContent },
      { id: 'stateManagement',         icon: '🗃️', title: 'State Management',      description: 'Local → Context → Zustand → TanStack',          content: stateManagementContent },
      { id: 'apiIntegration',          icon: '🔗', title: 'API Integration',       description: 'Fetching, caching, race conditions',             content: apiIntegrationContent },
      { id: 'authentication',          icon: '🔐', title: 'Authentication',        description: 'Auth state, protected routes, tokens',           content: authenticationContent },
      { id: 'testing',                 icon: '🧪', title: 'Testing',               description: 'RTL, Vitest, MSW — test like users',             content: testingContent },
      { id: 'deployment',              icon: '🚀', title: 'Deployment',            description: 'Build, env vars, hosting, CI/CD',                content: deploymentContent },
      { id: 'bestPractices',           icon: '🏆', title: 'Best Practices',        description: 'Rules experienced React devs follow',            content: bestPracticesContent },
      { id: 'advancedPatterns',        icon: '🎨', title: 'Advanced Patterns',     description: 'HOC, Render Props, Compound Components',         content: advancedPatternsContent },
    ]
  }
];

const allItems = navigationSections.flatMap(s => s.items);

const Home = () => {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'home';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sidebarOpen]);

  const navigate = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const filteredSections = searchQuery.trim()
    ? navigationSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(s => s.items.length > 0)
    : navigationSections;

  const totalResults = filteredSections.reduce((sum, s) => sum + s.items.length, 0);

  const activeItem = allItems.find(i => i.id === activeSection);

  const renderSidebar = () => (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
      <button className="sidebar-home-btn" onClick={() => navigate('home')}>
        ⚛️ React JS Tutorial
      </button>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      {searchQuery && totalResults === 0 && (
        <div className="sidebar-no-results">No topics found</div>
      )}
      {filteredSections.map(section => (
        <div key={section.id} className="sidebar-section">
          <div className="sidebar-section-label">
            {section.emoji} {section.label}
          </div>
          {section.items.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              {item.icon} {item.title}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );

  const renderHomePage = () => (
    <div className="home-page">
      <div className="home-banner">
        <h1>React JS</h1>
        <p className="home-tagline">
          Complete guide to React 19 — from fundamentals to production patterns,
          with real-world examples, flow diagrams, and interview prep.
        </p>
        <button
          className="btn-start"
          onClick={() => navigate('introduction')}
        >
          Get Started »
        </button>
      </div>

      <div className="home-body">
        {navigationSections.map(section => (
          <div key={section.id} className="home-section">
            <h2 className="home-section-heading">
              <span className="home-section-emoji">{section.emoji}</span>
              {section.label}
              <span className="home-section-count">{section.items.length} topics</span>
            </h2>
            <div className="topic-grid">
              {section.items.map(item => (
                <div
                  key={item.id}
                  className="topic-card"
                  onClick={() => navigate(item.id)}
                >
                  <span className="t-icon">{item.icon}</span>
                  <div className="t-title">{item.title}</div>
                  <div className="t-desc">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeSection === 'home') return renderHomePage();
    if (!activeItem) return <p style={{ padding: '2rem' }}>Topic not found.</p>;
    return (
      <>
        <div className="content-breadcrumb">
          <span className="bc-link" onClick={() => navigate('home')}>Home</span>
          <span className="bc-sep">›</span>
          <span className="bc-link" onClick={() => navigate('home')}>React JS</span>
          <span className="bc-sep">›</span>
          <span>{activeItem.title}</span>
        </div>
        <ConceptPage content={activeItem.content} />
      </>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className="logo-section" onClick={() => navigate('home')}>
          <span className="logo">
            Full Stack <span className="logo-accent">Docs</span>
          </span>
        </div>

        <nav className="main-nav">
          <button
            className={`nav-item ${activeSection === 'home' || allItems.some(i => i.id === activeSection) ? 'active' : ''}`}
            onClick={() => navigate('home')}
          >
            React JS Library
            <span className="version">version 19.1.1</span>
          </button>
          <button className="nav-item">
            JavaScript
            <span className="version">ES6 Version</span>
          </button>
          <button className="nav-item">
            Next.js Framework
            <span className="version">version 15.5.4</span>
          </button>
        </nav>

        <div className="header-search">
          <input type="text" placeholder="🔍  Search docs..." />
        </div>
      </header>

      <div className="page-layout">
        {renderSidebar()}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      <footer className="app-footer">
        <p>© 2026 Full Stack Docs — React Documentation. Built with React 19.</p>
      </footer>
    </div>
  );
};

export default Home;
