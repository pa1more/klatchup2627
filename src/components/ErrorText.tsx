import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'
import React from 'react'
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'

const styles = StyleSheet.create({
  textError: {
    color: Colors.errorText,
    fontSize: 14,
    fontFamily: Fonts.PromptRegular,
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
