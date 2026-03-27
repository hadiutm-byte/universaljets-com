/**
 * Premium Empty Leg share card — clean, modern, readable.
 * Light gray Mapbox map, black & gold text, aircraft photo,
 * city names prominent with airport codes below.
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
}

const W = 1080;
const H = 1920;
const PAD = 56;

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
  // Light style map
  return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${centerLon.toFixed(4)},${centerLat.toFixed(4)},${zoom},0/540x960@2x?access_token=${MAPBOX_TOKEN}&attribution=false&logo=false`;
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

/* ── Route arc with directional arrow on map ── */
function drawRouteArc(ctx: CanvasRenderingContext2D, from: [number, number], to: [number, number]) {
  const midX = (from[0] + to[0]) / 2;
  const dist = Math.sqrt((to[0] - from[0]) ** 2 + (to[1] - from[1]) ** 2);
  const arcHeight = Math.max(40, Math.min(dist * 0.35, 160));
  const midY = Math.min(from[1], to[1]) - arcHeight;

  // Glow
  ctx.save();
  ctx.shadowColor = "rgba(200, 160, 30, 0.6)";
  ctx.shadowBlur = 30;
  ctx.strokeStyle = "rgba(200, 160, 30, 0.15)";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.quadraticCurveTo(midX, midY, to[0], to[1]); ctx.stroke();
  ctx.restore();

  // Core line — dark gold on light map
  const lg = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
  lg.addColorStop(0, "rgba(180, 140, 20, 0.5)");
  lg.addColorStop(0.5, "rgba(200, 160, 30, 1)");
  lg.addColorStop(1, "rgba(180, 140, 20, 0.5)");
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
  ctx.fillStyle = "rgba(200, 160, 30, 0.95)";
  ctx.beginPath();
  ctx.moveTo(ptX + 6 * Math.cos(angle), ptY + 6 * Math.sin(angle));
  ctx.lineTo(ptX - 18 * Math.cos(angle - 0.45), ptY - 18 * Math.sin(angle - 0.45));
  ctx.lineTo(ptX - 18 * Math.cos(angle + 0.45), ptY - 18 * Math.sin(angle + 0.45));
  ctx.closePath();
  ctx.fill();

  // Endpoint dots
  [from, to].forEach(([x, y]) => {
    ctx.fillStyle = "rgba(200, 160, 30, 0.15)";
    ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(200, 160, 30, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(200, 160, 30, 1)";
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });
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

  // ── White background ──
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);

  // ═══════════════════════════════════════
  //  TOP: Aircraft photo with overlay
  // ═══════════════════════════════════════
  const photoH = 480;
  if (data.aircraftImage) {
    try {
      const acImg = await loadImage(data.aircraftImage);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, photoH);
      ctx.clip();
      const imgAspect = acImg.width / acImg.height;
      const drawW = Math.max(W, photoH * imgAspect);
      const drawH = Math.max(photoH, W / imgAspect);
      ctx.drawImage(acImg, (W - drawW) / 2, (photoH - drawH) / 2, drawW, drawH);
      ctx.restore();
      // Gradient overlay at bottom of photo
      const photoGrad = ctx.createLinearGradient(0, photoH - 120, 0, photoH);
      photoGrad.addColorStop(0, "rgba(0,0,0,0)");
      photoGrad.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = photoGrad;
      ctx.fillRect(0, photoH - 120, W, 120);
      // Top overlay for brand
      const topGrad = ctx.createLinearGradient(0, 0, 0, 100);
      topGrad.addColorStop(0, "rgba(0,0,0,0.4)");
      topGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, 100);
    } catch {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, W, photoH);
    }
  } else {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, W, photoH);
  }

  // Brand on photo
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "500 15px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("U N I V E R S A L   J E T S", W / 2, 48);

  // Aircraft type + category on photo
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 28px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.aircraftType, PAD, photoH - 48);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "400 14px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.category.toUpperCase(), PAD, photoH - 22);

  // Badge on photo
  ctx.textAlign = "right";
  const badgeW = 240, badgeH = 34;
  const badgeX = W - PAD - badgeW, badgeY = photoH - 58;
  ctx.fillStyle = "rgba(200,160,30,0.9)";
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 17);
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.font = "700 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✈  EMPTY LEG OPPORTUNITY", badgeX + badgeW / 2, badgeY + 22);

  // ═══════════════════════════════════════
  //  MAP SECTION
  // ═══════════════════════════════════════
  const mapTop = photoH;
  const mapH = 620;

  try {
    const mapImg = await loadImage(buildMapUrl(fromCoords, toCoords));
    ctx.drawImage(mapImg, 0, mapTop, W, mapH);
  } catch {
    // Light gray fallback
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, mapTop, W, mapH);
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, mapTop); ctx.lineTo(x, mapTop + mapH); ctx.stroke(); }
    for (let y = mapTop; y < mapTop + mapH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  // Route arc on map
  let arcFrom: [number, number] = [W * 0.2, mapTop + mapH * 0.5];
  let arcTo: [number, number] = [W * 0.8, mapTop + mapH * 0.5];
  if (fromCoords && toCoords) {
    const p = projectToCanvas(fromCoords, toCoords, mapTop, mapH);
    arcFrom = p.from;
    arcTo = p.to;
  }
  drawRouteArc(ctx, arcFrom, arcTo);

  // ═══════════════════════════════════════
  //  BOTTOM: Dark content area
  // ═══════════════════════════════════════
  const contentTop = mapTop + mapH;
  const contentH = H - contentTop;
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, contentTop, W, contentH);

  // Subtle gold line separator
  const sepGrad = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  sepGrad.addColorStop(0, "rgba(200,160,30,0)");
  sepGrad.addColorStop(0.2, "rgba(200,160,30,0.6)");
  sepGrad.addColorStop(0.8, "rgba(200,160,30,0.6)");
  sepGrad.addColorStop(1, "rgba(200,160,30,0)");
  ctx.strokeStyle = sepGrad;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(PAD, contentTop); ctx.lineTo(W - PAD, contentTop); ctx.stroke();

  // ── Route: City names big, airport codes small ──
  const routeY = contentTop + 70;

  // FROM
  const fromCity = data.fromCity || data.fromCode;
  const toCity = data.toCity || data.toCode;

  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 56px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(fromCity, PAD, routeY);
  ctx.fillStyle = "rgba(200,160,30,0.7)";
  ctx.font = "500 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCode, PAD, routeY + 30);

  // Arrow
  const arrowY = routeY + 55;
  const lineGrad2 = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  lineGrad2.addColorStop(0, "rgba(200,160,30,0)");
  lineGrad2.addColorStop(0.05, "rgba(200,160,30,0.5)");
  lineGrad2.addColorStop(0.95, "rgba(200,160,30,0.5)");
  lineGrad2.addColorStop(1, "rgba(200,160,30,0)");
  ctx.strokeStyle = lineGrad2;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD, arrowY); ctx.lineTo(W - PAD, arrowY); ctx.stroke();
  // Plane icon
  ctx.fillStyle = "rgba(200,160,30,0.9)";
  ctx.font = "400 20px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✈ →", W / 2, arrowY + 7);

  // TO
  ctx.textAlign = "right";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 56px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(toCity, W - PAD, arrowY + 70);
  ctx.fillStyle = "rgba(200,160,30,0.7)";
  ctx.font = "500 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCode, W - PAD, arrowY + 100);

  // ── Details row: Date & Price ──
  const detailY = arrowY + 145;

  // Date card
  const cardPad = 20;
  const cardW2 = (W - PAD * 2 - cardPad) / 2;
  const cardH2 = 100;

  // Date
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  roundRect(ctx, PAD, detailY, cardW2, cardH2, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  roundRect(ctx, PAD, detailY, cardW2, cardH2, 14);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "500 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("DEPARTURE DATE", PAD + cardW2 / 2, detailY + 35);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 24px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(formatDate(data.date), PAD + cardW2 / 2, detailY + 68);

  // Price
  const priceX = PAD + cardW2 + cardPad;
  ctx.fillStyle = "rgba(200,160,30,0.08)";
  roundRect(ctx, priceX, detailY, cardW2, cardH2, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(200,160,30,0.2)";
  ctx.lineWidth = 1;
  roundRect(ctx, priceX, detailY, cardW2, cardH2, 14);
  ctx.stroke();

  ctx.fillStyle = "rgba(200,160,30,0.5)";
  ctx.font = "500 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("PRICE", priceX + cardW2 / 2, detailY + 35);
  const isPriceNumeric = /[\d]/.test(data.price);
  if (isPriceNumeric) {
    ctx.fillStyle = "rgba(220,180,40,1)";
    ctx.font = "800 26px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText(data.price, priceX + cardW2 / 2, detailY + 68);
  } else {
    ctx.fillStyle = "rgba(220,180,40,0.8)";
    ctx.font = "600 20px 'Inter', 'Helvetica Neue', sans-serif";
    ctx.fillText("On Request", priceX + cardW2 / 2, detailY + 68);
  }

  // ── Savings badge ──
  const savingsY = detailY + cardH2 + 30;
  ctx.fillStyle = "rgba(200,160,30,0.1)";
  roundRect(ctx, W / 2 - 200, savingsY, 400, 40, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(200,160,30,0.3)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 200, savingsY, 400, 40, 20);
  ctx.stroke();
  ctx.fillStyle = "rgba(220,180,40,1)";
  ctx.font = "700 12px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("SAVE UP TO 75% VS ON-DEMAND CHARTER", W / 2, savingsY + 26);

  // ═══════════════════════════════════════
  //  FOOTER
  // ═══════════════════════════════════════
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "400 15px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("universaljets.com", W / 2, H - 60);
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "300 11px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Private Aviation  ·  Since 2006  ·  Dubai  ·  London", W / 2, H - 38);

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
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch { /* fallback */ }
  return dateStr;
}
