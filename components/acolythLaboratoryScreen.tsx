import React, { useEffect, useState } from 'react';
import QRGenerator from './QrGenerator.tsx';
import { ImageBackground, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';

type Props = {UserData:any};

const AcolythLaboratoryScreen: React.FC<Props> = (UserData:any) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [isInside, setIsInside] = useState(UserData.UserData.playerData.is_active);
  const player = UserData.UserData.playerData;

  useEffect(() => {
    setIsInside(player.is_active);
  }, [player.is_active]);

  return (
    <View style={styles.container}>
      {isInside ? (
        <ImageBackground
          source={require('../assets/laboratory.png')}  // Ruta de la imagen
          style={styles.background}  //Aplicar estilos al contenedor
          resizeMode="cover"         // Ajuste de la imagen
        >
          <TouchableOpacity
            style={styles.openButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textStyle}>Show QR</Text>
          </TouchableOpacity>
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
    backgroundColor: '#F194FF',
    padding: 10,
    borderRadius: 10,
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
