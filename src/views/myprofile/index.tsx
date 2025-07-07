import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  FlatList,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native'
import ScreenWrapper from '../../components/ScreenWrapper'
import Toolbar from '../../components/Toolbar'
import BottomBar from '../../components/BottomBar'
import RequestsListItem from '../../views/klatchupRequests/index'
import { useNavigation } from '@react-navigation/native'
import ToolbarIcon from '../../components/ToolbarIcon'
import ProfileIcon from '../../components/ProfileIcon'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import TextInput from '../../components/TextInput'
import AddPhoto from '../../components/AddPhoto'
import InterestExpandableItem from '../../components/InterestExpandableItem'
import RadioButtonGroup from '../../components/RadioButtonGroup'
import Picker from '../../components/Picker'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import ImagePickerModal from '../../components/ImagePickerModal'
import ImagePicker from 'react-native-image-crop-picker'
import Button from '../../components/Button'
import { getMobileRequest, resetMobileExecuted, resetupdateProfileExecuted, updateProfileRequest } from "../../slices/profile";
import Loader from '../../components/Loader'
import InterestsModal from '../../components/InterestsModal';

const genders = ['Women', 'Man', 'Non Binary', 'Not Mentioned']

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  textNameAge: {
    color: Colors.white,
    fontFamily: Fonts.PromptMedium,
    textAlign: 'center',
    fontSize: 24,
  },
  textSectionTitle: {
    color: Colors.white,
    fontFamily: Fonts.PromptMedium,
    fontSize: 22,
  },
  inputBio: {
    backgroundColor: 'transparent',
    color: 'white',
    borderColor: Colors.white,
    borderWidth: 1,
    marginVertical: 10,
    height: 140,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'transparent',
    color: 'white',
    borderColor: Colors.white,
    borderWidth: 1,
    marginVertical: 10,
    fontSize: 14,
  },
  containerPhotos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textEdit: {
    color: 'white',
    borderColor: Colors.white,
    fontFamily: Fonts.PromptRegular,
    fontSize: 13,
    textDecorationLine: 'underline',
    padding: 5,
  },
  btnContinue: {
    flexDirection: 'row',
    marginBottom: 30,
    alignSelf: 'center',
  },
});

const MyProfileScreen = () => {

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);

  console.log(getprofile.profile.showPictures)

  const is_Loading = useSelector((state: RootState) => state.profile.isLoading);

  const updateProfileExecuted = useSelector((state: RootState) => state.profile.updateProfileExecuted);

  const [parsedInterests, setParsedInterests] = useState<any[]>([]);
  // const parsedInterests = typeof getprofile.profile.interests === 'string'
  //   ? JSON.parse(getprofile.profile.interests || '[]')
  //   : getprofile.profile.interests;



  const [name, setName] = useState(getprofile.profile.name);
  const [bio, setBio] = useState(
    getprofile.profile.bio
  );

  const [education, setEducation] = useState(getprofile.profile.education);
  const [work, setWork] = useState(getprofile.profile.work);
  const [selectedGender, setSelectedGender] = useState(getprofile.profile.gender);
  const [selectedLookingFor, setSelectedLookingFor] = useState(getprofile.profile.lookingFor
  );

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [profilePic, setProfilePic] = useState(getprofile.profile.profilePicture);
  const [userMobile, setUserMobile] = useState(getprofile.profile.mobile)
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');


  const [activePicker, setActivePicker] = useState<1 | 2 | 3 | 4 | null>(null);

  const [allInterests] = useState([
    'Music',
    'Food',
    'Science & Technology',
    'Pets',
    'Entrepreneurship',
    'Business',
    'Partying',
    'Alcoholic Beverages',
  ]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>(parsedInterests || []);
  const [interestModalVisible, setInterestModalVisible] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);


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

  const [age, setAge] = useState(calculateYearsFromDate(getprofile.profile.birthDate).toString())


  const onPressSettings = () => navigation.navigate('Settings')

  const selectImage = () => {
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 600,
        height: 600,
        cropping: true,
      }).then(image => {
        updateImageByPicker(image.path);
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
        updateImageByPicker(image.path);
      });
    }, 1000);
  };

  const updateImageByPicker = (path: string) => {
    if (activePicker === 1) setImage1(path);
    else if (activePicker === 2) setImage2(path);
    else if (activePicker === 3) setImage3(path);
    else if (activePicker === 4) setProfilePic(path);
    setShowImagePicker(false);
    setActivePicker(null);
  };

  const getSelectedImages = (
    image1: string,
    image2: string,
    image3: string
  ): { priority: number; path: string }[] => {
    const result: { priority: number; path: string }[] = [];

    if (image1 && image1.trim() !== '') {
      result.push({ priority: 1, path: image1 });
    }
    if (image2 && image2.trim() !== '') {
      result.push({ priority: 2, path: image2 });
    }
    if (image3 && image3.trim() !== '') {
      result.push({ priority: 3, path: image3 });
    }

    return result;
  };

  const onPressContinue = () => {

    const imageData = getSelectedImages(image1, image2, image3);

    const profile = {
      name: getprofile.profile.name,
      mobile: getprofile.profile.mobile,
      birthDate: getprofile.profile.birthDate, //"1990-01-01",
      gender: selectedGender,
      interests: parsedInterests,
      city: getprofile.profile.city,
      bio: bio,
      profilePicture: profilePic,
      showPictures: imageData,
      work: work,
      education: education,
      friendRequest: typeof getprofile.profile.friendRequest === 'string'
        ? JSON.parse(getprofile.profile.friendRequest || '[]')
        : getprofile.profile.friendRequest,
      friends: typeof getprofile.profile.friends === 'string'
        ? JSON.parse(getprofile.profile.friends || '[]')
        : getprofile.profile.friends,
      lookingFor: selectedLookingFor,
      currentLocation: typeof getprofile.profile.currentLocation === 'string'
        ? JSON.parse(getprofile.profile.currentLocation || '[]')
        : getprofile.profile.currentLocation,//{ placeName: '', lat: '0', long: '0' },
      isActive: true,
      isDeleted: false,
      updatedAt: true
    };

    const profileId = getprofile.profile.profileId;
    dispatch(updateProfileRequest({ profile, profileId }));
  };

  useEffect(() => {

    if (getprofile?.profile?.interests) {
      const parsed =
        typeof getprofile.profile.interests === 'string'
          ? JSON.parse(getprofile.profile.interests || '[]')
          : getprofile.profile.interests;
      console.log(parsed)
      setParsedInterests(parsed);
      setSelectedInterests(parsed)
    }
  }, [getprofile?.profile?.interests]);

  useEffect(() => {
    if (updateProfileExecuted) {
      dispatch(resetupdateProfileExecuted());
      //navigation.replace('Home');
    }
  }, [updateProfileExecuted])

  useEffect(() => {
    console.log("in use effect")
    let showPictures = getprofile?.profile?.showPictures;

    // If the data is a string, try parsing it
    if (typeof showPictures === 'string') {
      console.log("For string")
      try {
        showPictures = JSON.parse(showPictures);
      } catch (e) {
        console.error('Invalid showPictures JSON:', e);
        showPictures = [];
      }
    }

    if (Array.isArray(showPictures) && showPictures.length > 0) {
      // Confirm it's an array of objects with 'path' and optional 'priority'
      if (typeof showPictures[0] === 'object' && showPictures[0]?.path) {
        // Sort by priority if available
        const sortedPics = [...showPictures].sort((a, b) => (a.priority || 0) - (b.priority || 0));

        if (sortedPics[0]) setImage1(sortedPics[0].path);
        if (sortedPics[1]) setImage2(sortedPics[1].path);
        if (sortedPics[2]) setImage3(sortedPics[2].path);
      }
    }
  }, [getprofile]);

  return (
    <ScreenWrapper>
      <Toolbar
        title="Your Profile"
        rightComponent={
          <ToolbarIcon
            icon={require('../../assets/icons/ic_settings.png')}
            onPress={onPressSettings}
          />
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

        <ProfileIcon imageUrl={profilePic} onPress={() => {
          setActivePicker(4);
          setShowImagePicker(true);
        }} />

        <Text
          numberOfLines={1}
          style={styles.textNameAge}>{`${name}, ${age}`}
        </Text>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.textSectionTitle}>Photos</Text>
          <View style={styles.containerPhotos}>
            <AddPhoto onPress={() => {
              setActivePicker(1);
              setShowImagePicker(true);
            }}
              imageUri={image1}
            />
            <AddPhoto onPress={() => {
              setActivePicker(2);
              setShowImagePicker(true);
            }}
              imageUri={image2} />
            <AddPhoto onPress={() => {
              setActivePicker(3);
              setShowImagePicker(true);
            }}
              imageUri={image3} />
          </View>
          <Text style={styles.textSectionTitle}>Bio</Text>
          <TextInput
            placeholder="Your bio"
            value={bio}
            placeholderTextColor={'gray'}
            onChangeText={text => setBio(text)}
            style={styles.inputBio}
            multiline
            editable={true}
          />
          <View style={styles.row}>
            <Text style={styles.textSectionTitle}>Interests</Text>
            <TouchableOpacity activeOpacity={0.6} onPress={() => setShowInterestsModal(true)}>
              <Text style={styles.textEdit}>Edit</Text>
            </TouchableOpacity>
          </View>

          {showInterestsModal && (
            <InterestsModal
              visible={showInterestsModal}
              selectedInterests={selectedInterests}
              onClose={() => setShowInterestsModal(false)}
              onSave={(updatedNames: string[]) => {
                const updated = updatedNames.map(name => ({ name, subInterest: '' }));
                setParsedInterests(updated); // update parent state
                setShowInterestsModal(false);
              }}
            />
          )}
          {/* <InterestExpandableItem
            title="Sports"
            description="Eu incididunt cupidatat aliquip exercitation proident eu ipsum proident mollit."
          /> */}


          {parsedInterests.length > 0 ? (
            parsedInterests.map((item: { name: string | undefined }, index: React.Key | null | undefined) => (
              <InterestExpandableItem
                key={index}
                title={item.name}
                description=""
              />
            ))
          ) : (
            <Text>No interests found.</Text> // or render nothing/null if you prefer
          )}

          <Text style={styles.textSectionTitle}>Education</Text>
          <TextInput
            placeholder="Your education"
            value={education}
            placeholderTextColor={'gray'}
            onChangeText={text => setEducation(text)}
            style={styles.input}
            numberOfLines={1}
            editable={true}
          />

          <Text style={styles.textSectionTitle}>Work</Text>
          <TextInput
            placeholder="Your work"
            value={work}
            placeholderTextColor={'gray'}
            onChangeText={text => setWork(text)}
            style={styles.input}
            numberOfLines={1}
            editable={true}
          />
          <Text style={styles.textSectionTitle}>Gender Identity</Text>

          <Picker
            placeholder="Gender Identity"
            options={genders}
            selectedOption={selectedGender}
            showScrollIndicator={false}
            onSelected={option => setSelectedGender(option)}
          />

          <Text style={styles.textSectionTitle}>Looking for</Text>

          <Picker
            placeholder="Looking for"
            options={genders}
            showScrollIndicator={false}
            selectedOption={selectedLookingFor}
            onSelected={option => setSelectedLookingFor(option)}
          />
        </View>
        <View style={{ paddingBottom: 200 }} />

        <ImagePickerModal
          hideModal={() => setShowImagePicker(false)}
          isVisible={showImagePicker}
          captureImage={captureImage}
          selectImage={selectImage}
        />
      </ScrollView>

      <Button
        title="Update"
        style={styles.btnContinue}
        onPress={onPressContinue}
      />
      <Loader visible={is_Loading} message="Updating Profile..." spinnerColor="#F58C00" />

    </ScreenWrapper>
  );
};

export default MyProfileScreen;
