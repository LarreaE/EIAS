import { Alert, Vibration,ToastAndroid } from 'react-native';
import socket from './socketConnection';
import Config from 'react-native-config';
import { requestArtifacts } from './emitEvents';
import { SetStateAction } from 'react';

// Interfaces opcionales para tus datos
interface BattleData {
  progress: SetStateAction<number>;
  acolytePower: number;
  angeloPower: number;
}

interface BattleEndData {
  result: string;
  message: string;
}

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

export const listenToArtifactsUpdates = (): void => {
  socket.on('update_artifacts', () => {
    console.log('Artefactos actualizando...');
    requestArtifacts();
  });
};
export const listenToTIOTF = (onAngeloFoundCallback: () => void): void => {
  socket.on('AngeloWasFound', () => {
    console.log('Angelo Was Found by Other Player');
    onAngeloFoundCallback();

  });
};
export const listenToBattleEvents = (
  onBattleStarted: (data: BattleData) => void,
  onBattleUpdate: (data: BattleData) => void,
  onBattleEnd: (data: BattleEndData) => void
): void => {
  socket.on('battle_started', (data: BattleData) => {
    onBattleStarted(data);
  });

  socket.on('battle_update', (data: BattleData) => {
    onBattleUpdate(data);
  });

  socket.on('battle_end', (data: BattleEndData) => {
    onBattleEnd(data);
  });
};
interface Payload {
  email?: string;
  // ... lo que envíe tu servidor
}
export const listenToDiseasesEvents = (
  playerEmail: string,
  setUserData: React.Dispatch<React.SetStateAction<any>>
): void => {
    socket.on('disease_cured', (payload: Payload) => {
        // payload debe contener { email } o { _id } del acólito curado
        if (payload.email === playerEmail) {
          setUserData((prev) => ({
            ...prev,
            playerData: {
              ...prev.playerData,
              disease: null,
            },
          }));
        }
      });
      // Se quita la maldición Ethazium
      socket.on('curse_removed', (payload: Payload) => {
        if (payload.email === playerEmail) {
          setUserData((prev) => ({
            ...prev,
            playerData: {
              ...prev.playerData,
              ethaziumCursed: false,
            },
          }));
        }
      });
      // Mortimer aplica cataplasma => sube resistencia a 100
      socket.on('cataplasma_applied', (payload: Payload) => {
        if (payload.email === playerEmail) {
          setUserData((prev) => ({
            ...prev,
            playerData: {
              ...prev.playerData,
              resistance: 100,
            },
          }));
        }
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
  socket.off('AngeloWasFound');
};
export const clearBattleEvents = (): void => {
  socket.off('battle_started');
  socket.off('battle_update');
  socket.off('battle_end');
};

const sendNotification = async (email: any) => {
  console.log('Sending notification with email and screen:', email);

  try {
    const response = await fetch(`${Config.LOCAL_HOST}/api/notifications/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        screen: "TowerMortimer", // Incluye la propiedad 'screen' con el valor "Tower"
      }),
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
    const response = await fetch(`${Config.LOCAL_HOST}/api/auth/isInsideTower`, {
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
