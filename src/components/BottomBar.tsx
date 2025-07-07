import React, { useEffect, useState } from 'react'
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import DropShadow from 'react-native-drop-shadow'
import BottomBarSvg from '../assets/svg/BottomBarSvg'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../store';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerMain: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 10,
  },
  shadow: {
    shadowColor: '#F8E9FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  containerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
    height: 72,
    borderRadius: 30,
    marginTop: 10,
  },
  icon: {
    height: 30,
    width: 30,
  },
  containerProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    bottom: 30,
  },
  iconProfile: {
    height: 65,
    width: 65,
    borderRadius: 40,
  },
})

const BottomBarIcon = ({
  icon,
  onPress,
}: {
  icon: ImageSourcePropType
  onPress: () => void
}) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={styles.containerIcon}
    onPress={onPress}>
    <Image style={styles.icon} source={icon} />
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
  const navigation = useNavigation()
  const [currentScreen, setCurrentScreen] = useState(route.name)

  const getprofile: any = useSelector((state: RootState) => state.profile.mobileCheck);
  console.log(getprofile.profile)
  
  useEffect(() => {
    setCurrentScreen(route.name);
  }, [route.name]);

  const onPressMyProfile = () => {
    navigation.navigate('MyProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerMain}>
        <BottomBarIcon
          icon={
            currentScreen === 'KlatchupRequests'
              ? require('../assets/icons/ic_users_focused.png')
              : require('../assets/icons/ic_users.png')
          }
          onPress={() => navigation.navigate('KlatchupRequests')}
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
          onPress={() => navigation.navigate('Chat')}
        />
      </View>

      <BottomBarSvg />
    </View>
  )
}

export default BottomBar
