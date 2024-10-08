import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import socket from '../sockets/socketConnection';

const { width, height } = Dimensions.get('window');

// Define los límites del QR directamente como constantes
const qrBounds = {
  x: (width - 250) / 2,  // Posición centrada horizontalmente
  y: (height - 250) / 2, // Posición centrada verticalmente
  width: 250,            // Tamaño del área de enfoque
  height: 250,           // Tamaño del área de enfoque
};

const QRScanner: React.FC<{ onQRCodeScanned: (value: string) => void }> = ({ onQRCodeScanned }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const [scanning, setScanning] = useState(true);

  const device = useCameraDevice('back');

  // QR Scanner hook
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && scanning) {
        const code = codes[0];
        console.log('Escaneando:', code);

        // Obtener las coordenadas del marco del código QR
        const frame = code.frame; // { height, width, x, y }
        // Log de coordenadas del QR
        console.log('Coordenadas del marco del QR:', frame);

        // Verifica si el QR está dentro de los límites definidos
        const isWithinSquare =
          frame.x >= qrBounds.x &&
          frame.x + frame.width <= qrBounds.x + qrBounds.width &&
          frame.y >= qrBounds.y &&
          frame.y + frame.height <= qrBounds.y + qrBounds.height;

        console.log('Está dentro del área enfocada:', isWithinSquare);

        if (isWithinSquare) {
          console.log('QR dentro del área enfocada: ', code.value);
          setScanning(false);
          sendQRScan(code.value);
          onQRCodeScanned(code.value);
          setTimeout(() => {
            setScanning(true);
          }, 3000);
        } else {
          console.log('QR fuera del área enfocada');
        }
      }
    },
  });

  // Función para enviar la solicitud al servidor
  const sendQRScan = async (data: string) => {
    const scannedEmail = data;
    socket.emit('scan_acolyte', { scannedEmail }); // Enviar el email al servidor
  };

  // Pedir permisos para la cámara
  useEffect(() => {
    const requestCameraPermission = async () => {
      await Camera.requestCameraPermission();
      setHasPermission(true);
    };

    requestCameraPermission();
  }, []);

  // Verificación de permisos
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No camera permission. Please grant camera access in settings.</Text>
      </View>
    );
  }

  // Verificación del dispositivo
  if (device == null) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  // Renderizar la cámara
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
        {/* Overlay superior */}
        <View style={styles.topOverlay} />

        {/* Área central con el cuadro de enfoque */}
        <View style={styles.centerOverlay}>
          <View style={styles.sideOverlay} />
          <View style={styles.focusedSquare} />
          <View style={styles.sideOverlay} />
        </View>

        {/* Overlay inferior */}
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
    overflow: 'hidden',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Área opaca superior
  },
  centerOverlay: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Áreas opacas laterales
  },
  focusedSquare: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#8B4513', // Borde para el cuadro
    backgroundColor: 'transparent', // Área transparente
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Área opaca inferior
  },
});

export default QRScanner;
