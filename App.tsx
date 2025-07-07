import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './src/store'
import Navigation from './src/navigation'
import { Alert, LogBox, PermissionsAndroid, Platform } from 'react-native'
//import messaging from '@react-native-firebase/messaging';
import { getMessaging, requestPermission, hasPermission, AuthorizationStatus, getToken, onMessage, deleteToken } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app'
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';


LogBox.ignoreAllLogs()

const App = () => {

  // const requestUserPermission = async () => {

  //   try {
  //     const messagingInstance = getMessaging(getApp());
  //     console.log(messagingInstance)
  //     const authStatus = await requestPermission(messagingInstance);
  //     const isAuthorized =
  //       authStatus === 1 || // AUTHORIZED
  //       authStatus === 2;  // PROVISIONAL
  //     console.log(authStatus)
  //     if (!isAuthorized) {
  //       Alert.alert('Notification permission not granted');
  //       return;
  //     }

  //     const fcmToken = await getToken(messagingInstance);
  //     console.log(fcmToken)
  //     if (fcmToken) {
  //       console.log('FCM Token:', fcmToken);
  //     } else {
  //       console.warn('FCM token was not returned');
  //     }
  //   } catch (error) {
  //     console.error('Error getting FCM token:', error);
  //   }
  // };

  // const requestPermissions_geolocation = async () => {

  //   console.log("requestPermissions")
  //   if (Platform.OS === "android") {
  //     console.log("for android")
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     );
  //     console.log(granted)
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {

  //       Geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //         },
  //         (error) => {
  //           console.log(error.code, error.message);
  //         },
  //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //       );
  //       return true;
  //     } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
  //       Geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //         },
  //         (error) => {
  //           console.log(error.code, error.message);
  //         },
  //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //       );
  //       return true;
  //     }
  //   } else {
  //     Geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         console.log(latitude);
  //         console.log(longitude);
  //       },
  //       (error) => {
  //         console.log(error.code, error.message);
  //       },
  //       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //     );
  //     return true;
  //   }
  // };


  const requestAllPermissions = async () => {

    try {

      // 🔔 Request FCM Notification Permission
      const messagingInstance = getMessaging(getApp());
      const authStatus = await requestPermission(messagingInstance);
      const isAuthorized = authStatus === 1 || authStatus === 2;
      console.log('Notification permission status:', authStatus);

      if (!isAuthorized) {
        Alert.alert('Notification permission not granted');
      } else {
        const fcmToken = await getToken(messagingInstance);
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
        } else {
          console.warn('FCM token was not returned');
        }
      }

      // 📍 Request Geolocation Permission
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        console.log('Location permission status:', granted);

        if (
          granted === PermissionsAndroid.RESULTS.GRANTED ||
          granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          Geolocation.getCurrentPosition(
            position => {
              (async () => {
                const { latitude, longitude } = position.coords;
                try {
                  await AsyncStorage.setItem('latitude', latitude.toString());
                  await AsyncStorage.setItem('longitude', longitude.toString());
                  console.log('Latitude:', latitude, 'Longitude:', longitude);
                } catch (err) {
                  console.error('AsyncStorage error:', err);
                }
              })();
            },
            error => {
              console.log('Geolocation error:', error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          Alert.alert('Location permission not granted');
        }
      } else {
        Geolocation.getCurrentPosition(
          position => {
            (async () => {
              const { latitude, longitude } = position.coords;
              try {
                await AsyncStorage.setItem('latitude', latitude.toString());
                await AsyncStorage.setItem('longitude', longitude.toString());
                console.log('Latitude:', latitude, 'Longitude:', longitude);
              } catch (err) {
                console.error('AsyncStorage error:', err);
              }
            })();
          },
          error => {
            console.log('Geolocation error:', error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const fetchToken = async () => {
    console.log("fetchToken")
    const messagingInstance = getMessaging();
    console.log(messagingInstance)
    const fcmToken = await getMessaging().getToken();
    console.log('FCM Token:', fcmToken);
  };

  useEffect(() => {

    requestAllPermissions();
    //fetchToken();

    const unsubscribe = onMessage(getMessaging(), async (remoteMessage) => {
      console.log('Received a foreground message:', remoteMessage);
      console.log('New Notification', remoteMessage.notification?.body ?? 'You have a new message');
    });

    return unsubscribe;
  }, [])

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  )
}

export default App
