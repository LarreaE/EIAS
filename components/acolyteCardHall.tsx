import React from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';

type Props = {
  nickname: string;
  avatar: string;
};

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
    borderRadius: 30,
    width: 120,
    height: 120,
    justifyContent: 'center', // Centra verticalmente si es necesario
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50, // Hace la imagen circular
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'grey', // Borde gris alrededor de la imagen
  },
  nickname: {
    color: 'black', // Color principal del texto
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center', // Centra el texto debajo de la imagen
    textShadowColor: 'white', // Color del reborde
    textShadowOffset: { width: 1, height: 1 }, // Sombra en diagonal
    textShadowRadius: 5, // Difuminación mínima
    borderWidth: 1, // Grosor del borde
    borderColor: 'black', // Color del borde
    borderRadius: 10, // Bordes redondeados
    backgroundColor: 'white', // Fondo blanco para mejor visibilidad
}});

export default AcolythCardInHall;
``
