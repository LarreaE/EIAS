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
  const userLvl = user?.playerData?.level || 'No level available';
  const charisma = user?.playerData?.attributes.charisma || 'No level available';
  const constitution = user?.playerData?.attributes.constitution || 'No level available';
  const insanity = user?.playerData?.attributes.insanity || 'No level available';
  const dexterity = user?.playerData?.attributes.dexterity || 'No level available';
  const strength = user?.playerData?.attributes.strength || 'No level available';
  const intelligence = user?.playerData?.attributes.intelligence || 'No level available';



  const signOut = () => {
    setIsLoged(false); // Cambiar el estado de inicio de sesión
    socket.disconnect();
  };

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      <View  style={styles.attrContainer}>
        <Text style={styles.text}>{role}</Text>
        <Text style={styles.text}>User name:</Text>
        <Text style={styles.text}>{userName}</Text>
        <Text style={styles.text}>Level: {userLvl}</Text>

        <Text style={styles.attributeText}>Charisma: {charisma}</Text>
        <Text style={styles.attributeText}>Constitution: {constitution}</Text>
        <Text style={styles.attributeText}>Insanity: {insanity}</Text>
        <Text style={styles.attributeText}>Dexterity: {dexterity}</Text>
        <Text style={styles.attributeText}>Intelligence: {intelligence}</Text>
        <Text style={styles.attributeText}>Strength: {strength}</Text>
      </View>
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
  attributeText: {
    fontSize: 16,          // Slightly smaller for attributes
    color: '#555',         // Darker gray for attributes
    fontStyle: 'italic',   // Adds emphasis
    marginVertical: 4,     // Space between each attribute
  },
  attrContainer: {
    backgroundColor: 'rgba(200, 255, 200, 0.8)',  // White with 80% opacity
    borderRadius: 10,
    padding: 20,  // Padding for content inside the container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ProfileScreen;
