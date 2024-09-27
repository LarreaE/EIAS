import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  user: any;  // Datos del usuario pasados como prop desde la pantalla principal
};

const AcolythProfileScreen: React.FC<Props> = ({ user }) => {
  const userName = user?.decodedToken?.name || 'No name available';
  const userEmail = user?.decodedToken?.email || 'No email available';

  return (
    <View style={styles.container}>
      <Text style={styles.text}>User name: {userName}</Text>
      <Text style={styles.text}>Email: {userEmail}</Text>
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

export default AcolythProfileScreen;
