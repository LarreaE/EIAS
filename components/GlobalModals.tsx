// GlobalModals.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext, UserContextType } from '../context/UserContext';
import MedievalText from './MedievalText'; // Ejemplo de tu componente de texto, si lo usas
import { listenToDiseasesEvents } from '../sockets/listenEvents';

// ===============
// Modal de Maldición (Ethazium) - BLOQUEO TOTAL
// ===============
const EthaziumCurseModal: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MedievalText style={styles.title}>Ethazium Curse!</MedievalText>
          <MedievalText style={styles.description}>
            You are cursed by the dark power of Ethazium...
            All your attributes are reduced by 40%.
          </MedievalText>
          {/* Sin botón local de "close", 
              Mortimer o el server deberá curarlo */}
        </View>
      </View>
    </Modal>
  );
};

// ===============
// Modal de Enfermedad (Disease) - Se puede cerrar localmente
// ===============
interface DiseaseModalProps {
  visible: boolean;
  disease: string | null;
  onClose: () => void;
}
const DiseaseModal: React.FC<DiseaseModalProps> = ({ visible, disease, onClose }) => {
  if (!visible || !disease) return null;

  let description = '';
  if (disease === 'PUTRID PLAGUE') {
    description = 'Your Intelligence is reduced by 75%.';
  } else if (disease === 'EPIC WEAKNESS') {
    description = 'Your Strength is reduced by 60%.';
  } else if (disease === 'MEDULAR APOCALYPSE') {
    description = 'Your Constitution is reduced by 30%.';
  }

  return (
    <Modal transparent visible>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MedievalText style={styles.title}>Infected with {disease}!</MedievalText>
          <MedievalText style={styles.description}>{description}</MedievalText>
          {/* Botón para cerrar localmente el modal 
              (La enfermedad sigue en la BD hasta que Mortimer la cure) */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MedievalText style={{ color: '#fff' }}>OK</MedievalText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ===============
// Modal de Cansancio (Tired) - Se puede cerrar localmente
// ===============
interface TiredModalProps {
  visible: boolean;
  onClose: () => void;
}
const TiredModal: React.FC<TiredModalProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MedievalText style={styles.title}>You are Exhausted!</MedievalText>
          <MedievalText style={styles.description}>
            Your Resistance is at 30 or below.
            You can only recover fully if Mortimer applies a cataplasma.
          </MedievalText>
          {/* Botón para cerrar localmente 
              (La resistencia sigue baja hasta que se use cataplasma) */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MedievalText style={{ color: '#fff' }}>OK</MedievalText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ===============
// GlobalModals principal
// ===============
const GlobalModals: React.FC = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType;
  
  const playerData = userData?.playerData;
  if (!playerData) return null;

  // Si es traidor, no sufre nada => no mostramos modales.
  if (playerData.isbetrayer) {
    return null;
  }

  // Variables que activan cada modal
  const isCursed = playerData.ethaziumCursed === true;
  const hasDisease = playerData.disease !== null;
  const isTired = typeof playerData.resistance === 'number' && playerData.resistance <= 30;

  // Estos estados permiten “cerrar” localmente los modales 
  // (para enfermedades y cansancio, no para la maldición)
  const [diseaseModalVisible, setDiseaseModalVisible] = useState(false);
  const [tiredModalVisible, setTiredModalVisible] = useState(false);

  // Registramos los eventos de “curación” y “cataplasma”
  useEffect(() => {
    // Al montar, escuchamos los sockets con email + setUserData
    listenToDiseasesEvents(playerData.email, setUserData);
  }, [playerData.email, setUserData]);

  // Cada vez que hasDisease cambie, abrimos/cerramos el modal
  useEffect(() => {
    if (hasDisease) {
      setDiseaseModalVisible(true); 
    } else {
      setDiseaseModalVisible(false);
    }
  }, [hasDisease]);

  // Cada vez que isTired cambie, abrimos/cerramos el modal
  useEffect(() => {
    if (isTired) {
      setTiredModalVisible(true);
    } else {
      setTiredModalVisible(false);
    }
  }, [isTired]);

  return (
    <>
      {/* Maldición Ethazium => no se puede cerrar localmente */}
      <EthaziumCurseModal visible={isCursed} />

      {/* Enfermedad => modal con botón OK para cerrar local */}
      <DiseaseModal
        visible={diseaseModalVisible}
        disease={playerData.disease}
        onClose={() => setDiseaseModalVisible(false)}
      />

      {/* Cansancio => modal con botón OK para cerrar local */}
      <TiredModal 
        visible={tiredModalVisible}
        onClose={() => setTiredModalVisible(false)}
      />
    </>
  );
};

export default GlobalModals;

// ===============
// Estilos
// ===============
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#2e2e2e',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'center',
  },
});
