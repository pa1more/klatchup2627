import { AppState, AppStateStatus } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateLocationAPI } from './checkinService';

interface Position {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface GeoError {
  code: number;
  message: string;
}

class LocationTrackingService {
  private appState: AppStateStatus = 'active';
  private appStateSubscription: any = null;
  private locationWatchId: number | null = null;
  private isTracking = false;
  private lastUpdateTime = 0;
  private updateInterval = 30000; // 30 seconds in milliseconds

  /**
   * Start tracking user location every 30 seconds
   * Auto-checkout if user moves more than 1km from check-in location
   */
  async startTracking(token: string) {
    if (this.isTracking) {
      console.log('Location tracking already active');
      return;
    }

    this.isTracking = true;
    console.log('🗺️ Starting location tracking service...');

    // Check location every 30 seconds
    this.locationWatchId = Geolocation.watchPosition(
      async (position: Position) => {
        const now = Date.now();
        // Only update if 30 seconds have passed
        if (now - this.lastUpdateTime < this.updateInterval) {
          return;
        }
        this.lastUpdateTime = now;

        const { latitude, longitude } = position.coords;
        console.log(`📍 Location updated: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        try {
          // Update location on backend (triggers auto-checkout if >1km)
          await updateLocationAPI(token, { latitude, longitude });
        } catch (error) {
          console.error('Failed to update location:', error);
        }
      },
      (error: GeoError) => {
        console.error('Location tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 50, // Update when moved 50m
      }
    );

    // Also setup app state listener
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  /**
   * Stop tracking user location
   */
  stopTracking() {
    if (this.locationWatchId !== null) {
      Geolocation.clearWatch(this.locationWatchId);
      this.locationWatchId = null;
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    this.isTracking = false;
    console.log('🛑 Location tracking stopped');
  }

  private handleAppStateChange = (status: AppStateStatus) => {
    this.appState = status;
    console.log(`App state changed to: ${status}`);

    if (status === 'background' || status === 'inactive') {
      // Continue tracking in background (iOS requires special setup)
      console.log('App moved to background - location tracking continues');
    } else if (status === 'active') {
      console.log('App is active again');
    }
  };

  /**
   * Check if user is still within 1km of check-in location
   */
  async checkIfWithinCheckInRadius(): Promise<boolean> {
    const checkedInPlace = await AsyncStorage.getItem('checkedInPlace');
    const checkedInLat = await AsyncStorage.getItem('checkedInLat');
    const checkedInLong = await AsyncStorage.getItem('checkedInLong');

    if (!checkedInPlace || !checkedInLat || !checkedInLong) {
      return false;
    }

    try {
      const position = await new Promise<Position>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (pos) => resolve(pos as Position),
          (err) => reject(err),
          {
            enableHighAccuracy: true,
          }
        );
      });

      const { latitude, longitude } = position.coords;
      const distance = this.calculateDistance(
        parseFloat(checkedInLat),
        parseFloat(checkedInLong),
        latitude,
        longitude
      );

      return distance <= 1; // Within 1km
    } catch (error) {
      console.error('Failed to check location:', error);
      return false;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  isTrackingActive() {
    return this.isTracking;
  }
}

// Export singleton instance
export const locationTrackingService = new LocationTrackingService();
