import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";

function MasonryWall() {
  const wall = useRef<Group>(null);
  const bricks = Array.from({ length: 16 }, (_, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const offset = row % 2 === 0 ? 0 : 0.48;
    return {
      key: index,
      position: [(column - 1.5) * 1.05 + offset, (1.5 - row) * 0.66, 0] as [number, number, number],
      color: ["#c88362", "#d5a17d", "#b97454", "#dfb493"][((row * 3 + column) % 4)],
      delay: row * 0.12 + column * 0.045,
    };
  });

  useFrame((state, delta) => {
    if (!wall.current) return;
    wall.current.rotation.y = MathUtils.damp(wall.current.rotation.y, state.pointer.x * 0.09, 2.2, delta);
    wall.current.rotation.x = MathUtils.damp(wall.current.rotation.x, -state.pointer.y * 0.045, 2.2, delta);
  });

  return (
    <group ref={wall} position={[0, 0, 0]}>
      {bricks.map((brick) => (
        <Block key={brick.key} position={brick.position} color={brick.color} delay={brick.delay} />
      ))}
    </group>
  );
}

function Block({ position, color, delay }: { position: [number, number, number]; color: string; delay: number }) {
  const block = useRef<Group>(null);
  useFrame((state) => {
    if (!block.current) return;
    const progress = Math.min(1, Math.max(0, (state.clock.elapsedTime - delay) * 1.1));
    const eased = progress * progress * (3 - 2 * progress);
    block.current.position.y = position[1] + (1 - eased) * 0.45;
    block.current.scale.set(1, Math.max(0.01, eased), 1);
  });
  return (
    <group ref={block} position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.98, 0.58, 0.24]} />
        <meshStandardMaterial color={color} roughness={0.94} metalness={0.02} />
      </mesh>
    </group>
  );
}

export default function HeroWallScene() {
  return (
    <Canvas
      className="hero-wall-canvas"
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 7], fov: 36 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      aria-label="A softly illuminated masonry wall assembling in a staggered pattern"
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[-3, 4, 5]} intensity={2.3} color="#fff1d7" />
      <directionalLight position={[4, -1, 3]} intensity={0.65} color="#e99b6c" />
      <MasonryWall />
    </Canvas>
  );
}