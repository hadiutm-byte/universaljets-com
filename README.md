# Universal Jets

Website and internal CRM for Universal Jets Aviation Brokerage FZCO, an independent
private jet charter broker based in Dubai. Universal Jets arranges flights with
third-party operators and does not own or operate aircraft.

This repository holds three things that share one Supabase back end:

- **Public site**: charter, aircraft, empty legs, Jet Card, membership, destinations
  and the flight request forms.
- **Client area**: sign-in, dashboard, profile and quote view.
- **CRM** (`/crm`): staff screens for leads, requests, quotes, contracts, invoices,
  trips, finance, HR and admin. Access is role-based.

## Stack

- React 18, TypeScript, Vite, Tailwind CSS, shadcn/Radix UI, React Router
- Supabase: Auth, Postgres with row-level security, Edge Functions, Storage
- Vitest for unit tests

## Local development

```bash
npm ci
npm run dev        # Vite dev server on http://localhost:8080
npm run build      # production build into dist/
npm test           # unit tests
```

Environment variables are listed in `.env.example`. Only publishable (public) keys
belong in `VITE_*` variables. Service keys live in Supabase function secrets and
must never be added to this repository.

## Deployment

- **Site**: `ci.yml` builds and tests every pull request and every push to `main`.
  It does not deploy. Production deploys are handled by Cloudflare Workers Builds
  on pushes to `main`, using `wrangler.jsonc` (static assets with single-page
  fallback). A merge to `main` is therefore a release.
- **Edge functions**: deployed manually with the "Deploy Supabase Edge Functions"
  workflow. It never runs on push.
- **After a deploy**: run the read-only smoke test.

  ```bash
  node scripts/smoke-test.mjs https://universaljets.com
  ```

## Working rules

- Changes go through a pull request. Do not push to `main` directly.
- DNS, email records, tag manager settings and database migrations are changed
  only with the owner's approval.
- Do not publish availability, safety or accreditation claims that have not been
  verified. A price in a supplier feed is not confirmed availability.
- Operator names, tail numbers and registrations are never sent to public pages.
  See `src/lib/architecture.md`.
