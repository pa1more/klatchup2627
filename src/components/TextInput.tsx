import React, { forwardRef } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F2EAFF',
    paddingVertical: 12,
    borderRadius: 20,
    fontWeight: '400',
    fontSize: 16,
    height: 48,
    paddingHorizontal: 18,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
})

// const Input = (props: TextInputProps) => {
//   return <TextInput {...props} style={[styles.input, props.style]} />
// }

const Input = forwardRef<TextInput, TextInputProps>((props, ref) => {
  return <TextInput ref={ref} {...props} style={[styles.input, props.style]} />;
});

Input.displayName = 'Input';

export default Input
