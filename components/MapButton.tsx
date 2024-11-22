import React from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, Animated } from 'react-native';
import MedievalText from './MedievalText';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  title?: string;
  onPress: () => void | Promise<void>;
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
        ) : null}
      </View>

      {/* Verifica si el título es 'Obituary Door' y agrega las imágenes y GIF */}
      {title === 'Obituary' ? (
        <View style={styles.artefactContainer}>
          {/* Artefacto superior izquierdo */}
          <Animated.Image
            source={require('../assets/animations/lightning.gif')}
            style={[styles.gifBetween, { top: -height * 0.06, left: -width * 0.16, transform: [{ rotate: '90deg' }] }]}
          />
          <Image source={require('../assets/artefact1.png')} style={[styles.artefactStyle, { top: -height * 0.08, left: -width * 0.18 }]} />

          {/* Artefacto superior derecho */}
          <Animated.Image
            source={require('../assets/animations/lightning.gif')}
            style={[styles.gifBetween, { top: -height * 0.06, right: -width * 0.16, transform: [{ rotate: '180deg' }] }]}
          />
          <Image source={require('../assets/artefact2.png')} style={[styles.artefactStyle, { top: -height * 0.08, right: -width * 0.18 }]} />

          {/* Artefacto inferior izquierdo */}
          <Animated.Image
            source={require('../assets/animations/lightning.gif')}
            style={[styles.gifBetween, { bottom: -height * 0.06, left: -width * 0.16 }]}
          />
          <Image source={require('../assets/artefact3.png')} style={[styles.artefactStyle, { bottom: -height * 0.08, left: -width * 0.18 }]} />

          {/* Artefacto inferior derecho */}
          <Animated.Image
            source={require('../assets/animations/lightning.gif')}
            style={[styles.gifBetween, { bottom: -height * 0.06, right: -width * 0.16, transform: [{ rotate: '270deg' }] }]}
          />
          <Image source={require('../assets/artefact4.png')} style={[styles.artefactStyle, { bottom: -height * 0.08, right: -width * 0.18 }]} />
        </View>
      ) : null}

      {iconImage ? (
        <TouchableOpacity onPress={onPress}>
          <Image source={iconImage} style={styles.iconStyle} />
          <MedievalText style={styles.text}>{title}</MedievalText>
        </TouchableOpacity>
      ) : (
        <Button title={title || 'Click'} onPress={onPress} />
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
    textAlign: 'center',
  },
  gifContainer: {
    position: 'absolute',
    zIndex: -1,
    width: width * 0.44,
    height: height * 0.24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifStyle: {
    bottom: height * 0.02,
  },
  artefactContainer: {
    position: 'absolute',
    zIndex: 0,
    width: width * 0.08,
    height: height * 0.08,
    top: height * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artefactStyle: {
    position: 'absolute',
    width: width * 0.12,
    height: height * 0.06,
  },
  gifBetween: {
    position: 'absolute',
    width: width * 0.18,
    height: height * 0.08,
  },
});

export default MapButton;
