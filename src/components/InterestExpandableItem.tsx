import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Colors from '../theme/Colors';
import Fonts from '../theme/Fonts';

const styles = StyleSheet.create({
  continer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  textTitle: {
    flex: 1,
    color: Colors.white,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: Fonts.PromptMedium,
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
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.PromptRegular,
    borderWidth: 1,
    borderColor: Colors.white,
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
