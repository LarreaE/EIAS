import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import socket from '../sockets/socketConnection';

type Props = {
  onQRCodeScanned: () => void;
  setIsLoged: (value: boolean) => void;
};

const QRScanner: React.FC<Props> = ({ onQRCodeScanned }) => {

  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const [scanning, setScanning] = useState(true);

  const device = useCameraDevice('back');

   // QR Scanner hook
   const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes`);
      console.log(codes[0]);
      setScanning(false); // timeout
      sendQRScan(codes[0].value);

      if (codes.length > 0 && onQRCodeScanned && scanning) {
        onQRCodeScanned(codes[0].value);
      }
      setTimeout(() => {
        setScanning(true);
      }, 3000);
    },
  });

    // Función para enviar la solicitud POST al servidor
    const sendQRScan = async (data:any) => {
      const scannedEmail = data; // Cambia esto según sea necesario
      socket.emit('scan_acolyte', { scannedEmail }); // Enviar el email al servidor
    };

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
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={scanning ? codeScanner : undefined}
      />
       <View style={styles.overlay}>
          {/* Top Transparent Overlay */}
          <View style={styles.topOverlay} />

          {/* Center Overlay with transparent square */}
          <View style={styles.centerOverlay}>
            <View style={styles.sideOverlay} />
            <View style={styles.focusedSquare} />
            <View style={styles.sideOverlay} />
          </View>

          {/* Bottom Transparent Overlay */}
          <View style={styles.bottomOverlay} />
        </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Top opaque area
  },
  centerOverlay: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Left and right opaque areas
  },
  focusedSquare: {
    width: 250, // Width of the square
    height: 250, // Height of the square
    borderWidth: 2,
    borderColor: '#8B4513', // White border for the square
    backgroundColor: 'transparent', // Center transparent area
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Bottom opaque area
  },
});
export default QRScanner;
