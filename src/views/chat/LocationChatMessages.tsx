import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { DesignSystem } from '../../theme/DesignSystem';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  sendChatMessageAPI,
  getChatMessagesAPI,
  markMessagesAsReadAPI,
} from '../../services/chatService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#300943',
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: DesignSystem.colors.white,
    fontSize: 18,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messageItem: {
    marginVertical: 6,
    flexDirection: 'row',
    maxWidth: '85%',
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    justifyContent: 'center',
  },
  messageText: {
    color: DesignSystem.colors.white,
    fontSize: 14,
    fontWeight: '400',
  },
  messageTime: {
    color: '#B5ACC2',
    fontSize: 10,
    fontWeight: '400',
    marginTop: 4,
  },
  myMessage: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  myBubble: {
    backgroundColor: DesignSystem.colors.primary,
  },
  otherMessage: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  otherBubble: {
    backgroundColor: '#4A4A4A',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1A1A1A',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#300943',
    color: DesignSystem.colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 40,
    maxHeight: 100,
    fontWeight: '400',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: DesignSystem.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: DesignSystem.colors.white,
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: DesignSystem.colors.white,
    fontSize: 14,
    fontWeight: '400',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

const LocationChatMessages = ({ route }: any) => {
  const params = route?.params || {};
  const {
    userId,
    name,
    profilePicture,
    checkedInPlace,
  } = params;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💬 [LocationChatMessages] Component mounted');
  console.log('💬 Route params:', JSON.stringify(params, null, 2));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const profileToken = useSelector((state: RootState) => state.profile.token);
  const sampleToken = useSelector((state: RootState) => state.sample.token);
  const token = profileToken || sampleToken;
  const getprofile: any = useSelector(
    (state: RootState) => state.profile.mobileCheck
  );
  const currentUserId = getprofile?.profile?.profileId;

  const conversationId = [currentUserId, userId].filter(Boolean).sort().join('-');

  useEffect(() => {
    loadMessages();
    // Set up polling for new messages (every 2 seconds)
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [userId, token]);

  const loadMessages = async () => {
    if (!token) {
      setError('Authentication token not found');
      return;
    }
    if (!userId) {
      setError('Invalid chat user');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📥 Loading messages with userId:', userId);
      
      const response = await getChatMessagesAPI(token, {
        userId,
        limit: 50,
      });

      console.log('✅ Messages loaded:', response?.messages?.length || 0);

      if (response && response.messages) {
        setMessages(response.messages);
        setIsLoading(false);

        // Mark messages as read
        if (response.conversationId) {
          await markMessagesAsReadAPI(token, {
            conversationId: response.conversationId,
          }).catch(err => {
            console.error('Failed to mark as read (non-critical):', err);
          });
        }

        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (err: any) {
      console.error('❌ Error loading messages:', err);
      setIsLoading(false);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !token) {
      return;
    }

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      console.log('========================================');
      console.log('📤 [Send Message] Starting...');
      console.log('📤 userId:', userId);
      console.log('📤 checkedInPlace:', checkedInPlace);
      console.log('📤 message:', messageText.substring(0, 30) + '...');
      console.log('📤 currentUserId:', currentUserId);
      console.log('========================================');
      
      const result = await sendChatMessageAPI(token, {
        receiverId: userId,
        message: messageText,
        checkedInPlace,
      });
      
      console.log('✅ Message sent successfully:', result);

      // Reload messages after sending
      await loadMessages();
    } catch (err: any) {
      console.error('❌ Error sending message:', err);
      const errorMsg = err.message || 'Failed to send message';
      
      // Show user-friendly error messages
      if (errorMsg.includes('not checked in')) {
        Alert.alert('Error', 'You or the other person is not checked in at a location.');
      } else if (errorMsg.includes('different location')) {
        Alert.alert('Error', 'You must both be at the same location to chat.');
      } else if (errorMsg.includes('checked out')) {
        Alert.alert('Error', 'One of you has checked out.');
      } else if (errorMsg.includes('endpoint may not exist') || errorMsg.includes('404')) {
        Alert.alert('Backend Error', 'Chat service is not available. Trying to restart backend...');
      } else if (errorMsg.includes('HTML response')) {
        Alert.alert('Server Error', 'Server returned error page. Backend may not be deployed.');
      } else {
        Alert.alert('Error', errorMsg);
      }
      
      setInputMessage(messageText); // Restore input
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: any) => {
    try {
      // Handle Firebase Timestamp objects
      let timeValue = timestamp;
      if (timestamp?.toMillis) {
        timeValue = timestamp.toMillis();
      } else if (timestamp?._seconds) {
        timeValue = timestamp._seconds * 1000;
      }
      const date = new Date(timeValue);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{name}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignSystem.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{name}</Text>
          <Text style={styles.emptyText}>{checkedInPlace}</Text>
        </View>

        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            renderItem={({ item }) => {
              const isSender = item.senderId === currentUserId;
              return (
                <View
                  style={[
                    styles.messageItem,
                    isSender ? styles.myMessage : styles.otherMessage,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isSender ? styles.myBubble : styles.otherBubble,
                    ]}
                  >
                    <Text style={styles.messageText}>{item.message}</Text>
                    <Text style={styles.messageTime}>
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>
                </View>
              );
            }}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#B5ACC2"
            value={inputMessage}
            onChangeText={setInputMessage}
            editable={!isSending}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: isSending ? 0.5 : 1 },
            ]}
            onPress={handleSendMessage}
            disabled={isSending || !inputMessage.trim()}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={DesignSystem.colors.white} />
            ) : (
              <Text style={styles.sendButtonText}>✓</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default LocationChatMessages;
