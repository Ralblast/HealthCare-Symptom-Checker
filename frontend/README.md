# Symptom Checker — Frontend

React + Vite single-page app for the Healthcare Symptom Checker. It walks the
user through a three-step flow — describe symptoms, answer a couple of follow-up
questions, then see possible conditions with a triage urgency reading — and has
a separate Insights tab with anonymised usage stats.

## Stack

- React 18 + Vite 5 (JavaScript / JSX)
- Plain CSS with design tokens (no UI framework)
- PropTypes for component prop contracts

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

The API base URL comes from `VITE_API_BASE_URL` (see `.env`). It defaults to
`http://localhost:3001`, so with the backend running locally you don't need to
set anything.

## Scripts

| Script            | Does                         |
| ----------------- | ---------------------------- |
| `npm run dev`     | Vite dev server              |
| `npm run build`   | Production build to `dist/`  |
| `npm run preview` | Preview the production build |
| `npm run lint`    | ESLint                       |

## Structure

```
src/
  components/   UI components (input, questions, results, insights, ...)
  hooks/        useSymptomChecker — the flow state machine
  styles/       tokens.css + base.css
  utils/        api.js — fetch wrapper with a timeout
  App.jsx       layout, tabs, step routing
```

## Notes

- The whole checker flow lives in `useSymptomChecker`, so `App.jsx` only decides
  what to render for the current state.
- Numbers/metrics use a monospace face on purpose, to read like a clinical readout.
- Colours, type and spacing are all CSS variables in `styles/tokens.css`.
