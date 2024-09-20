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
            setLoggedIn(false);
        }
      };

  // Kaotika user request
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
        
        console.log("Respuesta de API Kaotika");
        
        console.log(jsonResponse);
        
        Alert.alert('Success', `Welcome ${jsonResponse.data.nickname}`);
      } else {
        console.error('Server error:', response.status);
        Alert.alert('Error', `Server responded with status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to send data to server.');
    }
  };

  //sign out
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo({});
      setLoggedIn(false);
    } catch (error) {
      setErrorMessage('Sign-out failed. Try again.');
    }
  };

  // Component JSX
  return (    
    <View style={{justifyContent: 'center', alignItems: 'center' }}>
      {loggedIn ? (
        <>
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
