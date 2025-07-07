// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   KeyboardAvoidingView,
//   TouchableOpacity,
// } from 'react-native';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import Fonts from '../../theme/Fonts';
// import Colors from '../../theme/Colors';
// import Button from '../../components/Button';
// import CountrySelectModal from '../../components/CountrySelectModal';
// import CountryCodes from '../../utils/CountryCodes';
// import TextInput from '../../components/TextInput';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     height: '90%',
//     margin: 20,
//   },
//   textHeading: {
//     fontFamily: Fonts.UnboundedMedium,
//     fontSize: 24,
//     color: Colors.white,
//   },
//   textSubHeading: {
//     fontFamily: Fonts.PromptRegular,
//     fontSize: 14,
//     color: Colors.white,
//     marginVertical: 10,
//   },
//   btn: {
//     alignSelf: 'center',
//     marginTop: 50,
//   },
//   containerInputs: {
//     flexDirection: 'row',
//     marginVertical: 15,
//   },
//   containerPicker: {
//     backgroundColor: '#F2EAFF',
//     padding: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     height: 48,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textCountryCode: {
//     fontSize: 16,
//     fontFamily: Fonts.PromptRegular,
//   },
// })

// const EnterMobileNoScreen = () => {

//   const [mobileNumber, setMobileNumber] = useState('');
//   const [showCountryPicker, setShowCountryPicker] = useState(false);
//   const [country, setCountry] = useState(CountryCodes[91]);
//   const [countryCode, setCountryCode] = useState("");
//   const navigation = useNavigation();

//   const onPressGetOtp = async () => {
//     let userMobileNo = country.dialingCode + " " + mobileNumber;
//     navigation.navigate('VerifyOtp', { userMobileNo, mobileNumber });
//   };

//   const setCode = (text: string) => {
//     setCountryCode(text);
//     setShowCountryPicker(true);
//   };

//   return (

//     <ScreenWrapper>

//       <KeyboardAvoidingView style={styles.container}>
//         <Text style={styles.textHeading}>Your Number</Text>

//         <Text style={styles.textSubHeading}>
//           This will not be visible on your profile.
//         </Text>

//         <View style={styles.containerInputs}>
//           <TouchableOpacity
//             style={styles.containerPicker}
//             onPress={text => setCode(text)}
//             activeOpacity={0.6}>
//             <Text style={styles.textCountryCode}>{`+ ${country.dialingCode}`}</Text>
//           </TouchableOpacity>

//           <TextInput
//             value={mobileNumber}
//             onChangeText={text => setMobileNumber(text.trim())}
//             placeholder="Enter Mobile Number"
//             keyboardType="phone-pad"
//             maxLength={10}
//             style={{ flex: 1 }}
//           />
//         </View>

//         <Button
//           style={styles.btn}
//           title="Get OTP"
//           disabled={mobileNumber.length < 10}
//           onPress={onPressGetOtp}
//         />
//       </KeyboardAvoidingView>

//       <CountrySelectModal
//         hideModal={() => setShowCountryPicker(false)}
//         onSelected={i => {
//           setCountry(i);
//         }}
//         isVisible={showCountryPicker}
//         title="Select Country"
//       />
//     </ScreenWrapper>
//   );
// };

// export default EnterMobileNoScreen;

import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenWrapper from '../../components/ScreenWrapper';
import Fonts from '../../theme/Fonts';
import Colors from '../../theme/Colors';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import CountrySelectModal from '../../components/CountrySelectModal';
import CountryCodes from '../../utils/CountryCodes';

const EnterMobileNoScreen = () => {
  const navigation = useNavigation();

  const [mobileNumber, setMobileNumber] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState(CountryCodes[91]);

  const handleCountryCodePress = useCallback(() => {
    setShowCountryPicker(true);
  }, []);

  const handleMobileChange = useCallback((text: string) => {
    setMobileNumber(text.trim());
  }, []);

  const handleCountrySelected = useCallback((selectedCountry: any) => {
    setCountry(selectedCountry);
    setShowCountryPicker(false);
  }, []);

  const handleGetOtp = useCallback(async () => {
    const userMobileNo = `${country.dialingCode} ${mobileNumber}`;
    navigation.navigate('VerifyOtp', { userMobileNo, mobileNumber });
  }, [country, mobileNumber, navigation]);

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.textHeading}>Your Number</Text>
        <Text style={styles.textSubHeading}>
          This will not be visible on your profile.
        </Text>

        <View style={styles.containerInputs}>
          <TouchableOpacity
            style={styles.containerPicker}
            onPress={handleCountryCodePress}
            activeOpacity={0.6}
            accessibilityLabel="Select country code"
          >
            <Text style={styles.textCountryCode}>{`+ ${country.dialingCode}`}</Text>
          </TouchableOpacity>

          <TextInput
            value={mobileNumber}
            onChangeText={handleMobileChange}
            placeholder="Enter Mobile Number"
            keyboardType="phone-pad"
            maxLength={10}
            style={styles.mobileInput}
            accessibilityLabel="Enter mobile number"
          />
        </View>

        <Button
          style={styles.btn}
          title="Get OTP"
          onPress={handleGetOtp}
          disabled={mobileNumber.length < 10}
          accessibilityLabel="Request OTP button"
        />
      </KeyboardAvoidingView>

      <CountrySelectModal
        hideModal={() => setShowCountryPicker(false)}
        onSelected={handleCountrySelected}
        isVisible={showCountryPicker}
        title="Select Country"
      />
    </ScreenWrapper>
  );
};

export default EnterMobileNoScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '90%',
    margin: 20,
  },
  textHeading: {
    fontFamily: Fonts.UnboundedMedium,
    fontSize: 24,
    color: Colors.white,
  },
  textSubHeading: {
    fontFamily: Fonts.PromptRegular,
    fontSize: 14,
    color: Colors.white,
    marginVertical: 10,
  },
  containerInputs: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  containerPicker: {
    backgroundColor: '#F2EAFF',
    padding: 15,
    borderRadius: 20,
    marginRight: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCountryCode: {
    fontSize: 16,
    fontFamily: Fonts.PromptRegular,
  },
  mobileInput: {
    flex: 1,
  },
  btn: {
    alignSelf: 'center',
    marginTop: 50,
  },
});

