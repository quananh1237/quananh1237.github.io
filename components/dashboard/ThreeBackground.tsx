"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function FloatingObject({ geometry, speed = 0.1, i = 0, color = "#ffffff" }: any) {
  const ref = useRef<THREE.Mesh>(null);

  const rnd = useMemo(() => Math.random() * 0.5 + 0.5, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.15 * speed * rnd;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * speed + i) * (0.6 + rnd);
    ref.current.position.x += Math.cos(state.clock.elapsedTime * 0.1 + i) * 0.002;
  });

  return (
    <mesh ref={ref} position={[Math.sin(i) * 6, Math.cos(i) * 2, -5 - i]}>
      {geometry}
      <meshPhysicalMaterial transparent={true} opacity={0.35} roughness={0.1} metalness={0.9} color={color} clearcoat={1} clearcoatRoughness={0.1} />
    </mesh>
  );
}

function MovingLights() {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.3;
    if (l1.current) {
      l1.current.position.x = Math.cos(t) * 8;
      l1.current.position.z = Math.sin(t) * 8;
    }
    if (l2.current) {
      l2.current.position.x = Math.sin(t + 1.5) * 6;
      l2.current.position.z = Math.cos(t + 1.5) * 6;
    }
  });

  return (
    <>
      <pointLight ref={l1} color={"#ff6aa2"} intensity={1.2} distance={30} />
      <pointLight ref={l2} color={"#5de2ff"} intensity={1.0} distance={30} />
    </>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={particles} count={particles.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color={"#ffffff"} transparent opacity={0.9} />
    </points>
  );
}

export default function ThreeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={["#0a0a1a"]} />
        <ambientLight color={"#9b7cff"} intensity={0.25} />
        <MovingLights />

        <Suspense fallback={null}>
          <FloatingObject i={0} speed={0.12} color="#9b7cff" geometry={<icosahedronGeometry args={[1.6, 0]} />} />
          <FloatingObject i={1} speed={0.08} color="#ff6aa2" geometry={<torusGeometry args={[1.1, 0.35, 16, 60]} />} />
          <FloatingObject i={2} speed={0.14} color="#5de2ff" geometry={<boxGeometry args={[1.4, 1.4, 1.4]} />} />
          <FloatingObject i={3} speed={0.09} color="#ffd3ef" geometry={<sphereGeometry args={[1.2, 32, 32]} />} />
          <Particles />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />

      </Canvas>
    </div>
  );
}
