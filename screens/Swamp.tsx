import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, PermissionsAndroid, Platform, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { UserContext, UserContextType } from '../context/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import MedievalText from '../components/MedievalText';
import { objectTaken } from '../sockets/emitEvents';
import socket from '../sockets/socketConnection';
import { Locations } from '../interfaces/Location';
import MapMarker from '../components/MapMarker';

const { width, height } = Dimensions.get('window');
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const Swamp: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData } = context;
  const [otherAcolytes, setOtherAcolytes] = useState<Locations[]>([]);
  
  // Puntos de interés
  const [pointsOfInterest, setPointsOfInterest] = useState([
    { id: 1, latitude: 43.3125, longitude: -2.000, isTaken: false, inRange: false },
    { id: 2, latitude: 43.3125, longitude: -2.001, isTaken: false, inRange: false },
    { id: 3, latitude: 43.3125, longitude: -2.000, isTaken: false, inRange: false },
    { id: 4, latitude: 43.3125, longitude: -1.999, isTaken: false, inRange: false },
  ]);

  // Centra la cámara cerca de los puntos de interés al inicio
  const initialRegion: Region = {
    latitude: pointsOfInterest.reduce((sum, poi) => sum + poi.latitude, 0) / pointsOfInterest.length,
    longitude: pointsOfInterest.reduce((sum, poi) => sum + poi.longitude, 0) / pointsOfInterest.length,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  
  const [location, setLocation] = useState(initialRegion);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permiso de ubicación",
            message: "Esta app necesita acceder a tu ubicación",
            buttonNeutral: "Pregúntame luego",
            buttonNegative: "Cancelar",
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
    let watchId: number | null = null;

    const getCurrentLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

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
      

      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
          }));
          socket.emit('locationUpdate', { userId: userData.playerData.nickname, avatar: userData.playerData.avatar, coords: { latitude, longitude } });
          checkProximity(latitude, longitude);
        },
        (error) => console.error("Error watching location:", error),
        { enableHighAccuracy: true, distanceFilter: 10, interval: 1000, timeout: 10000 }
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


    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    console.log("Ubicación actualizada:", location);
  }, [location]);

  useEffect(() => {
    console.log("Other acolytes",otherAcolytes);
  }, [otherAcolytes]);


  const mapViewRef = React.useRef<MapView | null>(null);

  useEffect(() => {
    console.log("Puntos de interés actualizados:", pointsOfInterest);
  }, [pointsOfInterest]);

  const checkProximity = (latitude: number, longitude: number) => {
    setPointsOfInterest((prevPOIs) => prevPOIs.map((poi) => {
      const distance = getDistance(latitude, longitude, poi.latitude, poi.longitude);
      console.log(`Distancia al POI ${poi.id}: ${distance} metros`);
      if (distance < 50) {
        return { ...poi, inRange: true };
      }
      return { ...poi, inRange: false };
    }));
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // devuelve la distancia en metros
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
        showsCompass
      >
        {Object.keys(otherAcolytes).map((userId:any) => {
          const deviceLocation = otherAcolytes[userId];
            return (
              <Marker
                key={userId}
                title={userId}
                coordinate={{
                  latitude: deviceLocation.coords.latitude,
                  longitude: deviceLocation.coords.longitude,
                }}
              >
                <MapMarker avatarUri={otherAcolytes[userId].avatar} />
              </Marker>
            );
        })}
         {pointsOfInterest.map((poi) =>
          !poi.isTaken && (
            <React.Fragment key={poi.id}>
              <Marker
                coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
                title={`POI ${poi.id}`}
                onPress={() => {
                  setPointsOfInterest((prev) =>
                    prev.map((p) => (p.id === poi.id ? { ...p, isTaken: true } : p))
                  );
                  objectTaken(poi.id);
                }}
              />
              <Circle
                center={{ latitude: poi.latitude, longitude: poi.longitude }}
                radius={50} // Radio de interacción
                fillColor={poi.inRange ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 150, 255, 0.2)"}
                strokeColor={poi.inRange ? "rgba(0, 255, 0, 0.5)" : "rgba(0, 150, 255, 0.5)"}
              />
            </React.Fragment>
          )
        )}
      </MapView>
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
  closeButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
});

export default Swamp;