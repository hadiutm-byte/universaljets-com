# Universal Jets — Private Jet Charter Platform

> **Fly Smarter. Fly Private.** — Next-generation B2B, B2C & CRM aviation platform powered by AI, real-time data, and a futuristic design system.

---

## Overview

Universal Jets is a full-stack private aviation platform serving corporate clients, individual travellers, and internal operations teams. It combines a luxury consumer experience with enterprise-grade CRM tooling, AI-driven concierge capabilities, and a comprehensive B2B portal.

---

## What's New — Next-Gen Upgrades

| Area | Enhancement |
|------|-------------|
| 🤖 **AI Concierge (Ricky)** | Re-enabled 3D AI assistant with voice synthesis (Web Speech API), guided booking flows, and live chat backed by OpenAI |
| 🏢 **B2B Corporate Portal** | Dedicated `/b2b` page with performance dashboards, partnership tiers, and API integration info |
| 📊 **AI Predictive Analytics** | CRM dashboard widget surfacing real-time KPI insights with trend analysis |
| 🎤 **Voice Search** | Web Speech API mic button in the flight search box — speak your origin airport |
| 🌗 **Dark / Light Mode** | Fully implemented theme toggle in Navbar with CSS variable–based theming |
| 💎 **Glassmorphism Design** | Reusable `.glass`, `.glass-dark`, `.glass-gold`, `.glass-card`, `.holo-border` CSS utilities |
| 📱 **PWA Support** | `manifest.json` + service worker for offline-first, installable mobile experience |

---

## Features

### Consumer (B2C)
- **On-demand Charter** — search, quote, and book private jets globally
- **Empty Legs** — real-time map of available discounted flights
- **Membership & Jet Card** — tiered access programmes with flight credits
- **AI Concierge (Ricky)** — voice-enabled AI advisor powered by OpenAI
- **Destinations** — editorial content and curated routes
- **PWA** — install on any mobile device for app-like experience

### Corporate (B2B)
- **Corporate Portal (`/b2b`)** — real-time performance dashboards, contract management, and API docs
- **ACMI & Leasing** — structured aircraft leasing for operators
- **Account Management** — dedicated aviation advisors per corporate account
- **Multi-Payment Support** — consolidated billing, crypto-wallet ready

### Internal CRM
- **Pipeline Management** — Kanban-style lead and deal tracking
- **Quotes & Invoices** — full document lifecycle management
- **Operations** — trip coordination, crew briefings, FBO management
- **Finance Dashboard** — receivables, payables, bank reconciliation
- **HR & BD** — headcount and business development tracking
- **AI Predictive Analytics** — live KPI insights with trend forecasting

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Routing** | React Router v6 |
| **Styling** | Tailwind CSS, custom glassmorphism utilities, dark/light theming |
| **Animations** | Framer Motion, Three.js / React Three Fiber |
| **Data Fetching** | TanStack React Query |
| **Backend** | Supabase (PostgreSQL + Edge Functions on Deno) |
| **AI / Voice** | OpenAI (via Supabase Edge), Web Speech API (SpeechSynthesis + Recognition) |
| **Maps** | Mapbox GL |
| **Charts** | Recharts |
| **Testing** | Vitest (unit), Playwright (e2e) |
| **Package Manager** | Bun / npm |
| **PWA** | Web App Manifest + Service Worker |

---

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/hadiutm-byte/universaljets-com.git
   cd universaljets-com
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and other keys
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # App available at http://localhost:5173
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npx playwright test
```

---

## Deployment

Universal Jets is optimised for **Vercel** (frontend) with **Supabase** providing the backend:

1. Push to GitHub — Vercel auto-deploys from `main`.
2. Set environment variables in Vercel dashboard.
3. Deploy Supabase Edge Functions: `supabase functions deploy`.

---

## PWA Installation

The app ships a full Web App Manifest and Service Worker. On mobile browsers, tap **"Add to Home Screen"** to install Universal Jets as a native-like app.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'feat: add your feature'`.
4. Push: `git push origin feature/your-feature`.
5. Open a Pull Request.

---

## License

This project is proprietary to Universal Jets. All rights reserved.
