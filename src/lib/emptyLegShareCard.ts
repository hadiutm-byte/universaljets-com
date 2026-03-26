/**
 * Premium Empty Leg share card — luxury aviation invitation.
 * Real Mapbox dark map, projected gold route arc, cinematic composition.
 * Final polish: tighter spacing, stronger price hierarchy, refined CTA,
 * more visible map, elegant route flow.
 */

import AIRPORT_COORDS from "@/lib/airportCoords";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaGFkaWFiZHVsaGFkaSIsImEiOiJjbW43MDV3NDQwYWZvMnhzYmF6cG05a3ZsIn0.fKSSW2NTnStIWXZyXDk_KA";

function getAirportCoords(icao: string): [number, number] | undefined {
  return AIRPORT_COORDS[icao];
}

export interface ShareCardData {
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
const PAD = 44;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

// Mapbox static max is 1280x1280. Request 540x960 @2x = 1080x1920.
const MAP_W = 540;
const MAP_H = 960;

function buildMapUrl(from: [number, number] | undefined, to: [number, number] | undefined): string {
  let centerLat = 30, centerLon = 25, zoom = 2;
  if (from && to) {
    centerLat = (from[0] + to[0]) / 2;
    centerLon = (from[1] + to[1]) / 2;
    const dist = Math.sqrt((from[0] - to[0]) ** 2 + (from[1] - to[1]) ** 2);
    zoom = dist > 60 ? 1.5 : dist > 30 ? 2.5 : dist > 15 ? 3.5 : dist > 5 ? 4.5 : 5.5;
  }
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${centerLon.toFixed(4)},${centerLat.toFixed(4)},${zoom},0/${MAP_W}x${MAP_H}@2x?access_token=${MAPBOX_TOKEN}&attribution=false&logo=false`;
}

function projectToCanvas(
  fromCoord: [number, number],
  toCoord: [number, number]
): { from: [number, number]; to: [number, number] } {
  const centerLat = (fromCoord[0] + toCoord[0]) / 2;
  const centerLon = (fromCoord[1] + toCoord[1]) / 2;
  const dist = Math.sqrt((fromCoord[0] - toCoord[0]) ** 2 + (fromCoord[1] - toCoord[1]) ** 2);
  const zoom = dist > 60 ? 1.5 : dist > 30 ? 2.5 : dist > 15 ? 3.5 : dist > 5 ? 4.5 : 5.5;
  const scale = (256 * Math.pow(2, zoom)) / 360;
  const toX = (lon: number) => W / 2 + (lon - centerLon) * scale * 2;
  const toY = (lat: number) => {
    const cM = Math.log(Math.tan(Math.PI / 4 + (centerLat * Math.PI) / 360));
    const lM = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
    return H / 2 - (lM - cM) * scale * (180 / Math.PI) * 2;
  };
  return { from: [toX(fromCoord[1]), toY(fromCoord[0])], to: [toX(toCoord[1]), toY(toCoord[0])] };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}

/* ── Route arc — more elegant, journey-like ── */
function drawRouteArc(ctx: CanvasRenderingContext2D, from: [number, number], to: [number, number]) {
  const midX = (from[0] + to[0]) / 2;
  const dist = Math.sqrt((to[0] - from[0]) ** 2 + (to[1] - from[1]) ** 2);
  const arcHeight = Math.max(50, Math.min(dist * 0.4, 180));
  const midY = Math.min(from[1], to[1]) - arcHeight;

  // Wide atmospheric glow (more visible)
  ctx.save();
  ctx.shadowColor = "rgba(168, 133, 15, 0.6)";
  ctx.shadowBlur = 60;
  ctx.strokeStyle = "rgba(168, 133, 15, 0.06)";
  ctx.lineWidth = 50;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();
  ctx.restore();

  // Second glow layer
  ctx.save();
  ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
  ctx.shadowBlur = 30;
  ctx.strokeStyle = "rgba(168, 133, 15, 0.15)";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();
  ctx.restore();

  // Core line with gradient
  const lg = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
  lg.addColorStop(0, "rgba(168, 133, 15, 0.6)");
  lg.addColorStop(0.3, "rgba(212, 175, 55, 1)");
  lg.addColorStop(0.7, "rgba(230, 195, 75, 1)");
  lg.addColorStop(1, "rgba(168, 133, 15, 0.6)");
  ctx.strokeStyle = lg;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();

  // Animated-look dashes
  ctx.setLineDash([6, 18]);
  ctx.strokeStyle = "rgba(255, 235, 160, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();
  ctx.setLineDash([]);

  // Endpoint markers — refined concentric rings
  [from, to].forEach(([x, y]) => {
    const h1 = ctx.createRadialGradient(x, y, 0, x, y, 35);
    h1.addColorStop(0, "rgba(168, 133, 15, 0.18)");
    h1.addColorStop(1, "rgba(168, 133, 15, 0)");
    ctx.fillStyle = h1;
    ctx.beginPath(); ctx.arc(x, y, 35, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = "rgba(168, 133, 15, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.stroke();

    ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = "rgba(230, 195, 75, 1)";
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
  });
}

/* ── Vignette — lighter center for map visibility ── */
function drawVignette(ctx: CanvasRenderingContext2D) {
  // Softer central vignette — lets map show through more
  const vig = ctx.createRadialGradient(W / 2, H * 0.38, H * 0.2, W / 2, H * 0.38, H * 0.72);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(0.55, "rgba(0,0,0,0.2)");
  vig.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Top fade for brand
  const top = ctx.createLinearGradient(0, 0, 0, 280);
  top.addColorStop(0, "rgba(0,0,0,0.45)");
  top.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, 280);

  // Bottom fade for CTA — tighter
  const bot = ctx.createLinearGradient(0, H - 550, 0, H);
  bot.addColorStop(0, "rgba(0,0,0,0)");
  bot.addColorStop(0.4, "rgba(0,0,0,0.45)");
  bot.addColorStop(1, "rgba(0,0,0,0.65)");
  ctx.fillStyle = bot;
  ctx.fillRect(0, H - 550, W, 550);
}

/* ── Frame — refined ── */
function drawFrame(ctx: CanvasRenderingContext2D) {
  const fg = ctx.createLinearGradient(0, 0, W, H);
  fg.addColorStop(0, "rgba(168,133,15,0.15)");
  fg.addColorStop(0.3, "rgba(212,175,55,0.3)");
  fg.addColorStop(0.5, "rgba(168,133,15,0.1)");
  fg.addColorStop(0.7, "rgba(212,175,55,0.3)");
  fg.addColorStop(1, "rgba(168,133,15,0.15)");
  ctx.strokeStyle = fg;
  ctx.lineWidth = 1;
  roundRect(ctx, PAD, PAD, W - PAD * 2, H - PAD * 2, 20);
  ctx.stroke();

  // Corner accents
  const cLen = 28;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  const c = PAD + 16;
  const ce = W - PAD - 16;
  const cb = H - PAD - 16;
  ctx.beginPath(); ctx.moveTo(c, c + cLen); ctx.lineTo(c, c); ctx.lineTo(c + cLen, c); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ce - cLen, c); ctx.lineTo(ce, c); ctx.lineTo(ce, c + cLen); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(c, cb - cLen); ctx.lineTo(c, cb); ctx.lineTo(c + cLen, cb); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ce - cLen, cb); ctx.lineTo(ce, cb); ctx.lineTo(ce, cb - cLen); ctx.stroke();
}

/* ── Procedural fallback ── */
function drawProceduralMap(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a0c14");
  bg.addColorStop(0.5, "#0d0f18");
  bg.addColorStop(1, "#080a12");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#6b7280";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 55) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 55) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.globalAlpha = 1;
  const glow = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, 600);
  glow.addColorStop(0, "rgba(168, 133, 15, 0.05)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}

/* ═══════════════ MAIN ═══════════════ */
export async function generateEmptyLegShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const fromCoords = getAirportCoords(data.fromCode);
  const toCoords = getAirportCoords(data.toCode);

  // ── 1. Map background ──
  let mapLoaded = false;
  try {
    const mapImg = await loadImage(buildMapUrl(fromCoords, toCoords));
    ctx.drawImage(mapImg, 0, 0, W, H);
    // Slightly brighten the map so it's more visible
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(0, 0, W, H);
    mapLoaded = true;
  } catch { /* fallback */ }
  if (!mapLoaded) drawProceduralMap(ctx);

  // ── 2. Route arc ──
  let arcFrom: [number, number] = [W * 0.22, H * 0.4];
  let arcTo: [number, number] = [W * 0.78, H * 0.4];
  if (fromCoords && toCoords) {
    const p = projectToCanvas(fromCoords, toCoords);
    arcFrom = p.from;
    arcTo = p.to;
  }
  drawRouteArc(ctx, arcFrom, arcTo);

  // ── 3. Vignette ──
  drawVignette(ctx);

  // ── 4. Frame ──
  drawFrame(ctx);

  // ═══════════════════════════════════════
  //  CONTENT — tighter vertical rhythm
  // ═══════════════════════════════════════

  // ── Brand header ──
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(168, 133, 15, 0.5)";
  ctx.font = "400 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("U N I V E R S A L   J E T S", W / 2, 108);

  // Hairline
  const hl = ctx.createLinearGradient(PAD + 100, 0, W - PAD - 100, 0);
  hl.addColorStop(0, "rgba(168,133,15,0)");
  hl.addColorStop(0.5, "rgba(168,133,15,0.25)");
  hl.addColorStop(1, "rgba(168,133,15,0)");
  ctx.strokeStyle = hl;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 100, 134); ctx.lineTo(W - PAD - 100, 134); ctx.stroke();

  // ── Badge ──
  ctx.fillStyle = "rgba(168, 133, 15, 0.07)";
  roundRect(ctx, W / 2 - 140, 160, 280, 40, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(168, 133, 15, 0.18)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 140, 160, 280, 40, 20);
  ctx.stroke();
  ctx.fillStyle = "rgba(212, 175, 55, 0.8)";
  ctx.font = "600 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("✈   EMPTY LEG OPPORTUNITY", W / 2, 185);

  // ══════════════════════════════════════
  //  PRICE — FIRST FOCAL POINT (moved up)
  // ══════════════════════════════════════
  const priceY = 340;
  ctx.textAlign = "center";

  // Large radial glow behind price
  const pg = ctx.createRadialGradient(W / 2, priceY + 30, 0, W / 2, priceY + 30, 400);
  pg.addColorStop(0, "rgba(168, 133, 15, 0.14)");
  pg.addColorStop(0.4, "rgba(168, 133, 15, 0.05)");
  pg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = pg;
  ctx.fillRect(0, priceY - 100, W, 350);

  const isPriceNumeric = /\d/.test(data.price);

  if (!isPriceNumeric) {
    // "SAVE UP TO" — elegant small label
    ctx.fillStyle = "rgba(168, 133, 15, 0.5)";
    ctx.font = "500 22px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("S A V E   U P   T O", W / 2, priceY - 30);

    // "75%" — massive, glowing, unmissable
    ctx.save();
    ctx.shadowColor = "rgba(212, 175, 55, 0.7)";
    ctx.shadowBlur = 70;
    const pGrad = ctx.createLinearGradient(W / 2 - 200, priceY, W / 2 + 200, priceY + 100);
    pGrad.addColorStop(0, "rgba(212, 175, 55, 1)");
    pGrad.addColorStop(0.5, "rgba(240, 210, 100, 1)");
    pGrad.addColorStop(1, "rgba(212, 175, 55, 1)");
    ctx.fillStyle = pGrad;
    ctx.font = "900 160px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("75%", W / 2, priceY + 110);
    // Double-render for stronger glow
    ctx.shadowBlur = 120;
    ctx.shadowColor = "rgba(168, 133, 15, 0.35)";
    ctx.globalAlpha = 0.5;
    ctx.fillText("75%", W / 2, priceY + 110);
    ctx.globalAlpha = 1;
    ctx.restore();

    // Subtitle
    ctx.fillStyle = "rgba(168, 133, 15, 0.35)";
    ctx.font = "300 16px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("VS.  ON-DEMAND  CHARTER", W / 2, priceY + 150);
  } else {
    ctx.fillStyle = "rgba(168, 133, 15, 0.5)";
    ctx.font = "500 18px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("F R O M", W / 2, priceY - 25);

    ctx.save();
    ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
    ctx.shadowBlur = 60;
    const pGrad = ctx.createLinearGradient(W / 2 - 200, priceY, W / 2 + 200, priceY + 80);
    pGrad.addColorStop(0, "rgba(212, 175, 55, 1)");
    pGrad.addColorStop(0.5, "rgba(240, 210, 100, 1)");
    pGrad.addColorStop(1, "rgba(212, 175, 55, 1)");
    ctx.fillStyle = pGrad;
    ctx.font = "900 110px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(data.price, W / 2, priceY + 80);
    ctx.restore();

    ctx.fillStyle = "rgba(168, 133, 15, 0.35)";
    ctx.font = "300 16px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("ALL-INCLUSIVE  •  ONE WAY", W / 2, priceY + 120);
  }

  // ══════════════════════════════════════
  //  ROUTE — journey flow, not divider
  // ══════════════════════════════════════
  const routeY = isPriceNumeric ? priceY + 210 : priceY + 240;

  // FROM code
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "800 96px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCode, PAD + 56, routeY);

  // FROM city
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.font = "300 20px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCity, PAD + 60, routeY + 32);

  // Journey flow line — curved, not straight
  const flowY = routeY + 65;
  ctx.save();
  const flowGrad = ctx.createLinearGradient(PAD + 56, 0, W - PAD - 56, 0);
  flowGrad.addColorStop(0, "rgba(168,133,15,0)");
  flowGrad.addColorStop(0.15, "rgba(168,133,15,0.4)");
  flowGrad.addColorStop(0.85, "rgba(168,133,15,0.4)");
  flowGrad.addColorStop(1, "rgba(168,133,15,0)");
  ctx.strokeStyle = flowGrad;
  ctx.lineWidth = 1;
  // Gentle curve instead of straight line
  ctx.beginPath();
  ctx.moveTo(PAD + 56, flowY);
  ctx.quadraticCurveTo(W / 2, flowY - 12, W - PAD - 56, flowY);
  ctx.stroke();

  // Small dots along the curve for flight path feel
  for (let t = 0.2; t <= 0.8; t += 0.15) {
    const px = PAD + 56 + (W - PAD * 2 - 112) * t;
    const py = flowY - 12 * Math.sin(t * Math.PI);
    ctx.fillStyle = `rgba(212, 175, 55, ${0.15 + t * 0.2})`;
    ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
  }

  // Arrowhead — smaller, refined
  const arrowX = W - PAD - 56;
  ctx.fillStyle = "rgba(212, 175, 55, 0.55)";
  ctx.beginPath();
  ctx.moveTo(arrowX, flowY);
  ctx.lineTo(arrowX - 14, flowY - 5);
  ctx.lineTo(arrowX - 14, flowY + 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // TO code
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "800 96px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCode, W - PAD - 56, routeY + 150);

  // TO city
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.font = "300 20px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCity, W - PAD - 60, routeY + 182);

  // ══════════════════════════════════════
  //  AIRCRAFT + DATE — glass card
  // ══════════════════════════════════════
  const glassY = routeY + 230;
  const glassW = W - PAD * 2 - 80;
  const glassH = 120;
  const glassX = (W - glassW) / 2;

  ctx.fillStyle = "rgba(255,255,255,0.025)";
  roundRect(ctx, glassX, glassY, glassW, glassH, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  roundRect(ctx, glassX, glassY, glassW, glassH, 14);
  ctx.stroke();

  // Aircraft — left
  const lx = glassX + glassW * 0.33;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "400 10px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("AIRCRAFT", lx, glassY + 36);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "600 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.aircraftType, lx, glassY + 62);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "300 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.category.toUpperCase(), lx, glassY + 84);

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.beginPath(); ctx.moveTo(glassX + glassW * 0.66, glassY + 22); ctx.lineTo(glassX + glassW * 0.66, glassY + glassH - 22); ctx.stroke();

  // Date — right
  const rx = glassX + glassW * 0.83;
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "400 10px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("DEPARTURE", rx, glassY + 36);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "600 20px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(formatAviationDate(data.date), rx, glassY + 64);
  ctx.fillStyle = "rgba(168,133,15,0.3)";
  ctx.font = "400 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("LOCAL TIME", rx, glassY + 84);

  // ══════════════════════════════════════
  //  CTA — refined, less heavy
  // ══════════════════════════════════════
  const ctaY = glassY + glassH + 50;

  // Soft ambient glow
  const cg = ctx.createRadialGradient(W / 2, ctaY + 28, 0, W / 2, ctaY + 28, 250);
  cg.addColorStop(0, "rgba(168, 133, 15, 0.1)");
  cg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = cg;
  ctx.fillRect(0, ctaY - 20, W, 120);

  // Button — thinner, more refined pill
  const bW = 440;
  const bH = 56;
  const bX = (W - bW) / 2;
  const bg = ctx.createLinearGradient(bX, ctaY, bX + bW, ctaY);
  bg.addColorStop(0, "rgba(168, 133, 15, 0.75)");
  bg.addColorStop(0.5, "rgba(200, 165, 45, 0.9)");
  bg.addColorStop(1, "rgba(168, 133, 15, 0.75)");
  ctx.fillStyle = bg;
  roundRect(ctx, bX, ctaY, bW, bH, 28);
  ctx.fill();

  // Inner top highlight for depth
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  const ih = ctx.createLinearGradient(bX, ctaY, bX, ctaY + bH);
  ih.addColorStop(0, "rgba(255,255,255,0.2)");
  ih.addColorStop(0.5, "rgba(255,255,255,0)");
  roundRect(ctx, bX, ctaY, bW, bH, 28);
  ctx.fillStyle = ih;
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#0a0a0f";
  ctx.font = "700 15px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("REQUEST THIS JET  →", W / 2, ctaY + 35);

  // Urgency
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "300 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Limited availability  ·  First confirmed client secures the aircraft", W / 2, ctaY + bH + 32);

  // ══════════════════════════════════════
  //  FOOTER — tighter
  // ══════════════════════════════════════
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font = "400 15px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("universaljets.com", W / 2, H - 100);

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.font = "300 10px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Private Aviation  ·  Since 2006  ·  Dubai  ·  London", W / 2, H - 78);

  // Bottom hairline
  const bl = ctx.createLinearGradient(PAD + 100, 0, W - PAD - 100, 0);
  bl.addColorStop(0, "rgba(168,133,15,0)");
  bl.addColorStop(0.5, "rgba(168,133,15,0.15)");
  bl.addColorStop(1, "rgba(168,133,15,0)");
  ctx.strokeStyle = bl;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 100, H - PAD - 16); ctx.lineTo(W - PAD - 100, H - PAD - 16); ctx.stroke();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png", 1
    );
  });
}

function formatAviationDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch { /* fallback */ }
  return dateStr.toUpperCase();
}
