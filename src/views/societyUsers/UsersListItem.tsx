import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View, Alert, ActivityIndicator } from 'react-native';
import GradientBorderView from '../../components/GradientBorderView';
import { DesignSystem } from '../../theme/DesignSystem';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { updateFreindProfileRequest, updateProfileRequest } from '../../slices/profile';

const styles = StyleSheet.create({
  container: {
    borderRadius: DesignSystem.borderRadius.xl,
    marginVertical: DesignSystem.spacing.xs,
  },
  btn: {
    flexDirection: 'row',
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.primary,
    borderRadius: DesignSystem.borderRadius.xl,
  },
  imgDp: {
    height: 80,
    width: 80,
    borderRadius: DesignSystem.borderRadius.xl,
  },
  containerDp: {
    borderRadius: DesignSystem.borderRadius.xl,
  },
  textAge: {
    color: DesignSystem.colors.white,
    fontFamily: DesignSystem.typography.fontFamily.primary,
    position: 'absolute',
    bottom: 0,
    right: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  textName: {
    color: DesignSystem.colors.white,
    fontFamily: DesignSystem.typography.fontFamily.primary,
    position: 'absolute',
    top: 5,
    right: 5,
    maxWidth: '90%',
    textAlign: 'right',
    flexWrap: 'wrap',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  containerInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: DesignSystem.spacing.md,
    flex: 1,
  },
  containerInterest: {
    marginHorizontal: DesignSystem.spacing.xs,
    borderWidth: 1,
    borderColor: DesignSystem.colors.white,
    borderRadius: DesignSystem.borderRadius.xl,
    paddingHorizontal: DesignSystem.spacing.xs,
    marginVertical: DesignSystem.spacing.xs,
  },
  textInterest: {
    color: DesignSystem.colors.white,
    fontSize: DesignSystem.typography.sizes.sm,
    fontFamily: DesignSystem.typography.fontFamily.primary,
  },
  textRequested: {
    color: DesignSystem.colors.white,
    fontSize: DesignSystem.typography.sizes.base,
    fontFamily: DesignSystem.typography.fontFamily.primary,
  },
  containerRequested: {
    backgroundColor: DesignSystem.colors.gray[600],
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
    borderTopRightRadius: DesignSystem.borderRadius.xl,
    borderBottomLeftRadius: DesignSystem.borderRadius.xl,
    paddingVertical: DesignSystem.spacing.xs,
    paddingHorizontal: DesignSystem.spacing.md,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.success,
    borderBottomLeftRadius: DesignSystem.borderRadius.xl,
    borderBottomRightRadius: DesignSystem.borderRadius.xl,
  },
  textAccept: {
    ...DesignSystem.typography.styles.button,
    color: DesignSystem.colors.white,
    fontWeight: '400',
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

  const [isLoading, setIsLoading] = useState(false);
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

    console.log("🎯 Klatchup button pressed for:", item.name)
    // Guard check: ensure profile exists
    if (!getprofile?.profile?.profileId) {
      console.warn('Profile data not available');
      Alert.alert('Error', 'Your profile data is not loaded. Please try again.');
      return;
    }
    
    setIsLoading(true);
    console.log('📤 Sending Klatchup request for:', item.name);
    console.log('   From user:', getprofile.profile.name, 'ID:', getprofile.profile.profileId);
    console.log('   To user:', item.name, 'ID:', item.profileId);
    
    let friendreqArr = addUserIdToResponse(temp_friend, getprofile.profile.profileId);
    console.log('   Updated friendRequest array:', friendreqArr);
    
    const profile = {
      name: item.name,
      mobile: item.mobile,
      birthDate: item.birthDate,
      gender: item.gender,
      interests: parsedInterests,
      city: item.city,
      bio: item.bio,
      profilePicture: item.profilePicture,
      showPictures: typeof item.showPictures === 'string' ? JSON.parse(item.showPictures) : item.showPictures,
      work: item.work,
      education: item.education,
      friendRequest: friendreqArr,
      friends: typeof item.friends === 'string' ? JSON.parse(item.friends) : item.friends,
      lookingFor: item.lookingFor,
      currentLocation: typeof item.currentLocation === 'string' ? JSON.parse(item.currentLocation) : item.currentLocation,
      isActive: true,
      isDeleted: false,
      updatedAt: true
    };
    console.log('   Dispatching update to API');
    const profileId = item.profileId;
    dispatch(updateFreindProfileRequest({ profile, profileId }));
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('✅ Klatchup Sent!', `Your Klatchup request has been sent to ${item.name}`);
      console.log('✅ Klatchup request sent successfully');
    }, 500);
    
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
          <TouchableOpacity style={styles.button} disabled>
            <Text style={[styles.textAccept, { fontWeight: '600' }]}>✓ Requested</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => onAcceptPress()}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={[styles.textAccept, { fontWeight: '600' }]}>🎯 Klatchup</Text>
            )}
          </TouchableOpacity>
        )
      } */}
      {
        loggedInUserFriends.user_ids.includes(item?.profileId) ? (
          <TouchableOpacity style={styles.button} disabled>
            <Text style={[styles.textAccept, { fontWeight: '600' }]}>✓ Friends</Text>
          </TouchableOpacity>
        ) : loggedInUserFriendReq.user_ids.includes(item?.profileId) ? (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textAccept}>Requested</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => onAcceptPress()}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={[styles.textAccept, { fontWeight: '600' }]}>🎯 Klatchup</Text>
            )}
          </TouchableOpacity>
        )
      }
    </GradientBorderView>
  );
};

UsersListItem.defaultProps = defaultProps;

export default UsersListItem;
