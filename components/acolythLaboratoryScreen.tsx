import React, { useEffect, useState, useContext, useCallback } from 'react';
import QRGenerator from './QrGenerator.tsx';
import { ImageBackground, Modal, StyleSheet, TouchableOpacity, View, Vibration, Text, ScrollView, Image } from 'react-native';
import { clearServerEvents, listenToServerEventsScanAcolyte } from '../sockets/listenEvents.tsx';
import IngredientSelector from './ingredientSelector.tsx';
import { UserContext } from '../context/UserContext'; // Importa el contexto
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

type Props = { UserData: any };

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

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
  'setback_constitution',
  'setback_strength',
  'setback_dexterity',
  'setback_intelligence',
  'setback_charisma',
  'frenzy',
];

const EFFECT_LABELS: { [key: string]: string } = {
  // ... tus etiquetas de efectos
};

const EFFECT_ICONS: { [key: string]: string } = {
  // ... tus iconos de efectos
};

const AcolythLaboratoryScreen: React.FC<Props> = (UserData: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { ingredients, setIngredients , potionVisible, setPotionVisible, setIsInsideLab, isInsideLab} = useContext(UserContext);
  const [allIngredients, setAllIngredients] = useState<Ingredients[]>([]);
  const [curses, setCurses] = useState<Curse[]>([]);
  const [ingredientsRetrieved, setIngredientsRetrieved] = useState(false);
  const [cursesRetrieved, setCursesRetrieved] = useState(false);
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
    const fetchIngredients = async () => {
      try {
        setIngredientsRetrieved(false);
        console.log('Fetching ingredients...');
        const response = await fetch('https://eiasserver.onrender.com/ingredients');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success === true && Array.isArray(data.ingredientsData) && data.ingredientsData.length > 0) {
            setAllIngredients(data.ingredientsData); // Almacenar en variable local
            setIngredients(data.ingredientsData); // Almacenar en contexto global
          } else {
            console.error('No ingredients found or status is not OK.');
          }
        } else {
          const text = await response.text();
          console.error('Response is not JSON:', text);
        }
      } catch (error) {
        console.error('Error getting ingredients:', error);
      } finally {
        setIngredientsRetrieved(true);
      }
    };
    fetchIngredients();
  }, [setIngredients]);

  useEffect(() => {
    const fetchCurses = async () => {
      try {
        setCursesRetrieved(false);
        console.log('Fetching curses...');
        const response = await fetch('https://eiasserver.onrender.com/potions');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success === true && Array.isArray(data.potionsData) && data.potionsData.length > 0) {
            setCurses(data.potionsData); // Almacenar en contexto global
          } else {
            console.error('No curses found or status is not OK.');
          }
        } else {
          const text = await response.text();
          console.error('Response is not JSON:', text);
        }
      } catch (error) {
        console.error('Error getting curses:', error);
      } finally {
        setCursesRetrieved(true);
      }
    };
    fetchCurses();
  }, [setCurses]);

  // useEffect(() => {
  //   if (ingredientsRetrieved && !potionCreated && allIngredients.length > 0 && curses.length > 0) {
  //     const processedIngredients = allIngredients.map(ingredient => Ingredient.from(ingredient));
  //     const processedCurses = curses.map(curse => Curse.from(curse));
  //     setIngredients(processedIngredients);
  //     setCurses(processedCurses);
  //     console.log('Ingredientes procesados:', processedIngredients);
  //     console.log('Maldiciones procesadas:', processedCurses);
  //   }
  // }, [ingredientsRetrieved, potionCreated, allIngredients, curses, setIngredients, setCurses]);


  useEffect(() => {
    listenToServerEventsScanAcolyte(setIsInsideLab);

    const updateIsInside = async () => {
      try {
        await fetch('https://eiasserver.onrender.com/isInside', {
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
                  <Text>Close</Text>
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
            <Text style={styles.effectText}>{potion.name}</Text>
            <Text style={styles.effectText}>Value: {potion.value}</Text>
            <Text style={styles.effectText}>Type: {potion.type}</Text>
            {'modifiers' in potion && (
              <>
               <Text style={styles.effectText}>Modifiers:</Text>
               <Text style={styles.effectText}>Hit Points:  {potion.modifiers?.hit_points}</Text>
               <Text style={styles.effectText}>Charisma:  {potion.modifiers?.charisma}</Text>
               <Text style={styles.effectText}>Constitution:  {potion.modifiers?.constitution}</Text>
               <Text style={styles.effectText}>Dexterity:  {potion.modifiers?.dexterity}</Text>
               <Text style={styles.effectText}>Insanity:  {potion.modifiers?.insanity}</Text>
               <Text style={styles.effectText}>Intelligence:  {potion.modifiers?.intelligence}</Text>
               <Text style={styles.effectText}>Strength:  {potion.modifiers?.strength}</Text>
              </>
            )}
            {'heal' in potion && (
            <Text style={styles.effectText}>Heal: {potion.heal}</Text>
            )}
            {'damage' in potion && (
            <Text style={styles.effectText}>Damage: {potion.damage}</Text>
            )}
              </>
          ) : <View style={styles.container}/>}
            </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setPotionVisible(false)}
                >
                  <Text>Close</Text>
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
                  <Text style={styles.filterModalTitle}>Select Effects</Text>
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
                        <Text style={styles.effectText}>{EFFECT_LABELS[effect] || effect}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.applyFiltersButton}
                    onPress={applyFilters}
                  >
                    <ImageBackground
                      source={require('../assets/boton.png')}
                      resizeMode="stretch"
                    >
                      <Text style={styles.applyFiltersText}>Apply Filters</Text>
                    </ImageBackground>
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
    top:10,
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
