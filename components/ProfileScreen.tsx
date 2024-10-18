// ProfileScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import socket from '../sockets/socketConnection';

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
          <Text style={styles.signOutText}>Sign Out</Text>
        </ImageBackground>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,                    // Ocupa todo el espacio disponible
    justifyContent: 'center',   // Centra el contenido verticalmente
    alignItems: 'center',
    width:700,
    left:-180,    // Centra el contenido horizontalmente
  },
  signOutButton: {
    position: 'absolute',       // Posicionamiento absoluto para colocar el botón donde se desee
    bottom: 450,
    left: '50%',
    transform: [{ translateX: -100 }], // Mitad del ancho del botón para centrarlo
  },
  buttonImage: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 200,
    height: 100,
  },
  signOutText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  // Estilos adicionales que puedes necesitar
  // Por ejemplo, si deseas agregar más elementos en el futuro
});

export default ProfileScreen;
