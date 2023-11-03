import React from 'react'
import Models from '@/components/home/3d/hero/Models';
import Cam from '@/components/home/3d/hero/Cam';
import { Physics } from "@react-three/rapier";
import { ContactShadows } from '@react-three/drei';

const Hero: React.FC<{ onDone?: () => void }> = ({ onDone }) => {

    return (
        <>
            <Physics colliders={false} debug>
                <Cam />
                <Models />

                <ContactShadows
                    scale={20}
                    blur={0.4}
                    opacity={0.2}
                    position={[-0, -1.5, 0]}
                />


            </Physics>
        </>
    )
}

export default Hero