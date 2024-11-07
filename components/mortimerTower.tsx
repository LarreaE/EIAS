import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Dimensions } from 'react-native';
import AcolythCard from './acolythCard';
import { listenToServerEventsMortimer, clearServerEvents } from '../sockets/listenEvents.tsx';
import MedievalText from './MedievalText.tsx';
import Config from 'react-native-config';

const { width, height } = Dimensions.get('window');

const MortimerTower: React.FC = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Escuchar eventos del servidor y actualizar el estado de users
    listenToServerEventsMortimer(setUsers);

    // Petición a la base de datos para obtener los usuarios iniciales
    const addUsers = async () => {
      try {
        const response = await fetch(`${Config.PM2}/mortimer`);
        const data = await response.json();
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
      <View style={styles.users}>
        {/* mapear array users */}
        {users.map((user) => (
          <AcolythCard
            key={user._id}
            nickname={user.nickname}
            is_active={user.is_active}
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
  users: {
    top:50,
  },
});

export default MortimerTower;
