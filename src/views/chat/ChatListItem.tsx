import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import GradientBorderView from '../../components/GradientBorderView';
import { DesignSystem } from '../../theme/DesignSystem';

const styles = StyleSheet.create({
  image: {
    height: 75,
    width: 75,
    borderRadius: 20,
  },
  gradient: {
    borderRadius: 20,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#300943',
    borderRadius: 20,
  },
  containerDetails: {
    marginHorizontal: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textName: {
    color: DesignSystem.colors.white,
    fontWeight: '500',
    fontSize: 18,
    marginTop: 10,
  },
  textTime: {
    color: '#B5ACC2',
    fontWeight: '400',
    fontSize: 10,
    marginTop: 10,
  },
  textMsg: {
    fontWeight: '400',
    fontSize: 12,
    color: DesignSystem.colors.white,
  },
  textUnread: {
    color: DesignSystem.colors.white,
    fontWeight: '400',
    fontSize: 14,
  },
  containerUnread: {
    backgroundColor: '#4D1469',
    borderRadius: 8,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Props {
  imageUrl: string
  name: string
  lastMessage: string
  onPress: () => void
  unreadCount: number
  time: string
}

const defaultProps: Props = {
  imageUrl: '',
  name: '',
  lastMessage: '',
  onPress: () => {},
  unreadCount: 0,
  time: '',
}

const ChatListItem = ({
  name,
  imageUrl,
  lastMessage,
  unreadCount,
  time,
  onPress,
}: Props) => {
  const hasValidImage = typeof imageUrl === 'string' && imageUrl.trim().length > 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <GradientBorderView styles={styles.gradient}>
        <View style={styles.item}>
          <Image
            source={
              hasValidImage
                ? { uri: imageUrl }
                : require('../../assets/images/intro.png')
            }
            style={styles.image}
          />
          <View style={styles.containerDetails}>
            <View style={styles.row}>
              <Text style={styles.textName}>{name}</Text>
              <Text style={styles.textTime}>{time}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.textMsg}>{lastMessage}</Text>
              {unreadCount > 0 && (
                <View style={styles.containerUnread}>
                  <Text style={styles.textUnread}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </GradientBorderView>
    </TouchableOpacity>
  );
};

ChatListItem.defaultProps = defaultProps

export default ChatListItem;
