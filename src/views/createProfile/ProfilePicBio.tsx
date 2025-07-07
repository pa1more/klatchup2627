
import { Alert, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Fonts from '../../theme/Fonts'
import Colors from '../../theme/Colors'
import Heading from '../../components/Heading'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import SelectPicture from '../../components/SelectPicture'
import ErrorText from '../../components/ErrorText'
import ImagePickerModal from '../../components/ImagePickerModal'
import ImagePicker from 'react-native-image-crop-picker'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { insertProfileRequest, resetInsertProfileExecuted } from "../../slices/profile";
import { sampleAction, sampleSelector } from "../../slices/sample";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import Loader from '../../components/Loader'

const styles = StyleSheet.create({

  container: {},
  textSubHeading: {
    fontFamily: Fonts.PromptRegular,
    fontSize: 14,
    color: Colors.white,
    marginVertical: 10,
  },
  btnContinue: {
    marginTop: 20,
    alignSelf: 'center',
  },
})

// interface Props {
//   onPressNext: () => void
// }

// const defaultProps: Props = {
//   onPressNext: () => {},
// };

interface FormData {
  firstName: string;
  birthDay: string; // Changed from "birthday" to match the state variable
  birthMonth: string;
  birthYear: string;
  gender: string;
  city: string;
  interests: string[];
  profilePic: string;
  bio: string;
}

interface Props {
  onPressNext: (data?: Partial<FormData>) => void;
  formData: FormData;
}

const defaultFormData: FormData = {
  firstName: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  gender: '',
  city: '',
  interests: [],
  profilePic: '',
  bio: '',
};

const ProfilePicBio = ({ onPressNext, formData = defaultFormData }: Props) => {

  const navigation = useNavigation();

  const [bio, setBio] = useState(formData.bio)
  const [profilePic, setProfilePic] = useState(formData.profilePic || '');
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const dispatch = useDispatch();
  const getprofile = useSelector((state: RootState) => state.profile.profile);
  const is_Loading = useSelector((state: RootState) => state.profile.isLoading);
  const profile_error = useSelector((state: RootState) => state.profile.error);
  const profileInsertExecuted = useSelector((state: RootState) => state.profile.insertProfileExecuted);

  const [mobileNo, setMobileNo] = useState('');

  const getData = async () => {

    try {
      const value = await AsyncStorage.getItem("MobileNo");
      if (value !== null) {
        setMobileNo(value)
      } else { setMobileNo('0') }
    } catch (e) {
      setMobileNo('0');
    }

  };

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      return confirmation; // Save this to confirm OTP later
    } catch (error) {
      console.error('SMS not sent:', error);
    }
  };

  const onPressContinue = () => {

    const formattedInterests = formData.interests.map((item) => ({
      name: item,
      subInterest: ''
    }));

    const profile = {
      name: formData.firstName,
      mobile: mobileNo,
      birthDate: formData.birthYear + "-" + formData.birthMonth + "-" + formData.birthDay,
      gender: formData.gender,
      interests: formattedInterests,
      city: formData.city,
      bio: bio,
      profilePicture: profilePic,
      showPictures: [{ priority: 0, path: "" }],
      work: "Software Engineer",
      education: "B.Tech",
      lookingFor: "",
      friendRequest: { "user_ids": [] },
      friends: { "user_ids": [] },
      currentLocation: { placeName: "", lat: latitude.toString(), long: longitude.toString() },
      isActive: true,
      isDeleted: false,
      updatedAt: true
    };
    console.log(profile)
    dispatch(insertProfileRequest({ profile }));
  };


  const selectImage = () => {
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 600,
        height: 600,
        cropping: true,
      }).then(image => {
        setProfilePic(image.path)
      })
    }, 1000)
  };

  const captureImage = () => {
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 600,
        height: 600,
        cropping: true,
      }).then(image => {
        setProfilePic(image.path)
      });
    }, 1000);
  }

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {

    if (profileInsertExecuted) {
      //signInWithPhoneNumber(mobileNo)
      dispatch(resetInsertProfileExecuted());
      navigation.replace('Home')
      // Alert.alert("Profile Created Successfully, Please Re-login to app")
      // navigation.replace('EnterMobileNo');
      // Alert.alert(
      //   "Profile Created Successfully",
      //   "Please Re-login to app",
      //   [
      //     {
      //       text: "OK",
      //       onPress: () => navigation.replace('EnterMobileNo'),
      //     },
      //   ],
      //   { cancelable: false }
      // );
    } else if (profile_error != null) {
      Alert.alert('Error', profile_error);
      return;
    }
  }, [profileInsertExecuted])

  return (

    <View style={styles.container}>
      <Heading message="Your Profile Picture" />
      <Text style={styles.textSubHeading}>
        Add a favorite's picture of yourself. You can change this and add more
        pictures later.
      </Text>

      <SelectPicture
        onPress={() => setShowImagePicker(true)}
        style={{ alignSelf: 'center' }}
        imageUri={profilePic}
      />

      <View style={{ marginTop: 30 }} />
      <Heading message="Your Bio" />
      <Text style={styles.textSubHeading}>
        The first impression matters. No pressure, just be yourself!
      </Text>

      <TextInput
        value={bio}
        onChangeText={text => setBio(text)}
        multiline
        placeholder="Type here..."
        maxLength={250}
        style={{ height: 80 }}
      />
      <ErrorText message="This is error message" />
      <Button
        title="Continue"
        style={styles.btnContinue}
        onPress={onPressContinue}
      />

      <ImagePickerModal
        hideModal={() => setShowImagePicker(false)}
        isVisible={showImagePicker}
        captureImage={captureImage}
        selectImage={selectImage}
      />

      <Loader visible={is_Loading} message="Creating Profile..." spinnerColor="#F58C00" />

    </View>
  )
}

//ProfilePicBio.defaultProps = defaultProps;

ProfilePicBio.defaultProps = {
  onPressNext: () => { },
  formData: {
    firstName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
    city: '',
    interests: [],
    profilePic: '',
    bio: '',
  },
};

export default ProfilePicBio
