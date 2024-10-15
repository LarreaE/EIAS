import React from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
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
        <View>
            <View style={styles.content}>
              <Text style={styles.text}>Class: {player.profile.name}      </Text>
              <Text style={styles.text}>Level: {player.level}</Text>
            </View>
              <View style={styles.column}>
              <EquipmentSlot imagePath={elements[0].url} size={70} />
              <EquipmentSlot imagePath={elements[3].url} size={70}/>
              <EquipmentSlot imagePath={elements[2].url} size={70}/>
            </View>

            <View style={styles.column}>
              <EquipmentSlot imagePath={elements[1].url} size={70} />
              <EquipmentSlot imagePath={elements[4].url} size={70}/>
              <EquipmentSlot imagePath={elements[8].url} size={70}/>
              <EquipmentSlot imagePath={elements[6].url} size={70}/>
            </View>

            <View style={styles.column}>
              <EquipmentSlot imagePath={elements[7].url} size={70}/>
              <EquipmentSlot imagePath={elements[5].url} size={70}/>
              <EquipmentSlot imagePath={elements[9].url} size={70}/>
            </View>
            <View style={styles.content}>
              <Text style={styles.text}>Exp: {player.experience}        </Text>
              <Text style={styles.text}>Gold: {player.gold}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#1a202c',
      justifyContent: 'space-evenly', // Even spacing between columns
      alignItems: 'center',
      flex: 1,
    },
    column: {
      flexDirection: 'row', // Stack elements vertically
      justifyContent: 'space-between', // Space between items
      alignItems: 'center', // Center each column
      margin: 15,
      marginHorizontal: 10, // Space between columns
      position: 'relative',
    },
    content: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      height: '18%',
      position: 'relative',
      display: 'flex',
      textAlign: 'left',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    text: {
      color: 'rgba(253, 224, 71, 0.7)',
    },
    item: {
      padding: 0,
      borderRadius: 10,
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  export default EquipmentScreen