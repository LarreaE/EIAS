import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Spinner from './Spinner'; // Importa el Spinner
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

interface Props {
  setIsLoged: React.Dispatch<React.SetStateAction<boolean>>;
}

const GoogleSignInComponent: React.FC<Props> = ({ setIsLoged }) => {
  const [loading, setLoading] = useState(false); // Estado para el loading

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
      setLoading(true); // Iniciar el loading
      await GoogleSignin.signIn(); // Lógica de inicio de sesión
      setIsLoged(true); // Actualiza el estado de autenticación
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Detener el loading
    }
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
