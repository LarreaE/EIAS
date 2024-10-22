import React from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import MedievalText from './MedievalText';

type Props = {
  title?: string;
  onPress: () => void;
  iconImage?: ImageSourcePropType; // Añadimos la prop para la imagen del icono
};

const MapButton: React.FC<Props> = ({ title, onPress, iconImage }) => {
  return (
    <View style={styles.buttonContainer}>
      {iconImage ? (
        <TouchableOpacity onPress={onPress}>
          <Image source={iconImage} style={styles.iconStyle} />
          <MedievalText style={styles.text}>{title}</MedievalText>

        </TouchableOpacity>
      ) : (
        <Button 
          title={title || 'Click'} 
          onPress={onPress} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 66,  // Ajusta el tamaño de la imagen
    height: 66,
    alignSelf: 'center',

  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default MapButton;
