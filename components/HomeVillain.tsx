import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import socket from '../sockets/socketConnection';

type Props = {
  setIsLoged: (value: boolean) => void;
  user: any;  // Datos del usuario pasados como prop desde la pantalla principal
};

const HomeVillain: React.FC<Props> = ({setIsLoged, user}) => {

  const userName = user?.playerData.nickname || 'No name available';

  const signOut = () => {
    setIsLoged(false); // Cambiar el estado de inicio de sesión
    socket.disconnect();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      <Text style={styles.text}>VILLAIN</Text>
      <Text style={styles.text}>User name: {userName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  text: {
    fontSize: 24,
    color: 'black',
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

export default HomeVillain;
