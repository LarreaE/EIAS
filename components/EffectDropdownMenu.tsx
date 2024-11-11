import React, { Dispatch, SetStateAction, useState } from 'react';
import { EFFECT_ICONS, EFFECT_LABELS } from './FilterModal';
import MedievalText from './MedievalText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get device dimensions

interface Props {
    availableEffects: string[],
    selectedEffects: any , //rare types
    toggleEffect: (effect: string) => void,
    setSelectedEffects: Dispatch<SetStateAction<string[]>>,
}

const EffectDropdownMenu: React.FC<Props> = ({ availableEffects, toggleEffect, selectedEffects, setSelectedEffects }) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // toggle
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // filter effects "Rare" and "Common"
  const rareEffects = availableEffects.filter(
    (effect) => effect === 'cleanse_parchment' || effect === 'unknown'
  );
  const commonEffects = availableEffects.filter(
    (effect) => effect !== 'cleanse_parchment' && effect !== 'unknown'
  );

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>Select Effect</Text>
        <Icon 
          name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="black" 
        />
      </TouchableOpacity>
      {isDropdownOpen && (
        <ScrollView style={styles.scrollView}>
          {/* Rare */}
          {rareEffects.length > 0 && (
            <>
              {rareEffects.length > 0 && (
              <>
                <Text style={styles.sectionHeader}>Rare</Text>

                <TouchableOpacity
                  style={styles.effectOption}
                  onPress={() => {
                    // check if all rare effects are selected
                    const allSelected = rareEffects.every(effect => selectedEffects.includes(effect));
                    if (allSelected) { // all are selected
                      //deselect all
                      setSelectedEffects(selectedEffects.filter((effect: any) => !rareEffects.includes(effect)));
                    } else { // not all selected
                      // sellect all rare effects
                      setSelectedEffects([...selectedEffects, ...rareEffects.filter(effect => !selectedEffects.includes(effect))]);
                    }
                  }}
                >
                  <View style={styles.checkbox}>
                    {rareEffects.every(effect => selectedEffects.includes(effect)) && <View style={styles.checkedBox} />}
                  </View>
                  <MedievalText fontSize={16} color="#ffffff" style={styles.effectText}>
                    Rare Effects
                  </MedievalText>
                </TouchableOpacity>
              </>
)}

            </>
          )}

          {/* Common */}
          {commonEffects.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>Common</Text>
              {commonEffects.map((effect) => (
                <TouchableOpacity
                  key={effect}
                  style={styles.effectOption}
                  onPress={() => toggleEffect(effect)}
                >
                  <View style={styles.checkbox}>
                    {selectedEffects.includes(effect) && <View style={styles.checkedBox} />}
                  </View>
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
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginVertical: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    maxHeight: height * 0.5, // Set max height 
    maxWidth: width * 0.85,
    backgroundColor: '#333', // Style as desired
    borderRadius: 20,
    marginTop: 5,
    alignContent: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    color: '#FFD700', // Gold color for rare items (adjust as needed)
    marginTop: 10,
    marginLeft: 10,
  },
  effectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 10,
  },
  checkedBox: {
    flex: 1,
    backgroundColor: '#fff',
  },
  effectIcon: {
    marginRight: 10,
  },
  effectText: {
    fontSize: 16,
  },
});

export default EffectDropdownMenu;
