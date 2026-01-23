import { useRef, Suspense } from "react";
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
import Model from "./Model.jsx";
import Placeholder from "./Placeholder.jsx";
import Hamburger from "./Hamburger.jsx";
import Fox from "./Fox.jsx";

export default function Experience() {
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <mesh scale={1.5}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
}
