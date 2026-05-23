"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Auto-rotate model slowly
  useFrame((state) => {
    if (!modelRef.current) return;
    
    // Slow drift rotation
    modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    
    // Add micro-bobbing floating animation
    modelRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.08;
  });

  return (
    <group ref={modelRef} dispose={null}>
      <Center>
        <primitive 
          object={scene} 
          scale={[1.5, 1.5, 1.5]} 
        />
      </Center>
    </group>
  );
}

// Custom lighting rigs
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.5}
        color="#c8a96a"
      />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#FFF8EE" />
    </>
  );
}

export default function ThreeArchitecturalFragment() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#FFF8EE"]} />
        <fog attach="fog" args={["#FFF8EE", 2, 8]} />
        
        <Lighting />
        
        <Suspense fallback={null}>
          <Model url="/models/villa.glb" />
        </Suspense>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Interactive Helper Overlay */}
      <div className="absolute bottom-6 left-6 pointer-events-none font-mono text-[9px] text-[var(--muted-ink)] tracking-wider uppercase bg-white/70 px-4 py-2 rounded-full border border-[var(--stone)]/20 backdrop-blur-xs">
        Drag to inspect fragment
      </div>
    </div>
  );
}

// Pre-load model to prevent latency
useGLTF.preload("/models/villa.glb");
