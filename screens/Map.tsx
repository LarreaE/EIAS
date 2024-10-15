import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types'; // Asegúrate de que RootStackParamList incluya 'AcolythLaboratory'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ImageBackground } from 'react-native';
import MapButton from '../components/MapButton';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();

  const goToHome = () => {
    navigation.navigate('HomeAcolyth');
  };
  const goToLaboratory = () => {
    navigation.navigate('LaboratoryAcolyth');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground
        source={require('../assets/map.png')}  // Ruta de la imagen de fondo
        style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
        resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
      >

        <View style={styles.buttonSchool}>
          <MapButton
            title="Escuela"
            onPress={goToHome}
          />
        </View>

        <View style={styles.buttonContainer}>
          <MapButton
            title="Laboratorio"
            onPress={goToLaboratory}
          />
        </View>

      </ImageBackground>
    </GestureHandlerRootView>
  );
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
  buttonContainer: {
    position: 'absolute',
    bottom: 200, 
    alignSelf: 'center',
  },
  buttonSchool: {
    position: 'absolute',
    bottom: 300,
    alignSelf: 'center',
  },

});

export default MapScreen;
