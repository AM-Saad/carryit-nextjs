import React, { useRef } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { canvasLeft } from "../Scene";

export function Model(props) {
  const { nodes, materials } = useGLTF("/3d/scene.gltf");
  const group = useRef();
  const scrollData = useScroll();
  const left = canvasLeft();

  function preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();

    return false;
  }

  useFrame(({ mouse, camera }) => {
    if (group.current) {
      // Handle X-axis motion

      let oscillation = Math.cos(scrollData.offset * (Math.PI / 0.6));
      group.current.position.x = oscillation;


      // Handle Y-axis motion
      const fullIntervalsY = Math.floor(scrollData.offset / 0.3);
      console.log('fullIntervalsY', fullIntervalsY)
      const progressY = (scrollData.offset % 0.3) / 0.3;
      console.log('progressY', progressY)
      const baseY = fullIntervalsY * 5;
      console.log('baseY', baseY)
      const newPositionY = baseY + 5 * progressY;
      console.log('newPositionY', newPositionY)
      group.current.position.y = -newPositionY;

 
    }
  });

  return (
    <group
      {...props}
      rotation={props.rotation}
      position={props.position}
      dispose={null}
      ref={group}
    >
      <group
        position={[0.11, 1.386, -0.332]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.183}
      >
        <mesh geometry={nodes.Object_28.geometry} material={materials.Body} />
        <mesh geometry={nodes.Object_29.geometry} material={materials.cOLA} />
      </group>
      <group
        position={[0, 0.401, 0.067]}
        rotation={[-0.096, 0, Math.PI / 2]}
        scale={0.129}
      >
        <mesh geometry={nodes.Object_31.geometry} material={materials.Body} />
        <mesh geometry={nodes.Object_32.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_33.geometry} material={materials.Cancap} />
      </group>
      <group
        position={[-0.006, 1.391, -0.451]}
        rotation={[0, 0, Math.PI / 2]}
        scale={0.217}
      >
        <mesh geometry={nodes.Object_37.geometry} material={materials.Body} />
        <mesh geometry={nodes.Object_38.geometry} material={materials.Cancap} />
        <mesh
          geometry={nodes.Object_39.geometry}
          material={materials["Material.014"]}
        />
      </group>
      <group position={[-0.022, 0.847, -0.351]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Object_43.geometry} material={materials.Body} />
        <mesh geometry={nodes.Object_44.geometry} material={materials.Cancap} />
      </group>
      {/* <mesh geometry={nodes.Object_4.geometry} material={materials['Material.006']} position={[-0.009, -0.01, -0.018]} scale={1.663} /> */}
      <mesh
        geometry={nodes.Object_6.geometry}
        material={materials["Material.013"]}
        position={[0.109, 1.4, -0.609]}
        scale={0.066}
      />
      <mesh
        geometry={nodes.Object_8.geometry}
        material={materials["tire.001"]}
        position={[0.284, 0.31, 0.815]}
        rotation={[-1.733, 0, 0]}
        scale={[-0.062, 0.281, 0.062]}
      />
      <mesh
        geometry={nodes.Object_10.geometry}
        material={materials.Cancap}
        position={[0.344, 0.338, 1.032]}
        rotation={[2.918, 0, -Math.PI / 2]}
        scale={[-0.063, 0.063, 0.063]}
      />
      <mesh
        geometry={nodes.Object_12.geometry}
        material={materials.tire}
        position={[0.109, 0.312, -0.901]}
        rotation={[-0.236, 0, Math.PI / 2]}
        scale={0.465}
      />
      <mesh
        geometry={nodes.Object_14.geometry}
        material={materials["Material.019"]}
        position={[0.108, 0.309, -0.899]}
        rotation={[0, 0, Math.PI / 2]}
      />
      <mesh
        geometry={nodes.Object_16.geometry}
        material={materials["Material.018"]}
        position={[-0.057, 0.325, 0.41]}
        rotation={[-2.869, 0, Math.PI / 2]}
        scale={[-0.103, 0.103, 0.103]}
      />
      <mesh
        geometry={nodes.Object_18.geometry}
        material={materials.tire}
        position={[0.087, 0.316, 0.141]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[0.08, 0.09, 0.08]}
      />
      <mesh
        geometry={nodes.Object_20.geometry}
        material={materials.cOLA}
        position={[-0.036, 1.101, 0.537]}
        rotation={[-Math.PI, 0, -Math.PI / 2]}
        scale={[-0.109, 0.091, 0.333]}
      />
      <mesh
        geometry={nodes.Object_22.geometry}
        material={materials["Material.015"]}
        position={[0.107, 0.819, 1.04]}
        scale={[0.116, 0.048, 0.048]}
      />
      <mesh
        geometry={nodes.Object_24.geometry}
        material={materials["Material.018"]}
        scale={0.102}
      />
      <mesh
        geometry={nodes.Object_26.geometry}
        material={materials["Material.016"]}
        position={[0.216, 0.443, -0.843]}
        rotation={[0.469, 0, -Math.PI]}
        scale={[-0.032, 0.196, 0.032]}
      />
      <mesh
        geometry={nodes.Object_35.geometry}
        material={materials.Body}
        position={[0.115, 0.849, 0.865]}
        rotation={[-Math.PI, 0, -Math.PI / 2]}
        scale={[-0.261, 0.557, 0.261]}
      />
      <mesh
        geometry={nodes.Object_41.geometry}
        material={materials.Body}
        position={[0.252, 0.702, -0.759]}
        rotation={[0, 0, Math.PI / 2]}
        scale={0.117}
      />
      <mesh
        geometry={nodes.Object_46.geometry}
        material={materials.tire}
        position={[0.109, 0.312, 0.803]}
        rotation={[0, 0, Math.PI / 2]}
        scale={0.465}
      />
      <mesh
        geometry={nodes.Object_48.geometry}
        material={materials["Material.019"]}
        position={[0.108, 0.309, 0.808]}
        rotation={[0, 0, Math.PI / 2]}
      />
    </group>
  );
}

useGLTF.preload("/3d/scene.gltf");