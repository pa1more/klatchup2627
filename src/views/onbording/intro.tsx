import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useNavigation } from '@react-navigation/core';
import { DesignSystem } from '../../theme/DesignSystem';
import GradientText from '../../components/GradientText';
import Button from '../../components/Button';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    margin: 20,
  },
  containerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textKlatchup: {
    fontWeight: '600',
    fontSize: 24,
  },
  imageLogo: {
    height: 40,
    width: 40,
    marginHorizontal: 20,
  },
  imageIntro: {
    marginVertical: 30,
    height: '30%',
  },
  textHeading: {
    color: DesignSystem.colors.white,
    fontWeight: '600',
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  textBysinging: {
    color: DesignSystem.colors.white,
    fontWeight: '400',
    fontSize: 14,
  },
  textTerms: {
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  iconNext: {
    height: 15,
    width: 10,
  },
});

const IntroScreen = () => {

  const navigation = useNavigation();

  const onPressTerms = () => { };

  const onPressPrivacyPolicy = () => { };

  const onPressNext = () => navigation.navigate('EnterMobileNo'); //navigation.navigate('EnterMobileNo');

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <Image
            style={styles.imageLogo}
            source={require('../../assets/icons/ic_logo.png')}
          />
          <GradientText
            colors={['#F58C00', '#704002']}
            style={styles.textKlatchup}>
            KlatchUp
          </GradientText>
        </View>

        <Image
          style={styles.imageIntro}
          source={require('../../assets/images/intro.png')}
        />

        <Text style={styles.textHeading}>
          It’s time to meet new people in a modern way!
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 20,
          }}>
          <Text style={styles.textBysinging}>
            {'By signing up, you agree to our '}
          </Text>

          <TouchableOpacity onPress={onPressTerms}>
            <GradientText
              colors={['#F58C00', '#704002']}
              style={styles.textTerms}>
              {'Terms'}
            </GradientText>
          </TouchableOpacity>

          <Text style={styles.textBysinging}>{' & '}</Text>

          <TouchableOpacity onPress={onPressPrivacyPolicy}>
            <GradientText
              colors={['#F58C00', '#704002']}
              style={styles.textTerms}>
              {'Privacy Policy'}
            </GradientText>
          </TouchableOpacity>
        </View>

        <Button
          title="Let’s Get Started"
          icon={require('../../assets/icons/ic_next.png')}
          iconStyle={styles.iconNext}
          onPress={onPressNext}
        />
      </View>
    </ScreenWrapper>
  );
};

export default IntroScreen;
