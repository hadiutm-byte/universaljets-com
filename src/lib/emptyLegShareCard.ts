/**
 * Generates a branded Empty Leg share card image using HTML Canvas.
 * Returns a Blob that can be shared via Web Share API or downloaded.
 */

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

export async function generateEmptyLegShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Background ──
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a0a0f");
  bg.addColorStop(0.5, "#0f1118");
  bg.addColorStop(1, "#0a0a0f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow behind content
  const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, 500);
  glow.addColorStop(0, "rgba(196, 160, 56, 0.06)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Top gold accent line ──
  const lineGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
  lineGrad.addColorStop(0, "rgba(196,160,56,0)");
  lineGrad.addColorStop(0.5, "rgba(196,160,56,0.5)");
  lineGrad.addColorStop(1, "rgba(196,160,56,0)");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 180);
  ctx.lineTo(W - 100, 180);
  ctx.stroke();

  // ── Brand header ──
  ctx.fillStyle = "rgba(196, 160, 56, 0.7)";
  ctx.font = "500 28px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.letterSpacing = "12px";
  ctx.textAlign = "center";
  ctx.fillText("UNIVERSAL JETS", W / 2, 140);

  // ── "EMPTY LEG" badge ──
  ctx.fillStyle = "rgba(196, 160, 56, 0.15)";
  roundRect(ctx, W / 2 - 140, 230, 280, 50, 25);
  ctx.fill();
  ctx.strokeStyle = "rgba(196, 160, 56, 0.3)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 140, 230, 280, 50, 25);
  ctx.stroke();
  ctx.fillStyle = "rgba(196, 160, 56, 0.9)";
  ctx.font = "600 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("✈  EMPTY LEG DEAL", W / 2, 262);

  // ── Aircraft Type ──
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "700 52px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.aircraftType, W / 2, 380);

  // Category
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "400 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.category.toUpperCase(), W / 2, 420);

  // ── Route section ──
  const routeY = 560;

  // FROM
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "800 96px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(data.fromCode, W / 2, routeY);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "300 28px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.fromCity, W / 2, routeY + 45);

  // Arrow / plane
  ctx.fillStyle = "rgba(196, 160, 56, 0.6)";
  ctx.font = "400 60px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("↓", W / 2, routeY + 120);

  // TO
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "800 96px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCode, W / 2, routeY + 230);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "300 28px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.toCity, W / 2, routeY + 275);

  // ── Divider ──
  const divY = routeY + 330;
  const dGrad = ctx.createLinearGradient(200, 0, W - 200, 0);
  dGrad.addColorStop(0, "rgba(196,160,56,0)");
  dGrad.addColorStop(0.5, "rgba(196,160,56,0.3)");
  dGrad.addColorStop(1, "rgba(196,160,56,0)");
  ctx.strokeStyle = dGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, divY);
  ctx.lineTo(W - 200, divY);
  ctx.stroke();

  // ── Date + Price cards ──
  const cardY = divY + 50;
  const cardW = 380;
  const cardH = 140;
  const gap = 40;

  // Date card
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  roundRect(ctx, W / 2 - cardW - gap / 2, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - cardW - gap / 2, cardY, cardW, cardH, 20);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "400 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("DATE", W / 2 - cardW / 2 - gap / 2, cardY + 50);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "600 36px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.date, W / 2 - cardW / 2 - gap / 2, cardY + 100);

  // Price card
  ctx.fillStyle = "rgba(196,160,56,0.08)";
  roundRect(ctx, W / 2 + gap / 2, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(196,160,56,0.2)";
  roundRect(ctx, W / 2 + gap / 2, cardY, cardW, cardH, 20);
  ctx.stroke();

  ctx.fillStyle = "rgba(196,160,56,0.5)";
  ctx.font = "400 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("PRICE", W / 2 + cardW / 2 + gap / 2, cardY + 50);
  ctx.fillStyle = "rgba(196,160,56,1)";
  ctx.font = "700 36px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText(data.price, W / 2 + cardW / 2 + gap / 2, cardY + 100);

  // ── CTA ──
  const ctaY = cardY + cardH + 100;
  ctx.fillStyle = "rgba(196, 160, 56, 0.9)";
  roundRect(ctx, W / 2 - 240, ctaY, 480, 70, 35);
  ctx.fill();
  ctx.fillStyle = "#0a0a0f";
  ctx.font = "700 22px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("BOOK NOW — UNIVERSALJETS.COM", W / 2, ctaY + 44);

  // ── Footer ──
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "300 18px 'Inter', 'Helvetica Neue', sans-serif";
  ctx.fillText("Private Aviation • Since 2006 • Dubai • London", W / 2, H - 120);

  // Bottom gold line
  const bGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
  bGrad.addColorStop(0, "rgba(196,160,56,0)");
  bGrad.addColorStop(0.5, "rgba(196,160,56,0.3)");
  bGrad.addColorStop(1, "rgba(196,160,56,0)");
  ctx.strokeStyle = bGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, H - 60);
  ctx.lineTo(W - 100, H - 60);
  ctx.stroke();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
      1
    );
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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
