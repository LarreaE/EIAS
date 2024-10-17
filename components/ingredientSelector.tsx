// IngredientSelector.js
import React, { useState, useRef, useContext } from 'react';
import {
  Animated,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  View,
  ImageBackground,
  Modal,
  Vibration,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { Ingredients } from '../interfaces/Ingredients';
import LocalIngredientImage from '../assets/EIAS.png';
import runaBackground from '../assets/runa.png';
import SelectedIngredientsDisplay from './selectedIngredientsDisplay'; // Asegúrate de que el nombre del archivo sea correcto

const IngredientSelector = ({ onSelectionChange }) => {
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ingredients } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredients | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const toggleSelection = (ingredient) => {
    setSelectedIngredients((prevSelectedIngredients) => {
      const totalSelections = Object.values(prevSelectedIngredients).reduce((a, b) => a + b, 0);
      const currentCount = prevSelectedIngredients[ingredient._id] || 0;

      if (totalSelections < 4) {
        const updatedSelection = {
          ...prevSelectedIngredients,
          [ingredient._id]: currentCount + 1,
        };
        if (onSelectionChange) {
          onSelectionChange(updatedSelection);
        }
        return updatedSelection;
      } else {
        Alert.alert('Limit reached', 'You can only select up to 4 ingredients in total.');
        return prevSelectedIngredients;
      }
    });
  };

  const decreaseSelection = (ingredientId) => {
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
        if (onSelectionChange) {
          onSelectionChange(updatedSelection);
        }
        return updatedSelection;
      } else {
        return prevSelectedIngredients;
      }
    });
  };

  const deselectIngredient = (ingredientId) => {
    decreaseSelection(ingredientId); // Reutilizamos decreaseSelection para deseleccionar
  };

  const renderIngredient = ({ item, index }) => {
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
            <Text style={styles.ingredientName}>{item.name}</Text>
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

      {/* Show the selected ingredients in circles */}
      <SelectedIngredientsDisplay
        selectedIngredients={selectedIngredients}
        ingredients={ingredients}
        onDeselection={deselectIngredient} // Pass the deselection function
      />

      {/* Modal to show ingredient details */}
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
              <Text style={styles.modalAtribute}>DESCRIPTION:</Text>
              <Text style={styles.modalDescription}>
                {selectedIngredient.description}
              </Text>
              <Text style={styles.modalAtribute}>VALUE:</Text>
              <Text style={styles.modalDescription}>
                {selectedIngredient.value}
              </Text>
              <Text style={styles.modalAtribute}>EFFECTS:</Text>
              <Text style={styles.modalDescription}>
                {selectedIngredient.effects}
              </Text>
            </ImageBackground>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default IngredientSelector;

const styles = StyleSheet.create({
  ingredientItemContainer: {
    width: 150,
    marginHorizontal: 5,
    height: 200,
    marginTop: -150,
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
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  decreaseButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: '#ff6f61',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  // Styles for the modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
    left: 20,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 30,
    right: 50,
  },
  modalCloseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalImage: {
    width: 120,
    height: 100,
    borderRadius: 75,
    marginBottom: 15,
    top: 30,
    right: 20,
  },
  modalTitle: {
    top: 10,
    right: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  modalDescription: {
    right: 20,
    top: 10,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    maxWidth: 150,
  },
  modalAtribute: {
    right: 20,
    top: 10,
    fontSize: 16,
    color: 'yellow',
    textAlign: 'center',
  },
});
