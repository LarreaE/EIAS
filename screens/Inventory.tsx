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
    

    return (
        <View style={styles.container}>
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

  export default Inventory