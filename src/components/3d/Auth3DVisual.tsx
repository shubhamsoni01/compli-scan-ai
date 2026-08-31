import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldCheck, CheckCircle2, ScanLine } from 'lucide-react';

interface Auth3DSceneProps {
  isDark?: boolean;
}

/**
 * Procedural texture for the 3D Auth product package
 * Crisp, modern compliance-labeled package
 */
function useAuthPackageTexture(isDark: boolean) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background gradient: Sophisticated frosted matte slate/indigo finish
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1440);
    if (isDark) {
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(0.3, '#312e81');
      bgGrad.addColorStop(0.7, '#1e1b4b');
      bgGrad.addColorStop(1, '#0f172a');
    } else {
      bgGrad.addColorStop(0, '#3730a3');
      bgGrad.addColorStop(0.35, '#4338ca');
      bgGrad.addColorStop(0.7, '#4f46e5');
      bgGrad.addColorStop(1, '#312e81');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1440);

    // Subtle metallic foil micro-stripes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 1440; i += 8) {
      ctx.fillRect(0, i, 1024, 2);
    }

    // Top Heat-Seal crimp strip
    const sealGrad = ctx.createLinearGradient(0, 0, 0, 90);
    sealGrad.addColorStop(0, '#0f172a');
    sealGrad.addColorStop(0.5, '#334155');
    sealGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = sealGrad;
    ctx.fillRect(0, 0, 1024, 90);

    // Bottom Heat-Seal crimp strip
    ctx.fillRect(0, 1350, 1024, 90);

    // Brand Banner
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('COMPLISCAN', 512, 280);

    ctx.fillStyle = '#a5b4fc';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('AI COMPLIANCE INTELLIGENCE', 512, 320);

    // Subtle decorative product shield
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 4;
    ctx.strokeRect(362, 380, 300, 180);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.fillText('SAMPLE PACK', 512, 480);

    // Compliance Matrix Pill
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fillRect(280, 640, 464, 80);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(280, 640, 464, 80);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText('STATUTORY VERIFIED ✓', 512, 692);

    // Standard Mandatories Grid
    ctx.fillStyle = '#e0e7ff';
    ctx.font = '24px monospace';
    ctx.textAlign = 'left';

    ctx.fillText('NET QTY:  250 g', 320, 840);
    ctx.fillText('MRP:      ₹99.00 (INCL. TAXES)', 320, 890);
    ctx.fillText('MFG DT:   AUG 2026', 320, 940);
    ctx.fillText('BATCH NO: CS-88219-X', 320, 990);
    ctx.fillText('FSSAI:    10015043001129', 320, 1040);
    ctx.fillText('ORIGIN:   INDIA', 320, 1090);

    // Green Veg Symbol in corner
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 4;
    ctx.strokeRect(820, 220, 70, 70);
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(855, 255, 18, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    return tex;
  }, [isDark]);
}

/**
 * Floating 3D Package and Scanning Apparatus
 */
function FloatingPackage({ isDark }: { isDark: boolean }) {
  const packageRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  const texture = useAuthPackageTexture(isDark);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (packageRef.current) {
      // Very smooth, slow idle floating (no distracting fast spin)
      packageRef.current.position.y = Math.sin(t * 0.8) * 0.08;
      // Gentle oscillation yaw (+/- 14 degrees)
      packageRef.current.rotation.y = Math.sin(t * 0.4) * 0.24;
      packageRef.current.rotation.x = Math.cos(t * 0.5) * 0.03;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.35;
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.08;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.25;
      ring2Ref.current.rotation.y = Math.cos(t * 0.4) * 0.08;
    }

    if (beamRef.current) {
      // Subtle vertical scanning beam plane sweeping across package
      beamRef.current.position.y = Math.sin(t * 1.2) * 1.25;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Package */}
      <group ref={packageRef}>
        {/* Main Pouch */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.75, 2.55, 0.55, 16, 16, 8]} />
          <meshStandardMaterial
            map={texture || undefined}
            color={texture ? '#ffffff' : '#312e81'}
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>

        {/* Top & Bottom Foil Seals */}
        <mesh position={[0, 1.32, 0]}>
          <boxGeometry args={[1.82, 0.12, 0.1]} />
          <meshStandardMaterial color="#1e1b4b" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.32, 0]}>
          <boxGeometry args={[1.82, 0.12, 0.1]} />
          <meshStandardMaterial color="#1e1b4b" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Subtle scanning laser plane */}
        <mesh ref={beamRef} position={[0, 0, 0]}>
          <planeGeometry args={[2.2, 0.04]} />
          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Floating compliance micro-badges */}
        <Html position={[1.3, 0.95, 0.3]} distanceFactor={6} center>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-emerald-500/30 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap select-none pointer-events-none">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>AI Verified</span>
          </div>
        </Html>

        <Html position={[-1.35, 0.35, 0.3]} distanceFactor={6} center>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-indigo-500/30 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap select-none pointer-events-none">
            <ScanLine size={13} className="text-indigo-500" />
            <span>Label Analysis</span>
          </div>
        </Html>

        <Html position={[1.35, -0.65, 0.3]} distanceFactor={6} center>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-sky-500/30 text-[11px] font-semibold text-sky-600 dark:text-sky-400 whitespace-nowrap select-none pointer-events-none">
            <ShieldCheck size={13} className="text-sky-500" />
            <span>Compliance Ready</span>
          </div>
        </Html>

        <Html position={[-1.25, -0.85, 0.3]} distanceFactor={6} center>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-purple-500/30 text-[11px] font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap select-none pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
            <span>Secure Scan</span>
          </div>
        </Html>
      </group>

      {/* Orbiting Holographic Scanning Ring 1 */}
      <mesh ref={ring1Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.015, 16, 64]} />
        <meshBasicMaterial color={isDark ? '#818cf8' : '#6366f1'} transparent opacity={0.5} />
      </mesh>

      {/* Orbiting Scanning Ring 2 */}
      <mesh ref={ring2Ref} position={[0, 0, 0]} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.2, 0.008, 16, 64]} />
        <meshBasicMaterial color={isDark ? '#38bdf8' : '#0284c7'} transparent opacity={0.35} />
      </mesh>

      {/* Subtle Circular Scanning Pedestal */}
      <group position={[0, -1.65, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[2.0, 2.1, 0.12, 48]} />
          <meshStandardMaterial
            color={isDark ? '#1e293b' : '#e2e8f0'}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[1.85, 1.85, 0.02, 48]} />
          <meshBasicMaterial
            color={isDark ? '#312e81' : '#c7d2fe'}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Scene setup with camera parallax
 */
const AuthScene: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  useFrame((state) => {
    // Gentle mouse parallax
    const mouseX = state.mouse.x * 0.7;
    const mouseY = Math.max(0.1, state.mouse.y * 0.5 + 0.8);

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseX, 0.035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouseY, 0.035);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={isDark ? 0.75 : 0.95} />
      <directionalLight position={[5, 7, 5]} intensity={1.3} castShadow />
      <directionalLight position={[-5, 3, -3]} intensity={0.6} color="#818cf8" />
      <pointLight position={[0, -1, 2]} intensity={0.5} color="#38bdf8" />

      <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.2}>
        <FloatingPackage isDark={isDark} />
      </Float>
    </>
  );
};

export const Auth3DVisual: React.FC<Auth3DSceneProps> = ({ isDark = false }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-48 h-64 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center p-6 shadow-xl">
          <ShieldCheck className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mb-4" />
          <h4 className="font-heading font-bold text-slate-800 dark:text-slate-100">CompliScan AI</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automated Label Verification</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[560px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.8, 5.0], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        <AuthScene isDark={isDark} />
      </Canvas>
    </div>
  );
};

export default Auth3DVisual;
