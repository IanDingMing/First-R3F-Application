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
  const drunkRef = useRef();

  const drunkProps = useControls("Drunk Effect", {
    frequency: { value: 2, min: 1, max: 20 },
    amplitude: { value: 0.1, min: 0, max: 1 },
  });

  return (
    <>
      <color args={["#ffffff"]} attach="background" />

      <EffectComposer disableNormalPass>
        {/* <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        /> */}
        {/* <Glitch
          delay={[0.5, 1]}
          duration={[0.1, 0.3]}
          strength={[0.2, 0.4]}
          mode={GlitchMode.CONSTANT_MILD}
        /> */}
        {/* <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} /> */}
        {/* <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0} /> */}
        {/* <DepthOfField
          focusDistance={0.025}
          focalLength={0.025}
          bokehScale={6}
        /> */}
        {/* <SSR /> */}
        <Drunk
          ref={drunkRef}
          {...drunkProps}
          blendFunction={BlendFunction.DARKEN}
        />
      </EffectComposer>

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" metalness={0} roughness={0} />
      </mesh>
    </>
  );
}
