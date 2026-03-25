import { useEffect, useMemo, useState } from "react";
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
  const [blink, setBlink] = useState(false);
  const [gesture, setGesture] = useState(false);

  useEffect(() => {
    const blinkInterval = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 180);
    }, 4800);

    return () => window.clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (pose !== "idle") return;

    const gestureInterval = window.setInterval(() => {
      setGesture(true);
      window.setTimeout(() => setGesture(false), 1200);
    }, 9500);

    return () => window.clearInterval(gestureInterval);
  }, [pose]);

  const displayPose = useMemo<RickyPose>(() => {
    if (pose === "idle" && gesture) return "wave";
    return pose;
  }, [gesture, pose]);

  const src = poseImages[displayPose] || rickyIdle;

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Subtle shadow beneath */}
      <motion.div
        className="absolute bottom-[7%] left-1/2 -translate-x-1/2 rounded-full bg-foreground/10 blur-xl"
        style={{ width: size * 0.4, height: size * 0.06 }}
        animate={{ scaleX: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ricky with breathing + idle bob + subtle sway */}
      <motion.div
        className="h-full w-full"
        animate={{
          y: [0, -7, 0, -4, 0],
          x: [0, 1.5, 0, -1.5, 0],
          rotateZ: [-0.8, 0.9, -0.5, 0.6, -0.8],
        }}
        transition={{
          y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 6.2, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 6.8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="h-full w-full"
          animate={blink ? { scaleY: [1, 0.94, 1.02, 1] } : { scaleY: 1 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
        >
          <motion.img
            src={src}
            alt="Ricky — Universal Jets Aviation Advisor"
            className="h-full w-full object-contain drop-shadow-xl"
            draggable={false}
            animate={
              speaking
                ? { scale: [1, 1.03, 1, 1.02, 1], rotate: [0, 0.8, 0, -0.6, 0] }
                : gesture
                  ? { scale: [1, 1.02, 1], rotate: [0, 1.2, 0] }
                  : { scale: 1 }
            }
            transition={
              speaking
                ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                : gesture
                  ? { duration: 0.9, ease: "easeInOut" }
                  : { duration: 0.2 }
            }
          />
        </motion.div>
      </motion.div>

      {/* Speaking indicator glow */}
      {speaking && (
        <motion.div
          className="ricky-speaking-glow absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 0.12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default RickyAvatar;
