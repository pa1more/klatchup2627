import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';

const InputOtp = forwardRef<TextInput, TextInputProps>((props, ref) => {
    return (
        <TextInput
            ref={ref}
            {...props}
        />
    );
});

export default InputOtp;