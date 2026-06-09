const deploymentContent = {
  id: 'deployment',
  title: 'Deploying React Apps',
  icon: '🚀',
  theme: 'sky',
  tagline: 'Build, optimize, and deploy React apps to production — environment variables, CI/CD, and hosting strategies.',
  meta: 'Ecosystem · Production',

  whatIsIt: {
    description: [
      'Deploying a React app means: running the production build (npm run build) to create optimized static files, then serving those files from a host — a CDN, a Node server, or a serverless platform. The result is what users actually experience.',
      'For CRA (Create React App) apps, the build outputs a static HTML/CSS/JS bundle that can be served from ANY static host. For Next.js or Remix apps, server-side rendering requires a Node.js-compatible host or serverless runtime.'
    ],
    points: [
      'npm run build: bundles, minifies, and tree-shakes your app; generates content-hashed filenames for long-term caching.',
      'Static hosting (Vercel, Netlify, GitHub Pages, AWS S3 + CloudFront): serves the bundle files — fast, cheap, no server to manage.',
      'Node.js hosting (Railway, Render, AWS EC2/ECS): required for SSR frameworks (Next.js, Remix) that need a running server.',
      'Environment variables: separate secrets and config from code — never hardcode API keys in the bundle.'
    ],
    code: { title: 'Build + environment variables + deployment config', snippet: `// 1. Environment variables in CRA: prefix with REACT_APP_
//    In Vite: prefix with VITE_
//    These are BAKED INTO the bundle at build time — NOT secret for frontend code
REACT_APP_API_URL=https://api.myapp.com
REACT_APP_FEATURE_FLAG_NEW_UI=true

// Usage in code:
const apiUrl = process.env.REACT_APP_API_URL; // CRA
const apiUrl = import.meta.env.VITE_API_URL;  // Vite

// 2. Build the app
npm run build
// Outputs: build/ (CRA) or dist/ (Vite)
// - index.html
// - static/js/main.[hash].js    ← content-hashed for long caching
// - static/css/main.[hash].css

// 3. Test the production build locally
npm install -g serve
serve -s build            # CRA
serve -s dist             # Vite

// 4. SPA routing fix — required for all React Router apps
//    Without this, /dashboard returns 404 on page refresh
// netlify.toml:
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

// vercel.json:
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` },
    analogy: {
      icon: '🏗️',
      title: 'Real-World Analogy',
      text: '"Deploying a React app is like constructing a building (development) vs. moving into the finished building (production). Development is the construction phase — scaffolding, source files, dev servers, hot reload. The production build (npm run build) is the architect finalizing the blueprints — compressed, optimized, no scaffolding left. Deployment is moving the finished building to the city (hosting platform) so anyone can visit."'
    }
  },

  whyUsed: {
    description: 'The development experience (npm start, hot reload, source maps, unminified code) is designed for developer productivity, not user experience or security. The production build reverses all of that: bundles everything into optimized, cache-friendly files that minimize load time for real users.',
    points: [
      'Production builds are typically 5-10× smaller than development bundles — critical for load time.',
      'Content-hashed filenames enable indefinite browser caching — repeat visitors get instant loads.',
      'Environment variables enable the same codebase to work in dev, staging, and production with different endpoints.',
      'CI/CD pipelines automate building and testing so every merge to main is verified before reaching users.'
    ]
  },

  whenToUse: {
    description: 'Every app goes through these stages; the choices to make are about the hosting platform and CI/CD tooling.',
    points: [
      'CRA / Vite SPA: static hosting (Vercel, Netlify, GitHub Pages) — simplest, fastest, free tier usually sufficient.',
      'Next.js / Remix: Vercel (native), Railway, Render, or any Node.js host.',
      'Enterprise / compliance needs: AWS (S3+CloudFront, ECS, Amplify) or Azure Static Web Apps for more control.',
      'Preview deployments: Vercel and Netlify create preview URLs for every PR automatically — team can review live UI changes.'
    ],
    analogy: {
      icon: '💡',
      title: 'The SPA routing gotcha',
      text: '"A common first-deployment surprise: the app works perfectly at /, but navigating to /about or /dashboard and then refreshing the page returns a 404. Why? The hosting server returns 404 for paths it doesn\'t have as files. React Router works client-side — the server needs to serve index.html for ALL paths and let React Router handle the routing. Every host has a way to configure this \'catch-all\' redirect — setting it is the most important deployment config step for React Router apps."'
    }
  },

  howItWorks: {
    description: 'The production build pipeline: tree-shake (remove unused code), bundle (combine modules), minify (compress), hash (content-hash filenames for caching). The result is a set of static files ready to serve. Environment variables defined in .env.production are injected at build time — they appear literally in the bundle, not as secrets.',
    code: {
      title: 'GitHub Actions CI/CD pipeline for a React app',
      snippet: `# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }

      - name: Install dependencies
        run: npm ci     # ci: clean install, uses lockfile exactly

      - name: Run tests
        run: npm test -- --watchAll=false

      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: \${{ secrets.REACT_APP_API_URL }}  # from GitHub Secrets

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with: { args: 'deploy --prod --dir=build' }
        env:
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}` },
    points: [
      'npm ci (not npm install) in CI: installs exactly what\'s in package-lock.json, fails if it differs from package.json — prevents "works locally but fails in CI" dependency drift.',
      'NEVER put secrets in .env files that are committed to the repo — put them in the hosting platform\'s environment variable settings or CI secrets.',
      'Source maps (.map files) help debug production issues — configure whether to include them and how to restrict access to them (hosting platform settings or a separate upload to Sentry).'
    ]
  },

  flowDiagram: {
    title: 'From code to production',
    steps: [
      { icon: '💻', label: 'Developer pushes to main', note: 'git push → triggers CI' },
      { icon: '🧪', label: 'CI runs tests', note: 'npm ci && npm test' },
      { icon: '📦', label: 'Production build', note: 'npm run build → optimized bundle' },
      { icon: '🚀', label: 'Deploy to host', note: 'Upload to Vercel / Netlify / S3' },
      { icon: '🌐', label: 'CDN distributes globally', note: 'Users worldwide get the build' }
    ]
  },

  realWorldExamples: {
    intro: 'Each hosting choice has trade-offs:',
    items: [
      { icon: '⚡', title: 'Vercel', description: 'Zero-config deployment for React (and excellent for Next.js). Push to main → deployed in ~30s. Preview deployments for every PR. Free tier is generous. The de facto standard for Vercel-native frameworks.' },
      { icon: '🌐', title: 'Netlify', description: 'Similar to Vercel — great for static sites and SPAs. Built-in forms, edge functions, and the SPA redirect config is one line in netlify.toml.' },
      { icon: '☁️', title: 'AWS S3 + CloudFront', description: 'S3 for static file storage, CloudFront as the global CDN. More configuration, more control, and significantly lower cost at scale. Required for enterprise/compliance deployments.' },
      { icon: '🐙', title: 'GitHub Pages', description: 'Free static hosting from a GitHub repo — perfect for portfolio projects. CRA\'s homepage field and gh-pages package automate the deployment.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Modern hosts (Vercel, Netlify) make deploying a React SPA trivially easy — minutes from repo to production URL.',
      'CDN-based static hosting is fast, cheap, and scales automatically to any traffic level.',
      'CI/CD pipelines prevent untested code from reaching production.',
      'Preview deployments give teams visual review of changes before merging.'
    ],
    cons: [
      'SPAs require the "catch-all to index.html" redirect config — forgetting this is a very common first-deployment gotcha.',
      'CRA\'s build adds source maps by default — ensure they\'re not publicly accessible in production if they contain sensitive paths.',
      'Environment variables baked into the client bundle are NOT secrets — anything in REACT_APP_* or VITE_* is visible in the browser.',
      'SSR/ISR features require a Node.js host — not compatible with pure static hosts like S3 or GitHub Pages.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Forgetting the SPA routing redirect',
        wrong: `// No catch-all config → refreshing /dashboard shows 404 from the server, not React`,
        right: `// netlify.toml: [[redirects]] from="/*" to="/index.html" status=200\n// vercel.json: { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`,
        note: 'The most common deployment issue for React Router apps. The server doesn\'t know about client-side routes — it needs to serve index.html for every path and let React Router take over.'
      },
      {
        title: 'Putting secrets in frontend environment variables',
        wrong: `REACT_APP_DB_PASSWORD=supersecret123 // ❌ this will literally be in the JS bundle — visible to anyone`,
        right: `// Client-side env vars are public. DB passwords, private API keys, etc. belong in YOUR BACKEND only.\n// Frontend only gets: public API URLs, public keys (analytics, maps), feature flags`,
        note: 'REACT_APP_* and VITE_* variables are baked into the compiled JavaScript bundle — any user can see them by opening DevTools. They\'re appropriate for public API URLs and non-sensitive config, not secrets.'
      },
      {
        title: 'Running npm install instead of npm ci in CI',
        note: 'npm install will update package-lock.json if it\'s out of date with package.json. In CI, you want a reproducible, exact install — use npm ci which uses the lockfile exactly and fails the build if it doesn\'t match, catching dependency drift before it reaches production.'
      }
    ]
  },

  bestPractices: [
    'Always test the production build locally (serve -s build) before deploying — catches build-time issues that don\'t appear in development.',
    'Configure the catch-all redirect for every React Router deployment — it\'s the first thing to check when routing breaks after deploy.',
    'Use npm ci (not npm install) in CI for reproducible, locked builds.',
    'Store all secrets in the hosting platform\'s environment variable settings or CI secrets — never commit them to the repository.',
    'Enable preview deployments (Vercel/Netlify) so the team can review UI changes on a live URL before merging to main.'
  ],

  interviewQuestions: [
    { q: 'What is the difference between npm start and npm run build?', a: 'npm start (or the equivalent dev server command) runs the development build server — fast rebuild, hot module replacement, source maps, verbose error messages, and large unoptimized bundles. npm run build creates the PRODUCTION build — tree-shaken, minified, content-hashed, and optimized for delivery to users. The output is a set of static files ready to serve, typically ~5-10× smaller than the development bundle.' },
    { q: 'Why do React Router apps return 404 on page refresh in production, and how do you fix it?', a: 'React Router is client-side routing — the server only knows about the real file at /index.html. When a user refreshes a URL like /dashboard, the browser requests that exact path from the server, which has no file at that path, so it returns 404. The fix is configuring a "catch-all" rule that serves index.html for ALL paths, letting React Router handle routing on the client side. Every host has a way to configure this — netlify.toml redirects, vercel.json rewrites, Apache/Nginx location blocks, or Nginx try_files.' },
    { q: 'Are environment variables in a React app secure? Can you store API keys there?', a: 'No — REACT_APP_* (CRA) and VITE_* variables are baked directly into the compiled JavaScript bundle during build time. Any user can view them by opening browser DevTools → Sources → your bundle file. They\'re appropriate for public configuration (API URLs, public third-party keys). Sensitive secrets (database passwords, private API keys, server-side tokens) must live exclusively in your backend server environment — never in frontend code.' },
    { q: 'What is a preview deployment and why is it valuable?', a: 'A preview deployment is an automatically-generated, publicly-accessible URL for a branch or PR — created by Vercel/Netlify when a PR is opened. It deploys the exact code in that PR to a live URL, letting reviewers see the actual UI changes in a browser without running the project locally. This is especially valuable for design reviews, QA testing on mobile devices, and catching issues that only appear in the production build but not in development.' },
    { q: 'What is the difference between static hosting and Node.js hosting for React apps?', a: 'A pure React SPA (CRA, Vite) produces static files (HTML, JS, CSS) that any web server can serve without executing any code — CDNs, S3, GitHub Pages, Netlify, and Vercel all work. SSR frameworks (Next.js, Remix) generate HTML on the server per request — they need a Node.js runtime actively running on the host. Static hosting is simpler, cheaper, and more scalable for SPAs; SSR requires a server process but enables server-side data fetching, SEO-friendly HTML, and faster initial page loads.' }
  ],

  summary: {
    description: 'Deploying a React app is a 3-step process: build (npm run build produces optimized static files), configure (set env vars, add the SPA catch-all redirect), and host (Vercel/Netlify for zero-config, S3+CloudFront for scale/control). Add CI/CD (GitHub Actions + npm ci + automated tests before deploy) to prevent regressions from reaching production. Remember: frontend env vars are public — secrets stay on the server.'
  },

  furtherReading: [
    { label: 'CRA deployment docs', note: 'create-react-app.dev/docs/deployment — platform-specific guides for Netlify, Vercel, GitHub Pages, AWS, and others.' },
    { label: 'Related topic', note: 'See "Performance Optimization" for bundle-size analysis before deploying, and "Testing" for setting up the CI test step that gates deployments.' }
  ]
};

export default deploymentContent;
