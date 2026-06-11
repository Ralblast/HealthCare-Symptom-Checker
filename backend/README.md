# Symptom Checker API

TypeScript/Express backend for the Healthcare Symptom Checker. It runs a small
triage flow: scan for emergency keywords, ask AI-generated follow-up questions,
then analyse the answers against a MongoDB knowledge base using Groq (Llama 3.3).

## Stack

- Node + Express 4 (ESM, TypeScript)
- MongoDB via Mongoose
- Groq SDK for the LLM calls (`llama-3.3-70b-versatile`)
- Winston for logging, Vitest + Supertest for tests

## Project layout

```
src/
  config/       env validation, db connection, constants
  models/       Mongoose schemas (MedicalCondition, QueryHistory)
  services/     ai, condition matching, db seeding
  middleware/   validation, sanitisation, rate limiting, errors
  controllers/  request handlers
  routes/       route definitions
  app.ts        express app (no listen — imported by tests)
  server.ts     boot: connect db, seed, listen
```

Requests flow `routes → controllers → services → models`. `app.ts` is kept
separate from `server.ts` so the test suite can import the app without opening a
DB connection.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in GROQ_API_KEY and MONGODB_URI
npm run dev            # tsx watch on http://localhost:3001
```

The server seeds the knowledge base on first boot (8 conditions) and is a no-op
on later boots.

## Scripts

| Script              | Does                                        |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Watch-mode dev server (tsx)                 |
| `npm run build`     | Compile TypeScript to `dist/`               |
| `npm start`         | Run the compiled build (`node dist/server`) |
| `npm run typecheck` | `tsc --noEmit`                              |
| `npm run lint`      | ESLint over `src`                           |
| `npm test`          | Vitest                                      |
| `npm run seed`      | Seed the DB manually                        |

## Endpoints

| Method | Path               | Purpose                                  |
| ------ | ------------------ | ---------------------------------------- |
| GET    | `/api/health`      | Health + DB ping                         |
| POST   | `/api/start-check` | Emergency check / clarifying questions   |
| POST   | `/api/analyze`     | Analyse full symptom context             |
| GET    | `/api/conditions`  | List knowledge-base conditions           |
| GET    | `/api/history`     | Recent (anonymised) queries              |
| GET    | `/api/stats`       | Aggregate stats for the Insights tab     |

## Deploying

Build first, then run the compiled output:

```bash
npm run build && npm start
```

Set `NODE_ENV=production` plus the env vars from `.env.example` on the host.

## Notes / future work

- The emergency keyword list is intentionally broad — a false positive only
  shows a "seek care" screen, which is the safe failure mode here.
- No auth yet; the API is public and rate-limited to 100 req / 15 min per IP.
- Would be nice to add request IDs to the logs and a proper conditions admin.
