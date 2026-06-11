# Healthcare Symptom Checker

A small full-stack app that takes a free-text symptom description, asks a couple
of AI-generated follow-up questions, and returns possible conditions (grounded
on a curated medical knowledge base) with a triage urgency level. It also flags
obvious emergencies before ever calling the model.

> Educational project — not a medical device and not a substitute for a doctor.

## Demo

- **Live app:** https://health-care-symptom-checker-seven.vercel.app/
- **Video walkthrough:** https://youtu.be/OTdIQSQiP4Y?si=cGoAlNTmteq6NR__

## What it does

1. You describe a symptom. Red-flag phrases (chest pain, stroke, etc.) short-circuit
   straight to an emergency notice.
2. The API asks three clarifying questions (duration, severity, related symptoms).
3. Your answers are matched against a MongoDB knowledge base, and Llama 3.3 (via
   Groq) writes up the most likely conditions, reasoning, recommendations and an
   urgency level — only from conditions in the knowledge base.
4. An Insights tab shows anonymised aggregate stats.

## Tech stack

| Layer    | Tech                                                            |
| -------- | --------------------------------------------------------------- |
| Frontend | React 18, Vite, plain CSS (JavaScript / JSX)                    |
| Backend  | Node, Express 4, TypeScript (ESM)                              |
| Database | MongoDB + Mongoose                                              |
| AI       | Groq SDK — `llama-3.3-70b-versatile`                            |
| Tooling  | Winston, Vitest + Supertest, ESLint                            |

## Architecture

```
React (Vite)  ──fetch──►  Express API  ──►  MongoDB (conditions + history)
                              │
                              └──►  Groq (Llama 3.3) for questions + analysis

API:  routes ─► controllers ─► services ─► models
```

The backend keeps `app.ts` (wiring) separate from `server.ts` (boot) so tests
can exercise the app without a database connection.

## Repo layout

```
backend/    TypeScript Express API  (see backend/README.md)
frontend/   React + Vite SPA         (see frontend/README.md)
docs/       design spec + implementation plan
```

## Running it locally

You'll need Node 18+, a MongoDB connection string, and a Groq API key.

**Backend**

```bash
cd backend
npm install
cp .env.example .env      # add GROQ_API_KEY and MONGODB_URI
npm run dev               # http://localhost:3001
```

**Frontend** (in a second terminal)

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

The backend seeds 8 conditions into MongoDB on first boot.

## Testing

```bash
cd backend && npm test          # unit + API wiring tests
cd backend && npm run typecheck # tsc --noEmit
```

## Deploying

- **Backend:** `npm run build` (tsc → `dist/`) then `npm start`. Set `NODE_ENV=production`
  and the env vars from `.env.example` on the host.
- **Frontend:** `npm run build` produces a static `dist/` (deployed to Vercel).
  Set `VITE_API_BASE_URL` to the deployed API URL.

## Known limitations / future work

- Knowledge base is a small seeded set (8 conditions) — fine for a demo, not real coverage.
- No user accounts; the API is public and rate-limited (100 req / 15 min per IP).
- The AI is grounded on the DB but can still be wrong — hence the disclaimers everywhere.
- Would like to add: an admin view for conditions, request IDs in logs, and an E2E test.
