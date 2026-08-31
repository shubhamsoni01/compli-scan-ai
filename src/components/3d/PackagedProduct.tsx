import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { useProductPackageTexture } from './useProductPackageTexture';

interface PackagedProductProps {
  isScanning?: boolean;
}

export const PackagedProduct: React.FC<PackagedProductProps> = ({ isScanning = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useProductPackageTexture();

  // Subtle realistic idle floating and gentle oscillating yaw
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = 1.35 + Math.sin(t * 0.9) * 0.08;
    // Very gentle rotation: oscillate gently within +/- 15 degrees instead of spinning
    groupRef.current.rotation.y = Math.sin(t * 0.45) * 0.22;
    groupRef.current.rotation.x = Math.cos(t * 0.6) * 0.02;
    groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.015;
  });

  return (
    <group ref={groupRef} position={[0, 1.35, 0]}>
      {/* 
        Main Pouch Body:
        A soft curved pouch geometry crafted via a slightly tapered, rounded box
        with metallic foil properties (subtle roughness, metallic sheen)
      */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        {/* Width: 1.85, Height: 2.65, Depth: 0.65, segments for smooth foil look */}
        <boxGeometry args={[1.85, 2.65, 0.65, 16, 16, 8]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={texture ? '#ffffff' : '#312e81'}
          roughness={0.28}
          metalness={0.22}
        />
      </mesh>

      {/* Top Heat-Sealed Crimp Strip */}
      <mesh position={[0, 1.37, 0]} castShadow>
        <boxGeometry args={[1.92, 0.14, 0.12]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Bottom Gusset Heat-Seal Strip */}
      <mesh position={[0, -1.37, 0]} castShadow>
        <boxGeometry args={[1.92, 0.14, 0.12]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Hanging punch hole slot (Sombrero hole standard for Indian retail shelves) */}
      <mesh position={[0, 1.37, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
        <meshBasicMaterial color="#0a0e1a" />
      </mesh>

      {/* Soft semi-transparent holographic compliance shield backdrop */}
      <mesh position={[0, 0.1, -0.65]}>
        <planeGeometry args={[2.5, 3.2]} />
        <meshPhysicalMaterial
          color="#6366f1"
          transparent
          opacity={0.16}
          roughness={0.1}
          transmission={0.65}
          thickness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 
        Subtle floating compliance HUD callouts anchored precisely to the product:
        - "MRP ✓"
        - "Net Qty ✓"
        - "Manufacturer ✓"
        - "Compliance 92%"
      */}
      <Html
        position={[-1.25, 0.8, 0.35]}
        center
        distanceFactor={6}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-lg border border-emerald-500/30 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap animate-pulse">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>MRP ₹75 ✓</span>
        </div>
      </Html>

      <Html
        position={[1.25, 0.45, 0.35]}
        center
        distanceFactor={6}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-lg border border-indigo-500/30 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Net Qty 150g ✓</span>
        </div>
      </Html>

      <Html
        position={[-1.3, -0.3, 0.35]}
        center
        distanceFactor={6}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-lg border border-indigo-500/30 text-[11px] font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
          <span>Manufacturer ✓</span>
        </div>
      </Html>

      <Html
        position={[1.3, -0.65, 0.35]}
        center
        distanceFactor={6}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-indigo-500/15 to-violet-500/15 dark:bg-slate-900/90 backdrop-blur-md shadow-xl border border-emerald-500/40 text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
          <Award className="w-4 h-4 text-emerald-500" />
          <span>Compliance 92%</span>
        </div>
      </Html>
    </group>
  );
};
