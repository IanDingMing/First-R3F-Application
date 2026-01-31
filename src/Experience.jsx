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
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position={[-2, 2, 0]}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position={[2, 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh receiveShadow position-y={-1.25}>
        <boxGeometry args={[10, 0.5, 10]} />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
