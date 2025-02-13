import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Center } from '@react-three/drei';

export function StoryScene({ chapter }: { chapter: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(time * 0.5) * 0.3;
    group.current.position.y = Math.sin(time * 0.5) * 0.2;
  });

  return (
    <group ref={group}>
      <Center>
        <Text
          fontSize={0.5}
          maxWidth={2}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          {`Chapter ${chapter + 1}`}
          <meshStandardMaterial
            color={chapter === 0 ? "#ff6b6b" : chapter === 1 ? "#f06292" : "#e91e63"}
            metalness={0.8}
            roughness={0.2}
          />
        </Text>
      </Center>
    </group>
  );
}