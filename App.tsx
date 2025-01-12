
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet, Image, View, ToastAndroid, Animated, Dimensions } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer, ParamListBase, RouteProp, useNavigationContainerRef } from '@react-navigation/native';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import GoogleSignInComponent from './components/googleSingIn';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import ProfileScreen from './components/ProfileScreen';
import AcolythLaboratoryScreen from './components/acolythLaboratoryScreen';
import MortimerLaboratoryScreen from './components/mortimerLaboratoryScreen ';
import MortimerTower from './components/mortimerTower';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { listenToServerEvents, clearServerEvents, listenToCurseDiseaseEvents, clearCurseDiseaseEvents, updateLocalResistance } from './sockets/listenEvents';
import socket from './sockets/socketConnection';
import { sendUserEMail } from './sockets/emitEvents';
import { UserContextType, UserProvider } from './context/UserContext'; // Importa el proveedor
import { UserContext } from './context/UserContext'; // Importa el contexto
import AcolythScreen from './screens/Info';
import MapScreen from './screens/Map';
import { createStackNavigator } from '@react-navigation/stack';
import Tower from './screens/Tower';
import messaging from '@react-native-firebase/messaging';
import { checkAndRequestNotificationPermission } from './components/notificationPermissions';
import { getBoolean } from './helper/AsyncStorage';
import Swamp from './screens/Swamp';
import SchoolScreen from './screens/OldSchool';
import HallOfSages from './screens/HallOfSages';
import ObituaryDoor from './screens/ObituaryDoor';
import TheHollowOfStages from './screens/TheHollowOfStages';
import TheInnOfTheForgotten from './screens/TheInnOfTheForgotten';
import Dungeon from './screens/Dungeon';
import GlobalModals from './components/GlobalModals';
import QRScanner from './components/QrScanner';

const Tab = createMaterialTopTabNavigator();
const { width, height } = Dimensions.get('window');

function App() {
  const navigationRef = useNavigationContainerRef(); // Referencia para navegación global
  useEffect(() => {
    checkAndRequestNotificationPermission();
  }, []);

  return (
    <UserProvider>
      <AppContent navigationRef={navigationRef} />
    </UserProvider>
  );
}

function AppContent({ navigationRef }: { navigationRef: any }) {
  const [isLoged, setIsLoged] = useState<boolean>(false);
  const context = useContext(UserContext) as UserContextType;
  const { userData, setUserData ,setParchment, setCurrentScreen, currentScreen , player, setIsHallInNeedOfMortimer, isHallInNeedOfMortimer} = context;
   // Usamos useContext para UserData;

   useEffect(() => {
    onMessageReceived();
  }, []);

   const onMessageReceived = () => {
    messaging().onMessage(async remoteMessage => {
      console.log('Notificación recibida en primer plano:', remoteMessage);

      const title = remoteMessage.notification?.title || '';
      const message = remoteMessage.notification?.body || '';
      const screen = remoteMessage.data?.screen || '';
      const fullMessage = `${title}: ${message}`;

      ToastAndroid.show(fullMessage, ToastAndroid.LONG);
      if (remoteMessage?.data?.screen) {
        setIsHallInNeedOfMortimer(true);
      }
    });
  };

  const navigateToScreen = (screen: string) => {
    switch (screen) {
      case 'TowerAcolyth':
        navigationRef.current?.navigate('TowerAcolyth');
        break;
      case 'LaboratoryAcolyth':
        navigationRef.current?.navigate('LaboratoryAcolyth');
        break;
      case 'TowerMortimer':
        navigationRef.current?.navigate('TowerMortimer');
        break;
      case 'LaboratoryMortimer':
        navigationRef.current?.navigate('LaboratoryMortimer');
        break;
      case 'Map':
        navigationRef.current?.navigate('MainTabs', { screen: 'Map' });
        break;
      case 'HallOfSages':
        navigationRef.current?.navigate('HallOfSages');
        break;
      default:
        console.warn('Pantalla no definida o inválida:', screen);
        break;
    }
  };
  const updateLocal = (playerId: string, changes: any) => {
    console.log('Updating local, player:', playerId);
    setUserData((prev) => {
      if (!prev) return prev;
      // Si el playerId coincide con el ID del player actual, actualizamos
      if (playerId === prev.playerData.email) {
        console.log('Player matched! Applying changes:', changes);
        return {
          ...prev,
          playerData: {
            ...prev.playerData,
            ...changes,
          },
        };
      }
      return prev;
    });
  };

  const updateLocalResistancePLayeData = (playerId: string) => {
    console.log('Updating resistance for player:', playerId);
    setUserData((prev) => {
      if (!prev) return prev;
      // Verificamos que el playerId coincida con el player actual
        console.log('Player matched! Reducing resistance by 10.');
        return {
          ...prev,
          playerData: {
            ...prev.playerData,
            resistance: Math.max(prev.playerData.resistance - 10, 0),
          },
        };

    });
  };


  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Notification handled in the background:', remoteMessage);

      const screen = remoteMessage.data?.screen || '';
      console.log(`Screen a redirigir en background: ${screen}`);

      if (screen) {
        navigateToScreen(screen);
      }
    });
  }, []);

  useEffect(() => {
    const getParchment = async () => {
      setParchment(await getBoolean('parchment'));
      console.log('Parchment set');
    };
    getParchment();
  }, []);

  useEffect(() => {
    updateLocalResistance(updateLocalResistancePLayeData);
    // Limpieza para evitar múltiples listeners
    return () => {
      socket.off('updateResistance');
    };
  }, [socket]);
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
    listenToCurseDiseaseEvents(updateLocal);
    return () => {
      clearServerEvents();
      clearCurseDiseaseEvents();
      socket.disconnect();
    };
  }, []);

  if (!isLoged) {
    socket.connect();
    return <GoogleSignInComponent setIsLoged={setIsLoged} />;
  }

  interface ScreenOptionsProps {
    route: RouteProp<ParamListBase, string>;
  }

  const screenOptions = ({ route }: ScreenOptionsProps): MaterialTopTabNavigationOptions => ({
    tabBarStyle: styles.tabBar,
    tabBarIndicatorStyle: styles.tabBarIndicator,
    swipeEnabled: route.name !== 'LaboratoryAcolyth',
    tabBarScrollEnabled: false,
    tabBarActiveTintColor: '#ffffff',
    tabBarInactiveTintColor: '#999999',
  });

  const renderTabs = () => {
    if (!userData || !userData.playerData || !userData.playerData.role) {
      return null;
    }

    switch (userData.playerData.role) {
      default:
        return (
          <>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : styles.iconContainer}>
                    <Image source={require('./assets/setings_icon.png')} style={focused ? [styles.icon, styles.activeIcon] : styles.icon} />
                  </View>
                ),
              }}
            >
              {props => <ProfileScreen {...props} user={userData} setIsLogged={setIsLoged} />}
            </Tab.Screen>

            <Tab.Screen
              name="Info"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => (
                  <View style={focused ? styles.activeTabBackground : styles.iconContainer}>
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
                  <View style={[styles.iconContainer]}>
                    {isHallInNeedOfMortimer && (
                      <Animated.Image
                        source={require('./assets/animations/bg1.gif')}
                        style={styles.gifStyle}
                      />
                    )}
                    <Image
                      source={require('./assets/map_icon.png')}
                      style={focused ? [styles.icon, styles.activeIcon] : styles.icon}
                    />
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
          ref={navigationRef}
          onStateChange={(state) => {
            if (state) {
              const currentRoute = state.routes[state.index];
              setCurrentScreen(currentRoute.name);
            }
          }}
        >
          <Stack.Navigator>
            <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator initialRouteName="Settings" screenOptions={screenOptions}>
                  {renderTabs()}
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen name="LaboratoryAcolyth" options={{ headerShown: false }}>
              {props => <AcolythLaboratoryScreen {...props} UserData={userData} />}
            </Stack.Screen>
            <Stack.Screen name="TowerAcolyth" component={Tower} options={{ headerShown: false }} />
            <Stack.Screen name="LaboratoryMortimer" component={MortimerLaboratoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TowerMortimer" component={MortimerTower} options={{ headerShown: false }} />
            <Stack.Screen name="Swamp" component={Swamp} options={{ headerShown: false }} />
            <Stack.Screen name="School" component={SchoolScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HallOfSages" component={HallOfSages} options={{ headerShown: false }} />
            <Stack.Screen name="ObituaryDoor" component={ObituaryDoor} options={{ headerShown: false }} />
            <Stack.Screen name="THOS" component={TheHollowOfStages} options={{ headerShown: false }} />
            <Stack.Screen name="TIOTF" component={TheInnOfTheForgotten} options={{ headerShown: false }} />
            <Stack.Screen name="Dungeon" component={Dungeon} options={{ headerShown: false }} />
            <Stack.Screen name="QRScanner" component={QRScanner} options={{ headerShown: false }} />
          </Stack.Navigator>
          <GlobalModals />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    position: 'relative', // Ensures proper positioning of children
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 66,
    height: 66,
  },
  activeIcon: {
    width: 76,
    height: 76,
  },
  gifStyle: {
    position: 'absolute', // Places it relative to the parent
    zIndex: -1, // Ensures it goes behind the icon
    width: 200, // Adjust as needed to fit correctly
    height: 200, // Adjust as needed to fit correctly
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
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    position: 'relative',
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
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 0,
    height: 80,
    elevation: 0,
    justifyContent: 'center',
    alignContent: 'center',
    overflow: 'hidden',
  },
  tabBarIndicator: {
    height: 0
  },
  tabBarLabel: {
    fontSize: 14, // Font size for the labels
     // Bold text
    textTransform: 'capitalize', // Capitalize first letter
  },
});

export default App;
