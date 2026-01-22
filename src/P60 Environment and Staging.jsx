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

  const { color, opacity, blur } = useControls("contact shadows", {
    color: "#4d2709",
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  });

  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls("environment map", {
      envMapIntensity: { value: 7, min: 0, max: 12 },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 28, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 },
    });

  return (
    <>
      <Environment
        files={"./environmentMaps/the_sky_is_on_fire_2k.hdr"}
        ground={{
          height: envMapHeight,
          radius: envMapRadius,
          scale: envMapScale,
        }}
      >
        {/* <color attach="background" args={["#000000"]} /> */}
        {/* <Lightformer
          position-z={-5}
          scale={10}
          color="red"
          intensity={10}
          form={"ring"}
        /> */}
        {/* <mesh position-z={-5} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={[10, 0, 0]} />
        </mesh> */}
      </Environment>
      <BakeShadows />

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <AccumulativeShadows
        position={[0, -0.99, 0]}
        scale={10}
        color="#316d39"
        opacity={0.8}
        frames={Infinity}
        temporal
        blend={100}
      >
        {/* <directionalLight position={[1, 2, 3]} castShadow /> */}
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={1}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows>

      <ContactShadows
        position={[0, 0, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        frames={1}
      />

      {/* 灯光系统 */}
      {/* <directionalLight
        ref={directionalLight}
        position={sunPosition}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <ambientLight intensity={0.5} />

      <Sky sunPosition={sunPosition} /> */}

      {/* 可交互的群组 */}
      <group ref={groupRef}>
        {/* 球体 */}
        <mesh ref={sphereRef} castShadow position-x={-2} position-y={1}>
          <sphereGeometry />
          <meshStandardMaterial
            color="orange"
            envMapIntensity={envMapIntensity}
          />
        </mesh>

        {/* 立方体 */}
        <mesh
          ref={cubeRef}
          castShadow
          position-x={2}
          position-y={1}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial
            color="mediumpurple"
            envMapIntensity={envMapIntensity}
          />
        </mesh>
      </group>

      {/* 地面平面 */}
      {/* <mesh position-y={0} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial
          color="greenyellow"
          envMapIntensity={envMapIntensity}
        />
      </mesh> */}

      {/* 自定义对象 */}
      {/* <CustomObject /> */}

      {/* 辅助工具（开发时使用） */}
      {/* <axesHelper args={[5]} /> */}
      {/* <gridHelper args={[10, 10]} /> */}
    </>
  );
}
