import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';

// Tipamos la variable de socket
const socket: Socket = io(Config.LOCAL_HOST, {
  transports: ['websocket'], // Fuerza el uso de WebSocket
  autoConnect: true,
});


socket.on('connect_error', (error) => {
  console.log('Error de conexión:', error.message);
});


// Exportar el socket para que esté disponible en toda la aplicación
export default socket;