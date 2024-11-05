import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid } from 'react-native';

export async function checkAndRequestNotificationPermission() {
    try {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Notification permission granted.', authStatus);
            // Get the FCM token if permissions are granted
            const token = await messaging().getToken();
            console.log('FCM Token:', token);
        } else {
            console.log('Notification permission denied.');
            Alert.alert(
                'Notification Permissions',
                'Please enable notifications in settings to stay updated.'
            );
        }
    } catch (error) {
        console.log('Failed to request notification permission:', error);
    }
}


export async function requestNotificationPermission() {
    try {
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

      if (!hasPermission) {
        // Si no tiene permiso, solicitarlo
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permiso de notificaciones concedido');
        } else {
          console.log('Permiso de notificaciones denegado');
        }
      } else {
        console.log('El usuario ya tiene el permiso de notificaciones activado');
      }
    } catch (error) {
      console.error('Error al solicitar permiso de notificaciones:', error);
    }
  }
