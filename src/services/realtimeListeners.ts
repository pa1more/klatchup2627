export const realtimeListenersService = {
  startFriendRequestListener: () => {},
  detectNewFriendRequest: async () => ({ isNew: false as const }),
  startAcceptedFriendsListener: () => {},
  startMessageListener: () => {},
  sendLocalNotification: () => {},
  stopListener: () => {},
  stopAllListeners: () => {},
};
