import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import socket from '../sockets/socketConnection';
import MedievalText from './MedievalText';

type Props = {
  user: any;  // Datos del usuario pasados como prop desde la pantalla principal
  setIsLoged: (value: boolean) => void;
};

const ProfileScreen: React.FC<Props> = ({ user, setIsLoged }) => {

  const signOut = () => {
    setIsLoged(false); // Cambiar el estado de inicio de sesión
    socket.disconnect();
  };
  useEffect(() => {
    console.log('user:');
    console.log(user);
  }, []);


  return (
    <ImageBackground
      source={require('../assets/settings_background_04.png')}  // Ruta de la imagen de fondo
      style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
      resizeMode="cover"         // Ajuste de la imagen para que se recorte y adapte mejor
    >
      {/* Texto de bienvenida centrado */}
      <View style={styles.welcomeContainer}>
      <MedievalText style={styles.welcomeText}>{`Welcome back, ${user.playerData.role}`}</MedievalText>
      <MedievalText style={styles.welcomeText}>{`\nUser identity: \n ${user.playerData.name}`}</MedievalText>
      </View>

      {/* Botón de Cierre de Sesión */}
      <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
        <ImageBackground
          source={require('../assets/boton.png')}  // Ruta de la imagen del botón
          style={styles.buttonImage}  // Estilos para la imagen dentro del botón
          resizeMode="cover"         // Ajuste de la imagen
        >
          <MedievalText style={styles.signOutText}>Sign Out</MedievalText>
        </ImageBackground>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,                    // Ocupa todo el espacio disponible
    width: '100%',
    height: '100%',
  },
  welcomeContainer: {
    position: 'absolute',       // Posicionamiento absoluto para centrarlo en la pantalla
    top: '40%',                 // Ajusta esto para centrar verticalmente según tus necesidades
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(200, 200, 200, 0.7)', // Fondo gris claro con opacidad
    padding: 15,                // Espaciado interno
    borderRadius: 10,           // Bordes redondeados
    alignItems: 'center',       // Centrar el texto horizontalmente
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  signOutButton: {
    position: 'absolute',       // Posicionamiento absoluto para colocar el botón en la parte inferior
    bottom: 100,                 // Distancia desde el fondo de la pantalla
    alignSelf: 'center',        // Centrar el botón horizontalmente
    width: 150,                 // Reducir el ancho del botón
    height: 80,                 // Reducir la altura del botón
  },
  buttonImage: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',              // Ajustar la imagen al ancho del botón
    height: '100%',             // Ajustar la imagen a la altura del botón
  },
  signOutText: {
    color: 'white',
    fontSize: 18,               // Reducir el tamaño del texto
  },
});

export default ProfileScreen;