import React, { useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, ImageBackground, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapButton from '../components/MapButton';
import { UserContext, UserContextType } from '../context/UserContext';
import { sendLocation } from '../sockets/emitEvents';

const { width, height } = Dimensions.get('window');

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData, isHallInNeedOfMortimer } = context;

  // Animación de los pájaros
  const birdPosition = useRef(new Animated.Value(width + 50)).current; // Inicia fuera de la pantalla por la derecha
  const birdYPosition = useRef(new Animated.Value(height * 0.5)).current; // Posición vertical inicial
  const birdOpacity = useRef(new Animated.Value(1)).current; // Controla la opacidad del GIF

  const animateBirds = () => {
    // Generar posición aleatoria en el eje Y (toda la pantalla)
    const randomY = Math.random() * (height - 200); // Asegura que no salga del rango vertical

    // Configurar posición Y aleatoria
    birdYPosition.setValue(randomY);

    // Reiniciar posición horizontal y opacidad
    birdPosition.setValue(width + 50);
    birdOpacity.setValue(1);

    // Animar el movimiento horizontal
    Animated.timing(birdPosition, {
      toValue: -1050, // Un poco más allá del borde izquierdo
      duration: 9000, // Duración de la animación
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      // Hacer desaparecer el GIF cuando esté completamente fuera
      Animated.timing(birdOpacity, {
        toValue: 0,
        duration: 1000, // Tiempo para desaparecer
        useNativeDriver: true,
      }).start(() => animateBirds());
    });
  };

  useEffect(() => {
    animateBirds();
  }, []);
  const goToTower = () => {
    sendLocation('Tower', userData.playerData.email);
    navigation.navigate('TowerAcolyth');
  };
  const goToSwamp = () => {
    sendLocation('Swamp', userData.playerData.email);
    navigation.navigate('Swamp');
  };
  const goToTHOS = () => {
    sendLocation('THOS', userData.playerData.email);
    navigation.navigate('THOS');
  };
  const goToTIOTF = () => {
    sendLocation('TIOTF', userData.playerData.email);
    navigation.navigate('TIOTF');
  };
  const goToTowerMortimer = () => {
    sendLocation('Tower', userData.playerData.email);
    navigation.navigate('TowerMortimer');
  };
  const goToSchool = () => {
    sendLocation('School', userData.playerData.email);
    navigation.navigate('School');
  };
  const goToObituaryDoor = () => {
    sendLocation('ObituaryDoor', userData.playerData.email);
    navigation.navigate('ObituaryDoor');
  };

  switch (userData.playerData.role) {
    case 'MORTIMER':
      return (
<GestureHandlerRootView style={styles.container}>
  <ImageBackground
    source={require('../assets/map.png')}
    style={styles.background}
    resizeMode="cover"
  >
    {/* Animación de los pájaros (detrás de los botones) */}
    <Animated.Image
      source={require('../assets/animations/birds.gif')}
      style={[
        styles.gifStyle,
        {
          transform: [{ translateX: birdPosition }, { translateY: birdYPosition }],
          opacity: birdOpacity,
        },
      ]}
    />

    {/* Botones del mapa */}
    <View style={[styles.buttonTower]}>
      <MapButton
        title="Tower"
        onPress={goToTowerMortimer}
        iconImage={require('../assets/tower_icon.png')}
      />
    </View>
    <View style={[styles.buttonMap]}>
      <MapButton
        title="Swamp"
        onPress={goToSwamp}
        iconImage={require('../assets/swamp_icon.png')}
      />
    </View>
    <View style={[styles.buttonSchool]}>
      <MapButton
        title="School"
        onPress={goToSchool}
        iconImage={require('../assets/school_icon.png')}
        isGlowing={isHallInNeedOfMortimer}
      />
    </View>
    {userData.playerData.ArtifactsValidated === true && (
      <View style={styles.buttonObituaryDoor}>
        <MapButton
          title="Obituary"
          onPress={goToObituaryDoor}
          iconImage={require('../assets/obituary_door_icon.png')}
        />
      </View>
    )}
  </ImageBackground>
</GestureHandlerRootView>
      );
    default:
      return (
        <GestureHandlerRootView style={styles.container}>
          <ImageBackground
            source={require('../assets/map.png')}
            style={styles.background}
            resizeMode="cover"
          >
            {userData.playerData.role === 'ACOLYTE' && (
              <View style={styles.buttonTower}>
                <MapButton
                  title="Tower"
                  onPress={goToTower}
                  iconImage={require('../assets/tower_icon.png')}
                />
              </View>
            )}
            <View style={styles.buttonSchool}>
              <MapButton
                title="School"
                onPress={goToSchool}
                iconImage={require('../assets/school_icon.png')}
              />
            </View>
            <View style={styles.buttonMap}>
              <MapButton
                title="Swamp"
                onPress={goToSwamp}
                iconImage={require('../assets/swamp_icon.png')}
              />
            </View>
            {userData.playerData.ArtifactsValidated  === true && (
              <View style={styles.buttonObituaryDoor}>
                <MapButton
                  title="Obituary"
                  onPress={goToObituaryDoor}
                  iconImage={require('../assets/obituary_door_icon.png')}
                />
              </View>
            )}
            <View style={styles.buttonMapTHOS}>
              <MapButton
                title="The hollow of the lost"
                onPress={goToTHOS}
                iconImage={require('../assets/THOS-icon.png')}
              />
            </View>
            <View style={styles.buttonMapTIOTF}>
              <MapButton
                title="The Inn of the Forgotten"
                onPress={goToTIOTF}
                iconImage={require('../assets/TIOTF-icon.png')}
              />
            </View>

            {/* Animación de los pájaros */}
            <Animated.Image
              source={require('../assets/animations/birds.gif')}
              style={[
                styles.gifStyle,
                {
                  transform: [{ translateX: birdPosition }, { translateY: birdYPosition }],
                  opacity: birdOpacity,
                },
              ]}
            />
          </ImageBackground>
        </GestureHandlerRootView>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifStyle: {
    position: 'absolute',
    width: width * 0.3,
    height: height * 0.08,
    zIndex: 0,
  },
  icon: {
    width: 66,
    height: 66,
  },
  buttonTower: {
    position: 'absolute',
    bottom: height * 0.5,
    right: width * 0.64,
    alignSelf: 'center',
    zIndex: 1,
  },
  buttonMap: {
    position: 'absolute',
    bottom: height * 0.33,
    right: width * 0.7,
    alignSelf: 'center',
    zIndex: 1,
  },
  buttonMapTHOS: {
    position: 'absolute',
    bottom: height * 0.70,
    right: width * 0.65,
    alignSelf: 'center',
    zIndex: 1,
  },
  buttonMapTIOTF: {
    position: 'absolute',
    bottom: height * 0.17,
    right: width * 0.77,
    alignSelf: 'center',
    zIndex: 1,
  },
  buttonSchool: {
    position: 'absolute',
    bottom: height * 0.1,
    right: width * 0.12,
    alignSelf: 'center',
    zIndex: 1,
  },
  buttonHome: {
    position: 'absolute',
    bottom: height * 0.05,
    right: width * 0.77,
    alignSelf: 'center',
    zIndex: 1,
  },
  buttonObituaryDoor:{
    position: 'absolute',
    bottom: height * 0.45,
    right: width * 0.25,
    alignSelf: 'center',
    zIndex: 1,
  },
});

export default MapScreen;