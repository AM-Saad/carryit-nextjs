/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 toy_car.glb 
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, a } from "@react-spring/three";

export function ToyCar(props) {
  const { nodes, materials } = useGLTF("/3d/toy_car.glb");
  const animation = useSpring({
    position: props.position,
    from: { position: props.to },
    loop: { reverse: true },
    config: { duration: props.duration },
  });
  
  const newMaterial = new THREE.MeshStandardMaterial({
    ...materials['Material'],
    color: props.color ? props.color : materials['Material'].color,
  });
  return (
    <a.group
      {...props}
      dispose={null}
      receiveShadow
      castShadow
      position={animation.position}
      rotation={[Math.PI / 2, Math.PI / 2, 0]}
      scale={[0.25, 0.25, 0.25]}
    >
      <mesh
        geometry={nodes.Body.geometry}
        material={newMaterial}
        position={[0, 1.45, 0]}
      >
        <mesh
          geometry={nodes.Cube003.geometry}
          material={materials.glass}
          position={[0, -0.001, 0]}
        />
        <mesh
          geometry={nodes.Cube004.geometry}
          material={materials.bumper}
          position={[-2.154, -0.746, 0]}
          scale={[0.056, 0.114, 1]}
        />
        <mesh
          geometry={nodes.Cube005.geometry}
          material={materials.bumper}
          position={[2.518, -0.845, 0]}
          rotation={[0, 0, -Math.PI]}
          scale={[0.056, 0.114, 1]}
        />
        <group
          position={[-1.811, -0.41, -1.012]}
          rotation={[0, -0.564, 0]}
          scale={[0.116, 0.116, 0.05]}
        >
          <mesh
            geometry={nodes.Cube010_1.geometry}
            material={materials.Material}
          />
          <mesh
            geometry={nodes.Cube010_2.geometry}
            material={materials["signal light"]}
          />
        </group>
        <group
          position={[-1.869, -0.41, -0.869]}
          rotation={[0, -0.274, 0]}
          scale={[0.116, 0.116, 0.101]}
        >
          <mesh
            geometry={nodes.Cube011_1.geometry}
            material={materials.Material}
          />
          <mesh
            geometry={nodes.Cube011_2.geometry}
            material={materials["brake light"]}
          />
        </group>
        <group
          position={[-1.908, -0.41, -0.706]}
          rotation={[0, -0.148, 0]}
          scale={[0.116, 0.116, 0.05]}
        >
          <mesh
            geometry={nodes.Cube012_1.geometry}
            material={materials.Material}
          />
          <mesh
            geometry={nodes.Cube012_2.geometry}
            material={materials["riverce light"]}
          />
        </group>
        <group
          position={[-1.928, -0.437, -0.003]}
          rotation={[0, 0.002, -0.193]}
          scale={[0.116, 0.078, 0.4]}
        >
          <mesh
            geometry={nodes.Cube013.geometry}
            material={materials.Material}
          />
          <mesh
            geometry={nodes.Cube013_1.geometry}
            material={materials["num plate"]}
          />
        </group>
        <group
          position={[-1.134, -0.959, 1.071]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.479, 0.233, 0.479]}
        >
          <mesh
            geometry={nodes.Cylinder004_1.geometry}
            material={materials.tyre}
          />
          <mesh
            geometry={nodes.Cylinder004_2.geometry}
            material={materials.rim}
          />
        </group>
        <group
          position={[1.55, -0.959, 1.071]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.479, 0.233, 0.479]}
        >
          <mesh
            geometry={nodes.Cylinder005_1.geometry}
            material={materials.tyre}
          />
          <mesh
            geometry={nodes.Cylinder005_2.geometry}
            material={materials.rim}
          />
        </group>
        <group
          position={[-1.134, -0.959, -1.072]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[0.479, 0.233, 0.479]}
        >
          <mesh
            geometry={nodes.Cylinder006_1.geometry}
            material={materials.tyre}
          />
          <mesh
            geometry={nodes.Cylinder006_2.geometry}
            material={materials.rim}
          />
        </group>
        <group
          position={[1.55, -0.959, -1.072]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[0.479, 0.233, 0.479]}
        >
          <mesh
            geometry={nodes.Cylinder007_1.geometry}
            material={materials.tyre}
          />
          <mesh
            geometry={nodes.Cylinder007_2.geometry}
            material={materials.rim}
          />
        </group>
        <mesh
          geometry={nodes.Cylinder008.geometry}
          material={materials.chrome}
          position={[-1.134, -0.959, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.024, 1, 0.024]}
        />
        <mesh
          geometry={nodes.Cylinder009.geometry}
          material={materials.chrome}
          position={[1.551, -0.959, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.024, 1, 0.024]}
        />
        <group position={[2.332, -0.43, 0.865]} scale={1.468}>
          <mesh
            geometry={nodes.Sphere_1.geometry}
            material={materials.Material}
          />
          <mesh geometry={nodes.Sphere_2.geometry} material={materials.Light} />
        </group>
        <group position={[2.414, -0.442, 0.501]} scale={1.142}>
          <mesh
            geometry={nodes.Sphere001_1.geometry}
            material={materials.Material}
          />
          <mesh
            geometry={nodes.Sphere001_2.geometry}
            material={materials.Light}
          />
        </group>
      </mesh>
    </a.group>
  );
}

useGLTF.preload("/3d/toy_car.glb");
