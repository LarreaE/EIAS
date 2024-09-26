import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {};

const AcolythLaboratoryScreen: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Laboratory Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
});

export default AcolythLaboratoryScreen;
