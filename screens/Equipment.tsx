import React from 'react';
import { View, StyleSheet, Text, ImageBackground, Dimensions } from 'react-native';
import EquipmentSlot from '../components/Slot';

type Props = {
  user: any;
};
const { width, height } = Dimensions.get('window'); // Get device dimensions
const size = width * 0.25;
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
      <ImageBackground
      source={require('../assets/profile.png')}
      style={styles.background}
      resizeMode="cover"
    >
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
                  <EquipmentSlot item={elements[0].url} size={size} />
                  <EquipmentSlot item={elements[1].url} size={size} />
                  <EquipmentSlot item={elements[2].url} size={size} />
                </View>
                <View style={styles.column}>
                  <EquipmentSlot item={elements[3].url} size={size} />
                  <EquipmentSlot item={elements[4].url} size={size} />
                  <EquipmentSlot item={elements[5].url} size={size} />
                  <EquipmentSlot item={elements[6].url} size={size} />
                </View>
                <View style={styles.column}>
                  <EquipmentSlot item={elements[7].url} size={size} />
                  <EquipmentSlot item={elements[8].url} size={size} />
                  <EquipmentSlot item={elements[9].url} size={size} />
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
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      marginTop: height*0.13
    },
    classContainer: {
      position: 'absolute',
      top: height*0.02,
      left: width*0.02,
    },
    levelContainer: {
      position: 'absolute',
      top: height*0.02,
      right: width*0.02,
    },
    expContainer: {
      position: 'absolute',
      bottom: height*0.15,
      left: width * 0.02,
    },
    goldContainer: {
      position: 'absolute',
      bottom: height*0.15,
      right: width * 0.02,
    },
    cornerSquare: {
      backgroundColor: '#1a202c60',
      borderWidth: 2,
      borderColor: 'rgba(253, 224, 71, 1)',
      padding: width * 0.02,
      borderRadius: 5,
      minWidth: 100,
      alignItems: 'center',
    },
    text: {
      color: 'white',
      fontWeight: 'bold',
    },
    equipmentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flex: 1,
      paddingBottom: height * 0.09,
    },
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    column: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: width*0.03,
    },
  });

export default EquipmentScreen;
