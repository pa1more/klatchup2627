import React, { useState, useEffect } from 'react';
import { Alert, FlatList, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Fonts from '../../theme/Fonts';
import Colors from '../../theme/Colors';
import { useNavigation } from '@react-navigation/native';
import Toolbar from '../../components/Toolbar';
import SocietyResultsListItem from './SocietyResultsListItem';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import Finding from '../../components/FindingAnimation';
import { useDispatch, useSelector } from "react-redux";
import { sampleAction, sampleSelector } from "../../slices/sample";

import Geolocation from 'react-native-geolocation-service';
import { compose } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../../store';


const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: '90%',
  },
  textTitle: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: Fonts.UnboundedMedium,
  },
  list: {
    paddingVertical: 20,
    flexGrow: 1,
  },
})

const FindingSocieryScreen = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { isLoading, location, error, locationexecuted } = useSelector(sampleSelector);

  let getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);

  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [listData, setListData] = useState([
  ])

  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();


  useEffect(() => {

    const loadLocation = async () => {

      try {
        const lat = await AsyncStorage.getItem('latitude');
        const lng = await AsyncStorage.getItem('longitude');
        const latitude = lat ? Number(lat) : 0;
        const longitude = lng ? Number(lng) : 0;
        setLatitude(latitude);
        setLongitude(longitude);
        dispatch(sampleAction.getSampleRequest({ longitude, latitude }));
      } catch (e) {
        console.error('Error reading location from storage', e);
      }
    };

    loadLocation();

    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }, [])

  // useEffect(() => {

  //   if (locationexecuted) {
  //     let userLocation = JSON.parse(getprofile.profile.currentLocation);
  //     const matchedPlace = location.find((place: { displayName: string; }) =>
  //       place.displayName.toLowerCase() === userLocation.placeName.toLowerCase()
  //     );
  //     const filteredArray: any = matchedPlace ? [matchedPlace] : [];
  //     if (filteredArray.length > 0) {
  //       setIsActive(true);
  //       setListData(filteredArray);
  //     } else { setIsActive(false); setListData(location); }
  //   } else if (error != null) {
  //     dispatch(sampleAction.resetSampleRequest())
  //     Alert.alert('Error', error + latitude + " " + longitude);
  //     return;
  //   }
  // }, [error, location]);

  useEffect(() => {

    if (locationexecuted && getprofile?.profile?.currentLocation) {
      let userLocation;

      try {
        // Check if currentLocation is a string before parsing
        userLocation = typeof getprofile.profile.currentLocation === 'string'
          ? JSON.parse(getprofile.profile.currentLocation)
          : getprofile.profile.currentLocation;
      } catch (e) {
        console.error('Failed to parse currentLocation:', e);
        return; // Exit to avoid crash
      }

      const matchedPlace = location.find((place: { displayName: string }) =>
        place.displayName.toLowerCase() === userLocation?.placeName?.toLowerCase()
      );

      const filteredArray = matchedPlace ? [matchedPlace] : [];

      if (filteredArray.length > 0) {
        setIsActive(true);
        setListData(filteredArray);
      } else {
        setIsActive(false);
        setListData(location);
      }
    } else if (error != null) {
      dispatch(sampleAction.resetSampleRequest());
      Alert.alert('Error', error + latitude + ' ' + longitude);
    }

    // Optional: clean up list when unmounting
    return () => {
      setListData([]);
      setIsActive(false);
    };
  }, [locationexecuted, location, error, getprofile?.profile?.currentLocation]);

  const onPressItem = (item: any) => navigation.navigate('SocietyUsers', { item, latitude, longitude })

  return (
    <ScreenWrapper>
      <Toolbar title={''} />
      {isLoading ? (
        <Finding />
      ) : (
        <View style={styles.container}>
          <Text style={styles.textTitle}>We hope you have a good time!</Text>
          <FlatList
            data={listData}
            ListEmptyComponent={() => (
              <ListEmptyComponent
                title="No result found."
                message="Proper navigation wherever you are, never worry about connecting."
              />
            )}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <SocietyResultsListItem
                key={item['id']}
                name={item['displayName']}
                address={item['formattedAddress']}
                active={isActive}
                onPress={() => onPressItem(item)}
              />
            )}
            keyExtractor={item => item.displayName}
          />
        </View>
      )}
    </ScreenWrapper>
  )
}

export default FindingSocieryScreen;
