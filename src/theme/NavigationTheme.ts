import {DefaultTheme} from '@react-navigation/native';
import { DesignSystem } from './DesignSystem';

const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: DesignSystem.colors.primary,
    background: DesignSystem.colors.background,
  },
};

export default theme;
