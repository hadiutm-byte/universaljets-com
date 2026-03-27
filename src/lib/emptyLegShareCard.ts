/**
 * Premium Empty Leg share card — dark charcoal with Mapbox map,
 * gold route arc, city names on map, large readable details,
 * seat count icon, and deep link.
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
  aircraftImage?: string;
  maxPax?: number | null;
}

const W = 1080;
const H = 1920;
const PAD = 60;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

function buildMapUrl(from: [number, number] | undefined, to: [number, number] | undefined): string {
  let centerLat = 30, centerLon = 25, zoom = 2;
  if (from && to) {
    centerLat = (from[0] + to[0]) / 2;
    centerLon = (from[1] + to[1]) / 2;
    const dist = Math.sqrt((from[0] - to[0]) ** 2 + (from[1] - to[1]) ** 2);
    zoom = dist > 60 ? 1.5 : dist > 30 ? 2.5 : dist > 15 ? 3.5 : dist > 5 ? 4.5 : 5.5;
  }
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${centerLon.toFixed(4)},${centerLat.toFixed(4)},${zoom},0/540x540@2x?access_token=${MAPBOX_TOKEN}&attribution=false&logo=false`;
}

function projectToCanvas(
  fromCoord: [number, number],
  toCoord: [number, number],
  mapTop: number,
  mapH: number
): { from: [number, number]; to: [number, number] } {
  const centerLat = (fromCoord[0] + toCoord[0]) / 2;
  const centerLon = (fromCoord[1] + toCoord[1]) / 2;
  const dist = Math.sqrt((fromCoord[0] - toCoord[0]) ** 2 + (fromCoord[1] - toCoord[1]) ** 2);
  const zoom = dist > 60 ? 1.5 : dist > 30 ? 2.5 : dist > 15 ? 3.5 : dist > 5 ? 4.5 : 5.5;
  const scale = (256 * Math.pow(2, zoom)) / 360;
  const mapCenterY = mapTop + mapH / 2;
  const toX = (lon: number) => W / 2 + (lon - centerLon) * scale * 2;
  const toY = (lat: number) => {
    const cM = Math.log(Math.tan(Math.PI / 4 + (centerLat * Math.PI) / 360));
    const lM = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
    return mapCenterY - (lM - cM) * scale * (180 / Math.PI) * 2;
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

/* ── Route arc with directional arrow ── */
function drawRouteArc(ctx: CanvasRenderingContext2D, from: [number, number], to: [number, number]) {
  const midX = (from[0] + to[0]) / 2;
  const dist = Math.sqrt((to[0] - from[0]) ** 2 + (to[1] - from[1]) ** 2);
  const arcHeight = Math.max(40, Math.min(dist * 0.35, 160));
  const midY = Math.min(from[1], to[1]) - arcHeight;

  // Wide atmospheric glow
  ctx.save();
  ctx.shadowColor = "rgba(200, 165, 40, 0.5)";
  ctx.shadowBlur = 50;
  ctx.strokeStyle = "rgba(200, 165, 40, 0.06)";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();
  ctx.restore();

  // Second glow
  ctx.save();
  ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
  ctx.shadowBlur = 25;
  ctx.strokeStyle = "rgba(200, 165, 40, 0.15)";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();
  ctx.restore();

  // Core gold line
  const lg = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
  lg.addColorStop(0, "rgba(200, 165, 40, 0.5)");
  lg.addColorStop(0.5, "rgba(220, 185, 60, 1)");
  lg.addColorStop(1, "rgba(200, 165, 40, 0.5)");
  ctx.strokeStyle = lg;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();

  // Directional arrow at ~80%
  const t = 0.82, t2 = 0.79;
  const ptX = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * midX + t * t * to[0];
  const ptY = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * midY + t * t * to[1];
  const pt2X = (1 - t2) * (1 - t2) * from[0] + 2 * (1 - t2) * t2 * midX + t2 * t2 * to[0];
  const pt2Y = (1 - t2) * (1 - t2) * from[1] + 2 * (1 - t2) * t2 * midY + t2 * t2 * to[1];
  const angle = Math.atan2(ptY - pt2Y, ptX - pt2X);
  ctx.fillStyle = "rgba(220, 185, 60, 0.95)";
  ctx.beginPath();
  ctx.moveTo(ptX + 6 * Math.cos(angle), ptY + 6 * Math.sin(angle));
  ctx.lineTo(ptX - 16 * Math.cos(angle - 0.4), ptY - 16 * Math.sin(angle - 0.4));
  ctx.lineTo(ptX - 16 * Math.cos(angle + 0.4), ptY - 16 * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();

  // Endpoint dots
  [from, to].forEach(([x, y]) => {
    ctx.fillStyle = "rgba(200, 165, 40, 0.12)";
    ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(200, 165, 40, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(220, 185, 60, 1)";
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });
}

/* ── Draw city label on map near endpoint ── */
function drawCityLabel(ctx: CanvasRenderingContext2D, city: string, pt: [number, number], align: "left" | "right") {
  const offsetX = align === "left" ? -20 : 20;
  const offsetY = -22;
  ctx.save();
  ctx.textAlign = align;
  // Background pill for readability
  ctx.font = "700 22px 'Inter', 'Helvetica Neue', sans-serif";
  const m = ctx.measureText(city);
  const pillW = m.width + 20;
  const pillH = 32;
  const pillX = align === "left" ? pt[0] + offsetX - pillW - 4 : pt[0] + offsetX - 6;
  ctx.fillStyle = "rgba(20, 20, 25, 0.75)";
  roundRect(ctx, pillX, pt[1] + offsetY - 22, pillW + 10, pillH, 6);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(city, pt[0] + offsetX, pt[1] + offsetY);
  ctx.restore();
}

/* ── Seat icon (simple person silhouette) ── */
function drawSeatIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.fillStyle = "rgba(200, 165, 40, 0.7)";
  // Head
  ctx.beginPath(); ctx.arc(x, y - size * 0.55, size * 0.28, 0, Math.PI * 2); ctx.fill();
  // Body
  ctx.beginPath();
  ctx.moveTo(x - size * 0.35, y + size * 0.4);
  ctx.quadraticCurveTo(x, y - size * 0.15, x + size * 0.35, y + size * 0.4);
  ctx.lineTo(x + size * 0.25, y + size * 0.4);
  ctx.quadraticCurveTo(x, y + size * 0.05, x - size * 0.25, y + size * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export const SHARE_DEEP_LINK = "https://www.universaljets.com/#empty-legs";

/* ═══════════════ MAIN ═══════════════ */
export async function generateEmptyLegShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const fromCoords = getAirportCoords(data.fromCode);
  const toCoords = getAirportCoords(data.toCode);

  // ── 1. Charcoal background ──
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#1a1a20");
  bg.addColorStop(0.5, "#1e1e24");
  bg.addColorStop(1, "#16161b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ═══════════════════════════════════════
  //  HEADER — Brand + Badge
  // ═══════════════════════════════════════
  ctx.textAlign = "center";

  // Brand name — prominent
  ctx.fillStyle = "rgba(200, 165, 40, 0.8)";
  ctx.font = "600 20px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("U N I V E R S A L   J E T S", W / 2, 72);

  // Badge
  ctx.fillStyle = "rgba(200, 165, 40, 0.08)";
  roundRect(ctx, W / 2 - 150, 92, 300, 38, 19);
  ctx.fill();
  ctx.strokeStyle = "rgba(200, 165, 40, 0.25)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 150, 92, 300, 38, 19);
  ctx.stroke();
  ctx.fillStyle = "rgba(200, 165, 40, 0.9)";
  ctx.font = "700 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("✈  EMPTY LEG OPPORTUNITY", W / 2, 116);

  // ═══════════════════════════════════════
  //  MAP — covers upper portion
  // ═══════════════════════════════════════
  const mapTop = 155;
  const mapH = 700;

  try {
    const mapImg = await loadImage(buildMapUrl(fromCoords, toCoords));
    // Slightly lighten the dark map
    ctx.globalAlpha = 0.7;
    ctx.drawImage(mapImg, 0, mapTop, W, mapH);
    ctx.globalAlpha = 1;
  } catch {
    // Subtle grid fallback
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, mapTop); ctx.lineTo(x, mapTop + mapH); ctx.stroke(); }
    for (let y = mapTop; y < mapTop + mapH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  // Fade edges into background
  const fadeTop = ctx.createLinearGradient(0, mapTop, 0, mapTop + 80);
  fadeTop.addColorStop(0, "#1a1a20");
  fadeTop.addColorStop(1, "rgba(26,26,32,0)");
  ctx.fillStyle = fadeTop;
  ctx.fillRect(0, mapTop, W, 80);

  const fadeBot = ctx.createLinearGradient(0, mapTop + mapH - 100, 0, mapTop + mapH);
  fadeBot.addColorStop(0, "rgba(26,26,32,0)");
  fadeBot.addColorStop(1, "#1e1e24");
  ctx.fillStyle = fadeBot;
  ctx.fillRect(0, mapTop + mapH - 100, W, 100);

  // Route arc on map
  let arcFrom: [number, number] = [W * 0.25, mapTop + mapH * 0.35];
  let arcTo: [number, number] = [W * 0.75, mapTop + mapH * 0.65];
  if (fromCoords && toCoords) {
    const p = projectToCanvas(fromCoords, toCoords, mapTop, mapH);
    arcFrom = p.from;
    arcTo = p.to;
  }
  drawRouteArc(ctx, arcFrom, arcTo);

  // City labels on map near endpoints
  const fromLabel = data.fromCity || data.fromCode;
  const toLabel = data.toCity || data.toCode;
  drawCityLabel(ctx, fromLabel, arcFrom, "left");
  drawCityLabel(ctx, toLabel, arcTo, "right");

  // ═══════════════════════════════════════
  //  ROUTE — City names large + airport codes
  // ═══════════════════════════════════════
  const routeY = mapTop + mapH + 40;

  // FROM city
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "800 64px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(fromLabel, PAD, routeY);
  ctx.fillStyle = "rgba(200,165,40,0.5)";
  ctx.font = "500 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCode, PAD, routeY + 30);

  // Separator line with plane
  const sepY = routeY + 55;
  const sepGrad = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  sepGrad.addColorStop(0, "rgba(200,165,40,0)");
  sepGrad.addColorStop(0.08, "rgba(200,165,40,0.4)");
  sepGrad.addColorStop(0.92, "rgba(200,165,40,0.4)");
  sepGrad.addColorStop(1, "rgba(200,165,40,0)");
  ctx.strokeStyle = sepGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(PAD, sepY); ctx.lineTo(W - PAD, sepY); ctx.stroke();
  // Plane emoji on the line
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(200,165,40,0.8)";
  ctx.font = "400 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("✈", W / 2, sepY + 7);

  // TO city
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "800 64px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(toLabel, W - PAD, sepY + 75);
  ctx.fillStyle = "rgba(200,165,40,0.5)";
  ctx.font = "500 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCode, W - PAD, sepY + 105);

  // ═══════════════════════════════════════
  //  DETAILS — Glass card with date, aircraft, price, seats
  // ═══════════════════════════════════════
  const detailY = sepY + 145;
  const cardW = W - PAD * 2;
  const cardH = 130;

  ctx.fillStyle = "rgba(255,255,255,0.03)";
  roundRect(ctx, PAD, detailY, cardW, cardH, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  roundRect(ctx, PAD, detailY, cardW, cardH, 16);
  ctx.stroke();

  // 4 columns: Date | Aircraft | Seats | Price
  const hasPax = data.maxPax != null && data.maxPax > 0;
  const cols = hasPax ? 4 : 3;
  const colW = cardW / cols;

  ctx.textAlign = "center";

  // Col 1: Date
  const c1x = PAD + colW * 0.5;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "500 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("DATE", c1x, detailY + 38);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "700 26px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(formatDate(data.date), c1x, detailY + 72);

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + colW, detailY + 22); ctx.lineTo(PAD + colW, detailY + cardH - 22); ctx.stroke();

  // Col 2: Aircraft
  const c2x = PAD + colW * 1.5;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "500 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("AIRCRAFT", c2x, detailY + 38);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  const acName = data.aircraftType.length > 16 ? data.aircraftType.substring(0, 14) + "…" : data.aircraftType;
  ctx.font = "700 24px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(acName, c2x, detailY + 70);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "400 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.category.toUpperCase(), c2x, detailY + 94);

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath(); ctx.moveTo(PAD + colW * 2, detailY + 22); ctx.lineTo(PAD + colW * 2, detailY + cardH - 22); ctx.stroke();

  if (hasPax) {
    // Col 3: Seats
    const c3x = PAD + colW * 2.5;
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "500 12px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("SEATS", c3x, detailY + 38);
    // Seat icon
    drawSeatIcon(ctx, c3x - 22, detailY + 68, 18);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "700 26px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(String(data.maxPax), c3x + 8, detailY + 72);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath(); ctx.moveTo(PAD + colW * 3, detailY + 22); ctx.lineTo(PAD + colW * 3, detailY + cardH - 22); ctx.stroke();

    // Col 4: Price
    const c4x = PAD + colW * 3.5;
    ctx.fillStyle = "rgba(200,165,40,0.5)";
    ctx.font = "500 12px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("PRICE", c4x, detailY + 38);
    const isPriceNumeric = /[\d]/.test(data.price);
    ctx.fillStyle = "rgba(220,185,60,1)";
    ctx.font = isPriceNumeric ? "800 24px 'Inter', 'Helvetica Neue', sans-serif" : "600 22px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(isPriceNumeric ? data.price : "On request", c4x, detailY + 72);
  } else {
    // Col 3: Price (when no seats)
    const c3x = PAD + colW * 2.5;
    ctx.fillStyle = "rgba(200,165,40,0.5)";
    ctx.font = "500 12px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("PRICE", c3x, detailY + 38);
    const isPriceNumeric = /[\d]/.test(data.price);
    ctx.fillStyle = "rgba(220,185,60,1)";
    ctx.font = isPriceNumeric ? "800 26px 'Inter', 'Helvetica Neue', sans-serif" : "600 22px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(isPriceNumeric ? data.price : "On request", c3x, detailY + 72);
  }

  // ═══════════════════════════════════════
  //  SAVINGS BADGE
  // ═══════════════════════════════════════
  const savingsY = detailY + cardH + 35;
  ctx.fillStyle = "rgba(200,165,40,0.06)";
  roundRect(ctx, W / 2 - 220, savingsY, 440, 44, 22);
  ctx.fill();
  ctx.strokeStyle = "rgba(200,165,40,0.2)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 220, savingsY, 440, 44, 22);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(220,185,60,0.9)";
  ctx.font = "700 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("SAVE UP TO 75% VS ON-DEMAND CHARTER", W / 2, savingsY + 28);

  // ═══════════════════════════════════════
  //  FOOTER — website + tagline
  // ═══════════════════════════════════════
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "400 16px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("universaljets.com", W / 2, H - 70);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font = "300 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Private Aviation  ·  Since 2006  ·  Dubai  ·  London", W / 2, H - 45);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png", 1
    );
  });
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${d.getDate()} ${months[d.getMonth()]}`;
    }
  } catch { /* fallback */ }
  return dateStr;
}
