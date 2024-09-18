import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SplashScreen = (): React.JSX.Element => {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>EIAS </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Ajusta el color del fondo según sea necesario
  },
  splashText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default SplashScreen;
