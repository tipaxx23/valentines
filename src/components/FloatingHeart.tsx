import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Shape, ExtrudeGeometry } from 'three';

function createHeartShape(width: number, height: number) {
  const shape = new Shape();
  const x = 0, y = 0;

  shape.moveTo(x, y + height / 4);
  shape.bezierCurveTo(
    x, y, 
    x - width / 2, y, 
    x - width / 2, y + height / 4
  );
  shape.bezierCurveTo(
    x - width / 2, y + height / 2, 
    x, y + height * 3/4, 
    x, y + height
  );
  shape.bezierCurveTo(
    x, y + height * 3/4, 
    x + width / 2, y + height / 2, 
    x + width / 2, y + height / 4
  );
  shape.bezierCurveTo(
    x + width / 2, y, 
    x, y, 
    x, y + height / 4
  );

  return shape;
}

export function FloatingHeart({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const initialPosition = new Vector3(...position);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.getElapsedTime();
    
    mesh.current.position.x = initialPosition.x + Math.sin(time + initialPosition.x) * 0.5;
    mesh.current.position.y = initialPosition.y + Math.cos(time + initialPosition.y) * 0.5;
    mesh.current.rotation.x = time * 0.5;
    mesh.current.rotation.y = time * 0.3;
  });

  const heartShape = createHeartShape(0.5, 0.5);
  const geometry = new ExtrudeGeometry(heartShape, {
    depth: 0.5,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.1,
    bevelThickness: 0.1
  });

  return (
    <mesh ref={mesh} position={position} geometry={geometry}>
      <meshStandardMaterial color="#ff69b4" metalness={0.5} roughness={0.2} />
    </mesh>
  );
}