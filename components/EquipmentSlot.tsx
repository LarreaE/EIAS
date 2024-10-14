import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";

interface Slot {
    imagePath: String;
    size: number;
}

const EquipmentSlot: React.FC<Slot> = ({imagePath , size}) => {

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Image
            source={imagePath}  // Ruta de la imagen de fondo
            resizeMode="cover"
            style={styles.image}
            />
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
      borderWidth: 2,
      borderColor: 'yellow',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // Ensure the image doesn't overflow the border
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });

export default EquipmentSlot;
