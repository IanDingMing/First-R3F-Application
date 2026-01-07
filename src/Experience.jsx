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

  return (
    <>
      <OrbitControls makeDefault />

      {/* 灯光系统 */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* 可交互的群组 */}
      <group ref={groupRef}>
        <PivotControls
          anchor={[0, 0, 0]}
          depthTest={false}
          lineWidth={4}
          axisColors={["#9381ff", "#ff4d6d", "#7ae582"]}
          scale={100}
          fixed={true}
        >
          {/* 球体 */}
          <mesh ref={sphereRef} position-x={-2}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
            <Html
              position={[1, 1, 0]}
              wrapperClass="label"
              center
              distanceFactor={6}
              occlude={[sphereRef, cubeRef]}
            >
              That's a sphere 👍
            </Html>
          </mesh>
        </PivotControls>

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
        <TransformControls object={cubeRef} mode="rotate" />
      </group>

      {/* 地面平面 */}
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        {/* <meshStandardMaterial color="greenyellow" /> */}
        <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.5}
          color="greenyellow"
        />
      </mesh>

      <Float speed={5} floatIntensity={2}>
        <Text
          font="./bangers-v20-latin-regular.woff"
          fontSize={1}
          color={"salmon"}
          position-y={2}
          maxWidth={2}
          textAlign="center"
        >
          I LOVE R3F
          {/* 根据摄像机角度不同变色 */}
          {/* <meshNormalMaterial /> */}
        </Text>
      </Float>

      {/* 自定义对象 */}
      {/* <CustomObject /> */}

      {/* 辅助工具（开发时使用） */}
      {/* <axesHelper args={[5]} /> */}
      {/* <gridHelper args={[10, 10]} /> */}
    </>
  );
}
