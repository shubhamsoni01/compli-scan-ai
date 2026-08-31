import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';
import { FallbackIllustration } from './FallbackIllustration';

interface ScanningAnimationProps {
  progress: number;
  step: number;
}

const AnimatedProduct = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1.2, 0]} castShadow>
      <boxGeometry args={[1.5, 2, 1.5]} />
      <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
      <mesh position={[0, 0, 0.76]}>
        <planeGeometry args={[1.2, 1.6]} />
        <meshStandardMaterial color="#e0e7ff" roughness={0.8} />
      </mesh>
    </mesh>
  );
};

const Platform = () => (
  <mesh position={[0, -0.2, 0]} receiveShadow>
    <cylinderGeometry args={[2.5, 2.5, 0.2, 64]} />
    <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
  </mesh>
);

const ScannerBeam = ({ progress }: { progress: number }) => {
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (beamRef.current) {
      // Sweep up and down based on time, mapped loosely to progress
      const t = state.clock.getElapsedTime();
      beamRef.current.position.y = Math.sin(t * 3) * 1.2 + 1.2;
      
      // Pulse opacity
      const material = beamRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.5 + Math.sin(t * 10) * 0.2;
    }
  });

  return (
    <mesh ref={beamRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.2, 0]}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

import { PackagedProduct } from './PackagedProduct';
import { FuturisticPlatform } from './FuturisticPlatform';

const ActiveScene = ({ progress }: { progress: number }) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-5, 5, -5]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[5, 2, 5]} intensity={0.5} color="#8b5cf6" />
      
      <Center>
        <PackagedProduct isScanning={true} />
        <FuturisticPlatform isScanning={true} />
      </Center>
    </>
  );
};

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ progress, step }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  if (prefersReducedMotion) {
    return <div className="h-64 w-full md:h-80"><FallbackIllustration /></div>;
  }

  return (
    <div className="relative h-64 w-full md:h-80 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
      <React.Suspense fallback={<FallbackIllustration />}>
        <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
          <ActiveScene progress={progress} />
          <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />
        </Canvas>
      </React.Suspense>
      
      {/* Overlay UI for progress */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur rounded-lg p-3 border border-white/10">
        <div className="flex justify-between text-xs text-white mb-2 font-mono">
          <span>Analyzing labels...</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
