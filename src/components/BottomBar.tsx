import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import DropShadow from 'react-native-drop-shadow'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { RootState } from '../store';
import { liveNotificationService } from '../services/liveNotificationService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const iconSize = Math.max(24, Math.min(32, Math.round(width * 0.08)));
const profileSize = Math.max(56, Math.min(70, Math.round(width * 0.18)));
const itemHeight = Math.max(64, Math.min(76, Math.round(width * 0.2)));

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  containerMain: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(48, 9, 67, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  containerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    height: itemHeight,
    borderRadius: 20,
  },
  icon: {
    height: iconSize,
    width: iconSize,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#300943',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  containerProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: profileSize / 2,
    marginBottom: profileSize * 0.15,
  },
  iconProfile: {
    height: profileSize,
    width: profileSize,
    borderRadius: profileSize / 2,
    borderWidth: 3,
    borderColor: '#300943',
  },
})

const BottomBarIcon = ({
  icon,
  onPress,
  badgeCount = 0,
}: {
  icon: ImageSourcePropType
  onPress: () => void
  badgeCount?: number
}) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={styles.containerIcon}
    onPress={onPress}>
    <Image style={styles.icon} source={icon} />
    {badgeCount > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const IconProfile = ({ url, onPress }: { url: string; onPress: () => void }) => (
  <DropShadow style={styles.shadow}>
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.containerProfile}
      onPress={onPress}>
      <Image style={styles.iconProfile} source={{ uri: url }} />
    </TouchableOpacity>
  </DropShadow>
);

const BottomBar = () => {

  const route = useRoute();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation()
  const [currentScreen, setCurrentScreen] = useState(route.name)
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [requestUnreadCount, setRequestUnreadCount] = useState(0);

  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);
  console.log('Profile from BottomBar:', getprofile?.profile)
  
  useEffect(() => {
    setCurrentScreen(route.name);
  }, [route.name]);

  useEffect(() => {
    const updateCounts = async () => {
      const notifications = await liveNotificationService.getNotifications();
      const unread = notifications.filter(item => !item.read);

      setChatUnreadCount(unread.filter(item => item.type === 'message').length);
      setRequestUnreadCount(
        unread.filter(item => item.type === 'friend-request' || item.type === 'klatchup').length
      );
    };

    updateCounts().catch(() => null);
    const unsubscribe = liveNotificationService.subscribe((notifications) => {
      const unread = notifications.filter(item => !item.read);
      setChatUnreadCount(unread.filter(item => item.type === 'message').length);
      setRequestUnreadCount(
        unread.filter(item => item.type === 'friend-request' || item.type === 'klatchup').length
      );
    });

    return () => unsubscribe();
  }, []);

  const onPressMyProfile = () => {
    (navigation as any).navigate('MyProfile');
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.containerMain}>
        <BottomBarIcon
          icon={
            currentScreen === 'KlatchupRequests'
              ? require('../assets/icons/ic_users_focused.png')
              : require('../assets/icons/ic_users.png')
          }
          badgeCount={requestUnreadCount}
          onPress={() => (navigation as any).navigate('KlatchupRequests')}
        />
        {getprofile?.profile?.profilePicture ? (
          <IconProfile
            url={getprofile.profile.profilePicture}
            onPress={onPressMyProfile}
          />
        ) : (
          <IconProfile
            url="https://randomuser.me/api/portraits/women/24.jpg"
            onPress={onPressMyProfile}
          />
        )}
        <BottomBarIcon
          icon={
            currentScreen === 'Chat'
              ? require('../assets/icons/ic_chat_focused.png')
              : require('../assets/icons/ic_chat.png')
          }
          badgeCount={chatUnreadCount}
          onPress={() => navigation.navigate('Chat')}
        />
      </View>
    </View>
  )
}

export default BottomBar
