import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AcolythHomeScreen from './components/acolythHomeScreen.tsx';
import AcolythProfileScreen from './components/acolythProfileScreen.tsx';
import AcolythLaboratoryScreen from './components/acolythLaboratoryScreen.tsx';
import GoogleSignInComponent from './components/googleSingIn.tsx';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import QRScanner from './components/QrScanner.tsx';
import QRGenerator from './components/QrGenerator.tsx';

const Stack = createStackNavigator();

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

  const handleQRCodeScanned = (data:any) => {
    //display data
    Alert.alert('QR Code Scanned', `Data: ${data}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeAcolyth"
          screenOptions={{
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 1]  ,
                    }),
                  },
                ],
              },
            }),
            headerShown: false,
          }}
        >
          <Stack.Screen name="a">
            {props => <AcolythHomeScreen {...props} setIsLoged={setIsLoged} />}
          </Stack.Screen>
          <Stack.Screen name="ProfileAcolyth">
            {(props) => <AcolythProfileScreen {...props} user={UserData} />}
          </Stack.Screen>
          <Stack.Screen name="LaboratoryAcolyth">
            {(props) => <AcolythLaboratoryScreen {...props}/>}
          </Stack.Screen>
          <Stack.Screen name="QRScanner">
            {(props) => <QRScanner {...props} onQRCodeScanned={handleQRCodeScanned}/>}
          </Stack.Screen>
          <Stack.Screen name="HomeAcolyth">
            {() => <QRGenerator {...UserData}/>}
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
