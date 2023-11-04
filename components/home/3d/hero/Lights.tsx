// import { useControls } from 'leva'
import React from 'react'


const Lights: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => {

    // const poitntLightCtl = useControls('Point Light', {
    //     visible: true,
    //     castShadow: true,
    //     receiveShadow: true,
    //     position: {
    //         x: 0,
    //         y: 7,
    //         z: 2
    //     },
    //     intensity: 10,
    //     color: '#c4c4c4',
    //     distance: 0,
    //     angle: 1,
    //     penumbra: 0.15,


    // }, {
    //     collapsed: true
    // })

    return (
        <>
            <group name={direction}>
                <ambientLight intensity={1} />
                <directionalLight
                    visible={true}
                    position={[0, 7, 0]}
                    castShadow={true}
                    intensity={10}
                    receiveShadow={true}
                    color={'#c4c4c4'}
                />


            </group>
        </>

    )
}

export default Lights