import React, { useEffect, useState } from 'react';
import QRGenerator from './QrGenerator.tsx';
import { ImageBackground, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { clearServerEvents, listenToServerEventsScanAcolyte } from '../sockets/listenEvents.tsx';

type Props = {UserData:any};

const AcolythLaboratoryScreen: React.FC<Props> = (UserData:any) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [isInside, setIsInside] = useState(UserData.UserData.playerData.is_active);
  const player = UserData.UserData.playerData;

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
          <ImageBackground
          source={require('../assets/boton.png')}  // Ruta de la imagen
          style={styles.openButton}  //Aplicar estilos al contenedor
          resizeMode="cover"         // Ajuste de la imagen
        >
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.textStyle}>Show QR</Text>
            </TouchableOpacity>
          </ImageBackground>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <QRGenerator {...UserData} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      ) : (
        <QRGenerator {...UserData} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1, // Hace que la imagen de fondo ocupe todo el espacio disponible
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',     // Centra el contenido horizontalmente
  },
  openButton: {
    padding: 10,
    borderRadius: 10,
    width:100,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
