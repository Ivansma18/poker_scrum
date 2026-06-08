# Repository Notes

- Use npm; `package-lock.json` is the committed lockfile. Core commands are `npm run dev`, `npm run build`, `npm run start`, and `npm run lint`.
- There is no separate test or typecheck script. Use `npm run lint` for ESLint and `npm run build` for the Next production build plus TypeScript validation.
- This is a Next.js 16 App Router project with routes under `app/`; the main entrypoints are `app/layout.tsx`, `app/page.tsx`, and global styles in `app/globals.css`.
- Next.js 16 APIs and conventions may differ from older assumptions. Before changing framework behavior, read the relevant installed docs under `node_modules/next/dist/docs/` and follow deprecation notices.
- Tailwind is v4 via PostCSS (`@tailwindcss/postcss`) and `app/globals.css` imports `tailwindcss`; do not add a Tailwind v3-style config unless the project actually needs one.
- TypeScript is strict, uses bundler module resolution, and maps `@/*` to the repository root, not to `src/`.
- `CLAUDE.md` only forwards to this file; keep shared agent guidance here.

## Architecture

- Use feature-based DDD for business code. For planning poker, place domain rules under `features/planning-poker/domain`, use cases under `features/planning-poker/application`, adapters under `features/planning-poker/infrastructure`, and React UI under `features/planning-poker/presentation`.
- Keep `domain` framework-agnostic: no React, Next.js, browser APIs, Tailwind, server actions, persistence clients, or localStorage.
- Keep App Router files under `app/` thin; they should compose feature presentation components and route-level wiring only.
- Put voting rules in domain/application, not in React components.
- Define repository interfaces before infrastructure implementations when persistence or realtime is introduced.
- Prefer pure domain functions/entities so planning-poker rules can be tested without Next.js.
- Allowed dependency flow is `presentation -> application -> domain`, `infrastructure -> domain/application contracts`, and `app -> presentation/application wiring`.

## Frontend Architecture Defaults

- Build UI from small, focused components with one clear responsibility.
- Keep route/page/container components thin; they should compose feature components and pass data/actions.
- Avoid large React components. If a component mixes responsibilities or becomes hard to scan, split it into named files.
- Extract reusable UI patterns into generic components when they appear more than once or represent a clear concept.
- Prefer composition over prop-heavy or boolean-heavy component APIs.
- Move stateful orchestration, effects, subscriptions, and screen-level actions into custom hooks.
- Keep hooks focused; split persistence, realtime, forms, derived state, and action helpers when a hook grows too broad.
- Keep React components mostly presentational: receive props, render UI, and call callbacks.
- Do not embed business rules in React components; keep rules in `domain` or `application`.
- Treat components over roughly 150 lines and hooks over roughly 200 lines as refactor candidates, not hard limits.
- Refactor proactively toward small, reusable, decoupled files when changing frontend code.
- Validate frontend refactors with `npm run lint` and `npm run build`.
