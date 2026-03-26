/**
 * Premium Empty Leg share card — luxury aviation invitation.
 * Real Mapbox dark map background, gold route arc, dominant pricing,
 * cinematic composition, premium gold border frame.
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
const PAD = 48; // frame inset

/* ── Load image from URL ── */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

/* ── Build Mapbox static map URL ── */
function buildMapUrl(from: [number, number] | undefined, to: [number, number] | undefined): string {
  let centerLat = 30, centerLon = 25, zoom = 2;
  if (from && to) {
    centerLat = (from[0] + to[0]) / 2;
    centerLon = (from[1] + to[1]) / 2;
    const dist = Math.sqrt((from[0] - to[0]) ** 2 + (from[1] - to[1]) ** 2);
    zoom = dist > 60 ? 1.5 : dist > 30 ? 2.5 : dist > 15 ? 3.5 : dist > 5 ? 4.5 : 5.5;
  }
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${centerLon.toFixed(4)},${centerLat.toFixed(4)},${zoom},0/${W}x${H}@2x?access_token=${MAPBOX_TOKEN}&attribution=false&logo=false`;
}

/* ── Mercator projection for route overlay ── */
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
    const centerMerc = Math.log(Math.tan(Math.PI / 4 + (centerLat * Math.PI) / 360));
    const latMerc = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
    return H / 2 - (latMerc - centerMerc) * scale * (180 / Math.PI) * 2;
  };

  return {
    from: [toX(fromCoord[1]), toY(fromCoord[0])],
    to: [toX(toCoord[1]), toY(toCoord[0])],
  };
}

/* ── Rounded rect helper ── */
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

/* ── Draw gold route arc ── */
function drawRouteArc(ctx: CanvasRenderingContext2D, from: [number, number], to: [number, number]) {
  const midX = (from[0] + to[0]) / 2;
  const dist = Math.sqrt((to[0] - from[0]) ** 2 + (to[1] - from[1]) ** 2);
  const arcHeight = Math.max(40, Math.min(dist * 0.35, 150));
  const midY = Math.min(from[1], to[1]) - arcHeight;

  // Wide outer glow
  ctx.save();
  ctx.shadowColor = "rgba(168, 133, 15, 0.5)";
  ctx.shadowBlur = 40;
  ctx.strokeStyle = "rgba(168, 133, 15, 0.08)";
  ctx.lineWidth = 30;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.quadraticCurveTo(midX, midY, to[0], to[1]);
  ctx.stroke();
  ctx.restore();

  // Mid glow
  ctx.strokeStyle = "rgba(168, 133, 15, 0.25)";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.quadraticCurveTo(midX, midY, to[0], to[1]);
  ctx.stroke();

  // Core bright line
  const lineGrad = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
  lineGrad.addColorStop(0, "rgba(212, 175, 55, 0.9)");
  lineGrad.addColorStop(0.5, "rgba(230, 195, 75, 1)");
  lineGrad.addColorStop(1, "rgba(212, 175, 55, 0.9)");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.quadraticCurveTo(midX, midY, to[0], to[1]);
  ctx.stroke();

  // Dashed overlay for aviation feel
  ctx.setLineDash([12, 16]);
  ctx.strokeStyle = "rgba(255, 230, 140, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.quadraticCurveTo(midX, midY, to[0], to[1]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Endpoint markers
  [from, to].forEach(([x, y]) => {
    // Glow halo
    const halo = ctx.createRadialGradient(x, y, 0, x, y, 28);
    halo.addColorStop(0, "rgba(168, 133, 15, 0.2)");
    halo.addColorStop(1, "rgba(168, 133, 15, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill();
    // Outer ring
    ctx.strokeStyle = "rgba(168, 133, 15, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
    // Inner dot
    ctx.fillStyle = "rgba(230, 195, 75, 1)";
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
  });
}

/* ── Premium gold border frame ── */
function drawFrame(ctx: CanvasRenderingContext2D) {
  // Outer gold border
  const frameGrad = ctx.createLinearGradient(0, 0, W, H);
  frameGrad.addColorStop(0, "rgba(168, 133, 15, 0.2)");
  frameGrad.addColorStop(0.3, "rgba(212, 175, 55, 0.35)");
  frameGrad.addColorStop(0.5, "rgba(168, 133, 15, 0.15)");
  frameGrad.addColorStop(0.7, "rgba(212, 175, 55, 0.35)");
  frameGrad.addColorStop(1, "rgba(168, 133, 15, 0.2)");
  ctx.strokeStyle = frameGrad;
  ctx.lineWidth = 1.5;
  roundRect(ctx, PAD, PAD, W - PAD * 2, H - PAD * 2, 24);
  ctx.stroke();

  // Inner fine frame
  ctx.strokeStyle = "rgba(168, 133, 15, 0.06)";
  ctx.lineWidth = 1;
  roundRect(ctx, PAD + 8, PAD + 8, W - PAD * 2 - 16, H - PAD * 2 - 16, 20);
  ctx.stroke();

  // Corner accents — small L-shapes
  const corners = [
    [PAD + 20, PAD + 20],
    [W - PAD - 20, PAD + 20],
    [PAD + 20, H - PAD - 20],
    [W - PAD - 20, H - PAD - 20],
  ];
  const cLen = 30;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  // TL
  ctx.beginPath(); ctx.moveTo(corners[0][0], corners[0][1] + cLen); ctx.lineTo(corners[0][0], corners[0][1]); ctx.lineTo(corners[0][0] + cLen, corners[0][1]); ctx.stroke();
  // TR
  ctx.beginPath(); ctx.moveTo(corners[1][0] - cLen, corners[1][1]); ctx.lineTo(corners[1][0], corners[1][1]); ctx.lineTo(corners[1][0], corners[1][1] + cLen); ctx.stroke();
  // BL
  ctx.beginPath(); ctx.moveTo(corners[2][0], corners[2][1] - cLen); ctx.lineTo(corners[2][0], corners[2][1]); ctx.lineTo(corners[2][0] + cLen, corners[2][1]); ctx.stroke();
  // BR
  ctx.beginPath(); ctx.moveTo(corners[3][0] - cLen, corners[3][1]); ctx.lineTo(corners[3][0], corners[3][1]); ctx.lineTo(corners[3][0], corners[3][1] - cLen); ctx.stroke();
}

/* ── Draw cinematic vignette ── */
function drawVignette(ctx: CanvasRenderingContext2D) {
  // Central vignette
  const vig = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.15, W / 2, H * 0.45, H * 0.75);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(0.6, "rgba(0,0,0,0.3)");
  vig.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Top darkening for brand area
  const topDark = ctx.createLinearGradient(0, 0, 0, 350);
  topDark.addColorStop(0, "rgba(0,0,0,0.5)");
  topDark.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = topDark;
  ctx.fillRect(0, 0, W, 350);

  // Bottom darkening for CTA area
  const botDark = ctx.createLinearGradient(0, H - 650, 0, H);
  botDark.addColorStop(0, "rgba(0,0,0,0)");
  botDark.addColorStop(0.5, "rgba(0,0,0,0.5)");
  botDark.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = botDark;
  ctx.fillRect(0, H - 650, W, 650);
}

/* ── Procedural dark map fallback ── */
function drawProceduralMap(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a0c14");
  bg.addColorStop(0.4, "#0d0f18");
  bg.addColorStop(0.6, "#0b0d16");
  bg.addColorStop(1, "#080a12");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Graticule
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = "#6b7280";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Atmospheric warm glow
  const glow = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, 600);
  glow.addColorStop(0, "rgba(168, 133, 15, 0.04)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}

/* ═══════════════ MAIN GENERATOR ═══════════════ */
export async function generateEmptyLegShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const fromCoords = getAirportCoords(data.fromCode);
  const toCoords = getAirportCoords(data.toCode);

  // ── 1. Real map background ──
  let mapLoaded = false;
  try {
    const mapUrl = buildMapUrl(fromCoords, toCoords);
    const mapImg = await loadImage(mapUrl);
    ctx.drawImage(mapImg, 0, 0, W, H);
    mapLoaded = true;
  } catch {
    // Fallback to procedural
  }
  if (!mapLoaded) drawProceduralMap(ctx);

  // ── 2. Route arc (aligned with map projection) ──
  let arcFrom: [number, number] = [W * 0.22, H * 0.4];
  let arcTo: [number, number] = [W * 0.78, H * 0.4];
  if (fromCoords && toCoords) {
    const projected = projectToCanvas(fromCoords, toCoords);
    arcFrom = projected.from;
    arcTo = projected.to;
  }
  drawRouteArc(ctx, arcFrom, arcTo);

  // ── 3. Vignette + depth ──
  drawVignette(ctx);

  // ── 4. Premium border frame ──
  drawFrame(ctx);

  // ── 5. Brand header ──
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(168, 133, 15, 0.55)";
  ctx.font = "400 20px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("U N I V E R S A L   J E T S", W / 2, 120);

  // Gold hairline
  const topLine = ctx.createLinearGradient(PAD + 80, 0, W - PAD - 80, 0);
  topLine.addColorStop(0, "rgba(168,133,15,0)");
  topLine.addColorStop(0.5, "rgba(168,133,15,0.3)");
  topLine.addColorStop(1, "rgba(168,133,15,0)");
  ctx.strokeStyle = topLine;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 80, 150); ctx.lineTo(W - PAD - 80, 150); ctx.stroke();

  // ── 6. EMPTY LEG badge ──
  ctx.fillStyle = "rgba(168, 133, 15, 0.08)";
  roundRect(ctx, W / 2 - 145, 180, 290, 46, 23);
  ctx.fill();
  ctx.strokeStyle = "rgba(168, 133, 15, 0.2)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 145, 180, 290, 46, 23);
  ctx.stroke();
  ctx.fillStyle = "rgba(212, 175, 55, 0.85)";
  ctx.font = "600 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("✈   EMPTY LEG OPPORTUNITY", W / 2, 209);

  // ══════════════════════════════════════════════
  //  7. ROUTE — VISUAL CENTERPIECE
  // ══════════════════════════════════════════════
  const routeBlockY = 720;

  // FROM code — massive left-aligned
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.97)";
  ctx.font = "800 108px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCode, PAD + 52, routeBlockY);

  // FROM city
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.font = "300 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCity, PAD + 56, routeBlockY + 38);

  // Center arrow line
  const arrowLineY = routeBlockY + 75;
  ctx.save();
  const arrowGrad = ctx.createLinearGradient(PAD + 50, 0, W - PAD - 50, 0);
  arrowGrad.addColorStop(0, "rgba(168,133,15,0.05)");
  arrowGrad.addColorStop(0.3, "rgba(168,133,15,0.5)");
  arrowGrad.addColorStop(0.7, "rgba(168,133,15,0.5)");
  arrowGrad.addColorStop(1, "rgba(168,133,15,0.05)");
  ctx.strokeStyle = arrowGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(PAD + 50, arrowLineY); ctx.lineTo(W - PAD - 50, arrowLineY); ctx.stroke();
  // Arrowhead
  ctx.fillStyle = "rgba(212, 175, 55, 0.7)";
  ctx.beginPath();
  ctx.moveTo(W - PAD - 50, arrowLineY);
  ctx.lineTo(W - PAD - 70, arrowLineY - 8);
  ctx.lineTo(W - PAD - 70, arrowLineY + 8);
  ctx.closePath();
  ctx.fill();
  // Small plane icon on the line
  ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
  ctx.font = "400 28px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✈", W / 2, arrowLineY + 9);
  ctx.restore();

  // TO code — massive right-aligned
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.97)";
  ctx.font = "800 108px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCode, W - PAD - 52, routeBlockY + 175);

  // TO city
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.font = "300 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCity, W - PAD - 56, routeBlockY + 213);

  // ══════════════════════════════════════════════
  //  8. PRICE — DOMINANT GOLD
  // ══════════════════════════════════════════════
  const priceY = routeBlockY + 340;
  ctx.textAlign = "center";

  // Massive gold glow behind price
  const priceGlow = ctx.createRadialGradient(W / 2, priceY + 20, 0, W / 2, priceY + 20, 320);
  priceGlow.addColorStop(0, "rgba(168, 133, 15, 0.12)");
  priceGlow.addColorStop(0.5, "rgba(168, 133, 15, 0.04)");
  priceGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = priceGlow;
  ctx.fillRect(0, priceY - 120, W, 280);

  const isPriceNumeric = /\d/.test(data.price);

  if (!isPriceNumeric) {
    // "SAVE UP TO" label
    ctx.fillStyle = "rgba(168, 133, 15, 0.45)";
    ctx.font = "500 20px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("SAVE UP TO", W / 2, priceY - 45);

    // "75%" — massive, glowing
    ctx.save();
    ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
    ctx.shadowBlur = 50;
    ctx.fillStyle = "rgba(230, 195, 75, 1)";
    ctx.font = "900 120px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("75%", W / 2, priceY + 65);
    ctx.restore();

    // Subtitle
    ctx.fillStyle = "rgba(168, 133, 15, 0.4)";
    ctx.font = "400 18px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("VS. ON-DEMAND CHARTER", W / 2, priceY + 105);
  } else {
    // "FROM" label
    ctx.fillStyle = "rgba(168, 133, 15, 0.45)";
    ctx.font = "500 18px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("FROM", W / 2, priceY - 40);

    // Actual price — large gold
    ctx.save();
    ctx.shadowColor = "rgba(212, 175, 55, 0.5)";
    ctx.shadowBlur = 40;
    ctx.fillStyle = "rgba(230, 195, 75, 1)";
    ctx.font = "900 86px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(data.price, W / 2, priceY + 50);
    ctx.restore();

    // Subtitle
    ctx.fillStyle = "rgba(168, 133, 15, 0.4)";
    ctx.font = "400 18px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("ALL-INCLUSIVE  •  ONE WAY", W / 2, priceY + 90);
  }

  // ══════════════════════════════════════════════
  //  9. AIRCRAFT + DATE — glass card
  // ══════════════════════════════════════════════
  const glassY = priceY + 160;
  const glassW = W - PAD * 2 - 100;
  const glassH = 140;
  const glassX = (W - glassW) / 2;

  // Glass card background
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  roundRect(ctx, glassX, glassY, glassW, glassH, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  roundRect(ctx, glassX, glassY, glassW, glassH, 16);
  ctx.stroke();

  // Left side — Aircraft info
  const leftCenterX = glassX + glassW * 0.33;
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "400 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AIRCRAFT", leftCenterX, glassY + 40);
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "600 20px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.aircraftType, leftCenterX, glassY + 70);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "300 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.category.toUpperCase(), leftCenterX, glassY + 95);

  // Vertical divider
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(glassX + glassW * 0.66, glassY + 25);
  ctx.lineTo(glassX + glassW * 0.66, glassY + glassH - 25);
  ctx.stroke();

  // Right side — Departure date (aviation style)
  const rightCenterX = glassX + glassW * 0.83;
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "400 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("DEPARTURE", rightCenterX, glassY + 40);

  // Format date to aviation style: "28 MAR 2026"
  const dateFormatted = formatAviationDate(data.date);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "600 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(dateFormatted, rightCenterX, glassY + 72);
  ctx.fillStyle = "rgba(168,133,15,0.35)";
  ctx.font = "400 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("LOCAL TIME", rightCenterX, glassY + 95);

  // ══════════════════════════════════════════════
  //  10. CTA + URGENCY
  // ══════════════════════════════════════════════
  const ctaY = glassY + glassH + 65;

  // CTA glow
  ctx.save();
  const ctaGlow = ctx.createRadialGradient(W / 2, ctaY + 32, 0, W / 2, ctaY + 32, 300);
  ctaGlow.addColorStop(0, "rgba(168, 133, 15, 0.15)");
  ctaGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = ctaGlow;
  ctx.fillRect(0, ctaY - 30, W, 140);
  ctx.restore();

  // CTA button
  const ctaBtnW = 480;
  const ctaBtnH = 68;
  const ctaBtnX = (W - ctaBtnW) / 2;
  const ctaGrad = ctx.createLinearGradient(ctaBtnX, ctaY, ctaBtnX + ctaBtnW, ctaY);
  ctaGrad.addColorStop(0, "rgba(168, 133, 15, 0.85)");
  ctaGrad.addColorStop(0.5, "rgba(212, 175, 55, 0.95)");
  ctaGrad.addColorStop(1, "rgba(168, 133, 15, 0.85)");
  ctx.fillStyle = ctaGrad;
  roundRect(ctx, ctaBtnX, ctaY, ctaBtnW, ctaBtnH, 34);
  ctx.fill();
  // Subtle inner highlight
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  roundRect(ctx, ctaBtnX + 1, ctaY + 1, ctaBtnW - 2, ctaBtnH / 2, 33);
  ctx.stroke();

  ctx.fillStyle = "#0a0a0f";
  ctx.font = "700 17px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("BOOK THIS EMPTY LEG  →", W / 2, ctaY + 42);

  // Urgency line
  const urgencyY = ctaY + ctaBtnH + 38;
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.font = "300 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Limited availability  •  First confirmed client secures the aircraft", W / 2, urgencyY);

  // ══════════════════════════════════════════════
  //  11. FOOTER
  // ══════════════════════════════════════════════
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.font = "400 16px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("universaljets.com", W / 2, H - 115);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.font = "300 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Private Aviation  •  Since 2006  •  Dubai  •  London", W / 2, H - 88);

  // Bottom gold hairline
  const bLine = ctx.createLinearGradient(PAD + 80, 0, W - PAD - 80, 0);
  bLine.addColorStop(0, "rgba(168,133,15,0)");
  bLine.addColorStop(0.5, "rgba(168,133,15,0.2)");
  bLine.addColorStop(1, "rgba(168,133,15,0)");
  ctx.strokeStyle = bLine;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 80, H - PAD - 20); ctx.lineTo(W - PAD - 80, H - PAD - 20); ctx.stroke();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
      1
    );
  });
}

/* ── Format date to aviation style: "28 MAR 2026" ── */
function formatAviationDate(dateStr: string): string {
  try {
    // Try parsing common formats
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch { /* fallback */ }
  return dateStr.toUpperCase();
}
