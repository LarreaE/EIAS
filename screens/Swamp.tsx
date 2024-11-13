import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Camera } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext, UserContextType } from '../context/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import MedievalText from '../components/MedievalText';
import MapMarker from '../components/MapMarker';
import socket from '../sockets/socketConnection';
import { Locations } from '../interfaces/Location';

const { width, height } = Dimensions.get('window');
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const Swamp: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData } = context;
  const [otherAcolytes, setOtherAcolytes] = useState<Locations[]>([]);
  
  //modes
  const [mapMode, setMapMode] = useState<'northUp' | 'facing' | 'free'>('northUp');
  const [location, setLocation] = useState({
    latitude: 42.5,
    longitude: -2,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // permission
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
      return true;
    }
  };
  
  // initial location
  useEffect(() => {
    const getCurrentLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log("Location permission not granted");
        return;
      }

      socket.on('connect',() => {
        // current position
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation((prevLocation) => ({
              ...prevLocation,
              latitude,
              longitude,
            }));
          },
          (error) => {
            console.error("Error getting current location:", error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        );
      })
      

      //updates
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
          }));
          socket.emit('locationUpdate', { userId: userData.playerData.nickname, avatar: userData.playerData.avatar, location: { latitude, longitude } });
        },
        (error) => {
          console.error("Error watching location:", error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 1000,
          timeout: 10000,
        }
      );

      return () => {
        if (watchId != null) {
          Geolocation.clearWatch(watchId);
          socket.disconnect();
        }
      };
    };

    getCurrentLocation();

    socket.on('deviceLocations', (locations) => {
      setOtherAcolytes(locations);
    });

  }, []);

  useEffect(() => {
    console.log(location);
  }, [location]);

  useEffect(() => {
    console.log("Other acolytes",otherAcolytes);
  }, [otherAcolytes]);

  const handleMapModeChange = (mode: 'northUp' | 'facing' | 'free') => {
    setMapMode(mode);
  };

  const mapViewRef = React.useRef<MapView | null>(null);

  useEffect(() => {
    if (mapViewRef.current) {
      let camera: Partial<Camera> = {
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        heading: 0,
        pitch: 0,
        zoom: 18,
      };

      mapViewRef.current.animateCamera(camera, { duration: 1000 });
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
        showsCompass
        showsUserLocation
      >
        {Object.keys(otherAcolytes).map((userId:any) => {
          const deviceLocation = otherAcolytes[userId];
          if (userId !== userData.playerData.nickname) { // Exclude current user's marker
            return (
              <Marker
                key={userId}
                coordinate={{
                  latitude: deviceLocation.latitude,
                  longitude: deviceLocation.longitude,
                }}
              >
                <MapMarker avatarUri={otherAcolytes[userId].avatar} />
              </Marker>
            );
          }
          return null;
        })}
      </MapView>
      <View style={styles.buttonContainer}>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('Map')}>
        <MedievalText>Close</MedievalText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    borderColor: 'yellow',
    borderWidth: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    top: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modeButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
});

export default Swamp;
