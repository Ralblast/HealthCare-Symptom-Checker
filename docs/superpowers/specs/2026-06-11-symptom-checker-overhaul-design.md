# Healthcare Symptom Checker — Overhaul Design

**Date:** 2026-06-11
**Goal:** Turn an AI-generated MERN demo into a strong, authentic-looking resume project: backend migrated to TypeScript with clean layered architecture, real Winston logging, the frontend redesigned to a "clinical & trustworthy" look, all bugs fixed, and the whole codebase reading like genuine, competent junior-developer work rather than AI output.

## Decisions (locked)

| Area | Decision |
|------|----------|
| TypeScript scope | **Backend only** → TypeScript. Frontend stays JavaScript/JSX. |
| UI direction | **Clinical & trustworthy** — restrained teal/slate palette, strong hierarchy, minimal emoji, accessible. |
| Refactor depth | **Maximum overhaul** — real architecture, delete dead code, fix bugs, tests, natural style. |
| Backend layout | Restructure into `backend/src/` with build/start scripts + `.env.example`; document new deploy command. |
| Stats tab | Rename **"History" → "Insights"**; keep as anonymized stats dashboard, polished. |

## Current state (audit findings)

- `backend/utils/helpers.js`: ~25 exported helpers, **only 3 used** (`parseJsonResponse`, `retryWithBackoff`, `sleep`). Kitchen-sink AI smell.
- `backend/middleware/errorHandler.js`: handles `JsonWebTokenError` — **no auth exists**.
- `backend/utils/logger.js`: fake `Logger` class over `console.*`. Winston is in deps but **never imported**.
- `parseJsonResponse` **bug**: fence markers are literally `"\` \` \` j s o n"` (spaced chars) → fence-stripping never matches; works only via regex fallback.
- `History.jsx`: shows **"Grok (xAI)"** — wrong; app uses **Groq → Llama 3.3 70B**.
- Inconsistent logging (logger vs raw `console.log` in `database.js`, `errorHandler.js`, `helpers.js`).
- `frontend/eslint.config.js` references plugins **not installed** → lint broken.
- All routing/logic in one 294-line `server.js`.
- READMEs total **1,128 lines** of emoji-heavy polish; `index.css` is one **1,027-line** file.
- No tests; `author: "Your Name"`.

## Target architecture

### Backend (TypeScript, layered)

```
backend/
  src/
    config/      env.ts (typed + validated) · db.ts · constants.ts
    models/      MedicalCondition.ts · QueryHistory.ts
    routes/      checker.routes.ts · meta.routes.ts
    controllers/ checker.controller.ts · meta.controller.ts
    services/    ai.service.ts · condition.service.ts · seed.service.ts
    middleware/  validate.ts · sanitize.ts · errorHandler.ts · rateLimiter.ts
    utils/       logger.ts (Winston) · json.ts · retry.ts
    types/       index.ts (Analysis, Condition, ApiResponse, etc.)
    app.ts       (express wiring) · server.ts (bootstrap + graceful shutdown)
  tests/         Vitest unit tests + one supertest health check
  tsconfig.json · package.json · .env.example · eslint config
```

Flow: **routes → controllers → services → models.** Deliberately *not* over-abstracted (no repository pattern / DI container — reads as senior/AI). Clean, teachable layering only.

- **Tooling:** `tsx watch src/server.ts` (dev); `tsc` → `dist/`, `node dist/server.js` (prod). `tsconfig` `strict: true`, `module: NodeNext`, `target: ES2022`. No obsessive flags.
- **Winston logger:** colorized console transport (dev) + file transports (`logs/error.log`, `logs/combined.log`); level from `LOG_LEVEL`. Request-logging middleware. Replaces fake wrapper and scattered `console.log`.
- **Typed env:** validate `GROQ_API_KEY` / `MONGODB_URI` / `PORT` at boot; fail fast with a clear message.
- **Deletions/fixes:** fix `parseJsonResponse` fence bug; drop JWT error branch; delete unused helpers; real package metadata; consistent logging.

### Frontend (JavaScript/JSX, redesigned)

- Same React + Vite. Redesigned to *Clinical & trustworthy* (specifics via the **frontend-design** skill).
- CSS reorganized: a small `tokens.css` (variables) + focused component styles, instead of one 1,027-line blob.
- Fix **"Grok (xAI)" → "Llama 3.3 70B (via Groq)"**.
- Extract a small `useSymptomChecker` hook to slim `App.jsx` (real React skill, junior-level).
- Accessible forms (labels, focus states, `aria-live` on spinner/alerts, `role="alert"` on errors).
- "Insights" tab: polished stat cards, honest naming, correct model label.
- Working ESLint (fix missing-plugin problem).

## Visual direction (frontend-design)

Grounded as a real clinical triage tool, not a marketing page.

- **Palette:** Canvas `#F6F8FA` · Surface `#FFFFFF` · Text `#1E2A32` · Muted `#5B6B7B` · Hairline `#E3E8EE` · Primary teal `#0F6E6A` (hover `#0B5854`). Urgency scale: low `#2F9E6F`, medium `#C77700`, high `#D64533`, emergency `#B3261E`.
- **Type:** **Public Sans** (UI/headings — civic/public-health, deliberately not Inter); **IBM Plex Mono** for data only (match %, stat values, step numbers → "clinical readout").
- **Signature:** a triage urgency meter (Low·Medium·High) filling the active semantic color, percentages in mono. One risk: monospace for all metrics, justified by medical-instrument vernacular.
- **Layout:** centered single-column intake flow with an honest 3-step indicator (1 Describe → 2 Clarify → 3 Results); slim top bar with a monoline medical cross + Checker/Insights tabs.
- Quality floor: responsive to mobile, visible keyboard focus, `prefers-reduced-motion` respected, `aria-live` on status/alerts.

## Data flow (unchanged behavior, cleaner plumbing)

1. `POST /api/start-check` → emergency keyword scan → if emergency, log + return; else AI generates 3 clarifying questions.
2. `POST /api/analyze` → text-search match conditions in Mongo (keyword fallback) → AI analysis grounded on matched conditions → persist `QueryHistory` → return analysis.
3. `GET /api/health` · `/api/stats` · `/api/conditions` · `/api/history` for the Insights tab / monitoring.

## Error handling

- Central `errorHandler` (Mongoose `ValidationError`, duplicate key, generic 500) — JWT branch removed.
- `notFoundHandler` lists real endpoints.
- AI service degrades gracefully (fallback questions / fallback analysis) — kept, it's good UX.
- Frontend: typed-ish error states (`analyzing` / `error` / `emergency`) with retry.

## Testing

- **Vitest** (backend): `parseJsonResponse`, `retry`, emergency-keyword detection, condition matching; `supertest` on `/api/health`. Modest — not suspiciously complete.

## "Humanification" principles

- Comments explain *why*, only where a real dev pauses — natural, slightly uneven voice. No JSDoc on trivial functions.
- No code paths for non-existent features.
- README ~80–120 lines, normal prose, honest "known limitations / future work".
- A couple of realistic `// TODO:`s and minor naming quirks; formatting not roboticly uniform.
- Natural, terse, lowercase commit messages as work proceeds. Existing history left intact.

## Out of scope (risk control)

- No git-history rewrite. No auth/payments/Docker/CI. No frontend TS. No touching real `.env` secrets (add `.env.example`).

## Verification

- `npm install` + build both sides; start backend + frontend locally; hit `/api/health`; walk the full symptom flow (normal + emergency); confirm Insights tab loads. Report with actual output.
