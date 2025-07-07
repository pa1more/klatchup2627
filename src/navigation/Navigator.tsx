import React from 'react'
import { Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from '../views/splash'
import Login from '../views/onbording/login'
import Intro from '../views/onbording/intro'
import EnterMobileNo from '../views/onbording/enterMobileNo'
import VerifyOtp from '../views/onbording/verifyOtp'
import CreateProfile from '../views/createProfile'
import Home from '../views/home'
import FindingSociety from '../views/findingSociety'
import SocietyUsers from '../views/societyUsers'
import KlatchupRequests from '../views/klatchupRequests'
import MyProfile from '../views/myprofile'
import Settings from '../views/settings'
import PrivacyPolicy from '../views/settings/PrivacyPolicy'
import Terms from '../views/settings/Terms'
import HelpSupport from '../views/settings/HelpSupport'
import GiveFeedback from '../views/settings/GiveFeedback'
import UserProfile from '../views/userprofile'
import Chat from '../views/chat'
import ChatMessages from '../views/chat/ChatMessages'
import theme from '../theme/NavigationTheme'

function Navigator() {

  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          animationTypeForReplace: 'push',
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="Intro"
          component={Intro}
        />
        <Stack.Screen name="EnterMobileNo" component={EnterMobileNo} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{
            animation: 'flip',
            animationDuration: 500,
          }}
          name="FindingSociety"
          component={FindingSociety}
        />

        <Stack.Screen
          name="SocietyUsers"
          component={SocietyUsers}
        />

        <Stack.Screen
          options={{
            animation: 'fade',
            animationDuration: 200,
          }}
          name="KlatchupRequests"
          component={KlatchupRequests}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
            animationDuration: 200,
          }}
          name="Chat"
          component={Chat}
        />
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} />
        <Stack.Screen name="GiveFeedback" component={GiveFeedback} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="ChatMessages" component={ChatMessages} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator;
