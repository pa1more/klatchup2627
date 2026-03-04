import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from '../../components/Toolbar';
import { DesignSystem } from '../../theme/DesignSystem';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getChatConversationsAPI } from '../../services/chatService';
import UsersListItem from '../societyUsers/UsersListItem';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  textTitle: {
    color: DesignSystem.colors.white,
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: DesignSystem.colors.white,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationItem: {
    backgroundColor: '#300943',
    borderRadius: 15,
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationName: {
    color: DesignSystem.colors.white,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  conversationMessage: {
    color: '#B5ACC2',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
  },
  chatButton: {
    backgroundColor: DesignSystem.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  chatButtonText: {
    color: DesignSystem.colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
});

interface Conversation {
  userId: string;
  name: string;
  profilePicture: string;
  lastMessage?: string;
  timestamp?: number;
}

const LocationChat = ({ route }: any) => {
  const { checkedInPlace, latitude, longitude } = route.params;
  const navigation = useNavigation();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.sample.token);
  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);

  useEffect(() => {
    loadConversations();
  }, [checkedInPlace, token]);

  const loadConversations = async () => {
    if (!token) {
      setError('Authentication token not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📱 [LocationChat] Loading conversations');
      console.log('📱 Checked-in place:', checkedInPlace);
      console.log('📱 Token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const response = await getChatConversationsAPI(token, {
        checkedInPlace,
      });

      console.log('📱 Conversations response:', JSON.stringify(response, null, 2));

      if (response && response.conversations) {
        setConversations(response.conversations);
      } else {
        setConversations([]);
      }
    } catch (err: any) {
      console.error('Error loading conversations:', err);
      const message = err?.message || 'Failed to load conversations';

      if (message.includes('FAILED_PRECONDITION') && message.includes('requires an index')) {
        setError('Conversation list is temporarily unavailable. You can still chat from the main Chat tab.');
      } else {
        setError(message);
        Alert.alert('Error', message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatPress = (conversation: Conversation) => {
    // Navigate to chat messages with the selected user
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💬 [LocationChat] Navigating to messages');
      console.log('💬 userId:', conversation.userId);
      console.log('💬 name:', conversation.name);
      console.log('💬 checkedInPlace:', checkedInPlace);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      (navigation as any).navigate('LocationChatMessages', {
        userId: conversation.userId,
        name: conversation.name,
        profilePicture: conversation.profilePicture,
        checkedInPlace,
      });
    } catch (e) {
      console.error('❌ Navigation error:', e);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Toolbar title={`Chat at ${checkedInPlace}`} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignSystem.colors.primary} />
          <Text style={[styles.emptyText, { marginTop: 10 }]}>Loading conversations...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Toolbar title={`Chat at ${checkedInPlace}`} />
      <View style={styles.container}>
        <Text style={styles.textTitle}>💬 People at this location</Text>

        {conversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {error ? error : 'No one else is checked in at this location yet.'}
            </Text>
            <TouchableOpacity
              style={[styles.chatButton, { marginTop: 20 }]}
              onPress={loadConversations}
            >
              <Text style={styles.chatButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.userId}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.conversationItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.conversationName}>{item.name}</Text>
                  {item.lastMessage && (
                    <Text style={styles.conversationMessage} numberOfLines={1}>
                      {item.lastMessage}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => handleChatPress(item)}
                >
                  <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default LocationChat;
