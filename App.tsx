import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Image, Alert } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; 
import GoogleSignInComponent from './components/googleSingIn.tsx';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import QRScanner from './components/QrScanner.tsx';
import ProfileScreen from './components/ProfileScreen.tsx';
import AcolythHomeScreen from './components/acolythHomeScreen.tsx';
import AcolythLaboratoryScreen from './components/acolythLaboratoryScreen.tsx';
import MortimerLaboratoryScreen from './components/mortimerLaboratoryScreen .tsx';
import HomeVillain from './components/HomeVillain.tsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { listenToServerEvents, clearServerEvents } from './sockets/listenEvents';
import socket from './sockets/socketConnection';

const Tab = createMaterialTopTabNavigator();

function App() {
  const [isLoged, setIsLoged] = useState<boolean>(false);
  const [UserData, setUserData] = useState<any>(null);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    listenToServerEvents();
    return () => {
      clearServerEvents();
      socket.disconnect();
    };
  }, []);

  const handleQRCodeScanned = (data: any) => {
    Alert.alert('QR Code Scanned', `Data: ${data}`);
  };

  if (!isLoged) {
    return <GoogleSignInComponent setIsLoged={setIsLoged} setUserData={setUserData} />;
  }

  const screenOptions = {
    tabBarStyle: {
      backgroundColor: 'transparbent',
      borderTopWidth: 0,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: 0, // Agregar padding en la parte inferior
      height:80,
      elevation: 0, // Para Android
    },
    headerShown: false,
    swipeEnabled: true,
    tabBarScrollEnabled: false,
    shadowOpacity: 0,
    shadowRadius: 0,

  };
  const renderTabs = () => {
    switch (UserData.playerData.role) {
      case 'ISTVAN':
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/profile_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <ProfileScreen {...props} user={UserData} setIsLoged={setIsLoged} />}
            </Tab.Screen>
            <Tab.Screen
              name="QRScanner"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/laboratory_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <QRScanner {...props} onQRCodeScanned={handleQRCodeScanned} />}
            </Tab.Screen>
          </>
        );

      case 'MORTIMER':
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/profile_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <ProfileScreen {...props} user={UserData} setIsLoged={setIsLoged} />}
            </Tab.Screen>
            <Tab.Screen
              name="LaboratoryMortimer"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/laboratory_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <MortimerLaboratoryScreen {...props} />}
            </Tab.Screen>
          </>
        );

      case 'VILLAIN':
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/profile_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <ProfileScreen {...props} setIsLoged={setIsLoged} user={UserData} />}
            </Tab.Screen>
            <Tab.Screen
              name="HomeVillain"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/home_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <HomeVillain {...props} user={UserData} />}
            </Tab.Screen>
          </>
        );

      default:
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/profile_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <ProfileScreen {...props} user={UserData} setIsLoged={setIsLoged} />}
            </Tab.Screen>
            <Tab.Screen
              name="HomeAcolyth"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/home_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <AcolythHomeScreen {...props} />}
            </Tab.Screen>
            <Tab.Screen
              name="LaboratoryAcolyth"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/laboratory_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <AcolythLaboratoryScreen {...props} UserData={UserData} />}
            </Tab.Screen>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Settings" screenOptions={screenOptions}>
            {renderTabs()}
          </Tab.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    marginBottom: 0, // Aumenta este valor para elevar los íconos
    width: 66,
    height: 66,
    right:20,
  },
});


export default App;
