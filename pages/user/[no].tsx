import { useEffect, useState } from "react";
import Image from "next/image";
import socket from '@/lib/socket/trip'

import { useRouter } from "next/router";
import Response, { Error, Status } from '@/shared/modals/Response'
import { userLocationInfo } from "@/lib/utils";
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

import Layout from '@/components/layout'

const AnyReactComponent = ({ text }: any) => <>
    <Image
        src='/icons/car.png'
        alt='Drivers'
        width='45'
        height='45'
    />
</>


type Libraries = 'geometry' | 'places'
const libraries: Libraries[] = ['geometry', 'places']


const Map: React.FC<{ packageId: string }> = ({ packageId }) => {
    const [marker, setMarker] = useState<any>(null)

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!, libraries: libraries });

    const router = useRouter()
    const { no } = router.query as { no: string }




    useEffect(() => {
        if (no)
            socket.emit("watch", no, (data: any) => {
                setError(null)

                if (!data.ready) {
                    setError('Please wait for the driver to connect..')
                }

            });

        socket.on("readyToMove", (data: any) => {
            if (data) {
                setError(null)
            }
        });

        socket.on('notreadytomove', (data: any) => {
            console.log(data)
        })

        socket.on("move", (data: any) => {
            if (data) setError(null)
            console.log(data)
            // setTimeout(() => {
                setMarker({ lat: data.coords.lat, lng: data.coords.lng })
            // }, 2000)
        });

        socket.on("package-closed", (data: any) => setError('Please wait the driver is connecting..'));


        return () => {

            // window.removeEventListener("beforeunload", handleUnload);
        };
    }, [no])


    return (
        // Important! Always set the container height explicitly
        <Layout meta={
            {
                title: "Karry | Track Package",
                description: "Welcome to the ultimate logistics solution for brands! Our powerful SaaS platform makes it easy to manage your packages and drivers, assign deliveries with just a few clicks, and track your packages in real-time. Our system offers unparalleled transparency and visibility to both you and your customers, ensuring that everyone knows exactly where their package is at all times. With our automated driver assignment system and smart routing algorithms, deliveries are faster and more efficient than ever before. Say goodbye to headaches and delays, and hello to seamless logistics management with our app. Sign up today and streamline your logistics operations like never before!",
                keywords: "Karry, Track Package, Package Tracking, Track Package Online, Driver tracking, Delivery tracking ,Real-time location tracking, Order status, Package delivery tracking,  Restaurant delivery tracking "
            }
        }>
        <div style={{ height: '100vh', width: '100%' }}>
            {loading && <div className="mt-3 p-2 text-blue-500"> Loading...</div>}
            {(!error && !loading && !loadError) &&
                <>
                    {!isLoaded &&
                        <div className="mt-3 p-2 text-blue-500"> Getting location...</div>
                    }
                    {isLoaded &&
                        <GoogleMap
                            mapContainerClassName="h-96 w-full"
                            options={{
                                zoom: 19,
                                center: marker,
                                scaleControl: true,
                                tilt: 45,
                                heading: 180,
                                mapId:'90f87356969d889c'
                            }}
                        >

                            {marker && <Marker
                                position={marker}
                                icon={{
                                    url: '/icons/car.png',
                                    scaledSize: new window.google.maps.Size(45, 45),
                                    origin: new window.google.maps.Point(0, 0),
                                    anchor: new window.google.maps.Point(15, 15),
                                    
                                }}
                            />}
                        </GoogleMap>

                    }
                </>

            }
            {error && !loading && <div className="mt-3 p-2 text-red-500">
                {error}
            </div>}
        </div>
        </Layout>
    );
}

export default Map;