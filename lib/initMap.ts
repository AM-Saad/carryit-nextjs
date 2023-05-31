class MapClass {
    geocoder: google.maps.Geocoder | null;
    map: google.maps.Map | null;
    directionsService: google.maps.DirectionsService | null;
    directionsDisplay: google.maps.DirectionsRenderer | null;
    startLatlng: google.maps.LatLng | null;
    endLatlng: google.maps.LatLng | null;
    markers: google.maps.Marker[];
    zoomLevel: number;
    tilt: number;
    duration: string;
    distance: string;

    constructor(startLatlng: any, endLatlng: any) {
        this.map = null;
        this.directionsService = null;
        this.directionsDisplay = null;
        this.geocoder = null;
        this.startLatlng = startLatlng;
        this.endLatlng = endLatlng;
        this.markers = [];
        this.zoomLevel = 20;
        this.tilt = 20;
        this.duration = ''
        this.distance = ''
    }

    async initialize() {
        const latlng: any = this.startLatlng;

        this.geocoder = new google.maps.Geocoder();
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: true,
            preserveViewport: true,
        });

        const myOptions = {
            zoom: this.zoomLevel,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            heading: 220,
            tilt: 89.5,
            mapId: "90f87356969d889c",
            maxZoom: 20,
        };



        this.map = new google.maps.Map(document.getElementById('map_canvas') as HTMLDivElement, myOptions);
        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.setPanel(document.getElementById('directionsPanel'));

        // Preserve last manual zooming, in order to don't resetting the zoom when moveMarker called 
        google.maps.event.addListener(this.map, 'zoom_changed', () => {
            const zoomLevel = this.map?.getZoom();
            if (this.zoomLevel !== zoomLevel) this.zoomLevel = zoomLevel!;

        });

        google.maps.event.addListener(this.map, 'dragend', () => {

            const bounds: any = this.map?.getBounds();
            const areaBounds = {
                north: bounds.getNorthEast().lat(),
                south: bounds.getSouthWest().lat(),
                east: bounds.getNorthEast().lng(),
                west: bounds.getSouthWest().lng()
            };
            console.log(areaBounds)
        });



        google.maps.event.addListener(this.directionsDisplay, 'directions_changed', () => {
            const directions = this.directionsDisplay?.getDirections();
            if (!directions) return;
            const overview_path = directions.routes[0].overview_path;
            const startingPoint = overview_path[0];
            const destination = overview_path[overview_path.length - 1];

            if (!this.startLatlng || !startingPoint.equals(this.startLatlng)) {
                this.startLatlng = startingPoint;

            }
            if (!this.endLatlng || !destination.equals(this.endLatlng)) {
                this.endLatlng = destination;
            }

        });


        this.add_directions_buttons()
        this.create_markers()

        setTimeout(() => this.reset_scene(), 2000)


    }

    add_directions_buttons() {
        const buttons = [
            ["Rotate Left", "rotate", 20, google.maps.ControlPosition.LEFT_CENTER],
            ["Rotate Right", "rotate", -20, google.maps.ControlPosition.RIGHT_CENTER],
            ["Tilt Down", "tilt", 20, google.maps.ControlPosition.TOP_CENTER],
            ["Tilt Up", "tilt", -20, google.maps.ControlPosition.BOTTOM_CENTER],
        ];

        buttons.forEach(([text, mode, amount, position]: any) => {
            const controlDiv = document.createElement("div");
            const controlUI = document.createElement("button");

            controlUI.classList.add("orientation");
            controlUI.innerText = `${text}`;
            controlUI.addEventListener("click", () => this.adjustMap(mode, amount));
            controlDiv.appendChild(controlUI);
            this.map?.controls[position].push(controlDiv);
        });


    }
    create_markers() {

        // Create the icons for the markers
        const originIcon: google.maps.Icon = {
            url: '/icons/car.png', // Replace 'path_to_origin_icon' with the actual path to your origin marker icon image
            scaledSize: new google.maps.Size(52, 72), // Adjust the size of the icon as needed
      

        };

        const destinationIcon = {
            url: 'path_to_destination_icon', // Replace 'path_to_destination_icon' with the actual path to your destination marker icon image
            scaledSize: new google.maps.Size(52, 52), // Adjust the size of the icon as needed
        };

        // Create the markers with the custom icons
        const originMarker = new google.maps.Marker({
            position: this.startLatlng,
            icon: originIcon,
            map: this.map,

        });

        const destinationMarker = new google.maps.Marker({
            position: this.endLatlng,
            icon: destinationIcon,
            map: this.map,
        });

        // Store the markers in the 'markers' array
        this.markers.push(originMarker);
        this.markers.push(destinationMarker);

    }
    reset_scene() {

        this.map?.setCenter(this.startLatlng!)
        const heading = google.maps.geometry.spherical.computeHeading(this.startLatlng!, this.endLatlng!);
        this.map?.setZoom(19)

        this.map?.setHeading(heading - 35);

        setTimeout(() => this.map?.setTilt(66), 2000)

    }
    adjustMap(mode: any, amount: any) {
        switch (mode) {
            case "tilt":
                this.map?.setTilt(this.map?.getTilt() + amount);
                break;
            case "rotate":
                this.map?.setHeading(this.map?.getHeading() + amount);
                break;
            default:
                break;
        }

    }

    calc_route(options: any) {
        const defaultOptions = {
            preserveViewport: false,
        };

        const mergedOptions = { ...defaultOptions, ...options };

        const request: any = {
            origin: this.markers[0].getPosition(),
            destination: this.endLatlng,
            travelMode: google.maps.TravelMode.DRIVING,
        };

        this.directionsService?.route(request, (response, status) => {
            if (status == google.maps.DirectionsStatus.OK) {
                this.map?.setZoom(this.zoomLevel);

                // Display the route on the map
                this.directionsDisplay?.setDirections(response);

                // Store the current map viewport
                const previousViewport = this.map?.getCenter();

                // Adjust the map's viewport to fit the route's bounds if preserveViewport is not set to true
                if (!mergedOptions.preserveViewport) {
                    const routeBounds = response?.routes[0].bounds;
                    this.map?.setZoom(this.zoomLevel);
                    this.map?.fitBounds(routeBounds!);
                }

                // Restore the previous map viewport
                this.map?.setCenter(previousViewport!);

                this.distance = response?.routes[0].legs[0].distance?.text || '0 km';
                this.duration = response?.routes[0].legs[0].duration?.text || '0 min';
            }
        });
    }

    move_markers(newStartLatlng: any) {


        // Update the start marker position
        this.markers[0].setPosition(newStartLatlng);

        // Update the stored startLatlng value
        this.startLatlng = newStartLatlng;

        // Recalculate the route with the updated origin, preserving the viewport
        this.calc_route({ preserveViewport: true });


    }

    getInfo() {
        return { distance: this.distance, duration: this.duration }
    }
}

export default MapClass;
