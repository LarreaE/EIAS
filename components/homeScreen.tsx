// HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';

// Definir el tipo para la prop navigation basado en RootStackParamList
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Home Screen</Text>
      </View>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Alinea los elementos al final de la pantalla
    alignItems: 'center', // Centra horizontalmente
    backgroundColor: 'grey',
  },
  titleContainer: {
    position: 'absolute',
    top: 20, // Espaciado desde la parte superior
    width: '100%', // Asegura que el contenedor del título ocupa el ancho completo
    alignItems: 'center', // Centra el título horizontalmente
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Controla el ancho del contenedor de los botones
    marginBottom: 30, // Espaciado desde la parte inferior
  },
  roundButton: {
    backgroundColor: '#007AFF', // Color de fondo
    padding: 15, // Espaciado interno
    borderRadius: 10, // Hace el botón redondo
    marginHorizontal: 10, // Espaciado horizontal entre los botones
    alignItems: 'center',
    justifyContent: 'center',
    width: 100, // Ancho del botón
    height: 60, // Alto del botón
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default HomeScreen;
