import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

/* ── 3D extruded text letter ── */
const GoldLetter = ({
  char,
  position,
  fontSize,
  italic = false,
  gold = false,
}: {
  char: string;
  position: [number, number, number];
  fontSize: number;
  italic?: boolean;
  gold?: boolean;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const color = useMemo(
    () => (gold ? new THREE.Color("#c5944a") : new THREE.Color("#e8e0d4")),
    [gold]
  );

  return (
    <mesh ref={ref} position={position} rotation={italic ? [0, 0, -0.04] : undefined}>
      <planeGeometry args={[fontSize * 0.62, fontSize]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={gold ? 0.15 : 0.05}
        metalness={0.95}
        roughness={gold ? 0.25 : 0.35}
        transparent
        opacity={0}
      />
    </mesh>
  );
};

/* ── Main 3D Logo Group ── */
const LogoGroup = () => {
  const groupRef = useRef<THREE.Group>(null);
  const universalRef = useRef<THREE.Group>(null);
  const jetsRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.Mesh>(null);

  const goldColor = useMemo(() => new THREE.Color("#c5944a"), []);
  const goldLight = useMemo(() => new THREE.Color("#dbb978"), []);
  const textWhite = useMemo(() => new THREE.Color("#e8e0d4"), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Very slow breathing / floating
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.03;
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.012;
      groupRef.current.rotation.x = Math.cos(t * 0.2) * 0.005;
    }

    // Gold line shimmer
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.08}>
      <group ref={groupRef}>
        {/* Top gold accent line */}
        <mesh ref={lineRef} position={[0, 1.1, 0]}>
          <boxGeometry args={[0.008, 0.5, 0.008]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.1}
          />
        </mesh>

        {/* UNIVERSAL — brushed metal text */}
        <group ref={universalRef} position={[0, 0.35, 0]}>
          {"UNIVERSAL".split("").map((char, i) => {
            const spacing = 0.38;
            const totalWidth = 8 * spacing;
            const x = i * spacing - totalWidth / 2;
            return (
              <mesh key={`u-${i}`} position={[x, 0, 0]}>
                <planeGeometry args={[0.3, 0.4]} />
                <meshStandardMaterial
                  color={textWhite}
                  emissive={textWhite}
                  emissiveIntensity={0.03}
                  metalness={0.92}
                  roughness={0.32}
                  transparent
                  opacity={0.95}
                />
              </mesh>
            );
          })}
        </group>

        {/* JETS — gold metallic text */}
        <group ref={jetsRef} position={[0, -0.15, 0.02]}>
          {"JETS".split("").map((char, i) => {
            const spacing = 0.48;
            const totalWidth = 3 * spacing;
            const x = i * spacing - totalWidth / 2;
            return (
              <mesh key={`j-${i}`} position={[x, 0, 0]} rotation={[0, 0, -0.03]}>
                <planeGeometry args={[0.38, 0.5]} />
                <meshStandardMaterial
                  color={goldLight}
                  emissive={goldColor}
                  emissiveIntensity={0.12}
                  metalness={0.98}
                  roughness={0.2}
                  transparent
                  opacity={0.95}
                />
              </mesh>
            );
          })}
        </group>

        {/* Tagline bar */}
        <mesh position={[0, -0.62, 0]}>
          <planeGeometry args={[1.8, 0.001]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={0.3}
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* Ambient glow sphere behind logo */}
        <mesh position={[0, 0.1, -0.5]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={0.04}
            transparent
            opacity={0.03}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Floating accent particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <FloatingParticle key={i} index={i} color={goldColor} />
        ))}
      </group>
    </Float>
  );
};

/* ── Floating metallic particles ── */
const FloatingParticle = ({ index, color }: { index: number; color: THREE.Color }) => {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / 8) * Math.PI * 2;
  const radius = 1.6 + (index % 3) * 0.3;
  const speed = 0.15 + (index % 4) * 0.05;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.cos(angle + t * speed) * radius;
      ref.current.position.y = Math.sin(t * 0.3 + index * 0.8) * 0.4;
      ref.current.position.z = Math.sin(angle + t * speed) * radius * 0.3;
      ref.current.scale.setScalar(0.4 + Math.sin(t * 1.2 + index) * 0.2);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.012, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

/* ── Exported component ── */
interface Logo3DProps {
  size?: number;
  className?: string;
  opacity?: number;
}

const Logo3D = ({ size = 400, className = "", opacity = 1 }: Logo3DProps) => {
  return (
    <div className={className} style={{ width: size, height: size, opacity }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
        <directionalLight position={[-3, 2, 4]} intensity={0.3} color="#c5944a" />
        <pointLight position={[0, 0, 3]} intensity={0.2} color="#dbb978" />
        <spotLight
          position={[2, 3, 4]}
          intensity={0.4}
          angle={0.4}
          penumbra={1}
          color="#ffffff"
        />
        <LogoGroup />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Logo3D;
