import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withSequence,
} from 'react-native-reanimated';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

const InverseAnimatedCircles: React.FC = () => {
  const angle = useSharedValue(0); // Ángulo inicial
  const flashOpacity = useSharedValue(1); // Opacidad del pantallazo blanco (inicia en 1)
  const imageOpacity = useSharedValue(1); // Opacidad de la imagen central (inicia en 1)
  const opacities = [
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
  ]; // Opacidad de cada imagen (inician visibles)

  const radius = Math.min(width, height) / 4;

  useEffect(() => {
    // Ocultar el pantallazo blanco al inicio
    flashOpacity.value = withTiming(0, { duration: 300, easing: Easing.linear });

    // Iniciar rotación rápida y desacelerar
    angle.value = withTiming(
      360 * 75, // Rotar 5 vueltas completas
      {
        duration: 5000, // Duración total de la rotación rápida
        easing: Easing.out(Easing.quad), // Desacelerar gradualmente
      }
    );

    // Desaparecer la imagen central antes de que termine la rotación
    imageOpacity.value = withDelay(
      4000, // Desaparece después de 1.5 segundos
      withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) })
    );

    // Opcional: Puedes hacer que los círculos también desaparezcan al final
    // Aquí mantenemos los círculos visibles
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
          source={require('../../assets/artefact1.webp')} // Cambia a la ruta de tu imagen
          style={[styles.image, animatedImageStyle(0, 0)]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../../assets/artefact2.webp')} // Cambia a la ruta de tu imagen
          style={[styles.image, animatedImageStyle(90, 1)]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../../assets/artefact3.webp')} // Cambia a la ruta de tu imagen
          style={[styles.image, animatedImageStyle(180, 2)]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../../assets/artefact4.webp')} // Cambia a la ruta de tu imagen
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
    width: width * 0.15, // Ajusta el tamaño según tus necesidades
    height: height * 0.15,
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

export default InverseAnimatedCircles;
