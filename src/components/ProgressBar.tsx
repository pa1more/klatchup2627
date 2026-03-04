import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { DesignSystem } from '../theme/DesignSystem'

const styles = StyleSheet.create({
  container: {
    height: 4,
    backgroundColor: DesignSystem.colors.white,
    borderRadius: 10,
  },
  containerProgress: {
    height: 4,
    borderRadius: 10,
  },
})

interface Props {
  progressPercantage: number
  style?: StyleProp<ViewStyle>
}

const defaultProps: Props = {
  progressPercantage: 0,
  style: {},
};

const ProgressBar = ({progressPercantage, style}: Props) => {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        style={[styles.containerProgress, {width: `${progressPercantage}%`}]}
        colors={['#F58C00', '#704002']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
      />
    </View>
  )
}

ProgressBar.defaultProps = defaultProps;

export default ProgressBar
