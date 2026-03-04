import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import GradientBorderView from './GradientBorderView';
import { DesignSystem } from '../theme/DesignSystem';

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: '#300943',
    flexDirection: 'row',
    padding: 10,
    width: '100%',
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
  containerGradient: {
    borderRadius: 20,
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
  icon: require('../assets/icons/ic_email.png'),
};

const SettingsOption = ({title, onPress, icon}: Props) => {
  return (
    <TouchableOpacity
      style={{width: '100%'}}
      onPress={onPress}
      activeOpacity={0.6}>
      <GradientBorderView styles={styles.containerGradient}>
        <View style={styles.container}>
          <Image source={icon} style={styles.icon} />
          <Text numberOfLines={1} style={styles.textTitle}>
            {title}
          </Text>
        </View>
      </GradientBorderView>
    </TouchableOpacity>
  );
};

SettingsOption.defaultProps = defaultProps;

export default SettingsOption;
