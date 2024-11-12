import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import AcolythCardTower from './acolythCardTower.tsx';
import { listenToServerEventsMortimer, clearServerEvents } from '../sockets/listenEvents.tsx';
import MedievalText from './MedievalText.tsx';
import Config from 'react-native-config';

interface User {
  _id: string;
  nickname: string;
  is_inside_tower: boolean;
  avatar: string
}

// definir tipos de datos de props

const MortimerTower: React.FC = () => {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Escuchar eventos del servidor y actualizar el estado de users
    listenToServerEventsMortimer(setUsers);

    // Petición a la base de datos para obtener los usuarios iniciales
    const addUsers = async () => {
      try {
        const response = await fetch(`${Config.RENDER}/mortimer`);
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
      source={require('../assets/mortimerTower.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.titleContainer}>
        <View style={styles.titleBackground} />
        <MedievalText style={styles.title}>
          The Tower
        </MedievalText>
      </View>
      <View style={styles.users}>
        {users.map((user) => (
          <AcolythCardTower
            key={user._id}
            nickname={user.nickname}
            is_inside_tower={user.is_inside_tower}
            avatar={user.avatar}
          />
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 130,
    alignItems: 'center',
  },
  titleBackground: {
    position: 'absolute',
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    width: 220,
    height: 60,
    borderRadius: 10,
  },
  title: {
    fontSize: 35,
    paddingHorizontal: 10,
    paddingVertical: 25,  // Añade padding vertical para evitar el corte
    textAlign: 'center',
  },
  users: {
    top: 250,
  },
});
export default MortimerTower;
