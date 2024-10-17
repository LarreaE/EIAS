import React, { useEffect, useState, useContext } from 'react';
import QRGenerator from './QrGenerator.tsx';
import { ImageBackground, Modal, StyleSheet, TouchableOpacity, View, Vibration, Text, ScrollView } from 'react-native';
import { clearServerEvents, listenToServerEventsScanAcolyte } from '../sockets/listenEvents.tsx';
import IngredientSelector from './ingredientSelector.tsx';
import { UserContext } from '../context/UserContext'; // Importa el contexto
// import boton back to map
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import MapButton from './MapButton.tsx';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js'; // Importa Icon para los filtros


type Props = { UserData: any };

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
  increase_hit_points: 'Increase Hit Points',
  decrease_hit_points: 'Decrease Hit Points',
  restore_strength: 'Restore Strength',
  restore_insanity: 'Restore Insanity',
  restore_constitution: 'Restore Constitution',
  restore_dexterity: 'Restore Dexterity',
  restore_hit_points: 'Restore Hit Points',
  restore_intelligence: 'Restore Intelligence',
  restore_charisma: 'Restore Charisma',
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
  calm: 'calm',
  frenzy:'frenzy',
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
  frenzy:'emoticon-angry',
};
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;


const AcolythLaboratoryScreen: React.FC<Props> = (UserData: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isInside, setIsInside] = useState(UserData.UserData.playerData.is_active);
  const { ingredients, setIngredients } = useContext(UserContext);
  const [allIngredients, setAllIngredients] = useState<Ingredients[]>([]);
  const [potions, setPotions] = useState<Ingredients[]>([]);
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
  }, [isInside]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
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
      }
    };
    fetchIngredients();
  }, [setIngredients]);

  useEffect(() => {
    const fetchPotions = async () => {
      try {
        console.log('Fetching potions...');
        const response = await fetch('https://eiasserver.onrender.com/potions');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success === true && Array.isArray(data.potionsData) && data.potionsData.length > 0) {
            setPotions(data.potionsData);
            console.log('Fetched potions:', data.potionsData[31]);
          } else {
            console.error('No potions found or status is not OK.');
          }
        } else {
          const text = await response.text();
          console.error('Response is not JSON:', text);
        }
      } catch (error) {
        console.error('Error getting potions:', error);
      }
    };
    fetchPotions();
  }, [setPotions]);

  useEffect(() => {
    listenToServerEventsScanAcolyte(setIsInside);

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
            setIsInside(data.is_active);
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
  }, [player.is_active, player.email]);

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

  // Función para aplicar los filtros
  const applyFilters = () => {
    if (selectedEffects.length === 0) {
      setIngredients(allIngredients); // Si no hay filtros, muestra todos
    } else {
      const filtered = allIngredients.filter(ingredient =>
        ingredient.effects.some(effect =>
          selectedEffects.some(selectedEffect =>
            effect.toLowerCase().includes(selectedEffect.toLowerCase()) // Coincidencia de substring, case-insensitive
          )
        )
      );
      setIngredients(filtered); // Actualiza el contexto con ingredientes filtrados
    }
    setFilterModalVisible(false); // Cierra el modal de filtros
  };

  const navigation = useNavigation<MapScreenNavigationProp>();

  const goToMap = () => {
    navigation.navigate('Map');
  };

  return (
    <View style={styles.container}>
      {isInside ? (
        <ImageBackground
          source={require('../assets/laboratory.png')}  // Ruta de la imagen
          style={styles.background}  // Aplicar estilos al contenedor
          resizeMode="cover"         // Ajuste de la imagen
        >

          {/* Selector de Ingredientes Filtrados */}
          <IngredientSelector onSelectionChange={undefined} />
          {/* Botón para mostrar el QR */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.qrButton}
          >
            <ImageBackground
              source={require('../assets/QR_icon.png')}  // Ruta de la imagen
              style={styles.openButton}  // Aplicar estilos al contenedor
              resizeMode="cover"         // Ajuste de la imagen
            >
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.buttonMap}>
            <MapButton
              onPress={goToMap}
              iconImage={require('../assets/map_icon.png')}
            />
          </View>

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


          {/* Modal para mostrar detalles del QR */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(true);
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
                  <Text style={styles.filterModalTitle}>Selecciona Efectos</Text>
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
                  ><ImageBackground
                  source={require('../assets/boton.png')}
                  resizeMode="stretch"
                   >
                    <Text style={styles.applyFiltersText}>Aplicar Filtros</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </Modal>
        </ImageBackground>
      ) : (
        <QRGenerator {...UserData}
          onCodeScanned={() => Vibration.vibrate(1 * vibrationDuration)} />
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
    top:10
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
    position: 'absolute',
    bottom: -70,
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
