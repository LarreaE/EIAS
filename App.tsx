/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet, Image, Modal, TouchableOpacity, Text, View, ImageBackground } from 'react-native';
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
import { sendUserEMail } from './sockets/emitEvents.tsx';
import { UserProvider } from './context/UserContext'; // Importa el proveedor
import { UserContext } from './context/UserContext'; // Importa el contexto
import AcolythScreen from './screens/Info.tsx';
import { Player } from './interfaces/Player.tsx';
import MapScreen from './screens/Map.tsx';
import { createStackNavigator } from '@react-navigation/stack';


const Tab = createMaterialTopTabNavigator();

function App() {
  const [isLoged, setIsLoged] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);


  return (
    <UserProvider>
      <AppContent
        isLoged={isLoged}
        setIsLoged={setIsLoged}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </UserProvider>
  );
}

function AppContent({ isLoged, setIsLoged, isModalVisible, setIsModalVisible }) {
  const { userData: UserData, setUserData } = useContext(UserContext); // Usamos useContext para UserData;

  useEffect(() => {
    socket.on('request_email', () => {
      console.log('El servidor ha solicitado el correo electrónico');
      if (isLoged && UserData?.playerData?.email) {
        sendUserEMail(UserData.playerData.email);
        socket.on('reconnect', () => {
          console.log('Socket reconectado con ID:', socket.id);
        });
      }
    });
    return () => {
      socket.off('request_email');
    };
  }, [isLoged, UserData]);

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

  const handleQRCodeScanned = () => {
    setIsModalVisible(false); // Cerrar el modal después de escanear
  };

  if (!isLoged) {
    socket.connect();
    return <GoogleSignInComponent setIsLoged={setIsLoged} />;
  }

  const screenOptions = ({ route }) => ({
    tabBarStyle: {
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: 0,
      height: 80,
      elevation: 0,
    },
    headerShown: false,
    swipeEnabled: route.name !== 'LaboratoryAcolyth',
    tabBarScrollEnabled: false,
    shadowOpacity: 0,
    shadowRadius: 0,
  });

  const renderTabs = () => {
    if (!UserData || !UserData.playerData || !UserData.playerData.role) {
      return null;
    }


    switch (UserData.playerData.role) {
      case 'ISTVAN':
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/setings_icon.png')} style={styles.icon} />
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
              {props => (
                <>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <ImageBackground
                      source={require('./assets/boton.png')}  // Ruta de la imagen de fondo
                      style={styles.openModalButton}  // Aplicar estilos al contenedor de la imagen de fondo
                      resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
                    >
                      <Text style={styles.buttonText}>Open QR Scanner</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                  <View style={styles.modalView}>
                    <Modal
                      animationType="slide"
                      visible={isModalVisible}
                    >
                      <QRScanner {...props} onQRCodeScanned={handleQRCodeScanned} />

                      <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                        <ImageBackground
                          source={require('./assets/boton.png')}  // Ruta de la imagen de fondo
                          style={styles.modalButton}  // Aplicar estilos al contenedor de la imagen de fondo
                          resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
                        >
                          <Text style={styles.buttonText}>Close</Text>
                        </ImageBackground>

                      </TouchableOpacity>
                    </Modal>
                  </View>
                </>
              )}
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
                  <Image source={require('./assets/setings_icon.png')} style={styles.icon} />
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
                  <Image source={require('./assets/setings_icon.png')} style={styles.icon} />
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
                  <Image source={require('./assets/setings_icon.png')} style={styles.icon} />
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
              name="Info"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/profile_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <AcolythScreen {...props} user={UserData} />}
            </Tab.Screen>

            <Tab.Screen
              name="Map"
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <Image source={require('./assets/map_icon.png')} style={styles.icon} />
                ),
              }}
            >
              {props => <MapScreen {...props} />}
            </Tab.Screen>

          </>
        );
    }
  };

  const Stack = createStackNavigator();


  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Aquí se incluyen las tabs como parte de una pantalla del stack */}
            <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator initialRouteName="Settings" screenOptions={screenOptions}>
                  {renderTabs()}
                </Tab.Navigator>
              )}
            </Stack.Screen>

            {/* Agrega la pantalla LaboratoryAcolyth fuera del Tab.Navigator */}
            <Stack.Screen
              name="LaboratoryAcolyth"
              options={{ headerShown: false }}
            >
              {props => <AcolythLaboratoryScreen {...props} UserData={UserData} />}
            </Stack.Screen>
          </Stack.Navigator>
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
    marginBottom: 0,
    width: 66,
    height: 66,
    right: 20,
  },
  openModalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  closeButton: {
    backgroundColor: '#F194FF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    position: 'absolute',
    bottom: 0,           // Posicionado en la parte inferior
    width: '100%',       // Ancho completo para el botón
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
