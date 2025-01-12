import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import MedievalText from './MedievalText';
import { setCursesAndDisaeses } from '../sockets/emitEvents';

interface User {
  _id: string;
  name: string;
  ethaziumCursed: boolean;
  isbetrayer: boolean;
  avatar: string; // Agregado para mostrar avatar
}

interface IstvanActionsModalProps {
  visible: boolean;
  onClose: () => void;
  users: User[]; // Lista de usuarios para mostrar
}

const IstvanActionsModal: React.FC<IstvanActionsModalProps> = ({
  visible,
  onClose,
  users,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MedievalText style={styles.title}>Apply Ethazium Curse</MedievalText>
          <ScrollView style={styles.userList}>
            {users
              .filter((user) => !user.isbetrayer) // Filtramos a los traidores
              .map((user) => {
                // Estado local para cada usuario
                const [isCursed, setIsCursed] = useState(user.ethaziumCursed);

                return (
                  <View key={user._id} style={styles.row}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <MedievalText style={styles.label}>{user.name}</MedievalText>
                    {!isCursed ? (
                      <TouchableOpacity
                        style={styles.applyCurseButton}
                        onPress={() => {
                          // Aplicar la maldición al usuario específico
                          setCursesAndDisaeses(user._id, true, []);
                          setIsCursed(true); // Actualizar el estado local
                        }}
                      >
                        <MedievalText style={styles.buttonText}>Apply Curse</MedievalText>
                      </TouchableOpacity>
                    ) : (
                      <MedievalText style={styles.alreadyCursedLabel}>
                        💀 Cursed
                      </MedievalText>
                    )}
                  </View>
                );
              })}
          </ScrollView>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <MedievalText style={styles.buttonText}>Close</MedievalText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default IstvanActionsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 350,
    maxHeight: '80%',
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
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  userList: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#444',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#555',
  },
  label: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
  },
  alreadyCursedLabel: {
    color: '#ccc',
    fontSize: 16,
  },
  applyCurseButton: {
    backgroundColor: '#890000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
  },
});