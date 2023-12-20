import { useCallback, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import Driver from "@/modals/Driver";
import { Package } from "@/modals/Package";
import MapClass from "@/lib/initMap";
import socket from "@/lib/socket/trip";
import { registerSocketEvents } from "@/lib/socket/socketHandler";
import Info from "@/components/driver/map/Info";
import Button from "@/components/shared/ui/Button";
import { GEO_NOT_SUPPORTED, ACCESS_DENIED, ALREADY_PROMPTED, LOCATION_NOT_GRANTED, USER_DENIED_LOCATION } from "@/lib/constants";
import useLocation from "@/lib/hooks/use-location";

interface Props {
  packageId: string;
  currentPackage: Package;
  driver: Driver;
  ready: () => void;
}

type Libraries = "geometry" | "places";
const libraries: Libraries[] = ["geometry", "places"];



const Map: React.FC<Props> = ({ packageId, currentPackage, driver, ready }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
    libraries: libraries,
  });

  const [loading, setLoading] = useState(true);
  const [currentMap, setCurrentMap] = useState<any>(null);
  const [directionsPanel, setDirectionsPanel] = useState<boolean>(false);
  const [allowLocation, setAllowLocation] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("Detecting Your Location...");
  // Initialize useLocation hook
  const [location, accuracy, locationError] = useLocation(allowLocation); // assuming you want to set 100 meters as the accuracy threshold

  // Notes from the trip: watchposition in not get updated when the user is moving

  // Error handling state is now managed by the hook
  const error = locationError || loadError;

  const init = useCallback(() => {
    if (!location || currentMap) return;

    setStatus("Location Access Granted. Initializing Map...");

    // initialize map with current location
    const map = new MapClass(
      new google.maps.LatLng(location.lat, location.lng),
      new google.maps.LatLng(
        currentPackage.receiver.shipping_address.geometry.location.lat,
        currentPackage.receiver.shipping_address.geometry.location.lng,
      ),
    );

    map.initialize();
    setCurrentMap(map);
    setLoading(false);
    setStatus("Establishing Connection With Server...");

  }, [location, currentPackage]);

  const watchLocation = useCallback(() => {
    if (!location || !currentMap) return;

    currentMap.move_markers(location);

    socket.emit("move", { id: packageId, coords: location });

  }, [location, currentMap, packageId]);

  // Removed askForPermission function, since permission handling is within useLocation

  useEffect(() => {
    if (isLoaded && !currentMap) init();

  }, [isLoaded, init, currentMap]);

  useEffect(() => {
    let cleanupSocketEvents: any;


    if (packageId && !loading) {
      cleanupSocketEvents = registerSocketEvents(packageId, () => setStatus("Go"), () => console.log('error'));
    }

    return () => cleanupSocketEvents && cleanupSocketEvents();

  }, [packageId, loading]);

  useEffect(() => {
    if (currentMap && location) {
      ready();
      watchLocation();

    }
  }, [currentMap, location, ready]);

  // Handle location watching
  useEffect(() => {
    const intervalId = setInterval(() => watchLocation(), 4000);

    return () => clearInterval(intervalId);
  }, [watchLocation]);
  return (
    <div style={{ height: "400px", width: "100%" }}>
      <div className="m-auto my-5 flex flex-col items-center text-center">
        {loading && !error && (
          <p className="mb-4 font-medium text-gray-800">{status}</p>
        )}
        {error && (
          <p
            className="m-auto mb-4 w-10/12 text-sm font-medium text-red-400 sm:w-8/12"
            dangerouslySetInnerHTML={{ __html: error instanceof Error ? error.message : error }}
          ></p>
        )}
        {/* {allowLocation && (
          <Button
            onClick={askForPermission}
            title="Allow Location"
            style="flex items-center justify-center"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.3285 1.13607C10.1332 0.940809 9.81662 0.940808 9.62136 1.13607C9.42609 1.33133 9.42609 1.64792 9.62136 1.84318L10.2744 2.49619L5.42563 6.13274L4.31805 5.02516C4.12279 4.8299 3.80621 4.8299 3.61095 5.02516C3.41569 5.22042 3.41569 5.537 3.61095 5.73226L5.02516 7.14648L6.08582 8.20714L2.81545 11.4775C2.62019 11.6728 2.62019 11.9894 2.81545 12.1846C3.01072 12.3799 3.3273 12.3799 3.52256 12.1846L6.79293 8.91425L7.85359 9.97491L9.2678 11.3891C9.46306 11.5844 9.77965 11.5844 9.97491 11.3891C10.1702 11.1939 10.1702 10.8773 9.97491 10.682L8.86733 9.57443L12.5039 4.7257L13.1569 5.37871C13.3522 5.57397 13.6687 5.57397 13.864 5.37871C14.0593 5.18345 14.0593 4.86687 13.864 4.6716L12.8033 3.61094L11.3891 2.19673L10.3285 1.13607ZM6.13992 6.84702L10.9887 3.21047L11.7896 4.01142L8.15305 8.86015L6.13992 6.84702Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </Button>
        )} */}
      </div>

      {isLoaded && (
        <div className="relative">
          {currentMap && <Info currentMap={currentMap} />}

          <div id="map_canvas" className="h-[65vh] w-full"></div>

          <button className="m-auto my-3 block rounded-md bg-theme p-1 text-white shadow-md" onClick={() => currentMap.reset_scene()}> Center</button>
          <div id="directionsPanel" className={`fixed right-1 top-1 h-96 w-1/3 overflow-auto rounded border bg-gray-50 p-4 text-xs shadow ${directionsPanel ? "" : "hidden"}`}></div>
        </div>
      )}
    </div>
  );
};

export default Map;
