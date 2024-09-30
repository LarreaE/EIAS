import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Spinner from './Spinner'; // Importa el Spinner
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import socket from '../sockets/socketConnection';


interface Props {
  setIsLoged: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

const GoogleSignInComponent: React.FC<Props> = ({ setIsLoged,setUserData }) => {
  const [loading, setLoading] = useState(false); // Estado para el loading
  const [socketId, setSocketId] = useState<string | null>(null); // Estado para almacenar el socket ID

  useEffect(() => {
    const configureGoogleSignIn = async () => {
      await GoogleSignin.configure({
        webClientId: Config.GOOGLE_WEB_CLIENT_ID, // Asegúrate de tener esto configurado
        offlineAccess: true,
      });
    };

    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    // Cuando el socket se conecta, guarda el ID en el estado
    socket.on('connect', () => {
      setSocketId(socket.id || null); // Guarda el socket ID en el estado
      console.log('Socket conectado, ID:', socket.id);
    });

    // Limpiar el evento al desmontar el componente
    return () => {
      socket.off('connect');
    };
  }, []);

  const signIn = async () => {
    try {
      setLoading(true); // Iniciar el loading
      const userInfo = await GoogleSignin.signIn(); // Reemplaza esto con tu lógica de inicio de sesión
      console.log('Usuario de Google:', userInfo);
      const idToken = userInfo.data?.idToken;
      const email = userInfo.data?.user.email;
      if (!idToken) {
        return console.error('idtoken null');
      }
      //console.log(idToken);
      // Create a Google credential with the token
      const googleCredential = await auth.GoogleAuthProvider.credential(idToken);
      console.log('GOOGLE CREDENTIAL');
      //console.log(googleCredential);

      // Sign-in the user with the credential
      const signInWithCredential = await auth().signInWithCredential(
        googleCredential,
    );
    console.log('SIGN IN WITH CREDENTIAL');
    console.log(signInWithCredential);

    //Get the token from the current User
    const idTokenResult = await auth().currentUser?.getIdTokenResult();
    console.log('USER JWT');
    console.log(idTokenResult);
    axios.post('https://eiasserver.onrender.com/verify-token', {
      idToken: idTokenResult?.token,
      email: email,
      socketId: socketId,
    })
    .then((response) => {
      console.log('JWT TOKEN FROM EXPRESS');
      console.log(response.data.playerData.role);
      //SAVE JWT ENCRIPTED
      setUserData(response.data);
      setIsLoged(true);
    });
    } catch (error) {
      console.error(error);
      console.log('error');
      setLoading(false); // Detener el loading
    } finally {
      console.log('UserLoged');
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
