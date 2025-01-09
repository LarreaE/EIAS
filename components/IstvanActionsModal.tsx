// IstvanActionsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MedievalText from './MedievalText';
import { setCursesAndDisaeses } from '../sockets/emitEvents';

interface User {
  id: string;
  name: string;
  ethaziumCursed: boolean;
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
            {users.map((user) => {
              // Estado local para cada usuario
              const [isCursed, setIsCursed] = useState(user.ethaziumCursed);

              return (
                <View key={user.id} style={styles.row}>
                  <Text style={styles.label}>{user.name}</Text>
                  {!isCursed ? (
                    <TouchableOpacity
                      style={styles.applyCurseButton}
                      onPress={() => {
                        // Aplicar la maldición al usuario específico
                        setCursesAndDisaeses(user.id, true, []);
                        setIsCursed(true); // Actualizar el estado local
                      }}
                    >
                      <Text style={styles.buttonText}>Apply Curse</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.alreadyCursedLabel}>Already cursed</Text>
                  )}
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
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
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#888',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  userList: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  label: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  alreadyCursedLabel: {
    color: '#ccc',
    fontSize: 16,
  },
  applyCurseButton: {
    backgroundColor: '#cc0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  },
});
