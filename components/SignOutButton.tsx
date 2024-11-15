import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import MedievalText from './MedievalText';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  setIsLoged: (value: boolean) => void;
};

const SignOutButton: React.FC<Props> = ({ setIsLoged }) => {
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setIsLoged(false); // Asegúrate de restablecer el estado de autenticación
    } catch (error) {
      console.log('Sign-out failed', error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={signOut}>
      <MedievalText style={styles.buttonText}>Sign Out</MedievalText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100, // Ancho del botón
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SignOutButton;
