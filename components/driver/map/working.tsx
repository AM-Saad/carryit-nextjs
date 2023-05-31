import { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import socket from '@/lib/socket/trip'
import { registerSocketEvents } from '@/lib/socket/socketHandler';

import Response, { Status } from "@/shared/modals/Response";
import { Shipment, ShipmentStatus } from "@/modals/Shipment";
import { DRIVER_SHIPMENTS_ROUTE } from "@/lib/constants";
import Driver from "@/modals/Driver";
import Vehicle, { VehicleTypes } from "@/modals/Vehicle";
import { ClockIcon, CountdownTimerIcon } from "@radix-ui/react-icons";
import  MapClass  from '@/lib/initMap'
import useGoogleMapsLoaded from '@/lib/hooks/use-map';

const Map: React.FC<{ shipmentId: string, shipment: Shipment, driver: Driver }> = ({ shipmentId, shipment, driver }) => {
    const [marker, setMarker] = useState<any>(null)

    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<any>('loading')
    const [duration, setDuration] = useState<any>(null)
    const [distance, setDistance] = useState<any>(null)
    const [currentMap, setCurrentMap] = useState<google.maps.Map | null>(null)
    const isMapsLoaded = useGoogleMapsLoaded();
    const [zoom, setZoom] = useState<number>(19);

    

    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 19,
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
            if (res.state === 'denied') return setError('Allow location  permission in order to start')
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
        if (shipment.status == ShipmentStatus.Shipped) {
            setStatus('ready')
            return
        }
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
            setStatus('ready')

        } catch (error: any) {
            setError(error.message || 'Something went wrong. Please try again later')
        }
    }




    const handleApiLoaded = async (map: google.maps.Map, maps: any) => {

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
        console.log(map)
        setCurrentMap(map)


        const interval = setInterval(async () => {
            const position = await move()
            driverMarker.setPosition(position)
        }, 4000);

        setInterval(async () => {
            const position: any = await getCurrentPosition();
            calculateAndDisplayRoute(directionsService, directionsRenderer, {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        }, 10000);

        setStatus('loaded')

        // Display the route between the points

    };


    async function calculateAndDisplayRoute(directionsService: any, directionsRenderer: any, marker: any) {

        const origin = new google.maps.LatLng(marker.lat, marker.lng);
        const destination = new google.maps.LatLng(shipment.receiver.autoCompleteBillingAddress.lat, shipment.receiver.autoCompleteBillingAddress.lng);

        try {
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (response: any, status: any) => {
                    if (status === "OK") {
                        directionsRenderer.setDirections(response);
                        setDuration(response.routes[0].legs[0].duration.text);
                        setDistance(response.routes[0].legs[0].distance.text);
                        setStatus("ready");
                        console.log(currentMap)
                        if (currentMap) currentMap.setZoom(19);
                    } else {
                        window.alert("Directions request failed due to " + status);
                    }
                }
            );
        } catch (e: any) {
            setError(e.message);
        }

    }

    useEffect(() => {
        let cleanupSocketEvents: any

        if (shipmentId) {
            cleanupSocketEvents = registerSocketEvents(shipmentId, changeStatus, hasError);
        }

        return () => {
            if (cleanupSocketEvents) {
                cleanupSocketEvents();
            }
        };
    }, [shipmentId]);

    useEffect(() => {
        console.log(isMapsLoaded)
    }, [isMapsLoaded])

    return (
        <div className="h-full w-full">
            {status === 'loading' && <div className="mt-3 p-2 text-blue-500"> Loading...</div>}
            <>
                {status === 'ready' &&
                    <div className="sm:flex items-center gap-3 text-xs my-3">
                        <p className="text-gray-800 font-medium flex gap-[2px] items-center"><ClockIcon width={14} height={14} />Estimated Duration: <b> {duration || 'Calculating..'}</b></p>
                        <p className="text-gray-800 font-medium flex gap-[2px] items-center"><CountdownTimerIcon width={14} height={14} />Estimated Distance: <b> {distance || 'Calculating..'}</b></p>
                    </div>
                }/

                {status === 'loaded' &&
                    <div className="mt-3 p-2 text-blue-500 w-full">
                        <img src="/Getting Location.gif" alt="Getting Location" className="w-full block m-auto sm:w-1/2" />
                    </div>
                }

                <div className={`h-full w-full ${status != 'ready' ? 'opacity-0' : ''}`}>

                    <GoogleMapReact
                        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY! }}
                        defaultCenter={defaultProps.center}
                        debounced={true}
                        zoom={19}
                        defaultZoom={19}
                        yesIWantToUseGoogleMapApiInternals={true}
                        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}

                    >

                    </GoogleMapReact>
                </div>
            </>

            {error && <div className="mt-3 p-2 text-red-500">
                {error}
            </div>}
        </div>
    );
}

export default Map;