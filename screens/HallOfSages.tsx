import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import AcolythCardInHall from '../components/acolyteCardHall.tsx';
import MedievalText from '../components/MedievalText.tsx';
import MapButton from '../components/MapButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, StackNavigationProp } from '../types/types.ts';
import { sendIsInHall } from '../sockets/emitEvents.tsx';
import { UserContext, UserContextType } from '../context/UserContext.tsx';
import { sendLocation } from '../sockets/emitEvents.tsx';
import { useState } from 'react';
import { listenToServerEvents } from '../sockets/listenEvents.tsx';
import socket from '../sockets/socketConnection.tsx';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HallOfSages'>;

interface User {
  _id: string;
  nickname: string;
  avatar: string;
  email: string;
  role: string;  // Aquí añadimos el rol del usuario
}

const HallOfSages: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData } = context;
  const [usersInHall, setUsersInHall] = useState<User[]>([]);

  if (!userData || !userData.playerData || !userData.playerData.avatar || !userData.playerData.nickname) {
    return <Text>Cargando...</Text>;
  }

  const currentUser: User = {
    _id: userData.playerData._id,
    nickname: userData.playerData.nickname,
    avatar: userData.playerData.avatar,
    email: userData.playerData.email,
    role: userData.playerData.role, // Asumiendo que el rol está en playerData
  };

  const goToMap = () => {
    sendLocation('School', userData.playerData.email);
    sendIsInHall(currentUser.email, false);
    navigation.navigate('School');
    socket.off('send_users_in_hall');
  };

  useEffect(() => {
    sendIsInHall(currentUser.email, true);
  }, []);

  useEffect(() => {
    const handleUsersInHall = (users: User[]) => {
      console.log('Datos recibidos en send_users_in_hall:', users);
      setUsersInHall(users);
    };
  
    socket.on('send_users_in_hall', handleUsersInHall);
  }, []);
  
  const filteredUsers = currentUser.role === 'ACOLYTE'
    ? usersInHall.filter(user => user.role !== 'VILLAIN')
    : usersInHall;
  

  const renderUsersInCircle = () => {
    const centerX = 200; 
    const centerY = 200;
    const radius = 120;

    if (filteredUsers.length === 1) {
      return (
        <View key={filteredUsers[0]._id} style={styles.avatarContainer}>
          <AcolythCardInHall 
            nickname={filteredUsers[0].nickname} 
            avatar={filteredUsers[0].avatar} 
          />
        </View>
      );
    }

    if (filteredUsers.length === 2) {
      return filteredUsers.map((user, index) => {
        const offset = 60;
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

    if (filteredUsers.length === 3) {
      const trianglePoints = [
        { x: 0, y: -radius },
        { x: -radius * Math.cos(Math.PI / 6), y: radius * Math.sin(Math.PI / 6) },
        { x: radius * Math.cos(Math.PI / 6), y: radius * Math.sin(Math.PI / 6) },
      ];

      return filteredUsers.map((user, index) => {
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

    return filteredUsers.map((user, index) => {
      const angle = (2 * Math.PI * index) / filteredUsers.length;
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
      source={require('../assets/obituary.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.titleContainer}>
        <View style={styles.titleBackground} />
        <MedievalText style={styles.title}>Ancestral</MedievalText>
        <MedievalText style={styles.title}>Hall of Sages</MedievalText>
      </View>
      <View style={styles.circleContainer}>{renderUsersInCircle()}</View> 
      <MapButton
        onPress={goToMap}
        iconImage={require('../assets/school_icon.png')}
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
    top: 130,
    alignItems: 'center',
  },
  titleBackground: {
    top: -100,
    position: 'absolute',
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    width: 220,
    height: 120,
    borderRadius: 10,
  },
  title: {
    top: -100,
    fontSize: 35,
    paddingHorizontal: 10,
    paddingVertical: 25,
    textAlign: 'center',
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

export default HallOfSages;
