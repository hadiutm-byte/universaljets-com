import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  id?: string;
}

/** Wraps a section with parallax scrolling effect */
export const ParallaxSection = ({ children, className = "", speed = 0.15, id }: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <div ref={ref} id={id} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

interface FadeRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

/** Fade + slide reveal on scroll */
export const FadeReveal = ({ children, className = "", delay = 0, direction = "up" }: FadeRevealProps) => {
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  const { x, y } = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

/** Premium glassmorphism card */
export const GlassCard = ({ children, className = "", hover = true, glow = false }: GlassCardProps) => (
  <motion.div
    whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`
      glass-panel rounded-2xl
      ${glow ? "glow-gold-soft" : ""}
      ${hover ? "cursor-pointer" : ""}
      ${className}
    `}
  >
    {children}
  </motion.div>
);

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  speed?: number;
}

/** Gently floating element */
export const FloatingElement = ({ children, className = "", amplitude = 10, speed = 3 }: FloatingElementProps) => (
  <motion.div
    animate={{
      y: [-amplitude, amplitude, -amplitude],
      rotateZ: [-1, 1, -1],
    }}
    transition={{
      duration: speed,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default ParallaxSection;
