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
  ActivityIndicator,
  Alert,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from './ChatToolbar';
import { DesignSystem } from '../../theme/DesignSystem';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  getChatMessagesAPI,
  markMessagesAsReadAPI,
  sendChatMessageAPI,
} from '../../services/chatService';
import { checkInAPI } from '../../services/checkinService';

const styles = StyleSheet.create({
  containerBottom: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-end',
    backgroundColor: '#1a0a2e',
    borderTopWidth: 1,
    borderTopColor: '#3D2566',
  },
  textInputMsg: {
    flex: 1,
    borderRadius: 24,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 48,
    backgroundColor: '#300943',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3D2566',
    marginRight: 12,
  },
  containerTextInputIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnTextInput: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D084',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    marginHorizontal: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#CCCCCC',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubbleContainer: {
    marginVertical: 6,
    marginHorizontal: 4,
    maxWidth: '85%',
  },
  messageBubbleOwn: {
    alignSelf: 'flex-end',
    backgroundColor: '#00D084',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageBubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A4A4A',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  messageTime: {
    color: '#B5ACC2',
    fontSize: 11,
    fontWeight: '400',
    marginTop: 4,
  },
});

interface Message {
  id: string;
  senderId: string;
  timestamp: number;
  message: string;
}

const ChatMessages = ({ route }: any) => {
  const item = route?.params?.item || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const profileToken = useSelector((state: RootState) => state.profile.token);
  const sampleToken = useSelector((state: RootState) => state.sample.token);
  const token = profileToken || sampleToken;
  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);
  const currentUserId = getprofile?.profile?.profileId;

  const receiverId = item?.profileId || item?.userId || item?.id;
  const checkedInPlace =
    item?.currentLocation?.placeName ||
    getprofile?.profile?.currentLocation?.placeName ||
    '';
  const currentLat = Number(getprofile?.profile?.currentLocation?.lat || 0);
  const currentLong = Number(getprofile?.profile?.currentLocation?.long || 0);

  const loadMessages = async () => {
    if (!token || !receiverId) {
      setLoading(false);
      return;
    }

    try {
      const response = await getChatMessagesAPI(token, {
        userId: receiverId,
        limit: 50,
      });

      if (response?.messages) {
        setMessages(response.messages);

        if (response?.conversationId) {
          markMessagesAsReadAPI(token, {
            conversationId: response.conversationId,
          }).catch(() => null);
        }
      }
    } catch (error: any) {
      console.error('Failed to load chat messages:', error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3500);
    return () => clearInterval(interval);
  }, [token, receiverId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !token || !receiverId) {
      return;
    }

    if (!checkedInPlace) {
      Alert.alert('Unable to send', 'Please check in to a location to start chatting.');
      return;
    }

    const pendingMessage = message.trim();
    setMessage('');
    setSending(true);

    try {
      await sendChatMessageAPI(token, {
        receiverId,
        message: pendingMessage,
        checkedInPlace,
      });
      await loadMessages();
    } catch (error: any) {
      const errorMessage = error?.message || 'Unable to send message';

      if (errorMessage.includes('checked out')) {
        const hasLocation = Boolean(checkedInPlace && currentLat && currentLong);

        if (hasLocation) {
          try {
            await checkInAPI(token, {
              placeName: checkedInPlace,
              latitude: currentLat,
              longitude: currentLong,
            });

            await sendChatMessageAPI(token, {
              receiverId,
              message: pendingMessage,
              checkedInPlace,
            });

            await loadMessages();
            return;
          } catch (retryError: any) {
            setMessage(pendingMessage);
            Alert.alert(
              'User unavailable',
              retryError?.message?.includes('checked out')
                ? 'The other user is currently checked out. Ask them to check in and try again.'
                : retryError?.message || 'Unable to send message'
            );
            return;
          }
        }

        setMessage(pendingMessage);
        Alert.alert('Check-in required', 'Please check in at a location, then try sending again.');
        return;
      }

      setMessage(pendingMessage);
      Alert.alert('Send failed', errorMessage);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <Toolbar name={item?.name || 'Chat'} image={item?.profilePicture} onPressReport={() => {}} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignSystem.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Toolbar
        name={item?.name || 'Chat'}
        image={item?.profilePicture}
        onPressReport={() => {}}
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
          keyExtractor={(chatItem, index) => String(chatItem?.id || chatItem?.timestamp || index)}
          onEndReachedThreshold={0.95}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.messageBubbleContainer}>
              <View
                style={
                  item?.senderId === currentUserId
                    ? styles.messageBubbleOwn
                    : styles.messageBubbleOther
                }
              >
                <Text style={styles.messageText}>
                  {String(item?.message || '')}
                </Text>
              </View>
            </View>
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
            placeholder="Type a message..."
          />

          <View style={styles.containerTextInputIcons}>
            <TouchableOpacity
              style={styles.btnTextInput}
              onPress={handleSendMessage}
              disabled={sending || !message.trim()}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendText}>✓</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ChatMessages;
