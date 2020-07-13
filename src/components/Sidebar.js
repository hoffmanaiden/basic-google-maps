import React from 'react';
import cities from 'cities.json';
import {continents, countries} from 'countries-list';
import _ from 'lodash';

import Search from './Search';
import Locate from './Locate';

const citiesSortedByLat = cities.sort((a,b) => a.lat - b.lat);

export default function Sidebar({ markers, recenter }) {


  // given an array sorted by longitude, a 2nd longitude, & a threshold
  // it returns an array of cities with a longitude within that threshold
  const binarySearchLng = function(arr, clickLng, thresh){
    let start = 0;
    let end = arr.length-1;
    let output = [];
    while(start<=end){
      let mid = Math.floor((start+end)/2);
      let nameLng = arr[mid].lng;
      if(nameLng < clickLng+thresh && nameLng > clickLng-thresh){
        output.push(arr[mid]);
        let countDown=mid-1;
        for(countDown; arr[countDown].lng < clickLng+thresh && arr[countDown].lng > clickLng-thresh; countDown--){
          output.push(arr[countDown]);
        }
        let countUp=mid+1;
        for(countUp; arr[countUp].lng < clickLng+thresh && arr[countUp].lng > clickLng-thresh; countUp++){
          output.push(arr[countUp]);
        }
        return output;
      }
      else if(nameLng < clickLng-thresh){
        start = mid + 1;
      }
      else{
        end = mid - 1;
      }
    }

  }

  // given an array sorted by latitude, a 2nd latitude, & a threshold
  // it returns an array of cities with a latitude within that threshold
  const cityNameSearch = function(arr, clickLat, thresh){
    let start = 0;
    let end = arr.length-1;
    let output = [];
    while(start<=end){
      let mid=Math.floor((start+end)/2);
      let nameLat= arr[mid].lat;
      if(nameLat < clickLat+thresh && nameLat > clickLat-thresh){
        output.push(arr[mid]);
        let countDown=mid-1;
        for(countDown; arr[countDown].lat < clickLat+thresh && arr[countDown].lat > clickLat-thresh; countDown--){
          output.push(arr[countDown]);
        }
        let countUp=mid+1;
        for(countUp; arr[countUp].lat < clickLat+thresh && arr[countUp].lat > clickLat-thresh; countUp++){
          output.push(arr[countUp])
        }
        let latArr = output.sort((a,b) => a.lng - b.lng);
        return (latArr);
      }
      else if(nameLat < clickLat-thresh){
        start = mid + 1;
      }
      else
        end = mid - 1;
    }
  }

  const betterCityList = markers.map((marker) => {
    let thresh = 0.05;
    let arr1 = cityNameSearch(citiesSortedByLat, marker.lat, thresh);
    let arr2 = binarySearchLng(arr1, marker.lng, thresh);
    return arr2;
  })


  return (
    <div className="sidebar">
      <button onClick={recenter}>Recenter</button>
      {console.log(betterCityList)}
      {/* <Search panTo={panTo} />
      <Locate panTo={panTo} /> */}
    </div>
  );
}