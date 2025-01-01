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
  console.log('object taken send');
  socket.emit('objectTaken', { id: objectId });
};

export const restoreObjects = () => {
  console.log('restore_objects');
  socket.emit('restore_objects');
};
export const requestArtifacts = () => {
  console.log('Artefacts Requestet');
  socket.emit('request_artifacts');
};

export const sendIsInHall = (email: string, state: boolean): void => {
  socket.emit('is_in_hall', { email, isInHall: state });
};
export const sendPlayAnimationAcolyte = (): void => {
  console.log('Aniomation send acolytes');
  socket.emit('play_animation_acolytes');
};
export const sendAnimationMortimer = (): void => {
  console.log('Animation send Mortimer');
  socket.emit('play_animation_mortimer');
};
export const searchValidated = (validation:boolean): void => {
  console.log('SearchValidated');
  socket.emit('search_validation',validation);
};
export const sendBetrayer = (decision:boolean,email: string): void => {
  console.log('Sending betaryer');
  socket.emit('Betrayer',decision,email);
};
export const angeloFound = (): void => {
  console.log('AngeloFound');
  socket.emit('AngeloFound');
};
// Iniciar la batalla con Angelo
export const startAngeloBattle = (): void => {
  socket.emit('start_angelo_battle');
};

// Reducir a Angelo (un ataque)
export const reduceAngelo = (value: number = 5): void => {
  socket.emit('reduce_angelo', { value });
};

// Cancelar la batalla (o rendirse)
export const cancelBattle = (): void => {
  socket.emit('cancel_battle');
};
export const AngeloDelivered = (): void => {
  socket.emit('Angelo_delivered');
};
