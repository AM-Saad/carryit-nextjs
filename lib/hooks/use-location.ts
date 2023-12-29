import { useEffect, useState, useRef } from "react";


const useLocation = (enabled, accuracyThreshold = 3000, options = { enableHighAccuracy: true, maximumAge: 10000, timeout: 4000 }) => {
    const [location, setLocation] = useState<any>(null);
    const [accuracy, setAccuracy] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState<any>(true);
    const [attempt, setAttempt] = useState<any>(0);
    const accuracyRef = useRef(accuracy);
    accuracyRef.current = accuracy;

    console.log('Rendring')
    const checkAccuracyAndSetLocation = (position: any) => {
        console.log(position)

        const { latitude, longitude, accuracy } = position.coords;
        setAccuracy(accuracy);

        if (accuracy <= accuracyThreshold) {
            setLocation({ lat: latitude, lng: longitude });
            setIsInitializing(false);
        }

    };

    
    const handleError = (e) => {
        console.log(e); // Log for debugging
        if (e.code === 3 && location) { // Timeout error code is 3
            // Ignore timeout error if a valid location has already been fetched
            return;
        }
        setError('Unable To Retrieve Your Location');
        setIsInitializing(false);
    };



    useEffect(() => {
        let geoId;
        if (enabled && navigator.geolocation) {
            geoId = navigator.geolocation.watchPosition(checkAccuracyAndSetLocation, handleError, options);
            console.log('componentDidMount')
            const accuracyInterval = setInterval(() => {
                setAttempt(attempt + 1);
                if (accuracyRef.current && accuracyRef.current <= accuracyThreshold) {
                    clearInterval(accuracyInterval);
                }
                // if (attempt >= 3) {
                //     clearInterval(accuracyInterval);
                // }
            }, 5000); // Check every 5 seconds

            return () => {
                navigator.geolocation.clearWatch(geoId);
                clearInterval(accuracyInterval);
            };
        } else {
            setError('Geolocation API Not Available');
        }
    }, []);


    return { location, accuracy, error, isInitializing };

};

export default useLocation;
