// MortimerActionsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import MedievalText from './MedievalText';
import { setCursesAndDisaeses } from '../sockets/emitEvents';

type DiseaseType = 'PUTRID PLAGUE' | 'EPIC WEAKNESS' | 'MEDULAR APOCALYPSE';

interface MortimerActionsModalProps {
  visible: boolean;
  onClose: () => void;
  playerId: string;
  nickname: string;
  initialEthaziumCursed: boolean;
  initialDiseases: DiseaseType[];  // array con 0, 1 o + enfermedades
  // Callback para actualizar local
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
  onApplyLocal,
}) => {
  // Estado local para la maldición
  const [localCursed, setLocalCursed] = useState<boolean>(initialEthaziumCursed);

  // Estado local para las enfermedades
  // Guardamos en un array. Si la enfermedad está, la incluimos.
  const [localDiseases, setLocalDiseases] = useState<DiseaseType[]>(initialDiseases);

  useEffect(() => {
    if (visible) {
      // Al abrir, sincronizamos con la info inicial
      setLocalCursed(initialEthaziumCursed);
      setLocalDiseases(initialDiseases);
    }
  }, [visible, initialEthaziumCursed, initialDiseases]);

  // Helpers para togglear enfermedades
  const toggleDisease = (disease: DiseaseType) => {
    // Si ya está en el array, la quitamos; si no, la agregamos
    setLocalDiseases((prev) => {
      if (prev.includes(disease)) {
        return prev.filter((d) => d !== disease);
      } else {
        return [...prev, disease];
      }
    });
  };

  // Chequear si una enfermedad está activa
  const hasDisease = (disease: DiseaseType) => localDiseases.includes(disease);

  // Al presionar “Apply”
  const handleApplyChanges = () => {
    // 1) Actualizar local
    onApplyLocal({
      diseases: localDiseases,
      ethaziumCursed: localCursed,
    });

    // o un emitEvent: updatePlayerCurseAndDiseases(playerId, localDiseases, localCursed);
    setCursesAndDisaeses(playerId,localCursed,localDiseases);
    // 3) Cerrar modal
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

          {/* Switch para Ethazium */}
          <View style={styles.switchRow}>
            <Text style={styles.label}>Ethazium Curse</Text>
            <Switch
              value={localCursed}
              onValueChange={(val) => setLocalCursed(val)}
            />
          </View>

          <Text style={[styles.label, { marginVertical: 10 }]}>Diseases</Text>
          
          {/* Toggle PUTRID PLAGUE */}
          <View style={styles.switchRow}>
            <Text style={styles.label2}>Putrid Plague</Text>
            <Switch
              value={hasDisease('PUTRID PLAGUE')}
              onValueChange={() => toggleDisease('PUTRID PLAGUE')}
            />
          </View>

          {/* Toggle EPIC WEAKNESS */}
          <View style={styles.switchRow}>
            <Text style={styles.label2}>Epic Weakness</Text>
            <Switch
              value={hasDisease('EPIC WEAKNESS')}
              onValueChange={() => toggleDisease('EPIC WEAKNESS')}
            />
          </View>

          {/* Toggle MEDULAR APOCALYPSE */}
          <View style={styles.switchRow}>
            <Text style={styles.label2}>Medular Apocalypse</Text>
            <Switch
              value={hasDisease('MEDULAR APOCALYPSE')}
              onValueChange={() => toggleDisease('MEDULAR APOCALYPSE')}
            />
          </View>

          {/* Botones */}
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

// Estilos
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
  switchRow: {
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