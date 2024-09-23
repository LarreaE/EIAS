import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type Props = {
  setIsLoged: (value: boolean) => void;
};

const SignOutButton: React.FC<Props> = ({ setIsLoged }) => {
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setIsLoged(false); // Asegúrate de restablecer el estado de autenticación
    } catch (error) {
      console.log('Sign-out failed', error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={signOut}>
      <Text style={styles.buttonText}>Sign Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#d9534f', // Color rojo para el botón
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
