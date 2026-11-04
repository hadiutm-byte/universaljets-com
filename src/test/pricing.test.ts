import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { getCharterPrice, estimateFlightTimeMin, greatCircleDistanceNm } from "@/lib/pricingEstimates";

describe("getCharterPrice — API-first provenance", () => {
  it("returns exact API totals as confirmed prices", () => {
    const p = getCharterPrice({ price: 48000, priceCurrency: "USD", priceUnit: "total" });
    expect(p.variant).toBe("exact");
    expect(p.source).toBe("api_exact");
    expect(p.isEstimate).toBe(false);
    expect(p.display).toBe("$48,000");
  });

  it("labels server-side API estimates distinctly", () => {
    const p = getCharterPrice({ price: 32500, priceCurrency: "USD", priceUnit: "estimate" });
    expect(p.variant).toBe("estimate");
    expect(p.source).toBe("api_estimate");
    expect(p.display).toMatch(/^From \$32,500 estimate$/);
  });

  it("multiplies hourly API rates by flight time", () => {
    const p = getCharterPrice({ price: 6000, priceUnit: "per_hour", flightTimeMin: 180 });
    expect(p.source).toBe("api_exact");
    expect(p.low).toBe(18000);
  });

  it("does NOT invent a client-side estimate unless explicitly allowed", () => {
    const p = getCharterPrice({ price: null, aircraftClass: "midsize", distanceNm: 1500 });
    expect(p.variant).toBe("request");
    expect(p.source).toBe("request");
    expect(p.display).toBe("Price on request");
  });

  it("produces a class/range client estimate only when opted in", () => {
    const p = getCharterPrice({ price: null, aircraftClass: "midsize", distanceNm: 1500, allowClientEstimate: true });
    expect(p.variant).toBe("estimate");
    expect(p.source).toBe("client_estimate");
    expect(p.low).toBeGreaterThan(0);
    expect(p.high).toBeGreaterThanOrEqual(p.low);
  });

  it("falls back to USD on an unknown currency code", () => {
    const p = getCharterPrice({ price: 1000, priceCurrency: "NOPE", priceUnit: "total" });
    expect(p.display).toBe("$1,000");
  });
});

describe("route maths", () => {
  it("computes Dubai → London great-circle distance within tolerance", () => {
    const nm = greatCircleDistanceNm(25.25, 55.36, 51.47, -0.46);
    expect(nm).toBeGreaterThan(2900);
    expect(nm).toBeLessThan(3050);
  });

  it("estimates flight time with taxi allowance", () => {
    const min = estimateFlightTimeMin(1000, "midsize");
    expect(min).toBeGreaterThan(120);
    expect(min).toBeLessThan(180);
  });
});

describe("search surfaces are API-first", () => {
  it("public and CRM search pages disable client-side invented estimates", () => {
    for (const f of ["src/pages/SearchResults.tsx", "src/pages/crm/InternalSearchPage.tsx"]) {
      expect(readFileSync(f, "utf8")).toContain("allowClientEstimate: false");
    }
  });

  it("charter-search edge function tags its estimates and infers class when the API omits it", () => {
    const src = readFileSync("supabase/functions/aviapages-charter-search/index.ts", "utf8");
    expect(src).toContain("finalPriceUnit = 'estimate'");
    expect(src).toContain("function inferClassKey(");
    expect(src).toContain("estFlightTimeMin");
  });
});

describe("mapbox removal", () => {
  it("no mapbox dependency, chunk, prefetch or token remains", () => {
    const pkg = readFileSync("package.json", "utf8");
    expect(pkg).not.toMatch(/mapbox/i);
    expect(readFileSync("vite.config.ts", "utf8")).not.toMatch(/mapbox/i);
    expect(readFileSync("index.html", "utf8")).not.toMatch(/mapbox/i);
    for (const f of [
      "src/lib/emptyLegShareCard.ts",
      "src/components/QuoteRouteMap.tsx",
      "src/components/empty-legs/EmptyLegsMapView.tsx",
      "src/pages/ContactPage.tsx",
    ]) {
      expect(readFileSync(f, "utf8")).not.toMatch(/mapbox|pk\.eyJ/i);
    }
  });
});

describe("svgRouteMap geometry", () => {
  it("fits a view box to the container aspect without distortion", async () => {
    const { fitViewBox, projectMercator } = await import("@/lib/svgRouteMap");
    const pts: [number, number][] = [projectMercator(25.25, 55.36), projectMercator(51.47, -0.46)];
    const v = fitViewBox(pts, { aspect: 2 });
    expect(v.w / v.h).toBeCloseTo(2, 3);
    for (const [x, y] of pts) {
      expect(x).toBeGreaterThan(v.x);
      expect(x).toBeLessThan(v.x + v.w);
      expect(y).toBeGreaterThan(v.y);
      expect(y).toBeLessThan(v.y + v.h);
    }
  });

  it("alternates label sides for colliding neighbours and de-duplicates codes", async () => {
    const { layoutLabels } = await import("@/lib/svgRouteMap");
    const labels = layoutLabels(
      [
        { code: "EGGW", point: [49.9, 14.1] },
        { code: "LFPB", point: [50.6, 14.6] },
        { code: "EGGW", point: [49.9, 14.1] },
      ],
      { x: 40, y: 10, w: 20, h: 10 },
      40,
    );
    expect(labels.map((l) => l.code)).toEqual(["EGGW", "LFPB"]);
    expect(labels[0].side).toBe(1);
    expect(labels[1].side).toBe(-1);
  });
});
