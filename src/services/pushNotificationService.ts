import { Alert, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { BASE_URL } from './apiConfig';

class PushNotificationService {
  private initialized = false;
  private foregroundUnsubscribe: (() => void) | null = null;
  private tokenRefreshUnsubscribe: (() => void) | null = null;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;
  private registrationInFlight: Promise<void> | null = null;

  private async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      const status = await messaging().requestPermission();
      return (
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.warn('Push permission request failed:', error);
      return false;
    }
  }

  private async ensureDeviceRegistered(): Promise<void> {
    if (Platform.OS !== 'ios') {
      return;
    }

    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
  }

  private clearRetryTimeout() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }

  private scheduleRetry(authToken: string) {
    if (this.retryTimeout) {
      return;
    }

    this.retryTimeout = setTimeout(() => {
      this.retryTimeout = null;
      this.registerDeviceToken(authToken).catch(() => null);
    }, 4000);
  }

  private setupForegroundHandler() {
    if (this.initialized) {
      return;
    }

    this.foregroundUnsubscribe = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage.notification?.title || 'KlatchUp';
      const body = remoteMessage.notification?.body || 'You have a new update';
      Alert.alert(title, body);
    });

    this.initialized = true;
  }

  private setupTokenRefresh(authToken: string) {
    if (this.tokenRefreshUnsubscribe) {
      return;
    }

    this.tokenRefreshUnsubscribe = messaging().onTokenRefresh(async refreshedToken => {
      try {
        await fetch(`${BASE_URL}/profile/device-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ fcmToken: refreshedToken }),
        });
      } catch (err) {
        console.warn('Failed to refresh FCM token on server:', err);
      }
    });
  }

  private async performRegistration(authToken: string): Promise<void> {
    await this.ensureDeviceRegistered();

    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.log('Push permission not granted');
      return;
    }

    try {
      if (Platform.OS === 'ios') {
        const apnsToken = await messaging().getAPNSToken();

        if (!apnsToken) {
          console.log('APNs token not available yet, retrying push registration...');
          this.scheduleRetry(authToken);
          return;
        }
      }

      const fcmToken = await messaging().getToken();
      if (!fcmToken) {
        console.warn('FCM token missing');
        this.scheduleRetry(authToken);
        return;
      }

      await fetch(`${BASE_URL}/profile/device-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ fcmToken }),
      });

      this.clearRetryTimeout();
      this.setupForegroundHandler();
      this.setupTokenRefresh(authToken);
    } catch (error) {
      console.warn('Failed to register FCM token:', error);
      this.scheduleRetry(authToken);
    }
  }

  async registerDeviceToken(authToken: string): Promise<void> {
    if (this.registrationInFlight) {
      return this.registrationInFlight;
    }

    this.registrationInFlight = this.performRegistration(authToken).finally(() => {
      this.registrationInFlight = null;
    });

    return this.registrationInFlight;
  }
}

export const pushNotificationService = new PushNotificationService();
