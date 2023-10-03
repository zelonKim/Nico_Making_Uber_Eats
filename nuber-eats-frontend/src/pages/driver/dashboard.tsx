import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };

  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      // Watches the User`s location and Gives the User`s latitude and longitude to Success Callback function`s parameter
      enableHighAccuracy: true,
    });
  }, []);

  
  useEffect(() => {
    // when current User`s location is changed,
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng)); // Google Map moves to the location updated latitude and longitude
   
     const geocoder = new google.maps.Geocoder(); // can convert between addresses and geographic coordinates.
      geocoder.geocode(
        {
        location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => { console.log(results) }); // results is an 'address' converted from 'coordinates'

    }
  }, [driverCoords.lat, driverCoords.lng]); 


  
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    // when Google Map is Loaded,
    setTimeout(() => {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng)); // Google Map moves to the location specified latitude and longitude
    }, 3000);
    setMap(map);
    setMaps(maps);
  };


  
  const onGetRouteClick = () => {
    if(map) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        
        directionsRenderer.setMap(map)
        
        directionsService.route({
              origin: {
                location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng)  
              },
              destination: {
                location: new google.maps.LatLng(driverCoords.lat + 0.05, driverCoords.lng + 0.05)  
              },
              travelMode: google.maps.TravelMode.DRIVING,
            }, 
            (result, status) => {
                directionsRenderer.setDirections(result) // shows the route from 'orgin' to 'destination' 
            })
    }
  };

  
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          defaultCenter={{
            lat: 40.39,
            lng: 73.56,
          }}
          bootstrapURLKeys={{ key: "AIzaSyDBu_aKoux8fqzTULT744-DAGJi0aGgOUA" }}
        >
         <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
        
      </div>
      <button onClick={onGetRouteClick}>Get route</button>
    </div>
  );
};
