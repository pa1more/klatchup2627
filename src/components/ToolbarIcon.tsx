import {
  StyleSheet,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  btn: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 25,
    width: 25,
  },
});

interface Props {
  onPress: () => void
  style?: StyleProp<ViewStyle>
  icon: ImageSourcePropType
}

const defaultProps: Props = {
  onPress: () => {},
  style: {},
  icon: require('../assets/icons/ic_back.png'),
}

const ToolbarIcon = ({onPress, style, icon}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.btn, style]}
      onPress={onPress}>
      <Image style={styles.icon} source={icon} resizeMode="cover" />
    </TouchableOpacity>
  );
};

ToolbarIcon.defaultProps = defaultProps;

export default ToolbarIcon;
