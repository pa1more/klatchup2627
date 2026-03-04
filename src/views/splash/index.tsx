import { StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useNavigation } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import { restoreSessionRequest } from '../../slices/profile'
import { RootState } from '../../store'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 10,
  }
})

const SplashScreen = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.profile.token);
  const profile = useSelector((state: RootState) => state.profile.mobileCheck);
  const profileLoading = useSelector((state: RootState) => state.profile.mobile_isLoading);
  
  useEffect(() => {
    console.log('🎉 SplashScreen mounted - initiating session restoration');
    
    // Dispatch action to trigger session restoration saga
    dispatch(restoreSessionRequest());
  }, [dispatch]);

  useEffect(() => {
      console.log('🔍 Auth state:', {
        token: token ? '✅' : '❌',
        profileLoaded: profile && Object.keys(profile).length > 0 ? '✅' : '❌',
        loading: profileLoading
      });
    
      // Wait for profile to load (if token exists) or timeout after 2 seconds
    const timer = setTimeout(() => {
      if (token) {
          // Check if profile has been loaded
          if (profile && Object.keys(profile).length > 0 && 'profile' in profile) {
            console.log('✅ User authenticated with profile - navigating to Home');
            navigation.replace('Home');
          } else if (!profileLoading) {
            // Token exists but no profile loaded and not loading - go to Home anyway
            console.log('⚠️ Token exists but no profile - navigating to Home');
            navigation.replace('Home');
          }
      } else {
        console.log('⚠️ User not authenticated - navigating to Intro');
          (navigation as any).replace('Intro');
      }
      }, 2000);

    return () => clearTimeout(timer);
    }, [token, profile, profileLoading, navigation]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.text}>Klatchup 🎉</Text>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.subtitle}>Restoring your session...</Text>
      </View>
    </ScreenWrapper>
  )
}

export default SplashScreen
