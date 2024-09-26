import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';



const QRScanner = ({ onQRCodeScanned }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);

  const device = useCameraDevice('back');

   // QR Scanner hook
   const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`);
      if (codes.length > 0 && onQRCodeScanned) {
        onQRCodeScanned(codes[0]);
      }
    },
  });

  // request camera permissions
  useEffect(() => {
    const requestCameraPermission = async () => {
        await Camera.requestCameraPermission();
        setHasPermission(true);
    };

    requestCameraPermission();
  }, []);

  // permission not given
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No camera permission. Please grant camera access in settings.</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  }


  // permision not granted
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No camera permission. Please grant camera access in settings.</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  }


   // render camera
   return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QRScanner;
