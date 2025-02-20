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

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'School'>;

const TheHollowOfStages: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();

  const context = useContext(UserContext) as UserContextType;

  const { isInsideLab, userData, isHallInNeedOfMortimer } = context;

  const goToLaboratory = () => {
    sendLocation('Laboratory', userData.playerData.email);
    navigation.navigate('LaboratoryAcolyth');
  };
  const goToMap = () => {
    sendLocation('Map', userData.playerData.email);
    navigation.navigate('Map');
  };
  const goToQRScanner = () => {
    sendLocation('', userData.playerData.email);
    navigation.navigate('QRScanner');
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
            source={require('../assets/hollow_of_the_losts.png')}  // Ruta de la imagen de fondo
            style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
            resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
          >

            <View style={styles.buttonMap}>
              <MapButton
                title="Map"
                onPress={goToMap}
                iconImage={require('../assets/map_icon.png')}
              />
            </View>
          </ImageBackground>
        </GestureHandlerRootView>
      );

      case 'ACOLYTE':
      return (
        <GestureHandlerRootView style={styles.container}>
          <ImageBackground
            source={require('../assets/hollow_of_the_losts.png')}  // Ruta de la imagen de fondo
            style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
            resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
          >

            <View style={styles.buttonMap}>
              <MapButton
                title="Map"
                onPress={goToMap}
                iconImage={require('../assets/map_icon.png')}
              />
            </View>
          </ImageBackground>
        </GestureHandlerRootView>
      );

    default:

      return (
        <GestureHandlerRootView style={styles.container}>
          <ImageBackground
            source={require('../assets/hollow_of_the_losts.png')}  // Ruta de la imagen de fondo
            style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
            resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
          >

            
            {userData.playerData.role != 'ISTVAN' && (
              <View style={styles.buttonLaboratory}>
                <MapButton
                    title="Laboratory"
                    onPress={goToLaboratory}
                    iconImage={require('../assets/laboratory_icon.png')}
                />
              </View>
            )}

            {userData.playerData.role === 'ISTVAN' && (
              <View style={styles.buttonLaboratory}>
                <MapButton
                  title="Laboratory"
                  onPress={goToQRScanner}
                  iconImage={require('../assets/QR_icon.png')}
                />
              </View>
            )}

            <View style={styles.buttonMap}>
              <MapButton
                title="Map"
                onPress={goToMap}
                iconImage={require('../assets/map_icon.png')}
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
    bottom: height * 0.37,
    right: width * 0.5,
    alignSelf: 'center',
  },
  buttonMap: {
    position: 'absolute',
    bottom: height * 0.0,
    right: width * 0.485,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',    // Centra el texto horizontalmente
    fontSize: 16,           // Tamaño de fuente ajustado
    color: 'white',         // Color de fuente
  },

});

export default TheHollowOfStages;
