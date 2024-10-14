import React, { useEffect, useState,useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import Spinner from './Spinner'; // Importa el Spinner
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import socket from '../sockets/socketConnection';
import { UserContext } from '../context/UserContext'; // Importa el contexto


interface Props {
  setIsLoged: React.Dispatch<React.SetStateAction<boolean>>;
}

const GoogleSignInComponent: React.FC<Props> = ({ setIsLoged }) => {
  const [loading, setLoading] = useState(false); // Estado para el loading
  const [socketId, setSocketId] = useState<string | null>(null); // Estado para almacenar el socket ID
  const [spinnerMessage, setSpinnerMessage] = useState('Connecting...');
  const { setUserData } = useContext(UserContext);
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
      setSpinnerMessage('Signing in with Google...');

      if (!idToken) {
        setSpinnerMessage('idToken null');
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
    setSpinnerMessage('Verifying credentials...');
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
      setSpinnerMessage('Connection established...');
    });
    } catch (error) {
      console.error(error);
      console.log('error');
      setLoading(false); // Detener el loading
    } finally {
      console.log('UserLoged');
    }
  };

  useEffect(() => {
    const verificarTokenCaducado = async () => {
      try {
        const idTokenResult = await auth().currentUser?.getIdTokenResult();
        const expirationTime = idTokenResult?.expirationTime;

        if (expirationTime) {
          const now = new Date().getTime();
          const expirationTimeMs = new Date(expirationTime).getTime();

          // Si el token ya expiró
          if (now > expirationTimeMs) {
            console.log('El token ha caducado');
            Alert.alert('Sesión caducada', 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            await auth().signOut(); // Cierra la sesión si ha caducado
          } else {
            console.log('El token sigue siendo válido');
          }
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
      }
    };

    // Verifica cada 10 minutos
    const interval = setInterval(verificarTokenCaducado, 600000);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/home_door.png')}
      style={styles.background}
      resizeMode="cover"
    >
    {loading && <Spinner message={spinnerMessage} />}
    <TouchableOpacity onPress={signIn} disabled={loading}>
      <ImageBackground
        source={require('../assets/boton.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <Text style={styles.text}>Sign in with Google</Text>
      </ImageBackground>
    </TouchableOpacity>
  </ImageBackground>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,                       // Ocupar todo el espacio disponible
    justifyContent: 'center',       // Centrar verticalmente
    alignItems: 'center',           // Centrar horizontalmente
    backgroundColor: '#f0f0f0',     // Fondo claro (opcional para contraste)
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 300,                     // Ancho de 200 unidades
    height: 150,                    // Alto de 100 unidades
    justifyContent: 'center',       // Centrar contenido verticalmente
    alignItems: 'center',           // Centrar contenido horizontalmente
    borderRadius: 20,               // Esquinas redondeadas
    marginTop: 200,
  },
  text: {
    color: 'white',                 // Texto en color blanco
    fontSize: 18,                   // Tamaño de fuente
  },
});

export default GoogleSignInComponent;
