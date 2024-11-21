// MapButton.tsx
import React from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, Animated } from 'react-native';
import MedievalText from './MedievalText';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  title?: string;
  onPress: () => void;
  iconImage?: ImageSourcePropType;
  isGlowing?: boolean;
};

const MapButton: React.FC<Props> = ({ title, onPress, iconImage, isGlowing }) => {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.gifContainer}>
      {isGlowing ? (
          <Animated.Image
            source={require('../assets/animations/bg1.gif')}
            style={styles.gifStyle}
          />
        ) : (<></>)}
      </View>
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
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: width * 0.18,
    height: height * 0.1,
    alignSelf: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Centra el texto del título
  },
  gifContainer: {
    position: 'absolute',
    zIndex: -1,
    width: width*0.44, // Define the visible area of the GIF
    height: height*0.24, // Define the visible area of the GIF
    overflow: 'hidden', // Clips any content outside this boundary
    alignItems: 'center', // Center align GIF content
    justifyContent: 'center', // Center align GIF content
  },
  gifStyle: {
    bottom: height*0.02
  },
});

export default MapButton;

