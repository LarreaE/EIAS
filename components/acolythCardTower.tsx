import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import MedievalText from './MedievalText';

type Props = {
  nickname: string;
  is_inside_tower: boolean;
  avatar: string;
};

const AcolythCardTower: React.FC<Props> = ({ nickname, is_inside_tower, avatar }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: avatar }}
        style={[styles.image, is_inside_tower ? styles.activeBorder : styles.inactiveBorder]}
      />
      <MedievalText style={styles.MedievalText}>{nickname}</MedievalText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    margin: 5,
    borderStyle: 'solid',
    borderColor: 'grey',
    borderBottomWidth: 1,
    backgroundColor: 'lightgrey',
    borderRadius: 30,
    alignItems: 'center',
    width:320,
  },
  MedievalText: {
    color: 'black',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2, // Grosor del borde
  },
  activeBorder: {
    borderColor: 'green',
  },
  inactiveBorder: {
    borderColor: 'red',
  },
});

export default AcolythCardTower;

