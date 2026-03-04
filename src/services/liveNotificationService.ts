import { Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchFriendRequestAPI } from './api';
import { getChatConversationsAPI } from './chatService';

export type LiveNotificationType = 'friend-request' | 'message' | 'klatchup' | 'system';

export interface LiveNotification {
  id: string;
  type: LiveNotificationType;
  title: string;
  message: string;
  timestamp: number;
  profileImage?: string;
  read: boolean;
}

const STORAGE_KEY = '@klatchup_live_notifications';

type StartParams = {
  token: string;
  profileId: string;
  checkedInPlace?: string;
};

class LiveNotificationService {
  private timer: ReturnType<typeof setInterval> | null = null;
  private initialized = false;
  private isPolling = false;
  private previousFriendIds = new Set<string>();
  private previousConversationState: Record<string, string> = {};
  private lastAlertAt: Record<string, number> = {};
  private conversationPollingDisabled = false;
  private listeners = new Set<(items: LiveNotification[]) => void>();
  private params: StartParams | null = null;

  subscribe(listener: (items: LiveNotification[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async emit() {
    const items = await this.getNotifications();
    this.listeners.forEach(listener => listener(items));
  }

  async getNotifications(): Promise<LiveNotification[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private async saveNotifications(items: LiveNotification[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    await this.emit();
  }

  private async addNotification(item: LiveNotification) {
    const current = await this.getNotifications();
    const exists = current.some(existing => existing.id === item.id);
    if (exists) return;

    const updated = [item, ...current].slice(0, 100);
    await this.saveNotifications(updated);
  }

  async markAsRead(id: string) {
    const current = await this.getNotifications();
    const updated = current.map(item => (item.id === id ? { ...item, read: true } : item));
    await this.saveNotifications(updated);
  }

  async markAllAsRead() {
    const current = await this.getNotifications();
    const updated = current.map(item => ({ ...item, read: true }));
    await this.saveNotifications(updated);
  }

  async removeNotification(id: string) {
    const current = await this.getNotifications();
    const updated = current.filter(item => item.id !== id);
    await this.saveNotifications(updated);
  }

  async clearAll() {
    await this.saveNotifications([]);
  }

  start(params: StartParams) {
    this.params = params;
    this.stop();
    this.initialized = false;
    this.previousFriendIds = new Set<string>();
    this.previousConversationState = {};
    this.conversationPollingDisabled = false;

    this.poll().catch(() => null);
    this.timer = setInterval(() => {
      this.poll().catch(error => {
        console.warn('Live notification poll failed:', error?.message || error);
      });
    }, 6000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private normalizeTimestamp(value: any): number {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (typeof value?.toMillis === 'function') return value.toMillis();
    if (typeof value?._seconds === 'number') return value._seconds * 1000;
    if (typeof value?.seconds === 'number') return value.seconds * 1000;
    return 0;
  }

  private maybeShowAlert(alertKey: string, title: string, message: string) {
    const now = Date.now();
    const lastShown = this.lastAlertAt[alertKey] || 0;
    if (now - lastShown < 15000) {
      return;
    }
    if (AppState.currentState !== 'active') {
      return;
    }
    this.lastAlertAt[alertKey] = now;
    Alert.alert(title, message);
  }

  private async poll() {
    if (this.isPolling) {
      return;
    }
    if (!this.params?.token || !this.params?.profileId) return;

    this.isPolling = true;

    const { token, profileId, checkedInPlace } = this.params;
    try {
      const friendResponse = await fetchFriendRequestAPI(profileId, token);
      const friendProfiles = Array.isArray(friendResponse?.profiles) ? friendResponse.profiles : [];
      const currentFriendIds = new Set(friendProfiles.map((profile: any) => profile?.profileId).filter(Boolean));

      if (this.initialized) {
        friendProfiles.forEach((profile: any) => {
          const requestId = profile?.profileId;
          if (!requestId || this.previousFriendIds.has(requestId)) return;

          const notification: LiveNotification = {
            id: `friend-request-${requestId}`,
            type: 'friend-request',
            title: `${profile?.name || 'Someone'} sent you a request`,
            message: 'Open Klatchup requests to respond',
            timestamp: Date.now(),
            profileImage: profile?.profilePicture,
            read: false,
          };

          this.addNotification(notification).catch(() => null);
          this.maybeShowAlert(
            `friend-request-${requestId}`,
            'New Klatchup Request',
            `${profile?.name || 'Someone'} sent you a request`
          );
        });
      }

      this.previousFriendIds = currentFriendIds;

      if (checkedInPlace && !this.conversationPollingDisabled) {
        const conversationResponse = await getChatConversationsAPI(token, { checkedInPlace });

        if (conversationResponse?.indexRequired) {
          this.conversationPollingDisabled = true;
          console.warn('⚠️ Disabled conversation polling until Firestore index is created');
          return;
        }

        const conversations = Array.isArray(conversationResponse?.conversations)
          ? conversationResponse.conversations
          : [];

        conversations.forEach((conversation: any) => {
          const conversationId = conversation?.conversationId;
          if (!conversationId) return;

          const lastMessageTime = this.normalizeTimestamp(conversation?.lastMessageTime);
          const signature = `${conversation?.lastMessage || ''}_${lastMessageTime}`;
          const previousSignature = this.previousConversationState[conversationId];

          if (
            this.initialized &&
            previousSignature &&
            signature !== previousSignature &&
            !conversation?.isRead &&
            conversation?.lastMessage &&
            conversation?.lastMessage !== 'No messages yet'
          ) {
            const senderName = conversation?.name || 'New message';
            const notification: LiveNotification = {
              id: `message-${conversationId}-${lastMessageTime || Date.now()}`,
              type: 'message',
              title: `New message from ${senderName}`,
              message: conversation?.lastMessage,
              timestamp: Date.now(),
              profileImage: conversation?.profilePicture,
              read: false,
            };

            this.addNotification(notification).catch(() => null);
            this.maybeShowAlert(
              `message-${conversationId}`,
              'New Message',
              `${senderName}: ${conversation?.lastMessage}`
            );
          }

          this.previousConversationState[conversationId] = signature;
        });
      }

      this.initialized = true;
    } finally {
      this.isPolling = false;
    }
  }
}

export const liveNotificationService = new LiveNotificationService();
