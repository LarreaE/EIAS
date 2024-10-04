import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ImageBackground } from 'react-native';
import socket from '../sockets/socketConnection';

type Props = {
  user: any;  // Datos del usuario pasados como prop desde la pantalla principal
  setIsLoged: (value: boolean) => void;
};

const ProfileScreen: React.FC<Props> = ({ user, setIsLoged }) => {
  const role = user?.playerData.role || 'No name available';
  const userName = user?.playerData?.nickname || 'No name available';
  const userLvl = user?.playerData?.level || 'No level available';
  const charisma = user?.playerData?.attributes.charisma || 'No level available';
  const constitution = user?.playerData?.attributes.constitution || 'No level available';
  const insanity = user?.playerData?.attributes.insanity || 'No level available';
  const dexterity = user?.playerData?.attributes.dexterity || 'No level available';
  const strength = user?.playerData?.attributes.strength || 'No level available';
  const intelligence = user?.playerData?.attributes.intelligence || 'No level available';



  const signOut = () => {
    setIsLoged(false); // Cambiar el estado de inicio de sesión
    socket.disconnect();
  };

  return (
    <ImageBackground
      source={require('../assets/profile.png')}  // Ruta de la imagen de fondo
      style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
      resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
    >
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/boton.png')}  // Ruta de la imagen de fondo
        style={styles.signOutButton}  // Aplicar estilos al contenedor de la imagen de fondo
        resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
      >
        <TouchableOpacity  onPress={signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ImageBackground>
      <View  style={styles.attrContainer}>
        <Text style={styles.text}>{role}</Text>
        <Text style={styles.text}>User name:</Text>
        <Text style={styles.text}>{userName}</Text>
        <Text style={styles.text}>Level: {userLvl}</Text>

        <Text style={styles.attributeText}>Charisma: {charisma}</Text>
        <Text style={styles.attributeText}>Constitution: {constitution}</Text>
        <Text style={styles.attributeText}>Insanity: {insanity}</Text>
        <Text style={styles.attributeText}>Dexterity: {dexterity}</Text>
        <Text style={styles.attributeText}>Intelligence: {intelligence}</Text>
        <Text style={styles.attributeText}>Strength: {strength}</Text>
      </View>
    </View>
    </ImageBackground>
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
    position: 'absolute',
    top: 20,
    padding: 10,
    borderRadius: 5,
    width: 200,
    height: 100,
  },
  signOutText: {
    color: 'white',
    fontSize: 12,
  },
  attributeText: {
    fontSize: 16,          // Slightly smaller for attributes
    color: '#555',         // Darker gray for attributes
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
