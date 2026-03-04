import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { DesignSystem } from '../../theme/DesignSystem'

const { width } = Dimensions.get('window')
const maxWidth = width * 0.7

const styles = StyleSheet.create({
  containerReceivedMsg: {
    padding: 10,
    margin: 5,
    maxWidth: maxWidth,
    marginRight: 'auto',
    backgroundColor: '#F2EAFF',
    minWidth: 70,
    borderRadius: 20,
  },
  containerSelfMsg: {
    padding: 10,
    margin: 5,
    maxWidth: maxWidth,
    marginLeft: 'auto',
    backgroundColor: '#4D1469',
    minWidth: 70,
    borderRadius: 20,
  },
  textSelfMsg: {
    color: DesignSystem.colors.white,
    fontSize: 14,
    fontWeight: '400',
  },
  textReceivedMsg: {
    color: DesignSystem.colors.black,
    fontSize: 14,
    fontWeight: '400',
  },
  textSentTime: {
    color: '#B5ACC2',
    fontSize: 10,
    fontWeight: '400',
    marginHorizontal: 15,
    textAlign: 'right',
  },
  textReceivedTime: {
    color: '#B5ACC2',
    fontSize: 10,
    fontWeight: '400',
    marginHorizontal: 15,
    textAlign: 'left',
  },
})

interface Props {
  message: string
  isSelf: boolean
  time: string
}

interface Fprops {
  isSelf: boolean
  sender: string
  text: string
  timestamp: string
}

const defaultProps: Props = {
  message: '',
  isSelf: false,
  time: '',
};

const firebaseProps: Fprops = {
  isSelf: false,
  sender: '',
  text: '',
  timestamp: '',
};

const MessageItem = ({ isSelf, message, time }: Props) => {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        style={isSelf ? styles.containerSelfMsg : styles.containerReceivedMsg}>
        <Text style={isSelf ? styles.textSelfMsg : styles.textReceivedMsg}>
          {message}
        </Text>
      </TouchableOpacity>
      <Text style={isSelf ? styles.textSentTime : styles.textReceivedTime}>
        {time}
      </Text>
    </View>
  );
};

const FMessageItem = ({ isSelf, text, timestamp }: Fprops) => {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        style={isSelf ? styles.containerSelfMsg : styles.containerReceivedMsg}>
        <Text style={isSelf ? styles.textSelfMsg : styles.textReceivedMsg}>
          {text}
        </Text>
      </TouchableOpacity>
      {/* <Text style={styles.textSentTime}>
        {timestamp}
      </Text> */}
    </View>
  );
};

MessageItem.defaultProps = defaultProps
FMessageItem.firebaseProps = firebaseProps

export default FMessageItem;
