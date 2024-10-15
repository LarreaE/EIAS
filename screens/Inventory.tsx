import React from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
import EquipmentSlot from '../components/EquipmentSlot';

type Props = {
  user: any;
};

const createInvetory = (inventory:any) => {
    let newInventory = [];
    for (const key in inventory) {
        for (let i = 0; i < inventory[key].length; i++) {
            newInventory.push(inventory[key][i]);
        }
    }
    return newInventory;
};

const Inventory: React.FC<Props> = ({user}) => {
    const player = user?.playerData || 'No player available';
    const inventory = player.inventory;
    console.log(inventory);
    const newInventory = createInvetory(inventory);
    const slots = Array.from({length: 88});
    slots.length -= newInventory.length;
    console.log(newInventory[0]);
    return (
    <View style={styles.container}>
        {newInventory.map((_,index) => (
        <EquipmentSlot item={ newInventory[index] } size={45} />
      ))}
      {slots.map(() => (
        <EquipmentSlot item={ null } size={45} />
      ))}
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap', // This will allow the slots to wrap to the next row
        justifyContent: 'center', // Center the equipment slots
        alignItems: 'center',
      },
  });

  export default Inventory;
