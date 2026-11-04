import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import QuoteRouteMap from "@/components/QuoteRouteMap";
import type { Airport } from "@/hooks/useAviapages";

const dxb: Airport = { id: 1, name: "Dubai Intl", icao: "OMDB", iata: "DXB", city: "Dubai", country: "UAE", lat: 25.25, lng: 55.36 } as Airport;
const lhr: Airport = { id: 2, name: "Heathrow", icao: "EGLL", iata: "LHR", city: "London", country: "UK", lat: 51.47, lng: -0.46 } as Airport;
const cdg: Airport = { id: 3, name: "Le Bourget", icao: "LFPB", iata: "LBG", city: "Paris", country: "FR", lat: 48.97, lng: 2.44 } as Airport;

describe("QuoteRouteMap (SDK-free SVG)", () => {
  it("renders both endpoints, a route arc and distance/time summary", () => {
    const { container, getByText } = render(<QuoteRouteMap from={dxb} to={lhr} />);
    const svg = container.querySelector('svg[preserveAspectRatio="xMidYMid meet"]');
    expect(svg).not.toBeNull();
    const texts = [...svg!.querySelectorAll("text")].map((t) => t.textContent);
    expect(texts).toEqual(expect.arrayContaining(["OMDB", "EGLL"]));
    expect(svg!.querySelectorAll('path[d^="M "]').length).toBeGreaterThanOrEqual(2);
    expect(getByText(/nm/)).toBeInTheDocument();
    expect(getByText(/~\d+h/)).toBeInTheDocument();
    expect(container.querySelector(".mapboxgl-canvas")).toBeNull();
  });

  it("collapses when no route is available", () => {
    const { container } = render(<QuoteRouteMap from={dxb} to={null} />);
    expect(container.querySelectorAll("text").length).toBe(0);
  });

  it("supports multi-leg itineraries and dedupes shared airports", () => {
    const { container, getByText } = render(
      <QuoteRouteMap from={dxb} to={lhr} additionalLegs={[{ from: lhr, to: cdg }]} />,
    );
    const texts = [...container.querySelectorAll("svg text")].map((t) => t.textContent);
    expect(texts.filter((t) => t === "EGLL")).toHaveLength(1);
    expect(texts).toEqual(expect.arrayContaining(["OMDB", "EGLL", "LFPB"]));
    expect(getByText(/2 legs/)).toBeInTheDocument();
  });
});
