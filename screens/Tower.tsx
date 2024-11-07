import React, { useContext, useEffect, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ToastAndroid, ImageBackground, ScrollView, ImageBackground } from 'react-native';
import MedievalText from '../components/MedievalText';
import MapButton from '../components/MapButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { UserContext, UserContextType } from '../context/UserContext';
import MortimerTower from '../components/mortimerTower';
import Config from 'react-native-config';
import { listenToServerEventsAcolyte } from '../sockets/listenEvents';
import axios from 'axios';
import Ingredient from '../components/Potions/Ingredient';
import { getBoolean, saveBoolean } from '../helper/AsyncStorage';
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TowerAcolyth'>;

const Tower: React.FC = () => {




  const context = useContext(UserContext) as UserContextType;
  
  const { setUserData, userData, purifyIngredients, setPurifyIngredients, setAllIngredients, allIngredients, parchment , setParchment  } = context;
  const navigation = useNavigation<MapScreenNavigationProp>();

  const [msg, setMsg] = useState("la,,br e h  - h  ,  a  ,i,,r,,ah c a z/,  s, ,  t, , n e i,d,  ,er,g,  , n ,i /,  ,  v  ed  ,,. y  l,f.,,r  ,,ev,,  r  ,e  s-a,,k  ,it  oa,k//,  :sp,t, , th");

  const player = userData.playerData;

  useEffect(() => {
    listenToServerEventsAcolyte(player.email);
}, [player.email]);
  

  const getNewIngredients = async (url: string) => {
    try {
      const response = await axios.get(url);
      const ingredients = response.data.data["Zachariah's herbal"].ingredients
      let ingredientsArray = [];
      for (let index = 0; index < ingredients.length; index++) {
        let ingredient = new Ingredient(ingredients[index]._id,ingredients[index].name,ingredients[index].effects,ingredients[index].value,ingredients[index].type,ingredients[index].image,ingredients[index].description); 
        ingredientsArray.push(ingredient);
      }
      setPurifyIngredients(ingredientsArray);   
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
    }
  };

  const goToMap = () => {
    navigation.navigate('Map');
  };

  const goToLab = () => {
    navigation.navigate('Map');
    userData.playerData.is_inside_tower = false;
  };

      const sendNotification = async () => {
        console.log('Sending notification to email:', player.email);
        try {
          await fetch(`${Config.PM2}/send-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: player.email }),
          })
            .then(response => {
              console.log(response);

              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              console.log('Server response:', data);
            })
            .catch(error => {
              console.error('Error:', error);
            });
        } catch (error) {
          console.error('Caught error:', error);
        }
      };

  //get parchment from asyncstorage
  useEffect(() => {
    const getParchment = async () => {
      setParchment(await getBoolean('parchment'));      
    };
    getParchment();
  }, []);
  
  const decrypt = () => {
  
    if (!parchment) {
      const decryptedMsg = msg.replace(/[, ]/g, '').split('').reverse().join('');
      setMsg(decryptedMsg);
      console.log("Scroll patched");
      getNewIngredients(decryptedMsg);
    } else {
      ToastAndroid.show('The knowledge has already been acquired' , 3)
    }
  }
  useEffect(() => {
    const getParchment = async() => {
      try {
        setParchment(await getBoolean('parchment'));
      } catch (error) {
        console.log("error getting parchment asyncstorage", error);
      }
    }
    getParchment()
  }, [decrypt]);
  // change msg
  useEffect(() => {
    console.log('Message updated:', msg);
  }, [msg]);
  useEffect(() => {
    console.log('ALL INGREDIENTS UPDATED:', allIngredients);
  }, [allIngredients]);
  useEffect(() => {
    const mergedIngredients = [...allIngredients, ...purifyIngredients];
    setAllIngredients(mergedIngredients);
  }, [purifyIngredients]);

  if (userData.playerData.role === 'MORTIMER') {
    return <MortimerTower />;
  } else {
    return (
      <>
     

                    
        {userData.playerData.is_inside_tower ? (
          // inside the tower
          <ImageBackground
          source={require('../assets/scroll.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <MedievalText style={styles.text}>{msg}</MedievalText>
            <MedievalText style={styles.text}>You have new ingredients</MedievalText>
            {purifyIngredients.length > 0 && (
              <View style={styles.scrollContainer}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <MedievalText>Purified Ingredients:</MedievalText>
                {purifyIngredients.map((ingredient, index) => (
                  <MedievalText key={index}>{ingredient.name}</MedievalText>
                ))}
              </ScrollView>
            </View>
            )}
            <TouchableOpacity onPress={decrypt}>
              <Text>Decypher Scroll</Text>
            </TouchableOpacity>
            <MapButton
              onPress={goToLab}
              iconImage={require('../assets/map_icon.png')}
            />
          </View>
        </ImageBackground>
        ) : (
          // outside the tower
          <ImageBackground
        source={require('../assets/tower.jpg')}  // Ruta de la imagen de fondo
        style={styles.background}  // Aplicar estilos al contenedor de la imagen de fondo
        resizeMode="cover"
      >
      <View style={styles.container}>
            <MedievalText style={styles.text}>TOWER</MedievalText>
            <MedievalText style={styles.text}>You may now activate the door</MedievalText>
            <TouchableOpacity onPress={sendNotification}>
              <Text>Send Automessage</Text>
            </TouchableOpacity>
      </View>
          <MapButton
              onPress={goToMap}
              iconImage={require('../assets/map_icon.png')}
            />
          </ImageBackground>
        )}
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    opacity:0.8,
    width:200,
    height:100,
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 20,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
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
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  scrollContainer: {
    width: 250,
    height: 150,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0)', // Slightly transparent background
    overflow: 'hidden', // This hides content that overflows the container
    marginVertical: 20,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    padding: 10,
  },
});

export default Tower;


