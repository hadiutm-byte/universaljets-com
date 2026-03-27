import { motion } from "framer-motion";
import rickyIdle from "@/assets/ricky-idle.png";
import rickyThinking from "@/assets/ricky-thinking.png";

interface RickyAnimatedAvatarProps {
  speaking?: boolean;
  size?: number;
  compact?: boolean;
  className?: string;
}

const RickyAnimatedAvatar = ({
  speaking = false,
  size = 64,
  compact = false,
  className = "",
}: RickyAnimatedAvatarProps) => {
  const img = speaking ? rickyThinking : rickyIdle;

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: speaking ? [0, -3, 0, -2, 0] : [0, -4, 0],
        rotate: speaking ? [0, -2, 2, -1, 0] : [0, 1, 0, -1, 0],
      }}
      transition={{
        duration: speaking ? 0.8 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Glow ring behind the monkey */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(43,85%,58%,0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: speaking ? [1, 1.2, 1] : [1, 1.08, 1],
          opacity: speaking ? [0.4, 0.7, 0.4] : [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: speaking ? 0.6 : 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* The monkey image */}
      <motion.img
        src={img}
        alt="Ricky — Aviation Concierge"
        className="w-full h-full object-contain drop-shadow-lg"
        style={{ filter: "drop-shadow(0 4px 12px hsla(43,85%,58%,0.2))" }}
        animate={{
          scale: speaking ? [1, 1.04, 1, 1.03, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: speaking ? 0.6 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sparkle dots when speaking */}
      {speaking && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/60"
              style={{
                top: `${15 + i * 20}%`,
                left: i % 2 === 0 ? "-8%" : "100%",
              }}
              animate={{
                y: [-4, 4, -4],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};

export default RickyAnimatedAvatar;
