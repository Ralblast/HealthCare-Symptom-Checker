# Symptom Checker Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the backend to a clean, layered TypeScript architecture with real Winston logging, redesign the React/JSX frontend to a "clinical & trustworthy" look, fix all known bugs, add tests, and make the whole codebase read like authentic, competent junior-developer work.

**Architecture:** Backend becomes `backend/src/` with routes → controllers → services → models, typed throughout, ESM + NodeNext, `tsx` dev / `tsc` build. Frontend stays React+Vite JS/JSX, redesigned with Public Sans + IBM Plex Mono, a teal/slate clinical palette, a 3-step intake flow, and a triage urgency meter.

**Tech Stack:** TypeScript 5, Express 4, Mongoose 8, Winston 3, Groq SDK (Llama 3.3 70B), Vitest + Supertest, Vite 5, React 18.

---

## File structure (backend target)

```
backend/
  src/
    config/      env.ts · constants.ts · db.ts
    types/       index.ts
    utils/       logger.ts · json.ts · retry.ts
    models/      MedicalCondition.ts · QueryHistory.ts
    services/    ai.service.ts · condition.service.ts · seed.service.ts
    middleware/  validate.ts · sanitize.ts · rateLimiter.ts · requestLogger.ts · errorHandler.ts
    controllers/ checker.controller.ts · meta.controller.ts
    routes/      checker.routes.ts · meta.routes.ts
    app.ts · server.ts
  tests/         json.test.ts · retry.test.ts · emergency.test.ts · condition.test.ts · health.test.ts
  tsconfig.json · vitest.config.ts · eslint.config.js · package.json · .env.example · README.md
```

**ESM gotcha (applies to ALL backend relative imports):** with `module: NodeNext`, relative imports MUST carry a `.js` extension even though the source is `.ts` (e.g. `import { logger } from './utils/logger.js'`). `tsx`, `tsc`, and Vitest all resolve this correctly. Be consistent.

---

## Phase 1 — Backend TS tooling baseline

### Task 1: package.json + tsconfig + tooling

**Files:** Modify `backend/package.json`; Create `backend/tsconfig.json`, `backend/.env.example`, `backend/vitest.config.ts`, `backend/eslint.config.js`; Modify `backend/.gitignore`.

- [ ] **Step 1: Rewrite `backend/package.json`** — `type: module`, real metadata, scripts, deps.

```jsonc
{
  "name": "symptom-checker-api",
  "version": "1.0.0",
  "description": "AI symptom checker API — Express + MongoDB + Groq (Llama 3.3)",
  "type": "module",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src",
    "test": "vitest run",
    "seed": "tsx src/services/seed.service.ts"
  },
  "dependencies": {
    "compression": "^1.8.1", "connect-timeout": "^1.9.1", "cors": "^2.8.5",
    "dotenv": "^16.4.5", "express": "^4.18.2", "express-rate-limit": "^7.1.5",
    "groq-sdk": "^0.3.2", "helmet": "^7.1.0", "mongoose": "^8.0.3", "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/compression": "^1.7.5", "@types/connect-timeout": "^0.0.39",
    "@types/cors": "^2.8.17", "@types/express": "^4.17.21", "@types/node": "^20.11.0",
    "@types/supertest": "^6.0.2", "tsx": "^4.7.0", "typescript": "^5.4.0",
    "supertest": "^6.3.4", "vitest": "^1.3.0",
    "eslint": "^9.0.0", "typescript-eslint": "^7.0.0", "@eslint/js": "^9.0.0"
  },
  "engines": { "node": ">=18.0.0" }
}
```

- [ ] **Step 2: Create `backend/tsconfig.json`**

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 3: Create `backend/vitest.config.ts`** → `export default { test: { environment: 'node', include: ['tests/**/*.test.ts'] } }` (via `defineConfig` from `vitest/config`).
- [ ] **Step 4: Create `backend/eslint.config.js`** — flat config using `@eslint/js` recommended + `typescript-eslint` recommended, ignoring `dist`.
- [ ] **Step 5: Append to `backend/.gitignore`:** `dist/`, `logs/`, keep `.env` ignored, allow `.env.example`.
- [ ] **Step 6: Create `backend/.env.example`** with commented keys: `GROQ_API_KEY=`, `MONGODB_URI=`, `PORT=3001`, `NODE_ENV=development`, `LOG_LEVEL=info`, `FRONTEND_URL=http://localhost:5173`.
- [ ] **Step 7: Install** — `cd backend && npm install`. Expected: clean install.
- [ ] **Step 8: Commit** — `chore: typescript tooling + scripts for backend`.

---

## Phase 2 — Types, config, utils

### Task 2: Shared types

**Files:** Create `backend/src/types/index.ts`.

```ts
export type UrgencyLevel = 'low' | 'medium' | 'high';
export type Severity = UrgencyLevel | 'emergency';

export interface PotentialCondition {
  conditionName: string;
  matchPercentage: number;
  reasoning: string;
  recommendations: string[];
  source: string;
}

export interface SymptomAnalysis {
  potentialConditions: PotentialCondition[];
  summary: string;
  urgencyLevel: UrgencyLevel;
  disclaimer?: string;
}
```

### Task 3: config/env.ts (typed + validated)

**Files:** Create `backend/src/config/env.ts`.

- Load `dotenv/config`, read `process.env`, validate required keys (`GROQ_API_KEY`, `MONGODB_URI`). Throw a clear `Error` listing any missing keys. Export a typed `env` object: `{ port, nodeEnv, mongoUri, groqApiKey, logLevel, frontendUrl, isProd }`.

### Task 4: config/constants.ts

Port `EMERGENCY_KEYWORDS`, `VALIDATION_RULES`, `RATE_LIMIT`, `AI_CONFIG`, `ERROR_MESSAGES` from the old `config/constants.js`. Drop unused `HTTP_STATUS` members not referenced (keep a slim `HTTP_STATUS` with the codes actually used). Type with `as const`.

### Task 5: utils/logger.ts (real Winston)

**Files:** Create `backend/src/utils/logger.ts`.

```ts
import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ level, message, timestamp, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level} ${message}${extra}`;
  })
);

export const logger = winston.createLogger({
  level: env.logLevel,
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (!env.isProd) {
  logger.add(new winston.transports.Console({ format: devFormat }));
}

export default logger;
```

### Task 6: utils/json.ts — fix the fence bug

**Files:** Create `backend/src/utils/json.ts`.

- Port `parseJsonResponse` but FIX the fence markers (the old code used `"\` \` \` j s o n"`). Correct version strips a leading ```` ```json ```` / ```` ``` ```` and trailing ```` ``` ````, then falls back to the `/{[\s\S]*}/` match. Signature: `export function parseJsonResponse<T = unknown>(text: string): T | null`.

### Task 7: utils/retry.ts

Port `retryWithBackoff` + `sleep` only (drop the other ~22 helpers entirely). Type: `retryWithBackoff<T>(fn: () => Promise<T>, maxAttempts?: number, baseDelay?: number): Promise<T>`. Use `logger.warn` for retry notices (not console.log).

- [ ] **Commit after Phase 2** — `feat: typed config, winston logger, json/retry utils`.

---

## Phase 3 — Models

### Task 8: models/MedicalCondition.ts + QueryHistory.ts

Port both Mongoose schemas to TS with interfaces:

```ts
export interface IMedicalCondition {
  condition: string; symptoms: string[]; description: string;
  recommendations: string[]; source: string; severity: Severity;
}
```
Keep the text index. `QueryHistory` interface includes `symptom`, `analysisResult?: SymptomAnalysis`, `isEmergency`, `ipAddress?`, `userAgent?`, timestamps. Export typed models via `mongoose.model<IMedicalCondition>(...)`.

- [ ] **Commit** — `feat: typed mongoose models`.

---

## Phase 4 — Services

### Task 9: services/ai.service.ts

Port `generateClarificationQuestions` and `analyzeSymptoms` to TS. Use shared types for return values (`Promise<string[]>`, `Promise<SymptomAnalysis>`). Keep the graceful fallbacks. Use `logger`. Replace JSDoc-on-everything with one short comment per function explaining the *why* (grounding the AI on the DB knowledge base).

### Task 10: services/condition.service.ts

Extract the condition-matching logic currently inline in `server.js` `/api/analyze` (text search + keyword fallback) into `findMatchingConditions(context: string): Promise<IMedicalCondition[]>`. This decouples DB querying from the controller.

### Task 11: services/seed.service.ts

Port `seedDatabase.js` → `seed.service.ts`. Keep the 8 seed conditions verbatim (real medical content, good). Export `seedMedicalData()`. Make it runnable standalone (`npm run seed`) — guard with `if (import.meta.url === ...)` OR a small `if (process.argv[1]...)` check; simplest: a tiny `src/scripts/seed.ts`? Keep it in seed.service.ts with a run guard.

- [ ] **Commit** — `feat: ai + condition + seed services`.

---

## Phase 5 — Middleware

### Task 12: middleware

- `validate.ts` — port `validateSymptomInput` / `validateAnalysisInput` as typed `RequestHandler`s. Attach parsed values via a typed augmentation: extend Express `Request` with `sanitizedSymptom?` / `sanitizedContext?` in `types/express.d.ts` (or inline module augmentation).
- `sanitize.ts` — port `sanitizeRequestBody`.
- `rateLimiter.ts` — the `express-rate-limit` config from server.js.
- `requestLogger.ts` — the request-logging middleware using `logger.info`.
- `errorHandler.ts` — port `errorHandler` + `notFoundHandler`, **REMOVE the `JsonWebTokenError` branch** (no auth exists). Use `logger.error`. Update `notFoundHandler` endpoint list to match real routes.

- [ ] **Commit** — `feat: typed middleware (validation, sanitize, rate limit, errors)`.

---

## Phase 6 — Controllers + routes

### Task 13: controllers/checker.controller.ts

Two handlers ported from `server.js`:
- `startCheck` — emergency keyword scan → log + persist + return emergency, else `generateClarificationQuestions`.
- `analyze` — `findMatchingConditions` → `analyzeSymptoms` → persist `QueryHistory` → return analysis.

### Task 14: controllers/meta.controller.ts

`healthCheck`, `getStats`, `getConditions`, `getHistory` ported from `server.js`.

### Task 15: routes

- `checker.routes.ts` — `POST /start-check`, `POST /analyze` with `timeout('60s')`, `haltOnTimedout`, validators.
- `meta.routes.ts` — `GET /health`, `/stats`, `/conditions`, `/history`.
Mount both under `/api` in `app.ts`.

- [ ] **Commit** — `feat: controllers + routes`.

---

## Phase 7 — App wiring, server bootstrap, delete old JS

### Task 16: app.ts + server.ts

- `app.ts` — build & export the Express app: helmet, CORS (port the allowedOrigins logic, read `frontendUrl` from env), json limit, compression, sanitize, rate limiter, request logger, mount routes, notFound + errorHandler. No `app.listen` here (so tests can import the app).
- `server.ts` — `import app`, connect DB, seed, `app.listen`, graceful shutdown (`SIGTERM`/`SIGINT`), `unhandledRejection`. Use `logger`.

### Task 17: Delete legacy backend JS

Delete: `backend/server.js`, `backend/config/*.js`, `backend/models/*.js`, `backend/services/*.js`, `backend/middleware/*.js`, `backend/utils/*.js`, `backend/README.md` (rewritten later). Keep `.env`.

- [ ] **Step: typecheck + dev boot smoke test** — `npm run typecheck` (expect clean), then `npm run dev` and confirm "Server started" + DB connect in logs, then stop.
- [ ] **Commit** — `refactor: express app/server wiring; remove legacy js`.

---

## Phase 8 — Backend tests

### Task 18: Vitest tests

**Files:** `backend/tests/json.test.ts`, `retry.test.ts`, `emergency.test.ts`, `condition.test.ts`, `health.test.ts`.

- `json.test.ts` — `parseJsonResponse` parses plain JSON, strips ```` ```json ```` fences (the regression the old bug missed), returns `null` on garbage.
- `retry.test.ts` — succeeds first try; retries then succeeds; throws after max attempts. Use small delays.
- `emergency.test.ts` — a small pure `isEmergency(text)` helper (extract from controller into `condition.service.ts` or a `utils/emergency.ts`) returns true for "chest pain", false for "mild headache".
- `condition.test.ts` — keyword-fallback matching returns expected condition for "runny nose and cough" (mock the model or test the pure keyword filter extracted as a pure function).
- `health.test.ts` — `supertest(app).get('/api/health')` returns 200/503 shape (mock mongoose call or accept 503 when no DB — assert the JSON shape has `success`).

> Keep tests modest and real — not exhaustive. Extract pure functions where needed so tests don't require a live DB.

- [ ] **Step: run** — `npm test`. Expected: all pass.
- [ ] **Commit** — `test: unit tests for json, retry, emergency, matching, health`.

---

## Phase 9 — Backend README + .env.example polish

### Task 19: backend/README.md (~70 lines)

Normal prose: what it is, stack, setup (`npm i`, copy `.env.example` → `.env`, `npm run dev`), scripts table, endpoint list, a short "notes / future work" section. No emoji walls. Document the new deploy command: `npm run build && npm start`.

- [ ] **Commit** — `docs: backend readme + env example`.

---

## Phase 10 — Frontend: tokens, fonts, global CSS

### Task 20: Split CSS + new design tokens

**Files:** Create `frontend/src/styles/tokens.css`, `frontend/src/styles/base.css`; trim `frontend/src/index.css` to `@import` those + keep component classes (or split further). Update `frontend/index.html` font links.

- Replace Inter import in `index.html` with **Public Sans** + **IBM Plex Mono** (Google Fonts).
- `tokens.css` — the palette + type + spacing/radius/shadow variables from the spec (teal `#0F6E6A`, slate `#1E2A32`, urgency scale, `--font-sans: 'Public Sans'`, `--font-mono: 'IBM Plex Mono'`).
- `base.css` — reset, body, focus-visible styles, `prefers-reduced-motion` block.

- [ ] **Commit** — `style: clinical design tokens + fonts (public sans / plex mono)`.

---

## Phase 11 — Frontend: hook + App + step indicator

### Task 21: useSymptomChecker hook

**Files:** Create `frontend/src/hooks/useSymptomChecker.js`.

- Move the `appState` machine + `handleSymptomSubmit` / `handleAnswersSubmit` / `handleReset` + API calls out of `App.jsx` into a hook returning `{ state, questions, result, errorMessage, submitSymptom, submitAnswers, reset }`. Slims `App.jsx`, shows real React structure.

### Task 22: App.jsx + StepIndicator

- Rewrite `App.jsx` to use the hook; add a `StepIndicator` component (1 Describe → 2 Clarify → 3 Results) driven by current state. Rename "History" tab → **"Insights"**. New slim header with monoline cross mark.
- Create `frontend/src/components/StepIndicator.jsx`.

- [ ] **Commit** — `refactor: extract useSymptomChecker hook + step indicator`.

---

## Phase 12 — Frontend: component redesign

### Task 23: Redesign components to clinical look

**Files:** Modify `SymptomInput.jsx`, `ClarificationQuestions.jsx`, `ResultsDisplay.jsx`, `LoadingSpinner.jsx`, `History.jsx` (→ Insights), plus emergency/error blocks in `App.jsx`. Update the corresponding CSS.

- **ResultsDisplay** — add the **triage urgency meter** (Low·Medium·High, active segment in semantic color), match % in mono, condition cards with cited source chips.
- **History/Insights** — fix **"Grok (xAI)" → "Llama 3.3 70B (via Groq)"**, polish stat cards (mono values), keep privacy notice.
- Accessibility: `aria-live="polite"` on analyzing state, `role="alert"` on errors/emergency, labels on all inputs, visible focus.
- Reduce emoji to purposeful minimum (emergency 🚨 may stay; remove decorative ones).

- [ ] **Step: visual smoke test** — `npm run dev` in frontend, load app, walk the flow.
- [ ] **Commit** — `style: redesign components to clinical/trustworthy look`.

---

## Phase 13 — Frontend: eslint, model label, README

### Task 24: Fix frontend tooling + docs

- Add missing eslint devDeps (`eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`) to `frontend/package.json` so `eslint.config.js` runs; add `"lint": "eslint ."` script. Run `npm run lint`, fix easy warnings.
- Rewrite `frontend/README.md` (~60 lines, normal prose).

- [ ] **Commit** — `chore: fix frontend eslint deps + readme`.

---

## Phase 14 — Root README + final verification

### Task 25: Root README + end-to-end verify

- Rewrite root `README.md` (~100 lines): overview, screenshot placeholder, stack, architecture diagram (simple ASCII), local setup (backend + frontend), deploy notes, known limitations / future work. Honest, normal voice.
- **Verify end-to-end:**
  - Backend: `npm run build` (expect clean), `npm run dev` → health OK.
  - Frontend: `npm run dev` → app loads.
  - Walk: normal symptom → questions → analysis → results with urgency meter; emergency symptom ("chest pain") → emergency screen; Insights tab loads stats.
  - `npm test` (backend) green; `npm run typecheck` clean.
- [ ] **Commit** — `docs: root readme + project overview`.

---

## Self-review notes

- **Spec coverage:** TS backend ✓ (P1–9), Winston ✓ (T5), layered arch ✓ (P4–7), bug fixes — json fence (T6), JWT removal (T12), Grok→Llama (T23), eslint (T24) ✓, dead-code deletion ✓ (T7/T17), clinical UI ✓ (P10–12), Insights rename ✓ (T22/T23), tests ✓ (P8), READMEs slimmed ✓ (T19/24/25), deploy scripts ✓ (T1/T19), .env.example ✓ (T1). All spec items mapped.
- **Type consistency:** `SymptomAnalysis` / `PotentialCondition` / `UrgencyLevel` used consistently across types, services, models, controllers.
- **No live-DB tests:** pure functions extracted (emergency, keyword match) so unit tests run without Mongo.
- **ESM `.js` import extensions:** applied to every backend relative import.
