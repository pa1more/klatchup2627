import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from '../../components/Toolbar';
import BottomBar from '../../components/BottomBar';
import RequestsListItem from './RequestsListItem';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getFriendProfileRequest } from '../../slices/profile';
import Loader from '../../components/Loader';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: '100%',
  },
  containerMain: {
    flex: 1,
  },
  list: {
    paddingBottom: 50,
  },
});

const KlatchupRequestsScreen = () => {

  const [listData, setListData] = useState([
    // {
    //   imageUrl: 'https://randomuser.me/api/portraits/women/24.jpg',
    //   age: '22',
    //   interests: [
    //     'Music',
    //     'Food',
    //     'Science & Technology',
    //     'Pets',
    //     'Entrepreneurship',
    //   ],
    // },

  ]);

  const dispatch = useDispatch();
  const Friendprofile: any = useSelector((state: RootState) => state.profile.friendRequest);
  console.log(Friendprofile)
  const Friendprofile_Loading: any = useSelector((state: RootState) => state.profile.friendRequest_isLoading);
  const FriendExecuted = useSelector((state: RootState) => state.profile.friendRequestexecuted);
  const FriendError = useSelector((state: RootState) => state.profile.friendRequest_error);
  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);


  const onPressItem = (item: never) => { console.log("pressed") }

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    console.log("handleRefresh")
    setRefreshKey(prev => prev + 1);
  };

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

  useEffect(() => {
    if (FriendExecuted) {
      setListData(Friendprofile.profiles);
    } else if (FriendError != null) {
      setListData([])
      return;
    }
  }, [Friendprofile]);

  useEffect(() => {
    console.log("refresh")
    dispatch(getFriendProfileRequest(getprofile.profile.profileId));
  }, [refreshKey])

  useEffect(() => {
    dispatch(getFriendProfileRequest(getprofile.profile.profileId));
  }, [])

  return (

    <ScreenWrapper>
      <View style={styles.container}>
        <Toolbar title="KlatchUp Requests" />
        <FlatList
          data={listData}
          ListEmptyComponent={() => (
            <ListEmptyComponent
              title="Oops.. The profile list is empty."
              message="Go to find the friends around you like."
            />
          )}
          style={styles.containerMain}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RequestsListItem
              name={item['name']}
              item={item}
              imageUrl={item['profilePicture']}
              age={calculateYearsFromDate(item['birthDate']).toString()}
              interests={item['interests']}
              onProfileUpdated={handleRefresh}
              onPress={() => onPressItem(item)}
            />
          )}
          keyExtractor={item => item.profileId.toString()}
        />
        <Loader visible={Friendprofile_Loading} message="Refreshing..." spinnerColor="#F58C00" />
        <BottomBar />
      </View>
    </ScreenWrapper>
  );
};

export default KlatchupRequestsScreen;
