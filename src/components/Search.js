import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from '@reach/combobox';
import '@reach/combobox/styles.css';

export default function Search({ panTo }) {
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