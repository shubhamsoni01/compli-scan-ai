import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldCheck, CheckCircle2, Award, Sparkles, Scan } from 'lucide-react';
import { useProductPackageTexture, type ProductType } from './useProductPackageTexture';

interface PackagedProductProps {
  isScanning?: boolean;
  productType?: ProductType;
}

export const PackagedProduct: React.FC<PackagedProductProps> = ({ 
  isScanning = false,
  productType = 'food'
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const laserRef = useRef<THREE.Mesh>(null);
  const laserGlowRef = useRef<THREE.PointLight>(null);
  const texture = useProductPackageTexture(productType);

  // Dynamic HUD Badges by Product Category
  const hudData = {
    food: {
      mrp: 'MRP ₹99.00 ✓',
      qty: 'Net Qty: 200g ✓',
      cert: 'FSSAI Veg Verified ✓',
      score: 'Compliance 96%',
      badgeColor: 'emerald',
    },
    cosmetics: {
      mrp: 'MRP ₹499.00 ✓',
      qty: 'Net Vol: 100ml ✓',
      cert: 'CDSCO / Dermo Safe ✓',
      score: 'Compliance 94%',
      badgeColor: 'pink',
    },
    oil: {
      mrp: 'MRP ₹175.00 ✓',
      qty: 'Dual Dec: 1L (910g) ✓',
      cert: 'Agmark Grade-1 ✓',
      score: 'Compliance 98%',
      badgeColor: 'amber',
    },
  }[productType];

  // Realistic floating, oscillation, and laser scan loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = 1.35 + Math.sin(t * 0.9) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.45) * 0.22;
      groupRef.current.rotation.x = Math.cos(t * 0.6) * 0.02;
      groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.015;
    }

    // Continuous AI Laser Scanning Beam (up & down)
    if (laserRef.current) {
      const laserY = Math.sin(t * 1.6) * 1.25;
      laserRef.current.position.y = laserY;
      if (laserGlowRef.current) {
        laserGlowRef.current.position.y = laserY;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.35, 0]}>
      {/* 
        Main Pouch / Container Geometry:
        Foil sheen, soft bevel edges and dynamic metallic response
      */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.88, 2.7, 0.65, 16, 16, 8]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={texture ? '#ffffff' : '#450a0a'}
          roughness={0.25}
          metalness={0.28}
        />
      </mesh>

      {/* Top Heat-Sealed Crimp Strip */}
      <mesh position={[0, 1.40, 0]} castShadow>
        <boxGeometry args={[1.96, 0.15, 0.14]} />
        <meshStandardMaterial 
          color={productType === 'food' ? '#450a0a' : productType === 'cosmetics' ? '#022c22' : '#451a03'} 
          metalness={0.5} 
          roughness={0.25} 
        />
      </mesh>

      {/* Bottom Gusset Heat-Seal Strip */}
      <mesh position={[0, -1.40, 0]} castShadow>
        <boxGeometry args={[1.96, 0.15, 0.14]} />
        <meshStandardMaterial 
          color={productType === 'food' ? '#450a0a' : productType === 'cosmetics' ? '#022c22' : '#451a03'} 
          metalness={0.5} 
          roughness={0.25} 
        />
      </mesh>

      {/* Sombrero hanging punch slot */}
      <mesh position={[0, 1.40, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
        <meshBasicMaterial color="#020617" />
      </mesh>

      {/* 
        -------------------------------------------------------------
        CYBER AI LASER SCANNING BEAM & GLOW
        -------------------------------------------------------------
      */}
      <mesh ref={laserRef} position={[0, 0, 0.36]}>
        <planeGeometry args={[2.3, 0.04]} />
        <meshBasicMaterial 
          color="#34d399" 
          transparent 
          opacity={0.85} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      <pointLight 
        ref={laserGlowRef} 
        position={[0, 0, 0.6]} 
        color="#10b981" 
        intensity={1.2} 
        distance={2.5} 
      />

      {/* Soft holographic back-glow plane */}
      <mesh position={[0, 0.1, -0.6]}>
        <planeGeometry args={[2.6, 3.3]} />
        <meshPhysicalMaterial
          color={productType === 'food' ? '#f59e0b' : productType === 'cosmetics' ? '#10b981' : '#f59e0b'}
          transparent
          opacity={0.14}
          roughness={0.1}
          transmission={0.7}
          thickness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 
        -------------------------------------------------------------
        DYNAMIC FLOATING COMPLIANCE HUD CALLOUTS
        -------------------------------------------------------------
      */}
      {/* HUD 1: Top-Left (MRP) */}
      <Html
        position={[-1.28, 0.85, 0.35]}
        center
        distanceFactor={6}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 whitespace-nowrap animate-pulse">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{hudData.mrp}</span>
        </div>
      </Html>

      {/* HUD 2: Top-Right (Net Quantity) */}
      <Html
        position={[1.28, 0.5, 0.35]}
        center
        distanceFactor={6}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-cyan-500/40 text-[11px] font-semibold text-cyan-300 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{hudData.qty}</span>
        </div>
      </Html>

      {/* HUD 3: Bottom-Left (Authority / Standard Certification) */}
      <Html
        position={[-1.32, -0.35, 0.35]}
        center
        distanceFactor={6}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-amber-500/40 text-[11px] font-semibold text-amber-300 whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>{hudData.cert}</span>
        </div>
      </Html>

      {/* HUD 4: Bottom-Right (Statutory Score Pill) */}
      <Html
        position={[1.32, -0.7, 0.35]}
        center
        distanceFactor={6}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-cyan-950/90 backdrop-blur-md shadow-2xl border border-emerald-400/50 text-xs font-extrabold text-emerald-300 whitespace-nowrap">
          <Award className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>{hudData.score}</span>
        </div>
      </Html>
    </group>
  );
};

export default PackagedProduct;
