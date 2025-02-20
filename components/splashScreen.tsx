import React from 'react';
import {View, Text, StyleSheet,Image} from 'react-native';


const SplashScreen = (): React.JSX.Element => {
  return (
    <View style={styles.splashContainer}>
      <Image
        source={require('../assets/EIAS.webp')} // Ruta de la imagen
        style={styles.splashImage} // Aplicar estilos a la imagen
        resizeMode="contain" // Ajuste de la imagen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Ajusta el color del fondo según sea necesario
  },
  splashText: {
    fontSize: 24,
    
    color: '#000000',
  },
  splashImage: {
    width: 200,  // Ajusta el ancho según sea necesario
    height: 200, // Ajusta la altura según sea necesario
    marginBottom: 20, // Espaciado entre la imagen y el texto
  },
});

export default SplashScreen;
