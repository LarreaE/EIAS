import React from 'react';
import {StyleSheet, ImageBackground } from 'react-native';

type Props = {};

const AcolythLaboratoryScreen: React.FC<Props> = () => {
  return (
    <ImageBackground
      source={require('../assets/laboratory_dor.png')}  // Ruta de la imagen de fondo
      style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
      resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
    >
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Hace que la imagen de fondo ocupe todo el espacio disponible
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',     // Centra el contenido horizontalmente
  },
});

export default AcolythLaboratoryScreen;
