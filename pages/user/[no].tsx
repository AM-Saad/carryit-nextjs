import { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Image from "next/image";
import socket from '@/lib/socket/trip'

import { useRouter } from "next/router";
import Response, { Error, Status } from '@/shared/modals/Response'
import { userLocationInfo } from "@/lib/utils";
const AnyReactComponent = ({ text }: any) => <>
    <Image
        src='/convertiblecar.png'
        alt='Drivers'
        width='45'
        height='45'
    />
</>


const Map: React.FC<{ shipmentId: string }> = ({ shipmentId }) => {
    const [marker, setMarker] = useState<any>(null)

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()
    const { no } = router.query as { no: string }

    const getLocation = async () => {
        console.log('get location...')
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            return;

        }
        const location = await navigator.permissions.query({ name: 'geolocation' })
        if (location.state === 'granted') {
            const data = userLocationInfo()
            //    const respone = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${data.userCity}&&country=${data.userCountry}`, {
            //         method: 'GET',
            //         headers: {
            //             'X-Api-Key': 'cvRcg41pYNnynfOCRNv+bQ==yYh4w5Xoj0PKaPga'
            //         }
            //     })
            //     const data = await respone.json()
            //     setMarker({ lat: data[0].latitude, lng: data[0].longitude })

        }

    }


    useEffect(() => {
        console.log(no)
        if (no)
            socket.emit("watch", no, (data: any) => {
                if (!data.ready) {
                    setError('Please wait for the driver to connect..')
                } else {
                    setError(null)
                }
                getLocation()

            });

        socket.on("readyToMove", (data: any) => {
            if (data) {
                setError(null)
                getLocation()

            }
        });

        socket.on('notreadytomove', (data: any) => {
            console.log(data)
        })

        socket.on("move", (data: any) => {
            if (data) setError(null)
            setTimeout(() => {

                setMarker({ lat: data.coords.lat, lng: data.coords.long })
            }, 4000)
        });

        socket.on("shipment-closed", (data: any) => setError('Please wait the driver is connecting..'));


        return () => {

            // window.removeEventListener("beforeunload", handleUnload);
        };
    }, [no])

 



    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            {loading && <div className="mt-3 p-2 text-blue-500"> Loading...</div>}
            {(!error && !loading) &&
                <>
                    {!marker &&
                        <div className="mt-3 p-2 text-blue-500"> Getting location...</div>
                    }
                    {marker &&
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY! }}
                            defaultZoom={17}
                            debounced={true}
                            shouldUnregisterMapOnUnmount={true}
                            center={marker}
                        >
                            <AnyReactComponent
                                lat={marker.lat}
                                lng={marker.lng}

                            />
                        </GoogleMapReact>
                    }
                </>

            }
            {error && !loading && <div className="mt-3 p-2 text-red-500">
                {error}
            </div>}
        </div>
    );
}

export default Map;