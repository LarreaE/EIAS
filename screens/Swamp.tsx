import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, PermissionsAndroid, Platform, Dimensions, ToastAndroid, Text, FlatList, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { UserContext, UserContextType } from '../context/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import MedievalText from '../components/MedievalText';
import { objectTaken, requestArtifacts, restoreObjects } from '../sockets/emitEvents';
import socket from '../sockets/socketConnection';
import { Locations } from '../interfaces/Location';
import MapMarker from '../components/MapMarker';
import { listenToArtifactsUpdates } from '../sockets/listenEvents';

const { width, height } = Dimensions.get('window');
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const Swamp: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData } = context;
  const [otherAcolytes, setOtherAcolytes] = useState<Locations[]>([]);
  const [takenArtifacts, setTakenArtifacts] = useState<number[]>([]); // Lista de artefactos recogidos
  const [isBagVisible, setIsBagVisible] = useState<boolean>(false); // Estado para mostrar/ocultar la bolsa
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [pointsOfInterest, setPointsOfInterest] = useState([
    { id: 1, latitude: 43.3110, longitude: -2.002, isTaken: false, inRange: false },
    { id: 2, latitude: 43.3090, longitude: -2.002, isTaken: false, inRange: false },
    { id: 3, latitude: 43.3125, longitude: -2.000, isTaken: false, inRange: false },
    { id: 4, latitude: 43.3125, longitude: -1.999, isTaken: false, inRange: false },
  ]);
  useEffect(() => {

    requestArtifacts();
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setLoadingError('Server error: failed to load artifacts.');
    }, 10000);
    listenToArtifactsUpdates();
    socket.on('receive_artifacts', (artifacts) => {
      console.log('artifacts recived');
      console.log(artifacts);
      clearTimeout(timeout);
      setPointsOfInterest(artifacts.map((artifact: { id: any; latitude: any; longitude: any; isTaken: any; name: any; }) => ({
        id: artifact.id,
        latitude: artifact.latitude,
        longitude: artifact.longitude,
        isTaken: artifact.isTaken,
        inRange: false,
        name: artifact.name,
      })));
      setIsLoading(false);
    });

    return () => {
      socket.off('receive_artifacts');
      clearTimeout(timeout);
    };
  }, []);


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
            title: 'Permiso de ubicación',
            message: 'Esta app necesita acceder a tu ubicación',
            buttonNeutral: 'Pregúntame luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
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
            console.error('Error getting current location:', error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        );
      });


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
        (error) => console.error('Error watching location:', error),
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

  const checkProximity = (latitude: number, longitude: number) => {
    setPointsOfInterest((prevPOIs) => prevPOIs.map((poi) => {
      const distance = getDistance(latitude, longitude, poi.latitude, poi.longitude);
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

  const handleArtifactTake = (id: number) => {
    setPointsOfInterest((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isTaken: true } : p))
    );
    objectTaken(id);
    setTakenArtifacts((prev) => [...prev, id]); // Agrega el artefacto recogido a la lista
  };

  const handleReturnArtifacts = () => {
    setPointsOfInterest((prev) =>
      prev.map((p) => (takenArtifacts.includes(p.id) ? { ...p, isTaken: false } : p))
    );
    setTakenArtifacts([]); // Limpia la lista de artefactos recogidos
    restoreObjects();
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Artifacts...</Text>
      </View>
    );
  }

  if (loadingError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{loadingError}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
        showsCompass
      >
        {Object.keys(otherAcolytes).map((userId: any) => {
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
                title={`Artefact ${poi.id}`}
                onPress={() => {
                  if (poi.inRange) {
                    handleArtifactTake(poi.id);
                  } else {
                    ToastAndroid.show('Out of range', ToastAndroid.SHORT);
                  }
                }}
              />
              <Circle
                center={{ latitude: poi.latitude, longitude: poi.longitude }}
                radius={50} // Radio de interacción
                fillColor={poi.inRange ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'}
                strokeColor={poi.inRange ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'}
              />
            </React.Fragment>
          )
        )}
      </MapView>
      
      {/* Botón para abrir/cerrar la bolsa */}
      <TouchableOpacity style={styles.bagButton} onPress={() => setIsBagVisible(!isBagVisible)}>
        <Text style={styles.bagButtonText}>Bag</Text>
      </TouchableOpacity>

      {/* Lista de artefactos recogidos (se muestra solo si isBagVisible es true) */}
      {isBagVisible && (
        <View style={styles.takenArtifactsContainer}>
          <Text style={styles.takenArtifactsTitle}>Collected Artifacts:</Text>
          <FlatList
            data={takenArtifacts}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <Text style={styles.artifactItem}>Artifact {item}</Text>
            )}
          />
          {/* Botón para devolver artefactos al mapa (solo si hay artefactos en la bolsa) */}
          {takenArtifacts.length > 0 && (
            <TouchableOpacity style={styles.returnButton} onPress={handleReturnArtifacts}>
              <Text style={styles.returnButtonText}>Return Artifacts</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

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
    width: width,
    height: height,
  },
  bagButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 5,
  },
  bagButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  takenArtifactsContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: width * 0.4,
    maxHeight: height * 0.4,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 1,
  },
  takenArtifactsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  artifactItem: {
    fontSize: 14,
    padding: 5,
    color: 'white',
  },
  returnButton: {
    backgroundColor: 'darkred',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  returnButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default Swamp;
