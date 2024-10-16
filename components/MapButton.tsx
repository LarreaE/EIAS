import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
};

const MapButton: React.FC<Props> = ({ title, onPress }) => {
  return (
    <View style={styles.buttonContainer}>
      <Button 
        title={title} 
        onPress={onPress} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
});

export default MapButton;
