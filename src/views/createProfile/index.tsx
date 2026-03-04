import React, { useMemo, useState } from 'react'
import {
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native'
import ScreenWrapper from '../../components/ScreenWrapper'
import { DesignSystem } from '../../theme/DesignSystem'
import { useNavigation } from '@react-navigation/native'
import NameBirthdate from './NameBirthdate'
import GenderCity from './GenderCity'
import Interests from './Interests'
import ProfilePicBio from './ProfilePicBio'
import ProgressBar from '../../components/ProgressBar'

const styles = StyleSheet.create({
  container: {
    margin: 20,
    height: '90%',
  },
  textHeading: {
    fontWeight: '600',
    fontSize: 24,
    color: DesignSystem.colors.white,
  },
  textSubHeading: {
    fontWeight: '400',
    fontSize: 14,
    color: DesignSystem.colors.white,
    marginVertical: 10,
  },
  progressBar: {
    marginBottom: 30,
  },
});

interface FormData {
  firstName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  gender: string;
  city: string;
  interests: string[];
  profilePic: string;
  bio: string;
}

const CreateProfile = () => {

  const [currentFormIndex, setCurrentFormIndex] = useState(0)
  const navigation = useNavigation();
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
    city: '',
    interests: [],
    profilePic: '',
    bio: '',
  });



  const onPressNext = (data?: Partial<FormData>) => {
    
    if (data) {
      setFormData(prev => ({ ...prev, ...data })); // Merge new data
    }
    setPage(prevPage => prevPage + 1); // Move to next page

    if (currentFormIndex === Object.keys(formPages).length - 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else if (formPages[currentFormIndex + 1] !== null) {
      setCurrentFormIndex(prvIndex => prvIndex + 1);
    }
  };



  // const onPressNext = (data: Partial<typeof formData>) => {
  //   setFormData(prev => ({ ...prev, ...data })); // Merge new data
  //   setPage(prevPage => prevPage + 1); // Move to next page

  //   if (currentFormIndex === Object.keys(formPages).length - 1) {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: 'Home'}],
  //     })
  //   } else if (formPages[currentFormIndex + 1] !== null) {
  //     setCurrentFormIndex(prvIndex => prvIndex + 1);
  //   }
  // };

  const formPages = {
    0: <NameBirthdate onPressNext={onPressNext} formData={formData} />,
    1: <GenderCity onPressNext={onPressNext} formData={formData} />,
    2: <Interests onPressNext={onPressNext} formData={formData} />,
    3: <ProfilePicBio onPressNext={onPressNext} formData={formData} />,
  };

  const getProgress = useMemo(() => {
    const totalPages = Object.keys(formPages).length;
    return ((currentFormIndex + 1) / totalPages) * 100
  }, [currentFormIndex])

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView style={styles.container}>
        <ProgressBar
          style={styles.progressBar}
          progressPercantage={getProgress}
        />
        {formPages[currentFormIndex]}
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default CreateProfile;
