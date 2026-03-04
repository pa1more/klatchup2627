import React from 'react'
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  View,
  SafeAreaView,
  Platform,
  Text,
} from 'react-native'
import { DesignSystem } from '../theme/DesignSystem'

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background,
  },
})

interface Props {
  children: React.ReactNode
}

const defaultProps: Props = {
  children: <View />,
}

const ScreenWrapper = (props: Props) => {
  try {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && (
          <StatusBar
            backgroundColor={DesignSystem.colors.background}
            barStyle="light-content"
            translucent={false}
          />
        )}
        <SafeAreaView style={{flex: 1}}>{props.children}</SafeAreaView>
      </View>
    )
  } catch (error) {
    console.error('ScreenWrapper error:', error);
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <Text>Error rendering screen</Text>
      </View>
    );
  }
}

ScreenWrapper.defaultProps = defaultProps

export default ScreenWrapper
