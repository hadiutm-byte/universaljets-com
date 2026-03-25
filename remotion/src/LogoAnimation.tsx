import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: displayFont } = loadFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

// Brand colors
const BG_DARK = "#0d1117";
const GOLD = "#c5944a";
const GOLD_LIGHT = "#dbb978";
const TEXT_WHITE = "rgba(255,255,255,0.92)";
const TEXT_DIM = "rgba(255,255,255,0.15)";

export const LogoAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Fade in background gradient (frames 0–20)
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Phase 2: Gold line draws down (frames 10–35)
  const lineScale = spring({ frame: frame - 10, fps, config: { damping: 30, stiffness: 80 } });

  // Phase 3: "UNIVERSAL" fades in (frames 20–40)
  const universalOpacity = interpolate(frame, [20, 38], [0, 1], { extrapolateRight: "clamp" });
  const universalY = interpolate(frame, [20, 38], [12, 0], { extrapolateRight: "clamp" });

  // Phase 4: "JETS" fades in with gold (frames 28–48)
  const jetsOpacity = interpolate(frame, [28, 46], [0, 1], { extrapolateRight: "clamp" });
  const jetsY = interpolate(frame, [28, 46], [12, 0], { extrapolateRight: "clamp" });

  // Phase 5: Tagline (frames 40–60)
  const tagOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });

  // Light sweep across the entire logo area (frames 30–65)
  const sweepX = interpolate(frame, [30, 65], [-600, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweepOpacity = interpolate(frame, [30, 35, 60, 65], [0, 0.35, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle shimmer on letters (continuous after frame 40)
  const shimmerPhase = (frame - 40) * 0.08;
  const shimmerIntensity = interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gentle ambient glow pulse
  const glowPulse = Math.sin(frame * 0.06) * 0.15 + 0.85;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Gradient background */}
      <AbsoluteFill
        style={{
          opacity: bgOpacity,
          background: `radial-gradient(ellipse 80% 60% at 50% 48%, ${BG_DARK} 0%, #060809 100%)`,
        }}
      />

      {/* Subtle ambient gold glow */}
      <AbsoluteFill
        style={{
          opacity: bgOpacity * 0.06 * glowPulse,
          background: `radial-gradient(ellipse 40% 30% at 50% 50%, ${GOLD} 0%, transparent 70%)`,
        }}
      />

      {/* Very subtle noise texture */}
      <AbsoluteFill
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* Logo container */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Gold accent line */}
        <div
          style={{
            width: 1,
            height: 60,
            background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
            transform: `scaleY(${lineScale})`,
            transformOrigin: "top",
            marginBottom: 32,
            opacity: lineScale,
          }}
        />

        {/* Logo text group */}
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* UNIVERSAL */}
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 72,
              fontWeight: 400,
              letterSpacing: "0.45em",
              color: TEXT_WHITE,
              opacity: universalOpacity,
              transform: `translateY(${universalY}px)`,
              textTransform: "uppercase",
            }}
          >
            Universal
          </div>

          {/* JETS */}
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 88,
              fontWeight: 500,
              letterSpacing: "0.35em",
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_LIGHT})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: jetsOpacity,
              transform: `translateY(${jetsY}px)`,
              textTransform: "uppercase",
              fontStyle: "italic",
              marginTop: -8,
            }}
          >
            Jets
          </div>

          {/* Light sweep — a bright band that moves across */}
          <div
            style={{
              position: "absolute",
              top: -20,
              left: 0,
              right: 0,
              bottom: -20,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 180,
                left: `calc(50% + ${sweepX}px)`,
                transform: "translateX(-50%) skewX(-15deg)",
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,${sweepOpacity * 0.5}), rgba(255,255,255,${sweepOpacity}), rgba(255,255,255,${sweepOpacity * 0.5}), transparent)`,
              }}
            />
          </div>

          {/* Secondary metallic shimmer — thinner, subtler */}
          <div
            style={{
              position: "absolute",
              top: -20,
              left: 0,
              right: 0,
              bottom: -20,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 60,
                left: `calc(50% + ${interpolate(frame, [45, 75], [-500, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                transform: "translateX(-50%) skewX(-20deg)",
                background: `linear-gradient(90deg, transparent, rgba(197,148,74,${shimmerIntensity * 0.15}), transparent)`,
              }}
            />
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 28,
            fontFamily: displayFont,
            fontSize: 11,
            letterSpacing: "0.5em",
            color: TEXT_DIM,
            opacity: tagOpacity,
            textTransform: "uppercase",
            fontWeight: 400,
          }}
        >
          Private Aviation Redefined
        </div>

        {/* Bottom gold line */}
        <div
          style={{
            width: 1,
            height: 40,
            background: `linear-gradient(to bottom, transparent, ${GOLD}40, transparent)`,
            transform: `scaleY(${interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            transformOrigin: "top",
            marginTop: 28,
          }}
        />
      </AbsoluteFill>

      {/* Final subtle vignette */}
      <AbsoluteFill
        style={{
          opacity: bgOpacity * 0.7,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
