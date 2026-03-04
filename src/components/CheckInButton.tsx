import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkInAPI, checkOutAPI } from '../services/checkinService';
import { locationTrackingService } from '../services/locationTrackingService';
import { DesignSystem } from '../theme/DesignSystem';

interface Props {
  placeName?: string;
  latitude?: number;
  longitude?: number;
  onCheckInComplete?: () => void;
}

const CheckInButton: React.FC<Props> = ({ 
  placeName = 'McDonald\'s - Hijewadi Happiness Street',
  latitude = 18.5912, 
  longitude = 73.8235,
  onCheckInComplete 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  
  const token = useSelector((state: RootState) => state.sample.token);

  // Load check-in state from AsyncStorage on component mount
  useEffect(() => {
    const loadCheckInState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('isCheckedIn');
        setIsCheckedIn(savedState === 'true');
        console.log('✅ Loaded check-in state:', savedState === 'true');
      } catch (error) {
        console.error('Failed to load check-in state:', error);
      }
    };
    loadCheckInState();
  }, []);

  const handleCheckIn = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

    setIsLoading(true);
    try {
      await checkInAPI(token, {
        placeName,
        latitude,
        longitude
      });

      // Start location tracking for auto-checkout at 1km
      await locationTrackingService.startTracking(token);

      // Store check-in status
      await AsyncStorage.setItem('isCheckedIn', 'true');
      await AsyncStorage.setItem('checkedInPlace', placeName);
      await AsyncStorage.setItem('checkedInLat', latitude.toString());
      await AsyncStorage.setItem('checkedInLong', longitude.toString());

      setIsCheckedIn(true);
      Alert.alert('Success', `Checked in at ${placeName}\n\nLocation tracking active - Auto-checkout at 1km`);
      
      if (onCheckInComplete) {
        onCheckInComplete();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

    setIsLoading(true);
    try {
      // Stop location tracking
      locationTrackingService.stopTracking();

      await checkOutAPI(token);

      // Clear check-in status
      await AsyncStorage.removeItem('isCheckedIn');
      await AsyncStorage.removeItem('checkedInPlace');
      await AsyncStorage.removeItem('checkedInLat');
      await AsyncStorage.removeItem('checkedInLong');

      setIsCheckedIn(false);
      Alert.alert('Success', 'Checked out from location');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check out');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <TouchableOpacity style={[styles.button, styles.loadingButton]}>
        <ActivityIndicator color={DesignSystem.colors.white} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.button, isCheckedIn && styles.checkoutButton]}
      onPress={isCheckedIn ? handleCheckOut : handleCheckIn}
    >
      <Text style={styles.buttonText}>
        {isCheckedIn ? '✓ Checked In' : 'Check In Here'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: DesignSystem.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  loadingButton: {
    opacity: 0.7,
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: DesignSystem.colors.white,
    fontSize: 16,
    fontWeight: '500',
  }
});

export default CheckInButton;
