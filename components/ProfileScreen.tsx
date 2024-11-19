import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import socket from '../sockets/socketConnection';
import MedievalText from './MedievalText';

type Props = {
  user: any;  // User data passed as a prop from the main screen
  setIsLogged: (value: boolean) => void;
};

const ProfileScreen: React.FC<Props> = ({ user, setIsLogged }) => {
  const signOut = () => {
    setIsLogged(false);
    socket.disconnect();
  };


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/settings_background_04.png')}  // Path to the background image
        style={styles.background}  // Apply styles to the ImageBackground container
        resizeMode="cover"         // Adjust the image to cover the entire container
      >
        {/* Centered welcome text */}
        <View style={styles.welcomeContainer}>
          <MedievalText style={styles.welcomeText}>
            {`Welcome back, ${user.playerData.role}`}
          </MedievalText>
          <MedievalText style={styles.welcomeText}>
            {`\nUser identity:\n${user.playerData.name}`}
          </MedievalText>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <ImageBackground
            source={require('../assets/boton.png')}  // Path to the button image
            style={styles.buttonImage}  // Styles for the image inside the button
            resizeMode="contain"        // Adjust the image to fit inside the button
          >
            <MedievalText style={styles.signOutText}>Sign Out</MedievalText>
          </ImageBackground>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  // Occupies all available space
  },
  background: {
    flex: 1,          // Occupies all available space
    width: '100%',    // Ensures full width
    height: '200%',   // Ensures full height
  },
  welcomeContainer: {
    justifyContent: 'center',   // Center vertically
    alignItems: 'center',       // Center horizontally
    marginHorizontal: '10%',    // Margins on the sides
    backgroundColor: 'rgba(200, 200, 200, 0.7)', // Light gray background with opacity
    padding: 15,                // Internal spacing
    borderRadius: 10,
    top: 100,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  signOutButton: {
    position: 'absolute',       // Absolute positioning to place the button at the bottom
    bottom: 100,                // Distance from the bottom of the screen
    alignSelf: 'center',        // Center the button horizontally
    width: 150,                 // Button width
    height: 80,                 // Button height
  },
  buttonImage: {
    flex: 1,                    // Occupies all available space
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  signOutText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ProfileScreen;