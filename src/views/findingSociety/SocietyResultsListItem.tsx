import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { DesignSystem } from '../../theme/DesignSystem';
import GradientText from '../../components/GradientText';
import GradientBorderView from '../../components/GradientBorderView'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { checkInAPI } from '../../services/checkinService';
import { locationTrackingService } from '../../services/locationTrackingService';

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginVertical: 5,
  },
  btn: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#300943',
    borderRadius: 20,
  },
  textName: {
    fontSize: 18,
    fontWeight: '500',
    color: DesignSystem.colors.white,
  },
  textAddress: {
    fontSize: 16,
    fontWeight: '400',
    color: DesignSystem.colors.white,
  },
  containerText: {
    flex: 3,
  },
  textGetIn: {
    fontSize: 18,
    fontWeight: '500',
  },
  containerGetIn: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  activeLabel: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#28a745', // Bootstrap green
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12, // slightly larger font
    fontWeight: '600',
    overflow: 'hidden',
    zIndex: 1,
  },
  checkInButton: {
    backgroundColor: DesignSystem.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  checkInButtonText: {
    color: DesignSystem.colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingButton: {
    opacity: 0.6,
  },
});

interface Props {
  name: string
  address: string
  onPress: () => void
  onCheckIn?: (placeName: string, latitude: number, longitude: number) => void
  active: boolean
  latitude?: number
  longitude?: number
}

const defaultProps: Props = {
  name: '',
  address: '',
  onPress: () => { },
  active: false,
  latitude: 0,
  longitude: 0,
};

const SocietyResultsListItem = ({ name, address, active, onPress, onCheckIn, latitude = 0, longitude = 0 }: Props) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const token = useSelector((state: RootState) => state.sample.token);

  const handleCheckIn = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert('Error', 'Location data not available');
      return;
    }

    setIsCheckingIn(true);
    try {
      console.log(`🔵 Checking in at: ${name}`);
      await checkInAPI(token, {
        placeName: name,
        latitude,
        longitude
      });

      // Start location tracking for auto-checkout at 1km
      await locationTrackingService.startTracking(token);

      // Store check-in status
      await AsyncStorage.setItem('isCheckedIn', 'true');
      await AsyncStorage.setItem('checkedInPlace', name);
      await AsyncStorage.setItem('checkedInLat', latitude.toString());
      await AsyncStorage.setItem('checkedInLong', longitude.toString());

      console.log(`✅ Checked in at: ${name}`);
      Alert.alert('Success', `Checked in at ${name}\n\nLocation tracking active - Auto-checkout at 1km`);

      // Callback to parent component
      if (onCheckIn) {
        onCheckIn(name, latitude, longitude);
      }
    } catch (error: any) {
      console.error(`❌ Check-in failed:`, error);
      Alert.alert('Error', error.message || 'Failed to check in');
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <GradientBorderView borderWidth={1} styles={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={styles.btn}>
        {/* Active label in top-right */}
        {active && <Text style={styles.activeLabel}>Active</Text>}
        
        <View style={styles.containerText}>
          <Text style={styles.textName}>{name}</Text>
          <Text style={styles.textAddress}>{address}</Text>
        </View>

        <View style={styles.containerGetIn}>
          {!active ? (
            <TouchableOpacity
              style={[styles.checkInButton, isCheckingIn && styles.loadingButton]}
              onPress={handleCheckIn}
              disabled={isCheckingIn}
            >
              {isCheckingIn ? (
                <ActivityIndicator size="small" color={DesignSystem.colors.white} />
              ) : (
                <Text style={styles.checkInButtonText}>Check In</Text>
              )}
            </TouchableOpacity>
          ) : (
            <GradientText
              style={styles.textGetIn}
              colors={['#28a745', '#1a6d2f']}
              underline>
              Checked In
            </GradientText>
          )}
        </View>
      </TouchableOpacity>
    </GradientBorderView>
  );
};;

SocietyResultsListItem.defaultProps = defaultProps

export default SocietyResultsListItem;
