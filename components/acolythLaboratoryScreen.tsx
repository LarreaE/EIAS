import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types/types';

// Definir el tipo para la prop navigation basado en RootStackParamList
type LaboratoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LaboratoryAcolyth'>;

type Props = {
    navigation: LaboratoryScreenNavigationProp;
    };
const LaboratoryScreen: React.FC<Props> = ({ navigation }) => {
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => navigation.navigate('HomeAcolyth')}
              >
                <Text style={styles.buttonText}>Home</Text>
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