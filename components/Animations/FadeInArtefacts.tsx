import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');
interface FadeInArtefactsProps {
    onValidateSearch: () => void;
    onRestartSearch: () => void;
  }
const FadeInArtefacts: React.FC<FadeInArtefactsProps> = ({ onValidateSearch, onRestartSearch }) => {

  // Opacidades de las imágenes
  const opacities = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  // Estado para controlar la visibilidad del botón
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animar la aparición de las imágenes con fade-in
    opacities.forEach((opacity, index) => {
      opacity.value = withDelay(
        index * 500, // Retardo para aparición secuencial
        withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) }, () => {
          // Cuando la última animación termine, mostrar el botón
          if (index === opacities.length - 1) {
            runOnJS(setShowButton)(true);
          }
        })
      );
    });
  }, []);

  // Posiciones para las imágenes (2x2)
  const positions = [
    { top: height * 0.3, left: width * 0.1 }, // Superior izquierda
    { top: height * 0.3, left: width * 0.55 }, // Superior derecha
    { top: height * 0.6, left: width * 0.1 }, // Inferior izquierda
    { top: height * 0.6, left: width * 0.55 }, // Inferior derecha
  ];

  // Estilos animados para las imágenes
  const animatedImageStyle = (position: { top: number; left: number }, index: number) =>
    useAnimatedStyle(() => ({
      position: 'absolute',
      top: position.top,
      left: position.left,
      opacity: opacities[index].value,
      width: width * 0.4,
      height: height * 0.2,
    }));

  return (
    <View style={styles.container}>
      {/* Mostrar las imágenes solo si la animación no ha terminado */}
      <View style={styles.images}>
          <Animated.Image
            key={`image-1`}
            source={require(`../../assets/artefact1.png`)} // Reemplaza con tus rutas
            style={animatedImageStyle(positions[0], 0)}
            resizeMode="contain"
          />
          <Animated.Image
          key={`image-2`}
          source={require(`../../assets/artefact2.png`)} // Reemplaza con tus rutas
          style={animatedImageStyle(positions[1], 1)}
          resizeMode="contain"
          />
          <Animated.Image
          key={`image-3`}
          source={require(`../../assets/artefact3.png`)} // Reemplaza con tus rutas
          style={animatedImageStyle(positions[2], 2)}
          resizeMode="contain"
        />
        <Animated.Image
        key={`image-4`}
        source={require(`../../assets/artefact4.png`)} // Reemplaza con tus rutas
        style={animatedImageStyle(positions[3], 3)}
        resizeMode="contain"
        />
    </View>

      {/* Botón que aparece después del fade-in */}
      {showButton && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onValidateSearch}>
            <Text style={styles.buttonText}>Validate Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onRestartSearch}>
            <Text style={styles.buttonText}>Restart Search</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Ocupa toda la pantalla
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Encima de otros componentes
  },
  images: {
    // Ocupa toda la pantalla
    position: 'absolute',
    top: -10,
    left: 0,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    width: width * 0.35,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default FadeInArtefacts;