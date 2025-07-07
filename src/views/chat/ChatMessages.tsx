import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import ToolbarIcon from '../../components/ToolbarIcon';
import Fonts from '../../theme/Fonts';
import FMessageItem from './MessageItem';
import Toolbar from './ChatToolbar';

import FirebaseService from '../../../firebaseService';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { getDatabase, ref, onChildAdded, off } from '@react-native-firebase/database';

const styles = StyleSheet.create({
  containerBottom: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  textInputMsg: {
    margin: 5,
    borderRadius: 20,
    maxHeight: 80,
    paddingLeft: 10,
    paddingRight: 50,
    minHeight: 40,
    flex: 1,
    backgroundColor: '#F2EAFF',
    fontFamily: Fonts.PromptRegular,
    fontSize: 14,
  },
  containerTextInputIcons: {
    position: 'absolute',
    right: 0,
    marginRight: 10,
    flexDirection: 'row',
  },
  btnTextInput: {
    alignItems: 'center',
  },
  list: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

// Define types for messages
interface Message {
  text: string;
  sender: string;
  timestamp: number;
}

const ChatMessages = ({ route }: any) => {

  const { item } = route.params;

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
  ])

  const flatListRef = useRef<FlatList>(null);
  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck); // login user

  const senderId = getprofile.profile.profileId // Replace with the current user's ID

  const getChatRoomId = (id1: string, id2: string): string => {
    return [id1, id2].sort().join('-'); // always returns same string no matter the order
  };

  let roomId = getChatRoomId(getprofile.profile.name, item.name);//getprofile.profile.name + "--" + item.name


  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      await FirebaseService.sendMessage(roomId, message, senderId);
      setMessage(''); // Clear the input field
    }
  };


  useEffect(() => {

    const unsubscribe = FirebaseService.listenForMessages(
      roomId,
      (newMessage: Message) => {
        console.log('Message received in ChatMessages:', newMessage);
        //setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe?.();
      console.log('Unsubscribing from messages in room:', roomId);
    };
  }, []);


  return (

    <ScreenWrapper>
      <Toolbar
        name={item.name}
        image={item.profilePicture}
        onPressReport
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={30}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={flatListRef}
          inverted
          style={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          maxToRenderPerBatch={10}
          removeClippedSubviews
          initialNumToRender={10}
          updateCellsBatchingPeriod={100}
          windowSize={4}
          contentContainerStyle={styles.list}
          data={messages}
          keyExtractor={(item, index) => `${item.timestamp || Date.now()}_${index}`}
          onEndReachedThreshold={0.95}
          onScroll={() => Keyboard.dismiss()}
          renderItem={({ item }) => (
            <FMessageItem
              isSelf={item?.sender !== senderId}
              sender={item?.sender}
              text={item?.text}
              timestamp={item?.timestamp}
            />
          )}
        />

        <View style={styles.containerBottom}>
          <TextInput
            value={message}
            onChangeText={text => {
              setMessage(text)
            }}
            style={styles.textInputMsg}
            placeholderTextColor="#B5ACC2"
            multiline
            placeholder="Type a message here"
          />

          <View style={styles.containerTextInputIcons}>
            <TouchableOpacity style={styles.btnTextInput}>
              <ToolbarIcon icon={require('../../assets/icons/ic_send.png')} onPress={handleSendMessage} />
            </TouchableOpacity>
          </View>

        </View>

      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ChatMessages;
