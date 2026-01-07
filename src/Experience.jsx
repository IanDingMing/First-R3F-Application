import { useRef } from "react";
import { useThree, extend, useFrame } from "@react-three/fiber";
// import CustomObject from "./CustomObject";

export default function Experience() {
  const cubeRef = useRef();
  const groupRef = useRef();

  // 每帧执行动画
  useFrame((state, delta) => {
    // 立方体旋转
    // cubeRef.current.rotation.y += delta;
    // 群组旋转
    // groupRef.current.rotation.y += delta * 0.5;
    // 相机圆周运动（可选）
    // const angle = state.clock.elapsedTime * 0.5;
    // camera.position.x = Math.sin(angle) * 8;
    // camera.position.z = Math.cos(angle) * 8;
    // camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* 灯光系统 */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* 可交互的群组 */}
      <group ref={groupRef}>
        {/* 球体 */}
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* 立方体 */}
        <mesh
          ref={cubeRef}
          rotation-y={Math.PI * 0.25}
          position-x={2}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>

      {/* 地面平面 */}
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      {/* 自定义对象 */}
      {/* <CustomObject /> */}

      {/* 辅助工具（开发时使用） */}
      {/* <axesHelper args={[5]} /> */}
      {/* <gridHelper args={[10, 10]} /> */}
    </>
  );
}
