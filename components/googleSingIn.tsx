import React, { useEffect, useState,useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import Spinner from './Spinner'; // Importa el Spinner
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import socket from '../sockets/socketConnection';
import { UserContext, UserContextType } from '../context/UserContext'; // Importa el contexto
import messaging from'@react-native-firebase/messaging';
import Ingredient from './Potions/Ingredient';


interface Props {
  setIsLoged: React.Dispatch<React.SetStateAction<boolean>>;
}

const GoogleSignInComponent: React.FC<Props> = ({ setIsLoged }) => {
  const context = useContext(UserContext) as UserContextType;
  const { setUserData, setIsInsideLab, setAllIngredients, setPurifyIngredients, setCurses, parchment, allIngredients, purifyIngredients } = context;
  const [loading, setLoading] = useState(false); // Estado para el loading
  const [socketId, setSocketId] = useState<string | null>(null); // Estado para almacenar el socket ID
  const [spinnerMessage, setSpinnerMessage] = useState('Connecting...');
  useEffect(() => {
    const configureGoogleSignIn = async () => {
      await GoogleSignin.configure({
        webClientId: Config.GOOGLE_WEB_CLIENT_ID, // Asegúrate de tener esto configurado
        offlineAccess: true,
      });
        // Sign out any existing sessions upon app startup
        await GoogleSignin.signOut();
        await auth().signOut();
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

   //merge ingredients when purifyIngredients or allingredients changes
  useEffect(() => {
    const mergedIngredients = [...allIngredients, ...purifyIngredients];
    //console.log('Merged Ingreds:', mergedIngredients);
    setAllIngredients(mergedIngredients);
  }, [purifyIngredients]);


  const fetchIngredients = async () => {
    try {
      console.log('Fetching ingredients...');
      const response = await fetch(`${Config.RENDER}/ingredients`);
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.success === true && Array.isArray(data.ingredientsData) && data.ingredientsData.length > 0) {
          setAllIngredients(data.ingredientsData); // Almacenar en variable local
        } else {
          console.error('No ingredients found or status is not OK.');
        }
      } else {
        const text = await response.text();
        console.error('Response is not JSON:', text);
      }
    } catch (error) {
      console.error('Error getting ingredients:', error);
    } finally {
    }
  };
  const fetchRareIngredients = async () => {
    try {
      const response = await axios.get('https://kaotika-server.fly.dev/ingredients/zachariah-herbal');
      const ingredients = response.data.data["Zachariah's herbal"].ingredients;
      let ingredientsArray = [];
      for (let index = 0; index < ingredients.length; index++) {
        let ingredient = new Ingredient(ingredients[index]._id,ingredients[index].name,ingredients[index].effects,ingredients[index].value,ingredients[index].type,ingredients[index].image,ingredients[index].description);
        ingredientsArray.push(ingredient);
      }
      setPurifyIngredients(ingredientsArray);
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
    }
  };
  const fetchCurses = async () => {

    try {
      console.log('Fetching curses...');
      const response = await fetch(`${Config.RENDER}/potions`);
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.success === true && Array.isArray(data.potionsData) && data.potionsData.length > 0) {
          setCurses(data.potionsData); // Almacenar en contexto global
        } else {
          console.error('No curses found or status is not OK.');
        }
      } else {
        const text = await response.text();
        console.error('Response is not JSON:', text);
      }
    } catch (error) {
      console.error('Error getting curses:', error);
    } finally {
    }
  };

  const signIn = async () => {
    try {
      const authenticate = async() => {
        try {
          setSpinnerMessage('Connecting...');

          // Perform the axios request and wait for the response
          const response = await axios.post(`${Config.RENDER}/api/auth/verify-token`, {
            idToken: idTokenResult?.token,
            email: email,
            socketId: socket.id,
            fcmToken: token,
          });
          // If successful, update the state
          setSpinnerMessage('Connection established...');
          setUserData(response.data);
          setIsInsideLab(response.data.playerData.is_active);

          // Fetch ingredients and curses in sequence
          setSpinnerMessage('Fetching Ingredients...');
          // await fetchIngredients();
          setAllIngredients(response.data.playerData.inventory.ingredients)

          setSpinnerMessage('Fetching Curses...');
          await fetchCurses();

          if (parchment) {
            setSpinnerMessage('Fetching Rare Ingredients...');
            await fetchRareIngredients();
          }
          // Log the user in
          setIsLoged(true);

        } catch (error) {
          console.log('An error occurred during token verification or data fetching.');

          if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
              console.log('Error data: ', error.response.data);
            } else {
              console.log('Error: ', error.message || 'An unknown error occurred.');
            }
          } else {
            console.log('An unknown error occurred:', String(error));
          }

          // Stop any loading indicators
          setLoading(false);

        } finally {
          console.log('authenticated');
        }
      };
      setLoading(true); // Iniciar el loading
      const userInfo = await GoogleSignin.signIn(); // Reemplaza esto con tu lógica de inicio de sesión
      //console.log('Usuario de Google:', userInfo);
      const idToken = userInfo.data?.idToken;
      const email = userInfo.data?.user.email;
      setSpinnerMessage('Signing in with Google...');

      if (!idToken) {
        setSpinnerMessage('idToken null');
        setIsLoged(false);
        setLoading(false);
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
    setSpinnerMessage('Checking email domain...');
          // **Check if email domain contains 'aeg' after '@'**
          const emailDomain = email?.split('@')[1];
          console.log('checking email');
          if (emailDomain) {
            if (!emailDomain.includes('aeg')) {
              Alert.alert(
                'Access Denied',
                'Sorry, but you do not belong to the organization to use this application.'
              );
              setLoading(false);
              // Sign out to clear any session data
              await GoogleSignin.signOut();
              await auth().signOut();
              return;
            }
          }
    console.log('SIGN IN WITH CREDENTIAL');
    console.log("Is the user new?:", signInWithCredential.additionalUserInfo.isNewUser ? "Yes" : "No");
    console.log("User email:", signInWithCredential.additionalUserInfo.profile.email);
    console.log("User name:", signInWithCredential.additionalUserInfo.profile.name);
    setSpinnerMessage('Verifying credentials...');
    //Get the token from the current User
    const idTokenResult = await auth().currentUser?.getIdTokenResult();
    //FCM token
    const token = await messaging().getToken();
    console.log('socket: ' + socket.id);
    await authenticate();

    } catch (error:any) {
      console.log('Error: ', error.response.data);
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
      source={require('../assets/home_door.webp')}
      style={styles.background}
      resizeMode="cover"
    >
    {loading && <Spinner message={spinnerMessage} />}
    <TouchableOpacity style={styles.container} onPress={signIn} disabled={loading} />
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
    height: 650,              // Alto de 100 unidades
    justifyContent: 'center',       // Centrar contenido verticalmente
    alignItems: 'center',           // Centrar contenido horizontalmente
    borderRadius: 20,               // Esquinas redondeadas
    borderTopStartRadius: 150,
    borderTopEndRadius: 150,
    marginTop: 80,
  },
  text: {
    color: 'white',                 // Texto en color blanco
    fontSize: 18,                   // Tamaño de fuente
  },
});

export default GoogleSignInComponent;
