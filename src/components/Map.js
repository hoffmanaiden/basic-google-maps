import React from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { formatRelative } from 'date-fns';

import mapStyles from '../mapStyles';

 // extracted variables to prevent excessive re-renders
 const libraries = ["places"];
 const mapContainerStyle = {
   // map dimensions
   width: '77vw',
   height: '94vh'
 };
 const center = {
   lat: 25,
   lng: 5
 }
 const options = {
   styles: mapStyles,
   disableDefaultUI: true,
   zoomControl: true
 }

export default function Map({markers, setMarkers, mapRef, panTo}) {

  // Hook that returns isLoaded and loadError
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });
  // Hooks for state
  // const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((event) => {
    setMarkers(current => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    }]);
  }, []);

  // const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  // const panTo = React.useCallback(({ lat, lng }) => {
  //   mapRef.current.panTo({ lat, lng });
  //   mapRef.current.setZoom(5);
  // }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <GoogleMap
      zoom={2.1} // required
      center={center} // required
      mapContainerStyle={mapContainerStyle}
      options={options}
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      {markers.map((marker) => (
        <Marker
          style={{ zIndex: 0 }}
          key={marker.time.toISOString()}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={{
            url: '/pin.svg',
            scaledSize: new window.google.maps.Size(50, 50),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(25, 25)
          }}
          onClick={() => {
            setSelected(marker);
            panTo({lat: marker.lat, lng: marker.lng});
          }}
        />
      ))}

      {selected ? (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => setSelected(null)}>
          <div>
            <h2>Pin</h2>
            <p>Created {formatRelative(selected.time, new Date())}</p>
          </div>
        </InfoWindow>) : null}
    </GoogleMap>
  );
}

