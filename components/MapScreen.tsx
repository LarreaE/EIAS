import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ImageBackground } from 'react-native';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();

  return (

    <GestureHandlerRootView style={styles.container}>
      <ImageBackground
        source={require('../assets/map.png')}  // Ruta de la imagen de fondo
        style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
        resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
      >
      </ImageBackground>

      <View style={styles.container}>
        <Button
          title="Ir a Settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <Button
          title="Ir a HomeAcolyth"
          onPress={() => navigation.navigate('HomeAcolyth')}
        />
        <Button
          title="Ir a LaboratoryAcolyth"
          onPress={() => navigation.navigate('LaboratoryAcolyth')}
        />
      </View>
    </GestureHandlerRootView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1, // Hace que la imagen de fondo ocupe todo el espacio disponible
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',     // Centra el contenido horizontalmente
  },
});

export default MapScreen;
