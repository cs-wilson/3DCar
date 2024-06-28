import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { useState } from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useTexture } from "@react-three/drei";
import map_url from "./assets/gltf/Tyre_Normal.png";
import { folder, useControls } from "leva";
import { useEffect } from "react";
import { Color, MeshStandardMaterial } from "three";
import * as THREE from "three";

function Car({ url, position, rotation, scale }) {
  // const [selectedObjectName, setSelectedObjectName] = useState(null);

  const gltf = useLoader(GLTFLoader, url);
  const colorMap = useLoader(TextureLoader, map_url);
  // const colorMap = useTexture(map_url)
  // console.log(colorMap)

  const envMap = useTexture([
    "env/px.jpg",
    "env/nx.jpg",
    "env/py.jpg",
    "env/ny.jpg",
    "env/pz.jpg",
    "env/nz.jpg",
  ]);

  console.log("环境贴图",envMap)

  const {
    color,
    roughness,
    metalness,
    mirror_colro,
    mirror_roughness,
    mirror_metaless,
    mirror_envMap,
    mirror_envMapIntensity,
  } = useControls({
    color: { value: "#000000", label: "Color" },
    roughness: { value: 0.5, min: 0, max: 1, label: "Roughness" },
    metalness: { value: 0.5, min: 0, max: 1, label: "Metalness" },
    Mirror: folder({
      mirror_colro: { value: "#ffffff", label: "Mirror Color" },
      mirror_roughness: {
        value: 0.5,
        min: 0,
        max: 1,
        label: "Mirror Roughness",
      },
      mirror_metaless: {
        value: 0.5,
        min: 0,
        max: 1,
        label: "Mirror Metalness",
      },
      mirror_envMap: {
        value: envMap,
        label: "Mirror EnvMap",
      },
      mirror_envMapIntensity: {
        value: 1,
        min: 0,
        max: 5,
        label: "Mirror EnvMap Intensity",
      },

    }),
  });

  useEffect(() => {
    //确保所有的材质都是MeshStandardMaterial
    // gltf.scene.traverse((node) => {
    //   if (node.isMesh) {
    //     if (!(node.material instanceof MeshStandardMaterial)) {
    //       console.log(node.name, node.material)
    //       node.material = new MeshStandardMaterial({ color: node.material.color });
    //     }
    //   }
    // });

    const tire = gltf.scene.getObjectByName("轮胎03");
    if (tire) {
      tire.material.color = new Color(color);
    }

    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.name.slice(0, 4) === "高光金属") {
          child.material = new THREE.MeshStandardMaterial({
            roughness: roughness,
            metalness: metalness,
          });
        } else if (child.name.slice(0, 3) === "后视镜") {
          // console.log(child.name, child.material);
          child.material = new THREE.MeshStandardMaterial({
            color: new Color(mirror_colro),
            roughness: mirror_roughness,
            metalness: mirror_metaless,
            envMap: mirror_envMap,
            envMapIntensity: mirror_envMapIntensity
          });
        }
      }
    });

    gltf.scene.traverse((node) => {
      if (node.isMesh && node.material) {
        console.log(node.name, node.material)
        node.material.envMap = envMap;
        node.material.envMapIntensity = 1;
        node.material.needsUpdate = true;
      }
    });
  }, [
    color,
    roughness,
    metalness,
    mirror_colro,
    mirror_roughness,
    mirror_metaless,
    mirror_envMap,
    mirror_envMapIntensity,
    
    envMap,
    gltf.scene,
  ]);

  return (
    <>
      <primitive
        object={gltf.scene}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </>
  );
}

export default Car;
