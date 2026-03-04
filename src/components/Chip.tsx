import React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { DesignSystem } from '../theme/DesignSystem'
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
  chip: {},
  container: {
    padding: 8,
    margin: 5,
    borderRadius: 20,
  },
  containerSelected: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  text: {
    fontWeight: '400',
    fontSize: 14,
    color: '#4D1469',
  },
  textSelected: {
    fontWeight: '400',
    fontSize: 14,
    color: DesignSystem.colors.white,
  },
});

interface Props {
  title: string
  isSelected: boolean
  disabled: boolean
  onSelected: (option: string) => void
  style?: StyleProp<ViewStyle>
}

const defaultProps: Props = {
  title: '',
  isSelected: false,
  onSelected: () => {},
  style: {},
  disabled: false,
}

const Chip = ({isSelected, onSelected, title, style, disabled}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.chip}
      disabled={disabled}
      onPress={() => onSelected(title)}>
      <LinearGradient
        style={
          isSelected
            ? [styles.containerSelected, style]
            : [styles.container, style]
        }
        colors={isSelected ? ['#F58C00', '#704002'] : ['#F2EAFF', '#F2EAFF']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <Text style={isSelected ? styles.textSelected : styles.text}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

Chip.defaultProps = defaultProps

export default Chip
