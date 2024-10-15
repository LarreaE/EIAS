import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import EquipmentSlot from '../components/EquipmentSlot';

type Props = {
  user: any;
};

const EquipmentScreen: React.FC<Props> = ({user}) => {
    const player = user?.playerData || 'No player available';

    // Sample data for images (you can replace this with dynamic data)
    const elements = [
      { id: 1, url: `https://kaotika.vercel.app${player.equipment.weapon.image}` },
      { id: 2, url: `https://kaotika.vercel.app${player.equipment.artifact.image}` },
      { id: 3, url: `https://kaotika.vercel.app${player.equipment.healing_potion.image}` },
      { id: 4, url: `https://kaotika.vercel.app${player.equipment.helmet.image}` },
      { id: 5, url: `https://kaotika.vercel.app${player.equipment.armor.image}` },
      { id: 6, url: `https://kaotika.vercel.app${player.equipment.boot.image}` },
      { id: 7, url: `https://kaotika.vercel.app${player.equipment.antidote_potion.image}` },
      { id: 8, url: `https://kaotika.vercel.app${player.equipment.shield.image}` },
      { id: 9, url: `https://kaotika.vercel.app${player.equipment.ring.image}` },
      { id: 10, url: `https://kaotika.vercel.app${player.equipment.enhancer_potion.image}` },
    ];

    return (
        <View style={styles.container}>
            {/* Class - Top Left */}
            <View style={styles.classContainer}>
              <Text style={styles.text}>Class: {player.profile.name}</Text>
            </View>
            
            {/* Level - Top Right */}
            <View style={styles.levelContainer}>
              <Text style={styles.text}>Level: {player.level}</Text>
            </View>

            {/* Equipment columns */}
            <View style={styles.equipmentContainer}>
                <View style={styles.column}>
                  <EquipmentSlot imagePath={elements[0].url} size={70} />
                  <EquipmentSlot imagePath={elements[1].url} size={70}/>
                  <EquipmentSlot imagePath={elements[2].url} size={70}/>
                </View>

                <View style={styles.column}>
                  <EquipmentSlot imagePath={elements[3].url} size={70} />
                  <EquipmentSlot imagePath={elements[4].url} size={70}/>
                  <EquipmentSlot imagePath={elements[5].url} size={70}/>
                  <EquipmentSlot imagePath={elements[6].url} size={70}/>
                </View>

                <View style={styles.column}>
                  <EquipmentSlot imagePath={elements[7].url} size={70}/>
                  <EquipmentSlot imagePath={elements[8].url} size={70}/>
                  <EquipmentSlot imagePath={elements[9].url} size={70}/>
                </View>
            </View>

            {/* Exp - Bottom Left */}
            <View style={styles.expContainer}>
              <Text style={styles.text}>Exp: {player.experience}</Text>
            </View>

            {/* Gold - Bottom Right */}
            <View style={styles.goldContainer}>
              <Text style={styles.text}>Gold: {player.gold}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      position: 'relative', // Allows the use of absolute positioning for child components
    },
    // Class at top-left
    classContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    // Level at top-right
    levelContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    // Exp at bottom-left
    expContainer: {
      position: 'absolute',
      bottom: 10,
      left: 10,
    },
    // Gold at bottom-right
    goldContainer: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    text: {
      color: 'rgba(253, 224, 71, 0.7)',
    },
    equipmentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly', // Even space between columns
      alignItems: 'center',
      flex: 1, // Ensures the equipment columns take up the available space
      paddingTop: 50, // Adds space to avoid overlapping with top info
      paddingBottom: 50, // Adds space to avoid overlapping with bottom info
    },
    column: {
      flexDirection: 'column', // Stack elements vertically
      justifyContent: 'space-between', // Space between items vertically
      alignItems: 'center',
      marginHorizontal: 10,
    },
  });

export default EquipmentScreen;
