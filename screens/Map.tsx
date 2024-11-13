import React, { useContext, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ImageBackground } from 'react-native';
import MapButton from '../components/MapButton';
import { UserContext, UserContextType } from '../context/UserContext';
import AcolythLaboratoryScreen from '../components/acolythLaboratoryScreen';
import { sendLocation } from '../sockets/emitEvents';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();

  const context = useContext(UserContext) as UserContextType;

  const { isInsideLab, userData } = context;

  sendLocation("Map", userData.playerData.email)

  const goToHome = () => {
    navigation.navigate('HomeAcolyth');
  };
  const goToLaboratory = () => {
    sendLocation('Laboratory', userData.playerData.email);
    navigation.navigate('LaboratoryAcolyth');
  };
  const goToTower = () => {
    sendLocation('Tower', userData.playerData.email);
    navigation.navigate('TowerAcolyth');
  };
  const goToSwamp = () => {
    navigation.navigate('Swamp');
  };
  const goToTowerMortimer = () => {
    navigation.navigate('TowerMortimer');

  };

  const goToLaboratoryMortimer = () => {
    navigation.navigate('LaboratoryMortimer');
  };

  if (isInsideLab) {
    return (
      <AcolythLaboratoryScreen UserData={userData} />
    );
  }

  switch (userData.playerData.role) {
    case 'MORTIMER':
      return (
        <GestureHandlerRootView style={styles.container}>
          <ImageBackground
            source={require('../assets/map.png')}  // Ruta de la imagen de fondo
            style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
            resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
          >

            <View style={styles.buttonTower}>
              <MapButton
                title="Tower"
                onPress={goToTowerMortimer}
                iconImage={require('../assets/home_icon.png')}
              />
            </View>

            <View style={styles.buttonLaboratory}>
              <MapButton
                title="Laboratory"
                onPress={goToLaboratoryMortimer}
                iconImage={require('../assets/laboratory_icon.png')}
              />
            </View>

          </ImageBackground>
        </GestureHandlerRootView>
      )

    default:

      return (
        <GestureHandlerRootView style={styles.container}>
          <ImageBackground
            source={require('../assets/map.png')}  // Ruta de la imagen de fondo
            style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
            resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
          >

            {userData.playerData.role === 'ACOLYTE' && (
              <View style={styles.buttonTower}>
                <MapButton
                  title="Tower"
                  onPress={goToTower}
                  iconImage={require('../assets/home_icon.png')}
                />
              </View>
            )}

        <View style={styles.buttonMap}>
            <MapButton
              title="Swamp"
              onPress={goToSwamp}
              iconImage={require('../assets/home_icon.png')}
            />
        </View>
            <View style={styles.buttonLaboratory}>
              <MapButton
                title="Laboratory"
                onPress={goToLaboratory}
                iconImage={require('../assets/laboratory_icon.png')}
              />
            </View>

            <View style={styles.buttonHome}>
              <MapButton
                title="Home"
                onPress={goToHome}
                iconImage={require('../assets/home_icon.png')}
              />
            </View>

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
    flex: 1, // Hace que la imagen de fondo ocupe todo el espacio disponible
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',     // Centra el contenido horizontalmente
  },
  buttonLaboratory: {
    position: 'absolute',
    bottom: height * 0.25,
    right: width * 0.45,
    alignSelf: 'center',
  },
  buttonHome: {
    position: 'absolute',
    bottom: height*0.15,
    right: width*0.1,
    alignSelf: 'center',
  },
  buttonMap: {
    position: 'absolute',
    bottom: height* 0.48,
    right: width* 0.8,
    alignSelf: 'center',
  },
  buttonTower: {
    position: 'absolute',
    bottom: height* 0.33,
    right: width* 0.72,
    alignSelf: 'center',
  },

});

export default MapScreen;
