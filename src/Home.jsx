import React, { useState, useEffect } from 'react';
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
      { id: 'introduction',        icon: '⚛️', title: 'Introduction to React',   description: 'What React is and why it exists',               content: introductionContent },
      { id: 'jsx',                 icon: '📝', title: 'JSX',                      description: 'JavaScript XML syntax',                         content: jsxContent },
      { id: 'components',          icon: '🧩', title: 'Components',               description: 'Building blocks of React',                      content: componentsContent },
      { id: 'props',               icon: '🔄', title: 'Props',                    description: 'Data flow and communication',                   content: propsContent },
      { id: 'state',               icon: '🧠', title: 'State',                    description: 'Dynamic data inside components',                content: stateContent },
      { id: 'events',              icon: '🖱️', title: 'Event Handling',          description: 'Responding to user interactions',               content: eventsContent },
      { id: 'conditionalRendering',icon: '🔀', title: 'Conditional Rendering',   description: 'Show/hide UI based on state',                   content: conditionalRenderingContent },
      { id: 'listsAndKeys',        icon: '📋', title: 'Lists & Keys',            description: 'Rendering dynamic lists correctly',             content: listsAndKeysContent },
      { id: 'forms',               icon: '📝', title: 'Forms',                   description: 'Controlled inputs & form handling',             content: formsContent },
      { id: 'liftingStateUp',      icon: '⬆️', title: 'Lifting State Up',        description: 'Sharing state between components',              content: liftingStateUpContent },
      { id: 'composition',         icon: '🪆', title: 'Composition',             description: 'children prop & component composition',         content: compositionContent },
    ]
  },
  {
    id: 'hooks',
    label: 'Core Hooks',
    emoji: '🪝',
    items: [
      { id: 'useState',    icon: '🛰️', title: 'useState',    description: 'Store dynamic data in components',           content: useStateContent },
      { id: 'useEffect',   icon: '🧗‍♂️', title: 'useEffect',  description: 'Sync with APIs, DOM, timers',                content: useEffectContent },
      { id: 'useContext',  icon: '☎️', title: 'useContext',  description: 'Read from a Context without prop drilling',   content: useContextContent },
      { id: 'useReducer',  icon: '🔇', title: 'useReducer',  description: 'Manage complex state with actions',           content: useReducerContent },
      { id: 'useRef',      icon: '🔃', title: 'useRef',      description: 'Reference DOM elements & persist values',     content: useRefContent },
      { id: 'useMemo',     icon: '💭', title: 'useMemo',     description: 'Cache expensive computed values',             content: useMemoContent },
      { id: 'useCallback', icon: '📲', title: 'useCallback', description: 'Stable function references across renders',   content: useCallbackContent },
      { id: 'customHooks', icon: '🧪', title: 'Custom Hooks', description: 'Extract & reuse stateful logic',            content: customHooksContent },
    ]
  },
  {
    id: 'deepdives',
    label: 'Deep Dives',
    emoji: '🔍',
    items: [
      { id: 'debouncing',   icon: '⏳', title: 'Debouncing',    description: 'Delay rapid events — search bars, auto-suggest', content: debouncingContent },
      { id: 'arrayFilter',  icon: '🧹', title: 'Array.filter()', description: 'Derive filtered views — search & dashboard',    content: arrayFilterContent },
    ]
  },
  {
    id: 'modernHooks',
    label: 'Modern Hooks',
    emoji: '⚡',
    items: [
      { id: 'useTransition',        icon: '🚦', title: 'useTransition',        description: 'Mark state updates as non-urgent',          content: useTransitionContent },
      { id: 'useDeferredValue',     icon: '⏱️', title: 'useDeferredValue',     description: 'Defer rendering of a value',                content: useDeferredValueContent },
      { id: 'useId',                icon: '🆔', title: 'useId',                description: 'Stable IDs for accessibility attributes',   content: useIdContent },
      { id: 'useImperativeHandle',  icon: '🎛️', title: 'useImperativeHandle',  description: 'Curate what forwardRef exposes',             content: useImperativeHandleContent },
      { id: 'useLayoutEffect',      icon: '📐', title: 'useLayoutEffect',      description: 'Run effects before browser paints',         content: useLayoutEffectContent },
      { id: 'useSyncExternalStore', icon: '🔌', title: 'useSyncExternalStore', description: 'Subscribe to external stores safely',       content: useSyncExternalStoreContent },
      { id: 'useInsertionEffect',   icon: '💉', title: 'useInsertionEffect',   description: 'CSS-in-JS injection before layout',         content: useInsertionEffectContent },
    ]
  },
  {
    id: 'ecosystem',
    label: 'Ecosystem & Advanced',
    emoji: '🌐',
    items: [
      { id: 'contextAPI',           icon: '🌐', title: 'Context API',             description: 'Global state without external libraries',        content: contextAPIContent },
      { id: 'reactRouter',          icon: '🧭', title: 'React Router',            description: 'Client-side routing with React Router v6',       content: reactRouterContent },
      { id: 'errorBoundaries',      icon: '🛡️', title: 'Error Boundaries',        description: 'Catch render errors gracefully',                  content: errorBoundariesContent },
      { id: 'codeSplitting',        icon: '✂️', title: 'Code Splitting',          description: 'Lazy-load routes with React.lazy + Suspense',    content: codeSplittingContent },
      { id: 'suspense',             icon: '⏸️', title: 'Suspense',               description: 'Declarative loading states',                      content: suspenseContent },
      { id: 'performanceOptimization', icon: '⚡', title: 'Performance',          description: 'memo, useMemo, useCallback, virtualization',      content: performanceOptimizationContent },
      { id: 'reactDevTools',        icon: '🔬', title: 'React DevTools',          description: 'Debug and profile React apps',                    content: reactDevToolsContent },
      { id: 'serverComponents',     icon: '🖥️', title: 'Server Components',       description: 'React Server Components & "use client"',          content: serverComponentsContent },
      { id: 'renderingLifecycle',   icon: '🔄', title: 'Rendering Lifecycle',     description: 'Trigger → render → commit → effects',            content: renderingLifecycleContent },
      { id: 'concurrentFeatures',   icon: '🌀', title: 'Concurrent Features',     description: 'createRoot, automatic batching, interruptibility', content: concurrentFeaturesContent },
      { id: 'stateManagement',      icon: '🗃️', title: 'State Management',        description: 'Local → Context → Zustand → TanStack Query',     content: stateManagementContent },
      { id: 'apiIntegration',       icon: '🔗', title: 'API Integration',         description: 'Fetching, caching, race conditions, TanStack',    content: apiIntegrationContent },
      { id: 'authentication',       icon: '🔐', title: 'Authentication',          description: 'Auth state, protected routes, token storage',     content: authenticationContent },
      { id: 'testing',              icon: '🧪', title: 'Testing',                 description: 'RTL, Vitest, MSW — test like users',              content: testingContent },
      { id: 'deployment',           icon: '🚀', title: 'Deployment',              description: 'Build, env vars, hosting, CI/CD',                 content: deploymentContent },
      { id: 'bestPractices',        icon: '🏆', title: 'Best Practices',          description: 'The rules experienced React devs follow',         content: bestPracticesContent },
      { id: 'advancedPatterns',     icon: '🎨', title: 'Advanced Patterns',       description: 'HOC, Render Props, Compound Components',          content: advancedPatternsContent },
    ]
  }
];

// Flatten all items for easy lookup by id
const allItems = navigationSections.flatMap(s => s.items);

const Home = () => {
  const [activeSection, setActiveSection] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || 'home';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeSection);
  }, [activeSection]);

  // Scroll to top when changing topics
  useEffect(() => {
    if (activeSection !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);

  const isReactSection = activeSection === 'home' || allItems.some(i => i.id === activeSection);

  const renderContent = () => {
    if (activeSection === 'home') {
      return (
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Master React JS</h1>
            <p className="hero-subtitle">
              Complete guide to React 19 — from fundamentals to production patterns, with real-world examples, flow diagrams, and interview prep.
            </p>

            {navigationSections.map(section => (
              <div key={section.id} className="nav-section-group">
                <h2 className="nav-section-heading">
                  <span className="nav-section-emoji">{section.emoji}</span>
                  {section.label}
                  <span className="nav-section-count">{section.items.length} topics</span>
                </h2>
                <div className="feature-grid">
                  {section.items.map(item => (
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
            ))}
          </div>
        </div>
      );
    }

    const item = allItems.find(i => i.id === activeSection);
    if (!item) return <p style={{ padding: '2rem' }}>Topic not found.</p>;
    return <ConceptPage content={item.content} />;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">Front-End Docs</div>
          </div>
          <nav className="main-nav">
            <button
              className={`nav-item ${isReactSection ? 'active' : ''}`}
              onClick={() => setActiveSection('home')}
            >
              React JS Library
              <div className="version">version 19.1.1</div>
            </button>
            <button className="nav-item">
              JavaScript
              <div className="version">ES6 Version</div>
            </button>
            <button className="nav-item">
              Next.js Framework
              <div className="version">version 15.5.4</div>
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
