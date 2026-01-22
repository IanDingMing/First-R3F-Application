import { useRef } from "react";
import * as THREE from "three";
import { useThree, extend, useFrame } from "@react-three/fiber";
import {
  Lightformer,
  Environment,
  Sky,
  ContactShadows,
  RandomizedLight,
  AccumulativeShadows,
  softShadows,
  BakeShadows,
  useHelper,
  MeshReflectorMaterial,
  Float,
  Text,
  Html,
  PivotControls,
  TransformControls,
  OrbitControls,
} from "@react-three/drei";
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";
// import CustomObject from "./CustomObject";

// softShadows({
//   frustum: 3.75,
//   size: 0.005,
//   near: 9.5,
//   samples: 17,
//   rings: 11,
// });

export default function Experience() {
  const directionalLight = useRef();
  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  const cubeRef = useRef();
  const sphereRef = useRef();
  const groupRef = useRef();

  // 每帧执行动画
  useFrame((state, delta) => {
    // 立方体旋转
    // cubeRef.current.position.x = 2 + Math.sin(state.clock.elapsedTime);
    cubeRef.current.rotation.y += delta * 0.2;
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
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* 灯光系统 */}
      <directionalLight
        ref={directionalLight}
        castShadow
        position={[1, 2, 3]}
        intensity={1.5}
      />
      <ambientLight intensity={0.5} />

      {/* 可交互的群组 */}
      <group ref={groupRef}>
        {/* 球体 */}
        <mesh ref={sphereRef} castShadow position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* 立方体 */}
        <mesh ref={cubeRef} castShadow position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>

      {/* 地面平面 */}
      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
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
