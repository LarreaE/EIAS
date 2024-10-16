import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ImageBackground } from 'react-native';
import socket from '../sockets/socketConnection';

type Props = {
  user: any;  // Datos del usuario pasados como prop desde la pantalla principal
  setIsLoged: (value: boolean) => void;
};

const ProfileScreen: React.FC<Props> = ({ user, setIsLoged }) => {

  const signOut = () => {
    setIsLoged(false); // Cambiar el estado de inicio de sesión
    socket.disconnect();
  };

  return (
    <View style={styles.container}>
      
        <TouchableOpacity  onPress={signOut}>
        <ImageBackground
        source={require('../assets/boton.png')}  // Ruta de la imagen de fondo
        style={styles.signOutButton}  // Aplicar estilos al contenedor de la imagen de fondo
        resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
      >
            <Text style={styles.signOutText}>Sign Out</Text>
          </ImageBackground>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,                    // Ocupa todo el espacio disponible
    width: '100%',               // Asegura que la imagen de fondo ocupe el 100% del ancho
    height: '100%',              // Asegura que la imagen de fondo ocupe el 100% del alto
    justifyContent: 'center',    // Centra el contenido en la pantalla
    alignItems: 'center',        // Centra el contenido horizontalmente
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',  // Elimina cualquier fondo de color
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
  signOutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: -40,
    padding: 10,
    borderRadius: 5,
    width: 200,
    height: 100,
    marginBottom: '160%'
  },
  signOutText: {
    color: 'white',
    fontSize: 22,
  },
  attributeText: {
    fontSize: 16,          // Slightly smaller for attributes
    color: 'white',         // Darker gray for attributes
    fontStyle: 'italic',   // Adds emphasis
    marginVertical: 4,     // Space between each attribute
  },
  attrContainer: {
    backgroundColor: 'rgba(100, 155, 150, 0.8)',  // White with 80% opacity
    borderRadius: 10,
    padding: 20,  // Padding for content inside the container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ProfileScreen;
