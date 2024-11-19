import React from 'react';
import { Image, View, StyleSheet, Text, Dimensions } from 'react-native';

type Props = {
  nickname: string;
  avatar: string;
};
const { width, height } = Dimensions.get('window');

const AcolythCardInHall: React.FC<Props> = ({ nickname, avatar }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: avatar }}
        style={styles.image} // Imagen circular con estilo
      />
      <Text style={styles.nickname}>{nickname}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Centra los elementos horizontalmente
    padding: 10,
    margin: 10,
    borderRadius: 100,
    width: width * 0.3,
    justifyContent: 'center', // Centra verticalmente si es necesario
  },
  image: {
    width: width * 0.2,
    height: height * 0.1,
    borderRadius: 100, // Hace la imagen circular
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'grey', // Borde gris alrededor de la imagen
  },
  nickname: {
    color: 'black', // Color principal del texto
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center', // Centra el texto debajo de la imagen
    borderRadius: 100, // Bordes redondeados
    backgroundColor: 'white', // Fondo blanco para mejor visibilidad
    padding:3,
}});

export default AcolythCardInHall;
