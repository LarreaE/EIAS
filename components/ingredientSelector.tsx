// components/IngredientSelector.tsx

import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  Animated,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  Modal,
  Vibration,
  ToastAndroid,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { Ingredients } from '../interfaces/Ingredients';
import LocalIngredientImage from '../assets/EIAS.png';
import runaBackground from '../assets/runa.png';
import createPotionButton from '../assets/boton.png';
import SelectedIngredientsDisplay from './selectedIngredientsDisplay';
import MedievalText from './MedievalText'; // Importación del componente MedievalText
import Ingredient from './Potions/Ingredient';

interface IngredientSelectorProps {
  onSelectionChange: (selectedIngredients: { [key: string]: number }) => void;
  createPotion: (selectedIngredients: { [key: string]: number }) => void;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({ onSelectionChange, createPotion }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<{ [key: string]: number }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ingredients, setPotionVisible } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Create Potion');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredients | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Has alcanzado el máximo de ingredientes',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const toggleSelection = (ingredient: Ingredients) => {
    setSelectedIngredients((prevSelectedIngredients) => {
      const totalSelections = Object.values(prevSelectedIngredients).reduce((a, b) => a + b, 0);
      const currentCount = prevSelectedIngredients[ingredient._id] || 0;

      if (totalSelections < 4) {
        const updatedSelection = {
          ...prevSelectedIngredients,
          [ingredient._id]: currentCount + 1,
        };
        onSelectionChange(updatedSelection);
        return updatedSelection;
      } else {
        showToastWithGravityAndOffset();
        return prevSelectedIngredients;
      }
    });
  };

  const decreaseSelection = (ingredientId: string) => {
    setSelectedIngredients((prevSelectedIngredients) => {
      const currentCount = prevSelectedIngredients[ingredientId] || 0;
      if (currentCount > 0) {
        const updatedSelection = {
          ...prevSelectedIngredients,
          [ingredientId]: currentCount - 1,
        };
        if (updatedSelection[ingredientId] === 0) {
          delete updatedSelection[ingredientId];
        }
        onSelectionChange(updatedSelection);
        return updatedSelection;
      } else {
        return prevSelectedIngredients;
      }
    });
  };

  const deselectIngredient = (ingredientId: string) => {
    decreaseSelection(ingredientId);
  };

  const renderIngredient = ({ item, index }: { item: Ingredients; index: number }) => {
    const selectedCount = selectedIngredients[item._id] || 0;

    const inputRange = [
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
      (index + 1) * ITEM_SIZE,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [0, -50, 0],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const isCentered = index === currentIndex;

    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item)}
        onLongPress={() => {
          Vibration.vibrate();
          setSelectedIngredient(item);
          setModalVisible(true);
        }}
        activeOpacity={isCentered ? 0.9 : 1}
        disabled={!isCentered}
      >
        <Animated.View
          style={[
            styles.ingredientItemContainer,
            { transform: [{ translateY }], opacity },
            !isCentered && styles.disabledItem,
          ]}
        >
          <ImageBackground
            source={runaBackground}
            style={[
              styles.gradientBackground,
              selectedCount > 0 && styles.selectedItem,
            ]}
            imageStyle={{ borderRadius: 10 }}
          >
            {selectedCount > 0 && (
              <TouchableOpacity
                style={styles.decreaseButton}
                onPress={() => decreaseSelection(item._id)}
              >
                <MedievalText fontSize={20} color="#ffffff" style={styles.decreaseButtonText}>
                  -
                </MedievalText>
              </TouchableOpacity>
            )}
            {selectedCount > 0 && (
              <View style={styles.countBadge}>
                <MedievalText fontSize={14} color="#ffffff" style={styles.countText}>
                  {selectedCount}
                </MedievalText>
              </View>
            )}
            <Image 
              source={{
                      uri: `https://kaotika.vercel.app/${item.image}`,
                  }}  
              style={styles.ingredientImage} />
            <MedievalText fontSize={16} color="#ffffff" style={styles.ingredientName} numberOfLines={1}>
              {item.name}
            </MedievalText>
            <MedievalText fontSize={12} color="#ffffff" style={styles.ingredientDescription} numberOfLines={2}>
              {item.description}
            </MedievalText>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    checkIngredientsEffect();
  }, [ingredients]);

  // Function to check if all ingredients have the "cleanse" effect
  const checkIngredientsEffect = () => {
    const allCleanse = ingredients.every((ingredient:Ingredient) => ingredient.effects[0] === 'cleanse_parchment');
    console.log(allCleanse);
    
    setButtonText(allCleanse ? 'Purification Potion' : 'Create Potion');
  };

  const ITEM_WIDTH = 150;
  const ITEM_MARGIN = 5;
  const ITEM_SIZE = ITEM_WIDTH + ITEM_MARGIN * 2;
  const { width: WIDTH } = Dimensions.get('window');

  // Verificación de si hay al menos dos ingredientes seleccionados
  const totalSelectedCount = Object.values(selectedIngredients).reduce((a, b) => a + b, 0);
  const hasAtLeastTwoSelected = totalSelectedCount >= 2;

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        data={ingredients}
        keyExtractor={(item) => item._id}
        renderItem={renderIngredient}
        horizontal
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: (WIDTH - ITEM_SIZE) / 2,
        }}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / ITEM_SIZE);
          setCurrentIndex(index);
        }}
      />

      <SelectedIngredientsDisplay
        selectedIngredients={selectedIngredients}
        ingredients={ingredients}
        onDeselection={deselectIngredient}
      />

      {/* Create Potion Button */}
      {hasAtLeastTwoSelected && (
        <TouchableOpacity 
          style={styles.createPotionButtonContainer} 
          onPress={() => {
            createPotion(selectedIngredients);
            setSelectedIngredients({}); // Deselecciona todos los ingredientes
            onSelectionChange({}); // Actualiza los cambios en otros componentes
            setPotionVisible(true);
          }}
        >
          <ImageBackground
            source={createPotionButton}
            style={styles.createPotionButton}
            imageStyle={{ borderRadius: 10 }}
            resizeMode="stretch"
          >
            <MedievalText fontSize={18} color="#ffffff" style={styles.createPotionButtonText}>
              {buttonText}
            </MedievalText>
          </ImageBackground>
        </TouchableOpacity>
      )}

      {selectedIngredient && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ImageBackground
              source={runaBackground}
              style={styles.modalContent}
              imageStyle={{ borderRadius: 10 }}
              resizeMode="stretch"
            >
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <MedievalText fontSize={16} color="#ffffff" style={styles.modalCloseButtonText}>
                  X
                </MedievalText>
              </TouchableOpacity>
              <Image
                source={selectedIngredient.image}
                style={styles.modalImage}
              />
              <MedievalText fontSize={24} color="#ffffff" style={styles.modalTitle}>
                {selectedIngredient.name}
              </MedievalText>
              <MedievalText fontSize={16} color="#ffff00" style={styles.modalAtribute}>
                DESCRIPCIÓN:
              </MedievalText>
              <MedievalText fontSize={16} color="#ffffff" style={styles.modalDescription}>
                {selectedIngredient.description}
              </MedievalText>
              <MedievalText fontSize={16} color="#ffff00" style={styles.modalAtribute}>
                VALOR:
              </MedievalText>
              <MedievalText fontSize={16} color="#ffffff" style={styles.modalDescription}>
                {selectedIngredient.value}
              </MedievalText>
              <MedievalText fontSize={16} color="#ffff00" style={styles.modalAtribute}>
                EFECTOS:
              </MedievalText>
              <MedievalText fontSize={16} color="#ffffff" style={styles.modalDescription}>
                {selectedIngredient.effects.join(', ')}
              </MedievalText>
            </ImageBackground>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default IngredientSelector;

// Estilos (sin cambios, pero asegúrate de que sean consistentes)
const styles = StyleSheet.create({
  ingredientItemContainer: {
    width: 150,
    marginHorizontal: 5,
    height: 200,
    top: '-20%',
  },
  gradientBackground: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    height: '100%',
  },
  selectedItem: {
    borderWidth: 0,
    borderColor: '#cc9a52',
  },
  disabledItem: {
    opacity: 0.5,
  },
  ingredientImage: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginBottom: 10,
  },
  ingredientName: {
    // fontSize y color se manejan por el componente MedievalText
    textAlign: 'center',
  },
  ingredientDescription: {
    // fontSize y color se manejan por el componente MedievalText
    textAlign: 'center',
  },
  countBadge: {
    position: 'absolute',
    top: 20,
    right: 5,
    backgroundColor: '#ff6f61',
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    // fontSize y color se manejan por el componente MedievalText
  },
  createPotionButtonContainer: {
    position: 'absolute',
    bottom: 100, // Ajusta la posición según sea necesario
    alignSelf: 'center',
    width: 200,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPotionButton: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPotionButtonText: {
    // fontSize y color se manejan por el componente MedievalText
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '110%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalTitle: {
    // fontSize y color se manejan por el componente MedievalText
    marginBottom: 10,
  },
  modalDescription: {
    // fontSize y color se manejan por el componente MedievalText
    textAlign: 'center',
    maxWidth: 200,
    marginTop: 10,
  },
  modalAtribute: {
    // fontSize y color se manejan por el componente MedievalText
    marginTop: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 25,
    backgroundColor: '#ff6f61',
    borderRadius: 20,
    padding: 10,
  },
  modalCloseButtonText: {
    // fontSize y color se manejan por el componente MedievalText
  },
  decreaseButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#ff6f61',
    borderRadius: 15,
    padding: 5,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decreaseButtonText: {
    // fontSize y color se manejan por el componente MedievalText
  },
});
