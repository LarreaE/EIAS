import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Spinner from './Spinner'; // Importa el Spinner
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

interface Props {
  setIsLoged: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GoogleSignInProps {
  onLoginSuccess: (userData: any) => void;
}


const GoogleSignInComponent: React.FC<GoogleSignInProps> = ({onLoginSuccess}) => {
  const [userInfo, setUserInfo] = useState<User | null>(null); // Store user info
  const [loggedIn, setLoggedIn] = useState(false); // Login status
  const [errorMessage, setErrorMessage] = useState(''); // Error message

  useEffect(() => {
    const configureGoogleSignIn = async () => {
      await GoogleSignin.configure({
        webClientId: Config.GOOGLE_WEB_CLIENT_ID, // Asegúrate de tener esto configurado
        offlineAccess: true,
      });
    };
    
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    try {
      const userInfo = await GoogleSignin.signIn(); 
      setUserInfo(userInfo.data!); // Set user info to state
      setLoggedIn(true); // Set logged in state to true
      await userRequest(userInfo.data!.user.email); // Call Kaotika user request
    } catch (error) {
      setErrorMessage('An unknown error occurred.');
      setLoggedIn(false);
    }
  };

  // API request to Kaotika server
  const userRequest = async (email: string) => {
    try {
      const url = `https://kaotika-server.fly.dev/players/email/${email}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        onLoginSuccess(jsonResponse)
        Alert.alert('Success', `Welcome ${jsonResponse.data.nickname}`);
      } else {
        Alert.alert('Error', `Server responded with status code: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to receive data from server.');
    }
  };

  // Sign out method
  const signOut = async () => {
    // Show confirmation dialog
    Alert.alert(
      'Confirm Log Out', // Title
      'Are you sure you want to log out?', // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Log out cancelled'),
          style: 'cancel', // Style of the button (iOS specific)
        },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              await GoogleSignin.signOut(); // Proceed with the actual sign-out
              setUserInfo(null); // Clear user info
              setLoggedIn(false); // Set logged in state to false
            } catch (error) {
              setErrorMessage('Sign-out failed. Try again.');
            }
          },
        },
      ],
      { cancelable: false } // Prevent dismissing the dialog by tapping outside
    );
  };

  return (
    <View style={styles.outerContainer}>
    {loading && <Spinner />}
    <TouchableOpacity onPress={signIn} disabled={loading}>
      <View style={styles.container}>
        <Text style={styles.text}>Sign in with Google</Text>
      </View>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,                       // Ocupar todo el espacio disponible
    justifyContent: 'center',       // Centrar verticalmente
    alignItems: 'center',           // Centrar horizontalmente
    backgroundColor: '#f0f0f0',     // Fondo claro (opcional para contraste)
  },
  container: {
    backgroundColor: 'blue',        // Fondo azul
    width: 200,                     // Ancho de 200 unidades
    height: 100,                    // Alto de 100 unidades
    justifyContent: 'center',       // Centrar contenido verticalmente
    alignItems: 'center',           // Centrar contenido horizontalmente
    borderRadius: 20,               // Esquinas redondeadas
  },
  text: {
    color: 'white',                 // Texto en color blanco
    fontSize: 18,                   // Tamaño de fuente
  },
});

export default GoogleSignInComponent;
