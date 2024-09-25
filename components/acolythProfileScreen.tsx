/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types/types';

// Definir el tipo para la prop navigation basado en RootStackParamList
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileAcolyth'>;



type Props = {
  navigation: ProfileScreenNavigationProp;
  user: User;
};

const AcolythProfileScreen: React.FC<Props> = ({ navigation, user }) => {
  const userName = user?.decodedToken?.name || 'No name available';
  const userEmail = user?.decodedToken?.email || 'No email available';
  // Maneja el gesto de deslizamiento
  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.translationX > 100) { // Si se desliza a la derecha más de 100 px
      navigation.navigate('HomeAcolyth'); // Volver a la página de inicio
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View style={styles.container}>
          {/* Mostrar el nombre y el email del usuario desde las props */}
          <Text style={styles.text}>User name: {userName}</Text>
          <Text style={styles.text}>Email: {userEmail}</Text>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
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

export default AcolythProfileScreen;
