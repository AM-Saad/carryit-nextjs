import { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Image from "next/image";

import socket from '@/lib/socket/trip'
import Response, { Status } from "@/shared/modals/Response";
import { ShipmentStatus } from "@/modals/Shipment";
import { DRIVER_SHIPMENTS_ROUTE } from "@/lib/constants";

const AnyReactComponent = ({ text }: any) => <>
    <Image
        src='/convertiblecar.png '
        alt='Drivers'
        width='45'
        height='45'
    />
</>


const Map: React.FC<{ shipmentId: string }> = ({ shipmentId }) => {
    const [marker, setMarker] = useState<any>(null)

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 16
    };


    function getLocation() {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            return;

        }
        navigator.permissions.query({ name: 'geolocation' })
            .then((res) => {
                if (res.state === 'denied') return setError('Allow location permission in order to start')
                if (res.state === 'prompt') return setError('Allow location permission in order to start, if the popup is not showing, please make sure you have enabled GPS in your device')
                if (res.state != 'granted') {
                    return setError('Allow location permission in order to start')
                }
            })
        setInterval(move, 3000)
    }



    const move = () => {
        navigator.geolocation.getCurrentPosition(function (position,) {
            setMarker({ lat: position.coords.latitude, lng: position.coords.longitude })
            socket.emit("move", { id: shipmentId, coords: { lat: position.coords.latitude, long: position.coords.longitude } });
        }, hasError, { timeout: 3000 });
    }



    const hasError = (error: any) => {
        console.log(error)
    }


    const changeStatus = async () => {
        const token = localStorage.getItem('didjwt')
        try {
            setLoading(true)
            const res = await fetch(`${DRIVER_SHIPMENTS_ROUTE}/${shipmentId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: ShipmentStatus.Shipped })
            })
            const data: Response<any> = await res.json()
            console.log(data)
            setLoading(false)
            if (data.status === Status.SUCCESS) {
                getLocation()
                return
            }
            setError(data.message)
        } catch (error: any) {
            setError(error.message || 'Something went wrong. Please try again later')
        }
    }


    useEffect(() => {
        socket.emit("register", { roomId: shipmentId, token: localStorage.getItem('didjwt') });

        if (!socket.connected) {
            setLoading(false)
            setError('Something went wrong. Please try again later')
        } else {


            socket.emit("register", { roomId: shipmentId, token: localStorage.getItem('didjwt') });
            socket.on("go", () => changeStatus());

            socket.on('ignored', reason => alert(reason))

            return () => {
                console.log('unmounting')
                socket.emit('shipment-closed', shipmentId)
                socket.disconnect()
            };
        }


    }, [])



    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            {loading && <div className="mt-3 p-2 text-blue-500"> Loading...</div>}
            {(!error && !loading) &&
                <>
                    {!marker && <div className="mt-3 p-2 text-blue-500"> Getting location...</div>}
                    {marker && <GoogleMapReact
                    bootstrapURLKeys={{ key:  process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY! }}

                        defaultCenter={marker}
                        defaultZoom={defaultProps.zoom}

                    >
                        <AnyReactComponent
                            lat={marker.lat}
                            lng={marker.lng}
                        />
                    </GoogleMapReact>}
                </>

            }
            {error && !loading && <div className="mt-3 p-2 text-red-500">
                {error}
            </div>}
        </div>
    );
}

export default Map;