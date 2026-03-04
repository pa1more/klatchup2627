import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import ToolbarIcon from '../../components/ToolbarIcon';
import { useNavigation } from '@react-navigation/native';
import { DesignSystem } from '../../theme/DesignSystem';
import UsersListItem from './UsersListItem';
import EmptyState from '../../components/EmptyState';
import AlertModal from '../../components/AlertModal';
import { useDispatch, useSelector } from "react-redux";
import { sampleAction, sampleSelector } from "../../slices/sample";
import { RootState } from '../../store';
import { getMobileRequest, getProfileLocationRequest, resetMobileExecuted, resetProfileLocationExecuted, updateProfileRequest } from "../../slices/profile";
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { compose } from '@reduxjs/toolkit';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '90%',
  },
  containerToolbar: {
    flexDirection: 'row',
    height: 56,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  containerOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLeave: {
    color: DesignSystem.colors.white,
    fontSize: 16,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  list: {},
});

const SocietyUsersScreen = ({ route }: any) => {

  const navigation = useNavigation()
  const dispatch = useDispatch();

  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);
  const updateExecuted: boolean = useSelector((state: RootState) => state.profile.updateProfileExecuted);
  const updateError: any = useSelector((state: RootState) => state.profile.error);

  const getLocationprofile: any = useSelector((state: RootState) => state.profile.profileLocation);
  const profileLocation_Loading: any = useSelector((state: RootState) => state.profile.profileLocation_isLoading);
  const profileLocationexecuted: boolean = useSelector((state: RootState) => state.profile.profileLocationexecuted);
  const profileLocation_error: any = useSelector((state: RootState) => state.profile.profileLocation_error);

  let profileIdToRemove = getprofile.profile.profileId;
  let loggedInUserFriendReq = getprofile.profile.friendRequest;
  let loggedInUserFriends = getprofile.profile.friends;

  const { checkedInUsers, isLoading, error } = useSelector(sampleSelector);
  const { item, latitude, longitude } = route.params;
  const [refreshKey, setRefreshKey] = useState(0);
  const [mobile, setMobileNo] = useState('0');
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [listData, setListData] = useState([
    // {
    //   profilePicture: 'https://randomuser.me/api/portraits/women/24.jpg',
    //   age: '22',
    //   interests: [
    //     'Music',
    //     'Food',
    //     'Science & Technology',
    //     'Pets',
    //     'Entrepreneurship',
    //   ],
    //   isRequested: false,
    // }
  ]);

  const calculateYearsFromDate = (dateString: string | null | undefined): number => {
    if (!dateString || dateString.trim() === '') {
      return 0; // or return -1 to indicate "invalid input"
    }

    const birthDate = new Date(dateString);
    const today = new Date();

    // Invalid date check
    if (isNaN(birthDate.getTime())) {
      return 0; // or return -1 to indicate "invalid date format"
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }
    return age;
  };


  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const onPressItem = (item: any) => {
    navigation.replace('UserProfile', { item });
  }

  const onPressYes = () => {

    const profile = {
      name: getprofile.profile.name,
      mobile: getprofile.profile.mobile,
      birthDate: getprofile.profile.birthDate,
      gender: getprofile.profile.gender,
      interests: typeof getprofile.profile.interests === 'string'
        ? JSON.parse(getprofile.profile.interests || '[]')
        : getprofile.profile.interests,
      city: getprofile.profile.city,
      bio: getprofile.profile.bio,
      profilePicture: getprofile.profile.profilePic || "",
      showPictures: typeof getprofile.profile.showPictures === 'string'
        ? JSON.parse(getprofile.profile.showPictures || '[]')
        : getprofile.profile.showPictures,
      work: "Software Engineer",
      education: "B.Tech",
      friendRequest: { "user_ids": [] },
      friends: { "user_ids": [] },
      lookingFor: getprofile.profile.lookingFor,
      currentLocation: { placeName: "", lat: latitude.toString(), long: longitude.toString() },// { placeName: "New York", lat: "40.7128", long: "-74.0060" },
      isActive: true,
      isDeleted: false,
      updatedAt: true
    };
    const profileId = getprofile.profile.profileId;
    dispatch(updateProfileRequest({ profile, profileId }));

  }

  useEffect(() => {

    if (item) {
      const profile = {
        name: getprofile.profile.name,
        mobile: getprofile.profile.mobile,
        birthDate: getprofile.profile.birthDate,
        gender: getprofile.profile.gender,
        interests: typeof getprofile.profile.interests === 'string'
          ? JSON.parse(getprofile.profile.interests || '[]')
          : getprofile.profile.interests,
        city: getprofile.profile.city,
        bio: getprofile.profile.bio,
        profilePicture: getprofile.profile.profilePicture || "",
        showPictures: typeof getprofile.profile.showPictures === 'string'
          ? JSON.parse(getprofile.profile.showPictures || '[]')
          : getprofile.profile.showPictures,
        work: "Software Engineer",
        education: "B.Tech",
        friendRequest: typeof getprofile.profile.friendRequest === 'string'
          ? JSON.parse(getprofile.profile.friendRequest || '[]')
          : getprofile.profile.friendRequest,
        friends: typeof getprofile.profile.friends === 'string'
          ? JSON.parse(getprofile.profile.friends || '[]')
          : getprofile.profile.friends,
        lookingFor: getprofile.profile.lookingFor,
        currentLocation: { placeName: item.displayName, lat: latitude.toString(), long: longitude.toString() },// { placeName: "New York", lat: "40.7128", long: "-74.0060" },
        isActive: true,
        isDeleted: false,
        updatedAt: true
      };
      const profileId = getprofile.profile.profileId;
      dispatch(updateProfileRequest({ profile, profileId }));
    }
  }, []);

  useEffect(() => {
    console.log("use effect")
    if (updateExecuted) {
      dispatch(getProfileLocationRequest(item.displayName));
    } else if (updateError != null) {
      return;
    }
  }, [updateExecuted, refreshKey]);

  useEffect(() => {

    if (profileLocationexecuted) {

      if (Array.isArray(getLocationprofile.profiles)) {
        const filteredData = getLocationprofile.profiles.filter((item: { profileId: any; }) => item.profileId !== profileIdToRemove);

        const finalFilteredData = filteredData.filter((item: any) => {
          try {
            const parsed = typeof item.friendRequest === 'string'
              ? JSON.parse(item.friendRequest || '[]')
              : item.friendRequest;
            const userIds = parsed.user_ids || [];
            console.log(userIds)
            return !userIds.includes(profileIdToRemove);
          } catch (err) {
            console.warn('Invalid friendRequest JSON:', item.friendRequest);
            return true; // keep if parsing fails
          }
        });
        setListData(finalFilteredData);
      }
      else { setListData([]) }
      dispatch(resetProfileLocationExecuted());
    } else if (updateError != null) {
      return;
    }

  }, [profileLocationexecuted]);

  return (

    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.containerToolbar}>
          <ToolbarIcon onPress={navigation.goBack} />
          <View style={{ flex: 1 }} />
          <View style={styles.containerOptions}>
            <ToolbarIcon
              icon={require('../../assets/icons/ic_filter.png')}
              style={{ marginHorizontal: 10 }}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setShowLeaveConfirmModal(true)}>
              <Text style={styles.textLeave}>Leave</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={listData}
          ListEmptyComponent={() => (
            <EmptyState
              icon="🔍"
              title="No People Found"
              subtitle="There are no people around your location. Try expanding your search or visit another location!"
              buttonText="Find Another Location"
              onButtonPress={() => { /* Navigate to location selection */ }}
            />
          )}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <UsersListItem
              name={item['name']}
              item={item}
              imageUrl={item['profilePicture']}
              age={calculateYearsFromDate(item['birthDate']).toString()}
              interests={item['interests']}
              isRequested={false}
              onProfileUpdated={handleRefresh}
              loggedInUserFriendReq={loggedInUserFriendReq}
              loggedInUserFriends={loggedInUserFriends}
              onPress={() => onPressItem(item)}
            />
          )}
          keyExtractor={item => item.profileId.toString()}
        />
      </View>

      <AlertModal
        isVisible={showLeaveConfirmModal}
        hideModal={() => console.log("parendt click")}
        title="Leave from location"
        message="Do you want to leave from this location?"
        onPressYes={() => {
          console.log("YES clicked");
          onPressYes();
          setShowLeaveConfirmModal(false);
          // perform leave logic here
        }}
        onPressNo={() => {
          console.log("NO clicked");
          setShowLeaveConfirmModal(false);
        }}
      />
      {/* <Loader visible={profileLocation_Loading} message="Refreshing..." spinnerColor="#F58C00" /> */}
    </ScreenWrapper>
  );
};

export default SocietyUsersScreen;
