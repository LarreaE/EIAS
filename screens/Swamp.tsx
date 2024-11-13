import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform ,StyleSheet} from 'react-native';

const Swamp: React.FC = () => {
  // location state
  const [location, setLocation] = useState({
    latitude: 42.5,   // 
    longitude: -2, // 
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs to access your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS automatically asks for permission
    }
  };
  
  useEffect(() => {
    const getLocationUpdates = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log("Location permission not granted");
        return;
      }
  
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error("Error watching location:", error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
          timeout: 10000, // Extended timeout to prevent timeouts on slower devices
        }
      );
  
      // Clean up on component unmount
      return () => {
        if (watchId != null) {
          Geolocation.clearWatch(watchId);
        }
      };
    };
  
    getLocationUpdates();
  }, []);

  useEffect(() => {
    // Request location and update map position
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prevLocation) => ({
          ...prevLocation,
          latitude,
          longitude,
        }));
      },
      // (error) => {
      //   console.error("Error getting location:", error);
      // },
      // {
      //   enableHighAccuracy: true,
      //   timeout: 20000,
      //   maximumAge: 1000,
      // }
    );
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
        />
      </MapView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Swamp;
