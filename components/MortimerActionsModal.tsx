// MortimerActionsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MedievalText from './MedievalText';
import { sendRest, setCursesAndDisaeses } from '../sockets/emitEvents';

type DiseaseType = 'PUTRID PLAGUE' | 'EPIC WEAKNESS' | 'MEDULAR APOCALYPSE' | 'EXHAUSTED';

interface MortimerActionsModalProps {
  visible: boolean;
  onClose: () => void;
  playerId: string;
  nickname: string;
  initialEthaziumCursed: boolean;
  initialDiseases: DiseaseType[];
  email: string;
  onApplyLocal: (changes: {
    diseases: DiseaseType[];
    ethaziumCursed: boolean;
  }) => void;
}

const MortimerActionsModal: React.FC<MortimerActionsModalProps> = ({
  visible,
  onClose,
  playerId,
  nickname,
  initialEthaziumCursed,
  initialDiseases,
  email,
  onApplyLocal,
}) => {
  const [localCursed, setLocalCursed] = useState<boolean>(initialEthaziumCursed);
  const [localDiseases, setLocalDiseases] = useState<DiseaseType[]>(initialDiseases);

  useEffect(() => {
    if (visible) {
      setLocalCursed(initialEthaziumCursed);
      setLocalDiseases(initialDiseases);
    }
  }, [visible, initialEthaziumCursed, initialDiseases]);

  const cureDisease = (disease: DiseaseType) => {
    setLocalDiseases((prev) => prev.filter((d) => d !== disease));
  };

  const restAcolyte = (email: string) => {
    sendRest(email);
  };
  const hasDisease = (disease: DiseaseType) => localDiseases.includes(disease);

  const handleApplyChanges = () => {
    onApplyLocal({
      diseases: localDiseases,
      ethaziumCursed: localCursed,
    });
    setCursesAndDisaeses(playerId, localCursed, localDiseases);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MedievalText style={styles.title}>Actions for {nickname}</MedievalText>

          {/* Mostrar botón "Cure" para Ethazium Curse si está activo */}
          {localCursed && (
            <View style={styles.row}>
              <Text style={styles.label}>Ethazium Curse</Text>
              <TouchableOpacity
                style={styles.cureButton}
                onPress={() => setLocalCursed(false)}
              >
                <Text style={styles.buttonText}>Cure</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Mostrar título "Diseases" si hay alguna activa */}
          {localDiseases.length > 0 && (
            <Text style={[styles.label, { marginVertical: 10 }]}>Diseases</Text>
          )}

          {/* Botones para curar enfermedades activas */}
          {hasDisease('PUTRID PLAGUE') && (
            <View style={styles.row}>
              <Text style={styles.label2}>Putrid Plague</Text>
              <TouchableOpacity
                style={styles.cureButton}
                onPress={() => cureDisease('PUTRID PLAGUE')}
              >
                <Text style={styles.buttonText}>Cure</Text>
              </TouchableOpacity>
            </View>
          )}

          {hasDisease('EPIC WEAKNESS') && (
            <View style={styles.row}>
              <Text style={styles.label2}>Epic Weakness</Text>
              <TouchableOpacity
                style={styles.cureButton}
                onPress={() => cureDisease('EPIC WEAKNESS')}
              >
                <Text style={styles.buttonText}>Cure</Text>
              </TouchableOpacity>
            </View>
          )}

          {hasDisease('MEDULAR APOCALYPSE') && (
            <View style={styles.row}>
              <Text style={styles.label2}>Medular Apocalypse</Text>
              <TouchableOpacity
                style={styles.cureButton}
                onPress={() => cureDisease('MEDULAR APOCALYPSE')}
              >
                <Text style={styles.buttonText}>Cure</Text>
              </TouchableOpacity>
            </View>
          )}
          {hasDisease('EXHAUSTED') && (
            <View style={styles.row}>
              <Text style={styles.label2}>Medular Apocalypse</Text>
              <TouchableOpacity
                style={styles.cureButton}
                onPress={() => restAcolyte(email)}
              >
                <Text style={styles.buttonText}>Cure</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Botones de Cancel y Apply */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyChanges}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MortimerActionsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 300,
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#888',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  label2: {
    color: '#ccc',
    fontSize: 14,
  },
  cureButton: {
    backgroundColor: '#006600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyButton: {
    backgroundColor: '#006600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
  },
});