// Desc: Main App component
import "./App.css";
import React, { useEffect } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import BYD from "./BYD";
import { useRef } from "react";
import { useHelper } from "@react-three/drei";
import nx from "/env/nx.jpg";
import py from "/env/py.jpg";
import ny from "/env/ny.jpg";
import px from "/env/px.jpg";
import pz from "/env/pz.jpg";
import nz from "/env/nz.jpg";

const canvasStyle = {
  width: window.innerWidth,
  height: window.innerHeight - 100,
};

// const CameraSetUp = () => {
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   const { camera } = useThree();

//   useEffect(() => {
//     const handleResize = () => {
//       console.log("resize");
//       const width = window.innerWidth;
//       const height = window.innerHeight;
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//       camera.position.set(300, 200, 500);
//       camera.lookAt(0, 0, 0);
//     };

//     handleResize(); // Set initial camera position and aspect ratio
//     window.addEventListener("resize", handleResize);

//     return () => {
//       // Clean up event listener when component unmounts
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [camera]);

//   return <perspectiveCamera makeDefault fov={75} near={0.1} far={100} />;
// };

function DirectionalLightWithHelper({
  position,
  intensity,
  helperSize,
  helperColor,
}) {
  const light = useRef();
  useHelper(light, THREE.DirectionalLightHelper, helperSize, helperColor);
  return (
    <directionalLight ref={light} position={position} intensity={intensity} />
  );
}

function App() {
  return (
    <>
      <div>
        <h1>3D Car Model </h1>
        <Canvas
          style={canvasStyle}
          gl={{
            outputEncoding: THREE.sRGBEncoding,
            ganmaOutput: true,
            gammaFactor: 2.2,
          }}
          camera={{ position: [300, 200, 300], fov: 60, near: 0.1, far: 3000}}
        >
          <Environment
            files={[px, nx, py, ny, pz, nz]}
            background={false}
            backgroundIntensity={2}
          />

          <ambientLight intensity={1} />
          <DirectionalLightWithHelper
            position={[0, 50, 250]}
            intensity={2}
            helperSize={50}
            helperColor={"red"}
          />
          <DirectionalLightWithHelper
            position={[0, 50, -250]}
            intensity={1}
            helperSize={50}
            helperColor={"red"}
          />
          <DirectionalLightWithHelper
            position={[-300, 50, 0]}
            intensity={1}
            helperSize={50}
            helperColor={"red"}
          />
          <DirectionalLightWithHelper
            position={[300, 50, 0]}
            intensity={1}
            helperSize={50}
            helperColor={"red"}
          />
          <DirectionalLightWithHelper 
            position={[300, 100, -300]} 
            intensity={1} 
            helperSize={50} 
            helperColor={"red"}
          />
          <hemisphereLight intensity={0.5} />
          <BYD position={[0, 0, 0]} rotation={[0, Math.PI/4, 0]}/>
          <OrbitControls />
          <axesHelper args={[400]}  />

          {/* <CameraSetUp /> */}
          <color attach="background" args={["#15151a"]} />
          {/* <Effects /> */}
        </Canvas>
      </div>
    </>
  );
}

export default App;
