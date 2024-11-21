import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text } from "react-native";
import MedievalText from "./MedievalText";

interface Slot {
    item: any | null;
    size: number;
}

const EquipmentSlot: React.FC<Slot> = ({item , size}) => {

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <>
    <TouchableOpacity onPress={() => item && setIsModalVisible(true)}>
      <View style={[styles.container, { width: size, height: size }]}>
          {item ? (
            <Image
            source={{
                uri: `https://kaotika.vercel.app${item.image}`,
            }}  // Ruta de la imagen de fondo
            resizeMode="cover"
            style={styles.image}
            />
          ) : <View style={styles.container}/>}
        </View>
    </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={isModalVisible}
        style={styles.modalView}
      >
        <TouchableOpacity onPress={() => setIsModalVisible(false)}>
          <View style={styles.square}>
            <MedievalText style={styles.modalButton}>Close</MedievalText>
          </View>
        </TouchableOpacity>
        {item ? (
            <Image
            source={{
                uri: `https://kaotika.vercel.app${item.image}`,
            }}  // Ruta de la imagen de fondo
            resizeMode="cover"
            style={styles.image}
            />
          ) : <View style={styles.container}/>}
      </Modal>
    </>
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
    modalButton: {
      color: 'black',
      
      fontSize: 32,
    },
    modalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    square: {
      backgroundColor: 'yellow',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
  });

export default EquipmentSlot;
