import React from 'react';
export default function Locate({ panTo }) {
  return (
    <button className='locate' onClick={() => {
      navigator.geolocation.getCurrentPosition((position) => { panTo({ lat: position.coords.latitude, lng: position.coords.longitude }) }, () => null);
    }}>
      <span className="compass" role="img" aria-label="compass - navigate to">🧭</span>
    </button>
  )
}