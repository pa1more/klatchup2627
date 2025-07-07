import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native'
import GradientBorderView from '../../components/GradientBorderView'
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts'
import GradientText from '../../components/GradientText';
import { useDispatch, useSelector } from "react-redux";
import { updateFreindProfileRequest, updateProfileRequest } from '../../slices/profile';
import { RootState } from '../../store';
import { ColorSpace } from 'react-native-reanimated';

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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  containerInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
    flex: 1,
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
  containerBtns: {
    flexDirection: 'row',
    marginTop: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 1,
  },
  textIgnore: {
    fontSize: 13,
    fontFamily: Fonts.PromptRegular,
  },
  textAccept: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: Fonts.PromptRegular,
  },
});

interface Props {
  name: string,
  item: any
  imageUrl: string
  age: string
  interests: string[]
  onPress: () => void
  onProfileUpdated: () => void
}

const defaultProps: Props = {
  name: '',
  item: {},
  imageUrl: '',
  age: '',
  interests: [],
  onPress: () => { },
  onProfileUpdated: () => { }
};

const RequestsListItem = ({ name, item, imageUrl, age, interests, onProfileUpdated, onPress }: Props) => {

  const dispatch = useDispatch();
  const [accpetPressed, setAccpetPressed] = useState(false);
  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);

  const parsedInterests = typeof interests === 'string' ? JSON.parse(interests) : interests;

  let temp_friend = { user_ids: [] };//loggin user friend list
  try {
    const friendRequest = getprofile.profile.friends;
    temp_friend =
      typeof friendRequest === 'string'
        ? JSON.parse(friendRequest)
        : typeof friendRequest === 'object' && friendRequest !== null
          ? JSON.parse(JSON.stringify(friendRequest))  // clone to avoid immutability
          : { user_ids: [] };
  } catch (e) {
    temp_friend = { user_ids: [] };
  }


  let temp_friendRequest = { user_ids: [] };//loggin user friend rrequest list
  try {
    const friendRequest = getprofile.profile.friendRequest;

    temp_friendRequest =
      typeof friendRequest === 'string'
        ? JSON.parse(friendRequest)
        : typeof friendRequest === 'object' && friendRequest !== null
          ? JSON.parse(JSON.stringify(friendRequest))  // clone to avoid immutability
          : { user_ids: [] };
  } catch (e) {
    temp_friendRequest = { user_ids: [] };
  }

  let item_friendlist = { user_ids: [] };//loggin user friend rrequest list
  try {
    const friendlist = item.friends;
    item_friendlist =
      typeof friendlist === 'string'
        ? JSON.parse(friendlist)
        : typeof friendlist === 'object' && friendlist !== null
          ? JSON.parse(JSON.stringify(friendlist))  // clone to avoid immutability
          : { user_ids: [] };
  } catch (e) {
    item_friendlist = { user_ids: [] };
  }


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

  function addUserIdToResponseLoginUser(response: any, newUserId: string) {
    const clonedResponse = JSON.parse(JSON.stringify(response));
    if (!Array.isArray(clonedResponse.user_ids)) {
      clonedResponse.user_ids = [];
    }

    if (newUserId && !clonedResponse.user_ids.includes(newUserId)) {
      clonedResponse.user_ids.push(newUserId);
    }

    return clonedResponse;
  }

  function removeUserIdsInResponse(response: any, userId: string) {
    // Deep clone the object to avoid mutating the original
    const clonedResponse = JSON.parse(JSON.stringify(response));
    console.log(clonedResponse)
    console.log(userId)
    // Ensure user_ids is an array
    if (!Array.isArray(clonedResponse.user_ids)) {
      clonedResponse.user_ids = [];
    }
    // Remove the userId if it exists
    clonedResponse.user_ids = clonedResponse.user_ids.filter((id: string) => id !== userId);
    return clonedResponse;
  }

  const onAcceptPress = () => {


    let friendArr = addUserIdToResponseLoginUser(temp_friend, item.profileId);
    let friendreqArr = removeUserIdsInResponse(temp_friendRequest, item.profileId)

    const profile = {
      name: getprofile.profile.name,
      mobile: getprofile.profile.mobile,
      birthDate: getprofile.profile.birthDate,
      gender: getprofile.profile.gender,
      interests: parsedInterests,
      city: getprofile.profile.city,
      bio: getprofile.profile.bio,
      profilePicture: getprofile.profile.profilePicture,
      showPictures: typeof getprofile.profile.showPictures === 'string'
        ? JSON.parse(getprofile.profile.showPictures || '[]')
        : getprofile.profile.showPictures,
      work: getprofile.profile.work,
      education: getprofile.profile.education,
      friendRequest: friendreqArr,
      friends: friendArr,
      lookingFor: getprofile.profile.lookingFor,
      //currentLocation: JSON.parse(getprofile.profile.currentLocation),
      currentLocation: typeof getprofile.profile.currentLocation === 'string'
        ? JSON.parse(getprofile.profile.currentLocation || '[]')
        : getprofile.profile.currentLocation,
      isActive: true,
      isDeleted: false,
      updatedAt: true
    };
    console.log(profile)
    const profileId = getprofile.profile.profileId;
    dispatch(updateProfileRequest({ profile, profileId }));
    setAccpetPressed(true);
  }

  const onIgnorePress = () => {

    let friendreqArr = removeUserIdsInResponse(temp_friendRequest, item.profileId)

    const profile = {
      name: getprofile.profile.name,
      mobile: getprofile.profile.mobile,
      birthDate: getprofile.profile.birthDate, //"1990-01-01",
      gender: getprofile.profile.gender,
      interests: parsedInterests,
      city: getprofile.profile.city,
      bio: getprofile.profile.bio,
      profilePicture: getprofile.profile.profilePicture,
      showPictures: typeof getprofile.profile.showPictures === 'string'
        ? JSON.parse(getprofile.profile.showPictures || '[]')
        : getprofile.profile.showPictures,
      work: getprofile.profile.work,
      education: getprofile.profile.education,
      friendRequest: friendreqArr,
      //friends: JSON.parse(getprofile.profile.friends),
      friends: typeof getprofile.profile.friends === 'string'
        ? JSON.parse(getprofile.profile.friends || '[]')
        : getprofile.profile.friends,
      lookingFor: getprofile.profile.lookingFor,
      currentLocation: typeof getprofile.profile.currentLocation === 'string'
        ? JSON.parse(getprofile.profile.currentLocation || '[]')
        : getprofile.profile.currentLocation,
      isActive: true,
      isDeleted: false,
      updatedAt: true
    };

    const profileId = getprofile.profile.profileId;
    dispatch(updateFreindProfileRequest({ profile, profileId }));
    setAccpetPressed(false);
    onProfileUpdated();
  }

  useEffect(() => {

    setAccpetPressed(false);
    if (accpetPressed) {
      let friendreqArr = addUserIdToResponse(item_friendlist, getprofile.profile.profileId);

      const profile = {
        name: item.name,
        mobile: item.mobile,
        birthDate: item.birthDate, //"1990-01-01",
        gender: item.gender,
        interests: parsedInterests,
        city: item.city,
        bio: item.bio,
        profilePicture: item.profilePicture,
        showPictures: JSON.parse(item.showPictures),
        work: item.work,
        education: item.education,
        friendRequest: typeof item.friendRequest === 'string'
          ? JSON.parse(item.friendRequest || '[]')
          : item.friendRequest,
        friends: friendreqArr,
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
  }, [accpetPressed]);

  return (
    <GradientBorderView borderWidth={1} styles={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={styles.btn}>
        <GradientBorderView styles={styles.containerDp}>
          {imageUrl ? (
            <Image style={styles.imgDp} source={{ uri: imageUrl }} />
          ) : (
            <Image style={styles.imgDp} source={require('../../assets/images/intro.png')} />
          )}
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
      <View style={styles.containerBtns}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: '#300943', borderBottomLeftRadius: 20 },
          ]}>
          <GradientText
            style={styles.textIgnore}
            colors={['#F58C00', '#704002']}
            underline onPress={() => onIgnorePress()}>
            Ignore
          </GradientText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onAcceptPress()}>
          <Text style={styles.textAccept}>Accept</Text>
        </TouchableOpacity>
      </View>
    </GradientBorderView>
  )
}

RequestsListItem.defaultProps = defaultProps

export default RequestsListItem
