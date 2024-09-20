import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types/types';

// Definir el tipo para la prop navigation basado en RootStackParamList
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.translationX > 100) { // Si se desliza a la derecha más de 100 px
      navigation.navigate('Home'); // Volver a la página de inicio
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View style={styles.container}>
          <Text style={styles.text}>Another Screen</Text>
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
});

export default ProfileScreen;
