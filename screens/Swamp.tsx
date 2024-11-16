import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Dimensions,
  ToastAndroid,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  Region,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { UserContext, UserContextType } from '../context/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import MedievalText from '../components/MedievalText';
import {
  objectTaken,
  requestArtifacts,
  restoreObjects,
} from '../sockets/emitEvents';
import socket from '../sockets/socketConnection';
import { Locations } from '../interfaces/Location';
import MapMarker from '../components/MapMarker';
import { listenToArtifactsUpdates } from '../sockets/listenEvents';

const { width, height } = Dimensions.get('window');
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const Swamp: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData, otherAcolytes, setOtherAcolytes } = context;

  // State variables
  const [takenArtifacts, setTakenArtifacts] = useState<number[]>([]);
  const [isBagVisible, setIsBagVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  // Animation variables
  const [mapHeight] = useState(new Animated.Value(height));
  const [bagHeight] = useState(new Animated.Value(0));
  const bagMaxHeight = 150; // Maximum bag height
  const artifactImages = [
    require('../assets/artefact1.png'),
    require('../assets/artefact2.png'),
    require('../assets/artefact3.png'),
    require('../assets/artefact4.png'),
  ];

  // Fetch artifacts from the server
  useEffect(() => {
    requestArtifacts();
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setLoadingError('Server error: failed to load artifacts.');
    }, 10000);
    listenToArtifactsUpdates();
    socket.on('receive_artifacts', (artifacts) => {
      console.log('Artifacts received:', artifacts);
      clearTimeout(timeout);
      const mappedArtifacts = artifacts.map(
        (artifact: {
          id: any;
          latitude: any;
          longitude: any;
          isTaken: any;
          name: any;
        }) => ({
          id: artifact.id,
          latitude: artifact.latitude,
          longitude: artifact.longitude,
          isTaken: artifact.isTaken,
          inRange: false,
          name: artifact.name,
        })
      );
      setPointsOfInterest(mappedArtifacts);
      setIsLoading(false);

      const takenArtifactIds = mappedArtifacts
        .filter((artifact: { isTaken: any }) => artifact.isTaken)
        .map((artifact: { id: any }) => artifact.id);
      setTakenArtifacts(takenArtifactIds);
    });

    socket.on('update_artifacts', (artifacts) => {
      console.log('Artifacts updated:', artifacts);
      const mappedArtifacts = artifacts.map(
        (artifact: {
          id: any;
          latitude: any;
          longitude: any;
          isTaken: any;
          name: any;
        }) => ({
          id: artifact.id,
          latitude: artifact.latitude,
          longitude: artifact.longitude,
          isTaken: artifact.isTaken,
          inRange: false,
          name: artifact.name,
        })
      );
      setPointsOfInterest(mappedArtifacts);

      const takenArtifactIds = mappedArtifacts
        .filter((artifact: { isTaken: any }) => artifact.isTaken)
        .map((artifact: { id: any }) => artifact.id);
      setTakenArtifacts(takenArtifactIds);
    });

    return () => {
      socket.off('receive_artifacts');
      socket.off('update_artifacts');
      clearTimeout(timeout);
    };
  }, []);

  // Default map region
  const defaultRegion: Region = {
    latitude: 43.3110,
    longitude: -2.002,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [location, setLocation] = useState<Region>(defaultRegion);

  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
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

  // Get current location and watch position
  useEffect(() => {
    let watchId: number | null = null;

    const getCurrentLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
          }));
          socket.emit('locationUpdate', {
            userId: userData.playerData.nickname,
            avatar: userData.playerData.avatar,
            coords: { latitude, longitude },
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );

      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
          }));
          socket.emit('locationUpdate', {
            userId: userData.playerData.nickname,
            avatar: userData.playerData.avatar,
            coords: { latitude, longitude },
          });
          checkProximity(latitude, longitude);
        },
        (error) => console.error('Error watching location:', error),
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 1000,
          timeout: 10000,
        }
      );
    };

    if (userData.playerData.role === 'ACOLYTE') {
      getCurrentLocation();
    }

    socket.on('deviceLocations', (locations) => {
      setOtherAcolytes(locations);
    });

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
      socket.off('deviceLocations');
    };
  }, []);

  // Check proximity to artifacts
  const checkProximity = (latitude: number, longitude: number) => {
    setPointsOfInterest((prevPOIs) =>
      prevPOIs.map((poi) => {
        const distance = getDistance(
          latitude,
          longitude,
          poi.latitude,
          poi.longitude
        );
        if (distance < 50) {
          return { ...poi, inRange: true };
        }
        return { ...poi, inRange: false };
      })
    );
  };

  // Calculate distance between two coordinates
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Returns distance in meters
  };

  // Handle artifact collection
  const handleArtifactTake = (id: number) => {
    setPointsOfInterest((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isTaken: true } : p))
    );
    objectTaken(id);
    setTakenArtifacts((prev) => [...prev, id]);
  };

  // Handle returning artifacts
  const handleReturnArtifacts = () => {
    if (takenArtifacts.length === 0) {
      ToastAndroid.show('No artifacts to return.', ToastAndroid.SHORT);
      return;
    }
    setPointsOfInterest((prev) =>
      prev.map((p) =>
        takenArtifacts.includes(p.id) ? { ...p, isTaken: false } : p
      )
    );
    setTakenArtifacts([]);
    restoreObjects();
  };

  // Toggle the visibility of the bag
  const toggleBag = () => {
    setIsBagVisible(!isBagVisible);
    Animated.parallel([
      Animated.timing(bagHeight, {
        toValue: isBagVisible ? 0 : bagMaxHeight,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(mapHeight, {
        toValue: isBagVisible ? height : height - bagMaxHeight,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Loading and error handling
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>
          Loading Artifacts...
        </Text>
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
      <Animated.View style={{ height: mapHeight }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={location}
          showsCompass
          customMapStyle={mapStyle}
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
                <MapMarker
                  avatarUri={otherAcolytes[userId].avatar}
                />
              </Marker>
            );
          })}
          {(userData.playerData.role === 'ACOLYTE' ||
            userData.playerData.role === 'MORTIMER') &&
            pointsOfInterest.map(
              (poi,index) =>
                !poi.isTaken && (
                  <React.Fragment key={poi.id}>
                    <Marker
                      coordinate={{
                        latitude: poi.latitude,
                        longitude: poi.longitude,
                      }}
                      title={`Artifact ${poi.id}`}
                      onPress={() => {
                        if (poi.inRange) {
                          handleArtifactTake(poi.id);
                        } else {
                          ToastAndroid.show(
                            'Out of range',
                            ToastAndroid.SHORT
                          );
                        }
                      }}>
                        <Image
                  source={artifactImages[index]}
                  style={styles.artifactImage}
                />
                    </Marker>

                    <Circle
                      center={{
                        latitude: poi.latitude,
                        longitude: poi.longitude,
                      }}
                      radius={50}
                      fillColor={
                        poi.inRange
                          ? 'rgba(0, 255, 0, 0.2)'
                          : 'rgba(255, 0, 0, 0.2)'
                      }
                      strokeColor={
                        poi.inRange
                          ? 'rgba(0, 255, 0, 0.5)'
                          : 'rgba(255, 0, 0, 0.5)'
                      }
                    />
                  </React.Fragment>
                )
            )}
        </MapView>
      </Animated.View>

      {/* Button to show/hide the bag */}
      <TouchableOpacity
        style={styles.toggleBagButton}
        onPress={toggleBag}
      >
        <Text style={styles.toggleBagButtonText}>
          {isBagVisible ? '▼' : '▲'}
        </Text>
      </TouchableOpacity>

      {/* Bag of collected artifacts */}
      <Animated.View
        style={[styles.bagContainer, { height: bagHeight }]}
      >
        {/* Arrow to close the bag */}
        <TouchableOpacity
          style={styles.closeBagButton}
          onPress={toggleBag}
        >
          <Text style={styles.closeBagButtonText}>▼</Text>
        </TouchableOpacity>

        <View style={styles.gridContainer}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.gridItem}>
              {takenArtifacts[index] ? (
                <Text style={styles.artifactText}>
                  Artifact {takenArtifacts[index]}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
        {/* Button to return artifacts */}
        <TouchableOpacity
          style={styles.returnButton}
          onPress={handleReturnArtifacts}
        >
          <Text style={styles.returnButtonText}>
            Return Artifacts
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('Map')}
      >
        <MedievalText>Close</MedievalText>
      </TouchableOpacity>
    </View>
  );
};

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'water',
    stylers: [{ color: '#0f252e' }],
  },
  {
    featureType: 'landscape',
    stylers: [{ color: '#2f3e46' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#1c1c1c',
  },
  map: {
    width: width,
    height: '100%',
  },
  toggleBagButton: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: 'darkblue',
    padding: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  toggleBagButtonText: {
    color: 'white',
    fontSize: 18,
  },
  bagContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  closeBagButton: {
    alignSelf: 'center',
    marginBottom: 5,
  },
  closeBagButtonText: {
    color: 'white',
    fontSize: 18,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 40) / 4,
    height: (width - 40) / 4,
    backgroundColor: 'gray',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artifactText: {
    color: 'white',
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: 'darkred',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
    width: '50%',
  },
  returnButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: 'rgba(250, 250, 250, 0.4)',
    padding: 10,
    borderRadius: 5,
    borderColor: '#999',
    borderWidth: 1,
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
  artifactImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    top:10,
  },
});

export default Swamp;
