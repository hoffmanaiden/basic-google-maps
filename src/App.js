import React from 'react';

import Map from './components/Map';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';



export default function App() {
  const [markers, setMarkers] = React.useState([]);

  const mapRef = React.useRef();
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(7);
  }, []);
  const recenter = React.useCallback(() => {
    mapRef.current.panTo({lat: 25, lng:5});
    mapRef.current.setZoom(2.1);
  });

  return (
    <div className="App">
      <Topbar />
      <div className='flex-grid'>
        <Map 
          markers={markers}
          setMarkers={setMarkers}
          mapRef={mapRef}
          panTo={panTo}
        />
        <Sidebar
          markers={markers}
          mapRef={mapRef}
          panTo={panTo}
          recenter={recenter}
        />
      </div>
    </div>
  );
}
