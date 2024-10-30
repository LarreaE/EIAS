import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

export async function checkAndRequestNotificationPermission() {
    try {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Notification permission granted.');
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

