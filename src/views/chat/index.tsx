import { Alert, FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from '../../components/Toolbar';
import BottomBar from '../../components/BottomBar';
import ChatListItem from './ChatListItem';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getFriendAcceptRequest, getProfileIdRequest, resetProfileIdExecuted } from '../../slices/profile';
import Loader from '../../components/Loader';

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
    name: string;
    profilePicture: string;
    msg: string;
    time: string;
    unread: string | number;
  };

  const [listData, setListData] = useState<ChatItem[]>([]);

  const Req_Acceptprofile: any = useSelector((state: RootState) => state.profile.friendAccept);
  const Req_Acceptprofile_Loading: any = useSelector((state: RootState) => state.profile.friendAccept_isLoading);
  const Req_AcceptExecuted = useSelector((state: RootState) => state.profile.friendAcceptexecuted);
  const Req_FriendError = useSelector((state: RootState) => state.profile.friendAccept_error);

  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);


  const onPressItem = (item: any) => navigation.navigate('ChatMessages', { item })

  useEffect(() => {
    dispatch(getFriendAcceptRequest(getprofile.profile.profileId));
  }, [])


  useEffect(() => {
    if (Req_AcceptExecuted) {
      setListData(Req_Acceptprofile.profiles);
    } else if (Req_FriendError != null) {
      setListData([]);
      return;
    }
    return () => {
      setListData([]);
      //dispatch(resetProfileLocationExecuted());
    };
  }, [Req_FriendError, Req_Acceptprofile]);

  return (

    <ScreenWrapper>
      <GestureHandlerRootView>
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
                onPressDelete={() => console.log('delete')}
                time={item.time}
                lastMessage={item.msg}
              />
            )}
            keyExtractor={item => item.imageUrl}
          />

          <Loader visible={Req_Acceptprofile_Loading} message="Refreshing..." spinnerColor="#F58C00" />

          <BottomBar />
        </View>
      </GestureHandlerRootView>
    </ScreenWrapper>
  );
};

export default ChatScreen;
