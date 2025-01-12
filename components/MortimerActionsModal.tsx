import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
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
  avatar: string;
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
  avatar,
  onApplyLocal,
}) => {
  const [localCursed, setLocalCursed] = useState<boolean>(initialEthaziumCursed);
  const [localDiseases, setLocalDiseases] = useState<DiseaseType[]>(initialDiseases);
  const [diseasesToCure, setDiseasesToCure] = useState<DiseaseType[]>([]);

  useEffect(() => {
    if (visible) {
      setLocalCursed(initialEthaziumCursed);
      setLocalDiseases(initialDiseases);
      setDiseasesToCure([]);
    }
  }, [visible, initialEthaziumCursed, initialDiseases]);

  const toggleCureDisease = (disease: DiseaseType) => {
    if (diseasesToCure.includes(disease)) {
      setDiseasesToCure((prev) => prev.filter((d) => d !== disease));
    } else {
      setDiseasesToCure((prev) => [...prev, disease]);
    }
  };

  const restAcolyte = (email: string) => {
    sendRest(email);
  };

  const handleApplyChanges = () => {
    const updatedDiseases = localDiseases.filter(
      (disease) => !diseasesToCure.includes(disease)
    );

    onApplyLocal({
      diseases: updatedDiseases,
      ethaziumCursed: localCursed,
    });
    setCursesAndDisaeses(playerId, localCursed, updatedDiseases);
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
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <MedievalText style={styles.title}>Actions for {nickname}</MedievalText>

          {localCursed && (
            <View style={styles.row}>
              <MedievalText style={styles.label}>Ethazium Curse</MedievalText>
              <TouchableOpacity
                style={styles.cureButton}
                onPress={() => setLocalCursed(false)}
              >
                <MedievalText style={styles.buttonText}>Cure</MedievalText>
              </TouchableOpacity>
            </View>
          )}

          {localDiseases.length > 0 ? (
            <MedievalText style={styles.diseaseTitle}>Diseases</MedievalText>
          ) : (
            <MedievalText style={styles.noDiseasesText}>
              The Acolyte is Healthy and Strong!
            </MedievalText>
          )}

          {localDiseases.map((disease) => (
            <View key={disease} style={styles.row}>
              <MedievalText style={styles.label2}>
                {getDiseaseIcon(disease)} {disease}
              </MedievalText>
              {disease === 'EXHAUSTED' ? (
                <MedievalText style={styles.noCureText}>No Cure</MedievalText>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.cureButton,
                    diseasesToCure.includes(disease) && styles.readyToCureButton,
                  ]}
                  onPress={() => toggleCureDisease(disease)}
                >
                  <MedievalText style={styles.buttonText}>
                    {diseasesToCure.includes(disease) ? 'Pending' : 'Cure'}
                  </MedievalText>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <MedievalText style={styles.buttonText}>Cancel</MedievalText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyChanges}>
              <MedievalText style={styles.buttonText}>Apply</MedievalText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MortimerActionsModal;

const getDiseaseIcon = (disease: DiseaseType) => {
  switch (disease) {
    case 'PUTRID PLAGUE':
      return '🦠';
    case 'EPIC WEAKNESS':
      return '💀';
    case 'MEDULAR APOCALYPSE':
      return '☠️';
    case 'EXHAUSTED':
      return '😩';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#888',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 15,
    borderColor: '#555',
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  label: {
    color: '#fff',
    fontSize: 18,
  },
  label2: {
    color: '#ccc',
    fontSize: 16,
  },
  diseaseTitle: {
    fontSize: 20,
    color: '#e5e5e5',
    marginBottom: 10,
    textAlign: 'center',
  },
  noDiseasesText: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 10,
    textAlign: 'center',
  },
  cureButton: {
    backgroundColor: '#5a0a0a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  readyToCureButton: {
    backgroundColor: '#003300',
    borderColor: '#004400',
    borderWidth: 2,
  },
  noCureText: {
    color: '#888',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  applyButton: {
    backgroundColor: '#004400',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
  },
});