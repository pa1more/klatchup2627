import React from 'react'
import {View, StyleProp, ViewStyle} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

interface Props {
  children: React.ReactNode
  borderWidth?: number
  styles?: StyleProp<ViewStyle>
}

const defaultProps: Props = {
  children: <View />,
  borderWidth: 1,
}

const GradientBorderView = ({children, borderWidth, styles}: Props) => {
  return (
    <LinearGradient colors={['#F58C00', '#704002']} style={styles}>
      <View style={[{margin: borderWidth}]}>{children}</View>
    </LinearGradient>
  )
}
GradientBorderView.defaultProps = defaultProps;

export default GradientBorderView
