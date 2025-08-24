# Application Audit

## Executive Summary
- Clean install completed with `date-fns` pinned to `3.6.0` to satisfy `react-day-picker`.
- `npm run dev`, `npm run build`, `npm run preview`, and `npm test` all terminate with a `Bus error` before serving or building.
- Lint (`npm run lint`) and TypeScript check (`npx tsc --noEmit`) complete without issues.
- Playwright is not installed; `scripts/audit/crawl.js` fails with `ERR_MODULE_NOT_FOUND`.

## Feature Map
| Route | Feature | Key UI Elements | Status |
|-------|---------|-----------------|--------|
| `/` | Dashboard with KPI cards, charts, meeting and proposal summaries | "New Proposal" button, charts, cards | Broken – dev server fails to start |
| `/documents` | Document library with filters, table, preview/version dialogs | Filter form, document table, preview modal | Not tested – app fails to run |
| `/meetings` | Meetings list and quick actions | Upcoming/recent meeting cards, action buttons | Not tested – app fails to run |
| `/proposals` | Proposal CRUD and bulk actions | Search/filter inputs, proposal table, dropdown actions | Not tested – app fails to run |
| `/knowledge` | Knowledge base articles and search | Category cards, search bar | Not tested – app fails to run |
| `/workflows` | Workflow templates overview | Workflow cards, create button | Not tested – app fails to run |
| `/analytics` | Reporting dashboards | Charts, filters | Not tested – app fails to run |
| `/collaboration` | Team collaboration tools | Chat placeholders, invite button | Not tested – app fails to run |
| `/security` | Security & audit logs | Settings table, log list | Not tested – app fails to run |
| `/settings` | Application settings and themes | Theme selector, profile form | Not tested – app fails to run |
| `*` | Not found page | Return home link | Not tested – app fails to run |

## Broken Items
### 1. Dev server crashes immediately
- **Route**: All
- **Steps**: `npm run dev`
- **Expected**: Vite starts on `http://localhost:8080`
- **Actual**: Process exits with `Bus error` before starting
- **Logs**:
  ```
  npm run dev
  Bus error
  ```
- **Minimal fix**: Replace `@vitejs/plugin-react-swc` with `@vitejs/plugin-react` in `vite.config.ts` or run on hardware supporting SWC required instructions.

### 2. Build step fails
- **Steps**: `npm run build`
- **Expected**: Compiled production assets
- **Actual**: `Bus error`
- **Minimal fix**: Same as above.

### 3. Preview step fails
- **Steps**: `npm run preview`
- **Expected**: Preview server after build
- **Actual**: `Bus error`
- **Minimal fix**: Same as above.

### 4. Tests cannot run
- **Steps**: `npm test`
- **Expected**: Vitest test suite executes
- **Actual**: `Bus error`
- **Minimal fix**: Same as above.

### 5. Audit crawler cannot run
- **Steps**: `node scripts/audit/crawl.js`
- **Expected**: Crawls running app
- **Actual**: `ERR_MODULE_NOT_FOUND: Cannot find package 'playwright'`
- **Minimal fix**: Install Playwright (`npm install -D playwright`) once dev server issue resolved.

## Build, Lint, and Type Check Status
- `npm run dev` – **failed** (`Bus error`)
- `npm run build` – **failed** (`Bus error`)
- `npm run preview` – **failed** (`Bus error`)
- `npm run lint` – **passed**
- `npx tsc --noEmit` – **passed**
- `npm test` – **failed** (`Bus error`)

## Peer Dependency Resolution
- Resolved `react-day-picker` and `date-fns` peer conflict by pinning `date-fns` to version `3.6.0` in `package.json`.

## Service Worker / Port Sanity
- `index.html` registers `/sw.js`; `public/sw.js` exists.
- Vite dev server configured for port `8080`; no hardcoded ports found elsewhere.
