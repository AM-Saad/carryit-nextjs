import { useControls } from 'leva'
import React from 'react'


const Lights: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => {

    const poitntLightCtl = useControls('Point Light', {
        visible: true,
        castShadow: true,
        receiveShadow: true,
        position: {
            x: 0,
            y: 7,
            z: 2
        },
        intensity: 10,
        color: '#c4c4c4',
        distance: 0,
        angle: 1,
        penumbra: 0.15,


    }, {
        collapsed: true
    })

    return (
        <>
            <group name={direction}>
                <ambientLight intensity={1} />
                <directionalLight
                    visible={poitntLightCtl.visible}
                    position={[poitntLightCtl.position.x, poitntLightCtl.position.y, poitntLightCtl.position.z]}
                    castShadow={poitntLightCtl.castShadow}
                    intensity={poitntLightCtl.intensity}
                    receiveShadow={poitntLightCtl.receiveShadow}
                    color={poitntLightCtl.color}
                />


            </group>
        </>

    )
}

export default Lights