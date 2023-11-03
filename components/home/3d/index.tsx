import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react'
import MapT from '@/components/home/3d/map/Scene'
import Hero from '@/components/home/3d/hero';


export default function Map() {
    const [dpr, setDpr] = useState(1.5)



    return (
        <>
            <Canvas
                style={{ width: '100vw', height: '100vh', margin: '0 auto' }}
                performance={{ min: 0.5, max: 1 }}
                dpr={dpr}
            >
                <Hero />
            </Canvas>
            <Canvas
                style={{ width: '100vw', height: '110vh', margin: '0 auto' }}
                performance={{ min: 0.5, max: 1 }}
                dpr={dpr}
            >
                <ambientLight intensity={5} />
                <MapT />
            </Canvas>
        </>
    )
}
