/**
 * Generates a premium branded Empty Leg share card image using HTML Canvas.
 * Dark blurred map background, gold route arc, dominant pricing, urgency CTA.
 * Returns a Blob for Web Share API or download.
 */

import AIRPORT_COORDS from "@/lib/airportCoords";

function getAirportCoords(icao: string): [number, number] | undefined {
  return AIRPORT_COORDS[icao];
}

interface ShareCardData {
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  date: string;
  price: string;
  aircraftType: string;
  category: string;
}

const W = 1080;
const H = 1920;

/* ── Mercator projection helpers ── */
function lonToX(lon: number): number {
  return ((lon + 180) / 360) * W;
}
function latToY(lat: number): number {
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  return H / 2 - (mercN * W) / (2 * Math.PI);
}

function projectCoords(
  coords: [number, number][],
  padding: number
): { points: [number, number][]; scale: number; offsetX: number; offsetY: number } {
  const raw = coords.map(([lat, lon]) => [lonToX(lon), latToY(lat)] as [number, number]);
  const xs = raw.map(p => p[0]);
  const ys = raw.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeX = maxX - minX || 200;
  const rangeY = maxY - minY || 200;
  const targetW = W - padding * 2;
  const targetH = 400;
  const scale = Math.min(targetW / rangeX, targetH / rangeY) * 0.7;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const offsetX = W / 2 - cx * scale;
  const offsetY = H * 0.38 - cy * scale;
  const points = raw.map(([x, y]) => [x * scale + offsetX, y * scale + offsetY] as [number, number]);
  return { points, scale, offsetX, offsetY };
}

/* ── Draw dark abstract map grid ── */
function drawMapBackground(ctx: CanvasRenderingContext2D) {
  // Deep dark base
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#050508");
  bg.addColorStop(0.35, "#08080d");
  bg.addColorStop(0.65, "#060609");
  bg.addColorStop(1, "#040406");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid lines (map feel)
  ctx.strokeStyle = "rgba(255,255,255,0.018)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Atmospheric radial glow (warm gold center)
  const centerGlow = ctx.createRadialGradient(W / 2, H * 0.38, 0, W / 2, H * 0.38, 550);
  centerGlow.addColorStop(0, "rgba(168, 133, 15, 0.06)");
  centerGlow.addColorStop(0.5, "rgba(168, 133, 15, 0.02)");
  centerGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, W, H);
}

/* ── Gold route arc between two points ── */
function drawRouteArc(
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  to: [number, number]
) {
  const midX = (from[0] + to[0]) / 2;
  const midY = Math.min(from[1], to[1]) - 60;

  // Outer glow
  ctx.strokeStyle = "rgba(168, 133, 15, 0.15)";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.quadraticCurveTo(midX, midY, to[0], to[1]);
  ctx.stroke();

  // Mid glow
  ctx.strokeStyle = "rgba(168, 133, 15, 0.3)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.quadraticCurveTo(midX, midY, to[0], to[1]);
  ctx.stroke();

  // Core line
  const lineGrad = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
  lineGrad.addColorStop(0, "rgba(168, 133, 15, 0.9)");
  lineGrad.addColorStop(0.5, "rgba(212, 175, 55, 1)");
  lineGrad.addColorStop(1, "rgba(168, 133, 15, 0.9)");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.quadraticCurveTo(midX, midY, to[0], to[1]);
  ctx.stroke();

  // Endpoint markers
  [from, to].forEach(([x, y]) => {
    // Outer ring glow
    ctx.fillStyle = "rgba(168, 133, 15, 0.12)";
    ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill();
    // Ring
    ctx.strokeStyle = "rgba(168, 133, 15, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.stroke();
    // Dot
    ctx.fillStyle = "rgba(212, 175, 55, 1)";
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });
}

/* ── Vignette overlay ── */
function drawVignette(ctx: CanvasRenderingContext2D) {
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export async function generateEmptyLegShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── 1. Dark map background ──
  drawMapBackground(ctx);

  // ── 2. Route arc (if we have coords) ──
  const fromCoords = getAirportCoords(data.fromCode);
  const toCoords = getAirportCoords(data.toCode);
  let routeFrom: [number, number] = [W * 0.25, H * 0.38];
  let routeTo: [number, number] = [W * 0.75, H * 0.38];

  if (fromCoords && toCoords) {
    const { points } = projectCoords([fromCoords, toCoords], 160);
    routeFrom = points[0];
    routeTo = points[1];
  }
  drawRouteArc(ctx, routeFrom, routeTo);

  // ── 3. Vignette ──
  drawVignette(ctx);

  // ── 4. Top brand bar ──
  const topLineGrad = ctx.createLinearGradient(140, 0, W - 140, 0);
  topLineGrad.addColorStop(0, "rgba(168,133,15,0)");
  topLineGrad.addColorStop(0.5, "rgba(168,133,15,0.35)");
  topLineGrad.addColorStop(1, "rgba(168,133,15,0)");
  ctx.strokeStyle = topLineGrad;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(140, 160); ctx.lineTo(W - 140, 160); ctx.stroke();

  ctx.fillStyle = "rgba(168, 133, 15, 0.6)";
  ctx.font = "500 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("UNIVERSAL JETS", W / 2, 130);

  // ── 5. "EMPTY LEG" badge ──
  ctx.fillStyle = "rgba(168, 133, 15, 0.1)";
  roundRect(ctx, W / 2 - 120, 195, 240, 42, 21);
  ctx.fill();
  ctx.strokeStyle = "rgba(168, 133, 15, 0.25)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 120, 195, 240, 42, 21);
  ctx.stroke();
  ctx.fillStyle = "rgba(168, 133, 15, 0.85)";
  ctx.font = "600 14px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("✈  EMPTY LEG OPPORTUNITY", W / 2, 222);

  // ── 6. ROUTE — visual centerpiece ──
  const routeY = 580;

  // FROM code
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "800 110px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(data.fromCode, 100, routeY);

  // FROM city
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "300 24px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCity, 104, routeY + 40);

  // Arrow line
  const arrowY = routeY - 30;
  const arrowLineGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
  arrowLineGrad.addColorStop(0, "rgba(168,133,15,0.1)");
  arrowLineGrad.addColorStop(0.5, "rgba(168,133,15,0.6)");
  arrowLineGrad.addColorStop(1, "rgba(168,133,15,0.1)");
  ctx.strokeStyle = arrowLineGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(100, arrowY + 90); ctx.lineTo(W - 100, arrowY + 90); ctx.stroke();

  // Arrow head
  ctx.fillStyle = "rgba(168, 133, 15, 0.7)";
  ctx.beginPath();
  ctx.moveTo(W - 100, arrowY + 90);
  ctx.lineTo(W - 120, arrowY + 82);
  ctx.lineTo(W - 120, arrowY + 98);
  ctx.closePath();
  ctx.fill();

  // TO code
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "800 110px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(data.toCode, W - 100, routeY + 160);

  // TO city
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "300 24px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCity, W - 104, routeY + 200);

  // ── 7. PRICE — dominant gold section ──
  const priceY = routeY + 310;

  // Price glow behind
  const priceGlow = ctx.createRadialGradient(W / 2, priceY, 0, W / 2, priceY, 250);
  priceGlow.addColorStop(0, "rgba(168, 133, 15, 0.08)");
  priceGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = priceGlow;
  ctx.fillRect(0, priceY - 120, W, 240);

  // "SAVE UP TO 75%" or actual price
  const isPriceNumeric = /\d/.test(data.price);
  ctx.textAlign = "center";

  if (!isPriceNumeric) {
    // Show "SAVE UP TO 75%"
    ctx.fillStyle = "rgba(168, 133, 15, 0.4)";
    ctx.font = "500 18px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("SAVE UP TO", W / 2, priceY - 35);

    ctx.fillStyle = "rgba(212, 175, 55, 1)";
    ctx.font = "900 88px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("75%", W / 2, priceY + 50);

    ctx.fillStyle = "rgba(168, 133, 15, 0.5)";
    ctx.font = "400 20px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("VS. ON-DEMAND CHARTER", W / 2, priceY + 85);
  } else {
    ctx.fillStyle = "rgba(168, 133, 15, 0.4)";
    ctx.font = "500 18px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("FROM", W / 2, priceY - 35);

    ctx.fillStyle = "rgba(212, 175, 55, 1)";
    ctx.font = "900 72px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(data.price, W / 2, priceY + 45);

    ctx.fillStyle = "rgba(168, 133, 15, 0.5)";
    ctx.font = "400 20px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("ALL-INCLUSIVE", W / 2, priceY + 80);
  }

  // ── 8. Aircraft + Date (secondary info) ──
  const infoY = priceY + 155;
  const infoGrad = ctx.createLinearGradient(200, 0, W - 200, 0);
  infoGrad.addColorStop(0, "rgba(255,255,255,0)");
  infoGrad.addColorStop(0.5, "rgba(255,255,255,0.06)");
  infoGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = infoGrad;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(200, infoY - 20); ctx.lineTo(W - 200, infoY - 20); ctx.stroke();

  // Aircraft (smaller, secondary)
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "500 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(data.aircraftType.toUpperCase(), W / 2, infoY + 15);

  // Category
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "300 16px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.category.toUpperCase(), W / 2, infoY + 45);

  // Date — aviation style
  const dateY = infoY + 95;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, W / 2 - 150, dateY - 25, 300, 55, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  roundRect(ctx, W / 2 - 150, dateY - 25, 300, 55, 12);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "400 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("DEPARTURE", W / 2, dateY - 5);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "600 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.date.toUpperCase(), W / 2, dateY + 22);

  // ── 9. CTA ──
  const ctaY = dateY + 100;
  // CTA glow
  const ctaGlow = ctx.createRadialGradient(W / 2, ctaY + 35, 0, W / 2, ctaY + 35, 280);
  ctaGlow.addColorStop(0, "rgba(168, 133, 15, 0.12)");
  ctaGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = ctaGlow;
  ctx.fillRect(W / 2 - 300, ctaY - 10, 600, 100);

  ctx.fillStyle = "rgba(168, 133, 15, 0.9)";
  roundRect(ctx, W / 2 - 220, ctaY, 440, 65, 32);
  ctx.fill();
  ctx.fillStyle = "#050508";
  ctx.font = "700 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("REQUEST THIS JET  →", W / 2, ctaY + 40);

  // Urgency line
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "400 14px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Limited availability — book before it's gone", W / 2, ctaY + 95);

  // ── 10. Footer ──
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font = "300 15px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("universaljets.com", W / 2, H - 110);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.font = "300 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Private Aviation  •  Since 2006  •  Dubai  •  London", W / 2, H - 80);

  // Bottom gold line
  const bGrad = ctx.createLinearGradient(140, 0, W - 140, 0);
  bGrad.addColorStop(0, "rgba(168,133,15,0)");
  bGrad.addColorStop(0.5, "rgba(168,133,15,0.25)");
  bGrad.addColorStop(1, "rgba(168,133,15,0)");
  ctx.strokeStyle = bGrad;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(140, H - 50); ctx.lineTo(W - 140, H - 50); ctx.stroke();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
      1
    );
  });
}
