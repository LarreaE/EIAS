import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';


const GoogleSignInComponent: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null); // Store user info
  const [loggedIn, setLoggedIn] = useState(false); // Login status
  const [errorMessage, setErrorMessage] = useState(''); // Error message

  useEffect(() => {
    // Configure Google Sign-In with the webClientId
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  // Sign in method
  const signIn = async () => {
    try {
      const userInfo = await GoogleSignin.signIn(); 
      setUserInfo(userInfo.data!); // Set user info to state
      setLoggedIn(true); // Set logged in state to true
      await userRequest(userInfo.data!.user.email); // Call Kaotika user request
    } catch (error) {
      setErrorMessage('An unknown error occurred.');
      setLoggedIn(false);
    }
  };

  // API request to Kaotika server
  const userRequest = async (email: string) => {
    try {
      const url = `https://kaotika-server.fly.dev/players/email/${email}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        Alert.alert('Success', `Welcome ${jsonResponse.data.nickname}`);
      } else {
        Alert.alert('Error', `Server responded with status code: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send data to server.');
    }
  };

  // Sign out method
  const signOut = async () => {
    // Show confirmation dialog
    Alert.alert(
      'Confirm Log Out', // Title
      'Are you sure you want to log out?', // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Log out cancelled'),
          style: 'cancel', // Style of the button (iOS specific)
        },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              await GoogleSignin.signOut(); // Proceed with the actual sign-out
              setUserInfo(null); // Clear user info
              setLoggedIn(false); // Set logged in state to false
            } catch (error) {
              setErrorMessage('Sign-out failed. Try again.');
            }
          },
        },
      ],
      { cancelable: false } // Prevent dismissing the dialog by tapping outside
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign In</Text>
      </View>

      {loggedIn ? (
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>Welcome, {userInfo?.user.name}</Text>
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Text style={styles.errorMessage}>{errorMessage || 'You are not logged in.'}</Text>
          <TouchableOpacity style={styles.googleButton} onPress={signIn}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png' }}
              style={styles.googleLogo}
            />
            <Text style={styles.buttonText}>Sign In with Google</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  titleContainer: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
  loggedInContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 60,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  signOutButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 60,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GoogleSignInComponent;
