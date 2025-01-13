import React, { useState, useRef, useContext, useEffect } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet, Dimensions, View, ImageBackground, Modal, Vibration, ToastAndroid } from 'react-native';
import { UserContext, UserContextType } from '../context/UserContext';
import { Ingredients } from '../interfaces/Ingredients';
import createPotionButton from '../assets/boton.png';
import SelectedIngredientsDisplay from './selectedIngredientsDisplay';
import MedievalText from './MedievalText';
import { stringifyEffect } from '../helper/Funtions';
import IngredientDetailModal from './IngredientDetailModal';

interface IngredientSelectorProps {
  onSelectionChange: (selectedIngredients: { [key: string]: number }) => void;
  createPotion: (selectedIngredients: { [key: string]: number }) => void;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({ onSelectionChange, createPotion }) => {
  const context = useContext(UserContext) as UserContextType;
  const [selectedIngredients, setSelectedIngredients] = useState<{ [key: string]: number }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { userData, setPotionVisible } = context;
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Create Potion');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredients | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const ingredients = userData.playerData.inventory.ingredients;
  //const ingredients = [{ "_id": "6702b39d76863c206a48cccb", "qty": "2", "description": "A sacred flower that boosts one's health noticeably.", "effects": ["increase_hit_points"], "image": "/images/ingredients/increase/increase_2.webp", "name": "Crimson Lotus", "type": "ingredient", "value": 110 }, { "_id": "6702b44f76863c206a48ccdc", "description": "A rare blood known for its ability to enhance strength tremendously.", "effects": ["restore_strength"], "image": "/images/ingredients/restore/restore_7.webp", "name": "Titan's Blood", "type": "ingredient", "value": 75 }, { "_id": "6702b44f76863c206a48ccdf", "description": "A soothing ointment that effectively restores hit points.", "effects": ["restore_hit_points"], "image": "/images/ingredients/restore/restore_10.webp", "name": "Healing Ointment", "type": "ingredient", "value": 65 }, { "_id": "6702b44f76863c206a48cce6", "description": "A bloom that invigorates the constitution and instills bravery.", "effects": ["restore_constitution"], "image": "/images/ingredients/restore/restore_17.webp", "name": "Courageous Bloom", "type": "ingredient", "value": 105 }, { "_id": "6702b44f76863c206a48ccd8", "description": "A thorny plant that boosts dexterity and agility in its users.", "effects": ["restore_dexterity"], "image": "/images/ingredients/restore/restore_3.webp", "name": "Swifthorn", "type": "ingredient", "value": 55 }, { "_id": "6702b44f76863c206a48ccd7", "description": "A golden liquid that enhances intelligence and sharpens the mind.", "effects": ["restore_intelligence"], "image": "/images/ingredients/restore/restore_2.webp", "name": "Wisdom's Nectar", "type": "ingredient", "value": 85 }, { "_id": "6702b44f76863c206a48cceb", "description": "A shimmering potion that boosts the charm of those who drink it.", "effects": ["restore_charisma"], "image": "/images/ingredients/restore/restore_22.webp", "name": "Elixir of Charisma", "type": "ingredient", "value": 85 }, { "_id": "6702b44f76863c206a48ccf0", "description": "A delicate flower that soothes the mind and restores sanity.", "effects": ["restore_insanity"], "image": "/images/ingredients/restore/restore_27.webp", "name": "Calm Blossom", "type": "ingredient", "value": 6 }, { "_id": "6702b4f876863c206a48cd1f", "description": "A crackling herb that boosts constitution.", "effects": ["boost_constitution"], "image": "/images/ingredients/boost/boost_12.webp", "name": "Willow Spark", "type": "ingredient", "value": 45 }, { "_id": "6702b4f876863c206a48cd24", "description": "A fiery petal that enhances strength when consumed.", "effects": ["boost_strength"], "image": "/images/ingredients/boost/boost_17.webp", "name": "Firepetal", "type": "ingredient", "value": 44 }, { "_id": "6702b4f876863c206a48cd21", "description": "A leaf that enhances strength with each thunderstorm.", "effects": ["boost_strength"], "image": "/images/ingredients/boost/boost_14.webp", "name": "Thunderleaf", "type": "ingredient", "value": 105 }, { "_id": "6702b4f876863c206a48cd23", "description": "A glowing bloom that enhances dexterity.", "effects": ["boost_dexterity"], "image": "/images/ingredients/boost/boost_16.webp", "name": "Amber Bloom", "type": "ingredient", "value": 50 }, { "_id": "6702b4f876863c206a48cd1d", "description": "A rare blossom that boosts intelligence when night falls.", "effects": ["boost_intelligence"], "image": "/images/ingredients/boost/boost_10.webp", "name": "Starfall Blossom", "type": "ingredient", "value": 68 }, { "_id": "6702b4f876863c206a48cd16", "description": "A golden root that enhances physical vitality.", "effects": ["boost_constitution"], "image": "/images/ingredients/boost/boost_3.webp", "name": "Golden Ginseng", "type": "ingredient", "value": 85 }, { "_id": "6702b4f876863c206a48cd26", "description": "A dewdrop that enhances charisma and inspires dreams.", "effects": ["boost_charisma"], "image": "/images/ingredients/boost/boost_19.webp", "name": "Dreamer's Dew", "type": "ingredient", "value": 72 }, { "_id": "6702b4f876863c206a48cd18", "description": "A magical vine that grants increased agility.", "effects": ["boost_dexterity"], "image": "/images/ingredients/boost/boost_5.webp", "name": "Elven Vine", "type": "ingredient", "value": 95 }, { "_id": "6702b4f876863c206a48cd1a", "description": "A spicy pepper that boosts constitution and endurance.", "effects": ["boost_constitution"], "image": "/images/ingredients/boost/boost_7.webp", "name": "Dwarven Pepper", "type": "ingredient", "value": 55 }, { "_id": "6702b56a76863c206a48cd44", "description": "A calming leaf that restores clarity and reduces madness.", "effects": ["calm"], "image": "/images/ingredients/calm/calm_2.webp", "name": "Tranquil Leaf", "type": "ingredient", "value": 78 }]


  const showToastWithGravityAndOffset = (message: string) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
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

      if (totalSelections < 4 && currentCount < ingredient.qty) {
        const updatedSelection = {
          ...prevSelectedIngredients,
          [ingredient._id]: currentCount + 1,
        };
        onSelectionChange(updatedSelection);
        return updatedSelection;
      } else if (currentCount >= ingredient.qty) {
        showToastWithGravityAndOffset('You cannot add more of this ingredient');
      } else {
        showToastWithGravityAndOffset('You have reached the maximum ingredients');
      }
      return prevSelectedIngredients;
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
      }
      return prevSelectedIngredients;
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
          <View
            style={[
              styles.ingredientCard,
              selectedCount > 0 && styles.selectedItem,
            ]}
          >
            {selectedCount > 0 && (
              <TouchableOpacity
                style={styles.decreaseButton}
                onPress={() => decreaseSelection(item._id)}
              >
                <MedievalText style={styles.decreaseButtonText}>-</MedievalText>
              </TouchableOpacity>
            )}
            {selectedCount > 0 && (
              <View style={styles.countBadge}>
                <MedievalText style={styles.countText}>{selectedCount}</MedievalText>
              </View>
            )}
            <Image
              source={{ uri: `https://kaotika.vercel.app/${item.image}` }}
              style={styles.ingredientImage}
            />
            <MedievalText style={styles.ingredientName}>{item.name}</MedievalText>
            <MedievalText style={styles.ingredientDescription}>
              {stringifyEffect(item.effects[0])}
            </MedievalText>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    checkIngredientsEffect();
  }, [ingredients]);

  const checkIngredientsEffect = () => {
    const allCleanse = ingredients.every((ingredient: Ingredients) => ingredient.effects[0] === 'cleanse_parchment');
    setButtonText(allCleanse ? 'Purification Potion' : 'Create Potion');
  };

  const ITEM_WIDTH = 160;
  const ITEM_MARGIN = 5;
  const ITEM_SIZE = ITEM_WIDTH + ITEM_MARGIN * 2;
  const { width: WIDTH } = Dimensions.get('window');
  const totalSelectedCount = Object.values(selectedIngredients).reduce((a, b) => a + b, 0);
  const hasAtLeastTwoSelected = totalSelectedCount >= 2;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {ingredients.length === 0 ? (
        <View style={{ alignItems: 'center', backgroundColor: "rgba(105,105,105,0.7)", padding: 10, borderRadius: 20, }}>
          <MedievalText fontSize={16} color="white" style={{ marginBottom: 20 }}>
            You don't have any ingredients available.
          </MedievalText>
          <MedievalText fontSize={16} color="white">
            Go to Kaotika web store to buy some ingredients.
          </MedievalText>
        </View>
      ) : (
        <>
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
          {hasAtLeastTwoSelected && (
            <TouchableOpacity
              style={styles.createPotionButtonContainer}
              onPress={() => {
                createPotion(selectedIngredients);
                setSelectedIngredients({});
                onSelectionChange({});
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
          <IngredientDetailModal visible={modalVisible} ingredient={selectedIngredient} onClose={() => setModalVisible(false)} />
        </>
      )}
    </View>
  );
};


export default IngredientSelector;
const styles = StyleSheet.create({
  ingredientItemContainer: {
    width: 150,
    marginHorizontal: 10,
    height: 200,
  },
  ingredientCard: {
    backgroundColor: '#2a2a2a', // Fondo oscuro
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cc9a52', // Borde amarillo cobre
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: '#ffcc33', // Borde más brillante cuando está seleccionado
  },
  disabledItem: {
    opacity: 0.5,
  },
  ingredientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  ingredientName: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  ingredientDescription: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  countBadge: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#cc9a52', // Borde dorado
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 14,
  },
  createPotionButtonContainer: {
    position: 'absolute',
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
    marginBottom: 10,
  },
  modalDescription: {
    textAlign: 'center',
    maxWidth: 200,
    marginTop: 10,
  },
  modalAtribute: {
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
  },
  decreaseButton: {
    position: 'absolute',
    top: -12,
    left: -12,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#cc9a52', // Borde dorado
    padding: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decreaseButtonText: {
    color: '#fff',
    fontSize: 18,
    bottom: 5,
  },
  
});
