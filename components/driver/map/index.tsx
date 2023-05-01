import { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Image from "next/image";

import socket from '@/lib/socket/trip'

const AnyReactComponent = ({ text }: any) => <>
    <Image
        src='/driver.png '
        alt='Drivers'
        width='45'
        height='45'
    />
</>


const Map: React.FC<{ shipmentId: string }> = ({ shipmentId }) => {
    const [marker, setMarker] = useState<any>(null)
    const [browserCompatible, setBrowserCompatible] = useState<boolean>(true)
    const [permissionError, setPermissionError] = useState<string | null>(null)


    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 17
    };

    function getLocation() {
        if (!navigator.geolocation) {
            setBrowserCompatible(false)
            return;

        }
        // navigator.permissions.query({ name: 'geolocation' }).then((res) => {
        //     console.log(res)
        //     if (res.state === 'denied') {
        //         return setPermissionError('Allow location permission in order to start')
        //     }
        // })
        navigator.geolocation.getCurrentPosition(function (position,) {
            setMarker({ lat: position.coords.latitude, lng: position.coords.longitude })
            socket.emit("move", { id: shipmentId, coords: { lat: position.coords.latitude, long: position.coords.longitude } });
        }, hasError, {timeout:3000});
    }

    const hasError = (erro:any) =>{
        console.log(erro)
    }

    useEffect(() => {
        socket.emit("register", { roomId: shipmentId, token: localStorage.getItem('didjwt') });

        socket.on("start", () => console.log('start'));

        socket.on('ignored', reason => alert(reason))
        setInterval(() => getLocation(), 3000);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [])

    const handleUnload = (e) => {
        socket.emit('offline', shipmentId)
    };



    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            {(!permissionError && marker) &&
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY! }}
                    defaultCenter={marker}
                    defaultZoom={defaultProps.zoom}

                >
                    <AnyReactComponent
                        lat={marker.lat}
                        lng={marker.lng}
                    />
                </GoogleMapReact>
            }
            <div className="mt-3 p-2 text-red-500">

                {permissionError && <p>
                    {permissionError}
                </p>}
                {(!permissionError && !marker) && <p>
                    Something went wrong
                </p>}
                {!browserCompatible && <p>Browser not compatible.  Please use a modern browser.</p>}
            </div>
        </div>
    );
}

export default Map;