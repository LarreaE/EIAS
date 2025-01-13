import React, { useState, useRef, useContext, useEffect } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet, Dimensions, View, ImageBackground, Modal, Vibration, ToastAndroid } from 'react-native';
import { UserContext, UserContextType } from '../context/UserContext';
import { Ingredients } from '../interfaces/Ingredients';
import createPotionButton from '../assets/boton.png';
import SelectedIngredientsDisplay from './selectedIngredientsDisplay';
import MedievalText from './MedievalText';
import { stringifyEffect } from '../helper/Funtions';
import { clearServerEvents, listenToServerEventsMortimer } from '../sockets/listenEvents';
import { User } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import { FlatList } from 'react-native-gesture-handler';
import AcolythCard from './AcolythCard';

interface IngredientSelectorProps {
  onSelectionChange: (selectedIngredients: { [key: string]: number }) => void;
  createPotion: (selectedIngredients: { [key: string]: number }) => void;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({ onSelectionChange, createPotion }) => {
  const context = useContext(UserContext) as UserContextType;
  const [selectedIngredients, setSelectedIngredients] = useState<{ [key: string]: number }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { curses, userData, setPotionVisible } = context;
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Create Potion');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredients | null>(null);
  const [selectedCurse, setSelectedCurse] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAcolyte, setSelectedAcolyte] = useState<string | null>(null);

  const ingredients = userData.playerData.inventory.ingredients;

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

console.log(users);


  useEffect(() => {
    listenToServerEventsMortimer(setUsers);

    const addUsers = async () => {
      try {
        const response = await fetch(`${Config.RENDER}/api/players/mortimer`);
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    addUsers();

    return () => {
      clearServerEvents();
    };
  }, []);


  const applyCurse = async (curseName: string, acolyteNickName: string) => {
    console.log(`Applying curse: ${curseName} to acolyte: ${acolyteNickName}`);

    try {
      const response = await fetch(`${Config.RENDER}/api/players/applyCurse/${acolyteNickName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          curse: curseName,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Server response:', data); // Si la respuesta es exitosa, mostramos los datos del servidor
    } catch (error) {
      console.error('Error applying curse:', error); // En caso de error, mostramos el mensaje de error
    }
  };

  const filteredUsers = users.filter(
    user => 
      !user.isbetrayer ||
      user.role !== "MORTIMER" || 
      user.role !== "VILLAIN" || 
      user.role !== "ISTVAN"
  );
  
  

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
            <MedievalText fontSize={10} color="#ffffff" style={styles.ingredientDescription} numberOfLines={1}>
              {stringifyEffect(item.effects[0])}
            </MedievalText>
          </ImageBackground>
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

  const ITEM_WIDTH = 150;
  const ITEM_MARGIN = 5;
  const ITEM_SIZE = ITEM_WIDTH + ITEM_MARGIN * 2;
  const { width: WIDTH } = Dimensions.get('window');
  const totalSelectedCount = Object.values(selectedIngredients).reduce((a, b) => a + b, 0);
  const hasAtLeastTwoSelected = totalSelectedCount >= 2;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userData.playerData.role !== 'VILLAIN' ? (
        ingredients.length === 0 ? (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: 'rgba(105,105,105,0.7)',
              padding: 10,
              borderRadius: 20,
            }}
          >
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
          </>
        )
      ) : (
        curses.length === 0 ? (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: 'rgba(105,105,105,0.7)',
              padding: 10,
              borderRadius: 20,
            }}
          >
            <MedievalText fontSize={16} color="white" style={{ marginBottom: 20 }}>
              You don't have any curses available.
            </MedievalText>
            <MedievalText fontSize={16} color="white">
              Explore the world to collect more curses.
            </MedievalText>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MedievalText fontSize={18} color="#ffffff" style={{ marginBottom: 20 }}>
              Available Curses
            </MedievalText>
            <Animated.FlatList
              data={curses}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.curseItem}
                  onPress={() => {
                    setSelectedCurse(item); // Configura la maldición seleccionada
                  }}
                >
                  <View style={[styles.curseContent, { alignItems: 'center' }]}>
                    <MedievalText fontSize={26} color="#ffffff">
                      {item.name}
                    </MedievalText>
                    <View style={{ marginTop: 5, alignItems: 'center' }}>
                      <MedievalText fontSize={20} color="#ffffff">
                        Effects
                      </MedievalText>
                      {item.poison_effects.map((effect, index) => (
                        <MedievalText key={index} fontSize={14} color="#ffffff">
                          {effect.replace(/_/g, ' ')}
                        </MedievalText>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              horizontal
              contentContainerStyle={{
                alignItems: 'center',
                paddingHorizontal: (WIDTH - ITEM_SIZE) / 2,
              }}
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_SIZE}
              decelerationRate="fast"
              bounces={false}
            />
            {selectedCurse && (
              <TouchableOpacity
                style={styles.createPotionButtonContainer}
                onPress={() => setModalVisible(true)}
              >
                <ImageBackground
                  source={createPotionButton}
                  style={styles.createPotionButton}
                  imageStyle={{ borderRadius: 10 }}
                  resizeMode="stretch"
                >
                  <MedievalText fontSize={18} color="#ffffff" style={styles.createPotionButtonText}>
                    Apply Curse
                  </MedievalText>
                </ImageBackground>
              </TouchableOpacity>
            )}
          </View>
        )
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MedievalText fontSize={40} color="#000" style={styles.modalTopText}>
              Select 1 Acolyte
            </MedievalText>

            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <AcolythCard
                  key={item._id}
                  nickname={item.nickname}
                  is_active={item.is_active}
                  avatar={item.avatar}
                  disease={item.disease}
                  ethaziumCursed={item.ethaziumCursed}
                  onPress={() => setSelectedAcolyte(item._id)}
                />
              )}
            />

            <TouchableOpacity
              onPress={() => {
                const selectedAcolyteData = filteredUsers.find(user => user._id === selectedAcolyte);
                if (selectedAcolyteData) {

                  applyCurse(selectedCurse.name, selectedAcolyteData.nickname);
                  setModalVisible(false);
                } else {
                  showToastWithGravityAndOffset('Please select an acolyte');
                }
              }}
              style={styles.applyButton}
            >
              <ImageBackground
                source={createPotionButton}
                style={styles.createPotionButton}
                imageStyle={{ borderRadius: 10 }}
                resizeMode="stretch"
              >
                <MedievalText fontSize={18} color="#ffffff" style={styles.createPotionButtonText}>
                  Apply Curse
                </MedievalText>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <ImageBackground
                source={createPotionButton}
                style={styles.createPotionButton}
                imageStyle={{ borderRadius: 10 }}
                resizeMode="stretch"
              >
                <MedievalText fontSize={18} color="#ffffff" style={styles.createPotionButtonText}>
                  Close
                </MedievalText>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default IngredientSelector;
const styles = StyleSheet.create({
  modalTopText: {
    top: "-45%"
  },
  modalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: 'rgba(125,125,125,0.9)',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 100
  },
  closeButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: 200,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
  },
  applyButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: 200,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 120,
  },
  curseSection: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  curseTitle: {
    marginBottom: 10,
    textAlign: 'center',
  },
  curseItem: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderColor: 'gold',
    borderWidth: 3,
    width: 300,
    height: 160
  },
  curseContent: {
    alignItems: 'center',
  },
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
    textAlign: 'center',
  },
  ingredientDescription: {
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
  },
  createPotionButtonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: 200,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 100,
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
  },
});
