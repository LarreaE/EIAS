import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import EquipmentSlot from '../components/EquipmentSlot';

// Sample data for images (you can replace this with dynamic data)
const elements = [
  { id: 1, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' },
  { id: 2, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' },
  { id: 3, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' },
  { id: 4, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' },
  { id: 5, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' },
  { id: 6, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' },
  { id: 7, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' },
  { id: 8, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' },
  { id: 9, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' },
  { id: 10, url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FPhotopea&psig=AOvVaw0GgTwt1ICk0JTxD_s4NW9u&ust=1728978591617000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODk2aexjYkDFQAAAAAdAAAAABAE' }
];

const ImageGrid: React.FC = () => {
  return (
    <View style={styles.container}>
    {/* First Row (3 items) */}
    <View style={styles.row}>
      <EquipmentSlot imagePath={elements[0].url} size={70} />
      <EquipmentSlot imagePath={elements[1].url} size={70}/>
      <EquipmentSlot imagePath={elements[2].url} size={70}/>
    </View>

    {/* Second Row (4 EquipmentSlots, with element 4 centered) */}
    <View style={[styles.row, styles.secondRow]}>
      <EquipmentSlot imagePath={elements[3].url} size={70} />
      <EquipmentSlot imagePath={elements[4].url} size={70}/>
      <EquipmentSlot imagePath={elements[5].url} size={70}/>
      <EquipmentSlot imagePath={elements[6].url} size={70}/>
    </View>

    {/* Third Row (3 EquipmentSlots, aligned like first row) */}
    <View style={styles.row}>
      <EquipmentSlot imagePath={elements[7].url} size={70}/>
      <EquipmentSlot imagePath={elements[8].url} size={70}/>
      <EquipmentSlot imagePath={elements[9].url} size={70}/>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around', // Space out rows equally
    alignItems: 'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between items
    width: '90%', // Adjust row width as needed
    marginVertical: 10, // Space between rows
  },
  secondRow: {
    justifyContent: 'space-evenly', // Space the items evenly in the second row
  },
  item: {
    backgroundColor: 'lightblue',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageGrid;
