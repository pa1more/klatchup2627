import React, { useState } from 'react'
import { Alert, StyleSheet, Text, View, ScrollView } from 'react-native'
import { DesignSystem } from '../../theme/DesignSystem';
import Heading from '../../components/Heading';
import Chip from '../../components/Chip'
import Button from '../../components/Button'
import QuestionModal from './QuestionModal'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textSubHeading: {
    fontWeight: '400',
    fontSize: 14,
    color: DesignSystem.colors.white,
    marginVertical: 10,
  },
  containerInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconNext: {
    height: 20,
    width: 14,
  },
  btnNext: {
    position: 'absolute',
    bottom: -10,
    right: 0,
  },

});

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
};

interface Props {
  onPressNext: (data?: Partial<FormData>) => void;
  formData: FormData;
};

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

const Interests = ({ onPressNext, formData = defaultFormData }: Props) => {

  const interests_arry = [
    'Music',
    'Food',
    'Science & Technology',
    'Pets',
    'Entrepreneurship',
    'Business',
    'Partying',
    'Alcoholic Beverages',
    'Pets',
  ]

  const [selectedInterests, setSelectedInterests] = useState(formData.interests)
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);


  const onPressContinue = () => {
    if (selectedInterests.length < 3) {
      Alert.alert('Minimum Interests Required', 'Please select at least 3 topics of interest to continue.');
      return;
    }
    onPressNext({ interests });
  };

  const onInterestPicked = (item: string) => {

    const selected = selectedInterests;
    if (selectedInterests.includes(item)) {
      selected.splice(selected.indexOf(item), 1);
    } else {
      setShowQuestionModal(true)
      selected.push(item);
    }
    setInterests([...selected])
    setSelectedInterests([...selected])
  };

  return (
    <View style={styles.container}>
      <ScrollView
        overScrollMode="never"
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>

        <Heading message="Your Interests" />

        <Text style={styles.textSubHeading}>
          Pick a minimum of 3 topics of interest and detail them for a better
          overall experience.
        </Text>

        <View style={styles.containerInterests}>
          {interests_arry.map(interest => (
            <Chip
              title={interest}
              isSelected={selectedInterests.includes(interest)}
              onSelected={item => onInterestPicked(item)}
            />
          ))}
        </View>

        <QuestionModal
          isVisible={showQuestionModal}
          hideModal={() => setShowQuestionModal(false)}
        />
      </ScrollView>
      <Button
        icon={require('../../assets/icons/ic_next.png')}
        iconStyle={styles.iconNext}
        onPress={onPressContinue}
        style={styles.btnNext}
      />
    </View>
  )
}

Interests.defaultProps = {
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

export default Interests
