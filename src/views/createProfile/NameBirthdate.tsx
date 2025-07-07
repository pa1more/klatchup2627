import React, { useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import TextInput from '../../components/TextInput'
import ErrorText from '../../components/ErrorText'
import Heading from '../../components/Heading'
import Fonts from '../../theme/Fonts'
import Colors from '../../theme/Colors'
import Button from '../../components/Button'

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
  containerBirthdate: {
    flexDirection: 'row',
  },
  inputBirthdate: {
    marginHorizontal: 5,
  },
  iconNext: {
    height: 20,
    width: 14,
  },
  btnNext: {
    alignSelf: 'flex-end',
    marginTop: 100,
  },
})

// interface Interest {
//   name: string;
//   subInterest: string[];
//}

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
  //fullInterests?: Interest[];
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
  //fullInterests: [],
};

const NameBirthdate: React.FC<Props> = ({ onPressNext, formData = defaultFormData }) => {

  const [firstName, setFirstName] = useState(formData.firstName);
  const [birthDay, setBirthDay] = useState(formData.birthDay);
  const [birthMonth, setBirthMonth] = useState(formData.birthMonth);
  const [birthYear, setBirthYear] = useState(formData.birthYear);

  const onPressContinue = () => {
    if (!firstName) {
      Alert.alert('Please enter your Name.');
      return;
    }
    if (!birthDay || !birthMonth || !birthYear) {
      Alert.alert('Please enter your full date of birth.');
      return;
    }

    const day = parseInt(birthDay, 10);
    const month = parseInt(birthMonth, 10);
    const year = parseInt(birthYear, 10);

    if (
      isNaN(day) || isNaN(month) || isNaN(year) ||
      day < 1 || day > 31 ||
      month < 1 || month > 12 ||
      year < 1900 || year > new Date().getFullYear()
    ) {
      Alert.alert('Please enter a valid date of birth.');
      return;
    }
    onPressNext({ firstName, birthDay, birthMonth, birthYear });
  };

  // const onPressContinue = () => {
  //   onPressNext()
  // };

  return (
    <View style={styles.container}>
      <Heading message="Your First Name" />
      <Text style={styles.textSubHeading}>
        You won’t be able to change this later. We won’t reveal your name until
        you’ve Klatched with someone.
      </Text>
      <TextInput
        placeholder="Enter First Name"
        value={firstName}
        onChangeText={text => setFirstName(text)}
      />
      {/* <ErrorText message="This is error message." /> */}

      <View style={{ marginTop: 50 }} />
      <Heading message="Your Birthdate" />

      <Text style={styles.textSubHeading}>
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
        sint.
      </Text>

      <View style={styles.containerBirthdate}>

        {/* <TextInput
          placeholder="DD"
          value={birthDay}
          onChangeText={text => setBirthDay(text)}
          keyboardType="number-pad"
          maxLength={2}
          style={styles.inputBirthdate}
        /> */}

        <TextInput
          placeholder="DD"
          value={birthDay}
          onChangeText={text => {
            // Only keep numeric characters
            const numericText = text.replace(/[^0-9]/g, '');

            // Allow max 2 digits
            if (numericText.length <= 2) {
              // Allow if it's empty
              if (numericText === '') {
                setBirthDay('');
                return;
              }

              // If it's 1 digit, allow if it's 0-3 (as 2nd digit may come next)
              if (numericText.length === 1) {
                if (parseInt(numericText, 10) <= 3) {
                  setBirthDay(numericText);
                }
                return;
              }

              // If it's 2 digits, allow only if it's between 01 and 31
              const dayNum = parseInt(numericText, 10);
              if (dayNum >= 1 && dayNum <= 31) {
                setBirthDay(numericText);
              }
            }
          }}
          keyboardType="number-pad"
          maxLength={2}
          style={styles.inputBirthdate}
        />


        {/* <TextInput
          placeholder="MM"
          value={birthMonth}
          onChangeText={text => setBirthMonth(text)}
          keyboardType="number-pad"
          maxLength={2}
          style={styles.inputBirthdate}
        /> */}

        <TextInput
          placeholder="MM"
          value={birthMonth}
          onChangeText={text => {
            const numericText = text.replace(/[^0-9]/g, '');

            if (numericText === '') {
              setBirthMonth('');
              return;
            }

            if (numericText.length === 1) {
              // Allow 0 or 1 (for building 01–09, 10–12)
              if (parseInt(numericText, 10) <= 1) {
                setBirthMonth(numericText);
              }
              return;
            }

            if (numericText.length === 2) {
              const monthNum = parseInt(numericText, 10);
              if (monthNum >= 1 && monthNum <= 12) {
                setBirthMonth(numericText);
              }
            }
          }}
          keyboardType="number-pad"
          maxLength={2}
          style={styles.inputBirthdate}
        />

        <TextInput
          placeholder="YYYY"
          value={birthYear}
          onChangeText={text => setBirthYear(text)}
          keyboardType="number-pad"
          maxLength={4}
          style={styles.inputBirthdate}
        />
      </View>
      {/* <ErrorText message="This is error message." /> */}

      <Button
        icon={require('../../assets/icons/ic_next.png')}
        iconStyle={styles.iconNext}
        onPress={onPressContinue}
        style={styles.btnNext}
      />
    </View>
  )
}

NameBirthdate.defaultProps = {
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
    //fullInterests: [],
  },
};

export default NameBirthdate
