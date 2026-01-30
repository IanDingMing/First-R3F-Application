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
      <OrbitControls makeDefault />

      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
}
