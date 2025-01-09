import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import MedievalText from './MedievalText';

const BetrayerModal = ({ visible, onClose }) => {
  const fullText = "Traitors are no longer welcome at school...";
  const [displayedText, setDisplayedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (visible) {
      // Reset state whenever the modal becomes visible
      setDisplayedText("");
      setTypingComplete(false);
      let currentIndex = 0;

      interval = setInterval(() => {
        currentIndex++;
        setDisplayedText(fullText.substring(0, currentIndex));

        if (currentIndex === fullText.length) {
          clearInterval(interval);
          setTypingComplete(true);
        }
      }, 50); // Adjust speed (milliseconds) as desired
    }

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <MedievalText style={styles.modalText}>{displayedText}</MedievalText>
          {typingComplete && (
            <TouchableOpacity onPress={onClose} style={styles.okButton}>
              <MedievalText style={styles.okButtonText}>OK</MedievalText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
  },
  modalContent: {
    backgroundColor: 'darkgrey',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 30,
    borderWidth: 2,
    borderColor: '#a6824c',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  okButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BetrayerModal;