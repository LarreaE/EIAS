import { io, Socket } from 'socket.io-client';

// Tipamos la variable de socket
const socket: Socket = io('http://localhost:3000'); // Cambia por la URL correcta de tu servidor

// Exportar el socket para que esté disponible en toda la aplicación
export default socket;
