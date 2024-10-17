// SelectedIngredientsDisplay.js
import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import LocalIngredientImage from '../assets/EIAS.png'; // Imagen de respaldo

const SelectedIngredientsDisplay = ({ selectedIngredients, ingredients, onDeselection }) => {
  return (
    <View style={styles.container}>
      {Object.keys(selectedIngredients).map((ingredientId) => {
        const ingredient = ingredients.find(item => item._id === ingredientId);
        console.log(ingredient);
        
        if (!ingredient) return null; // Asegurarse de que el ingrediente exista

        // Obtener el conteo del ingrediente seleccionado
        const count = selectedIngredients[ingredientId];

        // Renderizar un círculo por cada selección del ingrediente
        return Array.from({ length: count }).map((_, index) => (
          <TouchableOpacity key={`${ingredientId}-${index}`} style={styles.circle} onPress={() => onDeselection(ingredientId)}>
            <ImageBackground
                source={require('../assets/laboratory_icon.png')}  // Ruta de la imagen
                style={styles.background}  //Aplicar estilos al contenedor
                resizeMode="cover"         // Ajuste de la imagen
            >
                <Image 
                    source={LocalIngredientImage} 
                    style={styles.image} 
                />
            </ImageBackground>
          </TouchableOpacity>
        ));
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    top:200,
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    overflow: 'hidden',
    marginTop: -400,
    marginBottom: 300,
  },
  image: {
    width: 58,
    height: 58,
    borderRadius: 35,
  },
  background: {
    width: 90,
    height: 90,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
});

export default SelectedIngredientsDisplay;
