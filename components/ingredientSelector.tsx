/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect, useCallback } from 'react';
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

// Import ingredient data and images
import { ingredients } from '../assets/fakeIngredients';
import LocalIngredientImage from '../assets/EIAS.png';
import runaBackground from '../assets/runa.png'; // Import runa.png

const IngredientSelector = ({ onSelectionChange }) => {
  // Main States
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // References
  const scrollX = useRef(new Animated.Value(0)).current;
  const pressTimer = useRef(null);

  // Dimensions
  const ITEM_WIDTH = 150;
  const ITEM_MARGIN = 5;
  const ITEM_SIZE = ITEM_WIDTH + ITEM_MARGIN * 2;
  const { width: WIDTH } = Dimensions.get('window');

  // Handle Press In: Disable FlatList scrolling and start a timer
  const handlePressIn = useCallback(() => {
    setScrollEnabled(false);
    pressTimer.current = setTimeout(() => {
    }, 1000);
  }, []);

  // Handle Press Out: Enable FlatList scrolling and clear the timer
  const handlePressOut = useCallback(() => {
    setScrollEnabled(true);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  // Cleanup the timer when component unmounts
  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);

  // Function to toggle ingredient selection
  const toggleSelection = useCallback(
    (ingredientId) => {
      setSelectedIngredients((prevSelectedIngredients) => {
        // Calculate the total number of selections
        const totalSelections = Object.values(prevSelectedIngredients).reduce(
          (a, b) => a + b,
          0
        );

        // Get the current count of the selected ingredient
        const currentCount = prevSelectedIngredients[ingredientId] || 0;

        if (totalSelections < 4) {
          // Increment the count of the selected ingredient
          const updatedSelection = {
            ...prevSelectedIngredients,
            [ingredientId]: currentCount + 1,
          };
          if (onSelectionChange) {
            onSelectionChange(updatedSelection);
          }
          return updatedSelection;
        } else {
          Alert.alert(
            'Limit Reached',
            'You can only select up to 4 ingredients in total.'
          );
          return prevSelectedIngredients;
        }
      });
    },
    [onSelectionChange]
  );

  // Function to decrease ingredient selection
  const decreaseSelection = useCallback(
    (ingredientId) => {
      setSelectedIngredients((prevSelectedIngredients) => {
        const currentCount = prevSelectedIngredients[ingredientId] || 0;
        if (currentCount > 0) {
          const updatedSelection = {
            ...prevSelectedIngredients,
            [ingredientId]: currentCount - 1,
          };
          // Remove the ingredient if the count reaches 0
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
    },
    [onSelectionChange]
  );

  // Function to render each ingredient item
  const renderIngredient = useCallback(
    ({ item, index }) => {
      const selectedCount = selectedIngredients[item.id] || 0;

      // Define input range for interpolation
      const inputRange = [
        (index - 1) * ITEM_SIZE,
        index * ITEM_SIZE,
        (index + 1) * ITEM_SIZE,
      ];

      // Interpolate translateY based on scrollX
      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [0, -50, 0],
        extrapolate: 'clamp',
      });

      // Interpolate opacity based on scrollX
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1, 0.8],
        extrapolate: 'clamp',
      });

      const isCentered = index === currentIndex;

      return (
        <TouchableOpacity
          onPressIn={handlePressIn} // Disable scroll on press
          onPressOut={handlePressOut} // Enable scroll on release
          onPress={() => toggleSelection(item.id)}
          onLongPress={() => {
            Vibration.vibrate(); // Vibrate the device
            setSelectedIngredient(item);
            setModalVisible(true);
          }}
          activeOpacity={isCentered ? 0.9 : 1}
          disabled={!isCentered}
          pressRetentionOffset={{ top: 40, left: 40, right: 40, bottom: 40 }} // Increase movement tolerance
          delayLongPress={300} // Adjust long press delay
        >
          <Animated.View
            style={[
              styles.ingredientItemContainer,
              { transform: [{ translateY }], opacity },
              !isCentered && styles.disabledItem,
            ]}
          >
            <ImageBackground
              source={runaBackground} // Use runa.png as background
              style={[
                styles.gradientBackground,
                selectedCount > 0 && styles.selectedItem,
              ]}
              imageStyle={{ borderRadius: 10 }}
            >
              {/* Button to decrease selection count */}
              {selectedCount > 0 && (
                <TouchableOpacity
                  style={styles.decreaseButton}
                  onPress={() => decreaseSelection(item.id)}
                >
                  <Text style={styles.decreaseButtonText}>-</Text>
                </TouchableOpacity>
              )}

              {/* Display count badge if count > 0 */}
              {selectedCount > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{selectedCount}</Text>
                </View>
              )}

              <Image
                source={LocalIngredientImage}
                style={styles.ingredientImage}
              />
              <Text style={styles.ingredientName}>{item.name}</Text>
              <Text style={styles.ingredientDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </ImageBackground>
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [selectedIngredients, ITEM_SIZE, scrollX, currentIndex, handlePressIn, handlePressOut, toggleSelection, decreaseSelection]
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        scrollEnabled={scrollEnabled}
        data={ingredients}
        keyExtractor={(item) => item.id.toString()} // Ensure unique and consistent keys
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

      {/* Modal to display ingredient details */}
      {selectedIngredient && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ImageBackground
              source={runaBackground} // Use runa.png as background
              style={styles.modalContent}
              imageStyle={{ borderRadius: 10 }}
            >
              {/* Close button */}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>X</Text>
              </TouchableOpacity>

              {/* Modal content */}
              <Image
                source={LocalIngredientImage}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedIngredient.name}</Text>
              <Text style={styles.modalDescription}>
                {selectedIngredient.description}
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
    justifyContent: 'center',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 350,
    height: 340,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
    left: 0,
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
    height: 120,
    borderRadius: 75,
    marginBottom: 15,
    top: 30,
  },
  modalTitle: {
    top: 30,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  modalDescription: {
    top: 30,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});
