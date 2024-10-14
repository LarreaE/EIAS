import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import EquipmentSlot from '../components/EquipmentSlot';

type Props = {
  user: any;
};


const ImageGrid: React.FC<Props> = ({user}) => {

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
    <ScrollView contentContainerStyle={styles.container}>
    {/* First Row (3 items) */}
    <View style={styles.column}>
      <EquipmentSlot imagePath={elements[0].url} size={70} />
      <EquipmentSlot imagePath={elements[1].url} size={70}/>
      <EquipmentSlot imagePath={elements[2].url} size={70}/>
    </View>

    {/* Second Row (4 EquipmentSlots, with element 4 centered) */}
    <View style={styles.secondRow}>
      <EquipmentSlot imagePath={elements[3].url} size={70} />
      <EquipmentSlot imagePath={elements[4].url} size={70}/>
      <EquipmentSlot imagePath={elements[5].url} size={70}/>
      <EquipmentSlot imagePath={elements[6].url} size={70}/>
    </View>

    {/* Third Row (3 EquipmentSlots, aligned like first row) */}
    <View style={styles.column}>
      <EquipmentSlot imagePath={elements[7].url} size={70}/>
      <EquipmentSlot imagePath={elements[8].url} size={70}/>
      <EquipmentSlot imagePath={elements[9].url} size={70}/>
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a202c',
    flexDirection: 'row', // Display columns side by side
    justifyContent: 'space-evenly', // Even spacing between columns
    paddingVertical: 20,
    flex: 1,
  },
  column: {
    flexDirection: 'column', // Stack elements vertically
    justifyContent: 'space-between', // Space between items
    alignItems: 'center', // Center each column
    marginHorizontal: 10, // Space between columns
  },
  secondRow: {
    justifyContent: 'space-between',
    padding: 0,
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

export default ImageGrid;
