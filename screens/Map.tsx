import React, { useContext, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ImageBackground } from 'react-native';
import MapButton from '../components/MapButton';
import { UserContext } from '../context/UserContext';
import AcolythLaboratoryScreen from '../components/acolythLaboratoryScreen';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();

  const { isInsideLab, userData } = useContext(UserContext);

  const goToHome = () => {
    navigation.navigate('HomeAcolyth');
  };
  const goToLaboratory = () => {
    navigation.navigate('LaboratoryAcolyth');
  };

  useEffect(() => {
    console.log("changed is inside: " + isInsideLab);
    navigation.navigate('Map');
  }, [isInsideLab,navigation]);

  if (isInsideLab) {
    return(
      <AcolythLaboratoryScreen UserData={userData}/>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground
        source={require('../assets/map.png')}  // Ruta de la imagen de fondo
        style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
        resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
      >

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
    bottom: 160,
    right: 165,
    alignSelf: 'center',
  },
  buttonHome: {
    position: 'absolute',
    bottom: 100,
    right: 75,
    alignSelf: 'center',
  },

});

export default MapScreen;
