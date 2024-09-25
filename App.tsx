import Config from 'react-native-config';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Alert } from 'react-native';
import SplashScreen from './components/splashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/homeScreen';
import ProfileScreen from './components/profileScreen';
import GoogleSignInComponent from './components/googleSingIn';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { auth } from '@react-native-firebase/app';

// Simulación de datos JSON
const userInfo = {
  name: "John Doe",
  email: "johndoe@example.com"
};

const Stack = createStackNavigator();
function App(): React.JSX.Element {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const [userData, setUserData] = useState(null); // Store user data from Google Sign-In


  // handle successful login
  const handleLoginSuccess = (userData:any) => {
    setUserData(userData); // Save the user's info
    setIsLoggedIn(true); // Set user as logged in
    
  };

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

   //nott logged in
   if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <GoogleSignInComponent onLoginSuccess={handleLoginSuccess} />
      </SafeAreaView>
    );
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
              headerShown: false, // Hide the header for all screens
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile">
              {props => <ProfileScreen {...props} user={userInfo} />}
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
