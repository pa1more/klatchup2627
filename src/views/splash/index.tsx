import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useNavigation } from '@react-navigation/core'
import SplashAnimation from '../../components/SplashAnimation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const SplashScreen = () => {

  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Intro');
    }, 1600);
  }, [navigation])

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <SplashAnimation />
      </View>
    </ScreenWrapper>
  )
}

export default SplashScreen
