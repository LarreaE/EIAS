import Config from 'react-native-config';
import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Button, Alert} from 'react-native';
import SplashScreen from './components/splashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/homeScreen';
import ProfileScreen from './components/profileScreen';
import GoogleSingInComponent from './components/googleSingIn';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Stack = createStackNavigator();
function App(): React.JSX.Element {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  //Google Sign in
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID, // From Firebase Console (still required for Google Sign-In)
    });
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <GoogleSingInComponent/>
      <NavigationContainer>

      <Stack.Navigator
  initialRouteName="Home"
  screenOptions={{
    gestureEnabled: true,
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    }),
    headerShown: false, // Oculta el encabezado para todas las pantallas
  }}
>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
</Stack.Navigator>

      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
