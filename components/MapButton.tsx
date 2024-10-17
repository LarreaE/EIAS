import React from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';

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
          <Text style={styles.text}>{title}</Text>

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
    width: 50,  // Ajusta el tamaño de la imagen
    height: 50,
    alignSelf: 'center',

  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default MapButton;
