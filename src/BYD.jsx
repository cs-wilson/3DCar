import * as THREE from "three";
import { useMemo, useState, useRef, useEffect } from "react";
import { applyProps, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { folder, useControls } from "leva";
import TWEEN from "@tweenjs/tween.js";
import { useDoorState, operateDoor } from "./DoorUtils";
import { useMaterialControls, applyMaterialProps } from "./ControlUtils";

const BYD = (props) => {
  const { scene, nodes, materials } = useGLTF("/car.glb");
  const { camera } = useThree();

  const leftFrontDoorRef = useRef();
  const rightFrontDoorRef = useRef();
  const leftRearDoorRef = useRef();
  const rightRearDoorRef = useRef();
  const trunkRef = useRef();

  const doorConfigs = {
    左前门: {
      ref: leftFrontDoorRef,
      rotationAxis: "Y",
      rotationAngle: -Math.PI / 3,
    },
    右车门: {
      ref: rightFrontDoorRef,
      rotationAxis: "Y",
      rotationAngle: Math.PI / 3,
    },
    左后门: {
      ref: leftRearDoorRef,
      rotationAxis: "Y",
      rotationAngle: -Math.PI / 3,
    },
    右后门: {
      ref: rightRearDoorRef,
      rotationAxis: "Y",
      rotationAngle: Math.PI / 3,
    },
    后备箱: { ref: trunkRef, rotationAxis: "Z", rotationAngle: Math.PI / 3 },
  };

  const [doorState, toggleDoorState] = useDoorState({
    左前门: false,
    右车门: false,
    左后门: false,
    右后门: false,
    后备箱: false,
  });

  const control = useMaterialControls({
    metal_color: "#ffffff",
    metal_roughness: 0.2,
    metal_metalness: 1.0,
    rearview_color: "#ffffff",
    rearview_roughness: 0.1,
    rearview_metalness: 1.0,
    rearview_MapIntensity: 1,
    shell_color: "#efb1b1",
    shell_clearCoat: 0.0,
    shell_clearCoatRoughness: 0.0,
    shell_roughness: 0.19,
    shell_metalness: 0.87,
    shell_sheen: 0.0,
    shell_sheenRoughness: 0.0,
    glass_color: "#eaf8ff",
    glass_roughness: 0.04,
    glass_metalness: 0.29,
    glass_transparency: true,
    glass_transmission: 1,
    frontlight_color: "#ffffff",
    frontlight_transparency: true,
    frontlight_opacity: 0.2,
    rearlight_color: "#ff0000",
    rearlight_transparency: true,
    rearlight_opacity: 0.2,

  });

  useMemo(() => {
    Object.values(nodes).forEach((node) => {
      applyMaterialProps(node, control);

      if (doorConfigs[node.name]) {
        doorConfigs[node.name].ref.current = node;
      }
    });
  }, [nodes, control]);

  useEffect(() => {
    const animate = () => {
      TWEEN.update();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      TWEEN.removeAll();
    };
  }, []);

  const handleOpenDoor = (event) => {
    event.stopPropagation(); // Prevents the event from bubbling up the DOM tree

    const raycaster = new THREE.Raycaster();
    const coords = new THREE.Vector2();
    coords.x = (event.clientX / window.innerWidth) * 2 - 1;
    coords.y = -(event.clientY / window.innerHeight) * 2 + 1;

    camera.updateMatrixWorld();
    raycaster.setFromCamera(coords, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const doorName = intersectedObject.parent.name;

      if (doorConfigs[doorName]) {
        const doorConfig = doorConfigs[doorName];
        const isOpen = doorState[doorName];
        const rotationAxis = doorConfig.rotationAxis;
        const rotationAngle = doorConfig.rotationAngle;

        // doorConfig.ref.current[`rotate${rotationAxis}`](
        //   isOpen ? -rotationAngle : rotationAngle
        // );

        operateDoor(
          doorConfig.ref.current,
          rotationAxis,
          isOpen ? rotationAngle : 0,
          isOpen ? 0 : rotationAngle
        );

        toggleDoorState(doorName);

        console.log(`${doorName} clicked. State: ${doorState[doorName]}`);
      } else {
        console.log("No door clicked");
      }
    }
  };

  return <primitive object={scene} {...props} onClick={handleOpenDoor} />;
};

export default BYD;
