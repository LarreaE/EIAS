import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
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

const Tab = createBottomTabNavigator();

function App() {
  const [isLoged, setIsLoged] = useState<boolean>(false);
  const [UserData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false); // Estado para el loading

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
    return <GoogleSignInComponent setIsLoged={setIsLoged} setUserData={setUserData} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="HomeAcolyth"
          screenOptions={{
            tabBarActiveTintColor: '#e91e63',
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: 'powderblue' },
          }}
        >
          <Tab.Screen
            name="ProfileAcolyth"
            options={{ tabBarLabel: 'Perfil' }}
          >
            {props => <AcolythProfileScreen {...props} user={UserData} />}
          </Tab.Screen>
          <Tab.Screen
            name="HomeAcolyth"
            options={{ tabBarLabel: 'Inicio' }}
          >
            {props => <AcolythHomeScreen {...props} setIsLoged={setIsLoged} />}
          </Tab.Screen>
          <Tab.Screen
            name="LaboratoryAcolyth"
            options={{ tabBarLabel: 'Laboratorio' }}
          >
            {props => <AcolythLaboratoryScreen/>}
          </Tab.Screen>
        </Tab.Navigator>
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
