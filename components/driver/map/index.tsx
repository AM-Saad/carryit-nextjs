import { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { getCurrentPosition } from "@/lib/utils";
import Driver from "@/modals/Driver";
import { Package } from "@/modals/Package";
import MapClass from "@/lib/initMap";
import socket from "@/lib/socket/trip";
import { registerSocketEvents } from "@/lib/socket/socketHandler";
import Info from "@/components/driver/map/Info";
import Button from "@/components/shared/Button";

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
  const [error, setError] = useState<string | null>(null);
  const [currentMap, setCurrentMap] = useState<any>(null);
  const [status, setStatus] = useState<any>("Fetching...");
  const [directionsPanel, setDirectionsPanel] = useState<boolean>(false);
  const [allowLocation, setAllowLocation] = useState<boolean>(false);

  const init = useCallback(async () => {
    setAllowLocation(false);
    const permission = await checkLocationPermission();
    if (!permission) {
      setAllowLocation(true);
      return;
    }

    setStatus("Location access granted, initializing map...");

    const position: any = await getCurrentPosition();
    const map = new MapClass(
      new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude,
      ),
      new google.maps.LatLng(
        currentPackage.receiver.shipping_address.geometry.location.lat,
        currentPackage.receiver.shipping_address.geometry.location.lng,
      ),
    );

    map.initialize();

    setCurrentMap(map);
    setLoading(false);
    setStatus("Establishing connection with server...");
  }, []);

  async function checkLocationPermission(): Promise<boolean | undefined> {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser, please use a modern browser like Chrome or Firefox ",
      );
      return false;
    }
    try {
      const res = await navigator.permissions.query({ name: "geolocation" });
      if (res.state === "denied") {
        setError(
          'Location access denied<br/> <span class="text-xs flex text-gray-400 mt-1 justify-center">Please allow location access in your browser settings and refresh the page to continue</span>',
        );
        return false;
      }
      if (res.state === "prompt") {
        setError(`
                Allow location permission to start <span class="text-xs flex text-gray-400 mt-1 justify-center">
                if the popup does not show up asking for your permission, make sure you have enabled GPS in your device settings and the browser location access</span>`);
        return false;
      }
      if (res.state != "granted") {
        setError("Allow location permission to start");
        return;
      }
      return true;
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again later");
    }
  }

  async function startTracking() {
    try {
      const position: any = await getCurrentPosition();
      currentMap.calc_route({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      ready();
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again later");
    }
  }

  const hasError = (error: any) => {
    setError(error.message || "Something went wrong. Please try again later");
  };

  const watchLocation = async () => {
    try {
      const position: any = await getCurrentPosition();
      currentMap.move_markers({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      socket.emit("move", {
        id: packageId,
        coords: {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        },
      });
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again later");
    }
  };

  const askForPermission = async () => {
    try {
      await getCurrentPosition();
    } catch (error: any) {
      console.log(error.message);
      if (error.message === "User denied Geolocation") {
        setError(
          'User denied Geolocation<br/> <span class="text-xs flex text-gray-400 mt-1">it looks like you have denied location access previously. Please allow location access in your browser settings and refresh the page to continue</span>',
        );
      } else {
        setError(
          error.message || "Something went wrong. Please try again later",
        );
      }
    }
  };

  useEffect(() => {
    let interval: any;
    if (currentMap) {
      startTracking();

      interval = setInterval(async () => watchLocation(), 5000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [currentMap]);

  useEffect(() => {
    if (window.google) init();
  }, [window.google]);

  useEffect(() => {
    let cleanupSocketEvents: any;

    if (packageId && !loading) {
      cleanupSocketEvents = registerSocketEvents(
        packageId,
        () => {
          setStatus("Go");
        },
        hasError,
      );
    }

    return () => {
      if (cleanupSocketEvents) {
        cleanupSocketEvents();
      }
    };
  }, [packageId, loading]);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <div className="m-auto my-5 flex flex-col items-center text-center">
        {loading && !error && (
          <p className="mb-4 font-medium text-gray-800">{status}</p>
        )}
        {error && (
          <p
            className="m-auto mb-4 w-10/12 text-sm font-medium text-red-400 sm:w-8/12"
            dangerouslySetInnerHTML={{ __html: error }}
          ></p>
        )}
        {allowLocation && (
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
        )}
      </div>

      {isLoaded && (
        <div className="relative">
          {currentMap && <Info currentMap={currentMap} />}
          <div id="map_canvas" className="h-[70vh] w-full"></div>
          <button
            className="m-auto my-3 block rounded-md bg-theme p-1 text-white shadow-md"
            onClick={() => currentMap.reset_scene()}
          >
            Center
          </button>
          <div
            id="directionsPanel"
            className={`fixed right-1 top-1 h-96 w-1/3 overflow-auto rounded border bg-gray-50 p-4 text-xs shadow ${
              directionsPanel ? "" : "hidden"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Map;
