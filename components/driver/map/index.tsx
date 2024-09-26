import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import Driver from "@/modals/Driver";
import { Package } from "@/modals/Package";
import MapClass from "@/lib/initMap";
import socket from "@/lib/socket/trip";
import { registerSocketEvents } from "@/lib/socket/socketHandler";
import Info from "@/components/driver/map/Info";
import Stats from "@/components/driver/map/Stats";
import useLocation from "@/lib/hooks/use-location";

interface Props {
  packageId: string;
  currentPackage: Package;
  driver: Driver;
  ready: () => void;
}

type Libraries = "geometry" | "places";
const libraries: Libraries[] = ["geometry", "places"];


function moveFromAToB(start, end, callback, interval = 5000) {
  // Calculate the total number of steps based on the interval
  const totalDuration = 60000; // For example, 1 minute for the whole journey
  const numSteps = totalDuration / interval;

  let currentStep = 0;
  let latStep = (end.lat - start.lat) / numSteps;
  let lngStep = (end.lng - start.lng) / numSteps;

  const timer = setInterval(() => {
    if (currentStep > numSteps) {
      clearInterval(timer);
      return;
    }

    let lat = start.lat + (latStep * currentStep);
    let lng = start.lng + (lngStep * currentStep);
    callback({ lat, lng });

    currentStep++;
  }, interval);

  return () => clearInterval(timer); // Return a function to stop the interval
}


const Map: React.FC<Props> = ({ packageId, currentPackage, driver, ready }) => {


  const [currentMap, setCurrentMap] = useState<any>(null);
  const [directionsPanel, setDirectionsPanel] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Detecting Your Location...");

  // Initialize useLocation hook
  // enabled: whether to fetch location or not
  // accuracyThreshold: desired accuracy in meters
  // options: Geolocation API options

  const { location, accuracy, attempts, error, isInitializing } = useLocation(true, 3000);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
    libraries: libraries,
  });



  const mapError = useMemo(() => error || loadError, [error, loadError]);

  const isReady = useMemo(() => location ? true : false, [location]);



  const initMap = useCallback((location) => {
    // initialize map with current location
    const map = new MapClass(
      new google.maps.LatLng(location.lat, location.lng),
      new google.maps.LatLng(
        // 30.122817,
        // 31.344050
        currentPackage.receiver.shipping_address.geometry.location.lat,
        currentPackage.receiver.shipping_address.geometry.location.lng,
      ),
    );
    setCurrentMap(map);
    map.initialize();
  }, []);






  useEffect(() => {
    if (isReady && location && !currentMap && !mapError) {
      setTimeout(() => initMap(location), 1000);
    }
  }, [isReady, mapError, currentMap, location]);

  useEffect(() => {
    console.log('location is', location)
    if (!location || !currentMap) return;


    // const startCoord = { lat: 30.12931566719791, lng: 31.347917873568164 };
    // const endCoord = { lat: 30.122817, lng: 31.344050 };

    // const stopMoving = moveFromAToB(startCoord, endCoord, (nextPoint) => {

    currentMap.move_markers(location);

    socket.emit("move", { id: packageId, coords: location });
    // });
  }, [location, currentMap]);



  useEffect(() => {
    let cleanupSocketEvents: any;
    console.log('packageId', packageId, isInitializing, isLoaded)
    if (packageId && isInitializing && isLoaded) {
      setStatus("Establishing Connection With Server...");
      setTimeout(() => {
        cleanupSocketEvents = registerSocketEvents(packageId, (msg: string) => {
          console.log('msg', msg)
          setStatus(msg)

        }, (errorMsg: string) => setStatus(errorMsg));
      }, 1000);

    }
    return () => cleanupSocketEvents && cleanupSocketEvents();

  }, [packageId, isInitializing, isLoaded]);




  return (
    <div className="m-auto">
      <div className="m-auto my-2 flex flex-col items-center text-center">
        {(!mapError && !currentMap) && (
          <p className="mb-4 font-medium text-gray-800">{status}</p>
        )}

        {mapError && (
          <p
            className="m-auto mb-4 w-10/12 text-sm font-medium text-red-400 sm:w-8/12"
            dangerouslySetInnerHTML={{ __html: mapError instanceof Error ? mapError.message : mapError }}
          ></p>
        )}

      </div>

      {isReady && (
        <div className="relative">
          <div className="p-1 rounded shadow bg-gray-50 my-2">
            {currentMap && <Info currentMap={currentMap} />}
          </div>
          <div id="map_canvas" className="h-[65vh] w-full rounded shadow"></div>
          {currentMap && <Stats accuracy={accuracy} accuracyThreshold={3000} attempts={attempts} />}
          <button className="m-auto my-3 block rounded-md bg-theme p-1 text-white shadow-md" onClick={() => currentMap.reset_scene()}> Center</button>
          <div id="directionsPanel" className={`fixed right-1 top-1 h-96 w-1/3 overflow-auto rounded border bg-gray-50 p-4 text-xs shadow ${directionsPanel ? "" : "hidden"}`}></div>
        </div>
      )}
    </div>
  );
};

export default Map;
