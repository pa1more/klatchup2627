import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import { DesignSystem } from '../theme/DesignSystem';

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
    fontSize: 24,
    color: DesignSystem.colors.white,
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
