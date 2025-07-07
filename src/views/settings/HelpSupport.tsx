import {View, Text, StyleSheet} from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Toolbar from '../../components/Toolbar'
import Fonts from '../../theme/Fonts'
import Colors from '../../theme/Colors'
import SettingsOption from '../../components/SettingsOption'

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  textTitle: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: Fonts.UnboundedMedium,
  },
  textsub: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.PromptRegular,
    marginBottom: 20,
  },
});

const HelpSupport = () => {
  return (
    <ScreenWrapper>
      <Toolbar title="" />
      <View style={styles.container}>
        <Text style={styles.textTitle}>Help & Support</Text>
        <Text style={styles.textsub}>
          Commodo adipisicing eu exercitation voluptate cupidatat deserunt
          reprehenderit amet ex labore.
        </Text>
        <SettingsOption
          icon={require('../../assets/icons/ic_email.png')}
          title="Email Address"
          onPress={() => {}}
        />
      </View>
    </ScreenWrapper>
  )
}

export default HelpSupport;
