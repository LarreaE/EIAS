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
}

const HallOfSages: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData } = context;
  const [usersInHall, setUsersInHall] = useState<User[]>([]);


  // Verifica si los datos de userData existen y están disponibles
  if (!userData || !userData.playerData || !userData.playerData.avatar || !userData.playerData.nickname) {
    return <Text>Cargando...</Text>;  // Si no hay datos de usuario, muestra algo de carga
  }

  // Asigna los datos del usuario actual desde playerData
  const currentUser: User = {
    _id: userData.playerData._id,  // Asegúrate de obtener el _id correcto desde playerData
    nickname: userData.playerData.nickname,  // Accede al nickname
    avatar: userData.playerData.avatar,  // Si no hay avatar, asigna uno predeterminado
    email: userData.playerData.email  // Accede al email
  };

  const goToMap = () => {
    sendLocation('School', userData.playerData.email); // Enviar el email desde playerData
    sendIsInHall(currentUser.email, false);
    navigation.navigate('School');
  };

  const renderUserInCircle = () => {
    const radius = 80; // Radio para el avatar
    const centerX = 0;
    const centerY = 0;

    const angle = 0; // Solo un usuario, no necesitamos distribuir en círculo.
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return (
      <View
        key={currentUser._id}
        style={[
          styles.avatarContainer,
          { transform: [{ translateX: x }, { translateY: y }] },
        ]}
      >
        <AcolythCardInHall nickname={currentUser.nickname} avatar={currentUser.avatar} />
      </View>
    );
  };

  useEffect(() => {
    // Envía la información del usuario al servidor
    sendIsInHall(currentUser.email, true);
  
    // return () => {
    //   sendIsInHall(currentUser.email, false);
    // };
  }, []);

  useEffect(() => {
    const handleUsersInHall = (users: User[]) => {
      setUsersInHall(users);
    };
  
    socket.on('send_users_in_hall', handleUsersInHall);
  
    return () => {
      socket.off('send_users_in_hall', handleUsersInHall);
    };
  }, []);
  
  const renderUsersInCircle = () => {
    const radius = 80; // Radio para el círculo
    const centerX = 0;
    const centerY = 0;
  
    return usersInHall.map((user, index) => {
      const angle = (2 * Math.PI * index) / usersInHall.length; // Distribuir en círculo
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
  
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
    width: 200, // Tamaño reducido para que el avatar quede centrado
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'absolute',
  },
});

export default HallOfSages;
