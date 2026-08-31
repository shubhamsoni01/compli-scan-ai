import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import { PackagedProduct } from './PackagedProduct';
import { FuturisticPlatform } from './FuturisticPlatform';
import { FallbackIllustration } from './FallbackIllustration';

interface ProductScannerProps {
  size?: 'sm' | 'md' | 'lg';
  isScanning?: boolean;
}

const Scene: React.FC<{ isScanning: boolean }> = ({ isScanning }) => {
  useFrame((state) => {
    // Elegant smooth mouse parallax without rapid jumps
    const mouseX = state.mouse.x * 1.5;
    const mouseY = Math.max(0.5, state.mouse.y * 1.2 + 2.0);

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouseY, 0.04);
    state.camera.lookAt(0, 1.25, 0);
  });

  return (
    <>
      {/* 
        Balanced studio lighting designed for both Light and Dark themes:
        - Light mode: Soft ambient + crisp key directional light
        - Dark mode: Indigo/cyan subtle rim highlights without oversaturated neon
      */}
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[6, 8, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {/* Rim light for edge definition */}
      <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#818cf8" />
      {/* Subtle floor bounce light */}
      <pointLight position={[0, -0.4, 2]} intensity={0.4} color="#38bdf8" />

      {/* Floating group for smooth cinematic motion */}
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
        <Center position={[0, 0, 0]}>
          <PackagedProduct isScanning={isScanning} />
          <FuturisticPlatform isScanning={isScanning} />
        </Center>
      </Float>
    </>
  );
};

export const ProductScanner: React.FC<ProductScannerProps> = ({ size = 'lg', isScanning = false }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const sizeClass = {
    sm: 'h-64 w-full',
    md: 'h-full w-full min-h-[300px]',
    lg: 'h-full w-full min-h-[380px]',
  }[size];

  if (prefersReducedMotion) {
    return (
      <div className={sizeClass}>
        <FallbackIllustration />
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClass} bg-transparent rounded-3xl overflow-visible flex items-center justify-center`}>
      {/* Subtle decorative background gradient halo */}
      <div className="absolute inset-0 bg-radial from-indigo-500/12 via-transparent to-transparent pointer-events-none -z-10 rounded-3xl" />
      
      <React.Suspense fallback={<FallbackIllustration />}>
        <Canvas
          shadows
          camera={{ position: [0, 2.0, 5.1], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <Scene isScanning={isScanning} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.05}
            minPolarAngle={Math.PI / 3.2}
            dampingFactor={0.05}
          />
        </Canvas>
      </React.Suspense>
    </div>
  );
};

export default ProductScanner;
