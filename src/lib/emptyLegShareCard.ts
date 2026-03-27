/**
 * Premium Empty Leg share card — polished lighter charcoal with glossy Mapbox map,
 * gold route arc, city names on map, large readable details,
 * seat count icon, and deep link. Instagram Story ratio (1080×1920).
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
const PAD = 64;

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
  ctx.shadowColor = "rgba(212, 175, 55, 0.5)";
  ctx.shadowBlur = 60;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.08)";
  ctx.lineWidth = 44;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();
  ctx.restore();

  // Second glow
  ctx.save();
  ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
  ctx.shadowBlur = 30;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.18)";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();
  ctx.restore();

  // Core gold line
  const lg = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
  lg.addColorStop(0, "rgba(212, 175, 55, 0.6)");
  lg.addColorStop(0.5, "rgba(230, 195, 70, 1)");
  lg.addColorStop(1, "rgba(212, 175, 55, 0.6)");
  ctx.strokeStyle = lg;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();

  // Directional arrow at ~80%
  const t = 0.82, t2 = 0.79;
  const ptX = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * midX + t * t * to[0];
  const ptY = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * midY + t * t * to[1];
  const pt2X = (1 - t2) * (1 - t2) * from[0] + 2 * (1 - t2) * t2 * midX + t2 * t2 * to[0];
  const pt2Y = (1 - t2) * (1 - t2) * from[1] + 2 * (1 - t2) * t2 * midY + t2 * t2 * to[1];
  const angle = Math.atan2(ptY - pt2Y, ptX - pt2X);
  ctx.fillStyle = "rgba(230, 195, 70, 0.95)";
  ctx.beginPath();
  ctx.moveTo(ptX + 7 * Math.cos(angle), ptY + 7 * Math.sin(angle));
  ctx.lineTo(ptX - 18 * Math.cos(angle - 0.4), ptY - 18 * Math.sin(angle - 0.4));
  ctx.lineTo(ptX - 18 * Math.cos(angle + 0.4), ptY - 18 * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();

  // Endpoint dots — glossy
  [from, to].forEach(([x, y]) => {
    // Outer glow
    ctx.fillStyle = "rgba(212, 175, 55, 0.15)";
    ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill();
    // Ring
    ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.stroke();
    // Core dot
    const dotGrad = ctx.createRadialGradient(x - 1, y - 1, 0, x, y, 5);
    dotGrad.addColorStop(0, "rgba(255, 225, 100, 1)");
    dotGrad.addColorStop(1, "rgba(212, 175, 55, 1)");
    ctx.fillStyle = dotGrad;
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
  });
}

/* ── Draw city label on map near endpoint ── */
function drawCityLabel(ctx: CanvasRenderingContext2D, city: string, pt: [number, number], align: "left" | "right") {
  const offsetX = align === "left" ? -22 : 22;
  const offsetY = -24;
  ctx.save();
  ctx.textAlign = align;
  ctx.font = "700 26px 'Inter', 'Helvetica Neue', sans-serif";
  const m = ctx.measureText(city);
  const pillW = m.width + 24;
  const pillH = 36;
  const pillX = align === "left" ? pt[0] + offsetX - pillW - 4 : pt[0] + offsetX - 8;

  // Glossy pill background
  ctx.fillStyle = "rgba(30, 30, 38, 0.82)";
  roundRect(ctx, pillX, pt[1] + offsetY - 24, pillW + 12, pillH, 8);
  ctx.fill();
  // Subtle border
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  roundRect(ctx, pillX, pt[1] + offsetY - 24, pillW + 12, pillH, 8);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillText(city, pt[0] + offsetX, pt[1] + offsetY);
  ctx.restore();
}

/* ── Seat icon (person silhouette) ── */
function drawSeatIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.fillStyle = "rgba(212, 175, 55, 0.8)";
  ctx.beginPath(); ctx.arc(x, y - size * 0.55, size * 0.28, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - size * 0.35, y + size * 0.4);
  ctx.quadraticCurveTo(x, y - size * 0.15, x + size * 0.35, y + size * 0.4);
  ctx.lineTo(x + size * 0.25, y + size * 0.4);
  ctx.quadraticCurveTo(x, y + size * 0.05, x - size * 0.25, y + size * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export const SHARE_DEEP_LINK = "https://universaljets.com/#empty-legs";

/* ═══════════════ MAIN ═══════════════ */
export async function generateEmptyLegShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const fromCoords = getAirportCoords(data.fromCode);
  const toCoords = getAirportCoords(data.toCode);

  // ── 1. Lighter charcoal background with subtle glossy gradient ──
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#28282f");
  bg.addColorStop(0.3, "#2c2c34");
  bg.addColorStop(0.6, "#2a2a32");
  bg.addColorStop(1, "#242430");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle glossy sheen overlay at top
  const sheen = ctx.createLinearGradient(0, 0, W, H * 0.3);
  sheen.addColorStop(0, "rgba(255,255,255,0.03)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0.01)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H * 0.3);

  // ═══════════════════════════════════════
  //  HEADER — Brand + Badge
  // ═══════════════════════════════════════
  ctx.textAlign = "center";

  // Brand name
  ctx.fillStyle = "rgba(212, 175, 55, 0.85)";
  ctx.font = "600 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("U N I V E R S A L   J E T S", W / 2, 75);

  // Badge pill
  ctx.fillStyle = "rgba(212, 175, 55, 0.07)";
  roundRect(ctx, W / 2 - 160, 95, 320, 42, 21);
  ctx.fill();
  ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 160, 95, 320, 42, 21);
  ctx.stroke();
  ctx.fillStyle = "rgba(212, 175, 55, 0.9)";
  ctx.font = "700 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("✈  EMPTY LEG OPPORTUNITY", W / 2, 121);

  // ═══════════════════════════════════════
  //  MAP — clean and polished
  // ═══════════════════════════════════════
  const mapTop = 160;
  const mapH = 680;

  try {
    const mapImg = await loadImage(buildMapUrl(fromCoords, toCoords));
    // Brighter map for cleaner look
    ctx.globalAlpha = 0.8;
    ctx.drawImage(mapImg, 0, mapTop, W, mapH);
    ctx.globalAlpha = 1;
  } catch {
    // Grid fallback
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, mapTop); ctx.lineTo(x, mapTop + mapH); ctx.stroke(); }
    for (let y = mapTop; y < mapTop + mapH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  // Clean fade edges
  const fadeTop = ctx.createLinearGradient(0, mapTop, 0, mapTop + 90);
  fadeTop.addColorStop(0, "#28282f");
  fadeTop.addColorStop(1, "rgba(40,40,47,0)");
  ctx.fillStyle = fadeTop;
  ctx.fillRect(0, mapTop, W, 90);

  const fadeBot = ctx.createLinearGradient(0, mapTop + mapH - 110, 0, mapTop + mapH);
  fadeBot.addColorStop(0, "rgba(42,42,50,0)");
  fadeBot.addColorStop(1, "#2a2a32");
  ctx.fillStyle = fadeBot;
  ctx.fillRect(0, mapTop + mapH - 110, W, 110);

  // Route arc on map
  let arcFrom: [number, number] = [W * 0.25, mapTop + mapH * 0.35];
  let arcTo: [number, number] = [W * 0.75, mapTop + mapH * 0.65];
  if (fromCoords && toCoords) {
    const p = projectToCanvas(fromCoords, toCoords, mapTop, mapH);
    arcFrom = p.from;
    arcTo = p.to;
  }
  drawRouteArc(ctx, arcFrom, arcTo);

  // City labels on map
  const fromLabel = data.fromCity || data.fromCode;
  const toLabel = data.toCity || data.toCode;
  drawCityLabel(ctx, fromLabel, arcFrom, "left");
  drawCityLabel(ctx, toLabel, arcTo, "right");

  // ═══════════════════════════════════════
  //  ROUTE — Big city names + ICAO codes
  // ═══════════════════════════════════════
  const routeY = mapTop + mapH + 50;

  // FROM city
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.97)";
  ctx.font = "800 72px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(fromLabel, PAD, routeY);
  ctx.fillStyle = "rgba(212,175,55,0.55)";
  ctx.font = "500 20px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCode, PAD, routeY + 34);

  // Separator line with plane
  const sepY = routeY + 60;
  const sepGrad = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  sepGrad.addColorStop(0, "rgba(212,175,55,0)");
  sepGrad.addColorStop(0.06, "rgba(212,175,55,0.45)");
  sepGrad.addColorStop(0.94, "rgba(212,175,55,0.45)");
  sepGrad.addColorStop(1, "rgba(212,175,55,0)");
  ctx.strokeStyle = sepGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(PAD, sepY); ctx.lineTo(W - PAD, sepY); ctx.stroke();
  // Plane on the line
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(212,175,55,0.85)";
  ctx.font = "400 24px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("✈", W / 2, sepY + 8);

  // TO city
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.97)";
  ctx.font = "800 72px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(toLabel, W - PAD, sepY + 82);
  ctx.fillStyle = "rgba(212,175,55,0.55)";
  ctx.font = "500 20px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCode, W - PAD, sepY + 112);

  // ═══════════════════════════════════════
  //  DETAILS — Glossy glass card
  // ═══════════════════════════════════════
  const detailY = sepY + 155;
  const cardW = W - PAD * 2;
  const cardH = 145;

  // Glossy glass card background
  const glassGrad = ctx.createLinearGradient(PAD, detailY, PAD, detailY + cardH);
  glassGrad.addColorStop(0, "rgba(255,255,255,0.055)");
  glassGrad.addColorStop(1, "rgba(255,255,255,0.025)");
  ctx.fillStyle = glassGrad;
  roundRect(ctx, PAD, detailY, cardW, cardH, 18);
  ctx.fill();
  // Glossy border
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  roundRect(ctx, PAD, detailY, cardW, cardH, 18);
  ctx.stroke();
  // Top highlight for gloss
  ctx.save();
  ctx.clip();
  const glossHighlight = ctx.createLinearGradient(PAD, detailY, PAD, detailY + 30);
  glossHighlight.addColorStop(0, "rgba(255,255,255,0.06)");
  glossHighlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glossHighlight;
  ctx.fillRect(PAD, detailY, cardW, 30);
  ctx.restore();

  // 4 columns: Date | Aircraft | Seats | Price
  const hasPax = data.maxPax != null && data.maxPax > 0;
  const cols = hasPax ? 4 : 3;
  const colW = cardW / cols;

  ctx.textAlign = "center";

  // Col 1: Date
  const c1x = PAD + colW * 0.5;
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "500 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("DATE", c1x, detailY + 40);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "700 30px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(formatDate(data.date), c1x, detailY + 80);

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + colW, detailY + 24); ctx.lineTo(PAD + colW, detailY + cardH - 24); ctx.stroke();

  // Col 2: Aircraft
  const c2x = PAD + colW * 1.5;
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "500 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("AIRCRAFT", c2x, detailY + 40);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  const acName = data.aircraftType.length > 15 ? data.aircraftType.substring(0, 13) + "…" : data.aircraftType;
  ctx.font = "700 26px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(acName, c2x, detailY + 76);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "400 14px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.category.toUpperCase(), c2x, detailY + 100);

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath(); ctx.moveTo(PAD + colW * 2, detailY + 24); ctx.lineTo(PAD + colW * 2, detailY + cardH - 24); ctx.stroke();

  if (hasPax) {
    // Col 3: Seats
    const c3x = PAD + colW * 2.5;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "500 13px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("SEATS", c3x, detailY + 40);
    drawSeatIcon(ctx, c3x - 24, detailY + 74, 20);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "700 30px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(String(data.maxPax), c3x + 10, detailY + 80);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath(); ctx.moveTo(PAD + colW * 3, detailY + 24); ctx.lineTo(PAD + colW * 3, detailY + cardH - 24); ctx.stroke();

    // Col 4: Price
    const c4x = PAD + colW * 3.5;
    ctx.fillStyle = "rgba(212,175,55,0.55)";
    ctx.font = "500 13px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("PRICE", c4x, detailY + 40);
    const isPriceNumeric = /[\d]/.test(data.price);
    ctx.fillStyle = "rgba(230,195,70,1)";
    ctx.font = isPriceNumeric ? "800 28px 'Inter', 'Helvetica Neue', sans-serif" : "600 24px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(isPriceNumeric ? data.price : "On request", c4x, detailY + 80);
  } else {
    // Col 3: Price (when no seats)
    const c3x = PAD + colW * 2.5;
    ctx.fillStyle = "rgba(212,175,55,0.55)";
    ctx.font = "500 13px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("PRICE", c3x, detailY + 40);
    const isPriceNumeric = /[\d]/.test(data.price);
    ctx.fillStyle = "rgba(230,195,70,1)";
    ctx.font = isPriceNumeric ? "800 30px 'Inter', 'Helvetica Neue', sans-serif" : "600 24px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(isPriceNumeric ? data.price : "On request", c3x, detailY + 80);
  }

  // ═══════════════════════════════════════
  //  SAVINGS BADGE — glossy
  // ═══════════════════════════════════════
  const savingsY = detailY + cardH + 40;
  const savGrad = ctx.createLinearGradient(W / 2 - 230, savingsY, W / 2 - 230, savingsY + 48);
  savGrad.addColorStop(0, "rgba(212,175,55,0.08)");
  savGrad.addColorStop(1, "rgba(212,175,55,0.04)");
  ctx.fillStyle = savGrad;
  roundRect(ctx, W / 2 - 230, savingsY, 460, 48, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(212,175,55,0.25)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 230, savingsY, 460, 48, 24);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(230,195,70,0.92)";
  ctx.font = "700 14px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("SAVE UP TO 75% VS ON-DEMAND CHARTER", W / 2, savingsY + 31);

  // ═══════════════════════════════════════
  //  FOOTER — website + tagline
  // ═══════════════════════════════════════
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "400 17px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("universaljets.com", W / 2, H - 72);
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "300 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Private Aviation  ·  Since 2006  ·  Dubai  ·  London", W / 2, H - 46);

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
