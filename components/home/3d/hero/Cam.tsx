import React, { useState } from 'react'
import { PerspectiveCamera } from '@react-three/drei';
import { useControls } from 'leva';
import { useSpring, a } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber';

const Cam = () => {
    const cameraCtl = useControls('Camera', {
        position: {

            x: 0,
            y: 0,
            z: 10
        },
        fov: 66,
        near: 0.10,
        far: 1000,
    }, {
        collapsed: true,
    });



    return (

        <PerspectiveCamera
            makeDefault
            position={[cameraCtl.position.x, cameraCtl.position.y, cameraCtl.position.z]}
            fov={cameraCtl.fov}
            near={cameraCtl.near}
            far={cameraCtl.far}
            aspect={window.innerWidth / window.innerHeight}

        />
    )
}

export default Cam