import { useEffect, useState, useRef, Suspense } from "react";
import * as THREE from "three";
import { useThree, extend, useFrame } from "@react-three/fiber";
import {
  PresentationControls,
  useMatcapTexture,
  Center,
  Text3D,
  Lightformer,
  Environment,
  Sky,
  ContactShadows,
  RandomizedLight,
  AccumulativeShadows,
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
  meshBounds,
} from "@react-three/drei";

import {
  DepthOfField,
  Bloom,
  Noise,
  Glitch,
  ToneMapping,
  Vignette,
  EffectComposer,
  SSR,
} from "@react-three/postprocessing";
import { GlitchMode, BlendFunction } from "postprocessing";
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";
// 导入自定义Shader
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import Drunk from "./Drunk.jsx";

export default function Experience() {
  const computer = useGLTF(
    "https://threejs-journey.com/resources/models/macbook_model.gltf",
  );

  return (
    <>
      <Environment files="./environmentMaps/the_sky_is_on_fire_2k.hdr" />

      <color args={["#241a1a"]} attach="background" />

      <PresentationControls
        global // 关键：启用全局拖拽。在场景任何地方（而不仅是模型上）拖拽都能控制模型。
        rotation={[0.13, 0.1, 0]} // 初始旋转角度 [x, y, z]
        polar={[-0.4, 0.2]} // 垂直旋转（上下看）的角度限制 [最小值， 最大值]，单位是弧度
        azimuth={[-1, 0.75]} // 水平旋转（左右看）的角度限制 [最小值， 最大值]，单位是弧度
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        {/* 所有放在这里的3D对象都会受控制 */}
        <Float rotationIntensity={0.4}>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color={"#fcfcfa"}
            rotation={[-0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />
          <primitive object={computer.scene} position-y={-1.2}>
            <Html
              transform
              wrapperClass="htmlScreen"
              distanceFactor={1.17}
              position={[0, 1.56, -1.4]}
              rotation-x={-0.256}
            >
              <iframe src="https://git-scm.com/book/zh/v2" />
            </Html>
            <Text
              font="./bangers-v20-latin-regular.woff"
              fontSize={1}
              position={[2, 1.75, 0.75]}
              rotation-y={-1.25}
              maxWidth={2}
              textAlign="center"
            >
              BRUNO SIMON
            </Text>
          </primitive>
        </Float>
      </PresentationControls>

      <ContactShadows position-y={-1.4} opacity={0.4} scale={5} blur={2.4} />
    </>
  );
}
