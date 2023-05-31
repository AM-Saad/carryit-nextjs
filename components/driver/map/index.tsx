import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { getCurrentPosition } from '@/lib/utils';
import Driver from '@/modals/Driver';
import { Shipment } from '@/modals/Shipment';
import MapClass from '@/lib/initMap';
import socket from '@/lib/socket/trip'
import { registerSocketEvents } from '@/lib/socket/socketHandler';
import Info from '@/components/driver/map/Info';

type Libraries =  'geometry' | 'places'
const libraries: Libraries[] = ['geometry', 'places']
const Map: React.FC<{ shipmentId: string, shipment: Shipment, driver: Driver }> = ({ shipmentId, shipment, driver }) => {

    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!, libraries: libraries });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const [currentMap, setCurrentMap] = useState<any>(null);
    const [status, setStatus] = useState<any>('Fetching...')
    const [directionsPanel, setDirectionsPanel] = useState<boolean>(false)

    const init = useCallback(async () => {
        const permission = await checkLocationPermission();
        if (!permission) return

        setStatus('Location access granted, initializing map...')

        const position: any = await getCurrentPosition();
        const map = new MapClass(
            new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            new google.maps.LatLng(shipment.receiver.autoCompleteBillingAddress.lat, shipment.receiver.autoCompleteBillingAddress.lng),
        );


        map.initialize();

        setCurrentMap(map)
        setLoading(false)
        setStatus('Establishing connection with server...')


    }, [])


    async function checkLocationPermission(): Promise<boolean | undefined> {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            return false
        }
        try {
            const res = await navigator.permissions.query({ name: 'geolocation' })
            if (res.state === 'denied') {
                setError('Allow location  permission in order to start')
                return false
            }
            if (res.state === 'prompt') {
                setError('Allow location permission in order to start, if the popup is not showing, please make sure you have enabled GPS in your device')
                return false
            }
            if (res.state != 'granted') {
                setError('Allow location permission in order to start')
                return
            }
            return true
        } catch (error: any) {
            setError(error.message || 'Something went wrong. Please try again later')
        }

    }



    async function startTracking() {
        try {
            const position: any = await getCurrentPosition();
            currentMap.calc_route({ lat: position.coords.latitude, lng: position.coords.longitude });
        } catch (error: any) {
            setError(error.message || 'Something went wrong. Please try again later')
        }
    }

    const hasError = (error: any) => {
        setError(error.message || 'Something went wrong. Please try again later')
    }



    const watchLocation = async () => {
        try {

            const position: any = await getCurrentPosition();
            currentMap.move_markers({ lat: position.coords.latitude, lng: position.coords.longitude });
            socket.emit("move", { id: shipmentId, coords: { lat: position.coords.latitude, long: position.coords.longitude } });
        } catch (error: any) {
            setError(error.message || 'Something went wrong. Please try again later')

        }

    }



    useEffect(() => {
        let interval: any
        if (currentMap) {

            startTracking()

            interval = setInterval(async () => watchLocation(), 5000);
        }
        return () => {
            clearInterval(interval)
        }
    }, [currentMap])



    useEffect(() => {
        if (window.google) {
            init()
        }

    }, [window.google]);



    useEffect(() => {
        let cleanupSocketEvents: any

        if (shipmentId && !loading) {
            cleanupSocketEvents = registerSocketEvents(shipmentId, () => {
                setStatus('Go')

            }, hasError);
        }

        return () => {
            if (cleanupSocketEvents) {
                cleanupSocketEvents();
            }
        };
    }, [shipmentId, loading]);




    return (
        <div style={{ height: '400px', width: '100%' }}>
            {loading && <p className="text-gray-800 font-medium flex gap-[2px] items-center">{status}</p>}

            {isLoaded &&
                <div className='relative'>
                    {currentMap && <Info currentMap={currentMap} />}
                    <div id='map_canvas' className='h-[70vh] w-full'></div>
                    <button className='bg-theme block m-auto my-3 p-1 rounded-md shadow-md text-white' onClick={() => currentMap.reset_scene()}>Center</button>
                    <div
                        id='directionsPanel'
                        className={`overflow-auto bg-gray-50 shadow border rounded w-1/3 h-96 p-4 fixed right-1 top-1 text-xs ${directionsPanel ? '' : 'hidden'}`}>
                    </div>

                </div>}
        </div>
    );
};

export default Map;