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
import { requestAcolythes, sendRest } from '../sockets/emitEvents';
import { clearRestEvents, listenToPlayerList, listenToRestEvents } from '../sockets/listenEvents';
import { UserContext, UserContextType } from '../context/UserContext.tsx';
import Spinner from './Spinner.tsx';
import IstvanActionsModal from './IstvanActionsModal';  // Importación del modal

type Props = {
  user: any;
  setIsLogged: (value: boolean) => void;
};
interface User {
  id: string;
  name: string;
  ethaziumCursed: boolean;
}

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC<Props> = ({ user, setIsLogged }) => {
  const signOut = () => {
    setIsLogged(false);
    socket.disconnect();
  };
  const context = useContext(UserContext) as UserContextType;
  const { userData, setUserData } = context;
  const [loading, setLoading] = useState(false);
  const [isIstvanModalVisible, setIsIstvanModalVisible] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    requestAcolythes();
     listenToPlayerList(setAllUsers);
    return () => {
      socket.off('Player_list');
    };
  }, []);

  useEffect(() => {
    const updateLocal = (playerId: string, changes: Record<string, any>) => {
      console.log(playerId);
      if (playerId === userData.playerData.email) {
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
    listenToRestEvents(updateLocal);
    return () => {
      clearRestEvents();
    };
  }, [userData, setUserData]);

  const resistance: number = user.playerData.resistance ?? 100;
  let barColor = 'green';
  if (resistance <= 50) {
    barColor = 'red';
  } else if (resistance <= 75) {
    barColor = 'yellow';
  }
  const maxBarWidth = 200;
  const barWidth = Math.max(0, Math.min(100, resistance)) * (maxBarWidth / 100);

  const handleRest = () => {
    sendRest(user.playerData.email);
    setLoading(true);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/settings_background_04.webp')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.welcomeContainer}>
          <MedievalText style={styles.welcomeText}>
            {`Welcome back, ${user.playerData.role}`}
          </MedievalText>
          <MedievalText style={styles.welcomeText}>
            {`\nUser identity:\n${user.playerData.name}`}
          </MedievalText>

          <View style={styles.resistanceContainer}>
            <MedievalText style={styles.welcomeText}>
              {`Resistance: ${resistance}%`}
            </MedievalText>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { width: barWidth, backgroundColor: barColor },
                ]}
              />
            </View>
          </View>

          <TouchableOpacity onPress={handleRest} style={styles.restButton}>
            <MedievalText style={styles.restButtonText}>Rest</MedievalText>
          </TouchableOpacity>

          {/* Botón para aplicar Ethazium Curse visible solo para ISTVAN */}
          {user.playerData.role === 'ISTVAN' && (
            <TouchableOpacity
              onPress={() => setIsIstvanModalVisible(true)}
              style={styles.applyEthaziumButton}
            >
              <MedievalText style={styles.applyEthaziumButtonText}>
                Apply Ethazium Curse
              </MedievalText>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <ImageBackground
            source={require('../assets/boton.webp')}
            style={styles.buttonImage}
            resizeMode="contain"
          >
            <MedievalText style={styles.signOutText}>Sign Out</MedievalText>
          </ImageBackground>
        </TouchableOpacity>
      </ImageBackground>
      {loading && <Spinner />}

      {/* Modal de Istvan */}
      <IstvanActionsModal
        visible={isIstvanModalVisible}
        onClose={() => setIsIstvanModalVisible(false)}
        users={allUsers}  // Passa a lista de usuários para o modal
      />
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
  resistanceContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  barBackground: {
    width: 200,
    height: 20,
    backgroundColor: '#555',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
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
  applyEthaziumButton: {
    backgroundColor: '#cc0000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  applyEthaziumButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});