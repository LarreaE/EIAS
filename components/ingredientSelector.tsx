import React, { useState, useRef, useContext } from 'react';
import {
  Animated,
  TouchableOpacity,
  Image,
  Text,
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

interface IngredientSelectorProps {
  onSelectionChange: (selectedIngredients: { [key: string]: number }) => void;
  createPotion: (selectedIngredients: { [key: string]: number }) => void;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({ onSelectionChange, createPotion }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<{ [key: string]: number }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ingredients } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
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
                <Text style={styles.decreaseButtonText}>-</Text>
              </TouchableOpacity>
            )}
            {selectedCount > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{selectedCount}</Text>
              </View>
            )}
            <Image source={LocalIngredientImage} style={styles.ingredientImage} />
            <Text style={styles.ingredientName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.ingredientDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
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
          onPress={() => { createPotion(selectedIngredients) }}
        >
          <ImageBackground
            source={createPotionButton}
            style={styles.createPotionButton}
            imageStyle={{ borderRadius: 10 }}
            resizeMode="stretch"
          >
            <Text style={styles.createPotionButtonText}>Crear Poción</Text>
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
                <Text style={styles.modalCloseButtonText}>X</Text>
              </TouchableOpacity>
              <Image
                source={selectedIngredient.image}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedIngredient.name}</Text>
              <Text style={styles.modalAtribute}>DESCRIPCIÓN:</Text>
              <Text style={styles.modalDescription}>
                {selectedIngredient.description}
              </Text>
              <Text style={styles.modalAtribute}>VALOR:</Text>
              <Text style={styles.modalDescription}>
                {selectedIngredient.value}
              </Text>
              <Text style={styles.modalAtribute}>EFECTOS:</Text>
              <Text style={styles.modalDescription}>
                {selectedIngredient.effects.join(', ')}
              </Text>
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  ingredientDescription: {
    fontSize: 12,
    color: 'white',
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
    color: 'white',
    fontWeight: 'bold',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    top:'0%',
  },
  modalDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    maxWidth: 200,
    marginTop: 10,
  },
  modalAtribute: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'yellow',
    textAlign: 'center',
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
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
