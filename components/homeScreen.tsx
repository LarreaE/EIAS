import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types/types';

// Definir el tipo para la prop navigation basado en RootStackParamList
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.translationX < -100) { // Si se desliza más de 100 px hacia la izquierda
      navigation.navigate('Profile'); // Navegar a la página de perfil
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
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
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'grey',
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
