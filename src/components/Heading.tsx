import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import Fonts from '../theme/Fonts';
import Colors from '../theme/Colors';

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.UnboundedMedium,
    fontSize: 24,
    color: Colors.white,
  },
})

interface Props {
  message: string
  style?: StyleProp<TextStyle>
}

const defaultProps: Props = {
  message: '',
  style: {},
};

const Heading = ({message, style}: Props) => (
  <Text style={[styles.text, style]}>{message}</Text>
);

Heading.defaultProps = defaultProps;

export default Heading;
