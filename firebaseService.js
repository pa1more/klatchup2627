// import database from '@react-native-firebase/database';

// const FirebaseService = {

//   sendMessage: async (roomId, message, senderId) => {

//     const messageRef = database().ref(`/chatrooms/${roomId}/messages`).push();

//     const newMessage = {
//       text: message,
//       sender: senderId,
//       timestamp: database.ServerValue.TIMESTAMP,
//     };

//     await messageRef.set(newMessage);
//     console.log('Message sent:', newMessage);
//   },

//   listenForMessages: (roomId, callback) => {

//     const messagesRef = database().ref(`/chatrooms/${roomId}/messages`);
//     // Listen for new messages
//     messagesRef.on('child_added', (snapshot) => {
//       const message = snapshot.val();
//       callback(message); // Pass the message to your callback
//     });

//     // Clean up listener when done
//     return () => messagesRef.off('child_added');
//   },
// };
// export default FirebaseService;

import { getApp } from '@react-native-firebase/app';
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  off,
  serverTimestamp,
} from '@react-native-firebase/database';

const FirebaseService = {

  sendMessage: async (roomId, message, senderId) => {
    const db = getDatabase(getApp());
    const messagesRef = ref(db, `/chatrooms/${roomId}/messages`);
    const newMessageRef = push(messagesRef);

    const newMessage = {
      text: message,
      sender: senderId,
      timestamp: serverTimestamp(),
    };

    await set(newMessageRef, newMessage);
    console.log('Message sent:', newMessage);
  },

  listenForMessages: (roomId, callback) => {
    const db = getDatabase(getApp());
    const messagesRef = ref(db, `/chatrooms/${roomId}/messages`);

    // Define the exact listener so we can detach it later
    const listener = (snapshot) => {
      const message = snapshot.val();
      callback(message);
    };

    onChildAdded(messagesRef, listener);

    return () => {
      try {
        off(messagesRef, 'child_added', listener); // Clean up that exact listener
        console.log(`Unsubscribed from messages in room: ${roomId}`);
      } catch (error) {
        console.warn('Failed to unsubscribe from Firebase listener:', error);
      }
    };
  },



};

export default FirebaseService;

