import {DefaultTheme} from '@react-navigation/native';
import Colors from './Colors';

const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme,
    primary: Colors.gradientBg1,
    background: Colors.gradientBg2,
  },
};

export default theme;
