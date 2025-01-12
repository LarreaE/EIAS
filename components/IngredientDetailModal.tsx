import React from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MedievalText from './MedievalText';
import { Ingredients } from '../interfaces/Ingredients';

interface IngredientDetailModalProps {
  visible: boolean;
  ingredient: Ingredients | null;
  onClose: () => void;
}

const IngredientDetailModal: React.FC<IngredientDetailModalProps> = ({
  visible,
  ingredient,
  onClose,
}) => {
  if (!ingredient) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: `https://kaotika.vercel.app/${ingredient.image}` }}
            style={styles.ingredientImage}
          />
          <MedievalText style={styles.title}>{ingredient.name}</MedievalText>
          <ScrollView contentContainerStyle={styles.descriptionContainer}>
            <MedievalText style={styles.description}>
              {ingredient.description}
            </MedievalText>
            {ingredient.effects.map((effect, index) => (
              <MedievalText key={index} style={styles.effect}>
                - {effect.replace('_', ' ').toUpperCase()}
              </MedievalText>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MedievalText style={styles.closeButtonText}>Close</MedievalText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default IngredientDetailModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cc9a52',
    alignItems: 'center',
  },
  ingredientImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
  },
  effect: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#cc9a52',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});