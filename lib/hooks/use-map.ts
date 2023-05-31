import { useEffect, useState } from 'react';

const useGoogleMapsLoaded = () => {
    const [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        const checkGoogleMapsLoaded = () => {
            if (window.google && window.google.maps) {
                console.log('hes')
                setIsLoaded(true);
            }
        };

        console.log('isLoaded', isLoaded)
        if (!isLoaded) {
            // Check if the Google Maps library is already loaded
            checkGoogleMapsLoaded();
        } else {
            // Add a listener for the Google Maps library to load
            window.addEventListener('google-maps-loaded', checkGoogleMapsLoaded);
        }


        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('google-maps-loaded', checkGoogleMapsLoaded);
        };
    }, [isLoaded]);


    return isLoaded;
};

export default useGoogleMapsLoaded;