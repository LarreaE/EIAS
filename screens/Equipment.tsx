import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import EquipmentSlot from '../components/EquipmentSlot';

type Props = {
  user: any;
};

const EquipmentScreen: React.FC<Props> = ({ user }) => {
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
            <View style={styles.classContainer}>
              <View style={styles.cornerSquare}>
                <Text style={styles.text}>Class: {player.profile.name}</Text>
              </View>
            </View>
            <View style={styles.levelContainer}>
              <View style={styles.cornerSquare}>
                <Text style={styles.text}>Level: {player.level}</Text>
              </View>
            </View>
            <View style={styles.equipmentContainer}>
                <View style={styles.column}>
                  <EquipmentSlot imagePath={elements[0].url} size={70} />
                  <EquipmentSlot imagePath={elements[1].url} size={70} />
                  <EquipmentSlot imagePath={elements[2].url} size={70} />
                </View>
                <View style={styles.column}>
                  <EquipmentSlot imagePath={elements[3].url} size={70} />
                  <EquipmentSlot imagePath={elements[4].url} size={70} />
                  <EquipmentSlot imagePath={elements[5].url} size={70} />
                  <EquipmentSlot imagePath={elements[6].url} size={70} />
                </View>
                <View style={styles.column}>
                  <EquipmentSlot imagePath={elements[7].url} size={70} />
                  <EquipmentSlot imagePath={elements[8].url} size={70} />
                  <EquipmentSlot imagePath={elements[9].url} size={70} />
                </View>
            </View>
            <View style={styles.expContainer}>
              <View style={styles.cornerSquare}>
                <Text style={styles.text}>Exp: {player.experience}</Text>
              </View>
            </View>
            <View style={styles.goldContainer}>
              <View style={styles.cornerSquare}>
                <Text style={styles.text}>Gold: {player.gold}</Text>
              </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      position: 'relative', 
    },
    classContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    levelContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    expContainer: {
      position: 'absolute',
      bottom: 100,
      left: 10,
    },
    goldContainer: {
      position: 'absolute',
      bottom: 100,
      right: 10,
    },
    cornerSquare: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: 'rgba(253, 224, 71, 1)',
      padding: 10,
      borderRadius: 5,
      minWidth: 100,
      alignItems: 'center',
    },
    text: {
      color: 'black',
      fontWeight: 'bold',
    },
    equipmentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flex: 1,
      paddingTop: 50,
      paddingBottom: 50,
    },
    column: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 10,
    },
  });

export default EquipmentScreen;
