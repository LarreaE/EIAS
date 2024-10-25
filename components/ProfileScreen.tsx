// ProfileScreen.tsx

import React from 'react';
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

  return (
    <ImageBackground
      source={require('../assets/settings_background_04.png')}  // Ruta de la imagen de fondo
      style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
      resizeMode="stretch"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
    >
      {/* Botón de Cierre de Sesión */}
      <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
        <ImageBackground
          source={require('../assets/boton.png')}  // Ruta de la imagen del botón
          style={styles.buttonImage}  // Estilos para la imagen dentro del botón
          resizeMode="cover"         // Ajuste de la imagen
        >
          <MedievalText style={styles.signOutText}>Sing Out</MedievalText>
        </ImageBackground>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,                    // Ocupa todo el espacio disponible
    width:'165%',
    height: '170%',
    left:'-100%',
  },
  signOutButton: {
    position: 'relative',       // Posicionamiento absoluto para colocar el botón donde se desee
    bottom: '-60%',
    left:'60%',
    width: '250%',
    height: '70%',
  },
  buttonImage: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '50%',
    height: '70%',
  },
  signOutText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    left:'-25%',
    top:'-15%',
  },
  // Estilos adicionales que puedes necesitar
  // Por ejemplo, si deseas agregar más elementos en el futuro
});

export default ProfileScreen;
