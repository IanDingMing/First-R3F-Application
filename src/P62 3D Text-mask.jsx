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
} from "@react-three/drei";
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";
// import CustomObject from "./CustomObject";
import Model from "./Model.jsx";
import Placeholder from "./Placeholder.jsx";
import Hamburger from "./Hamburger.jsx";
import Fox from "./Fox.jsx";

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const material = new THREE.MeshNormalMaterial();

export default function Experience() {
  const donutsGroup = useRef();

  // const matcapTexture = useMatcapTexture("3E2335_D36A1B_8E4A2E_2842A5", 256);
  // const [matcap, url] = useMatcapTexture(
  //   0, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
  //   1024 // size of the texture ( 64, 128, 256, 512, 1024 )
  // );

  // const [torusGeometry, setTorusGeometry] = useState();
  // const [material, setMaterial] = useState();

  // useEffect(() => {
  //   matcap.encodind = THREE.sRGBEncoding;
  //   matcap.needsUpdate = true;

  //   material.matcap = matcap;
  //   material.needsUpdate = true;
  // }, []);

  useFrame((state, delta) => {
    for (const donut of donutsGroup.current.children) {
      donut.rotation.y += delta * 0.2;
    }
  });
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]} /> */}
      {/* <meshNormalMaterial ref={setMaterial} /> */}

      <Center>
        <Text3D
          material={material}
          font="./fonts/helvetiker_regular.typeface.json"
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          HELLO R3F
          {/* <meshMatcapMaterial matcap={matcap} /> */}
        </Text3D>
      </Center>
      <group ref={donutsGroup}>
        {Array(100)
          .fill(null)
          .map((value, index) => {
            return (
              <mesh
                key={index}
                geometry={torusGeometry}
                material={material}
                position={[
                  (Math.random() - 0.5) * 10,
                  (Math.random() - 0.5) * 10,
                  (Math.random() - 0.5) * 10,
                ]}
                scale={0.2 + Math.random() * 0.2}
                rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
              />
            );
          })}
      </group>
    </>
  );
}
