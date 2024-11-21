// components/AcolythLaboratoryScreen.tsx

import React, { useEffect, useState, useContext, useCallback } from 'react';
import QRGenerator from './QrGenerator.tsx';
import {
  ImageBackground,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Vibration,
  Image,
  Dimensions,
} from 'react-native';
import { clearServerEvents, listenToServerEventsScanAcolyte } from '../sockets/listenEvents.tsx';
import IngredientSelector from './ingredientSelector.tsx';
import { UserContext, UserContextType } from '../context/UserContext'; // Importa el contexto
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import MapButton from './MapButton.tsx';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import Potion from './Potions/Potion.tsx';
import Ingredient from './Potions/Ingredient.tsx';
import Curse from './Potions/Curse.tsx';
import Essence from './Potions/Essence.tsx';
import { Ingredients } from '../interfaces/Ingredients.tsx';
import Antidote from './Potions/Antidote.tsx';
import Elixir from './Potions/Elixir.tsx';
import Poison from './Potions/Poison.tsx';
import Stench from './Potions/Stench.tsx';
import Venom from './Potions/Venom.tsx';
import Spinner from './Spinner.tsx';
import CookBookModal from './CookBookModal.tsx';
import MedievalText from './MedievalText'; // Importación del componente MedievalText
import Config from 'react-native-config';
import Cleanse from './Potions/Cleanse.tsx';
import ScrollModal from './ScrollModal.tsx';
import { sendLocation } from '../sockets/emitEvents.tsx';
import FilterModal from './FilterModal.tsx';
import { GOOD_EFFECTS, BAD_EFFECTS, EFFECT_ICONS, EFFECT_LABELS } from './FilterModal.tsx';

type Props = { UserData: any };

const { width, height } = Dimensions.get('window');

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LaboratoryAcolyth'>;


const AcolythLaboratoryScreen: React.FC<Props> = (UserData: any) => {
  const context = useContext(UserContext) as UserContextType;
  const { userData, ingredients, setIngredients , setAllIngredients, potionVisible, setPotionVisible, setIsInsideLab, isInsideLab, parchment, purifyIngredients, curses, allIngredients, setPlayer} = context;
  const [modalVisible, setModalVisible] = useState(false);
  const [ingredientsRetrieved, setIngredientsRetrieved] = useState(true);
  const [cursesRetrieved, setCursesRetrieved] = useState(true);
  const [potionCreated, setPotionCreated] = useState(false);
  const [potion, setPotion] = useState<Potion | Essence | Stench | Elixir | Venom | Antidote | Poison | Cleanse | undefined>();
  const [spinnerMessage, setSpinnerMessage] = useState('Preparing Ingredients...');
  const [cookBookModalVisible, setCookBookModalVisible] = useState(false);
  const [scrollModalVisible, setScrollModalVisible] = useState(false);

  const player = UserData.UserData.playerData;
  const vibrationDuration = 250;

  // Estado para los filtros
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

  // Obtener el rol del personaje
  const role = player.role; // Asegúrate de que 'role' está definido en player

  // Determinar los efectos disponibles según el rol
  const availableEffects = role === 'ACOLYTE' ? GOOD_EFFECTS : BAD_EFFECTS;
  useEffect(() => {
    setModalVisible(false);
  }, [isInsideLab]);

  useEffect(() => {
    console.log("POTION CREATED");
    
    if (potion?.type === 'Cleanse') {
      setScrollModalVisible(true);
    }
  }, [potion]);

  useEffect(() => {
    listenToServerEventsScanAcolyte(setIsInsideLab);

    const updateIsInside = async () => {
      try {
        await fetch(`${Config.RENDER}/api/players/isInside`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: player.email }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Server response:', data);
            setIsInsideLab(data.is_active);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } catch (error) {
        console.error('Caught error:', error);
      }
    };

    updateIsInside();
    return () => {
      clearServerEvents();
    };
  }, [player.is_active, player.email, setIsInsideLab]);

  // Usa useCallback para evitar re-renderizados innecesarios
   // Función para crear poción (Enfoque 1: Expandir el arreglo)
   const createPotion = useCallback((selectedIngredients: { [key: string]: number }) => {
    console.log('createPotion called with:', selectedIngredients);

    // Convertir el objeto a un array de ingredientes con cantidades individuales
    const potionIngredients = Object.keys(selectedIngredients).flatMap(id => {
      const ingredient = allIngredients.find(ing => ing._id === id);
      const quantity = selectedIngredients[id];
      if (ingredient) {
        // Crear un arreglo con múltiples instancias del ingrediente
        return Array(quantity).fill({ ...ingredient });
      }
      return [];
    });

    console.log('Selected Ingredients for Potion:', potionIngredients);

    try {
      const newpotion = Potion.create(potionIngredients, curses);
      console.log('Created Potion:', newpotion);
      setPotionCreated(true);
      setPotion(newpotion);
      setPotionVisible(true);
    } catch (error) {
      console.error('Error creating potion:', error);
    }
  }, [allIngredients, curses, setPotion, setPotionVisible]);


  // Función para manejar la selección de efectos
  const toggleEffect = (effect: string) => {
    setSelectedEffects(prevSelectedEffects => {
      if (prevSelectedEffects.includes(effect)) {
        // Si ya está seleccionado, lo elimina
        return prevSelectedEffects.filter(e => e !== effect);
      } else {
        // Si no está seleccionado, lo añade
        return [...prevSelectedEffects, effect];
      }
    });
  };

  const applyFilters = () => {
    if (selectedEffects.length === 0) {      
      // No se han seleccionado filtros, aplicar filtro por rol
      if (role === 'ACOLYTE') {
        // Filtrar ingredientes con efectos buenos
        const goodIngredients = allIngredients.filter(ingredient =>
          ingredient.effects.some(effect => GOOD_EFFECTS.includes(effect))
        );
        setIngredients(goodIngredients);
      } else if (role === 'VILLAIN') {
        // Filtrar ingredientes con efectos malos
        const badIngredients = allIngredients.filter(ingredient =>
          ingredient.effects.some(effect => BAD_EFFECTS.includes(effect))
        );
        setIngredients(badIngredients);
      } else {
        // En caso de que el rol no sea ni 'ACOLYTE' ni 'VILLAIN', mostrar todos los ingredientes
        setIngredients(allIngredients);
      }
    } else {
      // Se han seleccionado filtros, aplicar filtrado basado en los efectos seleccionados
      const filtered = allIngredients.filter(ingredient =>
        ingredient.effects.some(effect =>
          selectedEffects.some(selectedEffect =>
            effect.toLowerCase().includes(selectedEffect.toLowerCase()) // Coincidencia de substring, case-insensitive
          )
        )
      );
      setIngredients(filtered);
    }
    setFilterModalVisible(false); // Cierra el modal de filtros
  };

  const applyFiltersAtStart = (callback:any) => {
    useEffect(() => {
      callback();
    }, []); // limpia array dependendias
  };
  //execute the filter once
  applyFiltersAtStart(applyFilters);

  const navigation = useNavigation<MapScreenNavigationProp>();

  const goToMap = () => {
    sendLocation('School', userData.playerData.email);
    navigation.navigate('School');
  };

  const onSelectionChange = useCallback((selected: { [key: string]: number }) => {
    console.log('Selected Ingredients:', selected);
  }, []);

  return (
    <View style={styles.container}>
      {isInsideLab || userData.playerData.role === 'VILLAIN' ? (
        <ImageBackground
          source={require('../assets/laboratory.png')}  // Ruta de la imagen
          style={styles.background}  // Aplicar estilos al contenedor
          resizeMode="cover"         // Ajuste de la imagen
        >

          {!cursesRetrieved && !ingredientsRetrieved && <Spinner message={spinnerMessage} />}
          {/* Selector de Ingredientes Filtrados */}
          <IngredientSelector 
            onSelectionChange={onSelectionChange}  
            createPotion={createPotion} 
          />
          {/* Botón para mostrar el QR */}
          {userData.playerData.role === 'ACOLYTE' && (
            <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.qrButton}
            >
            <ImageBackground
              source={require('../assets/QR_icon.png')}  // Ruta de la imagen
              style={styles.openButton}  // Aplicar estilos al contenedor
              resizeMode="cover"         // Ajuste de la imagen
            />
            </TouchableOpacity>
          )}
          {userData.playerData.role === 'VILLAIN' && (
            <TouchableOpacity
            onPress={goToMap}
            style={styles.qrButton}
            >
            <ImageBackground
              source={require('../assets/school_icon.png')}  // Ruta de la imagen
              style={styles.openButton}  // Aplicar estilos al contenedor
              resizeMode="cover"         // Ajuste de la imagen
            />
            </TouchableOpacity>
          )}
          {/* Botón de Cookbook */}
          <TouchableOpacity
            style={styles.cookBookButton}
            onPress={() => setCookBookModalVisible(true)}
          >
            <ImageBackground
              source={require('../assets/informacion.png')} // Reemplaza esta ruta con la ubicación de tu imagen
              style={styles.filterImage} // Aplica un estilo para ajustar el tamaño de la imagen
            />
          </TouchableOpacity>

          {/* Botón de Filtros */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <ImageBackground
              source={require('../assets/filter_icon.png')} // Reemplaza esta ruta con la ubicación de tu imagen
              style={styles.filterImage} // Aplica un estilo para ajustar el tamaño de la imagen
            />
          </TouchableOpacity>
          <CookBookModal key={1} visible={cookBookModalVisible} setVisible={setCookBookModalVisible} curses={curses}/>
          <ScrollModal key={2} visible={scrollModalVisible} setVisible={setScrollModalVisible}/>

          {/* Modal para mostrar detalles del QR */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <QRGenerator {...UserData}
                  onCodeScanned={() => Vibration.vibrate(1 * vibrationDuration)} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Image
                    source={require('../assets/boton.png')} // Ruta al archivo de imagen
                    style={styles.buttonImage} // Estilo para la imagen del botón
                    resizeMode="contain" // Ajusta cómo se muestra la imagen
                  />
                  <MedievalText fontSize={16} color="#ffffff" style={styles.modalText}>
                    Close
                  </MedievalText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={potionVisible}
            onRequestClose={() => {
              setPotionVisible(false);
            }}
          >
            <View style={styles.centeredView}>
            {potion ? (
              <>
             <Image
                source={require('../assets/animations/potion.gif')} // Ruta al GIF en tus assets
                resizeMode="cover"
                style={styles.image}
              />
            <MedievalText style={styles.effectText}>{potion.name}</MedievalText>
            <MedievalText style={styles.effectText}>Value: {potion.value}</MedievalText>
            <MedievalText style={styles.effectText}>Type: {potion.type}</MedievalText>
            {'modifiers' in potion && (
              <>
              <MedievalText style={styles.effectText}>Modifiers:</MedievalText>
              {potion.modifiers?.hit_points != null && potion.modifiers.hit_points !== 0 && (
                <MedievalText style={styles.effectText}>
                  Hit Points: {potion.modifiers.hit_points}
                </MedievalText>
              )}

              {potion.modifiers?.charisma != null && potion.modifiers.charisma !== 0 && (
                <MedievalText style={styles.effectText}>
                  Charisma: {potion.modifiers.charisma}
                </MedievalText>
              )}

              {potion.modifiers?.constitution != null && potion.modifiers.constitution !== 0 && (
                <MedievalText style={styles.effectText}>
                  Constitution: {potion.modifiers.constitution}
                </MedievalText>
              )}

              {potion.modifiers?.dexterity != null && potion.modifiers.dexterity !== 0 && (
                <MedievalText style={styles.effectText}>
                  Dexterity: {potion.modifiers.dexterity}
                </MedievalText>
              )}

              {potion.modifiers?.insanity != null && potion.modifiers.insanity !== 0 && (
                <MedievalText style={styles.effectText}>
                  Insanity: {potion.modifiers.insanity}
                </MedievalText>
              )}

              {potion.modifiers?.intelligence != null && potion.modifiers.intelligence !== 0 && (
                <MedievalText style={styles.effectText}>
                  Intelligence: {potion.modifiers.intelligence}
                </MedievalText>
              )}

              {potion.modifiers?.strength != null && potion.modifiers.strength !== 0 && (
                <MedievalText style={styles.effectText}>
                  Strength: {potion.modifiers.strength}
                </MedievalText>
              )}
              </>
            )}
            {'heal' in potion && (
            <MedievalText style={styles.effectText}>Heal: {potion.heal}</MedievalText>
            )}
            {'damage' in potion && (
            <MedievalText style={styles.effectText}>Damage: {potion.damage}</MedievalText>
            )}
            {'duration' in potion && (
            <MedievalText style={styles.effectText}>Duration: {potion.duration}</MedievalText>
            )}
              </>
          ) : <View style={styles.container}/>}
            </View>
            <TouchableOpacity
              style={styles.closePotionButton}
              onPress={() => setPotionVisible(false)}
            >
              <View style={styles.buttonContent}>
                <Image
                  source={require('../assets/boton.png')} // Ruta al archivo de imagen
                  style={styles.potionbuttonImage} // Estilo para la imagen del botón
                  resizeMode="contain" // Ajusta cómo se muestra la imagen
                />
                <MedievalText fontSize={16} color="#ffffff" style={styles.potionbuttonText}>
                  Close
                </MedievalText>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Modal de Filtros */}
        <FilterModal  setVisible={setFilterModalVisible} visible={filterModalVisible} 
                      availableEffects={availableEffects} selectedEffects={selectedEffects} 
                      applyFilters={applyFilters} toggleEffect={toggleEffect} setSelectedEffect={setSelectedEffects}/>
        </ImageBackground>
      ) : (
        <>
        <QRGenerator {...UserData}
          onCodeScanned={() => Vibration.vibrate(1 * vibrationDuration)} />
          <View style={styles.buttonMap}>
          <MapButton
            onPress={goToMap}
            iconImage={require('../assets/school_icon.png')}
          />
        </View>
        </>
      )}
    </View>
  );
};

export default AcolythLaboratoryScreen;

// Estilos actualizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#e2d3b9',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    width: 66,
    height: 66,
    top: 5,
  },
  openButton: {
    padding: 10,
    borderRadius: 10,
    width: 66,
    height: 66,
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    height: 300,
    margin: 20,
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    bottom: height *0.18,
    fontSize: 28,
  },
  closeButton: {
    borderRadius: 10,
    width: width* 0.5,
    height: height * 0.1,
    top: height * 0.1,
  },
  closePotionButton: {
    borderRadius: 10,
    overflow: 'hidden',
    width: width,
    height: height * 0.2,
  },
  buttonContent: {
  },
  buttonImage: {
    bottom: height * 0.05,
    width: width* 0.5,
    height: height* 0.2,
  },
  potionbuttonImage: {
    bottom: height * 0.1,
    width: width,
    height: height* 0.4,
  },
  image: {
    width: '40%',
    height: '40%',
    color: 'black',
  },
  cookBookButton: {
    position: 'absolute',
    top: 50,
    left: 40,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Estilos para el botón de filtros
  filterButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  // Estilos para el modal de filtros
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalView: {
    width: '110%',
    maxHeight: '80%',
    padding: 20,
  },
  scrollView: {
    height:300,
  },
  filterModalTitle: {
    top:10,
    left:10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  effectOption: {
    top:10,
    left:40,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: 16,
    height: 16,
    backgroundColor: 'white',
  },
  effectIcon: {
    marginRight: 10,
  },
  effectText: {
    fontSize: 16,
    color: 'white',
  },
  applyFiltersButton: {
    padding: 10,
    marginTop: -10,
    alignItems: 'center',
  },
  applyFiltersText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    height:100,
    width: 180,
    top:36,
    left:42,
  },
  buttonMap: {
    position: 'relative',
    alignSelf: 'center',
    width: 66,
    height: 66,
    top:70,
  },
  filterImage: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: 66,
    height: 66,
    left:-30,
  },
  buttonText: {
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 30,
    bottom: height*0.16,
  },
  potionbuttonText: {
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 30,
    bottom: height*0.33,
  },
});
