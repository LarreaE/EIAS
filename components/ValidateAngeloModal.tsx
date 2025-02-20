// ValidateAngeloModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import socket from '../sockets/socketConnection.tsx';
import MedievalText from './MedievalText'; // tu componente, opcional

interface ValidateAngeloModalProps {
}

const ValidateAngeloModal: React.FC<ValidateAngeloModalProps> = () => {
  // Controla visibilidad del modal
  const [visible, setVisible] = useState(false);

  // Opcional: si quieres guardar algo del payload (nombre, etc.)
  const [angeloData, setAngeloData] = useState<any>(null);

  useEffect(() => {
    // Listener que se activa cuando el servidor emite "Validate_angelo"
    const handleValidateAngelo = (payload: any) => {
      // payload podría incluir info extra, ej: { name: 'Angelo??' }
      console.log('Cliente recibió "Validate_angelo":', payload);

      // Guardamos la info (opcional)
      setAngeloData(payload);
      // Mostramos el modal
      setVisible(true);
    };

    socket.on('Validate_angelo', handleValidateAngelo);

    // Limpieza al desmontar
    return () => {
      socket.off('Validate_angelo', handleValidateAngelo);
    };
  }, []);

  // Función para manejar la respuesta (Yes/No)
  const handleResponse = (isYes: boolean) => {
    // Emitimos evento con la respuesta
    socket.emit('Validate_angelo_response', {
      validated: isYes,
    });

    // Cerramos el modal
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MedievalText style={styles.title}>Is this Angelo?</MedievalText>
          
          {/* Imagen de Angelo */}
          <Image 
            source={require('../assets/angelo.webp')}  // tu imagen
            style={styles.angeloImage}
            resizeMode="contain"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'green' }]}
              onPress={() => handleResponse(true)}
            >
              <Text style={styles.buttonText}>YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'red' }]}
              onPress={() => handleResponse(false)}
            >
              <Text style={styles.buttonText}>NO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ValidateAngeloModal;

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
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  angeloImage: {
    width: 150,
    height: 200,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  button: {
    marginHorizontal: 10,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});
