import { Scroll, ScrollControls } from '@react-three/drei'
import React from 'react'
import { Html } from './Html'
import { Model as Scooter } from '@/components/home/3d/map/low-poly_scooter/Scene'
// import { useControls } from 'leva'

export const canvasLeft = () => {
    // Define your scale factor (e.g., 1 meter for every 100 pixels)
    const scaleFactor = 0.01; // Adjust this based on your scene's scale
    const canvasWidthInPixels = window.outerWidth;

    const canvasWidthInMeters = canvasWidthInPixels * scaleFactor;
    const leftPercentage = 0.2; // Adjust this value as needed
    const desiredXInMeters = (canvasWidthInMeters * leftPercentage) - (canvasWidthInMeters / 2);

    return desiredXInMeters;
}

function Map() {

    // const scooterCtrl = useControls('Scooter', {
    //     visible: true,
    //     castShadow: true,
    //     receiveShadow: true,
    //     position: [0, 0, 0],
    //     rotation: [.5, Math.PI, 0]
    // }, {
    //     collapsed: true,

    // })



    return (
        <group scale={[.7, .7, .7]}>
            <ScrollControls pages={3} >
                <Scroll>
                    <Scooter
                        rotation={[.5, Math.PI, 0]}
                        position={[0, 0, 0]}
                    />
                </Scroll>
                <Scroll html>
                    <Html />
                </Scroll>
            </ScrollControls>
        </group >
    )
}

export default Map