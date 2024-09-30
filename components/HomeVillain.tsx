import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  user: any;  // Datos del usuario pasados como prop desde la pantalla principal
};

const HomeVillain: React.FC<Props> = ({ user }) => {
  const userName = user?.playerData.nickname || 'No name available';

  return (
    <View style={styles.container}>
      <Text style={styles.text}>VILLAIN</Text>
      <Text style={styles.text}>User name: {userName}</Text>
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

export default HomeVillain;
