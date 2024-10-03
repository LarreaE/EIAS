import { Alert } from 'react-native';
import socket from './socketConnection';
import { sendUserEMail } from './emitEvents.tsx';

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
    console.log(data);
    setIsInside(data.data); // Llamamos a la función de actualización con los jugadores
  });
};


// Función para limpiar los eventos cuando el componente se desmonte
export const clearServerEvents = (): void => {
  socket.off('response');
  socket.off('alert');
  socket.off('all_players');
  socket.off('change_isInside');
};
