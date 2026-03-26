import { ReactNode, useRef, forwardRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ─── Parallax Section ─── */
interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  id?: string;
}

export const ParallaxSection = ({ children, className = "", speed = 0.15, id }: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <div ref={ref} id={id} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};

/* ─── Fade + Slide Reveal ─── */
interface FadeRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const FadeReveal = forwardRef<HTMLDivElement, FadeRevealProps>(
  ({ children, className = "", delay = 0, direction = "up" }, ref) => {
    const dirMap = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { x: 50, y: 0 },
      right: { x: -50, y: 0 },
    };
    const { x, y } = dirMap[direction];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x, y }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);
FadeReveal.displayName = "FadeReveal";

/* ─── Staggered Children Container ─── */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, className = "", stagger = 0.08, delay = 0 }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
);
StaggerContainer.displayName = "StaggerContainer";

/* ─── Stagger Item (child) ─── */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, className = "" }, ref) => (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 35, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
);
StaggerItem.displayName = "StaggerItem";

/* ─── Glass Card with breathing float ─── */
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  breathe?: boolean;
}

export const GlassCard = ({ children, className = "", hover = true, glow = false, breathe = false }: GlassCardProps) => (
  <motion.div
    whileHover={hover ? { y: -6, scale: 1.015 } : undefined}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={`
      glass-panel rounded-2xl
      ${glow ? "glow-gold-soft" : ""}
      ${hover ? "cursor-pointer" : ""}
      ${className}
    `}
  >
    {breathe ? (
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    ) : (
      children
    )}
  </motion.div>
);

/* ─── Floating Element ─── */
interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  speed?: number;
}

export const FloatingElement = ({ children, className = "", amplitude = 8, speed = 4 }: FloatingElementProps) => (
  <motion.div
    animate={{
      y: [-amplitude, amplitude, -amplitude],
      rotateZ: [-0.5, 0.5, -0.5],
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

/* ─── Scale Reveal (zoom in from smaller) ─── */
interface ScaleRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ScaleReveal = ({ children, className = "", delay = 0 }: ScaleRevealProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── Horizontal Slide Reveal ─── */
interface SlideRevealProps {
  children: ReactNode;
  className?: string;
  from?: "left" | "right";
  delay?: number;
}

export const SlideReveal = ({ children, className = "", from = "left", delay = 0 }: SlideRevealProps) => (
  <motion.div
    initial={{ opacity: 0, x: from === "left" ? -80 : 80 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default ParallaxSection;
