"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../../firebase");
const auth_1 = require("../../middleware/auth");
const admin = __importStar(require("firebase-admin"));
const router = (0, express_1.Router)();
// POST /chat/rooms - Create or get existing chatroom
router.post('/rooms', auth_1.verifyAuth, async (req, res) => {
    try {
        const { participantIds } = req.body;
        const currentUserId = req.user?.uid;
        if (!participantIds || !Array.isArray(participantIds)) {
            return res.status(400).json({
                message: 'participantIds array is required',
                type: 'VALIDATION_ERROR',
            });
        }
        // Ensure current user is in participants
        const allParticipants = Array.from(new Set([currentUserId, ...participantIds])).sort();
        // Create a deterministic room ID based on participants
        const roomId = allParticipants.join('_');
        const roomRef = firebase_1.db.collection('chatrooms').doc(roomId);
        const roomSnapshot = await roomRef.get();
        if (roomSnapshot.exists) {
            return res.status(200).json({
                chatroom: { id: roomId, ...roomSnapshot.data() },
            });
        }
        // Create new chatroom
        const newChatroom = {
            participants: allParticipants,
            createdAt: admin.firestore.Timestamp.now(),
        };
        await roomRef.set(newChatroom);
        res.status(201).json({
            chatroom: { id: roomId, ...newChatroom },
        });
    }
    catch (error) {
        console.error('Error creating chatroom:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// GET /chat/rooms - List chatrooms for user
router.get('/rooms', auth_1.verifyAuth, async (req, res) => {
    try {
        const currentUserId = req.user?.uid;
        const snapshot = await firebase_1.db
            .collection('chatrooms')
            .where('participants', 'array-contains', currentUserId)
            .orderBy('lastMessageTime', 'desc')
            .limit(50)
            .get();
        const chatrooms = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json({ chatrooms });
    }
    catch (error) {
        console.error('Error fetching chatrooms:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// POST /chat/messages/:roomId - Send message
router.post('/messages/:roomId', auth_1.verifyAuth, async (req, res) => {
    try {
        const { roomId } = req.params;
        const { text, senderName, senderAvatar } = req.body;
        const currentUserId = req.user?.uid;
        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                message: 'Message text is required',
                type: 'VALIDATION_ERROR',
            });
        }
        // Verify user is participant in chatroom
        const roomRef = firebase_1.db.collection('chatrooms').doc(roomId);
        const roomSnapshot = await roomRef.get();
        if (!roomSnapshot.exists) {
            return res.status(404).json({
                message: 'Chatroom not found',
                type: 'CHATROOM_NOT_FOUND',
            });
        }
        const roomData = roomSnapshot.data();
        if (!roomData.participants.includes(currentUserId)) {
            return res.status(403).json({
                message: 'Not authorized to access this chatroom',
                type: 'UNAUTHORIZED',
            });
        }
        // Add message to Firestore
        const messageData = {
            text: text.trim(),
            sender: currentUserId,
            timestamp: admin.firestore.Timestamp.now(),
            senderName: senderName || 'Unknown',
            senderAvatar: senderAvatar || '',
            readBy: [currentUserId],
        };
        const messageRef = await roomRef.collection('messages').add(messageData);
        // Update chatroom's last message
        await roomRef.update({
            lastMessage: text.substring(0, 100),
            lastMessageTime: admin.firestore.Timestamp.now(),
        });
        res.status(201).json({
            message: { id: messageRef.id, ...messageData },
        });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// GET /chat/messages/:roomId - Get messages in chatroom
router.get('/messages/:roomId', auth_1.verifyAuth, async (req, res) => {
    try {
        const { roomId } = req.params;
        const { limit = '50', before } = req.query;
        const currentUserId = req.user?.uid;
        // Verify user is participant
        const roomRef = firebase_1.db.collection('chatrooms').doc(roomId);
        const roomSnapshot = await roomRef.get();
        if (!roomSnapshot.exists) {
            return res.status(404).json({
                message: 'Chatroom not found',
                type: 'CHATROOM_NOT_FOUND',
            });
        }
        const roomData = roomSnapshot.data();
        if (!roomData.participants.includes(currentUserId)) {
            return res.status(403).json({
                message: 'Not authorized',
                type: 'UNAUTHORIZED',
            });
        }
        let query = roomRef.collection('messages').orderBy('timestamp', 'desc').limit(parseInt(limit) || 50);
        if (before) {
            const beforeTimestamp = parseInt(before);
            query = query.where('timestamp', '<', beforeTimestamp);
        }
        const snapshot = await query.get();
        const messages = snapshot.docs
            .map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
            .reverse(); // Reverse to get chronological order
        res.status(200).json({ messages });
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// POST /chat/messages/:roomId/:messageId/read - Mark message as read
router.post('/messages/:roomId/:messageId/read', auth_1.verifyAuth, async (req, res) => {
    try {
        const { roomId, messageId } = req.params;
        const currentUserId = req.user?.uid;
        const messageRef = firebase_1.db.collection('chatrooms').doc(roomId).collection('messages').doc(messageId);
        const messageSnapshot = await messageRef.get();
        if (!messageSnapshot.exists) {
            return res.status(404).json({
                message: 'Message not found',
                type: 'MESSAGE_NOT_FOUND',
            });
        }
        const messageData = messageSnapshot.data();
        const readBy = messageData.readBy || [];
        if (!readBy.includes(currentUserId)) {
            readBy.push(currentUserId);
            await messageRef.update({ readBy });
        }
        res.status(200).json({ message: 'Message marked as read' });
    }
    catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// DELETE /chat/messages/:roomId/:messageId - Delete message
router.delete('/messages/:roomId/:messageId', auth_1.verifyAuth, async (req, res) => {
    try {
        const { roomId, messageId } = req.params;
        const currentUserId = req.user?.uid;
        const messageRef = firebase_1.db.collection('chatrooms').doc(roomId).collection('messages').doc(messageId);
        const messageSnapshot = await messageRef.get();
        if (!messageSnapshot.exists) {
            return res.status(404).json({
                message: 'Message not found',
                type: 'MESSAGE_NOT_FOUND',
            });
        }
        const messageData = messageSnapshot.data();
        if (messageData.sender !== currentUserId) {
            return res.status(403).json({
                message: 'Can only delete your own messages',
                type: 'UNAUTHORIZED',
            });
        }
        await messageRef.delete();
        res.status(200).json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// DELETE /chat/rooms/:roomId - Delete chatroom
router.delete('/rooms/:roomId', auth_1.verifyAuth, async (req, res) => {
    try {
        const { roomId } = req.params;
        const currentUserId = req.user?.uid;
        const roomRef = firebase_1.db.collection('chatrooms').doc(roomId);
        const roomSnapshot = await roomRef.get();
        if (!roomSnapshot.exists) {
            return res.status(404).json({
                message: 'Chatroom not found',
                type: 'CHATROOM_NOT_FOUND',
            });
        }
        const roomData = roomSnapshot.data();
        if (!roomData.participants.includes(currentUserId)) {
            return res.status(403).json({
                message: 'Not authorized',
                type: 'UNAUTHORIZED',
            });
        }
        await roomRef.delete();
        res.status(200).json({ message: 'Chatroom deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting chatroom:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// ===== NEW LOCATION-BASED CHAT ENDPOINTS =====
// POST /chat/send - Send a message to another user (only if both are checked in at same place)
router.post('/send', auth_1.verifyAuth, async (req, res) => {
    try {
        const { receiverId, message, checkedInPlace } = req.body;
        const senderId = req.user?.uid;
        if (!receiverId || !message || !checkedInPlace) {
            return res.status(400).json({
                message: 'receiverId, message, and checkedInPlace are required',
                type: 'VALIDATION_ERROR',
            });
        }
        // Verify both users are checked in at the same place
        const senderCheckin = await firebase_1.db.collection('checkins').doc(senderId).get();
        const receiverCheckin = await firebase_1.db.collection('checkins').doc(receiverId).get();
        if (!senderCheckin.exists || !receiverCheckin.exists) {
            return res.status(403).json({
                message: 'One or both users are not checked in',
                type: 'NOT_CHECKED_IN',
            });
        }
        const senderData = senderCheckin.data();
        const receiverData = receiverCheckin.data();
        if (senderData?.placeName !== receiverData?.placeName) {
            return res.status(403).json({
                message: 'Users are not at the same location',
                type: 'DIFFERENT_LOCATION',
            });
        }
        if (!senderData?.isActive || !receiverData?.isActive) {
            return res.status(403).json({
                message: 'One or both users have checked out',
                type: 'CHECKED_OUT',
            });
        }
        // Get sender profile for name
        const senderProfile = await firebase_1.db.collection('profiles').doc(senderId).get();
        const senderName = senderProfile.data()?.name || 'Unknown User';
        // Create conversation ID (sort IDs to ensure consistency)
        const conversationId = [senderId, receiverId].sort().join('_');
        // Create message
        const messageDoc = {
            conversationId,
            senderId,
            senderName,
            receiverId,
            message,
            checkedInPlace,
            timestamp: admin.firestore.Timestamp.now(),
            isRead: false,
        };
        // Save message to chatMessages collection
        const messageRef = await firebase_1.db.collection('chatMessages').add(messageDoc);
        // Update or create conversation document
        await firebase_1.db
            .collection('conversations')
            .doc(conversationId)
            .set({
            participants: [senderId, receiverId],
            lastMessage: message,
            lastMessageTime: admin.firestore.Timestamp.now(),
            checkedInPlace,
            updatedAt: admin.firestore.Timestamp.now(),
        }, { merge: true });
        console.log(`✉️ Message sent from ${senderName} to ${receiverId} at ${checkedInPlace}`);
        res.status(201).json({
            message: 'Message sent successfully',
            messageId: messageRef.id,
            data: messageDoc,
        });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// POST /chat/messages - Get messages between two users
router.post('/messages', auth_1.verifyAuth, async (req, res) => {
    try {
        const { userId, limit = 50 } = req.body;
        const currentUserId = req.user?.uid;
        if (!userId) {
            return res.status(400).json({
                message: 'userId is required',
                type: 'VALIDATION_ERROR',
            });
        }
        // Create conversation ID (sort IDs to ensure consistency)
        const conversationId = [currentUserId, userId].sort().join('_');
        // Fetch messages
        const messagesSnapshot = await firebase_1.db
            .collection('chatMessages')
            .where('conversationId', '==', conversationId)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json({
            conversationId,
            messages: messages.reverse(), // Return in chronological order
            count: messages.length,
        });
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// POST /chat/conversations - Get conversations for current user at location
router.post('/conversations', auth_1.verifyAuth, async (req, res) => {
    try {
        const { checkedInPlace } = req.body;
        const currentUserId = req.user?.uid;
        if (!checkedInPlace) {
            return res.status(400).json({
                message: 'checkedInPlace is required',
                type: 'VALIDATION_ERROR',
            });
        }
        // Find all active check-ins at this place
        const checkinsSnapshot = await firebase_1.db
            .collection('checkins')
            .where('placeName', '==', checkedInPlace)
            .where('isActive', '==', true)
            .get();
        const conversations = [];
        for (const doc of checkinsSnapshot.docs) {
            if (doc.id === currentUserId)
                continue; // Skip self
            const otherUserId = doc.id;
            const conversationId = [currentUserId, otherUserId].sort().join('_');
            // Get last message
            const lastMessageSnapshot = await firebase_1.db
                .collection('chatMessages')
                .where('conversationId', '==', conversationId)
                .orderBy('timestamp', 'desc')
                .limit(1)
                .get();
            const lastMessage = lastMessageSnapshot.docs[0];
            const messageData = lastMessage?.data();
            // Get user profile
            const userProfile = await firebase_1.db.collection('profiles').doc(otherUserId).get();
            const profileData = userProfile.data();
            conversations.push({
                conversationId,
                userId: otherUserId,
                name: profileData?.name || 'Unknown User',
                profilePicture: profileData?.profilePicture,
                lastMessage: messageData?.message || 'No messages yet',
                lastMessageTime: messageData?.timestamp,
                isRead: messageData?.isRead || true, // Assume read if no message
            });
        }
        // Sort by last message time
        conversations.sort((a, b) => {
            const timeA = a.lastMessageTime?.toMillis?.() || 0;
            const timeB = b.lastMessageTime?.toMillis?.() || 0;
            return timeB - timeA;
        });
        console.log(`💬 Retrieved ${conversations.length} conversations for user at ${checkedInPlace}`);
        res.status(200).json({
            checkedInPlace,
            conversations,
            count: conversations.length,
        });
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// POST /chat/mark-read - Mark messages as read
router.post('/mark-read', auth_1.verifyAuth, async (req, res) => {
    try {
        const { conversationId } = req.body;
        const currentUserId = req.user?.uid;
        if (!conversationId) {
            return res.status(400).json({
                message: 'conversationId is required',
                type: 'VALIDATION_ERROR',
            });
        }
        // Update all unread messages from this conversation addressed to current user
        const messagesSnapshot = await firebase_1.db
            .collection('chatMessages')
            .where('conversationId', '==', conversationId)
            .where('receiverId', '==', currentUserId)
            .where('isRead', '==', false)
            .get();
        const batch = firebase_1.db.batch();
        messagesSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, { isRead: true });
        });
        await batch.commit();
        res.status(200).json({
            message: 'Messages marked as read',
            updatedCount: messagesSnapshot.docs.length,
        });
    }
    catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map