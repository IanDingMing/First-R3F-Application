import { useRef } from "react";
import { useThree, extend, useFrame } from "@react-three/fiber";
import {
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

export default function Experience() {
  const cubeRef = useRef();
  const sphereRef = useRef();
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

  const { perfVisible } = useControls({
    perfVisible: true,
  });

  const { position, color, visible } = useControls("sphere", {
    position: { value: { x: -2, y: 0 }, step: 0.01, joystick: "invertY" },
    color: { r: 200, g: 106, b: 125, a: 0.4 },
    visible: true,
    myInterval: { min: 0, max: 10, value: [4, 5] },
    clickMe: button(() => {
      console.log("ok");
    }),
    choice: { options: ["a", "b", "c"] },
  });

  const { scale } = useControls("cube", {
    scale: { value: 1.5, min: 0, max: 5, step: 0.01 },
  });
  console.log(position, color);

  return (
    <>
      {perfVisible ? <Perf position="top-left" /> : null}

      <OrbitControls makeDefault />

      {/* 灯光系统 */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* 可交互的群组 */}
      <group ref={groupRef}>
        {/* 球体 */}
        <mesh
          ref={sphereRef}
          position={[position.x, position.y, 0]}
          visible={visible}
        >
          <sphereGeometry />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* 立方体 */}
        <mesh ref={cubeRef} position-x={2} scale={scale}>
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
