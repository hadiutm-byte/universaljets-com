import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  fadeDir: number;
}

const GOLD_HSL = "43, 85%, 58%";

interface Props {
  className?: string;
  particleCount?: number;
  maxSize?: number;
  speed?: number;
}

const GoldParticles = ({ className = "", particleCount = 45, maxSize = 2.5, speed = 0.25 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    particles.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * speed * 1.2,
      vy: -Math.random() * speed - 0.05,
      size: Math.random() * maxSize + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());

      for (const p of particles.current) {
        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.fadeDir * 0.003;

        if (p.opacity >= 0.6) p.fadeDir = -1;
        if (p.opacity <= 0.05) p.fadeDir = 1;

        // Wrap
        if (p.y < -5) { p.y = h() + 5; p.x = Math.random() * w(); }
        if (p.x < -5) p.x = w() + 5;
        if (p.x > w() + 5) p.x = -5;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${GOLD_HSL}, ${p.opacity})`;
        ctx.shadowColor = `hsla(${GOLD_HSL}, ${p.opacity * 0.6})`;
        ctx.shadowBlur = p.size * 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default GoldParticles;
