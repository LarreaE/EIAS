// MortimerLaboratoryScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AcolythCard from './AcolythCard.tsx';
import {
  listenToServerEventsMortimer,
  clearServerEvents,
} from '../sockets/listenEvents.tsx';
import MedievalText from './MedievalText.tsx';
import Config from 'react-native-config';
import MapButton from './MapButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types.ts';
import { sendLocation } from '../sockets/emitEvents.tsx';
import { UserContext, UserContextType } from '../context/UserContext.tsx';
import MortimerActionsModal from './MortimerActionsModal';

// Helper para crear el badge (color + letra)
function DiseaseBadge({ color, letter }: { color: string; letter: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <MedievalText style={styles.badgeText}>{letter}</MedievalText>
    </View>
  );
}

type MapScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LaboratoryMortimer'
>;

interface User {
  email: string;
  resistance: number;
  isbetrayer: any;
  _id: string;
  nickname: string;
  is_active: boolean;
  avatar: string;
  disease?: string | null;
  ethaziumCursed?: boolean;
}

const MortimerLaboratoryScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData } = context;

  const [users, setUsers] = useState<User[]>([]);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  type DiseaseType = 'PUTRID PLAGUE' | 'EPIC WEAKNESS' | 'MEDULAR APOCALYPSE';


  const handleCardPress = (user: User) => {
    // Guardas la info de ese jugador en local
    setSelectedUser(user);
    setModalVisible(true);
  };

  const goToMap = () => {
    sendLocation('School', userData.playerData.email);
    navigation.navigate('School');
  };

  // Callback local para “Apply” (actualiza el user en local)
const handleApplyLocalChanges = (changes: { diseases: string[]; ethaziumCursed: boolean }) => {
  if (!selectedUser) return;

  // 1) Actualizar local: Reemplazar en tu 'users' array
  setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u._id === selectedUser._id) {
          // Cambiamos disease y ethaziumCursed
          return {
            ...u,
            disease: changes.diseases.length > 0 ? changes.diseases[0] : null, 
            // O si aceptas múltiples diseases, ajusta la interfaz y tu card 
            ethaziumCursed: changes.ethaziumCursed,
          };
        }
        return u;
      })
    );
  };


  useEffect(() => {
    listenToServerEventsMortimer(setUsers);

    const addUsers = async () => {
      try {
        const response = await fetch(`${Config.LOCAL_HOST}/api/players/mortimer`);
        const data: User[] = await response.json();

        const updatedUsers = data.map((user) => {
          console.log('User Resistance:', user);
          
          if (user.resistance <= 30) {
            return {
              ...user,
              disease: user.disease ? `${user.disease}, EXHAUSTED` : 'EXHAUSTED',
            };
          }
          return user;
        });
        // ✅ Establecer los usuarios actualizados en el estado
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    addUsers();

    return () => {
      clearServerEvents();
    };
  }, []);

  return (
    <ImageBackground
      source={require('../assets/laboratory.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.titleContainer}>
        <View style={styles.titleBackground} />
        <MedievalText style={styles.title}>Laboratory</MedievalText>

        {/* Botón de información (arriba y más a la derecha) */}
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setInfoModalVisible(true)}
        >
          <Image
            source={require('../assets/info_icon.png')}
            style={styles.infoIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.users}>
          {users
            .filter(user => !user.isbetrayer) // Filtra los usuarios que NO son traidores
            .map(user => (
              <AcolythCard
                key={user._id}
                nickname={user.nickname}
                is_active={user.is_active}
                avatar={user.avatar}
                disease={user.disease}
                ethaziumCursed={user.ethaziumCursed}
                onPress={() => handleCardPress(user)}
              />
            ))
          }
      </View>

      <MapButton
        onPress={goToMap}
        iconImage={require('../assets/school_icon.png')}
      />

      {/* Modal explicando los iconos con sus badges */}
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <MedievalText style={styles.modalTitle}>Icons Legend</MedievalText>

            {/* Putrid Plague */}
            <View style={styles.modalRow}>
              <DiseaseBadge color="purple" letter="P" />
              <MedievalText style={styles.modalText}>
                : Putrid Plague (Intelligence -75%)
              </MedievalText>
            </View>

            {/* Epic Weakness */}
            <View style={styles.modalRow}>
              <DiseaseBadge color="blue" letter="E" />
              <MedievalText style={styles.modalText}>
                : Epic Weakness (Strength -60%)
              </MedievalText>
            </View>

            {/* Medular Apocalypse */}
            <View style={styles.modalRow}>
              <DiseaseBadge color="green" letter="M" />
              <MedievalText style={styles.modalText}>
                : Medular Apocalypse (Constitution -30%)
              </MedievalText>
            </View>

            {/* EXHAUSTED */}
            <View style={styles.modalRow}>
              <DiseaseBadge color="purpel" letter="Z" />
              <MedievalText style={styles.modalText}>
                : EXHAUSTED
              </MedievalText>
            </View>

            {/* Ethazium Curse */}
            <View style={styles.modalRow}>
              <DiseaseBadge color="red" letter="C" />
              <MedievalText style={styles.modalText}>
                : Ethazium Curse (All attributes -40%)
              </MedievalText>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setInfoModalVisible(false)}
            >
              <MedievalText style={styles.closeButtonText}>Close</MedievalText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* RENDERIZA EL MODAL */}
      {selectedUser && (
        <MortimerActionsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          playerId={selectedUser?._id || ''}
          nickname={selectedUser?.nickname || ''}
          initialEthaziumCursed={selectedUser?.ethaziumCursed || false}
          email={selectedUser.email}
          initialDiseases={
            selectedUser?.disease
              ? [selectedUser.disease as DiseaseType]
              : []
          }
          onApplyLocal={handleApplyLocalChanges}
        />
      )}
    </ImageBackground>
  );
};

export default MortimerLaboratoryScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 130,
    alignItems: 'center',
    width: '100%', // Para que ocupe todo el ancho, facilitando posicionar la infoButton
  },
  titleBackground: {
    position: 'absolute',
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    width: 220,
    height: 60,
    borderRadius: 10,
  },
  title: {
    fontSize: 35,
    paddingHorizontal: 10,
    paddingVertical: 25,
    textAlign: 'center',
  },
  infoButton: {
    position: 'absolute',
    top: -110,    // Un poco más arriba
    right: 10,  // Más a la esquina
    padding: 10,
  },
  infoIcon: {
    width: 60,
    height: 60,
  },
  users: {
    top: 250,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 320,
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#888',
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalText: {
    color: '#ddd',
    fontSize: 14,
    marginLeft: 5,
  },
  closeButton: {
    backgroundColor: '#222',
    marginTop: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
  },

  // Badge para el modal (idéntico o muy parecido al de la tarjeta)
  badge: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    bottom:3,
  },
});
