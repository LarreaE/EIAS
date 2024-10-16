import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import socket from '../sockets/socketConnection';

type Props = {

};

const AcolythHomeScreen: React.FC<Props> = ({ }) => {


  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground
        source={require('../assets/home_stay.png')}  // Ruta de la imagen de fondo
        style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
        resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
      >
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 20,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
  signOutButton: {
    position: 'absolute',
    top: 20,
    right: -190,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  signOutText: {
    color: 'white',
    fontSize: 12,
  },
  background: {
    flex: 1, // Hace que la imagen de fondo ocupe todo el espacio disponible
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',     // Centra el contenido horizontalmente
  },
});

export default AcolythHomeScreen;
