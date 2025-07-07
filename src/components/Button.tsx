import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
  ImageStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    borderRadius: 30,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'baseline',
  },
  containerDisabled: {
    paddingVertical: 15,
    borderRadius: 30,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.5,
    alignSelf: 'baseline',
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.PromptRegular,
    textAlign: 'center',
  },
  icon: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
  },
});

interface Props {
  title: string
  loading: boolean
  disabled: boolean
  onPress: () => void
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  icon?: ImageSourcePropType
  iconStyle?: StyleProp<ImageStyle>
}

const defaultProps: Props = {
  title: '',
  loading: false,
  disabled: false,
  style: {},
  textStyle: {},
  iconStyle: {},
  onPress: () => {},
};

const Button = ({
  title,
  disabled,
  loading,
  onPress,
  style,
  textStyle,
  icon,
  iconStyle,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.55}>
      <LinearGradient
        style={
          disabled
            ? [styles.containerDisabled, style]
            : [styles.container, style]
        }
        colors={['#F58C00', '#704002']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
        {icon && <Image style={[styles.icon, [iconStyle]]} source={icon} />}
      </LinearGradient>
    </TouchableOpacity>
  );
};

Button.defaultProps = defaultProps;

export default Button;
