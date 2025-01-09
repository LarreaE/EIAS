import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import socket from '../sockets/socketConnection';
import MedievalText from './MedievalText';
import { sendRest } from '../sockets/emitEvents';
import { clearRestEvents, listenToRestEvents } from '../sockets/listenEvents';
import { UserContext, UserContextType } from '../context/UserContext.tsx';
import Spinner from './Spinner.tsx';


type Props = {
  user: any;  // User data passed as a prop from the main screen
  setIsLogged: (value: boolean) => void;
};

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC<Props> = ({ user, setIsLogged }) => {
  const signOut = () => {
    setIsLogged(false);
    socket.disconnect();
  };
    const context = useContext(UserContext) as UserContextType;
    const { userData,setUserData } = context;
     const [loading, setLoading] = useState(false); // Estado para el loading

  useEffect(() => {
    // Definir la función updateLocal para modificar la data del jugador actual
    const updateLocal = (playerId: string, changes: Record<string, any>) => {
      // Si tuviéramos un "userData.playerData._id"
      console.log(playerId);
      
      if(playerId === userData.playerData.email){
        setUserData((prev) => {
          setLoading(false);
          if (!prev) return prev;
          return {
            ...prev,
            playerData: {
              ...prev.playerData,
              ...changes,
            },
          };
        });
      }
    };
    // Registrar listeners
    listenToRestEvents(updateLocal);
    // Limpieza
    return () => {
      clearRestEvents();
    };
  }, [userData, setUserData]);

  // 1. Obtenemos la resistencia
  const resistance: number = user.playerData.resistance ?? 100;
  // 2. Determinamos color según el valor
  let barColor = 'green';
  if (resistance <= 50) {
    barColor = 'red';
  } else if (resistance <= 75) {
    barColor = 'yellow';
  }

  // 3. Ancho proporcional a la resistencia (0 a 100) si deseas
  // Por ejemplo, un máximo de 200 px
  const maxBarWidth = 200;
  const barWidth = Math.max(0, Math.min(100, resistance)) * (maxBarWidth / 100);

  // 4. Manejar el botón "Rest"
  const handleRest = () => {
    sendRest(user.playerData.email);
    setLoading(true);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/settings_background_04.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Centered welcome text */}
        <View style={styles.welcomeContainer}>
          <MedievalText style={styles.welcomeText}>
            {`Welcome back, ${user.playerData.role}`}
          </MedievalText>
          <MedievalText style={styles.welcomeText}>
            {`\nUser identity:\n${user.playerData.name}`}
          </MedievalText>

          {/* Barra de Resistencia */}
          <View style={styles.resistanceContainer}>
            <MedievalText style={styles.welcomeText}>
              {`Resistance: ${resistance}%`}
            </MedievalText>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: barWidth, backgroundColor: barColor }]} />
            </View>
          </View>

          {/* Botón "Rest" / "Descansar" */}
          <TouchableOpacity onPress={handleRest} style={styles.restButton}>
            <MedievalText style={styles.restButtonText}>Rest</MedievalText>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <ImageBackground
            source={require('../assets/boton.png')}
            style={styles.buttonImage}
            resizeMode="contain"
          >
            <MedievalText style={styles.signOutText}>Sign Out</MedievalText>
          </ImageBackground>
        </TouchableOpacity>
      </ImageBackground>
      {loading && <Spinner />}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '200%',
  },
  welcomeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '10%',
    backgroundColor: 'rgba(200, 200, 200, 0.7)',
    padding: 15,
    borderRadius: 10,
    top: 100,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  // Contenedor general de la barra
  resistanceContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  // Fondo de la barra
  barBackground: {
    width: 200,  // Máximo ancho de la barra
    height: 20,
    backgroundColor: '#555',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
  },
  // Parte rellena de la barra
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  // Botón "Rest"
  restButton: {
    backgroundColor: '#4a4',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  restButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  // Sign Out
  signOutButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    width: 150,
    height: 80,
  },
  buttonImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  signOutText: {
    color: 'white',
    fontSize: 18,
  },
});
