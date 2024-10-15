import React, { useState } from 'react';
import { FlatList, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
// Importar datos de ingredientes
import { ingredients } from '../assets/fakeIngredients';

const IngredientSelector = ({ onSelectionChange }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const toggleSelection = (ingredientId) => {
    let updatedSelection = [];
    if (selectedIngredients.includes(ingredientId)) {
      // Remover ingrediente de la selección
      updatedSelection = selectedIngredients.filter((id) => id !== ingredientId);
    } else {
      // Agregar ingrediente a la selección
      updatedSelection = [...selectedIngredients, ingredientId];
    }
    setSelectedIngredients(updatedSelection);

    // Pasar la selección actualizada al componente padre si es necesario
    if (onSelectionChange) {
      onSelectionChange(updatedSelection);
    }
  };

  const renderIngredient = ({ item }) => {
    const isSelected = selectedIngredients.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.ingredientItem, isSelected && styles.selectedItem]}
        onPress={() => toggleSelection(item.id)}
      >
        <Image source={{ uri: item.image }} style={styles.ingredientImage} />
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={ingredients}
      keyExtractor={(item) => item.id}
      renderItem={renderIngredient}
      horizontal
      contentContainerStyle={{ paddingHorizontal: 10 }}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default IngredientSelector;

const styles = StyleSheet.create({
  ingredientItem: {
    width: 150,
    margin: 5,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  selectedItem: {
    backgroundColor: '#d0e8ff',
  },
  ingredientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  ingredientDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
