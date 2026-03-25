import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

type ThemePalette = {
  primary: string;
  foreground: string;
  card: string;
  charcoal: string;
  charcoalSoft: string;
};

interface RickyThreeAvatarProps {
  speaking?: boolean;
  size?: number;
  compact?: boolean;
  className?: string;
}

const fallbackPalette: ThemePalette = {
  primary: "hsl(45 79% 46%)",
  foreground: "hsl(0 0% 7%)",
  card: "hsl(0 0% 100%)",
  charcoal: "hsl(0 0% 10%)",
  charcoalSoft: "hsl(0 0% 16%)",
};

const useThemePalette = () => {
  const [palette, setPalette] = useState<ThemePalette>(fallbackPalette);

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) => {
      const value = styles.getPropertyValue(name).trim();
      return value ? `hsl(${value})` : fallback;
    };

    setPalette({
      primary: read("--primary", fallbackPalette.primary),
      foreground: read("--foreground", fallbackPalette.foreground),
      card: read("--card", fallbackPalette.card),
      charcoal: read("--charcoal", fallbackPalette.charcoal),
      charcoalSoft: read("--charcoal-deep", fallbackPalette.charcoalSoft),
    });
  }, []);

  return palette;
};

const RickyFigure = ({
  speaking = false,
  compact = false,
  palette,
}: {
  speaking?: boolean;
  compact?: boolean;
  palette: ThemePalette;
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const glassesRef = useRef<THREE.Group>(null);
  const bowTieRef = useRef<THREE.Group>(null);
  const badgeRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const breathe = Math.sin(t * 1.65) * (compact ? 0.03 : 0.06);
    const speechPulse = speaking ? Math.sin(t * 5.6) * 0.03 : 0;

    if (rootRef.current) {
      rootRef.current.position.y = THREE.MathUtils.lerp(
        rootRef.current.position.y,
        breathe + speechPulse,
        0.12,
      );
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        pointer.x * 0.35,
        0.08,
      );
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        -0.05 - pointer.y * 0.12,
        0.08,
      );
      rootRef.current.rotation.z = THREE.MathUtils.lerp(
        rootRef.current.rotation.z,
        Math.sin(t * 0.65) * 0.02,
        0.08,
      );
    }

    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        pointer.x * 0.18 + Math.sin(t * 0.9) * 0.08,
        0.1,
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        pointer.y * -0.08 + Math.cos(t * 1.2) * 0.025,
        0.1,
      );
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.65 + Math.sin(t * 1.4) * 0.08 + speechPulse * 0.8;
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.62 + Math.cos(t * 1.55) * 0.09 - speechPulse * 1.2;
      rightArmRef.current.rotation.x = speaking ? Math.sin(t * 4.2) * 0.08 : 0;
    }

    if (glassesRef.current) {
      glassesRef.current.rotation.z = Math.sin(t * 0.75) * 0.015;
      glassesRef.current.position.y = 0.06 + Math.sin(t * 1.15) * 0.01;
    }

    if (bowTieRef.current) {
      bowTieRef.current.rotation.y = Math.sin(t * 2.1) * 0.12;
      bowTieRef.current.scale.setScalar(1 + speechPulse * 0.8);
    }

    if (badgeRef.current) {
      badgeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={1.05} floatIntensity={0.22} rotationIntensity={0.08}>
      <group ref={rootRef} position={[0, -0.2, 0]} scale={compact ? 0.86 : 1.08}>
        <Sparkles
          count={compact ? 12 : 18}
          scale={[3.2, 4.2, 2.6]}
          size={compact ? 1.8 : 2.6}
          speed={0.45}
          opacity={0.3}
          color={palette.primary}
        />

        <mesh position={[0, -1.98, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.08, 64]} />
          <meshBasicMaterial color={palette.foreground} transparent opacity={0.14} />
        </mesh>

        <mesh position={[0, 0.08, -1.2]}>
          <sphereGeometry args={[1.45, 32, 32]} />
          <meshBasicMaterial color={palette.primary} transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        <mesh position={[0, 0.18, -0.9]} rotation={[0.28, 0, 0]}>
          <torusGeometry args={[1.22, 0.03, 16, 100]} />
          <meshStandardMaterial
            color={palette.primary}
            emissive={palette.primary}
            emissiveIntensity={0.45}
            metalness={0.9}
            roughness={0.18}
            transparent
            opacity={0.42}
          />
        </mesh>

        <group ref={leftArmRef} position={[-0.95, -0.34, 0.06]} rotation={[0.08, 0, 0.65]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.14, 0.86, 10, 18]} />
            <meshStandardMaterial color={palette.charcoal} metalness={0.42} roughness={0.58} />
          </mesh>
          <mesh position={[0, -0.58, 0.02]} castShadow>
            <sphereGeometry args={[0.15, 20, 20]} />
            <meshStandardMaterial color="hsl(28 34% 36%)" roughness={0.82} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.95, -0.38, 0.12]} rotation={[0.1, 0.1, -0.62]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.14, 0.92, 10, 18]} />
            <meshStandardMaterial color={palette.charcoal} metalness={0.42} roughness={0.58} />
          </mesh>
          <mesh position={[0, -0.62, 0.02]} castShadow>
            <sphereGeometry args={[0.15, 20, 20]} />
            <meshStandardMaterial color="hsl(28 34% 36%)" roughness={0.82} />
          </mesh>
        </group>

        <mesh position={[0, -0.62, 0]} castShadow>
          <capsuleGeometry args={[0.62, 1.28, 10, 24]} />
          <meshStandardMaterial color={palette.charcoal} metalness={0.5} roughness={0.52} />
        </mesh>

        <mesh position={[0, -0.34, 0.52]} castShadow>
          <capsuleGeometry args={[0.22, 0.64, 8, 16]} />
          <meshStandardMaterial color={palette.card} metalness={0.14} roughness={0.36} />
        </mesh>

        <group ref={bowTieRef} position={[0, -0.1, 0.76]}>
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0.35]} castShadow>
            <coneGeometry args={[0.14, 0.22, 4]} />
            <meshStandardMaterial color={palette.primary} metalness={0.88} roughness={0.24} />
          </mesh>
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, -0.35]} castShadow>
            <coneGeometry args={[0.14, 0.22, 4]} />
            <meshStandardMaterial color={palette.primary} metalness={0.88} roughness={0.24} />
          </mesh>
          <mesh castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color={palette.primary} metalness={0.88} roughness={0.2} />
          </mesh>
        </group>

        <mesh position={[0, -0.74, 0.68]} rotation={[0.85, 0, 0]}>
          <planeGeometry args={[0.95, 0.7]} />
          <meshStandardMaterial color={palette.charcoalSoft} transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>

        <group ref={headRef} position={[0, 0.92, 0.18]}>
          <mesh castShadow>
            <sphereGeometry args={[0.78, 32, 32]} />
            <meshStandardMaterial color="hsl(28 36% 34%)" roughness={0.9} />
          </mesh>

          <mesh position={[-0.55, 0.4, -0.08]} castShadow>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="hsl(25 32% 28%)" roughness={0.88} />
          </mesh>
          <mesh position={[0.55, 0.4, -0.08]} castShadow>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="hsl(25 32% 28%)" roughness={0.88} />
          </mesh>

          <mesh position={[0, -0.05, 0.5]} castShadow>
            <sphereGeometry args={[0.42, 26, 26]} />
            <meshStandardMaterial color="hsl(30 42% 60%)" roughness={0.82} />
          </mesh>

          <mesh position={[0, -0.08, 0.88]} castShadow>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color={palette.foreground} roughness={0.5} />
          </mesh>

          <group ref={glassesRef} position={[0, 0.06, 0.62]}>
            <mesh position={[-0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.34, 0.2, 0.06]} />
              <meshPhysicalMaterial color={palette.foreground} transmission={0.08} roughness={0.08} metalness={0.95} />
            </mesh>
            <mesh position={[0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.34, 0.2, 0.06]} />
              <meshPhysicalMaterial color={palette.foreground} transmission={0.08} roughness={0.08} metalness={0.95} />
            </mesh>
            <mesh position={[0, 0, 0.01]} castShadow>
              <boxGeometry args={[0.1, 0.04, 0.03]} />
              <meshStandardMaterial color={palette.foreground} metalness={0.95} roughness={0.1} />
            </mesh>
          </group>

          <group position={[0, 0.74, 0.06]}>
            <mesh position={[0, -0.08, 0]} castShadow>
              <cylinderGeometry args={[0.72, 0.86, 0.08, 48]} />
              <meshStandardMaterial color={palette.charcoal} metalness={0.66} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.54, 0.56, 0.5, 48]} />
              <meshStandardMaterial color={palette.charcoalSoft} metalness={0.56} roughness={0.42} />
            </mesh>
            <mesh position={[0, 0.04, 0.56]} castShadow>
              <torusGeometry args={[0.57, 0.035, 12, 64]} />
              <meshStandardMaterial color={palette.primary} emissive={palette.primary} emissiveIntensity={0.2} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>

        <mesh ref={badgeRef} position={[0.48, -0.32, 0.78]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.03, 24]} />
          <meshStandardMaterial color={palette.primary} emissive={palette.primary} emissiveIntensity={0.22} metalness={0.9} roughness={0.18} />
        </mesh>
      </group>
    </Float>
  );
};

const RickyThreeAvatar = ({
  speaking = false,
  size = 360,
  compact = false,
  className = "",
}: RickyThreeAvatarProps) => {
  const palette = useThemePalette();

  return (
    <div className={className} style={{ width: size, height: size }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.2, 5.2], fov: compact ? 32 : 28 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1.5} />
        <hemisphereLight intensity={0.85} color={palette.card} groundColor={palette.charcoal} />
        <directionalLight position={[4, 5, 4]} intensity={1.4} color={palette.card} castShadow />
        <directionalLight position={[-4, 2, 5]} intensity={0.8} color={palette.primary} />
        <pointLight position={[0, 1.5, 3]} intensity={0.75} color={palette.primary} />
        <RickyFigure speaking={speaking} compact={compact} palette={palette} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default RickyThreeAvatar;