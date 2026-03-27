/**
 * Premium Empty Leg share card — clean, modern, readable.
 * Dark Mapbox map background, gold route arc with arrow,
 * city names prominent, deep link to website.
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
const H = 1350; // More shareable 4:5 ratio
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
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${centerLon.toFixed(4)},${centerLat.toFixed(4)},${zoom},0/540x675@2x?access_token=${MAPBOX_TOKEN}&attribution=false&logo=false`;
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
  const mapCenterY = H * 0.42;
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

  // Soft glow
  ctx.save();
  ctx.shadowColor = "rgba(212, 175, 55, 0.5)";
  ctx.shadowBlur = 40;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.08)";
  ctx.lineWidth = 30;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();
  ctx.restore();

  // Core gold line
  const lg = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
  lg.addColorStop(0, "rgba(212, 175, 55, 0.4)");
  lg.addColorStop(0.5, "rgba(230, 195, 75, 1)");
  lg.addColorStop(1, "rgba(212, 175, 55, 0.4)");
  ctx.strokeStyle = lg;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();

  // Directional arrow at ~80% along the curve
  const t = 0.8;
  const t2 = 0.78;
  const ptX = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * midX + t * t * to[0];
  const ptY = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * midY + t * t * to[1];
  const pt2X = (1 - t2) * (1 - t2) * from[0] + 2 * (1 - t2) * t2 * midX + t2 * t2 * to[0];
  const pt2Y = (1 - t2) * (1 - t2) * from[1] + 2 * (1 - t2) * t2 * midY + t2 * t2 * to[1];
  const angle = Math.atan2(ptY - pt2Y, ptX - pt2X);
  const arrowLen = 18;
  ctx.fillStyle = "rgba(230, 195, 75, 0.9)";
  ctx.beginPath();
  ctx.moveTo(ptX, ptY);
  ctx.lineTo(ptX - arrowLen * Math.cos(angle - 0.4), ptY - arrowLen * Math.sin(angle - 0.4));
  ctx.lineTo(ptX - arrowLen * Math.cos(angle + 0.4), ptY - arrowLen * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();

  // Endpoint dots
  [from, to].forEach(([x, y]) => {
    // Outer ring
    ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.stroke();
    // Inner dot
    ctx.fillStyle = "rgba(230, 195, 75, 1)";
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });
}

/* ── Dark fallback background ── */
function drawFallbackBg(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a0c14");
  bg.addColorStop(0.5, "#0d0f18");
  bg.addColorStop(1, "#080a12");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
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

  // ── 1. Map background ──
  try {
    const mapImg = await loadImage(buildMapUrl(fromCoords, toCoords));
    ctx.drawImage(mapImg, 0, 0, W, H);
  } catch {
    drawFallbackBg(ctx);
  }

  // Darken overlay for readability
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 0, W, H);

  // ── 2. Route arc with arrow ──
  let arcFrom: [number, number] = [W * 0.2, H * 0.42];
  let arcTo: [number, number] = [W * 0.8, H * 0.42];
  if (fromCoords && toCoords) {
    const p = projectToCanvas(fromCoords, toCoords);
    arcFrom = p.from;
    arcTo = p.to;
  }
  drawRouteArc(ctx, arcFrom, arcTo);

  // Top gradient for text readability
  const topGrad = ctx.createLinearGradient(0, 0, 0, 260);
  topGrad.addColorStop(0, "rgba(0,0,0,0.6)");
  topGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, W, 260);

  // Bottom gradient for content area
  const botGrad = ctx.createLinearGradient(0, H * 0.55, 0, H);
  botGrad.addColorStop(0, "rgba(0,0,0,0)");
  botGrad.addColorStop(0.3, "rgba(0,0,0,0.5)");
  botGrad.addColorStop(1, "rgba(0,0,0,0.75)");
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, H * 0.55, W, H * 0.45);

  // ═══════════════════════════════════════
  //  HEADER
  // ═══════════════════════════════════════
  ctx.textAlign = "center";

  // Brand
  ctx.fillStyle = "rgba(212, 175, 55, 0.7)";
  ctx.font = "500 16px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.letterSpacing = "0.4em";
  ctx.fillText("U N I V E R S A L   J E T S", W / 2, 70);

  // Badge
  ctx.fillStyle = "rgba(212, 175, 55, 0.12)";
  roundRect(ctx, W / 2 - 120, 90, 240, 36, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 120, 90, 240, 36, 18);
  ctx.stroke();
  ctx.fillStyle = "rgba(212, 175, 55, 0.9)";
  ctx.font = "600 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("✈  EMPTY LEG OPPORTUNITY", W / 2, 113);

  // ═══════════════════════════════════════
  //  ROUTE — City names prominent
  // ═══════════════════════════════════════
  const routeY = H * 0.62;

  // FROM city
  const fromLabel = data.fromCity || data.fromCode;
  const toLabel = data.toCity || data.toCode;

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "700 52px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(fromLabel, PAD + 20, routeY);
  // FROM airport code
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "400 16px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCode, PAD + 20, routeY + 28);

  // Arrow line
  const arrowLineY = routeY + 55;
  const lineGrad = ctx.createLinearGradient(PAD + 20, 0, W - PAD - 20, 0);
  lineGrad.addColorStop(0, "rgba(212,175,55,0)");
  lineGrad.addColorStop(0.1, "rgba(212,175,55,0.5)");
  lineGrad.addColorStop(0.9, "rgba(212,175,55,0.5)");
  lineGrad.addColorStop(1, "rgba(212,175,55,0)");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(PAD + 20, arrowLineY); ctx.lineTo(W - PAD - 20, arrowLineY); ctx.stroke();

  // Small plane icon on the line
  const planeX = W / 2;
  ctx.fillStyle = "rgba(212, 175, 55, 0.8)";
  ctx.font = "400 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✈", planeX, arrowLineY + 6);

  // TO city
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "700 52px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(toLabel, W - PAD - 20, routeY + 110);
  // TO airport code
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "400 16px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCode, W - PAD - 20, routeY + 138);

  // ═══════════════════════════════════════
  //  DETAILS — clean info strip
  // ═══════════════════════════════════════
  const detailY = routeY + 185;

  // Glass card background
  const cardW = W - PAD * 2 - 40;
  const cardH = 90;
  const cardX = (W - cardW) / 2;
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  roundRect(ctx, cardX, detailY, cardW, cardH, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  roundRect(ctx, cardX, detailY, cardW, cardH, 16);
  ctx.stroke();

  // Three columns: Date | Aircraft | Price
  const col1X = cardX + cardW * 0.17;
  const col2X = cardX + cardW * 0.5;
  const col3X = cardX + cardW * 0.83;

  ctx.textAlign = "center";

  // Date
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "400 10px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("DATE", col1X, detailY + 32);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "600 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(formatDate(data.date), col1X, detailY + 58);

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cardX + cardW * 0.33, detailY + 18); ctx.lineTo(cardX + cardW * 0.33, detailY + cardH - 18); ctx.stroke();

  // Aircraft
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "400 10px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("AIRCRAFT", col2X, detailY + 32);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "600 16px 'Inter', 'Helvetica Neue', sans-serif";
  // Truncate long aircraft names
  const acName = data.aircraftType.length > 18 ? data.aircraftType.substring(0, 16) + "…" : data.aircraftType;
  ctx.fillText(acName, col2X, detailY + 56);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "300 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.category.toUpperCase(), col2X, detailY + 74);

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath(); ctx.moveTo(cardX + cardW * 0.67, detailY + 18); ctx.lineTo(cardX + cardW * 0.67, detailY + cardH - 18); ctx.stroke();

  // Price
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "400 10px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("PRICE", col3X, detailY + 32);
  const isPriceNumeric = /[\d]/.test(data.price);
  if (isPriceNumeric) {
    ctx.fillStyle = "rgba(230, 195, 75, 1)";
    ctx.font = "700 20px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(data.price, col3X, detailY + 58);
  } else {
    ctx.fillStyle = "rgba(230, 195, 75, 0.9)";
    ctx.font = "500 14px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("On request", col3X, detailY + 58);
  }

  // ═══════════════════════════════════════
  //  SAVINGS BADGE
  // ═══════════════════════════════════════
  const savingsY = detailY + cardH + 30;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(212, 175, 55, 0.08)";
  roundRect(ctx, W / 2 - 180, savingsY, 360, 38, 19);
  ctx.fill();
  ctx.strokeStyle = "rgba(212, 175, 55, 0.2)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 180, savingsY, 360, 38, 19);
  ctx.stroke();
  ctx.fillStyle = "rgba(230, 195, 75, 0.9)";
  ctx.font = "600 13px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("SAVE UP TO 75% VS ON-DEMAND CHARTER", W / 2, savingsY + 24);

  // ═══════════════════════════════════════
  //  FOOTER with deep link
  // ═══════════════════════════════════════
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "400 14px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("universaljets.com", W / 2, H - 55);

  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "300 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Private Aviation  ·  Since 2006", W / 2, H - 34);

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
