import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

const GoogleSignInComponent: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null); // Store user info
  const [loggedIn, setLoggedIn] = useState(false); // Login status
  const [errorMessage, setErrorMessage] = useState(''); // Error message
  const [loading, setLoading] = useState(false); // Loading spinner state

  useEffect(() => {
    const clientId = Config.GOOGLE_WEB_CLIENT_ID;
    console.log("Google Web Client ID:", clientId);
    
    const configureGoogleSignIn = async () => {
      await GoogleSignin.configure({
        webClientId: clientId,
        offlineAccess: true,
      });
    };
    
    configureGoogleSignIn();
  }, []);
  
  


    // Sing in 
    const signIn = async () => {
        try {
          const userInfo = await GoogleSignin.signIn(); 
          console.log("UserInfo");
          
          console.log(userInfo);
          
          setUserInfo(userInfo); // set user info to state
          setLoggedIn(true); 
          await userRequest(userInfo.data!.user.email)
        } catch (error) {
            setErrorMessage('An unknown error occurred.');
            console.log(error);
            
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

  // Sign out method with confirmation
  const signOut = async () => {
    // Show confirmation dialog
    Alert.alert(
      'Confirm Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Log out cancelled'),
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              await GoogleSignin.signOut();
              setUserInfo(null);
              setLoggedIn(false);
            } catch (error) {
              setErrorMessage('Sign-out failed. Try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign In</Text>
      </View>

      {loading ? (
        // Loading Spinner with Overlay
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      ) : loggedIn ? (
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 1, // Ensure overlay is above other components
  },
});

export default GoogleSignInComponent;
