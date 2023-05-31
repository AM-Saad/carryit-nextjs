import React, { useState } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const RouteForm = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [directions, setDirections] = useState(null);
  const [startLatlng, setStartLatlng] = useState(null);
  const [endLatlng, setEndLatlng] = useState(null);

  const handleInputChange = (event: any) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if (name === 'start') {
      setStart(value);
    } else if (name === 'end') {
      setEnd(value);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (start.length && end.length) {
      calcRoute(start, end);
    }
  };

  const handleDirectionsChange = (directions: any) => {
    const overview_path = directions.routes[0].overview_path;
    const startingPoint = overview_path[0];
    const destination = overview_path[overview_path.length - 1];
    if (!startLatlng || !startingPoint.equals(startLatlng)) {
      setStartLatlng(startingPoint);
      getLocationName(startingPoint, (name: any) => {
        setStart(name);
      });
    }
    if (!endLatlng || !destination.equals(endLatlng)) {
      setEndLatlng(destination);
      getLocationName(destination, (name: any) => {
        setEnd(name);
      });
    }
  };

  const getLocationName = (latlng: any, callback: any) => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      {
        location: latlng
      },
      (result: any, status: any) => {
        if (status === 'OK') {
          let i = -1;
          console.log(result);
          // find the array index of the last object with the locality type
          for (let c = 0; c < result.length; c++) {
            for (let t = 0; t < result[c].types.length; t++) {
              if (result[c].types[t].search('locality') > -1) {
                i = c;
              }
            }
          }
          const locationName = result[i].address_components[0].long_name;
          callback(locationName);
        }
      }
    );
  };

  const calcRoute = (start: any, end: any) => {
    const request: any = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };
    new google.maps.DirectionsService()
      .route(request, (response: any, status: any) => {
        if (status === 'OK') {
          setDirections(response);
        }
      });
  };

  return (
    <div>
      <form id="routeForm" onSubmit={handleSubmit}>
        <label htmlFor="routeStart">Start</label>
        <input
          type="text"
          id="routeStart"
          name="start"
          value={start}
          onChange={handleInputChange}
        />
        <label htmlFor="routeEnd">End</label>
        <input
          type="text"
          id="routeEnd"
          name="end"
          value={end}
          onChange={handleInputChange}
        />
        <input type="submit" value="Find Route" />
      </form>
      <div className="clear"></div>
      <GoogleMap

        zoom={14}>
        {directions && (
          <DirectionsRenderer
            directions={directions}
            onDirectionsChanged={() => handleDirectionsChange(directions)}
          />
        )}
      </GoogleMap>
      <div id="directionsPanel"></div>
    </div>
  );
};

export default RouteForm;