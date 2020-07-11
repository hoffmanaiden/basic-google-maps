import React from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { formatRelative } from 'date-fns';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from '@reach/combobox';
import '@reach/combobox/styles.css';

import mapStyles from './mapStyles';


// extracted variables to prevent excessive re-renders
const libraries = ["places"];
const mapContainerStyle = {
  // map dimensions
  width: '100vw',
  height: '100vh'
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


function App() {
  // Hook that returns isLoaded and loadError
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });
  // Hooks for state
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((event) => {
    setMarkers(current => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    }]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(7);
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";
  console.log(selected); // using 'selected' state
  return (
    <div className="App">
      <h3>Map <span role="img" aria-label="globe">🌍</span></h3>
      <Search panTo={panTo} />
      <Locate panTo={panTo} />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={2.65}
        center={center}
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
              setSelected(marker)
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
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button className='locate' onClick={() => {
      navigator.geolocation.getCurrentPosition((position) => {panTo({lat: position.coords.latitude, lng:position.coords.longitude})}, () => null);
    }}>
      <span className="compass" role="img" aria-label="compass - navigate to">🧭</span>
    </button>
  )
}

function Search({ panTo }) {
  // hook
  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 50.850346, lng: () => 4.351721 },
      radius: 200 * 1000, // in meters, so 200 km
    }
  });

  return (
    <div className="search">
      <Combobox
        onSelect={async (address) => {
          setValue(address, false); // set address in state w/o fetching from google
          clearSuggestions();
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
          } catch (err) {
            console.log(err)
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => { setValue(e.target.value) }}
          disabled={!ready}
          placeholder="Search for location"
        />
        <ComboboxPopover className='popover'>
          <ComboboxList>
            {status === "OK" && data.map(({ id, description }) => <ComboboxOption key={id} value={description} />)}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default App;
