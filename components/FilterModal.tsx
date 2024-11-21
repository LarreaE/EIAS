import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground, Dimensions, Switch } from "react-native";
import { Curses } from "../interfaces/Curse";
import MedievalText from "./MedievalText";
import EffectArray from "../interfaces/EffectArray";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import EffectDropdownMenu from "./EffectDropdownMenu";
const { width, height } = Dimensions.get('window'); // Get device dimensions

// Definir los efectos disponibles categorizados
export const GOOD_EFFECTS = [
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
  
  export const BAD_EFFECTS = [
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
  
  export const EFFECT_LABELS: { [key: string]: string } = {
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
    rare: 'Rare',
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
  export const EFFECT_ICONS: { [key: string]: string } = {
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
    rare: 'star',
    damage_dexterity: 'human-white-cane',
    damage_constitution: 'flask',
    damage_charisma: 'chat-alert',
    damage_strength: 'axe-battle',
    damage_hit_points: 'bandage',
    damage_insanity: 'bottle-tonic-skull',
    damage_intelligence: 'flask-minus',
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

  interface Props {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    visible: boolean,
    availableEffects: string[],
    selectedEffects: string[],
    setSelectedEffect: Dispatch<SetStateAction<string[]>> ,
    applyFilters: () => void,
    toggleEffect: (effect: string) => void,
}

const FilterModal: React.FC<Props> = ({ visible, setVisible, availableEffects, selectedEffects, applyFilters, toggleEffect, setSelectedEffect }) => {
    const [filterByEffect, setFilterbyEffect] = useState<boolean>(false);


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              setVisible(false);
            }}
          >
            <View style={styles.filterModalOverlay}>
              {/* ImageBackground para el fondo del modal de filtros */}
              <ImageBackground
                source={require('../assets/runa.png')} // Ruta de la imagen de fondo para filtros
                style={styles.filterModalView} // Estilos para el contenedor del modal
                resizeMode="stretch" // Ajuste de la imagen
              >
                {filterByEffect ? (
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
                    <View style={styles.filterButtonContainer}>
                      <TouchableOpacity
                      style={styles.applyFiltersButton}
                      onPress={applyFilters}
                      >
                          <MedievalText fontSize={16} color="#ffffff" style={styles.applyFiltersText}>
                          Apply Filters
                          </MedievalText>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.applyFiltersButtoncontainer}>
                      <View style={styles.switchRow}>
                          <Text style={[styles.label, filterByEffect ? styles.inactiveText : styles.activeText]}>
                            Rarity
                          </Text>
                          <Switch
                            trackColor={{ false: '#767577', true: '#767577' }} // Customize track colors
                            thumbColor={filterByEffect ? '#f4f3f4' : '#f4f3f4'} // Customize thumb color
                            ios_backgroundColor="#3e3e3e" // Background color for iOS
                            onValueChange={() => {setFilterbyEffect(!filterByEffect)}} // Toggles the state
                            value={filterByEffect} // Sets the value of the switch
                          />
                          <Text style={[styles.label, filterByEffect ? styles.activeText : styles.inactiveText]}>
                            Effect
                          </Text>
                        </View>
                      </View>
                    </View>
                ) : (
                    <View style={styles.filterOverlay}>
                      <View style={styles.raritiesSelection}>
                        <MedievalText fontSize={20} color="#ffffff" style={styles.filterModalTitle}>
                          Select Rarity
                        </MedievalText>
                        <EffectDropdownMenu availableEffects={availableEffects} toggleEffect={toggleEffect} selectedEffects={selectedEffects} setSelectedEffects={setSelectedEffect}/>
                      </View>
                      <View style={styles.filterButtonContainer}>
                        <TouchableOpacity
                          style={styles.applyFiltersButton}
                          onPress={applyFilters}
                          >
                            <MedievalText fontSize={16} color="#ffffff" style={styles.applyFiltersText}>
                            Apply Filters
                            </MedievalText>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.applyFiltersButtoncontainer}>
                        <View style={styles.switchRow}>
                          <Text style={[styles.label, filterByEffect ? styles.inactiveText : styles.activeText]}>
                            Rarity
                          </Text>
                          <Switch
                            trackColor={{ false: '#767577', true: '#767577' }} // Customize track colors
                            thumbColor={filterByEffect ? '#f4f3f4' : '#f4f3f4'} // Customize thumb color
                            ios_backgroundColor="#3e3e3e" // Background color for iOS
                            onValueChange={() => {setFilterbyEffect(!filterByEffect)}} // Toggles the state
                            value={filterByEffect} // Sets the value of the switch
                          />
                          <Text style={[styles.label, filterByEffect ? styles.activeText : styles.inactiveText]}>
                            Effect
                          </Text>
                        </View>
                      </View>
                    </View>
                )}
              </ImageBackground>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    switchRow: {
      flexDirection: 'row', // Align items horizontally
      alignItems: 'center', // Center vertically
    },
    label: {
      fontSize: 18,
      marginHorizontal: 10, // Space between the text and the switch
    },
    activeText: {
      color: 'green', // Active text color
      fontWeight: 'bold',
    },
    inactiveText: {
      color: 'red', // Inactive text color
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
    filterButtonContainer: {
      padding: 0,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    filterButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      padding: 30,
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
      width: width*1.1,
      maxHeight: height*0.9,
      padding: 20,
    },
    scrollView: {
      height:300,
    },
    filterModalTitle: {
      padding: 30,
      fontSize: 36,
      textAlign: 'center',
    },
    effectOption: {
      top:10,
      left:70,
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
      alignItems: 'center',
      bottom:10,
    },
    applyFiltersButtoncontainer: {
      alignItems: 'center',
      bottom: 10,
      left: width * 0.2,
    },
    applyFiltersButton2: {
      padding: 0,
      alignItems: 'center',
    },
    applyFiltersText: {
      color: 'white',
      fontSize: 20,
      padding: 18,
      textAlign: 'center',
      width: width*0.4,
      backgroundColor: '#333',
      borderRadius: 30,
    },
    applyFiltersText2: {
      color: 'white',
      fontSize: 14,
      padding: 3,
      textAlign: 'center',
      backgroundColor: '#333',
      borderRadius: 30,
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
    filterOverlay: {
    },
    raritiesSelection: {
     
    },
  });

export default FilterModal;


