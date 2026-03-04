import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from '../../components/Toolbar';
import BottomBar from '../../components/BottomBar';
import NotificationItem from '../../components/NotificationItem';
import EmptyState from '../../components/EmptyState';
import { DesignSystem } from '../../theme/DesignSystem';
import {
  LiveNotification,
  liveNotificationService,
} from '../../services/liveNotificationService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.primary,
  },
  header: {
    padding: DesignSystem.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearAllButton: {
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.lg,
  },
  clearAllText: {
    ...DesignSystem.typography.styles.button,
    color: DesignSystem.colors.success,
  },
  list: {
    paddingVertical: DesignSystem.spacing.sm,
    paddingBottom: 80,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.md,
  },
  filterButton: {
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.borderRadius.xl,
    marginRight: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.gray[800],
  },
  filterButtonActive: {
    backgroundColor: DesignSystem.colors.success,
  },
  filterButtonText: {
    ...(DesignSystem.typography.styles.caption as any),
    color: DesignSystem.colors.white,
  },
});

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);

  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    liveNotificationService.getNotifications().then((items) => {
      if (mounted) {
        setNotifications(items);
      }
    });

    const unsubscribe = liveNotificationService.subscribe((items) => {
      setNotifications(items);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const formatRelativeTime = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day ago`;
  };

  const filteredNotifications = filter
    ? notifications.filter((n) => n.type === filter)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationPress = async (id: string) => {
    await liveNotificationService.markAsRead(id);
  };

  const handleDismiss = async (id: string) => {
    await liveNotificationService.removeNotification(id);
  };

  const handleClearAll = async () => {
    await liveNotificationService.clearAll();
  };

  const handleMarkAllAsRead = async () => {
    await liveNotificationService.markAllAsRead();
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Toolbar title="Notifications" />

        {notifications.length > 0 && (
          <>
            <View style={styles.header}>
              <View>
                <Text style={[
                  DesignSystem.typography.styles.heading4,
                  { color: DesignSystem.colors.white }
                ]}>
                  {unreadCount > 0 ? `${unreadCount} New` : 'All read'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: DesignSystem.spacing.md }}>
                {unreadCount > 0 && (
                  <TouchableOpacity
                    style={styles.clearAllButton}
                    onPress={handleMarkAllAsRead}
                  >
                    <Text style={styles.clearAllText}>Mark all read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.clearAllButton}
                  onPress={handleClearAll}
                >
                  <Text style={[styles.clearAllText, { color: DesignSystem.colors.danger }]}>
                    Clear all
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.filterButton, !filter && styles.filterButtonActive]}
                onPress={() => setFilter(null)}
              >
                <Text style={styles.filterButtonText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'friend-request' && styles.filterButtonActive]}
                onPress={() => setFilter('friend-request')}
              >
                <Text style={styles.filterButtonText}>Requests</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'message' && styles.filterButtonActive]}
                onPress={() => setFilter('message')}
              >
                <Text style={styles.filterButtonText}>Messages</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'klatchup' && styles.filterButtonActive]}
                onPress={() => setFilter('klatchup')}
              >
                <Text style={styles.filterButtonText}>Klatchup</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <FlatList
          data={filteredNotifications}
          ListEmptyComponent={() => (
            <EmptyState
              icon="🔔"
              title="No Notifications"
              subtitle={
                filter
                  ? `You don't have any ${filter.replace('-', ' ')} notifications`
                  : "You're all caught up! No new notifications"
              }
            />
          )}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <NotificationItem
              {...item}
              timestamp={formatRelativeTime(item.timestamp)}
              onPress={() => handleNotificationPress(item.id)}
              onDismiss={() => handleDismiss(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
        />

        <BottomBar />
      </View>
    </ScreenWrapper>
  );
};

export default NotificationsScreen;
