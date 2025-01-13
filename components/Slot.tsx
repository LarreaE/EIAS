import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text, Dimensions, Animated } from "react-native";
import MedievalText from "./MedievalText";
import Item from "../interfaces/Item";
import { Ingredients } from "../interfaces/Ingredients";

interface Slot {
  item: Item | null | Ingredients;
  size: number;
}

const { width, height } = Dimensions.get("window");

const EquipmentSlot: React.FC<Slot> = ({ item, size }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Type guard to check if the item is an Ingredient
  const isIngredient = (item: Item | Ingredients): item is Ingredients => {
    return (item as Ingredients).qty !== undefined;
  };

  // Type guard to check if the item is an Item
  const isItem = (item: Item | Ingredients): item is Item => {
    return (item as Item).modifiers !== undefined;
  };

  return (
    <>
      <TouchableOpacity onPress={() => item && setIsModalVisible(true)}>
        <View
          style={[
            styles.container,
            { 
              width: size, 
              height: size, 
              borderColor: item && isItem(item) && item.isUnique ? "#FFD700" : "rgb(205, 168, 130)" // Gold for unique items, default for others
            }
          ]}
        >
          {item ? (
            <>
              <Image
                source={{
                  uri: `https://kaotika.vercel.app${item.image}`,
                }}
                resizeMode="cover"
                style={styles.image}
              />
              <View style={styles.nameContainer}>
              </View>
            </>
          ) : (
            <View style={styles.container} />
          )}
        </View>
      </TouchableOpacity>

      {item && (
        <Modal
          animationType="slide"
          visible={isModalVisible}
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {isItem(item) && item.isUnique && (
                <Animated.Image
                  source={require('../assets/animations/sparkle.gif')}
                  style={[styles.sparkle, { opacity: 0.6 }]}
                />
              )}
              <View style={styles.equipment}>
                {isItem(item) && item.isUnique ? (
                  <Image
                    source={{
                      uri: `https://kaotika.vercel.app${item.image}`,
                    }}
                    resizeMode="cover"
                    style={styles.uniqueModalImage}
                  />
                ) : (
                  <Image
                    source={{
                      uri: `https://kaotika.vercel.app${item.image}`,
                    }}
                    resizeMode="cover"
                    style={styles.modalImage}
                  />
                )}
                <MedievalText style={styles.modalTitle}>{item.name}</MedievalText>
                <MedievalText style={styles.modalDescription}>{item.description}</MedievalText>
                <View style={styles.statsContainer}>
                  {isItem(item) && item.modifiers && (
                    Object.entries(item.modifiers).map(([name, value]) => (
                      <View key={name} style={styles.stat}>
                        <MedievalText style={styles.statText}>
                          {name}: {value}
                        </MedievalText>
                      </View>
                    ))
                  )}
                  {isIngredient(item) && (
                    <View style={styles.stat}>
                      <MedievalText style={styles.statText}>
                        Quantity: {item.qty}
                      </MedievalText>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <MedievalText style={styles.modalButton}>Close</MedievalText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "#4a3820",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 8,
  },
  nameContainer: {
    position: "absolute",
    bottom: -25,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  sparkle: {
    position: "absolute",
    left: 0,
    alignItems: "center",
    width: width,
    height: height,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "#4a3820",
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
  },
  equipment: {
    alignItems: "center",
  },
  modalImage: {
    width: 120,
    height: 120,
    borderWidth: 4,
    borderColor: "#4a3820",
    borderRadius: 8,
    marginBottom: 10,
  },
  uniqueModalImage: {
    width: 120,
    height: 120,
    borderWidth: 4,
    borderColor: "#FFEA00",
    borderRadius: 8,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: "#d4af37",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  stat: {
    width: "48%",
    marginBottom: 10,
  },
  statText: {
    fontSize: 14,
    color: "#d4af37",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#4a3820",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    zIndex: 99,
  },
  modalButton: {
    fontSize: 16,
    color: "#d4af37",
  },
});

export default EquipmentSlot;
