import { Alert, FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from '../../components/Toolbar';
import BottomBar from '../../components/BottomBar';
import ChatListItem from './ChatListItem';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getFriendAcceptRequest } from '../../slices/profile';
import Loader from '../../components/Loader';
import { getOnlineUsersAPI } from '../../services/checkinService';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: '100%',
  },
  containerMain: {
    flex: 1,
  },
  list: {
    paddingBottom: 50,
  },
});

const ChatScreen = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  type ChatItem = {
    profileId?: string;
    userId?: string;
    name: string;
    profilePicture: string;
    msg: string;
    time: string;
    unread: string | number;
    currentLocation?: {
      placeName?: string;
    };
  };

  const [listData, setListData] = useState<ChatItem[]>([]);

  const Req_Acceptprofile: any = useSelector((state: RootState) => state.profile.friendAccept);
  const Req_Acceptprofile_Loading: any = useSelector((state: RootState) => state.profile.friendAccept_isLoading);
  const Req_AcceptExecuted = useSelector((state: RootState) => state.profile.friendAcceptexecuted);
  const Req_FriendError = useSelector((state: RootState) => state.profile.friendAccept_error);

  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);
  const profileToken = useSelector((state: RootState) => state.profile.token);
  const sampleToken = useSelector((state: RootState) => state.sample.token);
  const token = profileToken || sampleToken;


  const onPressItem = (item: ChatItem) => (navigation as any).navigate('ChatMessages', { item })

  useEffect(() => {
    const profileId = getprofile?.profile?.profileId;
    if (profileId) {
      dispatch(getFriendAcceptRequest(profileId));
    }
  }, [dispatch, getprofile?.profile?.profileId])


  useEffect(() => {
    const applyOnlineFilter = async () => {
      if (Req_AcceptExecuted) {
      const profiles = Array.isArray(Req_Acceptprofile?.profiles)
        ? Req_Acceptprofile.profiles
        : Array.isArray(Req_Acceptprofile)
        ? Req_Acceptprofile
        : [];

      const mappedData: ChatItem[] = profiles.map((profile: any) => ({
        profileId: profile?.profileId,
        userId: profile?.userId || profile?.profileId,
        name: profile?.name || 'Unknown User',
        profilePicture: profile?.profilePicture || 'https://randomuser.me/api/portraits/men/1.jpg',
        msg: profile?.msg || profile?.lastMessage || 'Start chatting',
        time: profile?.time || '',
        unread: profile?.unread || 0,
        currentLocation: profile?.currentLocation,
      }));

        const placeName = getprofile?.profile?.currentLocation?.placeName;
        if (token && placeName) {
          try {
            const onlineResponse = await getOnlineUsersAPI(token, placeName);
            const onlineUsers = Array.isArray(onlineResponse?.onlineUsers) ? onlineResponse.onlineUsers : [];
            const onlineIds = new Set(onlineUsers.map((user: any) => user?.profileId).filter(Boolean));
            const filtered = mappedData.filter((item) => onlineIds.has(item.profileId || item.userId));
            setListData(filtered);
            return;
          } catch {
            setListData(mappedData);
            return;
          }
        }

        setListData(mappedData);
      } else if (Req_FriendError != null) {
        setListData([]);
      }
    };

    applyOnlineFilter();
  }, [Req_AcceptExecuted, Req_FriendError, Req_Acceptprofile, token, getprofile?.profile?.currentLocation?.placeName]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Toolbar title="Chat" />
        <FlatList
          data={listData}
          style={styles.containerMain}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ChatListItem
              imageUrl={item.profilePicture}
              name={item.name}
              unreadCount={0}
              onPress={() => onPressItem(item)}
              time={item.time}
              lastMessage={item.msg}
            />
          )}
          keyExtractor={(chatItem, index) => chatItem.profileId || chatItem.userId || chatItem.name || String(index)}
        />

        <Loader visible={Req_Acceptprofile_Loading} message="Refreshing..." spinnerColor="#F58C00" />

        <BottomBar />
      </View>
    </ScreenWrapper>
  );
};

export default ChatScreen;
