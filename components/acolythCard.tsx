import React, { useEffect } from 'react';
import { Image, View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types/types';
import io from 'socket.io-client';
import MedievalText from './MedievalText';

// definir tipo de datos de props
type Props = {
  nickname: string;
  is_active: boolean;
  avatar: string;
};

const AcolythCard: React.FC<Props> = ({ nickname, is_active, avatar }) => {
  return (
    <View>
      <View style={styles.container}>
      <Image
          source={{ uri: avatar }}
          style={styles.image}
        />
        <MedievalText style={[styles.MedievalText]}>{nickname}</MedievalText>
        <MedievalText style={[styles.outMedievalText, is_active && styles.inMedievalText]}>
          {is_active ? ' Dentro' : ' Fuera'}
        </MedievalText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    padding: 20,
    margin: 20,
    borderStyle: "solid",
    borderColor: 'grey',
    borderBottomWidth: 1,
    backgroundColor: 'lightgrey',
    borderRadius: 30
  },
  MedievalText: {
    color: 'black',
  },
  inMedievalText: {
    color: 'green',
  },
  outMedievalText: {
    color: 'red',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default AcolythCard;
