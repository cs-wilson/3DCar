import * as THREE from "three";
import { useMemo, useRef } from "react";
import { applyProps, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { folder, useControls } from "leva";

const BYD = (props) => {
  const { scene, nodes, materials } = useGLTF("/car.glb");

  const { enabled, ...control } = useControls(
    {
      高光金属: folder(
        {
          metal_color: { value: "#ffffff", label: "颜色" },
          metal_roughness: { value: 0.2, min: 0, max: 1, label: "粗糙度" },
          metal_metalness: { value: 1.0, min: 0, max: 1, label: "金属度" },
        },
        { collapsed: true }
      ),
      后视镜: folder(
        {
          rearview_color: { value: "#ffffff", label: "Color" },
          rearview_roughness: {
            value: 0.1,
            min: 0,
            max: 1,
            label: "Roughness",
          },
          rearview_metalness: {
            value: 1.0,
            min: 0,
            max: 1,
            label: "Metalness",
          },
          rearview_MapIntensity: {
            value: 1,
            min: 0,
            max: 5,
            label: "EnvMapIntensity",
          },
        },
        { collapsed: true }
      ),
      车外壳: folder(
        {
          shell_color: { value: "#efb1b1", label: "Color" },
          shell_clearCoat: { value: 0.0, min: 0, max: 1, label: "ClearCoat" },
          shell_clearCoatRoughness: {
            value: 0.0,
            min: 0,
            max: 1,
            label: "ClearCoatRoughness",
          },
          shell_roughness: { value: 0.19, min: 0, max: 1, label: "Roughness" },
          shell_metalness: { value: 0.87, min: 0, max: 1, label: "Metalness" },
        },
        { collapsed: true }
      ),
      车玻璃: folder(
        {
          glass_color: { value: "#eaf8ff", label: "Color" },
          glass_roughness: { value: 0.04, min: 0, max: 1, label: "Roughness" },
          glass_metalness: { value: 0.29, min: 0, max: 1, label: "Metalness" },
          glass_transparency: { value: true, label: "Transparency" },
          glass_transmission: {
            value: 1,
            min: 0,
            max: 2,
            label: "Transmission",
          },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const { gl, scene: mainScene, camera } = useThree();
  const leftFrontDoorRef = useRef();
  const rightFrontDoorRef = useRef();
  const leftRearDoorRef = useRef();
  const rightRearDoorRef = useRef();
  const trunkRef = useRef();

  console.log(scene)
  console.log(mainScene)

  useMemo(() => {
    Object.values(nodes).forEach((node) => {
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
      }

      switch (node.name) {
        case "左前门":
          console.log("Left front door");
          leftFrontDoorRef.current = node;
          break;
        case "右车门":
          console.log("Right front door");
          rightFrontDoorRef.current = node;
          break;
        case "左后门":
          console.log("Left rear door");
          leftRearDoorRef.current = node;
          break;
        case "右后门":
          console.log("Right rear door");
          rightRearDoorRef.current = node;
          break;
        case "后备箱":
          console.log("Trunk");
          trunkRef.current = node;
          break;
        default:
          console.log("No door clicked");
      }
    });
  }, [nodes, materials, control]);

  let leftFrontDoorState = false;
  let rightFrontDoorState = false;
  let leftRearDoorState = false;
  let rightRearDoorState = false;
  let trunkState = false;

  const handleClick = (event) => {
    event.stopPropagation();

    const raycaster = new THREE.Raycaster();
    const coords = new THREE.Vector2();
    coords.x = (event.clientX / window.innerWidth) * 2 - 1;
    coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // console.log(event.clientX, event.clientY)
    // console.log(coords.x, coords.y)
    // console.log("camera.position", camera.position);
    // console.log(mainScene.children)
    camera.updateMatrixWorld();

    raycaster.setFromCamera(coords, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // const arrowHelper = new THREE.ArrowHelper(
    //   raycaster.ray.direction,
    //   raycaster.ray.origin,
    //   1000,
    //   "white"
    // );
    // scene.add(arrowHelper);
    // console.log("raycaster: ", raycaster.ray.direction, raycaster.ray.origin);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;

      switch (intersectedObject.parent.name) {
        case "左前门":
          console.log("Left front door clicked", leftFrontDoorState);
          leftFrontDoorRef.current.rotateY(
            leftFrontDoorState ? Math.PI / 3 : -Math.PI / 3
          );
          leftFrontDoorState = !leftFrontDoorState;
          break;
        case "右车门":
          console.log("Right front door clicked");
          rightFrontDoorRef.current.rotateY(
            rightFrontDoorState ? -Math.PI / 3 : Math.PI / 3
          );
          rightFrontDoorState = !rightFrontDoorState;
          break;
        case "左后门":
          console.log("Left rear door clicked");
          leftRearDoorRef.current.rotateY(
            leftRearDoorState ? Math.PI / 3 : -Math.PI / 3
          );
          leftRearDoorState = !leftRearDoorState;
          break;
        case "右后门":
          console.log("Right rear door clicked");
          rightRearDoorRef.current.rotateY(
            rightRearDoorState ? -Math.PI / 3 : Math.PI / 3
          );
          rightRearDoorState = !rightRearDoorState;

          break;
        case "后备箱":
          console.log("Trunk clicked");
          trunkRef.current.rotateZ(trunkState ? -Math.PI / 3 : Math.PI / 3);
          trunkState = !trunkState;

          break;
        default:
          console.log("No door clicked");
      }
    }
  };

  return <primitive object={scene} {...props} onPointerDown={handleClick} />;
};

export default BYD;
