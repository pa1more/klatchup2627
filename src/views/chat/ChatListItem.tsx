import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import GradientBorderView from '../../components/GradientBorderView';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import {Swipeable} from 'react-native-gesture-handler';
import ToolbarIcon from '../../components/ToolbarIcon';

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginVertical: 5,
    backgroundColor: '#CD0000',
  },
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
    color: Colors.white,
    fontFamily: Fonts.PromptMedium,
    fontSize: 18,
    marginTop: 10,
  },
  textTime: {
    color: '#B5ACC2',
    fontFamily: Fonts.PromptRegular,
    fontSize: 10,
    marginTop: 10,
  },
  textMsg: {
    fontFamily: Fonts.PromptRegular,
    fontSize: 12,
    color: Colors.white,
  },
  textUnread: {
    color: Colors.white,
    fontFamily: Fonts.PromptRegular,
    fontSize: 14,
  },
  containerUnread: {
    backgroundColor: '#4D1469',
    borderRadius: 8,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeLeftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    marginVertical: 5,
    borderRadius: 20,
  },
});

interface Props {
  imageUrl: string
  name: string
  lastMessage: string
  onPress: () => void
  onPressDelete: () => void
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
  onPressDelete: () => {},
}

const RightActions = ({progress, dragX, onPress}) => {

  return (
    
    <View style={styles.swipeLeftContainer}>
      <ToolbarIcon
        icon={require('../../assets/icons/ic_message_block.png')}
        onPress={onPress}
      />
    </View>
  )
}

const ChatListItem = ({
  name,
  imageUrl,
  lastMessage,
  unreadCount,
  time,
  onPress,
  onPressDelete,
}: Props) => {
  console.log(imageUrl)
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <Swipeable
        containerStyle={styles.container}
        overshootLeft={false}
        overshootRight={false}
        renderRightActions={(progress, dragX) => (
          <RightActions
            progress={progress}
            dragX={dragX}
            onPress={onPressDelete}
          />
        )}>
        <GradientBorderView styles={styles.gradient}>
          <View style={styles.item}>
            <Image source={{uri: imageUrl}} style={styles.image} />
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
      </Swipeable>
    </TouchableOpacity>
  );
};

ChatListItem.defaultProps = defaultProps

export default ChatListItem;
