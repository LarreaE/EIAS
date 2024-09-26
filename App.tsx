import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AcolythHomeScreen from './components/acolythHomeScreen.tsx';
import AcolythProfileScreen from './components/acolythProfileScreen.tsx';
import AcolythLaboratoryScreen from './components/acolythLaboratoryScreen.tsx';
import GoogleSignInComponent from './components/googleSingIn.tsx';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function App() {
  const [isLoged, setIsLoged] = useState<boolean>(false); // Explicitly typing boolean
  const [UserData, setUserData] = useState<any>(null); // Explicitly typing boolean

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Configuración de Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

   if (!isLoged) {
    return <GoogleSignInComponent setIsLoged={setIsLoged} setUserData={setUserData} />; // Passing setIsLoged as prop
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;