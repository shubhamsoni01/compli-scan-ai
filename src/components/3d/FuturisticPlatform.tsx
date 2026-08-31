import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FuturisticPlatformProps {
  isScanning?: boolean;
}

export const FuturisticPlatform: React.FC<FuturisticPlatformProps> = ({ isScanning = false }) => {
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (ringsRef.current) {
      // Very slow, smooth counter-rotations for multi-layer holographic scanning rings
      ringsRef.current.children[0].rotation.z = t * 0.18;
      ringsRef.current.children[1].rotation.z = -t * 0.24;
      ringsRef.current.children[2].rotation.z = t * 0.32;
    }

    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.2;
    }

    if (beamRef.current) {
      // Gentle vertical scanner sweep when scanning or slow scanning wave
      const sweep = Math.sin(t * (isScanning ? 2.5 : 1.2)) * 1.35 + 1.35;
      beamRef.current.position.y = sweep;
      const beamMat = beamRef.current.material as THREE.MeshBasicMaterial;
      beamMat.opacity = isScanning ? 0.35 + Math.sin(t * 8) * 0.1 : 0.18 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* Heavy Base Pedestal */}
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.7, 0.28, 64]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.45}
          metalness={0.65}
        />
      </mesh>

      {/* Outer Metallic Bezel Ring */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[2.42, 2.48, 0.08, 64]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Glowing Inner Glass Platform Disc */}
      <mesh ref={coreRef} position={[0, -0.01, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.2, 0.05, 64]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#6366f1"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Target Crosshair Pattern On Base Plate */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.24, 48]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.63, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Three Floating Holographic Scanning Rings */}
      <group ref={ringsRef} position={[0, 1.25, 0]}>
        {/* Ring 1 - Low Horizon Ring */}
        <mesh rotation={[Math.PI / 2 + 0.1, 0.05, 0]} position={[0, -0.6, 0]}>
          <torusGeometry args={[2.1, 0.014, 16, 96]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
        </mesh>

        {/* Ring 2 - Mid Waist Scanner Ring */}
        <mesh rotation={[Math.PI / 2 - 0.08, 0.02, 0]} position={[0, 0.1, 0]}>
          <torusGeometry args={[2.25, 0.016, 16, 96]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
        </mesh>

        {/* Ring 3 - Upper Halo Ring */}
        <mesh rotation={[Math.PI / 2 + 0.05, -0.04, 0]} position={[0, 0.75, 0]}>
          <torusGeometry args={[2.0, 0.012, 16, 96]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.45} />
        </mesh>
      </group>

      {/* Vertical Holographic Scanning Beam Plane */}
      <mesh ref={beamRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.2, 0]}>
        <planeGeometry args={[2.8, 2.8]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
