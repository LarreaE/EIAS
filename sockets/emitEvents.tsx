import socket from './socketConnection';

// Tipamos el parámetro scannedEmail
export const sendQRScan = (scannedEmail: string): void => {
  socket.emit('scan_acolyte', { scannedEmail });
};

export const sendUserEMail = (email: string) => {
  socket.emit('send_email', { email });
};
