import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

/** Animated 3D "Ricky" orb — a luxury futuristic avatar */

const RickyCore = ({ speaking }: { speaking: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  const goldColor = useMemo(() => new THREE.Color("#c5944a"), []);
  const darkGold = useMemo(() => new THREE.Color("#8a6830"), []);
  const coreColor = useMemo(() => new THREE.Color("#1a1a2e"), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.6;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.4) * 0.15;
      const pulse = speaking ? 1.15 + Math.sin(t * 8) * 0.08 : 1.05 + Math.sin(t * 1.5) * 0.03;
      ringRef.current.scale.setScalar(pulse);
    }

    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.5;
      innerRef.current.rotation.z = Math.cos(t * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Core sphere — dark luxury center */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.6, 64, 64]} />
          <MeshDistortMaterial
            color={coreColor}
            roughness={0.15}
            metalness={0.9}
            distort={speaking ? 0.25 : 0.12}
            speed={speaking ? 4 : 2}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh ref={innerRef} scale={0.55}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={speaking ? 1.5 : 0.6}
            transparent
            opacity={0.25}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Orbital ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[0.9, 0.015, 16, 100]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0.1}
          />
        </mesh>

        {/* Second ring — counter-rotating */}
        <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
          <torusGeometry args={[1.05, 0.008, 16, 100]} />
          <meshStandardMaterial
            color={darkGold}
            emissive={darkGold}
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
            metalness={1}
            roughness={0.2}
          />
        </mesh>

        {/* Ambient particles — small floating dots */}
        {Array.from({ length: 12 }).map((_, i) => (
          <ParticleDot key={i} index={i} color={goldColor} />
        ))}
      </group>
    </Float>
  );
};

const ParticleDot = ({ index, color }: { index: number; color: THREE.Color }) => {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / 12) * Math.PI * 2;
  const radius = 1.2 + (index % 3) * 0.2;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.cos(angle + t * 0.3) * radius;
      ref.current.position.y = Math.sin(t * 0.5 + index) * 0.3;
      ref.current.position.z = Math.sin(angle + t * 0.3) * radius;
      ref.current.scale.setScalar(0.5 + Math.sin(t * 2 + index) * 0.3);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

interface RickyAvatarProps {
  speaking?: boolean;
  size?: number;
  className?: string;
}

const RickyAvatar = ({ speaking = false, size = 200, className = "" }: RickyAvatarProps) => {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#c5944a" />
        <pointLight position={[-3, -2, 4]} intensity={0.4} color="#ffffff" />
        <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.5} penumbra={1} color="#c5944a" />
        <RickyCore speaking={speaking} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default RickyAvatar;
