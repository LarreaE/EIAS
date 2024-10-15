import React, { useEffect, useState } from 'react';
import QRGenerator from './QrGenerator.tsx';
import { ImageBackground, Modal, StyleSheet, TouchableOpacity, View, Vibration } from 'react-native';
import { Text } from 'react-native';
import { clearServerEvents, listenToServerEventsScanAcolyte } from '../sockets/listenEvents.tsx';

type Props = { UserData: any };

const AcolythLaboratoryScreen: React.FC<Props> = (UserData: any) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [isInside, setIsInside] = useState(UserData.UserData.playerData.is_active);
  const [ingredients, setIngredients] = useState([]);
  const [potions, setPotions] = useState([]);
  const player = UserData.UserData.playerData;
  const vibrationDuration = 250;

  useEffect(() => {
    console.log('modalVisible: ');
    setModalVisible(false);
  }, [isInside]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        console.log('Fetching ingredients...');
        const response = await fetch('https://eiasserver.onrender.com/ingredients');
        const contentType = response.headers.get('content-type');
  
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          
          if (data.success === true && Array.isArray(data.ingredientsData) && data.ingredientsData.length > 0) {
            setIngredients(data.ingredientsData);            
          } else {
            console.error('No ingredients found or status is not OK.');
          }
        } else {
          const text = await response.text();
          console.error('Response is not JSON:', text);
        }
      } catch (error) {
        console.error('Error getting ingredients:', error);
      }
    };
  
    fetchIngredients();
  }, []);
  
  useEffect(() => {
    const fetchPotions = async () => {
      try {
        console.log('Fetching potions...');
        const response = await fetch('https://eiasserver.onrender.com/potions');
        const contentType = response.headers.get('content-type');
  
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          
          if (data.success === true && Array.isArray(data.potionsData) && data.potionsData.length > 0) {
            setIngredients(data.potionsData);
            console.log('Getted potions:', data.potionsData[31]);
          } else {
            console.error('No potions found or status is not OK.');
          }
        } else {
          const text = await response.text();
          console.error('Response is not JSON:', text);
        }
      } catch (error) {
        console.error('Error getting potions:', error);
      }
    };
  
    fetchPotions();
  }, []);

  useEffect(() => {
    listenToServerEventsScanAcolyte(setIsInside);

    const updateIsInside = async () => {
      try {
        await fetch('https://eiasserver.onrender.com/isInside', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: player.email }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Server response:', data);
          setIsInside(data.is_active);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      } catch (error) {
        console.error('Caught error:', error);
      }
    };

    updateIsInside();
    return () => {
      clearServerEvents();
    };
  }, [player.is_active, player.email]);

  return (
    <View style={styles.container}>
      {isInside ? (
        <ImageBackground
          source={require('../assets/laboratory.png')}  // Ruta de la imagen
          style={styles.background}  //Aplicar estilos al contenedor
          resizeMode="cover"         // Ajuste de la imagen
        >
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
          >
            <ImageBackground
              source={require('../assets/boton.png')}  // Ruta de la imagen
              style={styles.openButton}  //Aplicar estilos al contenedor
              resizeMode="cover"         // Ajuste de la imagen
            >
              <Text style={styles.textStyle}>Show QR</Text>
            </ImageBackground>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(true);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <QRGenerator {...UserData}
                  onCodeScanned={() => Vibration.vibrate(1 * vibrationDuration)} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      ) : (
        <QRGenerator {...UserData}
          onCodeScanned={() => Vibration.vibrate(1 * vibrationDuration)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    padding: 10,
    borderRadius: 10,
    width: 100,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    height: 300,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
  },
});

export default AcolythLaboratoryScreen;
