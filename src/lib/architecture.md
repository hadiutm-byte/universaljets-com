# Universal Jets — Architecture Guide

## ⚠️ IMPORTANT: Public Pages Must Only Consume Sanitized Data

**Every public/B2C/member-facing page MUST consume aircraft data exclusively
through the centralized normalization + sanitization layer.**

No public component may:
- Import raw API responses directly
- Inline its own field-stripping logic
- Bypass `sanitizeAircraftForPublic()` or `sanitizeAircraftImages()`

If you need aircraft data on a public page, use:
1. `aviapagesNormalizer.ts` → normalize raw API shape
2. `sanitize.ts` → strip private fields for B2C

Internal CRM pages (`/crm/*`) may bypass sanitization for authorized roles.

---

## Three System Layers

### A. Public Luxury Website
Pages: Homepage, Empty Legs, Charter Search, Fleet, Jet Card, Membership, Quote Preview
- **NEVER** consumes raw API data directly
- **ALWAYS** consumes through `sanitize.ts` + `aviapagesNormalizer.ts`
- **NEVER** displays: tail_number, registration, operator name, aircraft_identifier

### B. Internal CRM (`/crm/*`)
Pages: Dashboard, Clients, Quotes, Contracts, Invoices, Trips, Ops, Operator Requests
- May consume raw data with full operational details
- Role-gated via `has_role()` RLS policies
- Shows: operator name, tail number, aircraft identifier (internal only)

### C. Integration / Data Layer
Files: `src/lib/sanitize.ts`, `src/lib/aviapagesNormalizer.ts`, `src/lib/aircraftImages.ts`, `src/lib/pricingEstimates.ts`

---

## Data Flow

```
API Response
  ↓
aviapagesNormalizer.ts  (field normalization, image dedup, price parsing)
  ↓
sanitize.ts             (strip private fields for B2C)
  ↓
PublicAircraftCard / toPublicDisplay()  (shared display mapping)
  ↓
React Component (EmptyLegCard, FleetCard, SearchResult, QuoteView)
```

---

## Client-Facing Export Audit

All client-visible outputs must also be sanitized:

| Export Surface         | Status    | Notes |
|------------------------|-----------|-------|
| QuoteViewPage          | ✅ Clean  | Uses `sanitizeAircraftName()`, DB query excludes operator fields |
| Empty Leg Share Card   | ✅ Clean  | Receives only pre-sanitized `aircraftType` string |
| Share Card Download    | ✅ Clean  | `useShareCard` hook consumes sanitized EmptyLeg objects |
| Quote Email (future)   | ⚠️ Guard  | Must use `sanitizeAircraftName()` on aircraft field |
| Quote PDF (future)     | ⚠️ Guard  | Must pipe through `sanitizeAircraftForPublic()` |

**Rule**: Any future downloadable, emailable, or shareable client document
MUST pass aircraft data through `sanitize.ts` before rendering.

---

## Regression Checklist

Before publishing any change, verify ALL of the following:

### B2C Privacy (non-negotiable)
- [ ] No tail numbers on any public page
- [ ] No registration numbers on any public page
- [ ] No operator names on any public page
- [ ] No raw backend IDs (aircraft_identifier, operator_id) on public pages
- [ ] No bracketed registrations in aircraft display names (e.g. "(HA-JEX)")
- [ ] Search result titles do not include registrations
- [ ] Image captions / alt text do not include registrations
- [ ] Modal dialogs (EmptyLegPopup, FleetDetailModal) show no private data
- [ ] Quote preview page shows no operator or tail data

### Pricing
- [ ] If API price exists → show formatted price
- [ ] If no price exists → show "Price on request"
- [ ] Never leave blank price areas

### Image Galleries
- [ ] Gallery images filtered via `sanitizeAircraftImages()`
- [ ] Image types "tail" and "registration" are excluded
- [ ] Fallback placeholder shown when no images available
- [ ] No duplicate images in gallery arrays

### Region Filtering (Empty Legs)
- [ ] Middle East filter returns only Middle East results
- [ ] Asia filter returns only Asia results
- [ ] Europe filter returns only Europe results
- [ ] Americas filter returns only Americas results
- [ ] "All" shows unfiltered results
- [ ] Region change clears selected leg and fetches fresh data
- [ ] No stale data or mixed-region leakage

### CRM Workflow Chain
- [ ] Client → Request → Operator Request → Quote → Contract → Invoice → Booking
- [ ] Each record has clear status and linked records
- [ ] Activity timeline visible on detail pages
- [ ] Status transitions work correctly

### Critical Flows
- [ ] Empty leg page loads and displays cards
- [ ] Charter search returns and displays results
- [ ] Fleet page loads with correct categories
- [ ] Homepage aircraft teasers render correctly
- [ ] Jet Card page displays tiers
- [ ] Membership page accessible
- [ ] Public quote preview renders correctly
- [ ] CRM internal search works
- [ ] Quote creation flow completes

---

## Non-Negotiable Rules

1. No tail numbers on any B2C page
2. No registration numbers on any B2C page
3. No operator names on any B2C page
4. No raw backend IDs on any B2C page
5. All public aircraft data goes through `sanitizeAircraftForPublic()`
6. All image arrays go through `sanitizeAircraftImages()`
7. Internal CRM may bypass sanitization for authorized roles only
8. All client-facing exports (share cards, PDFs, emails) must be sanitized
9. Price display must always show a value or "Price on request"
10. Future features must follow the Data Flow diagram above — no shortcuts

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/sanitize.ts` | B2C privacy enforcement |
| `src/lib/aviapagesNormalizer.ts` | API data normalization |
| `src/lib/aircraftImages.ts` | Image fallbacks & classification |
| `src/lib/pricingEstimates.ts` | Smart pricing engine |
| `src/hooks/useAviapages.ts` | Empty legs + airports + aircraft types |
| `src/hooks/useFleetData.ts` | Fleet catalog data |
| `src/pages/QuoteViewPage.tsx` | Public quote preview (sanitized) |
| `src/hooks/useShareCard.ts` | Share card generation (sanitized input) |
