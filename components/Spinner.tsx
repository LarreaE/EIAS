import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import MedievalText from './MedievalText';

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4285F4" />
      <MedievalText style={styles.message}>{message}</MedievalText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default Spinner;
