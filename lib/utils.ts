import ms from "ms";
import timeZoneCityToCountry from "./countries.json"



export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${timeOnly ? "" : " ago"
    }`;
};


export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      console.log(json)
      const error = new Error(json.error) as Error & { status: number; };
      error.status = res.status;
      throw error;
    } else {
      return json
    }
  }

  return res.json();
}


export function getHeaders(token: string) {
  const headers: any = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${token}`,
  };
  return headers;
}



export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};



export function setCookie(name: string, value: string, days: number) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}



export function getCookie(name: string) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
}


export function userLocationInfo() {
  let userRegion: any
  let userCity: any
  let userCountry: any
  let userTimeZone: any
  const countries: any = timeZoneCityToCountry

  if (Intl) {
    userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let tzArr = userTimeZone.split("/");
    userRegion = tzArr[0];
    userCity = tzArr[tzArr.length - 1];
    userCountry = countries[userCity];
  }

  return { userRegion, userCity, userCountry, userTimeZone }
}


export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.watchPosition(resolve, reject, {
      enableHighAccuracy: true, maximumAge: 5000

    });
  });
}

// export function getCurrentPosition() {



//   const readLocation = (
//     setLocation: (location: ILocation) => void,
//     setError: (errorMessage: string) => void,
//     setAccuracy: (acc: number) => void
//   ) => {
//     if (navigator.geolocation) {
//       const geoId = navigator.geolocation.watchPosition(
//         (position) => {
//           const lat = position.coords.latitude;
//           const lng = position.coords.longitude;
//           setLocation({ lat, lng });
//           setAccuracy(position.coords.accuracy);
//           console.log({ lat, lng }, position.coords.accuracy);
//           if (position.coords.accuracy > 10) {
//             showErrorSnackBar("The GPS accuracy isn't good enough");
//           }
//         },
//         (e) => {
//           showErrorSnackBar(e.message);
//           setError(e.message);
//         },
//         { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
//       );
//       return () => {
//         console.log('Clear watch called');
//         window.navigator.geolocation.clearWatch(geoId);
//       };
//     }

//     return;
//   };

// }
export function calculateCost(branches, driversPerBranch, tripsPerDriver) {
  // Constants
  const daysInMonth = 30;
  const mapLoadsCostPerThousand = 0.14;
  const directionsCostPerThousand = 0.14;
  const directionsRequestsPerTrip = 90;  // 2 requests per minute * 45 minutes 

  // Map loads calculations
  const mapLoadsPerDay = tripsPerDriver * driversPerBranch * branches;
  const mapLoadsPerMonth = mapLoadsPerDay * daysInMonth;
  const mapLoadsCost = (mapLoadsPerMonth / 1000) * mapLoadsCostPerThousand;

  // Directions calculations
  const directionRequestsPerDay = directionsRequestsPerTrip * tripsPerDriver * driversPerBranch * branches;
  const directionRequestsPerMonth = directionRequestsPerDay * daysInMonth;
  const directionsCost = (directionRequestsPerMonth / 1000) * directionsCostPerThousand;

  // Total cost
  const totalCost = mapLoadsCost + directionsCost;

  return totalCost;
}
