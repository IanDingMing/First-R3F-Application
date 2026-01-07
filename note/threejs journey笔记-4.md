# P57 First R3F Application

## 一、@react-three/fiber 核心方法详解

### 1. **`useFrame` - 动画循环**

**使用位置：** 在 React 组件内部（函数组件中）
**作用：** 在每一帧渲染前执行，用于动画和交互

javascript

```
import { useFrame } from '@react-three/fiber';

function RotatingBox() {
  const meshRef = useRef();
  
  // 方法1：基本用法（每帧执行）
  useFrame(() => {
    meshRef.current.rotation.y += 0.01;
  });
  
  // 方法2：带参数（state和delta）
  useFrame((state, delta) => {
    // state: 包含scene、camera、gl、clock等
    // delta: 帧间隔时间（秒）
    meshRef.current.rotation.x += delta;
    
    // 访问场景状态
    console.log(state.clock.elapsedTime); // 运行时间
    console.log(state.mouse.x, state.mouse.y); // 鼠标位置
  });
  
  // 方法3：优先级控制（数字越小优先级越高）
  useFrame((state, delta) => {
    // 优先执行
  }, 1);
  
  // 方法4：条件执行
  useFrame((state, delta) => {
    if (shouldAnimate) {
      // 执行动画
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshBasicMaterial color="blue" />
    </mesh>
  );
}
```



### 2. **`useThree` - 获取 Three.js 核心对象**

**使用位置：** 组件内部，任何需要访问场景、相机、渲染器的地方

javascript

```
import { useThree } from '@react-three/fiber';

function SceneInfo() {
  const {
    scene,           // 场景对象（THREE.Scene）
    camera,          // 相机对象（THREE.Camera）
    gl,              // 渲染器（THREE.WebGLRenderer）
    clock,           // 时钟（THREE.Clock）
    raycaster,       // 射线检测器（THREE.Raycaster）
    mouse,           // 鼠标位置（THREE.Vector2）
    viewport,        // 视口信息（宽高、宽高比、像素比）
    size,            // 画布尺寸（宽高）
    invalidate,      // 手动触发重新渲染
    advance,         // 手动前进时钟
    set,             // 设置状态
    get,             // 获取状态
    events,          // 事件管理器
  } = useThree();
  
  // 示例：获取相机位置
  console.log(camera.position);
  
  // 示例：手动触发渲染
  const handleClick = () => {
    invalidate();
  };
  
  // 示例：响应窗口大小变化
  useEffect(() => {
    console.log(`画布尺寸：${size.width} x ${size.height}`);
  }, [size]);
  
  return null;
}
```



### 3. **`useLoader` - 资源加载**

**使用位置：** 组件内部，用于加载3D模型、纹理等资源

javascript

```
import { useLoader } from '@react-three/fiber';
import { TextureLoader, GLTFLoader, OBJLoader } from 'three/examples/jsm/loaders/';

function Model() {
  // 方法1：加载纹理
  const colorMap = useLoader(TextureLoader, 'textures/color.jpg');
  
  // 方法2：加载模型（GLTF）
  const gltf = useLoader(GLTFLoader, 'models/model.glb');
  
  // 方法3：加载多个纹理
  const [colorMap, normalMap, roughnessMap] = useLoader(
    TextureLoader,
    ['color.jpg', 'normal.jpg', 'roughness.jpg']
  );
  
  // 方法4：带进度回调
  const gltf = useLoader(GLTFLoader, 'model.glb', (loader) => {
    loader.manager.onProgress = (url, loaded, total) => {
      console.log(`加载进度：${loaded}/${total}`);
    };
  });
  
  // 方法5：错误处理
  const texture = useLoader(TextureLoader, 'texture.jpg');
  
  useEffect(() => {
    if (texture.error) {
      console.error('纹理加载失败:', texture.error);
    }
  }, [texture]);
  
  return (
    <>
      {/* 使用纹理 */}
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial map={colorMap} />
      </mesh>
      
      {/* 使用模型 */}
      <primitive object={gltf.scene} />
    </>
  );
}
```



### 4. **`<primitive object={obj} />` - 直接渲染 Three.js 对象**

**作用：** 将已有的 Three.js 对象直接插入到 React Three Fiber 场景中

javascript

```
import * as THREE from 'three';

// 创建原生 Three.js 对象
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'red' });
const mesh = new THREE.Mesh(geometry, material);

function Scene() {
  return (
    <>
      {/* 方法1：直接使用 primitive */}
      <primitive object={mesh} position={[0, 0, 0]} />
      
      {/* 方法2：动态创建 */}
      <primitive
        object={new THREE.Mesh(
          new THREE.SphereGeometry(1),
          new THREE.MeshBasicMaterial({ color: 'blue' })
        )}
      />
      
      {/* 方法3：配合 useMemo 优化 */}
      const customMesh = useMemo(() => {
        const geom = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const mat = new THREE.MeshStandardMaterial({ color: 'purple' });
        return new THREE.Mesh(geom, mat);
      }, []);
      
      <primitive object={customMesh} />
    </>
  );
}
```



### 5. **`extend({ CustomObject })` - 扩展 Three.js 类**

**作用：** 让 Three.js 的类可以在 JSX 中使用

javascript

```
import { extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CustomMaterial } from './CustomMaterial'; // 自定义材质

// 扩展 Three.js 类
extend({
  OrbitControls,
  CustomMaterial,
  // 可以一次性扩展多个
  BoxGeometry: THREE.BoxGeometry,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
});

function Scene() {
  return (
    <>
      {/* 现在可以直接使用扩展的类 */}
      <orbitControls />
      
      {/* 使用自定义材质 */}
      <mesh>
        <boxGeometry />
        <customMaterial color="red" />
      </mesh>
      
      {/* 扩展后也可以直接使用 Three.js 原生类 */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  );
}
```



## 二、关键概念详解

### 1. JSX vs Three.js 原生 API

javascript

```
// Three.js 原生方式
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 'red' })
);
mesh.position.set(1, 2, 3);
scene.add(mesh);

// React Three Fiber 方式
<mesh position={[1, 2, 3]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshBasicMaterial color="red" />
</mesh>
```



### 2. 属性传递方式

javascript

```
// 数组形式（推荐）
position={[x, y, z]}
rotation={[x, y, z]}

// 单个属性形式
position-x={1}
rotation-y={Math.PI}
scale={1.5}
```



### 3. **`attach` 属性**

**作用：** 指定子组件应该附加到父组件的哪个属性上

javascript

```
// 基本用法
<mesh>
  <boxGeometry attach="geometry" />     // 相当于 mesh.geometry = geometry
  <meshBasicMaterial attach="material" /> // 相当于 mesh.material = material
</mesh>

// attach 的不同使用场景
<mesh>
  {/* 1. 基本几何体和材质 */}
  <boxGeometry attach="geometry" />
  <meshStandardMaterial attach="material" />
  
  {/* 2. 多个材质（如 MultiMaterial） */}
  <boxGeometry attach="geometry" />
  <meshStandardMaterial attach="material-0" color="red" />
  <meshStandardMaterial attach="material-1" color="blue" />
  
  {/* 3. 自定义对象属性 */}
  <group>
    <object3D attach="customProperty" />
  </group>
  
  {/* 4. 嵌套属性（使用点号） */}
  <bufferGeometry>
    <bufferAttribute attach="attributes.position" />
    <bufferAttribute attach="attributes.normal" />
  </bufferGeometry>
</mesh>

// 实际示例：自定义几何体
<mesh>
  <bufferGeometry>
    <bufferAttribute
      attach="attributes-position"
      count={vertices.length}
      itemSize={3}
      array={vertices}
    />
    <bufferAttribute
      attach="attributes-normal"
      count={normals.length}
      itemSize={3}
      array={normals}
    />
  </bufferGeometry>
</mesh>
```



### 4. **OrbitControls 使用**

javascript

```
import { extend, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

function SceneWithControls() {
  const { camera, gl } = useThree();
  
  return (
    <>
      {/* 基本用法 */}
      <orbitControls args={[camera, gl.domElement]} />
      
      {/* 带配置的用法 */}
      <orbitControls
        args={[camera, gl.domElement]}
        enableDamping={true}      // 启用阻尼（惯性效果）
        dampingFactor={0.05}      // 阻尼系数
        rotateSpeed={0.5}         // 旋转速度
        zoomSpeed={0.5}           // 缩放速度
        panSpeed={0.5}            // 平移速度
        minDistance={1}           // 最小缩放距离
        maxDistance={100}         // 最大缩放距离
        minPolarAngle={0}         // 最小垂直角度（弧度）
        maxPolarAngle={Math.PI}   // 最大垂直角度（弧度）
        enableZoom={true}         // 启用缩放
        enableRotate={true}       // 启用旋转
        enablePan={true}          // 启用平移
        screenSpacePanning={true} // 屏幕空间平移
        autoRotate={true}         // 自动旋转
        autoRotateSpeed={1}       // 自动旋转速度
      />
      
      {/* 通过 ref 控制 */}
      const controlsRef = useRef();
      <orbitControls ref={controlsRef} args={[camera, gl.domElement]} />
      
      {/* 在 useFrame 中更新 */}
      useFrame(() => {
        if (controlsRef.current) {
          controlsRef.current.update(); // 启用阻尼时需要每帧更新
        }
      });
    </>
  );
}
```



### 5. **如何添加灯光系统**

javascript

```
function SceneWithLights() {
  return (
    <>
      {/* 1. 环境光（Ambient Light）- 均匀照亮所有物体 */}
      <ambientLight
        intensity={0.5}           // 强度（0-1）
        color="white"             // 颜色
      />
      
      {/* 2. 平行光（Directional Light）- 类似太阳光 */}
      <directionalLight
        position={[5, 5, 5]}      // 光源位置
        intensity={1}             // 强度
        color="white"             // 颜色
        castShadow={true}         // 是否投射阴影
        shadow-mapSize-width={1024}  // 阴影贴图宽度
        shadow-mapSize-height={1024} // 阴影贴图高度
        shadow-camera-near={0.1}     // 阴影相机近平面
        shadow-camera-far={50}       // 阴影相机远平面
        shadow-camera-left={-10}     // 阴影相机左边界
        shadow-camera-right={10}     // 阴影相机右边界
        shadow-camera-top={10}       // 阴影相机上边界
        shadow-camera-bottom={-10}   // 阴影相机下边界
      />
      
      {/* 3. 点光源（Point Light）- 从一点向所有方向发光 */}
      <pointLight
        position={[0, 5, 0]}      // 位置
        intensity={1}             // 强度
        color="red"               // 颜色
        distance={10}             // 照射距离
        decay={2}                 // 衰减速度
        castShadow={true}
      />
      
      {/* 4. 聚光灯（Spot Light）- 锥形光 */}
      <spotLight
        position={[0, 10, 0]}     // 位置
        angle={Math.PI / 4}       // 照射角度（弧度）
        penumbra={0.1}            // 半影（边缘柔和度）
        intensity={1}             // 强度
        color="blue"              // 颜色
        castShadow={true}
        target={new THREE.Object3D()} // 照射目标
      />
      
      {/* 5. 半球光（Hemisphere Light）- 模拟天空和地面反射 */}
      <hemisphereLight
        skyColor="blue"           // 天空颜色
        groundColor="green"       // 地面颜色
        intensity={0.5}           // 强度
      />
      
      {/* 使用灯光 Helper（调试用） */}
      <directionalLightHelper />
      <pointLightHelper />
      <spotLightHelper />
      
      {/* 启用阴影的物体设置 */}
      <mesh castShadow>           {/* 投射阴影 */}
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      
      <mesh receiveShadow>        {/* 接收阴影 */}
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial />
      </mesh>
    </>
  );
}
```



### 6. **自定义几何体创建**

javascript

```
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

function CustomGeometry() {
  const geometryRef = useRef();
  
  // 创建顶点数据
  const vertices = useMemo(() => {
    // 创建3个三角形的顶点（9个顶点）
    const vertices = new Float32Array([
      // 三角形1
      0, 0, 0,
      1, 0, 0,
      0.5, 1, 0,
      
      // 三角形2
      1, 0, 0,
      2, 0, 0,
      1.5, 1, 0,
      
      // 三角形3
      2, 0, 0,
      3, 0, 0,
      2.5, 1, 0,
    ]);
    return vertices;
  }, []);
  
  // 创建索引（可选，用于减少重复顶点）
  const indices = useMemo(() => {
    const indices = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    return indices;
  }, []);
  
  // 创建法线（必要，用于光照计算）
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.computeVertexNormals();
    }
  }, []);
  
  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        {/* 顶点位置 */}
        <bufferAttribute
          attach="attributes-position"
          count={9}          // 顶点数量
          itemSize={3}       // 每个顶点的分量数（x, y, z）
          array={vertices}
        />
        
        {/* 顶点索引（可选） */}
        <bufferAttribute
          attach="index"
          count={9}
          itemSize={1}
          array={indices}
        />
        
        {/* 自定义UV坐标（可选，用于纹理） */}
        <bufferAttribute
          attach="attributes-uv"
          count={9}
          itemSize={2}
          array={new Float32Array([...])}
        />
      </bufferGeometry>
      
      {/* 使用材质 */}
      <meshStandardMaterial
        color="red"
        side={THREE.DoubleSide}  // 双面渲染
      />
    </mesh>
  );
}
```



**可能出现的问题及解决：**

1. **材质不显示**：确保有足够的光照
2. **黑色/不正常显示**：计算法线 `geometry.computeVertexNormals()`
3. **纹理不显示**：确保有UV坐标
4. **性能问题**：大量顶点时使用索引

**使用场景：**

- 动态生成的几何形状
- 从数据生成的可视化
- 自定义粒子系统
- 程序化生成的地形

### 7. **相机设置详解**

javascript

```
import { Canvas } from '@react-three/fiber';

function Scene() {
  // 透视相机配置
  const perspectiveCameraConfig = {
    fov: 75,                    // 视野角度（度）
    near: 0.1,                  // 近裁剪面
    far: 1000,                  // 远裁剪面
    position: [0, 0, 5],        // 位置 [x, y, z]
    zoom: 1,                    // 缩放级别
    aspect: window.innerWidth / window.innerHeight, // 宽高比
  };
  
  // 正交相机配置
  const orthographicCameraConfig = {
    left: -5,                   // 左边界
    right: 5,                   // 右边界
    top: 5,                     // 上边界
    bottom: -5,                 // 下边界
    near: 0.1,                  // 近裁剪面
    far: 1000,                  // 远裁剪面
    position: [0, 0, 5],        // 位置
    zoom: 1,                    // 缩放（重要！）
  };
  
  return (
    <>
      {/* 1. 透视相机（默认） */}
      <Canvas camera={perspectiveCameraConfig}>
        {/* 场景内容 */}
      </Canvas>
      
      {/* 2. 正交相机 */}
      <Canvas orthographic camera={orthographicCameraConfig}>
        {/* 场景内容 */}
      </Canvas>
      
      {/* 3. 动态切换相机 */}
      const [isOrthographic, setIsOrthographic] = useState(false);
      
      <Canvas orthographic={isOrthographic}>
        <SceneContent />
      </Canvas>
      
      {/* 4. 相机控制示例 */}
      <Canvas>
        {/* 相机控制器 */}
        <CameraController />
        
        {/* 场景内容 */}
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      </Canvas>
    </>
  );
}

// 相机控制器组件
function CameraController() {
  const { camera } = useThree();
  
  // 在 useFrame 中控制相机
  useFrame((state, delta) => {
    // 相机动画
    camera.position.x = Math.sin(state.clock.elapsedTime) * 5;
    camera.position.z = Math.cos(state.clock.elapsedTime) * 5;
    camera.lookAt(0, 0, 0);
    
    // 正交相机缩放
    if (camera.isOrthographicCamera) {
      camera.zoom = 1 + Math.sin(state.clock.elapsedTime) * 0.5;
      camera.updateProjectionMatrix(); // 必须调用！
    }
  });
  
  return null;
}
```



**相机切换注意事项：**

1. 正交相机使用 `orthographic` 属性
2. 正交相机的 `zoom` 属性很重要（默认值可能太小）
3. 修改相机参数后可能需要调用 `camera.updateProjectionMatrix()`
4. 相机参数变化时 Canvas 会自动处理

## 三、问题解答

### 1. **材质不显示/显示异常的原因**

javascript

```
// 情况1：缺少光照（Standard/MeshPhysicalMaterial需要光照）
<mesh>
  <boxGeometry />
  <meshStandardMaterial />  // ❌ 没有灯光时显示为黑色
  <meshBasicMaterial />     // ✅ 不受光照影响
</mesh>

// 情况2：法线计算错误（自定义几何体）
useEffect(() => {
  geometryRef.current.computeVertexNormals(); // ✅ 必须计算法线
}, []);

// 情况3：背面剔除
<mesh>
  <boxGeometry />
  <meshStandardMaterial side={THREE.DoubleSide} /> // ✅ 双面渲染
</mesh>

// 情况4：深度测试问题
<mesh material-depthTest={false} /> // 谨慎使用！

// 情况5：透明材质未正确设置
<mesh>
  <boxGeometry />
  <meshStandardMaterial
    transparent={true}
    opacity={0.5}
  />
</mesh>
```



#### 2. 性能问题

**解决**：

javascript

```
<Canvas 
  dpr={[1, 2]}           // 自适应像素比
  performance={{ min: 0.5 }} // 性能监控
>
```



 **`performance={{ min: 0.5 }}` 详解**

javascript

```
<Canvas
  performance={{
    min: 0.5,      // 最低性能（0-1），当FPS低于阈值时触发降级
    max: 1,        // 最高性能
    current: 1,    // 当前性能等级
    debounce: 200, // 防抖时间（ms）
  }}
>
```

**作用机制：**

1. React Three Fiber 监控帧率（FPS）
2. 当帧率低于 `min` 设定的阈值时，触发性能降级
3. 降级可能包括：降低画质、减少更新频率等
4. 帧率恢复时自动提升性能

**实际变化：**

- 可能自动降低 `dpr`（像素比）
- 可能减少某些计算的频率
- 保持应用流畅性



#### 3. TypeScript 类型错误

**解决**：

javascript

```
// 扩展类型声明
declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: any;
      customObject: any;
    }
  }
}
```



**TypeScript 类型说明**

javascript

```
// 虽然你的代码不是 TypeScript，但了解类型有助于理解

// 扩展 OrbitControls 的类型定义
declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}

// 如果使用 TypeScript，需要这样扩展
extend({ OrbitControls });

// 或者在单独的文件中声明类型
// types/r3f.d.ts
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

declare module '@react-three/fiber' {
  interface ThreeElements {
    orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
  }
}
```



### 4. **进阶功能 - 响应式设计**

javascript

```
function ResponsiveScene() {
  const { viewport, size } = useThree();
  
  // 根据视口大小调整物体
  const scale = Math.min(viewport.width, viewport.height) / 5;
  
  // 响应鼠标
  const { mouse } = useThree();
  const meshRef = useRef();
  
  useFrame(() => {
    meshRef.current.position.x = mouse.x * 2;
    meshRef.current.position.y = mouse.y * 2;
  });
  
  return (
    <mesh ref={meshRef} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```



## 四、完整示例

javascript

```
// 1. 主文件
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

function App() {
  return (
    <Canvas
      camera={{
        fov: 45,
        position: [3, 2, 6],
      }}
      shadows // 启用阴影
    >
      <Scene />
    </Canvas>
  );
}

// 2. 场景文件
import { OrbitControls, Box, Sphere } from '@react-three/drei';
import CustomGeometry from './CustomGeometry';

function Scene() {
  return (
    <>
      <OrbitControls />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      
      <Box position={[-2, 0, 0]}>
        <meshStandardMaterial color="blue" />
      </Box>
      
      <Sphere position={[2, 0, 0]}>
        <meshStandardMaterial color="red" />
      </Sphere>
      
      <CustomGeometry />
    </>
  );
}
```



## 五、渲染器高级配置

### 1. **抗锯齿设置**

抗锯齿（Antialiasing）用于平滑3D模型的锯齿边缘，提高视觉质量。

javascript

```
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <>
      {/* 方法1：开启抗锯齿（默认 true） */}
      <Canvas antialias={true}>
        {/* 场景内容 */}
      </Canvas>
      
      {/* 方法2：通过 gl 属性配置 */}
      <Canvas
        gl={{
          antialias: true,           // 开启抗锯齿
          alpha: true,              // 开启透明度
          precision: 'highp',       // 精度设置（lowp/mediump/highp）
          powerPreference: 'high-performance', // 性能偏好
        }}
      >
        {/* 场景内容 */}
      </Canvas>
      
      {/* 方法3：使用 MSAA（多重采样抗锯齿）- 质量更高但性能消耗更大 */}
      <Canvas
        gl={(canvas) => {
          const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
          });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          return renderer;
        }}
      >
        {/* 场景内容 */}
      </Canvas>
    </>
  );
}
```



**抗锯齿效果对比：**

- `false`：性能最好，边缘有明显锯齿
- `true`：默认设置，平衡质量和性能
- MSAA：最高质量，适用于高精度需求

### 2. **色调映射设置**

色调映射（Tone Mapping）用于将HDR（高动态范围）颜色转换为LDR（低动态范围）屏幕颜色。

javascript

```
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function App() {
  return (
    <Canvas
      gl={{
        // 色调映射算法
        toneMapping: THREE.ACESFilmicToneMapping,  // 电影级色调，对比度较高
        // toneMapping: THREE.LinearToneMapping,      // 线性映射（默认）
        // toneMapping: THREE.ReinhardToneMapping,    // 莱因哈德算法
        // toneMapping: THREE.CineonToneMapping,      // 电影胶片效果
        // toneMapping: THREE.AgXToneMapping,         // AgX色调映射
        
        // 色调映射强度（0-1）
        toneMappingExposure: 1.0,
      }}
    >
      {/* 场景内容 */}
    </Canvas>
  );
}

// 不同色调映射效果对比
/*
1. THREE.LinearToneMapping（线性映射）
   - 最简单的映射
   - 可能在高亮区域丢失细节
   
2. THREE.ReinhardToneMapping（莱因哈德算法）
   - 保留高光和阴影细节
   - 适用于大多数场景
   
3. THREE.CineonToneMapping（电影胶片效果）
   - 模拟胶片感
   - 对比度较高
   
4. THREE.ACESFilmicToneMapping（ACES电影级）
   - 电影工业标准
   - 色彩鲜艳，对比度高
   - 推荐使用
*/
```



### 3. **输出编码设置**

输出编码定义了颜色如何从线性空间转换到显示器的颜色空间。

javascript

```
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function App() {
  return (
    <Canvas
      gl={{
        // 输出颜色编码
        outputEncoding: THREE.sRGBEncoding,  // sRGB颜色空间（推荐）
        // outputEncoding: THREE.LinearEncoding,  // 线性颜色空间
        // outputEncoding: THREE.RGBEEncoding,    // RGBE格式
        // outputEncoding: THREE.RGBM7Encoding,   // RGBM 7位
        // outputEncoding: THREE.RGBM16Encoding,  // RGBM 16位
        
        // 物理正确渲染（PBR）相关设置
        physicallyCorrectLights: true,  // 启用物理正确灯光
        gammaFactor: 2.2,              // Gamma校正因子
      }}
    >
      {/* 启用色彩管理 */}
      <color attach="background" args={['#000000']} />
      <Experience />
    </Canvas>
  );
}

// 重要：从 Three.js r152 开始，API 有所变化
// 新版本的 Three.js 使用颜色空间（colorSpace）替代 outputEncoding

function AppNewVersion() {
  return (
    <Canvas
      gl={{
        // 新版本 Three.js 的写法
        outputColorSpace: THREE.SRGBColorSpace,  // sRGB 颜色空间
        // outputColorSpace: THREE.LinearSRGBColorSpace,  // 线性 sRGB
        // outputColorSpace: THREE.DisplayP3ColorSpace,   // Display P3（广色域）
      }}
    >
      <Experience />
    </Canvas>
  );
}
```



## 六、背景色设置对比

### **方法1：CSS 设置背景色**

css

```
/* style.css */
#root, canvas {
  width: 100%;
  height: 100%;
  background-color: #000000;  /* 黑色背景 */
  /* 或使用渐变 */
  background: linear-gradient(45deg, #1a1a2e, #16213e);
}
```



**优点：**

- 简单，纯 CSS 实现
- 可以设置渐变、图片等复杂背景
- 不占用 WebGL 资源

**缺点：**

- 无法与 3D 场景深度混合
- 不能用于后期处理效果
- 背景不能与 3D 内容交互

### **方法2：Three.js 设置背景色**

javascript

```
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function App() {
  return (
    <>
      {/* 方法A：使用 color 组件 */}
      <Canvas>
        <color attach="background" args={['#000000']} />
        {/* 或使用 Three.js 颜色对象 */}
        <color attach="background" args={[new THREE.Color('#000000')]} />
        {/* 或直接设置颜色值 */}
        <color attach="background" args={[0, 0, 0]} /> {/* RGB 值 */}
        <Experience />
      </Canvas>
      
      {/* 方法B：通过 gl 属性设置 */}
      <Canvas
        gl={{
          // 设置背景色和透明度
          setClearColor: (renderer) => {
            renderer.setClearColor(new THREE.Color('#000000'), 1); // 颜色，透明度
            // 或使用十六进制
            renderer.setClearColor(0x000000, 1);
          }
        }}
      >
        <Experience />
      </Canvas>
      
      {/* 方法C：使用背景纹理 */}
      <Canvas>
        <Experience />
        {/* 添加天空盒或背景纹理 */}
        <mesh>
          <sphereGeometry args={[100, 64, 64]} />
          <meshBasicMaterial side={THREE.BackSide}>
            <texture attach="map" url="skybox.jpg" />
          </meshBasicMaterial>
        </mesh>
      </Canvas>
    </>
  );
}
```



**优点：**

- 可以设置透明背景
- 可以与后期处理效果结合
- 支持动态背景（如视频纹理）
- 可以设置天空盒等 3D 背景

**缺点：**

- 占用 WebGL 资源
- 实现相对复杂

### **推荐方案：**

- **静态纯色背景**：使用 CSS（性能更好）
- **透明背景**：使用 Three.js + `alpha: true`
- **动态/3D背景**：使用 Three.js 的背景设置
- **需要与场景交互的背景**：使用 Three.js

## 七、像素比设置详解

### **像素比（DPR - Device Pixel Ratio）**

像素比是物理像素与逻辑像素的比值，决定了渲染的清晰度。

javascript

```
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <>
      {/* 方法1：固定值 */}
      <Canvas dpr={1}>
        {/* 1:1 像素比，性能最好，可能模糊 */}
      </Canvas>
      
      <Canvas dpr={2}>
        {/* 2倍像素比，清晰，性能消耗大 */}
      </Canvas>
      
      {/* 方法2：范围设置（推荐） */}
      <Canvas dpr={[1, 2]}>
        {/*
          根据设备能力自动选择：
          - 低端设备：使用 1
          - 高端设备：使用 2
          - 中间值：自动插值
        */}
      </Canvas>
      
      {/* 方法3：动态计算 */}
      <Canvas
        dpr={Math.min(window.devicePixelRatio, 2)}
        /*
          限制最大像素比为 2，避免性能问题
          实际像素比 = min(设备像素比, 2)
        */
      >
        <Experience />
      </Canvas>
      
      {/* 方法4：通过 gl 属性设置 */}
      <Canvas
        gl={(canvas) => {
          const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
          });
          // 手动设置像素比
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          return renderer;
        }}
      >
        <Experience />
      </Canvas>
      
      {/* 方法5：响应式像素比 */}
      const [dpr, setDpr] = useState(1);
      
      useEffect(() => {
        const handleResize = () => {
          // 根据窗口大小调整像素比
          const width = window.innerWidth;
          const newDpr = width > 1200 ? 2 : width > 768 ? 1.5 : 1;
          setDpr(newDpr);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);
      
      <Canvas dpr={dpr}>
        <Experience />
      </Canvas>
    </>
  );
}
```



### **像素比设置对比**

| 设置方式                                     | 优点                   | 缺点               | 适用场景         |
| :------------------------------------------- | :--------------------- | :----------------- | :--------------- |
| `dpr={1}`                                    | 性能最佳               | 在高分屏上可能模糊 | 性能优先的应用   |
| `dpr={2}`                                    | 最清晰                 | 性能消耗大，发热   | 高质量展示       |
| `dpr={[1, 2]}`                               | 自适应，平衡性能和质量 | 需要测试不同设备   | 通用场景（推荐） |
| `dpr={Math.min(window.devicePixelRatio, 2)}` | 精确控制，利用设备能力 | 需要兼容性处理     | 专业应用         |

### **性能影响测试**

javascript

```
function PerformanceMonitor() {
  const { gl, performance } = useThree();
  
  useEffect(() => {
    // 监控帧率
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`FPS: ${fps}, DPR: ${gl.getPixelRatio()}`);
        frameCount = 0;
        lastTime = currentTime;
        
        // 根据 FPS 动态调整 DPR
        if (fps < 30) {
          gl.setPixelRatio(Math.max(gl.getPixelRatio() - 0.5, 1));
        } else if (fps > 60) {
          gl.setPixelRatio(Math.min(gl.getPixelRatio() + 0.5, 2));
        }
      }
      requestAnimationFrame(checkFPS);
    };
    
    checkFPS();
    return () => cancelAnimationFrame(checkFPS);
  }, [gl, performance]);
  
  return null;
}

// 在场景中使用
<Canvas>
  <PerformanceMonitor />
  <Experience />
</Canvas>
```



### **最佳实践建议**

1. **移动端**：`dpr={[1, 1.5]}`（平衡性能和电池寿命）
2. **桌面端**：`dpr={[1, 2]}`（根据GPU能力自适应）
3. **高质量展示**：`dpr={2}`（确保最佳视觉效果）
4. **性能敏感应用**：`dpr={1}`（游戏、复杂可视化）

## 八、完整配置示例

javascript

```
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Experience from './Experience';

function App() {
  // 相机配置
  const cameraSettings = {
    fov: 45,
    near: 0.1,
    far: 200,
    position: [3, 2, 6],
  };
  
  return (
    <Canvas
      // 相机设置
      camera={cameraSettings}
      
      // 性能优化
      dpr={[1, 2]}  // 自适应像素比
      performance={{
        min: 0.5,   // 最低性能阈值
        max: 1,     // 最高性能
        current: 1, // 当前性能等级
        debounce: 200, // 防抖时间
      }}
      
      // 阴影设置
      shadows
      shadow-map-type={THREE.PCFSoftShadowMap} // 软阴影
      
      // WebGL渲染器配置
      gl={{
        // 画布设置
        antialias: true,        // 抗锯齿
        alpha: true,            // 透明度
        preserveDrawingBuffer: false, // 保留绘图缓冲区
        
        // 颜色管理
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        outputEncoding: THREE.sRGBEncoding, // Three.js r152+
        // outputColorSpace: THREE.SRGBColorSpace, // Three.js r152+
        
        // 物理正确渲染
        physicallyCorrectLights: true,
        
        // 背景色
        setClearColor: (renderer) => {
          // 透明背景，用CSS设置背景色
          renderer.setClearColor(0x000000, 0);
        },
        
        // 高级设置
        powerPreference: 'high-performance', // 性能偏好
        precision: 'highp',                  // 着色器精度
        stencil: false,                      // 模板缓冲区
        depth: true,                         // 深度缓冲区
      }}
      
      // 事件管理
      eventSource={document.getElementById('root')}
      eventPrefix="client"
      
      // 帧率限制
      frameloop="always" // always | demand | never
      
      // 线性颜色空间（推荐）
      linear
      
      // 扁平化子元素（性能优化）
      flat
    >
      {/* 启用色彩管理 */}
      <color attach="background" args={['#000000']} />
      
      {/* 场景内容 */}
      <Experience />
    </Canvas>
  );
}
```



## 九、常见问题解决

### **问题1：为什么设置了背景色但不起作用？**

javascript

```
// ❌ 错误：CSS 背景被 Canvas 覆盖
<Canvas style={{ background: 'red' }}>
  {/* ... */}
</Canvas>

// ✅ 正确：使用 color 组件
<Canvas>
  <color attach="background" args={['red']} />
  {/* ... */}
</Canvas>

// ✅ 正确：使用 CSS 设置父元素背景
<div style={{ background: 'red', width: '100%', height: '100%' }}>
  <Canvas>
    {/* ... */}
  </Canvas>
</div>
```



### **问题2：抗锯齿在移动设备上无效？**

javascript

```
// 移动设备可能需要不同的设置
<Canvas
  gl={{
    antialias: true,
    // 移动设备优化
    powerPreference: 'default', // 避免 high-performance 导致问题
    failIfMajorPerformanceCaveat: false, // 允许降级
  }}
  dpr={1} // 降低像素比以提高性能
>
  {/* ... */}
</Canvas>
```



### **问题3：透明背景显示不正确？**

javascript

```
<Canvas
  gl={{
    alpha: true, // 必须开启
    setClearColor: (renderer) => {
      renderer.setClearColor(0x000000, 0); // 透明度为0
    },
  }}
  // CSS 设置透明背景
  style={{ background: 'transparent' }}
>
  <color attach="background" args={[0, 0, 0, 0]} /> {/* RGBA */}
  {/* ... */}
</Canvas>
```

# P58 Drei

## 一、三种控制器详解

### 1. **OrbitControls（轨道控制器）**

最简单易用的相机控制器，适合大多数3D场景导航。

javascript

```
import { OrbitControls } from '@react-three/drei'

function Scene() {
  return (
    <>
      <OrbitControls
        // 基本配置
        makeDefault={true}           // 设为默认控制器，加入TransformControls等会导致界面跟着移动，这个选项可以解决
        enableDamping={true}         // 启用惯性效果（更流畅）
        dampingFactor={0.05}         // 惯性系数
        
        // 移动限制
        minDistance={1}              // 最小缩放距离
        maxDistance={100}            // 最大缩放距离
        minPolarAngle={0}            // 最小垂直角度（弧度）
        maxPolarAngle={Math.PI}      // 最大垂直角度（弧度）
        minAzimuthAngle={-Infinity}  // 最小水平角度
        maxAzimuthAngle={Infinity}   // 最大水平角度
        
        // 速度控制
        rotateSpeed={0.5}            // 旋转速度
        zoomSpeed={0.5}              // 缩放速度
        panSpeed={0.5}               // 平移速度
        
        // 功能开关
        enableZoom={true}            // 启用缩放
        enableRotate={true}          // 启用旋转
        enablePan={true}             // 启用平移
        
        // 其他设置
        screenSpacePanning={true}    // 屏幕空间平移
        autoRotate={true}            // 自动旋转
        autoRotateSpeed={1}          // 自动旋转速度
        reverseOrbit={false}         // 反向轨道
      />
      
      {/* 场景内容 */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  )
}
```



### 2. **TransformControls（变换控制器）**

用于在场景中交互式地移动、旋转和缩放物体。

javascript

```
import { TransformControls } from '@react-three/drei'
import { useRef } from 'react'

function Scene() {
  const meshRef = useRef()
  const transformRef = useRef()
  
  return (
    <>
      {/* 绑定到特定物体的变换控制器 */}
      <TransformControls
        ref={transformRef}
        object={meshRef}      // 要控制的物体引用
        mode="translate"      // 模式：translate(移动)/rotate(旋转)/scale(缩放)
        
        // 轴显示设置
        showX={true}          // 显示X轴
        showY={true}          // 显示Y轴
        showZ={true}          // 显示Z轴
        
        // 尺寸设置
        size={1}              // 控制器尺寸（Three.js单位）
        
        // 空间设置
        space="world"         // 空间：world(世界)/local(局部)
        
        // 变换约束
        translationSnap={0.5} // 移动吸附距离
        rotationSnap={Math.PI / 4} // 旋转吸附角度
        scaleSnap={0.1}       // 缩放吸附比例
      />
      
      {/* 受控制的物体 */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* 模式切换示例 */}
      <button onClick={() => transformRef.current.setMode('translate')}>
        移动模式
      </button>
      <button onClick={() => transformRef.current.setMode('rotate')}>
        旋转模式
      </button>
      <button onClick={() => transformRef.current.setMode('scale')}>
        缩放模式
      </button>
      
      {/* 启用/禁用 */}
      <button onClick={() => transformRef.current.setEnabled(!transformRef.current.enabled)}>
        切换控制器
      </button>
    </>
  )
}
```



### 3. **PivotControls（枢轴控制器）**

更高级的控制器，允许设置自定义枢轴点进行变换。

javascript

```
import { PivotControls } from '@react-three/drei'
import { useRef } from 'react'

function Scene() {
  const meshRef = useRef()
  
  return (
    <PivotControls
      // 枢轴点位置（关键！）
      anchor={[0, 0, 0]}  // 相对于物体原点的位置
      /*
        anchor参数详解：
        [0, 0, 0] - 控制点在物体原点
        [1, 0, 0] - 控制点在物体X轴正方向1个单位处
        [0, 1, 0] - 控制点在物体Y轴正方向1个单位处
        [-1, 0, 0] - 控制点在物体X轴负方向1个单位处
        
        注意：这里的"单位"是Three.js单位，取决于你的场景尺度
        比如你的立方体尺寸是1x1x1，那么[1, 0, 0]就是立方体右边的中心点
      */
      
      // 深度测试（避免被物体遮挡）
      depthTest={false}
      
      // 线条宽度
      lineWidth={4}
      
      // 轴颜色
      axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
      
      // 固定屏幕大小
      fixed={true}
      /*
        fixed: true 时，控制器在屏幕上的大小保持不变
        无论相机距离多远，控制器在屏幕上总是显示相同的大小
        这对于远距离操作非常有用
      */
      
      // 缩放比例
      scale={100}
      /*
        scale参数详解：
        当 fixed=true 时，这个值表示控制器的"视觉大小"
        值越大，控制器在屏幕上看起来越大
        100是一个经验值，通常需要根据场景调整
        
        注意：这个值不是像素单位，而是一个相对比例
        它影响的是控制器在3D空间中的实际尺寸
        但由于fixed=true，这个尺寸会自动调整以保持屏幕大小不变
      */
      
      // 其他设置
      visible={true}           // 是否可见
      disableAxes={false}      // 禁用轴
      disableSliders={false}   // 禁用滑块
      disableRotations={false} // 禁用旋转
      
      // 事件回调
      onDragStart={() => console.log('开始拖动')}
      onDrag={(l, dl, w, dw) => console.log('拖动中', w)}
      onDragEnd={() => console.log('拖动结束')}
    >
      {/* 受控制的物体 */}
      <mesh ref={meshRef}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </PivotControls>
  )
}
```



### 控制器对比

| 特性         | OrbitControls        | TransformControls      | PivotControls            |
| :----------- | :------------------- | :--------------------- | :----------------------- |
| **用途**     | 控制相机视角         | 编辑单个物体           | 以自定义点为中心编辑物体 |
| **控制对象** | 相机                 | 指定物体               | 指定物体（带枢轴点）     |
| **交互方式** | 鼠标拖拽、滚轮       | 拖动控制柄             | 拖动控制柄               |
| **主要功能** | 旋转、缩放、平移场景 | 移动、旋转、缩放物体   | 以枢轴点为中心变换物体   |
| **使用场景** | 场景导航、产品展示   | 3D建模工具、场景编辑器 | 动画制作、复杂变换       |
| **优点**     | 简单易用、适合浏览   | 精确控制、多种模式     | 灵活枢轴、适合动画       |
| **缺点**     | 不能编辑物体         | 枢轴点固定             | 相对复杂                 |

## 二、Html组件详解

允许在3D场景中渲染HTML内容。

javascript

```
import { Html } from '@react-three/drei'
import { useRef } from 'react'

function Scene() {
  const sphereRef = useRef()
  const cubeRef = useRef()
  
  return (
    <>
      <mesh ref={sphereRef} position={[-2, 0, 0]}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
        
        <Html
          // 位置设置
          position={[1, 1, 0]}  // 相对于物体的偏移位置
          /*
            这里的[1, 1, 0]表示：
            x: 物体右边1个单位
            y: 物体上方1个单位
            z: 与物体相同深度
          */
          
          // 包装器设置
          wrapperClass="label"  // 外部容器CSS类
          center={true}         // 内容居中
          
          // 距离因子（重要！）
          distanceFactor={6}
          /*
            distanceFactor 控制HTML内容随相机距离的缩放
            值越大，HTML内容在远处看起来越大
            设为0时禁用自动缩放，保持固定屏幕大小
            
            计算方式：
            HTML屏幕大小 = 原始大小 × distanceFactor / 相机距离
          */
          
          // 遮挡设置
          occlude={[sphereRef, cubeRef]}
          /*
            occlude 参数：
            true - 使用整个场景进行遮挡检测
            [ref1, ref2] - 只检测指定物体的遮挡
            false - 不进行遮挡检测
            
            当HTML被指定物体遮挡时，会自动隐藏
          */
          
          // 其他设置
          transform={true}      // 应用物体变换
          sprite={false}        // 是否始终面向相机（公告牌效果）
          zIndexRange={[100, 0]} // z-index范围
          pointerEvents="auto"  // 鼠标事件处理
          style={{ color: 'white' }} // 内联样式
          as="div"              // HTML标签类型
          
          // 计算位置（高级）
          calculatePosition={(el, camera, size) => {
            // 自定义位置计算函数
            return [0, 0, 0]
          }}
        >
          {/* HTML内容 */}
          <div className="tooltip">
            <h3>球体</h3>
            <p>半径: 1单位</p>
            <button onClick={() => alert('点击了球体！')}>
              详情
            </button>
          </div>
        </Html>
      </mesh>
      
      {/* 另一个示例：固定屏幕位置的HTML */}
      <Html
        fullscreen  // 全屏模式
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          fontSize: '20px',
          zIndex: 1000
        }}
      >
        <div>3D场景控制器</div>
        <button>重置视角</button>
      </Html>
    </>
  )
}

// 对应的CSS
// .label {
//   background: rgba(0, 0, 0, 0.7);
//   padding: 10px;
//   border-radius: 5px;
//   color: white;
//   pointer-events: auto;
// }
```



## 三、SDF（有符号距离场）字体

### 什么是SDF？

SDF（Signed Distance Field）是一种表示字体的技术：

1. **原理**：每个像素存储到最近字符边界的距离（内部为正，外部为负）
2. **优点**：
   - 任意缩放不会失真
   - 边缘清晰锐利
   - 支持高质量抗锯齿
   - 可实现描边、发光等效果
3. **缺点**：需要预先生成，文件体积较大

### 字体准备步骤：

[文字格式网站](https://transfonter.org/)；[文字资源网站](https://www.fontsquirrel.com/)

javascript

```
// 1. 访问 https://transfonter.org/
// 2. 上传字体文件（.ttf, .otf等）
// 3. 选择格式：通常选择 .woff（现代浏览器）或 .ttf（兼容性）
// 4. 下载转换后的字体文件
// 5. 将字体文件放入项目的 public 或 assets 目录

// 字体使用
import { Text } from '@react-three/drei'

function Scene() {
  return (
    <Text
      font="./fonts/bangers-regular.woff"  // 字体文件路径
      fontSize={1}                         // 字体大小（Three.js单位）
      color="salmon"                       // 字体颜色
      maxWidth={2}                         // 最大宽度（自动换行）
      lineHeight={1.2}                     // 行高
      letterSpacing={0.05}                 // 字间距
      textAlign="center"                   // 对齐方式：left/center/right
      anchorX="center"                     // X轴锚点：left/center/right
      anchorY="middle"                     // Y轴锚点：top/middle/bottom/baseline
      fillOpacity={1}                      // 填充不透明度
      strokeWidth={0.02}                   // 描边宽度
      strokeColor="#000000"                // 描边颜色
      strokeOpacity={0.5}                  // 描边不透明度
      outlineWidth={0}                     // 外边框宽度
      outlineColor="#000000"               // 外边框颜色
      outlineOpacity={1}                   // 外边框不透明度
      outlineBlur={0}                      // 外边框模糊
      outlineOffsetX={0}                   // 外边框X偏移
      outlineOffsetY={0}                   // 外边框Y偏移
      depthOffset={1}                      // 深度偏移（避免z-fighting）
      curveRadius={0}                      // 弯曲半径（弧形文字）
      material={null}                      // 自定义材质（覆盖color等设置）
    >
      我是3D文字
      {/* 可以直接使用材质作为子元素 */}
      {/* <meshNormalMaterial /> */}
    </Text>
  )
}
```



## 四、Float组件

创建漂浮动画效果。

javascript

```
import { Float } from '@react-three/drei'

function Scene() {
  return (
    <Float
      // 漂浮速度
      speed={5}  // 完整漂浮周期所需时间（秒）
      
      // 漂浮强度
      floatIntensity={2}  // 漂浮幅度（Three.js单位）
      /*
        floatIntensity: 1 表示物体上下浮动1个单位
        值越大，浮动范围越大
      */
      
      // 旋转强度
      rotationIntensity={1}  // 旋转幅度
      
      // 漂浮轴限制
      floatingRange={[-1, 1]}  // Y轴浮动范围 [min, max]
      
      // 动画配置
      children={null}  // 子元素（自动添加漂浮效果）
    >
      {/* 任何3D物体都会获得漂浮效果 */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>
    </Float>
  )
}

// 多个物体同时漂浮（同步动画）
<Float speed={3} floatIntensity={1}>
  <group>
    <mesh position={[-2, 0, 0]}>
      <sphereGeometry />
    </mesh>
    <mesh position={[2, 0, 0]}>
      <boxGeometry />
    </mesh>
  </group>
</Float>

// 不同步漂浮（每个物体独立动画）
<mesh>
  <Float speed={Math.random() * 2 + 1} floatIntensity={0.5}>
    <sphereGeometry />
  </Float>
  <meshStandardMaterial />
</mesh>
```



## 五、MeshReflectorMaterial（反射材质）

创建逼真的地面反射效果。

javascript

```
import { MeshReflectorMaterial } from '@react-three/drei'

function Scene() {
  return (
    <mesh position={[0, -1, 0]} rotation-x={-Math.PI * 0.5}>
      <planeGeometry args={[10, 10]} />
      
      <MeshReflectorMaterial
        // 反射设置
        mirror={0.5}  // 反射强度（0-1）
        /*
          mirror: 0 - 无反射
          mirror: 0.5 - 半反射（常用）
          mirror: 1 - 完全镜面反射
        */
        
        // 模糊设置
        blur={[1000, 1000]}  // 模糊强度 [x轴, y轴]
        mixBlur={1}          // 模糊混合强度
        /*
          blur: [0, 0] - 无模糊（清晰反射）
          blur: [1000, 1000] - 高度模糊（常用）
          值越大越模糊
        */
        
        // 分辨率
        resolution={512}  // 反射贴图分辨率
        /*
          分辨率影响反射质量：
          256 - 低质量，性能好
          512 - 中等质量（常用）
          1024 - 高质量，性能消耗大
        */
        
        // 颜色设置
        color="greenyellow"  // 材质颜色
        transparent={false}  // 是否透明
        opacity={1}          // 不透明度
        
        // 纹理设置
        // mixStrength={1}  // 纹理混合强度
        // depthToBlurRatioBias={0.25}  // 深度模糊比例
        
        // 调试设置
        // debug={0}  // 调试模式：0关闭，1显示深度，2显示法线
        // reflectorOffset={0}  // 反射偏移（解决自反射问题）
      />
    </mesh>
  )
}

// 高级用法：自定义纹理
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

function AdvancedReflector() {
  const texture = useLoader(THREE.TextureLoader, 'textures/ground.jpg')
  
  return (
    <MeshReflectorMaterial
      mirror={0.75}
      blur={[500, 500]}
      resolution={1024}
      mixBlur={10}
      mixStrength={2}
      depthScale={1}
      minDepthThreshold={0.9}
      maxDepthThreshold={1}
      depthToBlurRatioBias={0.25}
      distortion={1}
      color="#a0a0a0"
      metalness={0.5}
      roughness={1}
      roughnessMap={texture}
    />
  )
}
```



## 六、注意事项

### 性能优化

1. **Text组件**：大量文字时考虑使用位图字体或精灵图
2. **Html组件**：避免过多HTML元素，使用`occlude`优化
3. **MeshReflectorMaterial**：降低`resolution`和`blur`值提高性能
4. **PivotControls**：非编辑状态时隐藏控制器

