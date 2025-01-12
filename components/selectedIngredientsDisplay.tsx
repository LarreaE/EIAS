import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ingredients } from '../interfaces/Ingredients';
import MedievalText from './MedievalText';

interface Props {
  selectedIngredients: { [key: string]: number };
  ingredients: Ingredients[];
  onDeselection: (ingredientId: string) => void;
}

const SelectedIngredientsDisplay: React.FC<Props> = ({
  selectedIngredients,
  ingredients,
  onDeselection,
}) => {
  const hasSelectedIngredients = Object.keys(selectedIngredients).length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.ingredientsBox}>
        {hasSelectedIngredients ? (
          <View style={styles.ingredientsRow}>
            {Object.keys(selectedIngredients).map((ingredientId) => {
              const ingredient = ingredients.find((item) => item._id === ingredientId);
              if (!ingredient) return null;

              const count = selectedIngredients[ingredientId];

              return Array.from({ length: count }).map((_, index) => (
                <TouchableOpacity
                  key={`${ingredientId}-${index}`}
                  style={styles.circle}
                  onPress={() => onDeselection(ingredientId)}
                >
                  <ImageBackground
                    source={require('../assets/laboratory_icon.png')}
                    style={styles.background}
                    resizeMode="cover"
                  >
                    <Image
                      source={{ uri: `https://kaotika.vercel.app/${ingredient.image}` }}
                      style={styles.image}
                    />
                  </ImageBackground>
                </TouchableOpacity>
              ));
            })}
          </View>
        ) : (
          <MedievalText style={styles.placeholderText}>Select an Ingredient</MedievalText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientsBox: {
    width: '90%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cc9a52',
    padding: 15,
    alignItems: 'center',
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-start', // Los ingredientes se alinean a la izquierda
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  background: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  placeholderText: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SelectedIngredientsDisplay;