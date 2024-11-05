import { Alert, Vibration } from 'react-native';
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
  socket.on('pushNotification', () => {
    sendNotification();
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


// Función para limpiar los eventos cuando el componente se desmonte
export const clearServerEvents = (): void => {
  socket.off('response');
  socket.off('alert');
  socket.off('all_players');
  socket.off('change_isInside');
  socket.off('qr_scanned');
  socket.off('pushNotification');
};


const sendNotification = async () => {

  const { setUserData, userData } = useContext(UserContext);

const player = userData.playerData;

  console.log('Sending notification to email:', player.email);
  try {
    await fetch(`${Config.RENDER}/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: player.email }),
    })
      .then(response => {
        console.log(response);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Server response:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } catch (error) {
    console.error('Caught error:', error);
  }
};
