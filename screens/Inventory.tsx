import React from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
import EquipmentSlot from '../components/EquipmentSlot';

type Props = {
  user: any;
};

const Inventory: React.FC<Props> = ({user}) => {
    const player = user?.playerData || 'No player available';
    const inventory = player.inventory;
    console.log(inventory);

    const slots = Array.from({length: 64});

    return (
    <View style={styles.container}>
      {slots.map(() => (
        <EquipmentSlot imagePath={ null } size={70} />
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
