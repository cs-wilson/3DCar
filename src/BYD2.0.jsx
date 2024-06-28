import * as THREE from "three";
import { useMemo, useState, useRef, useEffect } from "react";
import { applyProps, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { folder, useControls } from "leva";
import TWEEN from "@tweenjs/tween.js";

const applyMaterialProps = (node, control) => {
    // console.log(node.name)
  if (node.isMesh) {
    if (node.name.slice(0, 4) == "高光金属")
      applyProps(node.material, {
        color: control.metal_color,
        metalness: control.metal_metalness,
        roughness: control.metal_roughness,
      });
    if (node.name.slice(0, 3) == "后视镜")
      applyProps(node.material, {
        color: control.rearview_color,
        metalness: control.rearview_metalness,
        roughness: control.rearview_roughness,
        envMapIntensity: control.rearview_MapIntensity,
      });
    if (node.name.slice(0, 2) == "外壳")
      applyProps(node.material, {
        color: control.shell_color,
        metalness: control.shell_metalness,
        roughness: control.shell_roughness,
        clearcoat: control.shell_clearCoat,
        clearcoatRoughness: control.shell_clearCoatRoughness,
      });
    if (node.name.slice(0, 2) == "玻璃")
      node.material = new THREE.MeshPhysicalMaterial({
        color: control.glass_color,
        metalness: control.glass_metalness,
        roughness: control.glass_roughness,
        transparent: control.glass_transparency,
        transmission: control.glass_transmission,
      });
    //   if (node.name.slice(0,3) == "前灯罩")
    //     applyProps(node.material, new THREE.MeshPhysicalMaterial({
    //         color: control.frontlight_color,
    //         metalness: control.frontlight_metalness,
    //         roughness: control.frontlight_roughness,
    //         transparent: control.frontlight_transparency,
    //         transmission: control.frontlight_transmission,
    //         envMapIntensity: control.frontlight_MapIntensity,
    //         ior: control.frontlight_ior,

    //     }));
    //     if (node.name == "尾灯灯罩")
    //     applyProps(node.material, {
    //         color: control.frontlight_color,
    //     });
  }
};

const useDoorState = (initialState) => {
  const [doorState, setDoorState] = useState(initialState);

  const toggleDoorState = (doorName) => {
    setDoorState((prevState) => {
      const newState = { ...prevState };
      newState[doorName] = !prevState[doorName];
      return newState;
    });
  };

  return [doorState, toggleDoorState];
};

const operateDoor = (door, rotationAxis, initialAngle, rotationAngle) => {
  const initialState = { angle: initialAngle };
  const tween = new TWEEN.Tween(initialState)
    .to({ angle: rotationAngle }, 1000)
    .onUpdate(() => {
      if (rotationAxis === "Y") {
        door.rotation.y = initialState.angle;
      }
      if (rotationAxis === "Z") {
        door.rotation.z = initialState.angle;
      }
    })
    .start();
  return tween;
};

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

  const [metalControl, setMetalControl] = useState({
    metal_color: "#ffffff",
    metal_roughness: 0.2,
    metal_metalness: 1.0,
  });

  const [rearviewControl, setRearviewControl] = useState({
    rearview_color: "#ffffff",
    rearview_roughness: 0.1,
    rearview_metalness: 1.0,
    rearview_MapIntensity: 1,
  });

  const [shellControl, setShellControl] = useState({
    shell_color: "#efb1b1",
    shell_clearCoat: 0.0,
    shell_clearCoatRoughness: 0.0,
    shell_roughness: 0.19,
    shell_metalness: 0.87,
  });

  const [glassControl, setGlassControl] = useState({
    glass_color: "#eaf8ff",
    glass_roughness: 0.04,
    glass_metalness: 0.29,
    glass_transparency: true,
    glass_transmission: 1,
  });

  const [frontlightControl, setFrontlightControl] = useState({
    frontlight_color: "#ffffff",
    frontlight_roughness: 0.1,
    frontlight_metalness: 1.0,
    frontlight_MapIntensity: 1,
    frontlight_transparency: true,
    frontlight_transmission: 1,
    frontlight_ior: 1.5,
    });



  const { enabled, ...control } = useControls({
    高光金属: folder({
      metal_color: { value: metalControl.metal_color, label: "颜色" },
      metal_roughness: {
        value: metalControl.metal_roughness,
        min: 0,
        max: 1,
        label: "粗糙度",
      },
      metal_metalness: {
        value: metalControl.metal_metalness,
        min: 0,
        max: 1,
        label: "金属度",
      },
    }, {
        collapsed: true,

    }),
    后视镜: folder({
      rearview_color: { value: rearviewControl.rearview_color, label: "Color" },
      rearview_roughness: {
        value: rearviewControl.rearview_roughness,
        min: 0,
        max: 1,
        label: "Roughness",
      },
      rearview_metalness: {
        value: rearviewControl.rearview_metalness,
        min: 0,
        max: 1,
        label: "Metalness",
      },
      rearview_MapIntensity: {
        value: rearviewControl.rearview_MapIntensity,
        min: 0,
        max: 5,
        label: "EnvMapIntensity",
      },
    }),
    车外壳: folder({
      shell_color: { value: shellControl.shell_color, label: "Color" },
      shell_clearCoat: {
        value: shellControl.shell_clearCoat,
        min: 0,
        max: 1,
        label: "ClearCoat",
      },
      shell_clearCoatRoughness: {
        value: shellControl.shell_clearCoatRoughness,
        min: 0,
        max: 1,
        label: "ClearCoatRoughness",
      },
      shell_roughness: {
        value: shellControl.shell_roughness,
        min: 0,
        max: 1,
        label: "Roughness",
      },
      shell_metalness: {
        value: shellControl.shell_metalness,
        min: 0,
        max: 1,
        label: "Metalness",
      },
    }),
    车玻璃: folder({
      glass_color: { value: glassControl.glass_color, label: "Color" },
      glass_roughness: {
        value: glassControl.glass_roughness,
        min: 0,
        max: 1,
        label: "Roughness",
      },
      glass_metalness: {
        value: glassControl.glass_metalness,
        min: 0,
        max: 1,
        label: "Metalness",
      },
      glass_transparency: {
        value: glassControl.glass_transparency,
        label: "Transparency",
      },
      glass_transmission: {
        value: glassControl.glass_transmission,
        min: 0,
        max: 2,
        label: "Transmission",
      },
    }),
    前车灯罩: folder({
        frontlight_color: { value: frontlightControl.frontlight_color, label: "Color" },
        frontlight_roughness: {
          value: frontlightControl.frontlight_roughness,
          min: 0,
          max: 1,
          label: "Roughness",
        },
        frontlight_metalness: {
          value: frontlightControl.frontlight_metalness,
          min: 0,
          max: 1,
          label: "Metalness",
        },
        frontlight_MapIntensity: {
          value: frontlightControl.frontlight_MapIntensity,
          min: 0,
          max: 5,
          label: "EnvMapIntensity",
        },
        frontlight_transparency: {
            value: frontlightControl.frontlight_transparency,
            label: "Transparency",
            },
        frontlight_transmission: {
            value: frontlightControl.frontlight_transmission,
            min: 0,
            max: 2,
            label: "Transmission",
        },
        frontlight_ior: {
            value: frontlightControl.frontlight_ior,
            min: 1,
            max: 2,
            label: "ior",
        },
    }),
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
