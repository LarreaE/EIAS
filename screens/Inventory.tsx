import React from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
import EquipmentSlot from '../components/EquipmentSlot';

type Props = {
  user: any;
};

const Inventory: React.FC<Props> = ({user}) => {
    const player = user?.playerData || 'No player available';


    return (
        <View>
            <Text>Inventory</Text>
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

  export default Inventory