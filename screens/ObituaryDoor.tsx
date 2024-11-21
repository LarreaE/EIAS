import React, { useContext } from 'react';
import {  StyleSheet,  ImageBackground, Dimensions, Vibration, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { UserContext, UserContextType } from '../context/UserContext';
import { sendLocation } from '../sockets/emitEvents';
import MapButton from '../components/MapButton';
import MedievalText from '../components/MedievalText';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ObituaryDoor'>;

const { width, height } = Dimensions.get('window');

const ObituaryDoor: React.FC = () => {

  const context = useContext(UserContext) as UserContextType;
  const { setUserData, userData, purifyIngredients, setPurifyIngredients, setAllIngredients, allIngredients, parchment , setParchment  } = context;
  const navigation = useNavigation<MapScreenNavigationProp>();

  const player = userData.playerData;

  const goToMap = () => {
    sendLocation('Map', userData.playerData.email);
    navigation.navigate('Map');
  };
  
    return (
      <>
          <ImageBackground
          source={require('../assets/obituary2.png')}
          style={styles.background}
          resizeMode="cover"
          >
            <View style={styles.titleContainer}>
                <View style={styles.titleBackground} />
                <MedievalText style={styles.title}>Obituary Door</MedievalText>
            </View>
            <MapButton
                onPress={goToMap}
                iconImage={require('../assets/map_icon.png')}
            />
          </ImageBackground>
          
      </>
    );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    opacity:0.8,
    width: width * 0.8,
    height: height * 0.55,
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    borderRadius: 10,
  },
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
    width: 220,
    height: 70,
    borderRadius: 10,
  },
  title: {
    top: -95,
    fontSize: 33,
    paddingHorizontal: 10,
    paddingVertical: 25,
    textAlign: 'center',
    color: 'white'
  },
});

export default ObituaryDoor;


