import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import socket from '../sockets/socketConnection';

type Props = {
  user: any;  // Datos del usuario pasados como prop desde la pantalla principal
  setIsLoged: (value: boolean) => void;
};

const ProfileScreen: React.FC<Props> = ({ user, setIsLoged }) => {
  const role = user?.playerData.role || 'No name available';
  const userName = user?.playerData?.nickname || 'No name available';
  const userLvl = user?.playerData?.level || 'No email available';

  const signOut = () => {
    setIsLoged(false); // Cambiar el estado de inicio de sesión
    socket.disconnect();
  };

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      <Text style={styles.text}>{role}</Text>
      <Text style={styles.text}>User name:</Text>
      <Text style={styles.text}>{userName}</Text>
      <Text style={styles.text}>Level: {userLvl}</Text>
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
  signOutButton: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  signOutText: {
    color: 'white',
    fontSize: 12,
  },
});

export default ProfileScreen;
