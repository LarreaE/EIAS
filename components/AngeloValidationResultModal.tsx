// AngeloValidationResultModal.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MedievalText from './MedievalText'; // tu componente de texto, opcional

interface AngeloValidationResultModalProps {
  visible: boolean;      // Controla si se muestra el modal
  isSuccess: boolean;    // Indica si el resultado fue "éxito" (true) o "fracaso" (false)
  onClose: () => void;   // Llamado al pulsar OK
}

const AngeloValidationResultModal: React.FC<AngeloValidationResultModalProps> = ({
  visible,
  isSuccess,
  onClose,
}) => {
  if (!visible) return null;

  // Elegimos el mensaje según isSuccess
  const title = isSuccess ? 'Arcane Thanks!' : 'That is not Angelo!';
  const description = isSuccess
    ? 'You have delivered the REAL Angelo. Great job!'
    : 'You have delivered the wrong person...';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MedievalText style={styles.title}>{title}</MedievalText>
          <MedievalText style={styles.description}>
            {description}
          </MedievalText>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MedievalText style={{ color: '#fff' }}>OK</MedievalText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AngeloValidationResultModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
});
