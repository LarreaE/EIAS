import { Alert, Vibration,ToastAndroid } from 'react-native';
import socket from './socketConnection';
import Config from 'react-native-config';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

// Función para escuchar eventos del servidor
export const listenToServerEvents = (): void => {
  socket.on('response', (data: { message: string }) => {
    Alert.alert('Server Response', data.message);
  });

  socket.on('alert', (data: { message: string }) => {
    Alert.alert('Server Alert', data.message);
  });

};

// Función para escuchar eventos del servidor y actualizar el estado de los jugadores
export const listenToServerEventsMortimer = (updatePlayers: (players: any) => void): void => {
  socket.on('all_players', (data: { players: any }) => {
    console.log('Jugadores recibidos del servidor:', data.players);
    updatePlayers(data.players); // Llamamos a la función de actualización con los jugadores
  });
};

// Función para escuchar eventos del servidor y actualizar el estado de los jugadores
export const listenToServerEventsScanAcolyte = (setIsInside: (is_active: any) => void): void => {
  socket.on('change_isInside', (data: { data: any }) => {
    console.log('Valor de is_active:', data);
    Vibration.vibrate(1000);
    setIsInside(data.data); // Llamamos a la función de actualización con los jugadores
  });
};

// Función para escuchar eventos del servidor y actualizar 
export const listenToServerEventsAcolyte = (email: any,setIsInsideTower: (is_active: any) => void ): void => {
  socket.on('door_status', (data: any) => {
    console.log('door open');
    Vibration.vibrate(1000);
    showToastWithGravityAndOffset();
    sendNotification(email);
    setIsInsideTower(data.isOpen);
  });
};

// Función para escuchar eventos del servidor y actualizar el estado de los jugadores
export const listenToServerEventsDoorOpened = (setIsDoorOpen: (isOpen: boolean) => void): void => {
  socket.on('door_status', (data: { data: boolean }) => {
    console.log('Valor de door_status:', data.data);
    Vibration.vibrate(1000);
    setIsDoorOpen(data.data); // Activa el estado solo si se abre la puerta
  });
};


// Función para limpiar los eventos cuando el componente se desmonte
export const clearServerEvents = (): void => {
  socket.off('response');
  socket.off('alert');
  socket.off('all_players');
  socket.off('change_isInside');
  socket.off('qr_scanned');
  socket.off('pushNotification');
  socket.off('door_status');
};



const sendNotification = async (email:any) => {
  console.log('Sending notification with email:', email);

  try {
    const response = await fetch(`${Config.PM2}/api/notifications/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Server response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

 async function checkIfInsideTower(email: any) {
  try {
    console.log('FEtchint');
    const response = await fetch(`${Config.PM2}/api/auth/isInsideTower`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Error al verificar si esta dentro');
    }

    const data = await response.json();
    console.log('Respuesta del servidor:', data.is_inside_tower); // Puedes verificar la respuesta aquí
    return data.is_inside_tower;
  } catch (error) {
    console.error('Error al verificar si el usuario está dentro de la torre:', error);
    return null;
  }
}


const showToastWithGravityAndOffset = () => {
  ToastAndroid.showWithGravityAndOffset(
    'Puerta abierta',
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};
