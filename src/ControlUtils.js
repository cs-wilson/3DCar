import { useState } from "react";
import { folder, useControls } from "leva";
import { applyProps } from "@react-three/fiber";
import * as THREE from "three";

const useMaterialControls = (initialState) => {
    const [materialControls, setMaterialControls] = useState(initialState);


    const { enabled, ...control } = useControls({
        高光金属: folder({
            metal_color: { value: materialControls.metal_color, label: "颜色" },
            metal_roughness: {
                value: materialControls.metal_roughness,
                min: 0,
                max: 1,
                label: "粗糙度",
            },
            metal_metalness: {
                value: materialControls.metal_metalness,
                min: 0,
                max: 1,
                label: "金属度",
            },
        }, {
            collapsed: true,
        }),
        后视镜: folder({
            rearview_color: { value: materialControls.rearview_color, label: "Color" },
            rearview_roughness: {
                value: materialControls.rearview_roughness,
                min: 0,
                max: 1,
                label: "Roughness",
            },
            rearview_metalness: {
                value: materialControls.rearview_metalness,
                min: 0,
                max: 1,
                label: "Metalness",
            },
            rearview_MapIntensity: {
                value: materialControls.rearview_MapIntensity,
                min: 0,
                max: 5,
                label: "EnvMapIntensity",
            },
        }),
        车外壳: folder({
            shell_color: { value: materialControls.shell_color, label: "Color" },
            shell_clearCoat: {
                value: materialControls.shell_clearCoat,
                min: 0,
                max: 1,
                label: "ClearCoat",
            },
            shell_clearCoatRoughness: {
                value: materialControls.shell_clearCoatRoughness,
                min: 0,
                max: 1,
                label: "ClearCoatRoughness",
            },
            shell_roughness: {
                value: materialControls.shell_roughness,
                min: 0,
                max: 1,
                label: "Roughness",
            },
            shell_metalness: {
                value: materialControls.shell_metalness,
                min: 0,
                max: 1,
                label: "Metalness",
            },
            shell_sheen: {
                value: materialControls.shell_sheen,
                min: 0,
                max: 1,
                label: "Sheen",
            },
            shell_sheenRoughness: {
                value: materialControls.shell_sheenRoughness,
                min: 0,
                max: 1,
                label: "SheenRoughness",
            },
        }),
        车玻璃: folder({
            glass_color: { value: materialControls.glass_color, label: "Color" },
            glass_roughness: {
                value: materialControls.glass_roughness,
                min: 0,
                max: 1,
                label: "Roughness",
            },
            glass_metalness: {
                value: materialControls.glass_metalness,
                min: 0,
                max: 1,
                label: "Metalness",
            },
            glass_transparency: {
                value: materialControls.glass_transparency,
                label: "Transparency",
            },
            glass_transmission: {
                value: materialControls.glass_transmission,
                min: 0,
                max: 2,
                label: "Transmission",
            },
        }),
        前灯罩: folder({
            frontlight_color: { value: materialControls.frontlight_color, label: "Color" },
            frontlight_transparency: {
                value: materialControls.frontlight_transparency,
                label: "Transparency",
            },
            frontlight_opacity: {
                value: materialControls.frontlight_opacity,
                min: 0,
                max: 1,
                label: "Opacity",
            },
        }),
        尾灯灯罩: folder({
            rearlight_color: { value: materialControls.rearlight_color, label: "Color" },
            rearlight_transparency: {
                value: materialControls.rearlight_transparency,
                label: "Transparency",
            },
            rearlight_opacity: {
                value: materialControls.rearlight_opacity,
                min: 0,
                max: 1,
                label: "Opacity",
            },
        }),
    });

    return control;
};

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
            node.material = new THREE.MeshPhysicalMaterial({
                color: control.shell_color,
                metalness: control.shell_metalness,
                roughness: control.shell_roughness,
                clearcoat: control.shell_clearCoat,
                clearcoatRoughness: control.shell_clearCoatRoughness,
                sheen: control.shell_sheen,
                sheenRoughness: control.shell_sheenRoughness,
            });
            // console.log(node.material)
        if (node.name.slice(0, 2) == "玻璃")
            node.material = new THREE.MeshPhysicalMaterial({
                color: control.glass_color,
                metalness: control.glass_metalness,
                roughness: control.glass_roughness,
                transparent: control.glass_transparency,
                transmission: control.glass_transmission,
            });
        if (node.name.slice(0, 3) == "前灯罩")
            applyProps(node.material, {
                color: control.frontlight_color,
                transparent: control.frontlight_transparency,
                opacity: control.frontlight_opacity,
            });

            if (node.name == "尾灯灯罩")
            applyProps(node.material, {
                color: control.rearlight_color,
                transparent: control.rearlight_transparency,
                opacity: control.rearlight_opacity,
            });
    }
};


export { useMaterialControls, applyMaterialProps };
