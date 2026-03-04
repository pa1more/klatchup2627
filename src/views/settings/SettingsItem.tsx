import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { DesignSystem } from '../../theme/DesignSystem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    borderBottomColor: '#B5ACC2',
    borderBottomWidth: 1,
  },
  textTitle: {
    color: DesignSystem.colors.white,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    height: 24,
    width: 24,
  },
});

interface Props {
  title: string
  icon: ImageSourcePropType
  onPress: () => void
}

const defaultProps: Props = {
  title: '',
  onPress: () => {},
  icon: require('../../assets/icons/ic_notification.png'),
}

const SettingsItem = ({title, icon, onPress}: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.6}
      onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text numberOfLines={1} style={styles.textTitle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

SettingsItem.defaultProps = defaultProps

export default SettingsItem;
