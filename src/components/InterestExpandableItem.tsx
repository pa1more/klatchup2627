import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import { DesignSystem } from '../theme/DesignSystem';

const styles = StyleSheet.create({
  continer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  textTitle: {
    flex: 1,
    color: DesignSystem.colors.white,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  icon: {
    height: 24,
    width: 24,
  },
  iconUp: {
    height: 24,
    width: 24,
    transform: [{rotate: '180deg'}],
  },
  textDesctiption: {
    color: DesignSystem.colors.white,
    fontSize: 14,
    fontWeight: '400',
    borderWidth: 1,
    borderColor: DesignSystem.colors.white,
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
});

interface Props {
  title: string
  description: string
}

const defaultProps: Props = {
  title: '',
  description: '',
}

const InterestExpandableItem = ({title, description}: Props) => {

  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.continer}>
        <Text style={styles.textTitle}>{title}</Text>
        <Image
          style={isExpanded ? styles.icon : styles.iconUp}
          source={require('../assets/icons/ic_arrow_up.png')}
        />
      </TouchableOpacity>
      {isExpanded && <Text style={styles.textDesctiption}>{description}</Text>}
    </View>
  );
};

InterestExpandableItem.defaultProps = defaultProps

export default InterestExpandableItem
