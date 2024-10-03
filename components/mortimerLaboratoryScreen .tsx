import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList } from 'react-native';
import AcolythCard from './acolythCard';
import { listenToServerEventsMortimer, clearServerEvents } from '../sockets/listenEvents.tsx';

// define la interfaz para el tipo de datos de usuario
interface User {
  _id: string;
  name: string;
  is_active: boolean;
  avatar: string
}

// definir tipos de datos de props
type Props = {
  _id: string;
  name: string;
  is_active: boolean;
  avatar: string
};

const MortimerLaboratoryScreen: React.FC<Props> = () => {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Escuchar eventos del servidor y actualizar el estado de users
    listenToServerEventsMortimer(setUsers);

    // Petición a la base de datos para obtener los usuarios iniciales
    const addUsers = async () => {
      try {
        const response = await fetch('http://192.168.147.191:3000/mortimer');
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    addUsers();

    // Limpiar eventos cuando el componente se desmonte
    return () => {
      clearServerEvents();
    };
  }, []);

  return (
    <ImageBackground
      source={require('../assets/laboratory.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Text>
        {/* mapear array users */}
        {users.map((user) => (
          <AcolythCard
            key={user._id}
            name={user.name}
            is_active={user.is_active}
            avatar={user.avatar}
          />
        ))}
      </Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MortimerLaboratoryScreen;
