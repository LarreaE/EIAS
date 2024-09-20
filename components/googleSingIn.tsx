import React, { useEffect, useState } from 'react';
import Config from 'react-native-config';
import { View, Text, Button, Alert } from 'react-native';
import { User, GoogleSignin } from '@react-native-google-signin/google-signin';

const GoogleSignInComponent = () => {
  const [userInfo, setUserInfo] = useState({}); //user information "data":{"user":{"name": null, "email": null}}
  const [loggedIn, setLoggedIn] = useState(false); //login status
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    });

     // check if user is already signed in
     checkIfUserIsSignedIn();

  }, []);


    const checkIfUserIsSignedIn = async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUserInfo(currentUser);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking sign-in status:', error);
    }
  };

    // Sing in 
    const signIn = async () => {
        try {
          const userInfo = await GoogleSignin.signIn(); 
          console.log(userInfo);
          
          setUserInfo(userInfo); // set user info to state
          setLoggedIn(true); 
        } catch (error) {
            setErrorMessage('An unknown error occurred.');
            setLoggedIn(false);
        }
      };

  // Function to send a fetch request with the user's email to your server
  const userRequest = async (email: String) => {
    try {
        const url = `https://kaotika-server.fly.dev/players/email/${email}`
    
        const response = await fetch(url, { 
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Server response:');
        // Handle the server response as needed (e.g., show a success message or process the data)
        Alert.alert('Success', `Welcome ${response.body}`);
      } else {
        console.error('Server error:', response.status);
        Alert.alert('Error', `Server responded with status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to send data to server.');
    }
  };

  // Function to sign out
  const signOut = async () => {
    try {
      await GoogleSignin.signOut(); // Clear the user's session from the device
      setUserInfo({});
      setLoggedIn(false);
    } catch (error) {
      setErrorMessage('Sign-out failed. Try again.');
    }
  };

  // Component JSX
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loggedIn ? (
        <>
          <Text>Welcome, {userInfo.data.user.name}</Text>
          <Text>Email: {userInfo.data.user.email}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </>
      ) : (
        <>
          <Text>{errorMessage || 'You are not logged in.'}</Text>
          <Button title="Sign In with Google" onPress={signIn} />
        </>
      )}
    </View>
  );
};

export default GoogleSignInComponent;
