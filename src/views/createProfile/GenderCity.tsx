import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Heading from '../../components/Heading';
import Fonts from '../../theme/Fonts';
import Colors from '../../theme/Colors';
import Button from '../../components/Button';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Picker from '../../components/Picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textSubHeading: {
    fontFamily: Fonts.PromptRegular,
    fontSize: 14,
    color: Colors.white,
    marginVertical: 10,
  },
  iconNext: {
    height: 20,
    width: 14,
  },
  btnNext: {
    position: 'absolute',
    bottom: -100,
    right: 0,
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

const GenderCity = ({ onPressNext, formData = defaultFormData }: Props) => {

  const genders = ['Women', 'Man', 'Non Binary', 'Not Mentioned'];

  const cities = Array.from(
    new Set([
      'Pune',
      'Mumbai',
      'Delhi',
      'Banglore',
      'Hyderabad',
      'Ahmedabad',
      'Chennai',
      'Kolkata',
    ])
  );

  const [city, setSelectedCity] = useState(formData.city)
  const [gender, setSelectedGender] = useState(formData.gender ? formData.gender : genders[0]);


  const onPressContinue = () => {
    onPressNext({ gender, city, })
  };

  return (

    <ScrollView
      overScrollMode="never"
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <Heading message="Your Gender Identity" />

      <RadioButtonGroup
        options={genders}
        selectedOption={gender}
        onChanged={option => setSelectedGender(option)}
      />

      <View style={{ marginTop: 30 }} />

      <Heading message="Your City" />

      <Picker
        placeholder="Choose a city"
        options={cities}
        selectedOption={city}
        onSelected={city => setSelectedCity(city)}
      />

      <Button
        icon={require('../../assets/icons/ic_next.png')}
        iconStyle={styles.iconNext}
        onPress={onPressContinue}
        style={styles.btnNext}
      />
    </ScrollView>
  )
}

GenderCity.defaultProps = {
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

export default GenderCity
