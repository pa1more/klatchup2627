import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import GradientBorderView from '../../components/GradientBorderView';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts';
import { connectDatabaseEmulator } from '@react-native-firebase/database';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { updateFreindProfileRequest, updateProfileRequest } from '../../slices/profile';

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginVertical: 5,
  },
  btn: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#300943',
    borderRadius: 20,
  },
  imgDp: {
    height: 80,
    width: 80,
    borderRadius: 20,
  },
  containerDp: {
    borderRadius: 20,
  },
  textAge: {
    color: Colors.white,
    fontFamily: Fonts.PromptRegular,
    position: 'absolute',
    bottom: 0,
    right: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  textName: {
    color: Colors.white,
    fontFamily: Fonts.PromptRegular,
    position: 'absolute',
    top: 5,              // space from top
    right: 5,            // space from right
    maxWidth: '90%',     // prevent overflow from container
    textAlign: 'right',  // align text to right edge
    flexWrap: 'wrap',    // allow text to wrap
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  containerInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
    flex: 1,
  },
  containerInterest: {
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 5,
    marginVertical: 4,
  },
  textInterest: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.PromptRegular,
  },
  textRequested: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.PromptRegular,
  },
  containerRequested: {
    backgroundColor: '#555555',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 1,
  },
  textAccept: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: Fonts.PromptRegular,
  },
})

interface Props {
  name: string,
  item: any
  imageUrl: string
  age: string
  interests: string[]
  loggedInUserFriendReq: string[]
  loggedInUserFriends: string[]
  onPress: () => void
  isRequested: boolean
  onProfileUpdated: () => void
}

const defaultProps: Props = {
  name: '',
  item: {},
  imageUrl: '',
  age: '',
  interests: [],
  loggedInUserFriendReq: [],
  loggedInUserFriends: [],
  onPress: () => { },
  isRequested: false,
  onProfileUpdated: () => { },
}

const UsersListItem = ({
  name,
  item,
  imageUrl,
  age,
  interests,
  isRequested,
  onProfileUpdated,
  loggedInUserFriendReq,
  loggedInUserFriends,
  onPress,
}: Props) => {

  const dispatch = useDispatch();

  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);

  const parsedInterests = typeof interests === 'string' ? JSON.parse(interests) : interests;

  let temp_friend = { user_ids: [] };
  try {
    const friendRequest = item.friendRequest;
    temp_friend =
      typeof friendRequest === 'string'
        ? JSON.parse(friendRequest)
        : typeof friendRequest === 'object' && friendRequest !== null
          ? JSON.parse(JSON.stringify(friendRequest))  // clone to avoid immutability
          : { user_ids: [] };
  } catch (e) {
    temp_friend = { user_ids: [] };
  }
  console.log(loggedInUserFriendReq)
  // function addUserIdToResponse(response: any, newUserId: any) {
  //   // Add newUserId if it's a non-empty string and not already in the array
  //   if (typeof newUserId === 'string' && newUserId.trim() !== '' && !response.user_ids.includes(newUserId)) {
  //     response.user_ids.push(newUserId);
  //   }

  //   return response;
  // }

  function addUserIdToResponse(response: any, newUserId: any) {
    // Deep clone to avoid mutating original
    const clonedResponse = JSON.parse(JSON.stringify(response));
    // Ensure user_ids is an array
    if (!Array.isArray(clonedResponse.user_ids)) {
      clonedResponse.user_ids = [];
    }
    // Add newUserId if it's valid and not already included
    if (newUserId && !clonedResponse.user_ids.includes(newUserId)) {
      clonedResponse.user_ids.push(newUserId);
    }
    return clonedResponse;
  }

  const onAcceptPress = () => {

    console.log("tressed")
    let friendreqArr = addUserIdToResponse(temp_friend, getprofile.profile.profileId);
    console.log(friendreqArr)
    const profile = {
      name: item.name,
      mobile: item.mobile,
      birthDate: item.birthDate,
      gender: item.gender,
      interests: parsedInterests,
      city: item.city,
      bio: item.bio,
      profilePicture: item.profilePicture,
      showPictures: JSON.parse(item.showPictures),
      work: item.work,
      education: item.education,
      friendRequest: friendreqArr,
      friends: JSON.parse(item.friends),
      lookingFor: item.lookingFor,
      currentLocation: JSON.parse(item.currentLocation),
      isActive: true,
      isDeleted: false,
      updatedAt: true
    };
    console.log(profile)
    const profileId = item.profileId;
    dispatch(updateFreindProfileRequest({ profile, profileId }));
    onProfileUpdated();
  }

  return (

    <GradientBorderView borderWidth={1} styles={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={styles.btn}>
        {isRequested && (
          <View style={styles.containerRequested}>
            <Text style={styles.textRequested}>Requested</Text>
          </View>
        )}

        <GradientBorderView styles={styles.containerDp}>

          <Image style={styles.imgDp}
            source={imageUrl && imageUrl.trim() !== ''
              ? { uri: imageUrl }
              : require('../../assets/images/intro.png')} />
          <Text style={styles.textAge}>{age}</Text>
        </GradientBorderView>
        <Text style={styles.textName}>{name}</Text>
        <View style={styles.containerInterests}>
          {parsedInterests.length > 0 && (
            <>
              {parsedInterests.map((interest: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; subInterest: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                <View style={styles.containerInterest} key={index}>
                  <Text style={styles.textInterest}>
                    {interest.name} - {interest.subInterest}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={() => onAcceptPress()}>
        <Text style={styles.textAccept}>Send Request</Text>
      </TouchableOpacity> */}
      {/* {
        loggedInUserFriendReq.user_ids.includes(item?.profileId) ? (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textAccept}>Requested</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => onAcceptPress()}>
            <Text style={styles.textAccept}>Send Request</Text>
          </TouchableOpacity>
        )
      } */}
      {
        loggedInUserFriends.user_ids.includes(item?.profileId) ? (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textAccept}>Request accepted</Text>
          </TouchableOpacity>
        ) : loggedInUserFriendReq.user_ids.includes(item?.profileId) ? (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textAccept}>Requested</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => onAcceptPress()}>
            <Text style={styles.textAccept}>Send Request</Text>
          </TouchableOpacity>
        )
      }
    </GradientBorderView>
  );
};

UsersListItem.defaultProps = defaultProps;

export default UsersListItem;
