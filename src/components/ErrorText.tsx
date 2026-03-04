import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'
import React from 'react'
import { DesignSystem } from '../theme/DesignSystem'

const styles = StyleSheet.create({
  textError: {
    color: DesignSystem.colors.danger,
    fontSize: 14,
    fontWeight: '400',
  },
})

interface Props {
  message: string
  style?: StyleProp<TextStyle>
}

const defaultProps: Props = {
  message: '',
  style: {},
}

const ErrorText = ({ message = "", style = {} }: Props) => (
  <Text style={styles.textError}>{message}</Text>
);

//ErrorText.defaultProps = defaultProps

export default ErrorText
