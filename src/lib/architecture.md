# Universal Jets — Architecture Guide

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

## Regression Checklist

Before publishing, verify:
- [ ] Empty leg cards show no tail numbers or registrations
- [ ] Charter search results show no operator names
- [ ] Fleet detail pages show no aircraft_identifier
- [ ] Quote preview shows no operator or registration
- [ ] Pricing displays "Price on request" when no API price and no estimate possible
- [ ] Gallery images exclude type "tail" and "registration"
- [ ] CRM quote→contract→invoice→booking chain works end-to-end
- [ ] Region filter on empty legs resets selected leg and fetches fresh data

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/sanitize.ts` | B2C privacy enforcement |
| `src/lib/aviapagesNormalizer.ts` | API data normalization |
| `src/lib/aircraftImages.ts` | Image fallbacks & classification |
| `src/lib/pricingEstimates.ts` | Smart pricing engine |
| `src/hooks/useAviapages.ts` | Empty legs + airports + aircraft types |
| `src/hooks/useFleetData.ts` | Fleet catalog data |

## Non-Negotiable Rules

1. No tail numbers on any B2C page
2. No registration numbers on any B2C page  
3. No operator names on any B2C page
4. No raw backend IDs on any B2C page
5. All public aircraft data goes through `sanitizeAircraftForPublic()`
6. All image arrays go through `sanitizeAircraftImages()`
7. Internal CRM may bypass sanitization for authorized roles only
