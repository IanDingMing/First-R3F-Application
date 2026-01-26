import { useEffect, useState, useRef, Suspense } from "react";
import * as THREE from "three";
import { useThree, extend, useFrame } from "@react-three/fiber";
import {
  useMatcapTexture,
  Center,
  Text3D,
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
  useGLTF,
  useTexture,
  Sparkles,
  shaderMaterial,
} from "@react-three/drei";
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";
// import CustomObject from "./CustomObject";
// 导入自定义Shader
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";

// 方法1：使用drei的shaderMaterial创建自定义材质
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#ffffff"),
    uColorEnd: new THREE.Color("#000000"),
  },
  portalVertexShader,
  portalFragmentShader,
);

// 扩展Three.js以使用自定义材质
extend({ PortalMaterial });

export default function Experience() {
  const { nodes } = useGLTF("./model/portal.glb");
  const bakedTexture = useTexture("./model/baked.jpg");
  // bakedTexture.flipY = false;

  const portalMaterial = useRef();

  // 动画帧更新uniform
  useFrame((state, delta) => {
    if (portalMaterial.current) {
      portalMaterial.current.uTime += delta;
    }
  });

  return (
    <>
      <color args={["#030202"]} attach="background" />
      <OrbitControls makeDefault />

      <Center>
        {/* 烘焙纹理的地面 */}
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} map-flipY={false} />
        </mesh>

        {/* 灯柱A */}
        <mesh
          geometry={nodes.poleLightA.geometry}
          position={nodes.poleLightA.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        {/* 灯柱B */}
        <mesh
          geometry={nodes.poleLightB.geometry}
          position={nodes.poleLightB.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        {/* 传送门 - 使用自定义Shader材质 */}
        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
        >
          {/* 方法1：使用扩展的自定义材质 */}
          <portalMaterial ref={portalMaterial} />

          {/* 方法2：使用原生shaderMaterial（注释状态） */}
          {/* <shaderMaterial
            vertexShader={portalVertexShader}
            fragmentShader={portalFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uColorStart: { value: new THREE.Color("#ffffff") },
              uColorEnd: { value: new THREE.Color("#000000") },
            }}
          /> */}
        </mesh>

        {/* 萤火虫效果 */}
        <Sparkles
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          speed={0.2}
          count={40}
          color="#ffffff"
          opacity={0.8}
        />
      </Center>
    </>
  );
}
