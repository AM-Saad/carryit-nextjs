import { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Image from "next/image";

import socket from '@/lib/socket/trip'
import Response, { Status } from "@/shared/modals/Response";
import { Shipment, ShipmentStatus } from "@/modals/Shipment";
import { DRIVER_SHIPMENTS_ROUTE } from "@/lib/constants";
import Driver from "@/modals/Driver";
import Vehicle, { VehicleTypes } from "@/modals/Vehicle";

const AnyReactComponent: React.FC<{ type: VehicleTypes | undefined, lng: any, lat: any }> = ({ type }) => {
    let src = '/convertiblecar.png'



    if (type === VehicleTypes.MOTORCYCLE) src = '/bike.png'
    return <>
        <Image
            src={src}
            alt={type || 'car'}
            width='65'
            height='65'
        />
    </>
}

const Map: React.FC<{ shipmentId: string, shipment: Shipment, driver: Driver }> = ({ shipmentId, shipment, driver }) => {
    const [marker, setMarker] = useState<any>(null)

    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<any>('loading')

    const [vehcileMarker, setVehcileMarker] = useState<any>(null)

    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 16
    };

    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
    }

    async function checkLocationPermission() {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            return false
        }

        try {
            const res = await navigator.permissions.query({ name: 'geolocation' })
            if (res.state === 'denied') return setError('Allow location permission in order to start')
            if (res.state === 'prompt') return setError('Allow location permission in order to start, if the popup is not showing, please make sure you have enabled GPS in your device')
            if (res.state != 'granted') {
                return setError('Allow location permission in order to start')
            }
            let position: any = await getCurrentPosition()

            setMarker({ lat: position.coords.latitude, lng: position.coords.longitude })
            return {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        } catch (error: any) {
            setError(error.message || 'Something went wrong. Please try again later')
        }


    }




    const move = async () => {
        const position: any = await getCurrentPosition()

        setMarker({ lat: position.coords.latitude, lng: position.coords.longitude })

        socket.emit("move", { id: shipmentId, coords: { lat: position.coords.latitude, long: position.coords.longitude } });
        return {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
    }



    const hasError = (error: any) => {
        setError(error.message || 'Something went wrong. Please try again later')
    }



    const changeStatus = async () => {
        const token = localStorage.getItem('didjwt')
        if (!token) return

        try {
            const res = await fetch(`${DRIVER_SHIPMENTS_ROUTE}/${shipmentId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: ShipmentStatus.Shipped })
            })
            const data: Response<any> = await res.json()


            if (data.status != Status.SUCCESS) {
                return setError(data.message)
            }


        } catch (error: any) {
            setError(error.message || 'Something went wrong. Please try again later')
        }
    }



    const handleApiLoaded = async (map: any, maps: any) => {

        const directionsService = new google.maps.DirectionsService();

        const directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: "#333",
                strokeOpacity: 0.9,
                strokeWeight: 5,
            },
        });

        directionsRenderer.setMap(map);


        const state = await checkLocationPermission()
        if (!state) return
        // Create a marker for the starting point

        const driverMarker = new google.maps.Marker({
            position: { lat: state.lat, lng: state.lng },
            icon: {
                url: '/icons/car_marker.png',
                scaledSize: new google.maps.Size(40, 40),
                size: new google.maps.Size(50, 50),
            },
            map: map,
        });


        // Create a marker for the destination point
        const destinationMarker = new google.maps.Marker({
            position: {
                lat: shipment.receiver.autoCompleteBillingAddress.lat,
                lng: shipment.receiver.autoCompleteBillingAddress.lng
            },
            icon: {
                url: '/icons/location_marker.png',
                scaledSize: new google.maps.Size(40, 40),
                size: new google.maps.Size(50, 50)
            },
            map: map,
        });

        destinationMarker.setMap(map);
        driverMarker.setMap(map);


        const interval = setInterval(async () => {
            const position = await move()
            driverMarker.setPosition(position)
        }, 4000);

        setInterval(async () => {
            const position: any = await getCurrentPosition()

            calculateAndDisplayRoute(directionsService, directionsRenderer, { lat: position.coords.latitude, lng: position.coords.longitude })
        }, 10000);


        // Display the route between the points


    };



    async function calculateAndDisplayRoute(directionsService: any, directionsRenderer: any, marker: any) {

        const origin = new google.maps.LatLng(marker.lat, marker.lng);
        const destination = new google.maps.LatLng(shipment.receiver.autoCompleteBillingAddress.lat, shipment.receiver.autoCompleteBillingAddress.lng);

        try {
            const response = await directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                
            })
            console.log(response)
            directionsRenderer.setDirections(response);

        } catch (e: any) {
            setError(e.message)
        }

    }



    useEffect(() => {

        if (shipmentId) {
            socket.connect()
            socket.emit("register", { roomId: shipmentId, token: localStorage.getItem('didjwt') });
            socket.on("go", () => changeStatus());
            socket.on('ignored', reason => alert(reason))

            return () => {
                socket.emit('shipment-closed', shipmentId)
                socket.disconnect()
            }
        }

    }, [])


    return (
        <div className="h-full w-full">
            {status === 'loading' && <div className="mt-3 p-2 text-blue-500"> Loading...</div>}
            <>
                {!marker && <div className="mt-3 p-2 text-blue-500"> Getting location...</div>}
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY! }}
                    defaultCenter={defaultProps.center}
                    center={marker}
                    debounced={true}
                    defaultZoom={defaultProps.zoom}
                    yesIWantToUseGoogleMapApiInternals={true}
                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                    options={{
                        streetViewControl: true,
                        // streetViewControlOptions: {
                        //     position: google.maps.ControlPosition.LEFT_TOP,
                        // },
                        rotateControl: true,

                    }}
                >
                    {/* <AnyReactComponent
                            lat={marker.lat}
                            lng={marker.lng}
                            type={driver.vehicle?.vehicle_type}
                        />
                        <AnyReactComponent
                            lat={shipment.receiver.autoCompleteBillingAddress.lat}
                            lng={shipment.receiver.autoCompleteBillingAddress.lat}
                            type={driver.vehicle?.vehicle_type}


                        /> */}
                </GoogleMapReact>
            </>

            {error && status !== 'loading' && <div className="mt-3 p-2 text-red-500">
                {error}
            </div>}
        </div>
    );
}

export default Map;