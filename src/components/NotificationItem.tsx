import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { DesignSystem } from '../theme/DesignSystem';

interface NotificationItemProps {
  type: 'friend-request' | 'message' | 'klatchup' | 'system';
  title: string;
  message: string;
  timestamp: string;
  icon?: string;
  profileImage?: string;
  read: boolean;
  onPress?: () => void;
  onDismiss?: () => void;
}

const styles = StyleSheet.create({
  container: {
    ...DesignSystem.components.requestListItem.container,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: DesignSystem.spacing.sm,
    marginHorizontal: DesignSystem.spacing.lg,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DesignSystem.colors.success,
    marginRight: DesignSystem.spacing.md,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.gray[700],
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  title: {
    ...(DesignSystem.typography.styles.bodyBold as any),
    color: DesignSystem.colors.white,
    flex: 1,
  },
  timestamp: {
    ...(DesignSystem.typography.styles.caption as any),
    color: DesignSystem.colors.gray[600],
    marginLeft: DesignSystem.spacing.md,
  },
  message: {
    ...(DesignSystem.typography.styles.bodySmall as any),
    color: DesignSystem.colors.gray[600],
    marginBottom: DesignSystem.spacing.xs,
  },
  typeLabel: {
    ...(DesignSystem.typography.styles.caption as any),
    color: DesignSystem.colors.success,
    fontWeight: '600' as any,
  },
  deleteButton: {
    padding: DesignSystem.spacing.md,
    marginLeft: DesignSystem.spacing.md,
  },
  deleteText: {
    color: DesignSystem.colors.danger,
    fontSize: 20,
  },
});

const getIconForType = (type: string): string => {
  switch (type) {
    case 'friend-request':
      return '👤';
    case 'message':
      return '💬';
    case 'klatchup':
      return '🎯';
    case 'system':
      return 'ℹ️';
    default:
      return '🔔';
  }
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'friend-request':
      return 'Friend Request';
    case 'message':
      return 'Message';
    case 'klatchup':
      return 'Klatchup';
    case 'system':
      return 'System';
    default:
      return 'Notification';
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  message,
  timestamp,
  icon,
  profileImage,
  read,
  onPress,
  onDismiss,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { opacity: read ? 0.7 : 1 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {!read && <View style={styles.unreadIndicator} />}

      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      ) : (
        <View style={[styles.profileImage, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 24 }}>{icon || getIconForType(type)}</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onDismiss} style={styles.deleteButton}>
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.message} numberOfLines={1}>
          {message}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.typeLabel}>{getTypeLabel(type)}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;
