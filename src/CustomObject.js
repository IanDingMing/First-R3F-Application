import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

export default function CustomObject() {
  const geometryRef = useRef();

  // 创建随机三角形顶点
  const verticesCount = 10 * 3; // 10个三角形
  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3);
    for (let i = 0; i < verticesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 3;
    }
    return positions;
  }, []);

  // 计算法线（使用标准材质时必须）
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.computeVertexNormals();
    }
  }, []);
  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
}
