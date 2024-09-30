/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Image, Alert } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AcolythHomeScreen from './components/acolythHomeScreen.tsx';
import AcolythProfileScreen from './components/acolythProfileScreen.tsx';
import AcolythLaboratoryScreen from './components/acolythLaboratoryScreen.tsx';
import GoogleSignInComponent from './components/googleSingIn.tsx';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import Spinner from './components/Spinner'; // Importa el Spinner
import MortimerLaboratoryScreen from './components/mortimerLaboratoryScreen .tsx';
import QRScanner from './components/QrScanner.tsx';
import HomeVillain from './components/HomeVillain.tsx';
// Importar los eventos de socket
import { listenToServerEvents, clearServerEvents } from './sockets/listenEvents';
import socket from './sockets/socketConnection';



const Tab = createBottomTabNavigator();

function App() {
  const [isLoged, setIsLoged] = useState<boolean>(false);
  const [UserData, setUserData] = useState<any>(null);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Configuración de Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    // Escuchar eventos del servidor
    listenToServerEvents();

    // Limpiar los eventos cuando el componente se desmonte
    return () => {
      clearServerEvents();
      socket.disconnect(); // Desconectar el socket si es necesario
    };
  }, []);

  const handleQRCodeScanned = (data: any) => {
    //display data
    Alert.alert('QR Code Scanned', `Data: ${data}`);
  };

  if (!isLoged) {
    return <GoogleSignInComponent setIsLoged={setIsLoged} setUserData={setUserData} />;
  }
  console.log(UserData.playerData.role);

  switch (UserData.playerData.role) {
    case 'ISTVAN':
      return (
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Settings"
            screenOptions={{
              tabBarStyle: {
                backgroundColor: 'transparent', // Fondo transparente
                borderTopWidth: 0, // Eliminar la línea superior
                position: 'absolute', // Hacer la barra flotante
                left: 0,
                right: 0,
                bottom: 0,
              },
              headerShown: false, // Oculta el encabezado en todas las pantallas
            }}>
            <Tab.Screen
                name="Settings"
                options={{
                  tabBarLabel: '', // Oculta el nombre
                  tabBarIcon: () => (
                    <Image
                      source={require('./assets/home_icon.png')} // Cambia esto por la ruta de tu icono
                      style={styles.icon}
                    />
                  ),
                }}
              >
                {props => <HomeVillain {...props} setIsLoged={setIsLoged} user={UserData}/>}
              </Tab.Screen>
              <Tab.Screen
                name="QRScanner"
                options={{
                  tabBarLabel: '', // Oculta el nombre
                  tabBarIcon: () => (
                    <Image
                      source={require('./assets/home_icon.png')} // Cambia esto por la ruta de tu icono
                      style={styles.icon}
                    />
                  ),
                }}
              >
                {props => <QRScanner {...props} onQRCodeScanned={handleQRCodeScanned}/>}
              </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>);
    case 'MORTIMER':

    return (
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="HomeAcolyth"
            screenOptions={{
              tabBarStyle: {
                backgroundColor: 'transparent', // Fondo transparente
                borderTopWidth: 0, // Eliminar la línea superior
                position: 'absolute', // Hacer la barra flotante
                left: 0,
                right: 0,
                bottom: 0,
              },
              headerShown: false, // Oculta el encabezado en todas las pantallas
            }}
          >

            <Tab.Screen
              name="HomeAcolyth"
              options={{
                tabBarLabel: '', // Oculta el nombre
                tabBarIcon: () => (
                  <Image
                    source={require('./assets/home_icon.png')} // Cambia esto por la ruta de tu icono
                    style={styles.icon}
                  />
                ),
              }}
            >
              {props => <AcolythHomeScreen {...props} setIsLoged={setIsLoged} />}
            </Tab.Screen>

            <Tab.Screen
              name="LaboratoryMortimer"
              options={{
                tabBarLabel: '', // Oculta el nombre
                tabBarIcon: () => (
                  <Image
                    source={require('./assets/laboratory_icon.png')} // Cambia esto por la ruta de tu icono
                    style={styles.icon}
                  />
                ),
              }}
            >
              {props => <MortimerLaboratoryScreen/>}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    );


    case 'VILLAIN':
      return (
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="HomeVillain"
              screenOptions={{
                tabBarStyle: {
                  backgroundColor: 'transparent', // Fondo transparente
                  borderTopWidth: 0, // Eliminar la línea superior
                  position: 'absolute', // Hacer la barra flotante
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
                headerShown: false, // Oculta el encabezado en todas las pantallas
              }}
            >
              <Tab.Screen
                name="HomeVillain"
                options={{
                  tabBarLabel: '', // Oculta el nombre
                  tabBarIcon: () => (
                    <Image
                      source={require('./assets/home_icon.png')} // Cambia esto por la ruta de tu icono
                      style={styles.icon}
                    />
                  ),
                }}
              >
                {props => <HomeVillain {...props} setIsLoged={setIsLoged} user={UserData}/>}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      );
    default:
      return (
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="HomeAcolyth"
              screenOptions={{
                tabBarStyle: {
                  backgroundColor: 'transparent', // Fondo transparente
                  borderTopWidth: 0, // Eliminar la línea superior
                  position: 'absolute', // Hacer la barra flotante
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
                headerShown: false, // Oculta el encabezado en todas las pantallas
              }}
            >
              <Tab.Screen
                name="ProfileVillain"
                options={{
                  tabBarLabel: '', // Oculta el nombre
                  tabBarIcon: () => (
                    <Image
                      source={require('./assets/profile_icon.png')} // Cambia esto por la ruta de tu icono
                      style={styles.icon}
                    />
                  ),
                }}
              >
                {props => <AcolythProfileScreen {...props} user={UserData} />}
              </Tab.Screen>
              <Tab.Screen
                name="HomeAcolyth"
                options={{
                  tabBarLabel: '', // Oculta el nombre
                  tabBarIcon: () => (
                    <Image
                      source={require('./assets/home_icon.png')} // Cambia esto por la ruta de tu icono
                      style={styles.icon}
                    />
                  ),
                }}
              >
                {props => <AcolythHomeScreen setIsLoged={setIsLoged} />}
              </Tab.Screen>
              <Tab.Screen
                name="LaboratoryAcolyth"
                options={{
                  tabBarLabel: '', // Oculta el nombre
                  tabBarIcon: () => (
                    <Image
                      source={require('./assets/laboratory_icon.png')} // Cambia esto por la ruta de tu icono
                      style={styles.icon}
                    />
                  ),
                }}
              >
                {props => <AcolythLaboratoryScreen {...props} UserData={UserData} />}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    marginBottom: 32,
    width: 96,  // Ajusta el ancho del icono
    height: 96, // Ajusta la altura del icono
  },
});

export default App;
