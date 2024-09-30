import { Alert } from 'react-native';
import socket from './socketConnection';

// Función para escuchar eventos del servidor
export const listenToServerEvents = (): void => {
  socket.on('response', (data: { message: string }) => {
    Alert.alert('Server Response', data.message);
  });

  socket.on('alert', (data: { message: string }) => {
    Alert.alert('Server Alert', data.message);
  });
};
export const listenToServerEventsMortimer = (): void => {
  socket.on('all_players', (data: { players: string }) => {
    Alert.alert('Server Alert', data.players);
  });
}

// Función para limpiar los eventos cuando el componente se desmonte
export const clearServerEvents = (): void => {
  socket.off('response');
  socket.off('alert');
  socket.off('all_players')
};
