import React, { useContext } from 'react';
import { View, StyleSheet, Button, TouchableOpacity, Text } from 'react-native';
import MedievalText from '../components/MedievalText';
import MapButton from '../components/MapButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { UserContext } from '../context/UserContext';
import MortimerTower from '../components/mortimerTower';
import Config from 'react-native-config';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TowerAcolyth'>;

const Tower: React.FC = () => {

  const { setUserData, userData } = useContext(UserContext);

  const player = userData.playerData;

  const navigation = useNavigation<MapScreenNavigationProp>();

    const goToMap = () => {
        navigation.navigate('Map');
      };

      const sendNotification = async () => {
        console.log('Sending notification to email:', player.email);
        try {
          await fetch(`${Config.RENDER}/send-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: player.email }),
          })
            .then(response => {
              console.log(response);

              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              console.log('Server response:', data);
            })
            .catch(error => {
              console.error('Error:', error);
            });
        } catch (error) {
          console.error('Caught error:', error);
        }
      };

  if (userData.playerData.role === 'MORTIMER') {
    return (
      <>
      <MortimerTower/>
      </>
    );
  } else {
    return (
      <>
      <View style={styles.container}>
        <MedievalText style={styles.text}>TOWER</MedievalText>
        <MedievalText style={styles.text}>You may now activate the door</MedievalText>
        <TouchableOpacity
              onPress={sendNotification}
            >
              <Text>hello</Text>
            </TouchableOpacity>
        <MapButton
              onPress={goToMap}
              iconImage={require('../assets/map_icon.png')}
            />
      </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 20,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
  signOutButton: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  signOutText: {
    color: 'white',
    fontSize: 12,
  },
  background: {
    flex: 1, // Hace que la imagen de fondo ocupe todo el espacio disponible
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',     // Centra el contenido horizontalmente
  },
});

export default Tower;
