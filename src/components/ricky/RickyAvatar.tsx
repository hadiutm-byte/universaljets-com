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
    >
      {/* Subtle shadow beneath */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-foreground/5 blur-md"
        style={{ width: size * 0.4, height: size * 0.06 }}
        animate={{ scaleX: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ricky with breathing + idle bob + subtle sway */}
      <motion.div
        className="w-full h-full"
        animate={{
          y: [0, -4, 0],
          scaleY: [1, 1.008, 1, 0.995, 1],
          rotateZ: [-0.3, 0.3, -0.3],
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scaleY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.img
          src={src}
          alt="Ricky — Universal Jets Aviation Advisor"
          className="w-full h-full object-contain drop-shadow-lg"
          draggable={false}
          animate={
            speaking
              ? { scale: [1, 1.02, 1, 1.015, 1] }
              : {}
          }
          transition={
            speaking
              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
        />
      </motion.div>

      {/* Speaking indicator glow */}
      {speaking && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ opacity: [0, 0.12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            background:
              "radial-gradient(circle, hsla(38,52%,50%,0.15) 0%, transparent 70%)",
          }}
        />
      )}
    </motion.div>
  );
};

export default RickyAvatar;
