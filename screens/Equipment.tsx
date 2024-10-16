import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import EquipmentSlot from '../components/Slot';

type Props = {
  user: any;
};

const EquipmentScreen: React.FC<Props> = ({ user }) => {
    const player = user?.playerData || 'No player available';

    // Sample data for images (you can replace this with dynamic data)
    const elements = [
      { id: 1, url: player.equipment.weapon },
      { id: 2, url: player.equipment.artifact },
      { id: 3, url: player.equipment.healing_potion },
      { id: 4, url: player.equipment.helmet },
      { id: 5, url: player.equipment.armor },
      { id: 6, url: player.equipment.boot },
      { id: 7, url: player.equipment.antidote_potion },
      { id: 8, url: player.equipment.shield },
      { id: 9, url: player.equipment.ring },
      { id: 10, url: player.equipment.enhancer_potion },
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
                  <EquipmentSlot item={elements[0].url} size={70} />
                  <EquipmentSlot item={elements[1].url} size={70} />
                  <EquipmentSlot item={elements[2].url} size={70} />
                </View>
                <View style={styles.column}>
                  <EquipmentSlot item={elements[3].url} size={70} />
                  <EquipmentSlot item={elements[4].url} size={70} />
                  <EquipmentSlot item={elements[5].url} size={70} />
                  <EquipmentSlot item={elements[6].url} size={70} />
                </View>
                <View style={styles.column}>
                  <EquipmentSlot item={elements[7].url} size={70} />
                  <EquipmentSlot item={elements[8].url} size={70} />
                  <EquipmentSlot item={elements[9].url} size={70} />
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
