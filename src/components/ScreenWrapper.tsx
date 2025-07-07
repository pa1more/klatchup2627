import React from 'react'
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  View,
  SafeAreaView,
  Platform,
} from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import Colors from '../theme/Colors'

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

interface Props {
  children: React.ReactNode
}

const defaultProps: Props = {
  children: <View />,
}

const ScreenWrapper = (props: Props) => {
  return (
    <RadialGradient
      style={styles.container}
      colors={[Colors.gradientBg1, Colors.gradientBg2]}
      stops={[0, 1]}
      center={[width / 2, height / 2]}
      radius={height / 2}>
      <StatusBar
        backgroundColor={Colors.gradientBg2}
        barStyle="light-content"
        translucent={Platform.OS === 'ios'}
      />
      <SafeAreaView style={{flex: 1}}>{props.children}</SafeAreaView>
    </RadialGradient>
  )
}

ScreenWrapper.defaultProps = defaultProps

export default ScreenWrapper
