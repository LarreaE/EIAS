import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground , Alert } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types/types';
import io from 'socket.io-client'; // Importar socket.io-client

type Props = {
  setIsLoged: (value: boolean) => void;
};
//socket
const socket = io('http://localhost:3000');

const AcolythHomeScreen: React.FC<Props> = ({ setIsLoged }) => {
  useEffect(() => {
    // Escuchar eventos del servidor
    socket.on('response', (data) => {
      Alert.alert('Server Response', data.message);
    });
    socket.on('alert', (data) => {
      Alert.alert('Server Response', data.message); // Muestra una alerta en el cliente
  });
    // Limpieza del efecto
    return () => {
      socket.off('response'); // Desconectar el evento cuando el componente se desmonte
      socket.disconnect(); // Desconectar el socket si es necesario
    };
  }, []);
  const signOut = () => {
    setIsLoged(false); // Cambiar el estado de inicio de sesión
    socket.disconnect();
  };


  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground
      source={require('../assets/home.png')}  // Ruta de la imagen de fondo
      style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
      resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
    >
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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