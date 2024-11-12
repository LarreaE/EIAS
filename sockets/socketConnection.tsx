import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';


// Tipamos la variable de socket
const socket: Socket = io(Config.RENDER); // Cambia por la URL correcta de tu servidor

// Exportar el socket para que esté disponible en toda la aplicación
export default socket;
