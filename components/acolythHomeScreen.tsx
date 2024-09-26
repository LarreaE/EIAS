import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types/types';
import io from 'socket.io-client'; // Importar socket.io-client

// Definir el tipo para la prop navigation basado en RootStackParamList
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeAcolyth'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  setIsLoged: (value: boolean) => void;
};
//socket
const socket = io('http://localhost:3000');

const AcolythHomeScreen: React.FC<Props> = ({ navigation, setIsLoged }) => {
  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.translationX < -100) { // Si se desliza más de 100 px hacia la izquierda
      navigation.navigate('ProfileAcolyth'); // Navegar a la página de perfil
    }
    if (event.nativeEvent.translationX > 100) { // Si se desliza a la derecha más de 100 px
      navigation.navigate('LaboratoryAcolyth'); // Volver a la página de laboratorio
    }
  };

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

  // Función para enviar la solicitud POST al servidor
  const sendQRScan = async () => {
    const scannedEmail = 'jon.pazos@ikasle.aeg.eus'; // Cambia esto según sea necesario
    socket.emit('scan_acolyte', { scannedEmail }); // Enviar el email al servidor
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View style={styles.innerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Home Screen</Text>
          </View>
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={() => navigation.navigate('LaboratoryAcolyth')}
            >
              <Text style={styles.buttonText}>Laboratory</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={() => navigation.navigate('ProfileAcolyth')}
            >
              <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            {/* Botón para enviar el escaneo de QR */}
            <TouchableOpacity style={styles.roundButton} onPress={sendQRScan}>
              <Text style={styles.buttonText}>Enviar QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PanGestureHandler>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  signOutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  signOutText: {
    color: 'white',
    fontSize: 12,
  },
  roundButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 60,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AcolythHomeScreen;
