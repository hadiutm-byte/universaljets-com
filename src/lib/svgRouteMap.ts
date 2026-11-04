/**
 * Shared geometry helpers for the SDK-free SVG route maps.
 *
 * World space is a 100 × 50 Mercator plane. A view box is fitted to the plotted
 * points and then expanded to the container's aspect ratio so the SVG can use
 * `preserveAspectRatio="xMidYMid meet"` without any stretching.
 */
import { useLayoutEffect, useState, type RefObject } from "react";

export const MAP_W = 100;
export const MAP_H = 50;

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const WORLD_VIEW: ViewBox = { x: 0, y: 0, w: MAP_W, h: MAP_H };

/** Mercator projection into the 100 × 50 world plane. */
export function projectMercator(lat: number | null | undefined, lng: number | null | undefined): [number, number] {
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return [MAP_W / 2, MAP_H / 2];
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const x = ((lng + 180) / 360) * MAP_W;
  const latRad = (clampedLat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = MAP_H / 2 - (mercN / Math.PI) * (MAP_H / 2);
  return [Math.max(0, Math.min(MAP_W, x)), Math.max(0, Math.min(MAP_H, y))];
}

export interface FitOptions {
  /** Container width / height. Defaults to 2 (the world plane ratio). */
  aspect?: number;
  /** Minimum view width in world units — prevents over-zooming on short hops. */
  minWidth?: number;
  /** Fractional padding around the plotted bounds. */
  padding?: number;
}

/**
 * Fit a view box around points, then expand it to the requested aspect ratio
 * so nothing is distorted. The result is clamped back inside the world plane
 * where possible, but may extend beyond it when the aspect ratio demands.
 */
export function fitViewBox(points: [number, number][], opts: FitOptions = {}): ViewBox {
  const aspect = opts.aspect && Number.isFinite(opts.aspect) && opts.aspect > 0 ? opts.aspect : MAP_W / MAP_H;
  const minWidth = opts.minWidth ?? 16;
  const padding = opts.padding ?? 0.22;

  if (points.length === 0) return expandToAspect(WORLD_VIEW, aspect);

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const spanX = Math.max(maxX - minX, 0.01);
  const spanY = Math.max(maxY - minY, 0.01);
  const padX = Math.max(spanX * padding, 2.5);
  const padY = Math.max(spanY * padding, 1.5);

  const base: ViewBox = {
    x: minX - padX,
    y: minY - padY,
    w: Math.max(spanX + padX * 2, minWidth),
    h: Math.max(spanY + padY * 2, minWidth / aspect),
  };
  // Re-centre after enforcing minimums
  base.x = (minX + maxX) / 2 - base.w / 2;
  base.y = (minY + maxY) / 2 - base.h / 2;

  return clampSoft(expandToAspect(base, aspect));
}

function expandToAspect(view: ViewBox, aspect: number): ViewBox {
  const current = view.w / view.h;
  if (Math.abs(current - aspect) < 1e-6) return view;
  if (current > aspect) {
    const h = view.w / aspect;
    return { x: view.x, y: view.y - (h - view.h) / 2, w: view.w, h };
  }
  const w = view.h * aspect;
  return { x: view.x - (w - view.w) / 2, y: view.y, w, h: view.h };
}

/** Shift the view back inside the world plane when it fits; otherwise centre it. */
function clampSoft(view: ViewBox): ViewBox {
  let { x, y } = view;
  const { w, h } = view;
  if (w <= MAP_W) x = Math.max(0, Math.min(MAP_W - w, x));
  else x = (MAP_W - w) / 2;
  if (h <= MAP_H) y = Math.max(0, Math.min(MAP_H - h, y));
  else y = (MAP_H - h) / 2;
  return { x, y, w, h };
}

/** Quadratic great-circle-ish arc between two projected points. */
export function arcPath(from: [number, number], to: [number, number], viewWidth: number): string {
  const cx = (from[0] + to[0]) / 2;
  const dx = Math.abs(to[0] - from[0]);
  const arc = Math.max(viewWidth * 0.02, Math.min(viewWidth * 0.12, dx * 0.18));
  const cy = Math.min(from[1], to[1]) - arc;
  return `M ${from[0]} ${from[1]} Q ${cx} ${cy} ${to[0]} ${to[1]}`;
}

/** Grid lines at fixed world coordinates (so they read as lat/long, not a stretched mesh). */
export function gridLines(view: ViewBox): { vertical: number[]; horizontal: number[] } {
  const step = view.w > 60 ? 10 : view.w > 30 ? 5 : view.w > 12 ? 2.5 : 1;
  const vertical: number[] = [];
  const horizontal: number[] = [];
  for (let x = Math.floor(view.x / step) * step; x <= view.x + view.w; x += step) vertical.push(x);
  for (let y = Math.floor(view.y / step) * step; y <= view.y + view.h; y += step) horizontal.push(y);
  return { vertical, horizontal };
}

export interface LabelledPoint {
  code: string;
  point: [number, number];
  /** +1 draws the label above the point, -1 below. */
  side: 1 | -1;
}

/**
 * De-duplicate airport labels and alternate placement for neighbours that would
 * otherwise collide, so dense clusters (e.g. London/Paris/Nice) stay legible.
 */
export function layoutLabels(
  entries: { code: string; point: [number, number] }[],
  view: ViewBox,
  pxPerUnit: number,
): LabelledPoint[] {
  const seen = new Map<string, [number, number]>();
  for (const e of entries) {
    if (e.code && !seen.has(e.code)) seen.set(e.code, e.point);
  }
  const unique = [...seen.entries()]
    .map(([code, point]) => ({ code, point }))
    .sort((a, b) => a.point[0] - b.point[0] || a.point[1] - b.point[1]);

  const labelWidthUnits = (48 / pxPerUnit) || view.w * 0.06;
  const labelHeightUnits = (16 / pxPerUnit) || view.h * 0.06;
  const placed: LabelledPoint[] = [];

  for (const entry of unique) {
    let side: 1 | -1 = 1;
    const collidesAbove = placed.some(
      (p) =>
        p.side === 1 &&
        Math.abs(p.point[0] - entry.point[0]) < labelWidthUnits &&
        Math.abs(p.point[1] - entry.point[1]) < labelHeightUnits * 1.6,
    );
    if (collidesAbove) side = -1;
    placed.push({ ...entry, side });
  }
  return placed;
}

/** Observe an element's size so SVG sizing can stay pixel-stable. */
export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize((prev) =>
        Math.abs(prev.width - rect.width) < 0.5 && Math.abs(prev.height - rect.height) < 0.5
          ? prev
          : { width: rect.width, height: rect.height },
      );
    };
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}
