import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types/types';

// Definir el tipo para la prop navigation basado en RootStackParamList
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  setIsLoged: (value: boolean) => void;
};

const HomeScreen: React.FC<Props> = ({ navigation, setIsLoged }) => {
  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.translationX < -100) { // Si se desliza más de 100 px hacia la izquierda
      navigation.navigate('Profile'); // Navegar a la página de perfil
    }
  };

  const signOut = () => {
    setIsLoged(false); // Cambiar el estado de inicio de sesión
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
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.buttonText}>Go to Profile</Text>
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
    top: 20,                  // Espaciado desde la parte superior
    right: 20,                // Espaciado desde la derecha
    backgroundColor: 'red',   // Fondo rojo
    padding: 10,
    borderRadius: 5,
  },
  signOutText: {
    color: 'white',           // Texto en color blanco
    fontSize: 12,             // Tamaño de fuente pequeño
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

export default HomeScreen;
