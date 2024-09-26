import { useEffect, useState, useRef } from "react";

enum LocationError {
    PERMISSION_DENIED = 1,
    POSITION_UNAVAILABLE = 2,
    TIMEOUT = 3,
}

const useLocation = (enabled, accuracyThreshold = 300, options = { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }) => {
    const [location, setLocation] = useState<any>(null);
    const [accuracy, setAccuracy] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState<any>(true);
    const [attempts, setAttempts] = useState<any>(0);
    const accuracyRef = useRef(accuracy);
    accuracyRef.current = accuracy;
    const geoIdRef = useRef<any>(null);


    const checkAccuracyAndSetLocation = (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setError(null);
        if (accuracy <= accuracyThreshold) {
            setLocation({ lat: latitude, lng: longitude });
            setIsInitializing(false);
            setAccuracy(accuracy);

        } else {
            // If the navigator accuracy is not sufficient, try Google Maps Geolocation API
            fetchAccurateLocationFromGoogleMaps();
        }
    };


    const handleError = (e) => {
        console.log(e); // Log for debugging
        if (e.code === LocationError.TIMEOUT && location) {
            // Timeout error code is 3
            // Ignore timeout error if a valid location has already been fetched
            return;
        }
        setError('Unable To Retrieve Your Location');
        setIsInitializing(false);
    };


    const fetchAccurateLocationFromGoogleMaps = async () => {
        try {
            const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Additional data can be included here to improve accuracy
            });
            const data = await response.json();
            if (response.ok) {
                const { lat, lng } = data.location;
                console.log(lat, lng, data.accuracy); // Log for debugging
                const accuracy = data.accuracy;
                if (accuracy <= accuracyThreshold) {
                    setLocation({ lat, lng });
                    setAccuracy(accuracy);
                    setError(null);
                    setIsInitializing(false);
                }
            } else {
                throw new Error('Google Maps Geolocation API error');
            }
        } catch (error) {
            console.error('Failed to fetch accurate location from Google Maps', error);
            setError('Unable to retrieve your location from Google Maps');
            setIsInitializing(false);
        }
    };




    useEffect(() => {
        if (enabled && navigator.geolocation) {
            geoIdRef.current = navigator.geolocation.watchPosition(checkAccuracyAndSetLocation, handleError, options);
        } else {
            setError('Geolocation API Not Available');
        }

        return () => {
            if (geoIdRef.current) navigator.geolocation.clearWatch(geoIdRef.current);
        };
    }, [enabled, options]); // Add dependencies here if they should trigger re-initialization



    return { location, accuracy, attempts, error, isInitializing };

};

export default useLocation;
