import { StyleSheet, ScrollView, Alert } from 'react-native';
import React from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from '../../components/Toolbar';
import SettingsItem from './SettingsItem';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../slices/profile';

const styles = StyleSheet.create({
  btn: {
    marginTop: 100,
    alignSelf: 'center',
  },
  iconLogout: {
    height: 24,
    width: 24,
  },
});

const SettingsScreen = () => {

  const navigation = useNavigation();

  const dispatch = useDispatch();


  const confirmLogout = () => {

    Alert.alert(
      'Log Out', // Title
      'Are you sure you want to log out?', // Message
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.navigate('Intro');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScreenWrapper>
      <Toolbar title="Settings" />
      <ScrollView>
        <SettingsItem
          title="Notification Sound"
          icon={require('../../assets/icons/ic_notification.png')}
        />
        <SettingsItem
          title="Privacy policy"
          icon={require('../../assets/icons/ic_privacy_policy.png')}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
        <SettingsItem
          title="Terms of use"
          icon={require('../../assets/icons/ic_terms.png')}
          onPress={() => navigation.navigate('Terms')}
        />
        <SettingsItem
          title="Help & support"
          icon={require('../../assets/icons/ic_help.png')}
          onPress={() => navigation.navigate('HelpSupport')}
        />
        <SettingsItem
          title="Report a problem"
          icon={require('../../assets/icons/ic_reportproblem.png')}
        />
        <SettingsItem
          title="Give us feedback"
          icon={require('../../assets/icons/ic_feedback.png')}
          onPress={() => navigation.navigate('GiveFeedback')}
        />
        <Button
          onPress={() => confirmLogout()}
          title="Logout"
          icon={require('../../assets/icons/ic_logout.png')}
          style={styles.btn}
          iconStyle={styles.iconLogout}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SettingsScreen
