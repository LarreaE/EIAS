import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { UserContext, UserContextType } from '../context/UserContext';
import { sendLocation } from '../sockets/emitEvents';
import MapButton from '../components/MapButton';
import MedievalText from '../components/MedievalText';
import { sendBetrayer } from '../sockets/emitEvents';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TIOTF'>;

const { width, height } = Dimensions.get('window');

const TheInnOfTheForgotten: React.FC = () => {
  const context = useContext(UserContext) as UserContextType;
  const { userData, setUserData } = context;
  const navigation = useNavigation<MapScreenNavigationProp>();

  // Verificamos si el jugador aún no ha elegido traicionar (isBetrayer === null)
  const [showBetrayModal, setShowBetrayModal] = useState<boolean>(false);

  useEffect(() => {
    if (userData.playerData.isbetrayer === null) {
      setShowBetrayModal(true);
    }
  }, [userData.playerData.isbetrayer]);

  // Acción para ir al mapa
  const goToMap = () => {
    sendLocation('Map', userData.playerData.email);
    navigation.navigate('Map');
  };

  // Acción cuando se ACEPTA la traición
  const handleBetrayal = () => {
    sendBetrayer(true,userData.playerData.email);
    setUserData({
      ...userData,
      playerData: {
        ...userData.playerData,
        isbetrayer: true,
      },
    });
    setShowBetrayModal(false);
  };

  // Acción cuando se RECHAZA la traición
  const handleLoyalty = () => {
    sendBetrayer(false,userData.playerData.email);
    setUserData({
      ...userData,
      playerData: {
        ...userData.playerData,
        isbetrayer: false,
      },
    });
    setShowBetrayModal(false);
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/THOS.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.titleContainer}>
          <View style={styles.titleBackground} />
          <MedievalText style={styles.title}>The Inn Of The Forgotten</MedievalText>
        </View>

        {/* Botón para ir al mapa */}
        <MapButton
          onPress={goToMap}
          iconImage={require('../assets/map_icon.png')}
        />
      </ImageBackground>

      {/* Modal ÉPICO de la traición */}
      <Modal
        visible={showBetrayModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBetrayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <MedievalText style={styles.modalTitle}>
              To the wanderer who dares to defy their bloodline...
            </MedievalText>
            <MedievalText style={styles.modalText}>
              Forsake your kin and pledge your loyalty to the Brotherhood of Shadows. 
              In return, claim <Text style={styles.highlight}>10,000 gold coins</Text> and the 
              coveted <Text style={styles.highlight}>Rotten Set of the Decrepit Betrayer</Text>. 
              Your destiny awaits.
            </MedievalText>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.betrayButton} onPress={handleBetrayal}>
                <MedievalText style={styles.buttonText}>Betray</MedievalText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loyalButton} onPress={handleLoyalty}>
                <MedievalText style={styles.buttonText}>Stay Loyal</MedievalText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 130,
    alignItems: 'center',
  },
  titleBackground: {
    top: -100,
    position: 'absolute',
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    width: 400,
    height: 70,
    borderRadius: 10,
  },
  title: {
    top: -95,
    fontSize: 33,
    paddingHorizontal: 10,
    paddingVertical: 25,
    textAlign: 'center',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
  },
  modalTitle: {
    fontSize: 24,
    color: '#FFC107',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  modalText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    lineHeight: 24,
    textAlign: 'justify',
  },
  highlight: {
    color: '#FFC107',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  betrayButton: {
    backgroundColor: '#7f0000',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loyalButton: {
    backgroundColor: '#004d00',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default TheInnOfTheForgotten;
