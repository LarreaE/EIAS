import { Value } from 'firebase-admin/remote-config';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import io from 'socket.io-client'; // Importar socket.io-client

type Props = {
  onQRCodeScanned: () => void;
  setIsLoged: (value: boolean) => void;
};

const QRScanner: React.FC<Props> = ({ onQRCodeScanned ,setIsLoged}) => {

  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const [scanning, setScanning] = useState(true);

  const device = useCameraDevice('back');
  const socket = io('http://localhost:3000');

  const signOut = () => {
    setIsLoged(false); // Cambiar el estado de inicio de sesión
    socket.disconnect();
  };

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
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={scanning ? codeScanner : undefined}
      />
       {/* Overlay to guide scanning */}
       <View style={styles.overlay}>
        <View style={styles.square} />
        <Text style={styles.scanText}>Let's prove your might</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure it sits on top of the camera view
  },
  square: {
    width: 250,
    height: 250,
    borderWidth: 8,
    borderColor: '#8B4513',  // Dark brown, reminiscent of wood
    backgroundColor: 'rgba(0, 0, 0, 0.2)',  // Semi-transparent background to give it a window-like feel
    borderRadius: 10,
    position: 'relative',
  },
  medievalCorners: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#D4AF37',  // Gold color for the ornate corner
    borderWidth: 3,
    borderColor: '#8B4513',  // Dark brown to match the frame
  },
  topLeft: {
    top: -8,
    left: -8,
  },
  topRight: {
    top: -8,
    right: -8,
  },
  bottomLeft: {
    bottom: -8,
    left: -8,
  },
  bottomRight: {
    bottom: -8,
    right: -8,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  signOutButton: {
    position: 'absolute',
    top: 0,
    left: 5,
    backgroundColor: 'red',
    padding: 0,
    borderRadius: 5,
  },
  signOutText: {
    color: 'white',
    fontSize: 12,
  },
});
export default QRScanner;
