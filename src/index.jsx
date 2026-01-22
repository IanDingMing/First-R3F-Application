import * as THREE from "three";
import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { StrictMode } from "react";
import { Leva } from "leva";

const root = ReactDOM.createRoot(document.querySelector("#root"));

// 相机配置
const cameraSettings = {
  fov: 45, // 视野角度
  near: 0.1, // 近平面
  far: 200, // 远平面
  position: [-4, 3, 6], // 相机位置
};

const created = ({ scene, gl }) => {
  // console.log("created", gl, scene);
  // gl.setClearColor("#ff0000", 1);
  // scene.background = new THREE.Color("red");
};
root.render(
  <StrictMode>
    <Leva collapsed />
    <Canvas
      // 设备像素比，2为高分辨率适配
      dpr={2}
      // WebGLRenderer 配置
      gl={{
        antialias: true, // 抗锯齿
        toneMapping: THREE.ACESFilmicToneMapping, // 色调映射
        outputEncoding: THREE.sRGBEncoding, // 输出编码（注意：新版本 THREE 使用 THREE.SRGBColorSpace）
      }}
      // 相机配置
      camera={cameraSettings}
      // 阴影设置（可选的优化）
      // shadows
      // 事件管理（可选的优化）
      // eventSource={document.getElementById("root")}
      onCreated={created}
    >
      {/* 启用色调映射后需要添加色彩管理 */}
      {/* <color attach="background" args={["#000000"]} /> */}
      <Experience />
    </Canvas>
  </StrictMode>
);
