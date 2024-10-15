import React from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
import EquipmentSlot from '../components/EquipmentSlot';

type Props = {
  user: any;
};

const StatsScreen: React.FC<Props> = ({user}) => {
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
            <Text>Stats</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#1a202c',
      flexDirection: 'row', // Display columns side by side
      justifyContent: 'space-evenly', // Even spacing between columns
      paddingVertical: 140,
      alignItems: 'center',
      flex: 1,
    },
    column: {
      flexDirection: 'column', // Stack elements vertically
      justifyContent: 'space-between', // Space between items
      alignItems: 'center', // Center each column
      marginHorizontal: 10, // Space between columns
      position: 'relative',
      backgroundColor: 'gray',
    },
    content: {
      width: '30%',
      backgroundColor: 'lightyellow',
      justifyContent: 'center',
      alignItems: 'center',
      height: '10%',
      position: 'relative',
    },
    text: {
      color: 'rgba(253, 224, 71, 0.7)',
    },
    item: {
      backgroundColor: 'lightblue',
      padding: 0,
      borderRadius: 10,
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  export default StatsScreen