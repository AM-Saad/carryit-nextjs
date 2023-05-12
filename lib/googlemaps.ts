// API key from: https://console.cloud.google.com/google/maps-apis
const API_KEY =  process.env.NEXT_PUBLIC_GOOGLE_KEY!
const CALLBACK_NAME = "gmapsCallback";


let initialized = typeof window !== "undefined" && window.google !== undefined && window.google.maps !== undefined ? true : false;
let resolveInitPromise: (google: unknown) => void;
let rejectInitPromise: OnErrorEventHandlerNonNull;
// This promise handles the initialization status of the google maps script.
const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve;
  rejectInitPromise = reject;
});

export default function init() {
  // If Google Maps already is initialized the `initPromise` should get resolved eventually.
  if (initialized) return initPromise;

  initialized = true;
  // The callback function is called by the Google Maps script if it is successfully loaded.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any)[CALLBACK_NAME] = () => resolveInitPromise(window.google);

  // We inject a new script tag into the `<head>` of our HTML to load the Google Maps script.
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${CALLBACK_NAME}&libraries=places`;
  script.onerror = rejectInitPromise;
  document.querySelector("head")?.appendChild(script);

  return initPromise;
}
