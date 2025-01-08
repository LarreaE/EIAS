import React, { useContext } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  Image, // ← Asegúrate de importar Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { UserContext, UserContextType } from '../context/UserContext';
import { sendLocation } from '../sockets/emitEvents';
import MapButton from '../components/MapButton';
import MedievalText from '../components/MedievalText';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dungeon'>;

const { width, height } = Dimensions.get('window');

const Dungeon: React.FC = () => {
  const context = useContext(UserContext) as UserContextType;
  const { userData } = context;
  const navigation = useNavigation<MapScreenNavigationProp>();

  const goToSchool = () => {
    sendLocation('', userData.playerData.email);
    navigation.navigate('School');
  };

  // Verificamos si Angelo ha sido "Deliverado"
  const isAngeloDelivered = userData?.playerData?.AngeloDelivered === true;

  return (
    <ImageBackground
      source={require('../assets/OSD-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.titleContainer}>
        <View style={styles.titleBackground} />
        <MedievalText style={styles.title}>The Old School Dungeon</MedievalText>
      </View>

      {/* Si AngeloDelivered es true, mostramos su imagen en la mazmorra */}
      {isAngeloDelivered && (
        <Image
          source={require('../assets/angelo_dungeon.png')}
          style={styles.angeloDungeon}
          resizeMode="contain"
        />
      )}

      <MapButton
        onPress={goToSchool}
        iconImage={require('../assets/map_icon.png')}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
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
    width: 400,
    height: 70,
    borderRadius: 10,
  },
  title: {
    top: -95,
    fontSize: 33,
    paddingHorizontal: 10,
    paddingVertical: 25,
    textAlign: 'center',
    color: 'white',
  },
  // Estilo de la imagen de Angelo en la mazmorra
  angeloDungeon: {
    position: 'absolute',
    bottom: 120,
    width: 200,
    height: 300,
  },
});

export default Dungeon;