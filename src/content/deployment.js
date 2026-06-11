const deploymentContent = {
  id: 'deployment',
  title: 'Deploying React Apps',
  icon: '🚀',
  theme: 'sky',
  tagline: 'Build, optimize, and deploy your React app to production with environment variables and CI/CD.',
  meta: 'Ecosystem · Production',

  whatIsIt: {
    description: [
      'Deploying a React app means running the production build (npm run build) to create optimized static files, then serving those files from a host — a CDN, a Node server, or a serverless platform.',
      'CRA and Vite apps produce static HTML/CSS/JS that any static host can serve. Next.js or Remix apps need a Node.js-compatible host because they run server-side code.'
    ],
    points: [
      'npm run build: bundles, minifies, and tree-shakes your app; creates content-hashed filenames for long-term caching.',
      'Static hosting (Vercel, Netlify, GitHub Pages, S3+CloudFront): serves files from a CDN — fast, cheap, no server to manage.',
      'Node.js hosting (Railway, Render, EC2): required for Next.js or Remix apps that run server code.',
      'Environment variables: separate config from code — never hardcode API keys in the bundle.'
    ],
    code: { title: 'Build, environment variables, and deployment config', snippet: `// 1. Environment variables in CRA: prefix with REACT_APP_
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
      text: '"Deploying is like construction vs. moving in. Development is the construction phase — scaffolding, source files, dev servers, hot reload. The production build (npm run build) finalizes the blueprints — compressed, optimized, no scaffolding left. Deployment is moving the finished building to the city (hosting platform) so anyone can visit."'
    }
  },

  whyUsed: {
    description: 'The development experience is built for developers, not users. The production build reverses that: smaller bundles, long-term caching, and no debug overhead.',
    points: [
      'Production builds are 5-10× smaller than development bundles — critical for load time.',
      'Content-hashed filenames let browsers cache files indefinitely — repeat visits load instantly.',
      'Environment variables let the same codebase work in dev, staging, and production.',
      'CI/CD pipelines run tests automatically so bugs do not reach users.'
    ]
  },

  whenToUse: {
    description: 'Every app goes through these stages. The main choices are the hosting platform and CI/CD setup.',
    points: [
      'CRA/Vite SPA: static hosting (Vercel, Netlify, GitHub Pages) — simplest, fastest, usually free.',
      'Next.js/Remix: Vercel (native), Railway, Render, or any Node.js host.',
      'Enterprise/compliance: AWS (S3+CloudFront, ECS, Amplify) or Azure Static Web Apps.',
      'Preview deployments: Vercel and Netlify auto-create a live URL for every PR — great for review.'
    ],
    analogy: {
      icon: '💡',
      title: 'The SPA routing gotcha',
      text: '"A very common first-deployment surprise: the app works at /, but going to /about and refreshing returns a 404. The hosting server has no file at that path — it returns 404. React Router works client-side, so the server needs to serve index.html for ALL paths and let React Router handle routing. Configure the catch-all redirect — it is the most important deployment config step for React Router apps."'
    }
  },

  howItWorks: {
    description: 'The production build pipeline: tree-shake (remove unused code) → bundle (combine modules) → minify (compress) → hash filenames (for caching). The output is static files ready to serve. Environment variables in .env.production appear literally in the bundle — they are not secrets.',
    code: {
      title: 'GitHub Actions CI/CD pipeline',
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
      'Use npm ci (not npm install) in CI — installs exactly what is in package-lock.json, fails if files differ.',
      'Never put secrets in .env files committed to the repo — use the hosting platform\'s environment variable settings.',
      'Source maps help debug production issues but can expose file paths — configure access carefully.'
    ]
  },

  flowDiagram: {
    title: 'From code to production',
    steps: [
      { icon: '💻', label: 'Developer pushes to main', note: 'git push → triggers CI pipeline' },
      { icon: '🧪', label: 'CI runs tests', note: 'npm ci && npm test' },
      { icon: '📦', label: 'Production build', note: 'npm run build → optimized bundle' },
      { icon: '🚀', label: 'Deploy to host', note: 'Upload to Vercel / Netlify / S3' },
      { icon: '🌐', label: 'CDN distributes globally', note: 'Users worldwide get fast loads' }
    ]
  },

  realWorldExamples: {
    intro: 'Each hosting choice has trade-offs:',
    items: [
      { icon: '⚡', title: 'Vercel', description: 'Zero-config deployment for React and Next.js. Push to main → live in ~30 seconds. Preview URLs for every PR. Free tier is generous.' },
      { icon: '🌐', title: 'Netlify', description: 'Similar to Vercel — great for SPAs. Built-in forms and edge functions. SPA redirect config is one line in netlify.toml.' },
      { icon: '☁️', title: 'AWS S3 + CloudFront', description: 'S3 stores static files; CloudFront serves them globally. More config, more control, and much lower cost at high traffic.' },
      { icon: '🐙', title: 'GitHub Pages', description: 'Free static hosting from a GitHub repo — perfect for portfolio projects. CRA\'s homepage field and gh-pages package automate deployment.' }
    ]
  },

  prosAndCons: {
    pros: [
      'Modern hosts (Vercel, Netlify) make deploying a React SPA very easy — minutes from repo to live URL.',
      'CDN-based static hosting is fast, cheap, and scales automatically.',
      'CI/CD pipelines prevent untested code from reaching production.',
      'Preview deployments give teams live review of changes before merging.'
    ],
    cons: [
      'SPAs need the catch-all redirect config — forgetting this is a very common first-deploy mistake.',
      'Environment variables baked into the client bundle are NOT secrets — anyone can read them in DevTools.',
      'SSR/ISR features (Next.js) need a Node.js host — not compatible with pure static hosts like GitHub Pages.',
      'CRA adds source maps by default — make sure they are not publicly accessible in production.'
    ]
  },

  commonMistakes: {
    items: [
      {
        title: 'Forgetting the SPA routing redirect',
        wrong: `// No catch-all config → refreshing /dashboard shows a 404 from the server, not React`,
        right: `// netlify.toml: [[redirects]] from="/*" to="/index.html" status=200\n// vercel.json: { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`,
        note: 'The server does not know about React Router\'s client-side routes. It needs to serve index.html for every URL and let React Router take over.'
      },
      {
        title: 'Putting secrets in frontend environment variables',
        wrong: `REACT_APP_DB_PASSWORD=supersecret123 // ❌ this appears literally in the JS bundle`,
        right: `// Client-side env vars are public. Passwords and private API keys belong in your backend only.\n// Frontend only gets: public API URLs, public keys (analytics, maps), feature flags`,
        note: 'REACT_APP_* and VITE_* variables are baked into the compiled JavaScript bundle. Any user can see them in DevTools → Sources.'
      },
      {
        title: 'Running npm install instead of npm ci in CI',
        note: 'npm install updates package-lock.json if it is out of date. In CI you want a reproducible install — use npm ci, which uses the lockfile exactly and fails the build if it does not match. This catches dependency drift before it reaches production.'
      }
    ]
  },

  bestPractices: [
    'Test the production build locally first: serve -s build. This catches build-time issues that do not appear in development.',
    'Configure the catch-all redirect for every React Router deployment — check this first when routing breaks after deploy.',
    'Use npm ci (not npm install) in CI for locked, reproducible builds.',
    'Store secrets in the hosting platform\'s environment variable settings — never commit them to the repo.',
    'Enable preview deployments so the team can review UI changes on a live URL before merging.'
  ],

  interviewQuestions: [
    { q: 'What is the difference between npm start and npm run build?', a: 'npm start runs the development server — fast rebuild, hot reload, source maps, and large unoptimized bundles. npm run build creates the production build — tree-shaken, minified, content-hashed, and 5-10× smaller. The output is static files ready to serve to real users.' },
    { q: 'Why do React Router apps return 404 on page refresh in production, and how do you fix it?', a: 'React Router is client-side routing. The server only knows about /index.html. When a user refreshes /dashboard, the browser asks the server for that exact file, which does not exist, so the server returns 404. The fix is a catch-all rule that serves index.html for all paths — netlify.toml redirects, vercel.json rewrites, or Nginx try_files.' },
    { q: 'Are environment variables in a React app secure?', a: 'No. REACT_APP_* and VITE_* variables are baked into the compiled JavaScript bundle at build time. Any user can view them by opening DevTools. Use them only for public config (API URLs, public keys). Passwords and private tokens must live in your backend only — never in frontend code.' },
    { q: 'What is a preview deployment and why is it useful?', a: 'A preview deployment is an auto-generated live URL for each PR, created by Vercel or Netlify. It deploys the exact code in that PR so reviewers can test the real UI on any device without running the project locally. Valuable for design review, mobile QA, and catching production-build-only issues.' },
    { q: 'When do you need Node.js hosting instead of static hosting for a React app?', a: 'A plain CRA or Vite SPA produces static files — any CDN or static host works. Next.js and Remix run server-side code per request, so they need an active Node.js process. Static hosting (S3, GitHub Pages, Netlify) cannot run server code. For SSR or API routes, use Vercel, Railway, Render, or any Node.js host.' }
  ],

  summary: {
    description: 'Deploying a React app is three steps: build (npm run build), configure (env vars + catch-all SPA redirect), and host (Vercel/Netlify for zero-config, S3+CloudFront for scale). Add CI/CD (GitHub Actions with npm ci + tests) to prevent regressions reaching production. Frontend env vars are public — secrets stay on the server.'
  },

  furtherReading: [
    { label: 'CRA deployment docs', note: 'create-react-app.dev/docs/deployment — platform guides for Netlify, Vercel, GitHub Pages, and AWS.' },
    { label: 'Related topics', note: 'See "Performance Optimization" for bundle analysis before deploying, and "Testing" for the CI test step that gates deployments.' }
  ]
};

export default deploymentContent;
