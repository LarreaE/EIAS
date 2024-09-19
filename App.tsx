import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, StyleSheet, View, Button, Alert} from 'react-native';
import SplashScreen from './components/splashScreen.tsx';  // Importar SplashScreen
import { GoogleSignin } from '@react-native-google-signin/google-signin';

function App(): React.JSX.Element {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  //Google Sign in
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1023780976448-99hcl1i028jvliu2kn32u62pvmshna11.apps.googleusercontent.com', // From Firebase Console (still required for Google Sign-In)
    });
  }, []);

   // Function to handle Google Sign-In
   async function onGoogleButtonPress() {
    try {
      // Get the user's ID token
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info', userInfo);
      Alert.alert('Signed in!', `Welcome`);
    } catch (error) {
      console.error(error);
    }
  }


  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Google Sign-In" onPress={onGoogleButtonPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
