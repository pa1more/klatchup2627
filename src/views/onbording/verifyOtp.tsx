// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   KeyboardAvoidingView,
//   TouchableOpacity,
//   Alert,
//   TextInput,
// } from 'react-native';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import Fonts from '../../theme/Fonts';
// import Colors from '../../theme/Colors';
// import Button from '../../components/Button';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Input from '../../components/TextInput';
// import GradientText from '../../components/GradientText';
// import ErrorText from '../../components/ErrorText';
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../store";
// import { getMobileRequest, getProfileIdRequest, resetMobileExecuted } from '../../slices/profile';
// import { getAuth, signInWithPhoneNumber, FirebaseAuthTypes } from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import Loader from '../../components/Loader';

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
//   containerOTP: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   input: {
//     marginHorizontal: 5,
//     flex: 1,
//   },
//   btnChange: {
//     marginTop: 10,
//     marginBottom: 20,
//     alignSelf: 'flex-start',
//     padding: 0,
//     backgroundColor: 'transparent',

//   },
//   textChange: {
//     fontSize: 14,
//     textDecorationLine: 'underline',
//     fontFamily: Fonts.PromptRegular,
//   },
// });

// const VerifyOtp = () => {

//   const navigation = useNavigation()
//   const route = useRoute();
//   const { userMobileNo, mobileNumber }: any = route.params
//   const [otp, setOtp] = useState(new Array(6).fill(''));

//   const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

//   const dispatch = useDispatch();

//   const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);
//   const mbileExecuted: any = useSelector((state: RootState) => state.profile.mobileexecuted);
//   const isLoader: any = useSelector((state: RootState) => state.profile.mobile_isLoading);

//   const [profileExists, setProfileExists] = useState<boolean | null>(null);
//   const [code, setCode] = useState('');
//   const [timer, setTimer] = useState(0);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const [canResend, setCanResend] = useState(false);
//   const [error, setError] = useState('');

//   const [fcmAuthVerifying, setFcmAuthVerifying] = useState(false);

//   const inputRefs = useMemo(
//     () =>
//       Array(6)
//         .fill(0)
//         .map(i => React.createRef()),
//     []
//   )

//   const isValidOtp = useMemo(() => {
//     let isValid = true;
//     otp.forEach(item => {
//       if (item === '') {
//         isValid = false;
//       }
//     });
//     return isValid;
//   }, [otp]);

//   const onPressVerify = async () => {

//     if (!confirm) {
//       console.log('No confirmation object available');
//       return;
//     }

//     try {
//       const userCredential = await confirm.confirm(otp.join(''));
//       console.log('User signed in successfully:', userCredential);
//       dispatch(getMobileRequest(mobileNumber)); // your logic
//     } catch (error) {
//       console.error('Invalid code.', error);
//       setError('Invalid OTP. Please try again.');
//     }
//     //confirmCode();
//   };

//   // Send OTP
//   const signInWith_PhoneNumber = async (phoneNumber: string) => {
//     try {
//       setFcmAuthVerifying(true)
//       const auth = getAuth();
//       const confirmation = await signInWithPhoneNumber(auth, "+" + phoneNumber);
//       console.log(confirmation)
//       setFcmAuthVerifying(false)
//       setConfirm(confirmation);
//     } catch (error) {
//       setFcmAuthVerifying(false)
//       console.error('Phone Number Sign In Error:', error);
//     }
//   };

//   // Confirm OTP
//   const confirmCode = async () => {
//     try {
//       dispatch(getMobileRequest(mobileNumber));
//       startTimer();
//     } catch (error) {
//       navigation.navigate('CreateProfile')
//       console.error('Invalid code.', error);
//     }
//   };

//   const onPressResendOtp = () => {
//     if (canResend) {
//       setTimer(30); // restart the timer
//       signInWith_PhoneNumber(userMobileNo); // trigger resend logic
//     }
//   };

//   const startTimer = () => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     setTimer(30); // for example, 60 seconds
//   };

//   const handleChange = (text: string, index: number) => {
//     const filtered = text.replace(/[^0-9]/g, '');
//     const newOtp = [...otp];
//     newOtp[index] = filtered;
//     setOtp(newOtp);

//     // Move to next input if a digit is entered
//     if (filtered && index < inputRefs.length - 1) {
//       inputRefs[index + 1].current?.focus();
//     }
//   };

//   // useEffect(() => {

//   //   let interval: NodeJS.Timeout;

//   //   if (timer > 0) {
//   //     setCanResend(false);
//   //     interval = setInterval(() => {
//   //       setTimer(prev => prev - 1);
//   //     }, 1000);
//   //   } else {
//   //     setCanResend(true);
//   //     clearInterval(interval);
//   //   }
//   //   return () => clearInterval(interval);

//   // }, [timer]);

//   useEffect(() => {
//     if (timer > 0) {
//       setCanResend(false);
//       timerRef.current = setInterval(() => {
//         setTimer(prev => {
//           if (prev <= 1) {
//             clearInterval(timerRef.current!);
//             setCanResend(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timerRef.current!); // ✅ Clean up on unmount
//   }, [timer]);

//   useEffect(() => {
//     signInWith_PhoneNumber(userMobileNo)
//   }, [])

//   useEffect(() => {

//     const checkProfile = async () => {

//       if (getprofile.length <= 0) return;

//       if (getprofile) {
//         setOtp(['', '', '', '', '', '']);
//         inputRefs[0]?.current?.focus(); // Optional: reset focus to first input
//         if ("profile" in getprofile && Object.keys(getprofile.profile).length > 0) {
//           await AsyncStorage.setItem("MobileNo", mobileNumber);
//           dispatch(resetMobileExecuted());
//           navigation.navigate('Home');
//           setProfileExists(true);
//           console.log("Profile found");
//         } else if (getprofile.type === "PROFILE_NOT_FOUND") {
//           setProfileExists(false);
//           await AsyncStorage.setItem("MobileNo", mobileNumber);
//           dispatch(resetMobileExecuted());
//           navigation.navigate('CreateProfile');
//           console.log("Profile not found");
//         } else {
//           setProfileExists(false);
//           console.log("Some other error");
//         }
//       }
//     };
//     checkProfile();
//   }, [mbileExecuted])


//   return (

//     <ScreenWrapper>

//       <KeyboardAvoidingView style={styles.container}>

//         <Text style={styles.textHeading}>Verify Your Number</Text>

//         <Text style={styles.textSubHeading}>
//           {`The code has been sent to ${userMobileNo}`}
//         </Text>

//         <TouchableOpacity
//           onPress={() => navigation.navigate('EnterMobileNo')}
//           style={styles.btnChange}>
//           <GradientText
//             style={styles.textChange}
//             colors={['#F58C00', '#704002']}
//             underline>
//             Change
//           </GradientText>
//         </TouchableOpacity>

//         <View style={styles.containerOTP}>
//           {otp.map((item, index) => (
//             <Input
//               key={index}
//               ref={inputRefs[index]}
//               value={otp[index] ? '•' : ''}
//               onChangeText={text => {
//                 const cleanText = text.replace(/[^0-9]/g, '');
//                 const newOtp = [...otp];
//                 newOtp[index] = cleanText;
//                 setOtp(newOtp);

//                 if (cleanText && index < otp.length - 1) {
//                   inputRefs[index + 1]?.current?.focus();
//                 }
//               }}
//               style={styles.input}
//               maxLength={1}
//               keyboardType="number-pad"
//               textAlign="center"
//             />
//           ))}
//         </View>

//         {error != '' ?
//           <ErrorText message={error} /> : null
//         }

//         <Button
//           style={styles.btn}
//           title="Verify"
//           onPress={onPressVerify}
//           disabled={!isValidOtp}
//         />

//         {/* <View
//           style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
//           <Text style={styles.textSubHeading}>{'30 Sec  '}</Text>

//           <TouchableOpacity onPress={onPressResendOtp} style={styles.btnChange}>
//             <GradientText
//               style={styles.textChange}
//               colors={['#F58C00', '#704002']}
//               underline>
//               Resend OTP
//             </GradientText>
//           </TouchableOpacity>
//         </View> */}

//         <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>

//           <Text style={styles.textSubHeading}>
//             {canResend ? '' : `${timer} Sec `}
//           </Text>

//           <TouchableOpacity
//             onPress={onPressResendOtp}
//             style={[styles.btnChange]}
//             disabled={!canResend}
//           >
//             <GradientText
//               style={[
//                 styles.textChange,
//                 { color: canResend ? '#F58C00' : 'gray' }, // visually disable
//               ]}
//               colors={['#F58C00', '#704002']}
//               underline
//             >
//               Resend OTP
//             </GradientText>
//           </TouchableOpacity>

//         </View>

//       </KeyboardAvoidingView>

//       <Loader visible={isLoader} message="Verifying OTP..." spinnerColor="#F58C00" />
//       <Loader visible={fcmAuthVerifying} message="Loading..." spinnerColor="#F58C00" />

//     </ScreenWrapper >
//   );
// };



// export default VerifyOtp;


import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Fonts from '../../theme/Fonts';
import Colors from '../../theme/Colors';
import Button from '../../components/Button';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Input from '../../components/TextInput';
import GradientText from '../../components/GradientText';
import ErrorText from '../../components/ErrorText';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  getMobileRequest,
  resetMobileExecuted,
} from '../../slices/profile';
import {
  getAuth,
  signInWithPhoneNumber,
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';

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
  btn: {
    alignSelf: 'center',
    marginTop: 50,
  },
  containerOTP: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  input: {
    marginHorizontal: 5,
    flex: 1,
  },
  btnChange: {
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
  textChange: {
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: Fonts.PromptRegular,
  },
});

const VerifyOtp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userMobileNo, mobileNumber }: any = route.params;

  const dispatch = useDispatch();
  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);
  const mobileExecuted: any = useSelector((state: RootState) => state.profile.mobileexecuted);
  const isLoader: any = useSelector((state: RootState) => state.profile.mobile_isLoading);

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [timer, setTimer] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [fcmAuthVerifying, setFcmAuthVerifying] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useMemo(
    () => Array(6).fill(null).map(() => React.createRef<any>()),
    []
  );

  const isValidOtp = useMemo(() => otp.every(digit => digit !== ''), [otp]);

  const startTimer = useCallback(() => {
    setCanResend(false);
    setTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const signInWith_PhoneNumber = useCallback(async (phoneNumber: string) => {
    try {
      setFcmAuthVerifying(true);
      const auth = getAuth();
      const confirmation = await signInWithPhoneNumber(auth, '+' + phoneNumber);
      setConfirm(confirmation);
      startTimer();
    } catch (err) {
      console.error('Phone Number Sign In Error:', err);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setFcmAuthVerifying(false);
    }
  }, [startTimer]);

  const onPressVerify = useCallback(async () => {
    if (!confirm || isVerifying) return;

    setIsVerifying(true);
    setError('');
    try {
      const userCredential = await confirm.confirm(otp.join(''));
      console.log('User signed in successfully:', userCredential);
      dispatch(getMobileRequest(mobileNumber));
    } catch (err) {
      console.error('OTP verification failed:', err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }, [confirm, otp, isVerifying, dispatch, mobileNumber]);

  const onPressResendOtp = useCallback(() => {
    if (canResend) {
      signInWith_PhoneNumber(userMobileNo);
    }
  }, [canResend, signInWith_PhoneNumber, userMobileNo]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      const filtered = text.replace(/[^0-9]/g, '');
      const newOtp = [...otp];
      newOtp[index] = filtered;
      setOtp(newOtp);

      if (filtered && index < inputRefs.length - 1) {
        inputRefs[index + 1].current?.focus();
      }
    },
    [otp, inputRefs]
  );

  useEffect(() => {
    signInWith_PhoneNumber(userMobileNo);
    inputRefs[0]?.current?.focus();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const checkProfile = async () => {
      if (!mobileExecuted || getprofile.length <= 0) return;

      setOtp(['', '', '', '', '', '']);
      inputRefs[0]?.current?.focus();

      if ("profile" in getprofile && Object.keys(getprofile.profile).length > 0) {
        await AsyncStorage.setItem('MobileNo', mobileNumber);
        if (isActive) {
          dispatch(resetMobileExecuted());
          navigation.navigate('Home');
        }
      } else if (getprofile.type === 'PROFILE_NOT_FOUND') {
        await AsyncStorage.setItem('MobileNo', mobileNumber);
        if (isActive) {
          dispatch(resetMobileExecuted());
          navigation.navigate('CreateProfile');
        }
      } else {
        console.log('Unknown response:', getprofile);
      }
    };

    checkProfile();

    return () => {
      isActive = false;
    };
  }, [mobileExecuted]);

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.textHeading}>Verify Your Number</Text>
        <Text style={styles.textSubHeading}>
          {`The code has been sent to ${userMobileNo}`}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('EnterMobileNo')}
          style={styles.btnChange}
        >
          <GradientText
            style={styles.textChange}
            colors={['#F58C00', '#704002']}
            underline
          >
            Change
          </GradientText>
        </TouchableOpacity>

        <View style={styles.containerOTP}>
          {otp.map((value, index) => (
            <Input
              key={index}
              ref={inputRefs[index]}
              value={otp[index] ? '•' : ''}
              onChangeText={text => handleChange(text, index)}
              style={styles.input}
              maxLength={1}
              keyboardType="number-pad"
              textAlign="center"
              accessibilityLabel={`OTP digit ${index + 1}`}
            />
          ))}
        </View>

        {error !== '' && <ErrorText message={error} />}

        <Button
          style={styles.btn}
          title="Verify"
          onPress={onPressVerify}
          disabled={!isValidOtp || isVerifying}
          accessibilityLabel="Verify OTP button"
        />

        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
          <Text style={styles.textSubHeading}>
            {canResend ? '' : `${timer} Sec `}
          </Text>

          <TouchableOpacity
            onPress={onPressResendOtp}
            style={styles.btnChange}
            disabled={!canResend}
          >
            <GradientText
              style={[
                styles.textChange,
                { color: canResend ? '#F58C00' : 'gray' },
              ]}
              colors={['#F58C00', '#704002']}
              underline
            >
              Resend OTP
            </GradientText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Loader
        visible={isLoader}
        message="Verifying phone number..."
        spinnerColor="#F58C00"
      />
      <Loader
        visible={fcmAuthVerifying}
        message="Sending OTP..."
        spinnerColor="#F58C00"
      />
    </ScreenWrapper>
  );
};

export default VerifyOtp;

