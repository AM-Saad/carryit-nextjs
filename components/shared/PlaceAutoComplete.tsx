import React, { useRef, useEffect, useState, useCallback } from 'react';
import init from '@/lib/googlemaps';
import { on } from 'events';


interface GooglePlacesAutocompleteProps {
    location?: {
        lat: number;
        lng: number;
    };
    address?: string;
    placeholder?: string;
    onChange: (location: any) => void;
    onInit: (autocomplete: any) => void;
    onCurrentAddress: (address: string) => void;
    onInput: (address: any) => void;
}



const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
    location,
    address,
    placeholder = '',
    onChange,
    onInit,
    onCurrentAddress,
    onInput,
}) => {
    const [autocomplete, setAutocomplete] = useState<any>(null);
    const [listener, setListener] = useState(null);
    const [geocoder, setGeocoder] = useState<any>(null);
    const [currentLocation, setCurrentLocation] = useState(location || {});
    const [currentAddress, setCurrentAddress] = useState('');

    const autocompleteRef = useRef<any>(null);


    const geocode = (address: any) => {
        if (!geocoder || !address) return;

        return new Promise((resolve, reject) => {
            geocoder.geocode({ address }, (results: any, status: any) => {
                if (status === 'OK') {
                    resolve(results);
                } else {
                    reject(status);
                }
            });
        });
    };

    const reverseGeocode = (location: any) => {
        if (!geocoder) return;

        return new Promise((resolve, reject) => {
            geocoder.geocode({ location }, (results: any, status: any) => {
                if (status === 'OK') {
                    resolve(results);
                } else {
                    reject(status);
                }
            });
        });
    };


    const initialize = async () => {
        await init();

        const circleFromCenterOfFrance = new google.maps.Circle({
            center: { lat: 46.5819081, lng: -2.0206618 },
            radius: 3000,
        });

        const currentautocomplete = new google.maps.places.Autocomplete(autocompleteRef.current, {
            types: ['geocode'],
            bounds: circleFromCenterOfFrance.getBounds() as any,
        });

        currentautocomplete.setFields([
            'address_component',
            'geometry',
            'formatted_address',

        ]);

        setAutocomplete(currentautocomplete);

        setGeocoder(new google.maps.Geocoder());

        let tempLocation: any
        let tempAddress: any

        if (location && location.lat && location.lng) {
            const results: any = await reverseGeocode(location);

            tempLocation = location;
            tempAddress = results?.[0].formatted_address || '';
            setCurrentLocation(location);
            setCurrentAddress(tempAddress);

            autocompleteRef.current!.value = tempAddress;
            onCurrentAddress(tempAddress);       
         }

        if (address) {
            const results = await geocode(address) as any;

            tempLocation = {
                lat: results?.[0].geometry?.location.lat(),
                lng: results?.[0].geometry?.location.lng(),
            };
            setCurrentLocation(tempLocation);

            setCurrentAddress(tempAddress);

            autocompleteRef.current!.value = tempAddress;
            onCurrentAddress(tempAddress);       
        }
        console.log(tempAddress, tempLocation)

        onInit({
            address: tempAddress,
            location: tempLocation,
        });
    };

    const updateLocation = useCallback(async () => {
        autocomplete.addListener("place_changed", () => {
            console.log('place changed')
            const place = autocomplete?.getPlace();
            const location = {
                lat: place?.geometry?.location.lat(),
                lng: place?.geometry?.location.lng(),
            };
            setCurrentLocation(location)

            setCurrentAddress(place?.formatted_address || '');
            
            autocompleteRef.current!.value = place?.formatted_address || '';
            onCurrentAddress(place?.formatted_address || '');

            onInput({
                ...location,
                address_components: place?.address_components,
            });

        });
    }, [autocomplete])


    useEffect(() => {
        if (!autocomplete) return;
        updateLocation()


    }, [autocomplete])


    useEffect(() => {


        initialize();

        return () => {
            if (autocomplete == null || listener == null) return;

            google.maps.event.removeListener(listener);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // useEffect(() => {
    //     if (!autocomplete) return;
    //     setListener(
    //         autocomplete.addListener('place_changed', () => {
    //             const place = autocomplete.getPlace();

    //             setCurrentLocation({
    //                 lat: place?.geometry?.location.lat(),
    //                 lng: place?.geometry?.location.lng(),
    //             });

    //             setCurrentAddress(place?.formatted_address || '');

    //             setAutocompleteValue();

    //             onInput({
    //                 ...currentLocation, 
    //                 address_components: place?.address_components,
    //             });
    //         })
    //     );
    // }, [autocomplete]); // eslint-disable-line react-hooks/exhaustive-deps


    const handleInputChange = (event: any) => {
        onChange(event.target.value);
    };

    return (
        <input
            ref={autocompleteRef}
            id="compeleteAddress"
            placeholder=" Enter your address"
            type="autocomplete"
            onChange={handleInputChange}
            className="p-2 rounded-lg border mt-1 outline-none w-full text-xs border-black"

        />
    )
}

export default GooglePlacesAutocomplete 