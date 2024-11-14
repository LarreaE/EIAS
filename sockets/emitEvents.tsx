import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import socket from './socketConnection';

// Tipamos el parámetro scannedEmail
export const sendQRScan = (scannedEmail: string): void => {
  socket.emit('scan_acolyte', { scannedEmail });
};

export const sendLocation = (location: string, email: string): void => {
  socket.emit('location', location, email);
};

export const sendUserEMail = (email: string) => {
  socket.emit('send_email', { email });
};

export const sendIsInside = (state: boolean): void => {
  console.log('send is inside tower');
  socket.emit('is_inside_tower', { state });
};

export const objectTaken = (objectId: Int32) => {
  console.log("object taken send");
  socket.emit('objectTaken', { id: objectId });
};

export const restoreObjects = () => {
  console.log("restore_objects");
  socket.emit('restore_objects');
};
export const requestArtifacts = () => {
  console.log("Artefacts Requestet");
  socket.emit('request_artifacts');
};

