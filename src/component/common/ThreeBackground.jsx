import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function AnimatedMesh() {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 0.15 },
    }),
    []
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    uniforms.uTime.value = time;

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.3 + uniforms.uMouse.value.y * 0.3;
      meshRef.current.rotation.y = Math.cos(time * 0.1) * 0.4 + uniforms.uMouse.value.x * 0.4;
      meshRef.current.rotation.z = Math.sin(time * 0.08) * 0.1;
    }

    if (materialRef.current) {
      materialRef.current.wireframe = false;
    }
  });

  return (
    <mesh ref={meshRef} scale={Math.min(viewport.width, viewport.height) * 0.6}>
      <icosahedronGeometry args={[1.8, 4]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#3b82f6"
        emissive="#1e40af"
        emissiveIntensity={0.3}
        wireframe
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const pointsRef = useRef();
  const count = 200;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      spd[i] = Math.random() * 0.3 + 0.1;
    }
    return [pos, spd];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += Math.sin(time * speeds[i] + i) * 0.002;
      posArray[i * 3] += Math.cos(time * speeds[i] * 0.5 + i) * 0.001;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#60a5fa"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const handlePointerMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    document.documentElement.style.setProperty("--mouse-x", x.toFixed(3));
    document.documentElement.style.setProperty("--mouse-y", y.toFixed(3));
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#60a5fa" />
      <directionalLight position={[-5, -3, 3]} intensity={0.3} color="#818cf8" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#3b82f6" />

      <AnimatedMesh />
      <FloatingParticles />

      <fog attach="fog" args={["#0f172a", 5, 15]} />
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ touchAction: "none" }}
      onPointerMove={(e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        document.documentElement.style.setProperty("--mouse-x", x.toFixed(3));
        document.documentElement.style.setProperty("--mouse-y", y.toFixed(3));
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>

      {/* Gradient overlay to blend with page content */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
    </div>
  );
}
