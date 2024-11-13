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

const { width, height } = Dimensions.get('window');
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const Swamp: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData } = context;

  // modes
  const [mapMode, setMapMode] = useState<'northUp' | 'facing' | 'free'>('northUp');
  const [location, setLocation] = useState({
    latitude: 42.5,
    longitude: -2,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
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
      return true;
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
          interval: 1000, //1 s updates
          timeout: 10000,
        }
      );

      return () => {
        if (watchId != null) {
          Geolocation.clearWatch(watchId);
        }
      };
    };

    getLocationUpdates();
  }, []);

  useEffect(() => {
    console.log(location);
    
  }, [location]);

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

      // switch (mapMode) {
      //   case 'northUp':
      //     camera = { ...camera, heading: 0 };
      //     break;
      //   case 'facing':
      //     camera = { ...camera, heading: 90 };
      //     break;
      //   case 'free':
          
      //     break;
      // }

      mapViewRef.current.animateCamera(camera, { duration: 1000 });
    }
  }, [ location]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
        showsCompass
        showsUserLocation
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={userData.playerData.nickname}
          anchor={{ x: 0.5, y: 0.5 }} // Center the marker
        >
          <MapMarker avatarUri={userData.playerData.avatar} />
        </Marker>
      </MapView>
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.modeButton} onPress={() => handleMapModeChange('northUp')}>
          <Text style={styles.buttonText}>North-Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modeButton} onPress={() => handleMapModeChange('facing')}>
          <Text style={styles.buttonText}>Facing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modeButton} onPress={() => handleMapModeChange('free')}>
          <Text style={styles.buttonText}>Free</Text>
        </TouchableOpacity> */}
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
