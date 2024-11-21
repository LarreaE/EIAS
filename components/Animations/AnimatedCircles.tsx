import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

const AnimatedCircles: React.FC = () => {
  const angle = useSharedValue(0); // Ángulo inicial
  const opacities = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ]; // Opacidad de cada imagen
  const imageOpacity = useSharedValue(0); // Opacidad de la imagen central
  const flashOpacity = useSharedValue(0); // Opacidad del pantallazo blanco

  const radius = Math.min(width, height) / 4;

  useEffect(() => {
    // Aparición de las imágenes una por una
    opacities.forEach((opacity, index) => {
      opacity.value = withDelay(
        index * 1000, // Retardo para cada imagen
        withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) }) // Animación de aparición
      );
    });

    // Mostrar la imagen central después de 5 segundos
    imageOpacity.value = withDelay(
      5000, // Retardo de 5 segundos
      withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
    );

      // Comenzar la rotación después de que todos hayan aparecido
      const totalAppearTime = opacities.length * 1000 + 500;
      setTimeout(() => {
        // Animar el ángulo para simular la rotación y aceleración
        angle.value = withTiming(
          360 * 85, // Rotar 5 vueltas completas
          {
            duration: 10000, // Duración total de la animación
            easing: Easing.in(Easing.quad), // Acelerar gradualmente
          });

      // Mostrar el pantallazo blanco al final
      setTimeout(() => {
        flashOpacity.value = withTiming(1, { duration: 300, easing: Easing.linear });
      }, 5000);
    }, totalAppearTime);
  }, []);

  const animatedImageStyle = (initialAngle: number, opacityIndex: number) =>
    useAnimatedStyle(() => {
      const currentAngle = (angle.value % 360) + initialAngle;
      const angleInRadians = (Math.PI * currentAngle) / 180;

      return {
        transform: [
          {
            translateX: radius * Math.cos(angleInRadians),
          },
          {
            translateY: radius * Math.sin(angleInRadians),
          },
        ],
        opacity: opacities[opacityIndex].value,
      };
    });

  // Estilo animado para la imagen central
  const animatedCenterImageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  // Estilo animado para el pantallazo blanco
  const animatedFlashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        {/* Imagen central */}
        <Animated.Image
          source={require('../../assets/animations/thunders.gif')} // Cambia a la ruta de tu imagen central
          style={[styles.centerImage, animatedCenterImageStyle]}
          resizeMode="contain"
        />

        {/* Imágenes animadas en lugar de círculos */}
        <Animated.Image
          source={require('../../assets/artefact1.png')} // Cambia a la ruta de tu imagen
          style={[styles.image, animatedImageStyle(0, 0)]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../../assets/artefact2.png')} // Cambia a la ruta de tu imagen
          style={[styles.image, animatedImageStyle(90, 1)]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../../assets/artefact3.png')} // Cambia a la ruta de tu imagen
          style={[styles.image, animatedImageStyle(180, 2)]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../../assets/artefact4.png')} // Cambia a la ruta de tu imagen
          style={[styles.image, animatedImageStyle(270, 3)]}
          resizeMode="contain"
        />
      </View>

      {/* Pantallazo blanco */}
      <Animated.View style={[styles.flash, animatedFlashStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Asegurar que el componente ocupe toda la pantalla
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Asegurar que esté encima de otros componentes
  },
  center: {
    // Centro de las imágenes
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: 50, // Ajusta el tamaño según tus necesidades
    height: 50,
  },
  centerImage: {
    position: 'absolute',
    width: width * 0.5, // Ajusta el tamaño de la imagen central
    height: height * 0.5,
  },
  flash: {
    // Pantallazo blanco
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: '#FFFFFF', // Blanco puro
    zIndex: 1000, // Por encima de todo
  },
});

export default AnimatedCircles;