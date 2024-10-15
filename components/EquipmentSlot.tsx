import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface Slot {
    imagePath: String | null;
    size: number;
}

const EquipmentSlot: React.FC<Slot> = ({imagePath , size}) => {

  return (
        <View style={[styles.container, { width: size, height: size }]}>
          {imagePath ? (
            <Image
            source={{
                uri: imagePath,
            }}  // Ruta de la imagen de fondo
            resizeMode="cover"
            style={styles.image}
            />
          ) : <View style={styles.container}/>}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
      borderWidth: 2,
      borderColor: 'rgb(205, 168, 130)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // Ensure the image doesn't overflow the border

    },
    image: {
      width: '100%',
      height: '100%',
      color: 'black',
    },
  });

export default EquipmentSlot;
