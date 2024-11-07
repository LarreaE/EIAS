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
  ScrollView,
  Image,
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

type Props = { UserData: any };

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tower'>;

// Definir los efectos disponibles categorizados
const GOOD_EFFECTS = [
  'increase_hit_points',
  'restore_strength',
  'restore_insanity',
  'restore_constitution',
  'restore_dexterity',
  'restore_hit_points',
  'restore_intelligence',
  'restore_charisma',
  'cleanse_parchment',
  'unknown',
  'boost_constitution',
  'boost_strength',
  'boost_dexterity',
  'boost_intelligence',
  'boost_charisma',
  'calm',
];

const BAD_EFFECTS = [
  'decrease_hit_points',
  'damage_dexterity',
  'damage_constitution',
  'damage_charisma',
  'damage_strength',
  'damage_hit_points',
  'damage_insanity',
  'damage_intelligence',
  'cleanse_parchment',
  'unknown',
  'setback_constitution',
  'setback_strength',
  'setback_dexterity',
  'setback_intelligence',
  'setback_charisma',
  'frenzy',
];

const EFFECT_LABELS: { [key: string]: string } = {
  increase_hit_points: 'Increase Hit Points',
  decrease_hit_points: 'Decrease Hit Points',
  restore_strength: 'Restore Strength',
  restore_insanity: 'Restore Insanity',
  restore_constitution: 'Restore Constitution',
  restore_dexterity: 'Restore Dexterity',
  restore_hit_points: 'Restore Hit Points',
  restore_intelligence: 'Restore Intelligence',
  restore_charisma: 'Restore Charisma',
  cleanse_parchment: 'Cleanse Parchment',
  unknown:'Unknown',
  damage_dexterity: 'Damage Dexterity',
  damage_constitution: 'Damage Constitution',
  damage_charisma: 'Damage Charisma',
  damage_strength: 'Damage Strength',
  damage_hit_points: 'Damage Hit Points',
  damage_insanity: 'Damage Insanity',
  damage_intelligence: 'Damage Intelligence',
  boost_constitution: 'Boost Constitution',
  boost_strength: 'Boost Strength',
  boost_dexterity: 'Boost Dexterity',
  boost_intelligence: 'Boost Intelligence',
  boost_charisma: 'Boost Charisma',
  setback_constitution: 'Setback Constitution',
  setback_strength: 'Setback Strength',
  setback_dexterity: 'Setback Dexterity',
  setback_intelligence: 'Setback Intelligence',
  setback_charisma: 'Setback Charisma',
  calm: 'Calm',
  frenzy: 'Frenzy',
};

// Mapeo de efectos a iconos
const EFFECT_ICONS: { [key: string]: string } = {
  increase_hit_points: 'hand-heart',
  decrease_hit_points: 'heart',
  restore_strength: 'arm-flex',
  restore_insanity: 'head-heart',
  restore_constitution: 'human-child',
  restore_dexterity: 'feather',
  restore_hit_points: 'ambulance',
  restore_intelligence: 'brain',
  restore_charisma: 'message-star',
  cleanse_parchment: 'star',
  unknown: 'star',
  damage_dexterity: 'hand-paper',
  damage_constitution: 'flask',
  damage_charisma: 'user-secret',
  damage_strength: 'bolt',
  damage_hit_points: 'bolt',
  damage_insanity: 'bomb',
  damage_intelligence: 'question',
  boost_constitution: 'human-greeting',
  boost_strength: 'dumbbell',
  boost_dexterity: 'flash',
  boost_intelligence: 'account-plus',
  boost_charisma: 'message-star',
  setback_constitution: 'human-handsdown',
  setback_strength: 'arm-flex-outline',
  setback_dexterity: 'weight-kilogram',
  setback_intelligence: 'head-remove',
  setback_charisma: 'chat-minus',
  calm: 'sleep',
  frenzy: 'emoticon-angry',
};

const AcolythLaboratoryScreen: React.FC<Props> = (UserData: any) => {
  const context = useContext(UserContext) as UserContextType;
  const { ingredients, setIngredients , setAllIngredients, potionVisible, setPotionVisible, setIsInsideLab, isInsideLab, parchment, purifyIngredients, curses, allIngredients} = context;
  const [modalVisible, setModalVisible] = useState(false);
  const [ingredientsRetrieved, setIngredientsRetrieved] = useState(true);
  const [cursesRetrieved, setCursesRetrieved] = useState(true);
  const [potionCreated, setPotionCreated] = useState(false);
  const [potion, setPotion] = useState<Potion | Essence | Stench | Elixir | Venom | Antidote | Poison | undefined>();
  const [spinnerMessage, setSpinnerMessage] = useState('Preparing Ingredients...');
  const [cookBookModalVisible, setCookBookModalVisible] = useState(false);

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
    listenToServerEventsScanAcolyte(setIsInsideLab);

    const updateIsInside = async () => {
      try {
        await fetch(`${Config.RENDER}/isInside`, {
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

  const navigation = useNavigation<MapScreenNavigationProp>();

  const goToMap = () => {
    navigation.navigate('Map');
  };

  const onSelectionChange = useCallback((selected: { [key: string]: number }) => {
    console.log('Selected Ingredients:', selected);
  }, []);

  return (
    <View style={styles.container}>
      {isInsideLab ? (
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

          {/* Botón de Cookbook */}
          <TouchableOpacity
            style={styles.cookBookButton}
            onPress={() => setCookBookModalVisible(true)}
          >
            <ImageBackground
              source={require('../assets/filter_icon.png')} // Reemplaza esta ruta con la ubicación de tu imagen
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
            source={{
                uri: `https://kaotika.vercel.app/images/equipment/potions/healing/healing_3.png`,
            }}  // Ruta de la imagen de fondo
            resizeMode="cover"
            style={styles.image}
            />
            <MedievalText style={styles.effectText}>{potion.name}</MedievalText>
            <MedievalText style={styles.effectText}>Value: {potion.value}</MedievalText>
            <MedievalText style={styles.effectText}>Type: {potion.type}</MedievalText>
            {'modifiers' in potion && (
              <>
               <MedievalText style={styles.effectText}>Modifiers:</MedievalText>
               <MedievalText style={styles.effectText}>Hit Points:  {potion.modifiers?.hit_points}</MedievalText>
               <MedievalText style={styles.effectText}>Charisma:  {potion.modifiers?.charisma}</MedievalText>
               <MedievalText style={styles.effectText}>Constitution:  {potion.modifiers?.constitution}</MedievalText>
               <MedievalText style={styles.effectText}>Dexterity:  {potion.modifiers?.dexterity}</MedievalText>
               <MedievalText style={styles.effectText}>Insanity:  {potion.modifiers?.insanity}</MedievalText>
               <MedievalText style={styles.effectText}>Intelligence:  {potion.modifiers?.intelligence}</MedievalText>
               <MedievalText style={styles.effectText}>Strength:  {potion.modifiers?.strength}</MedievalText>
              </>
            )}
            {'heal' in potion && (
            <MedievalText style={styles.effectText}>Heal: {potion.heal}</MedievalText>
            )}
            {'damage' in potion && (
            <MedievalText style={styles.effectText}>Damage: {potion.damage}</MedievalText>
            )}
              </>
          ) : <View style={styles.container}/>}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPotionVisible(false)}
            >
              <MedievalText fontSize={16} color="#ffffff" style={styles.modalText}>
                Close
              </MedievalText>
            </TouchableOpacity>
          </Modal>

          {/* Modal de Filtros */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={filterModalVisible}
            onRequestClose={() => {
              setFilterModalVisible(false);
            }}
          >
            <View style={styles.filterModalOverlay}>
              {/* ImageBackground para el fondo del modal de filtros */}
              <ImageBackground
                source={require('../assets/runa.png')} // Ruta de la imagen de fondo para filtros
                style={styles.filterModalView} // Estilos para el contenedor del modal
                resizeMode="stretch" // Ajuste de la imagen
              >
                {/* Superposición para mejorar la legibilidad */}
                <View style={styles.filterOverlay}>
                  <MedievalText fontSize={20} color="#ffffff" style={styles.filterModalTitle}>
                    Select Effects
                  </MedievalText>
                  <ScrollView style={styles.scrollView}>
                    {availableEffects.map((effect) => (
                      <TouchableOpacity
                        key={effect}
                        style={styles.effectOption}
                        onPress={() => toggleEffect(effect)}
                      >
                        <View style={styles.checkbox}>
                          {selectedEffects.includes(effect) && <View style={styles.checkedBox} />}
                        </View>
                        {/* Mostrar el icono si está definido */}
                        {EFFECT_ICONS[effect] && (
                          <Icon
                            name={EFFECT_ICONS[effect]}
                            size={20}
                            color="black"
                            style={styles.effectIcon}
                          />
                        )}
                        <MedievalText fontSize={16} color="#ffffff" style={styles.effectText}>
                          {EFFECT_LABELS[effect] || effect}
                        </MedievalText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.applyFiltersButton}
                    onPress={applyFilters}
                  >
                    
                      <MedievalText fontSize={16} color="#ffffff" style={styles.applyFiltersText}>
                        Apply Filters
                      </MedievalText>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </Modal>
        </ImageBackground>
      ) : (
        <>
        <QRGenerator {...UserData}
          onCodeScanned={() => Vibration.vibrate(1 * vibrationDuration)} />
          <View style={styles.buttonMap}>
          <MapButton
            onPress={goToMap}
            iconImage={require('../assets/map_icon.png')}
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
    top: 10,
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
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
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
  },
  filterImage: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: 66,
    height: 66,
    left:-30,
  },
});
