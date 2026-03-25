import type { EmptyLeg } from "@/hooks/useAviapages";

export interface MapViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const WORLD_VIEWBOX: MapViewBox = { x: 0, y: 0, w: 100, h: 45 };

const MIN_WIDTH = 22;
const MIN_HEIGHT = 12;
const MAP_WIDTH = 100;
const MAP_HEIGHT = 45;

export const clampMapViewBox = (viewBox: MapViewBox): MapViewBox => {
  const w = Math.max(MIN_WIDTH, Math.min(MAP_WIDTH, viewBox.w));
  const h = Math.max(MIN_HEIGHT, Math.min(MAP_HEIGHT, viewBox.h));

  return {
    x: Math.max(0, Math.min(MAP_WIDTH - w, viewBox.x)),
    y: Math.max(0, Math.min(MAP_HEIGHT - h, viewBox.y)),
    w,
    h,
  };
};

export const fitMapViewToLegs = (
  legs: EmptyLeg[],
  toMapCoords: (lat: number | null | undefined, lng: number | null | undefined) => [number, number]
): MapViewBox => {
  const points = legs.flatMap((leg) => {
    if (!leg.departure || !leg.arrival) return [];
    return [
      toMapCoords(leg.departure.lat, leg.departure.lng),
      toMapCoords(leg.arrival.lat, leg.arrival.lng),
    ];
  });

  if (points.length < 2) {
    return WORLD_VIEWBOX;
  }

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const paddingX = Math.max(4, (maxX - minX) * 0.22);
  const paddingY = Math.max(3, (maxY - minY) * 0.3);

  return clampMapViewBox({
    x: minX - paddingX,
    y: minY - paddingY,
    w: maxX - minX + paddingX * 2,
    h: maxY - minY + paddingY * 2,
  });
};