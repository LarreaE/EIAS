import React from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Image, ImageBackground, Dimensions } from 'react-native';
import EquipmentSlot from '../components/Slot';
import { ZoomInEasyDown } from 'react-native-reanimated';

type Props = {
  user: any;
};

const { width, height } = Dimensions.get('window'); // Get device dimensions
const size = width * 0.2;
const createInvetory = (inventory:any) => {
    let newInventory = [];
    for (const key in inventory) {
        for (let i = 0; i < inventory[key].length; i++) {
            newInventory.push(inventory[key][i]);
        }marginTop: 100
    }
    return newInventory;
};

const Inventory: React.FC<Props> = ({user}) => {
    const player = user?.playerData || 'No player available';
    const inventory = player.inventory;
    const newInventory = createInvetory(inventory);
    const slots = Array.from({length: 200});
    slots.length -= newInventory.length;
    return (
<ImageBackground
      source={require('../assets/profile.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollview}>
        <View style={styles.container}>
          {newInventory.map((_,index) => (
          <EquipmentSlot key={index} item={ newInventory[index] } size={size} />
        ))}
        {slots.map((_,index) => (
          <EquipmentSlot key={index} item={ null } size={size} />
        ))}
        </View>
      </ScrollView>
      </ImageBackground>

    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap', // This will allow the slots to wrap to the next row
        justifyContent: 'center', // Center the equipment slots
        alignItems: 'center',
        marginTop: 100,
      },
      scrollview: {
      },
      background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
  });

  export default Inventory;
