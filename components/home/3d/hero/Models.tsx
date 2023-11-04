import React, { useMemo } from 'react'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import droid from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { ToyCar } from '@/components/home/3d/cars/Toy_car'
import { RobotCar } from '@/components/home/3d/cars/Robot_car'
import { useSpring, a } from '@react-spring/three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { extend } from '@react-three/fiber';
import { useControls } from 'leva';
import Lights from './Lights';
import { CuboidCollider, RigidBody } from '@react-three/rapier';

extend({ TextGeometry })



const index = () => {

    const textGeo = useMemo(() => {
        const font = new FontLoader().parse(droid)
        let geometry = new TextGeometry('Karry', {
            font: font,
            size: 5,
            height: 0.1,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: .5,
            bevelSize: 0.05,
            bevelOffset: .1,
            bevelSegments: 0,

        });
        return geometry
    }, [])


    // const robotCarCtl = useControls('Robot Car', {
    //     visible: true,
    //     castShadow: true,
    //     receiveShadow: true,
    //     position: {
    //         x: 8.7,
    //         y: 3,
    //         z: 0.1
    //     },
    //     rotation: {
    //         x: Math.PI / 2,
    //         y: -2,
    //         z: 0
    //     },
    // }, {
    //     collapsed: true
    // })



    const props: any = useSpring({
        position: [2, 0, 0],
        rotation: [(-Math.PI / 2) + 0.7, 0, -0.3],
        from: {
            position: [-2, 0, 0],
            rotation: [0, 0, 0],
        },
        delay: 2500,
        config: {
            duration: 1000,

        }
    })

    return (
        <>

            <a.group position={props.position} rotation={props.rotation} >
                <mesh position={[-7, 0, 0]} geometry={textGeo} receiveShadow castShadow >
                    <meshStandardMaterial color={'#222'} />
                </mesh>
                {/* <mesh>
                    <planeGeometry args={[30, 30]} />
                    <meshStandardMaterial color={planColor.color} />
                </mesh> */}

                {/* <mesh position={[-5, -2, 0]}>
                    <boxGeometry args={[.4, .4, .6]} />
                    <meshStandardMaterial color={'#32bd6c'} />
                </mesh> */}

           
                <ToyCar
                    rotaion={[Math.PI / 2, Math.PI / 2, 0]}
                    position={[-6.65, 5, 0.1]}
                    to={[-6.65, 1, 0.1]}
                    duration={1600}
                    color={'#d9c21f'}
                />

                <ToyCar
                    rotaion={[Math.PI / 2, Math.PI / 2, 0]}
                    position={[1.75, 3, 0.1]}
                    to={[1.75, .5, 0.1]}
                    duration={2000}
                />

                <RobotCar
                    position={[
                        8.7,
                        3,
                        0.1
                    ]}
                    rotation={[
                        Math.PI / 2,
                        -2,
                        0
                    ]}
                    to={[7, -1, 0.1]}
                    toRotation={[Math.PI / 2, -2, 0]}
                    duration={1600}
                    color={'#d03131'}
                    name={'robot-orange-car-1'}
                />



                <RobotCar
                    position={[6, -2, 0]}
                    to={[-9, -2, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                    toRotation={[Math.PI / 2, 0, 0]}
                    duration={4000}
                    color={'#31b5d0'}
                    name={'robot-car-2'}
                />
                <RobotCar
                    position={[7, -2, 0]}
                    to={[-7, -2, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                    toRotation={[Math.PI / 2, 0, 0]}
                    duration={4000}
                    color={'#31b5d0'}
                    name={'robot-car-2'}
                />


                <Lights direction='left' />


            </a.group>
        </>
    )
}
export default index