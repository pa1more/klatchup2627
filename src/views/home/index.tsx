import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper'
import { DesignSystem } from '../../theme/DesignSystem'

import DropShadow from 'react-native-drop-shadow';
import BottomBar from '../../components/BottomBar'
import HomeHelperModal from '../../components/HomeHelperModal'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { getMobileRequest, resetMobileExecuted } from '../../slices/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: '100%',
  },
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLogo: {
    height: 70,
    width: 70,
  },
  containerKlatchup: {
    height: 140,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#300943',
    borderRadius: 70,
    marginBottom: 50,
    alignSelf: 'center',
  },
  containerKlatchupShadow: {
    shadowColor: '#F58C0080',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  icNotifications: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
  },
  textName: {
    color: DesignSystem.colors.white,
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
  },
});

const HomeScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [showHelper, setShowHelper] = useState(true);
  //const [mobileNo, setMobileNo] = useState('0');

  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);
  //const mobileexecuted = useSelector((state: RootState) => state.profile.mobileexecuted);

  const onPressKlatchup = () => navigation.navigate('FindingSociety');
  const onPressNotifications = () => { };

  // const getData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("MobileNo");
  //     if (value !== null) {
  //       dispatch(getMobileRequest(value));
  //     } else { setMobileNo('0') }
  //   } catch (e) {
  //     setMobileNo('0');
  //   }
  // };

  // useEffect(() => {
  //   if (mobileexecuted) {
  //     dispatch(resetMobileExecuted());
  //   }
  // }, [mobileexecuted]);


  // useEffect(() => {
  //   getData();
  // }, [])


  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.icNotifications}
          onPress={() => onPressNotifications}>
          <Image
            style={styles.icNotifications}
            source={require('../../assets/icons/ic_notifications.png')}
          />
        </TouchableOpacity>
        <Text style={styles.textName}>Hi, {getprofile.profile != undefined ? getprofile.profile.name : null}</Text>

        <View style={styles.containerMain}>
          <DropShadow style={styles.containerKlatchupShadow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.containerKlatchup}
              onPress={onPressKlatchup}>
              <Image
                style={styles.imageLogo}
                source={require('../../assets/icons/ic_logo.png')}
              />
            </TouchableOpacity>
          </DropShadow>
        </View>

        <HomeHelperModal
          isVisible={showHelper}
          hide={() => setShowHelper(false)}
        />
        <BottomBar />
      </View>
    </ScreenWrapper>

  );
};

export default HomeScreen;
