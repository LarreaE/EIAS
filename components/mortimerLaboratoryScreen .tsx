import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList } from 'react-native';


// Define la interfaz para el tipo de datos de usuario
interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string
}
type Props = {};

const MortimerLaboratoryScreen: React.FC<Props> = (setIsLoged) => {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {

    // peticion a base de datos
    const addUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/mortimer');
        const data: User[] = await response.json(); // Define el tipo de datos esperados
        setUsers(data);
        console.log(users);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }

    };

    addUsers();
  }, []);


  return (
    <ImageBackground
      source={require('../assets/laboratory.png')}  // Ruta de la imagen de fondo
      style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
      resizeMode="cover"         // Ajuste de la imagen (puede ser 'cover', 'contain', etc.)
    >

      <View>

      </View>
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

export default MortimerLaboratoryScreen;
