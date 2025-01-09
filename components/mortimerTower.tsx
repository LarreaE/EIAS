import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import MedievalText from './MedievalText.tsx';
import Config from 'react-native-config';
import MapButton from './MapButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types.ts';
import { sendLocation } from '../sockets/emitEvents.tsx';
import { UserContext, UserContextType } from '../context/UserContext.tsx';
import { listenToServerEventsMortimer, clearServerEvents } from '../sockets/listenEvents.tsx';
import AcolythCardInHall from './acolyteCardHall.tsx';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TowerMortimer'>;

interface User {
  isbetrayer: boolean;
  _id: string;
  nickname: string;
  is_inside_tower: boolean;
  avatar: string;
}

const MortimerTower: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData } = context;

  const [usersInTower, setUsersInTower] = useState<User[]>([]);

  const goToMap = () => {
    sendLocation('Map', userData.playerData.email);
    navigation.navigate('Map');
  };

  useEffect(() => {
    // Escuchar eventos del servidor
    listenToServerEventsMortimer((users) => {
      const filteredUsers = users.filter((user) => user.is_inside_tower  && user.isbetrayer === false);
      setUsersInTower(filteredUsers);
    });

    // Obtener usuarios iniciales desde el servidor
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${Config.LOCAL_HOST}/api/players/mortimer`);
        const data = await response.json();
        const filteredUsers = data.filter((user: User) => user.is_inside_tower && user.isbetrayer === false);
        setUsersInTower(filteredUsers);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchUsers();

    // Limpiar eventos al desmontar el componente
    return () => {
      clearServerEvents();
    };
  }, []);

  const renderUsersInCircle = () => {
    const centerX = 200;
    const centerY = 200;
    const radius = 120;

    if (usersInTower.length === 1) {
      return (
        <View key={usersInTower[0]._id} style={styles.avatarContainer}>
          <AcolythCardInHall
            nickname={usersInTower[0].nickname}
            avatar={usersInTower[0].avatar}
          />
        </View>
      );
    }

    if (usersInTower.length === 2) {
      return usersInTower.map((user, index) => {
        const offset = 120;
        const x = index === 0 ? -offset : offset;

        return (
          <View
            key={user._id}
            style={[
              styles.avatarContainer,
              { transform: [{ translateX: x }, { translateY: 0 }] },
            ]}
          >
            <AcolythCardInHall nickname={user.nickname} avatar={user.avatar} />
          </View>
        );
      });
    }

    if (usersInTower.length === 3) {
      const trianglePoints = [
        { x: 0, y: -radius },
        { x: -radius * Math.cos(Math.PI / 6), y: radius * Math.sin(Math.PI / 6) },
        { x: radius * Math.cos(Math.PI / 6), y: radius * Math.sin(Math.PI / 6) },
      ];

      return usersInTower.map((user, index) => {
        const { x, y } = trianglePoints[index];
        return (
          <View
            key={user._id}
            style={[
              styles.avatarContainer,
              { transform: [{ translateX: x }, { translateY: y }] },
            ]}
          >
            <AcolythCardInHall nickname={user.nickname} avatar={user.avatar} />
          </View>
        );
      });
    }

    return usersInTower.map((user, index) => {
      const angle = (2 * Math.PI * index) / usersInTower.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return (
        <View
          key={user._id}
          style={[
            styles.avatarContainer,
            { transform: [{ translateX: x - centerX }, { translateY: y - centerY }] },
          ]}
        >
          <AcolythCardInHall nickname={user.nickname} avatar={user.avatar} />
        </View>
      );
    });
  };

  return (
    <ImageBackground
      source={require('../assets/mortimerTower.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.titleContainer}>
          <View style={styles.titleBackground} />
          <MedievalText style={styles.title}>The Tower</MedievalText>
      </View>

      <View style={styles.circleContainer}>{renderUsersInCircle()}</View>
      <MapButton
        onPress={goToMap}
        iconImage={require('../assets/map_icon.png')}
      />
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
    top: 110, // Ajusta según sea necesario
    alignItems: 'center',
    justifyContent: 'center', // Centra el contenido verticalmente
    height: 140, // Incrementa la altura para acomodar dos líneas
  },
  titleBackground: {
    position: 'absolute',
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    width: 240,
    height: 120,
    borderRadius: 10,
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    lineHeight: 40, // Asegura suficiente espacio entre líneas
  },
  
  circleContainer: {
    position: 'absolute',
    top: 300,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'absolute',
  },
});

export default MortimerTower;
