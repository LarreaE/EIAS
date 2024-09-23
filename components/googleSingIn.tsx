import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  setIsLoged: React.Dispatch<React.SetStateAction<boolean>>;
}

const GoogleSignInComponent: React.FC<Props> = ({ setIsLoged }) => {
  const signIn = async () => {
    try {
      // Lógica de inicio de sesión
      setIsLoged(true); // Actualiza el estado de autenticación
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
      <TouchableOpacity onPress={signIn}>
        <Text style={styles.text}>Sing in with google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,                       // Ocupar todo el espacio disponible
    justifyContent: 'center',       // Centrar verticalmente
    alignItems: 'center',           // Centrar horizontalmente
    backgroundColor: '#f0f0f0',     // Fondo claro (opcional para contraste)
  },
  container: {
    backgroundColor: 'blue',        // Fondo azul
    width: 200,                     // Ancho de 300 unidades
    height: 100,                    // Alto de 400 unidades
    justifyContent: 'center',       // Centrar contenido verticalmente
    alignItems: 'center',           // Centrar contenido horizontalmente
    borderRadius: 20,               // Esquinas redondeadas
  },
  text: {
    color: 'white',                 // Texto en color blanco
    fontSize: 18,                   // Tamaño de fuente
  },
});

export default GoogleSignInComponent;
