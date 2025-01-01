import React, { useContext, useEffect, useState } from 'react';
import {
  Modal, View, TouchableOpacity, StyleSheet, Dimensions, Image,
} from 'react-native';
import {
  listenToBattleEvents,
  clearBattleEvents,
} from '../sockets/listenEvents';
import {
  startAngeloBattle,
  reduceAngelo,
} from '../sockets/emitEvents';
import MedievalText from './MedievalText';
import { UserContext, UserContextType } from '../context/UserContext';
import { Player } from '../interfaces/Player';

const { width } = Dimensions.get('window');

interface BattleModalProps {
  visible: boolean;
  onClose: () => void;
}

interface UserData {
  playerData: Player;
  // ... cualquier otro campo que uses en tu contexto
}

const BattleModal: React.FC<BattleModalProps> = ({ visible, onClose }) => {
  const [progress, setProgress] = useState<number>(50);
  const [battleEnded, setBattleEnded] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>('');

  // Consumimos el contexto
  const context = useContext(UserContext) as UserContextType;
  const { userData, setUserData } = context;

  useEffect(() => {
    if (visible) {
      setBattleEnded(false);
      setProgress(50);
      setResultMessage('');

      // Suscribimos a los eventos de batalla
      listenToBattleEvents(
        (data) => {
          // onBattleStarted
          setProgress(data.progress);
          console.log('Battle started at progress:', data.progress);
        },
        (data) => {
          // onBattleUpdate
          setProgress(data.progress);
        },
        (data) => {
          // onBattleEnd
          setBattleEnded(true);

          if (data.result === 'AngeloWins') {
            setResultMessage('Angelo has overpowered you...');
          } else if (data.result === 'AcolytesWin') {
            setResultMessage('You have subdued Angelo!');
            // Marcamos en el contexto que Angelo ha sido reducido
            setUserData((prev) => ({
              ...prev,
              playerData: {
                ...prev.playerData,
                angeloReduced: true,
              },
            }));
          } else {
            setResultMessage('Battle Ended: ' + data.result);
          }
        }
      );

      // Iniciamos la batalla (puedes moverlo si lo deseas a otra parte)
      startAngeloBattle();
    }

    // Cleanup al desmontar o cerrar
    return () => {
      clearBattleEvents();
    };
  }, [visible]);

  // Cierre manual del modal
  const handleClose = () => {
    onClose();
  };

  // Disparo del “ataque” (bajar la barra)
  const handleTap = () => {
    if (!battleEnded) {
      reduceAngelo(5); // Envía al server para restar 5 puntos
    }
  };

  // Cálculo visual del ancho de la barra
  const barWidth = `${progress}%`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MedievalText style={styles.title}>Contain Angelo!</MedievalText>
          <Image
            source={require('../assets/angelo.png')}
            style={styles.angeloImage}
            resizeMode="contain"
          />

          {/* Barra de progreso */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: barWidth }]} />
          </View>
          <MedievalText style={styles.progressLabel}>
            {progress.toFixed(0)} / 100
          </MedievalText>

          {/* Botón de ataque si la batalla no acabó */}
          {!battleEnded && (
            <TouchableOpacity style={styles.tapButton} onPress={handleTap}>
              <MedievalText style={styles.tapText}>TAP to Resist!</MedievalText>
            </TouchableOpacity>
          )}

          {/* Mensaje si la batalla acabó */}
          {battleEnded && (
            <MedievalText style={styles.resultText}>
              {resultMessage}
            </MedievalText>
          )}

          {/* Botón de cierre */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <MedievalText style={styles.closeButtonText}>
              {battleEnded ? 'Close' : 'Give Up'}
            </MedievalText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BattleModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    borderWidth: 2,
    borderColor: '#660000',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 10,
  },
  angeloImage: {
    width: 120,
    height: 180,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 30,
    backgroundColor: '#555',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    backgroundColor: '#ff0000',
    height: '100%',
  },
  progressLabel: {
    color: '#fff',
    marginBottom: 20,
  },
  tapButton: {
    backgroundColor: '#cc0000',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginBottom: 20,
  },
  tapText: {
    color: '#fff',
    fontSize: 18,
  },
  resultText: {
    color: '#ffae00',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#444',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#fff',
    textTransform: 'uppercase',
  },
});
