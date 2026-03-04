import React, { useState, useEffect } from 'react';
import { Alert, FlatList, PermissionsAndroid, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { DesignSystem } from '../../theme/DesignSystem';
import { useNavigation } from '@react-navigation/native';
import Toolbar from '../../components/Toolbar';
import SocietyResultsListItem from './SocietyResultsListItem';
import UsersListItem from '../societyUsers/UsersListItem';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import Finding from '../../components/FindingAnimation';
import { useDispatch, useSelector } from "react-redux";
import { sampleAction, sampleSelector } from "../../slices/sample";
import RadiusSelector from '../../components/RadiusSelector';
import PlaceTypeSelector from '../../components/PlaceTypeSelector';

import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../../store';


const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: '90%',
  },
  textTitle: {
    color: DesignSystem.colors.white,
    fontSize: 24,
    fontWeight: '600',
  },
  list: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  filterContainer: {
    marginVertical: 10,
  },
  searchButton: {
    backgroundColor: DesignSystem.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  searchButtonText: {
    color: DesignSystem.colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: DesignSystem.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabTextActive: {
    color: DesignSystem.colors.white,
    fontWeight: '500',
  },
})

const FindingSocieryScreen = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { isLoading, location, error, locationexecuted, nearbyUsers, nearbyUsersExecuted } = useSelector(sampleSelector);

  let getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);

  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [listData, setListData] = useState([])
  const [nearbyUsersList, setNearbyUsersList] = useState([])

  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [selectedRadius, setSelectedRadius] = useState<number>(1000); // Default 1km
  const [selectedPlaceTypes, setSelectedPlaceTypes] = useState<string[]>([
    'restaurant', 'cafe', 'bar', 'night_club', 'movie_theater', 'park', 'gym',
    'bowling_alley', 'sports_bar', 'coffee_shop', 'amusement_park'
  ]);
  const [activeTab, setActiveTab] = useState<'places' | 'users'>('places');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkedInPlace, setCheckedInPlace] = useState<string>('');

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Klatchup needs access to your location to find nearby places.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      }
    );
    return status === PermissionsAndroid.RESULTS.GRANTED;
  };

  const fetchCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Location Required', 'Please enable location permission to search nearby places.');
      return null;
    }

    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const searchPlaces = (lat: number, lng: number, radius: number, types: string[]) => {
    if (lat && lng) {
      dispatch(sampleAction.getSampleRequest({ 
        longitude: lng, 
        latitude: lat,
        radiusMeters: radius,
        placeTypes: types
      }));
    }
  };

  const searchNearbyUsers = async (lat: number, lng: number, radius: number) => {
    if (lat && lng) {
      // Check if user is checked in at a place
      const checkedInStatus = await AsyncStorage.getItem('isCheckedIn');
      const checkedPlace = await AsyncStorage.getItem('checkedInPlace');

      if (checkedInStatus === 'true' && checkedPlace) {
        console.log('✅ User is checked in at:', checkedPlace);
        console.log('🔍 Fetching online users at place:', checkedPlace);
        // Fetch online users at checked-in place using new endpoint
        dispatch(sampleAction.getOnlineUsersAtPlaceRequest(checkedPlace));
        setCheckedInPlace(checkedPlace);
        setIsCheckedIn(true);
      } else {
        // Fallback to nearby users within radius
        console.log('🔍 Searching nearby users at', lat, lng, 'with radius', radius);
        dispatch(sampleAction.getNearbyUsersRequest({
          latitude: lat,
          longitude: lng,
          radiusMeters: radius
        }));
        setIsCheckedIn(false);
      }
    }
  };

  useEffect(() => {
    // Clear old cached results first
    dispatch(sampleAction.resetSampleRequest());
    setListData([]);
    
    const loadLocation = async () => {
      try {
        const lat = await AsyncStorage.getItem('latitude');
        const lng = await AsyncStorage.getItem('longitude');
        let storedLatitude = lat ? Number(lat) : undefined;
        let storedLongitude = lng ? Number(lng) : undefined;

        if (storedLatitude == null || storedLongitude == null) {
          const current = await fetchCurrentLocation();
          if (!current) return;
          storedLatitude = current.latitude;
          storedLongitude = current.longitude;
          await AsyncStorage.setItem('latitude', String(storedLatitude));
          await AsyncStorage.setItem('longitude', String(storedLongitude));
        }

        setLatitude(storedLatitude);
        setLongitude(storedLongitude);
        
        // Fetch with default radius and place types (restaurants, cafes, bars, pubs)
        searchPlaces(storedLatitude, storedLongitude, selectedRadius, selectedPlaceTypes);
      } catch (e) {
        console.error('Error reading location from storage', e);
        Alert.alert('Location Error', 'Unable to read your location. Please try again.');
      }
    };

    loadLocation();

    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }, [])

  useEffect(() => {
    if (locationexecuted) {
      // Safely extract places array from location (could be array or object with places property)
      const placesArray = Array.isArray(location) 
        ? location 
        : (location?.places || location || []);

      if (getprofile?.profile?.currentLocation) {
        let userLocation;

        try {
          // Check if currentLocation is a string before parsing
          userLocation = typeof getprofile.profile.currentLocation === 'string'
            ? JSON.parse(getprofile.profile.currentLocation)
            : getprofile.profile.currentLocation;
        } catch (e) {
          console.error('Failed to parse currentLocation:', e);
          setListData(placesArray);
          return; // Exit to avoid crash
        }

        // Only try to find if we have a valid array
        if (Array.isArray(placesArray) && placesArray.length > 0) {
          const matchedPlace = placesArray.find((place: any) => {
            // Safely extract displayName string (could be object or string)
            const placeName = typeof place.displayName === 'object' 
              ? place.displayName?.text 
              : place.displayName;
            const userPlaceName = userLocation?.placeName;
            
            // Safe comparison with null checks
            return placeName && userPlaceName && 
                   String(placeName).toLowerCase() === String(userPlaceName).toLowerCase();
          });

          const filteredArray = matchedPlace ? [matchedPlace] : [];

          if (filteredArray.length > 0) {
            setIsActive(true);
            setListData(filteredArray);
          } else {
            setIsActive(false);
            setListData(placesArray);
          }
        } else {
          setIsActive(false);
          setListData([]);
        }
      } else {
        // No user location, just show all places
        setIsActive(false);
        setListData(Array.isArray(placesArray) ? placesArray : []);
      }
    } else if (error != null) {
      dispatch(sampleAction.resetSampleRequest());
      Alert.alert('Error', error);
    }

    // Optional: clean up list when unmounting
    return () => {
      setListData([]);
      setIsActive(false);
    };
  }, [locationexecuted, location, error, getprofile?.profile?.currentLocation]);

  useEffect(() => {
    if (nearbyUsersExecuted) {
      console.log('� nearbyUsersExecuted triggered');
      console.log('👥 nearbyUsers from Redux:', nearbyUsers);
      console.log('👥 nearbyUsers type:', typeof nearbyUsers, 'isArray:', Array.isArray(nearbyUsers));
      console.log('👥 nearbyUsers length:', nearbyUsers?.length || 0);
      
      // Filter out any undefined or invalid users
      let validUsers: any[] = [];
      
      if (Array.isArray(nearbyUsers)) {
        validUsers = nearbyUsers
          .filter((user: any) => {
            if (!user) {
              console.warn('⚠️ Filtered out undefined user');
              return false;
            }
            if (!user.profileId && !user.id) {
              console.warn('⚠️ Filtered out user without profileId/id:', user.name || 'Unknown');
              return false;
            }
            return true;
          })
          .map((user: any) => ({
            ...user,
            profileId: user.profileId || user.id, // Ensure profileId exists
          }));
        
        console.log('👥 Valid users after filtering:', validUsers.length);
        console.log('👥 Valid users:', validUsers.map((u: any) => ({ id: u?.profileId, name: u?.name })));
      } else {
        console.warn('⚠️ nearbyUsers is not an array:', nearbyUsers);
      }
      
      setNearbyUsersList(validUsers);
    }
  }, [nearbyUsersExecuted, nearbyUsers]);

  const handleSearchPress = () => {
    if (latitude && longitude) {
      // Clear old results before new search
      dispatch(sampleAction.resetSampleRequest());
      setListData([]);
      setNearbyUsersList([]);
      
      if (activeTab === 'places') {
        searchPlaces(latitude, longitude, selectedRadius, selectedPlaceTypes);
      } else {
        searchNearbyUsers(latitude, longitude, selectedRadius);
      }
    } else {
      Alert.alert('Location Error', 'Location not available. Please try again.');
    }
  };

  const onPressItem = (item: any) => navigation.navigate('SocietyUsers', { item, latitude, longitude })

  const onPressUserItem = (item: any) => {
    navigation.navigate('UserProfile', { item });
  }

  const handleCheckIn = async (placeName: string, checkInLat: number, checkInLng: number) => {
    console.log(`✅ Check-in successful at: ${placeName}`);
    
    // Update local state
    setIsCheckedIn(true);
    setCheckedInPlace(placeName);
    
    // Switch to People tab
    setActiveTab('users');
    
    // Auto-search for people at this location after a short delay
    setTimeout(() => {
      if (latitude && longitude) {
        searchNearbyUsers(latitude, longitude, selectedRadius);
      }
    }, 500);
  };

  const calculateYearsFromDate = (dateString: string) => {
    if (!dateString) return 0;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <ScreenWrapper>
      <Toolbar title={''} />
      {isLoading ? (
        <Finding />
      ) : (
        <View style={styles.container}>
          <Text style={styles.textTitle}>Find near you!</Text>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'places' && styles.tabActive]}
              onPress={() => setActiveTab('places')}
            >
              <Text style={[styles.tabText, activeTab === 'places' && styles.tabTextActive]}>
                🏪 Places
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'users' && styles.tabActive]}
              onPress={() => setActiveTab('users')}
            >
              <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
                👥 People
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'users' && (
            <>
              {isCheckedIn && (
                <TouchableOpacity 
                  style={[styles.searchButton, { backgroundColor: '#FF9500' }]}
                  onPress={() => {
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('🏠 [FindingSociety] Chat button pressed');
                    console.log('🏠 checkedInPlace:', checkedInPlace);
                    console.log('🏠 isCheckedIn:', isCheckedIn);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    
                    navigation.navigate('LocationChat', { 
                      checkedInPlace,
                      latitude: latitude || 18.5912,
                      longitude: longitude || 73.8235 
                    });
                  }}
                >
                  <Text style={styles.searchButtonText}>
                    💬 Chat at {checkedInPlace}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <View style={styles.filterContainer}>
            <RadiusSelector 
              selectedRadius={selectedRadius}
              onSelectRadius={setSelectedRadius}
            />
            
            {activeTab === 'places' && (
              <PlaceTypeSelector 
                selectedTypes={selectedPlaceTypes}
                onSelectTypes={setSelectedPlaceTypes}
              />
            )}
            
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearchPress}
            >
              <Text style={styles.searchButtonText}>
                🔍 Search {activeTab === 'places' ? 'Places' : 'People'}
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'places' ? (
            <FlatList
              data={listData}
              ListEmptyComponent={() => (
                <ListEmptyComponent
                  title="No places found."
                  message="Try adjusting your search radius or place types."
                />
              )}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
                // Safely extract displayName (could be string or object)
                const displayName = typeof item.displayName === 'object' 
                  ? item.displayName?.text 
                  : item.displayName;
                
                return (
                  <SocietyResultsListItem
                    key={item.id}
                    name={displayName || 'Unknown'}
                    address={item.formattedAddress || ''}
                    active={isActive}
                    onPress={() => onPressItem(item)}
                    onCheckIn={handleCheckIn}
                    latitude={latitude}
                    longitude={longitude}
                  />
                );
              }}
              keyExtractor={(item, index) => item.id || `place-${index}`}
            />
          ) : (
            <FlatList
              data={nearbyUsersList.filter((item: any) => item && item.profileId)}
              ListEmptyComponent={() => (
                <ListEmptyComponent
                  title="No people found nearby."
                  message="Try increasing your search radius."
                />
              )}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
                if (!item) return null;
                return (
                  <UsersListItem
                    name={item['name'] || 'Unknown'}
                    item={item}
                    imageUrl={item['profilePicture']}
                    age={calculateYearsFromDate(item['birthDate'] || '').toString()}
                    interests={item['interests'] || []}
                    isRequested={false}
                    onProfileUpdated={() => {}}
                    loggedInUserFriendReq={getprofile?.profile?.friendRequest || { user_ids: [] }}
                    loggedInUserFriends={getprofile?.profile?.friends || { user_ids: [] }}
                    onPress={() => onPressUserItem(item)}
                  />
                );
              }}
              keyExtractor={(item, index) => item?.profileId || `user-${index}`}
            />
          )}
        </View>
      )}
    </ScreenWrapper>
  )
}

export default FindingSocieryScreen;
