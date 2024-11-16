import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import MedievalText from './MedievalText';

const QRGenerator = (data: any) => {
  const isActive = data.UserData.playerData.is_active;

  return (
    <View style={styles.container}>
      {/* Generación del QR con borde medieval */}
      <View style={styles.medievalFrame}>
        {/* Marco completo */}
        <Image
          source={require('../assets/medieval-border.png')} // Imagen del marco completo
          style={styles.frameImage}
        />
        {/* Contenedor del QR */}
        <View style={styles.qrContainer}>
          <QRCode
            value={data.UserData.decodedToken.email}
            size={200}
            color="#4b3621"
            backgroundColor="#f5f3e7"
          />
        </View>
      </View>
      {!isActive && (
        <MedievalText style={styles.qrText}>
          Scan to Enter the Laboratory
        </MedievalText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2d3b9',
    padding: 20,
  },
  medievalFrame: {
    position: 'relative',
    width: 250, // Tamaño total del marco
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameImage: {
    position: 'absolute',
    width: '160%',
    height: '160%',
    resizeMode: 'contain',
  },
  qrContainer: {
    position: 'absolute',
    width: 200, // Tamaño del QR
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f3e7',
    borderRadius: 15, // Opcional si quieres redondear el QR
  },
  qrText: {
    marginTop: 10,
    fontSize: 18,
    color: '#4b3621',
    fontFamily: 'MedievalSharp-Regular',
    textAlign: 'center',
  },
});

export default QRGenerator;