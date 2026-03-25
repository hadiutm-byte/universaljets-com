import { motion } from "framer-motion";
import rickyIdle from "@/assets/ricky-idle.png";
import rickyBye from "@/assets/ricky-bye.png";
import rickyThumbsup from "@/assets/ricky-thumbsup.png";
import rickyThinking from "@/assets/ricky-thinking.png";
import rickyDancing from "@/assets/ricky-dancing.png";

export type RickyPose = "idle" | "wave" | "thumbsup" | "thinking" | "dancing";

const poseImages: Record<RickyPose, string> = {
  idle: rickyIdle,
  wave: rickyBye,
  thumbsup: rickyThumbsup,
  thinking: rickyThinking,
  dancing: rickyDancing,
};

interface RickyAvatarProps {
  speaking?: boolean;
  size?: number;
  className?: string;
  pose?: RickyPose;
}

const RickyAvatar = ({
  speaking = false,
  size = 200,
  className = "",
  pose = "idle",
}: RickyAvatarProps) => {
  const src = poseImages[pose] || rickyIdle;

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Subtle shadow beneath */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-foreground/5 blur-md"
        style={{ width: size * 0.5, height: size * 0.08 }}
      />

      {/* Ricky image */}
      <motion.img
        src={src}
        alt="Ricky — Universal Jets Aviation Advisor"
        className="w-full h-full object-contain drop-shadow-lg"
        draggable={false}
        animate={speaking ? { scale: [1, 1.02, 1] } : {}}
        transition={speaking ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : {}}
      />

      {/* Speaking indicator glow */}
      {speaking && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            background: "radial-gradient(circle, hsla(38,52%,50%,0.2) 0%, transparent 70%)",
          }}
        />
      )}
    </motion.div>
  );
};

export default RickyAvatar;
