import { useEffect, useState } from 'react';
import { promptForEnableLocationIfNeeded, isLocationEnabled } from 'react-native-android-location-enabler';
import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { setCurrentLocation } from '../redux/actions/userActions';

const fetchAddress = async (latitude, longitude,  setSelectedCity, setSelectedState) => {
    console.log(latitude, longitude);
    
    try {
        //
        const response = await fetch(
            'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' +
            latitude +
            '&longitude=' +
            longitude +
            '&localityLanguage=en',
        );
        if (!response.ok) {
            throw new Error('Failed to fetch address');
        }
        const responseJson = await response.json();
        let city = responseJson.city != '' ? responseJson.city : '';
        //
        console.log(city, latitude, longitude, responseJson?.principalSubdivision);
        setSelectedCity(city)
        setSelectedState(responseJson?.principalSubdivision)
  } catch (error) {
  }
};

const getLocation = async (setSelectedCity, setSelectedState ) => {
    

  if (Platform.OS === 'android') {
    const checkEnabled = await isLocationEnabled();
    if (checkEnabled) {
      try {
        Geolocation.getCurrentPosition(
          position => {
            fetchAddress(position.coords.latitude, position.coords.longitude, setSelectedCity, setSelectedState  );
          },
          error => {
            try {
              Geolocation.getCurrentPosition(
                position => {

                  fetchAddress(
                    position.coords.latitude,
                    position.coords.longitude,
                    setSelectedCity, setSelectedState
                     
                  );
                },
                error => {
                  handleEnabledPressed( setSelectedCity, setSelectedState);
                },
                { enableHighAccuracy: true, timeout: 15000 },
              );
            } catch (error) { }
          },
          { enableHighAccuracy: false, timeout: 15000 },
        );
      } catch (error) { }
    } else {
      handleEnabledPressed( setSelectedCity, setSelectedState);
    }
  }
};

async function handleEnabledPressed(setSelectedCity, setSelectedState ) {
  if (Platform.OS === 'android') {
    try {
      await promptForEnableLocationIfNeeded();

      getLocation(setSelectedCity, setSelectedState );
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
    } catch (error) {
      if (error instanceof Error) {
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        //  - ERR03 : Internal error
      }
    }
  }
}

const requestLocationPermission = async (setSelectedCity, setSelectedState) => {
    
  try {

      
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
                position => {
                    getLocation(setSelectedCity, setSelectedState);
                },
                error => {
                    Geolocation.getCurrentPosition(
                        position => {
                            getLocation(setSelectedCity, setSelectedState );
                        },
                        error => {
                            handleEnabledPressed( setSelectedCity, setSelectedState);
                        },
                        { enableHighAccuracy: true, timeout: 15000 },
                    );
                },
                { enableHighAccuracy: false, timeout: 15000 },
            );
        } else {
        console.log(" else requestLocationPermission");
    }
  } catch (error) {
    console.log(error);
    
  }
};
const FetchLocation = (setSelectedCity, setSelectedState ) => {
    requestLocationPermission(setSelectedCity, setSelectedState);
  return null;
};

export default FetchLocation;
