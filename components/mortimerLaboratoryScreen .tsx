import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList } from 'react-native';
import AcolythCard from './acolythCard';
import { listenToServerEventsMortimer, clearServerEvents } from '../sockets/listenEvents.tsx';
import MedievalText from './MedievalText.tsx';
import Config from 'react-native-config';
import MapButton from './MapButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types.ts';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LaboratoryMortimer'>;

// define la interfaz para el tipo de datos de usuario
interface User {
  _id: string;
  nickname: string;
  is_active: boolean;
  avatar: string
}

// definir tipos de datos de props
type Props = {
  _id: string;
  nickname: string;
  is_active: boolean;
  avatar: string
};

const MortimerLaboratoryScreen: React.FC<Props> = () => {

  const navigation = useNavigation<MapScreenNavigationProp>();

  const goToMap = () => {
    navigation.navigate('Map');
  };

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Escuchar eventos del servidor y actualizar el estado de users
    listenToServerEventsMortimer(setUsers);

    // Petición a la base de datos para obtener los usuarios iniciales
    const addUsers = async () => {
      try {
        const response = await fetch(`${Config.RENDER}/api/players/mortimer`);
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
      <View style={styles.titleContainer}>
        <View style={styles.titleBackground} />
        <MedievalText style={styles.title}>
          Laboratory
        </MedievalText>
      </View>
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

export default MortimerLaboratoryScreen;
