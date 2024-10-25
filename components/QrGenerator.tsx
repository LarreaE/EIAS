import React from 'react';
import { View , StyleSheet, Text} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRGenerator = (data:any) => {

    if (data.UserData.playerData.is_active) {
      return (
          <View style={styles.containerInside}>
            <QRCode
              value={data.UserData.decodedToken.email}
              size={200}
              color="#4b3621"
              backgroundColor="#f5f3e7"
              logo={require('../assets/profile_icon.png')}
              />
          </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <View style={styles.container}>
            <QRCode
              value={data.UserData.decodedToken.email}
              size={200}
              color="#4b3621"
              backgroundColor="#f5f3e7"
              logo={require('../assets/laboratory_icon.png')}
              />
          </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2d3b9', // Parchment-style background
    padding: 20,
  },
  containerInside: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2d3b2', // Parchment-style background
    padding: 20,
    borderRadius: 20,
    margin:10,
  },
  qrContainer: {
    padding: 15,
    backgroundColor: '#f5f3e7', // QR background to resemble aged paper
    borderColor: '#6b4226', // Dark brown for medieval-styled border
    borderWidth: 4,
    borderRadius: 15,
    elevation: 10, // Adds a shadow effect for a more elevated look
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  qrText: {
    marginTop: 10,
    fontSize: 18,
    top: -150,
    color: '#4b3621', // Dark brown for text to match medieval aesthetic
    fontFamily: 'MedievalSharp-Regular', // Assume custom medieval font
    textAlign: 'center',
    letterSpacing: 1.5, // A little more spacing for authenticity
  },
  qrCodeStyle: {
    width: 200, // Customize the size of the QR code as needed
    height: 200,
  },
});

export default QRGenerator;

