import Config from 'react-native-config';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Alert } from 'react-native';
import SplashScreen from './components/splashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/homeScreen';
import ProfileScreen from './components/profileScreen';
import GoogleSignInComponent from './components/googleSingIn.tsx';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { auth } from '@react-native-firebase/app';

// Simulación de datos JSON
const userInfo = {
  name: "John Doe",
  email: "johndoe@example.com"
};

const Stack = createStackNavigator();

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState<boolean>(true);
  const [isLoged, setIsLoged] = useState<boolean>(false); // Explicitly typing boolean

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
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} setIsLoged={setIsLoged} />}
          </Stack.Screen>
          <Stack.Screen name="Profile">
            {(props) => <ProfileScreen {...props} user={{ name: 'John Doe', email: 'johndoe@example.com' }} />}
          </Stack.Screen>
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
