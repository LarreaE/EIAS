/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet, Image, Modal, TouchableOpacity, Text, View, ImageBackground, Alert, ToastAndroid } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GoogleSignInComponent from './components/googleSingIn';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import QRScanner from './components/QrScanner';
import ProfileScreen from './components/ProfileScreen';
import AcolythHomeScreen from './components/acolythHomeScreen';
import AcolythLaboratoryScreen from './components/acolythLaboratoryScreen';
import MortimerLaboratoryScreen from './components/mortimerLaboratoryScreen ';
import HomeVillain from './components/HomeVillain';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { listenToServerEvents, clearServerEvents } from './sockets/listenEvents';
import socket from './sockets/socketConnection';
import { sendUserEMail } from './sockets/emitEvents';
import { UserContextType, UserProvider } from './context/UserContext'; // Importa el proveedor
import { UserContext } from './context/UserContext'; // Importa el contexto
import AcolythScreen from './screens/Info';
import { Player } from './interfaces/Player';
import MapScreen from './screens/Map';
import { createStackNavigator } from '@react-navigation/stack';
import Tower from './screens/Tower';
import messaging from '@react-native-firebase/messaging';
import { checkAndRequestNotificationPermission } from './components/notificationPermissions';
import { saveBoolean, getBoolean } from './helper/AsyncStorage';
import MortimerTower from './components/mortimerTower';
import Swamp from './screens/Swamp';
import SchoolScreen from './screens/OldSchool';

const Tab = createMaterialTopTabNavigator();

function App() {
  useEffect(() => {
    checkAndRequestNotificationPermission();
  }, []);

  useEffect(() => {
    onMessageReceived();
  }, []);
  const onMessageReceived = () => {
    messaging().onMessage(async remoteMessage => {
      console.log('Notificación recibida en primer plano:', remoteMessage);
      const title = remoteMessage.notification?.title || '';
      const message = remoteMessage.notification?.body || '';
      // Concatenamos el título y el mensaje en un solo string
      const fullMessage = `${title}: ${message}`;
      ToastAndroid.show(fullMessage, ToastAndroid.LONG);
    });
  };

  return (
    <UserProvider>
      <AppContent/>
    </UserProvider>
  );
}

function AppContent () {

  const [isLoged, setIsLoged] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const context = useContext(UserContext) as UserContextType;

  const { userData, setUserData ,setParchment, setCurrentScreen, currentScreen , player} = context; // Usamos useContext para UserData;

  useEffect(() => {
      // Set background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Notification handled in the background:', remoteMessage);
    });
  });

  useEffect(() => {
    const getParchment = async () => {
      setParchment(await getBoolean('parchment'));
      console.log('Parchment set');

    };

    getParchment();
  }, []);
  useEffect(() => {
    console.log(currentScreen);
  }, [currentScreen]);
  useEffect(() => {
    console.log('CURRENT SCREEN:',currentScreen);
    if (currentScreen === 'LaboratoryAcolyth') {
      userData.playerData.location = 'laboratory';
    } else if (currentScreen === 'TowerAcolyth'){
      userData.playerData.location = 'tower';
    }
  }, [currentScreen]);
  useEffect(() => {
    socket.on('request_email', () => {
      console.log('El servidor ha solicitado el correo electrónico');
      if (isLoged && userData?.playerData?.email) {
        sendUserEMail(userData.playerData.email);
        socket.on('reconnect', () => {
          console.log('Socket reconectado con ID:', socket.id);
        });
      }
    });
    return () => {
      socket.off('request_email');
    };
  }, [isLoged, userData]);

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
    tabBarIndicatorStyle: {
      height: 0, // Eliminamos la barra indicadora
    },
    headerShown: false,
    swipeEnabled: route.name !== 'LaboratoryAcolyth',
    tabBarScrollEnabled: false,
    shadowOpacity: 0,
    shadowRadius: 0,
  });

  const renderTabs = () => {
    if (!userData || !userData.playerData || !userData.playerData.role) {
      return null;
    }

    switch (userData.playerData.role) {
      case 'ISTVAN':
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/setings_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            >
              {props => <ProfileScreen {...props} user={userData} setIsLoged={setIsLoged} />}
            </Tab.Screen>
            <Tab.Screen
              name="QRScanner"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/QR_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            >
              {props => (
                <>
                <ImageBackground
                      source={require('./assets/settings_background_02.png')}  // Ruta de la imagen de fondo
                      style={styles.QRbackground}  // Aplicar estilos al contenedor de la imagen de fondo
                      resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
                    >
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
                  </ImageBackground>
                </>
              )}
            </Tab.Screen>
            <Tab.Screen
            name="Map"
            component={MapScreen} // Use component prop instead of rendering as a child
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ focused }) => (
                <View style={focused ? styles.activeTabBackground : null}>
                  <Image source={require('./assets/map_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                </View>
              ),
            }}
            />
          </>
        );

      case 'MORTIMER':
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/setings_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            >
              {props => <ProfileScreen {...props} user={userData} setIsLoged={setIsLoged} />}
            </Tab.Screen>
            
            <Tab.Screen
              name="Info"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/profile_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            >
              {props => <AcolythScreen {...props} user={userData} />}
            </Tab.Screen>
            
            <Tab.Screen
              name="Map"
              component={MapScreen}
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/map_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            />
          </>
        );

      case 'VILLAIN':
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/setings_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            >
              {props => <ProfileScreen {...props} setIsLoged={setIsLoged} user={userData} />}
            </Tab.Screen>
            <Tab.Screen
              name="HomeAcolyth"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/home_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            >
              {props => <HomeVillain {...props} user={userData} />}
            </Tab.Screen>
            <Tab.Screen
              name="Map"
              component={MapScreen}
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/map_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            />
          </>
        );

      default:
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/setings_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            >
              {props => <ProfileScreen {...props} user={userData} setIsLoged={setIsLoged} />}
            </Tab.Screen>

            <Tab.Screen
              name="HomeAcolyth"
              component={AcolythHomeScreen}
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/home_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="Info"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/profile_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            >
              {props => <AcolythScreen {...props} user={userData} />}
            </Tab.Screen>

            <Tab.Screen
              name="Map"
              component={MapScreen}
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : null}>
                    <Image source={require('./assets/map_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            />
          </>
        );
    }
  };

  const Stack = createStackNavigator();

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer
        onStateChange={(state) => {
          // Get the current route's name
          const currentRoute = state.routes[state.index];
          setCurrentScreen(currentRoute.name);
        }}>
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
              {props => <AcolythLaboratoryScreen {...props} UserData={userData} />}
            </Stack.Screen>
            <Stack.Screen
              name="TowerAcolyth"
              component={Tower}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LaboratoryMortimer"
              component={MortimerLaboratoryScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TowerMortimer"
              component={MortimerTower}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Swamp"
              component={Swamp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="School"
              component={SchoolScreen}
              options={{ headerShown: false }}
            >
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
  activeIcon: {
    width: 76, // Más grande cuando está activo
    height: 76,
    left:0,
  },
  activeTabBackground: {
    backgroundColor: 'rgba(205, 133, 63, 0.5)', // Marrón claro semitransparente
    borderRadius: 20,
    width: 76, // Más grande cuando está activo
    height: 76,
    bottom:13,
    left:-20,
  },
  openModalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width:250,
    top:'200%',
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
   QRbackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
