import { API_PROVIDER, BASE_URL } from './apiConfig';

console.log('🔧 [chatService] Loaded with BASE_URL:', BASE_URL);

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  checkedInPlace: string;
  timestamp: number;
  isRead: boolean;
}

// Helper function to safely parse JSON responses
function safeParse(text: string): any {
  console.log('🔍 [safeParse] Got response, length:', text?.length || 0);
  
  if (!text || text.trim().length === 0) {
    console.warn('⚠️ Empty response from server');
    return {};
  }
  
  const trimmed = text.trim();
  const firstChar = trimmed[0];
  const firstCode = trimmed.charCodeAt(0);
  
  console.log('🔍 First character:', firstChar, 'code:', firstCode);
  console.log('🔍 First 50 chars:', trimmed.substring(0, 50));
  
  // If it looks like HTML, error page
  if (firstChar === '<') {
    console.error('❌ HTML detected (error page):', trimmed.substring(0, 200));
    throw new Error('Server returned error page - backend may not be ready');
  }
  
  // Whitespace or protocol errors
  if (firstChar === '\n' || firstChar === ' ' || firstChar === undefined) {
    console.error('❌ Whitespace/empty response');
    return {};
  }
  
  // Try JSON parsing for object/array
  if (firstChar === '{' || firstChar === '[') {
    try {
      return JSON.parse(trimmed);
    } catch (e: any) {
      console.error('❌ JSON parse failed:', e.message);
      throw new Error(`JSON error: ${e.message}`);
    }
  }
  
  // Try parsing as JSON anyway (might be boolean, null, or string)
  try {
    return JSON.parse(trimmed);
  } catch (e: any) {
    console.error('❌ All parse attempts failed');
    console.error('❌ Response was:', trimmed.substring(0, 200));
    throw new Error(`Response is not valid JSON: starts with '${firstChar}'`);
  }
}

// Send a message to another user
export async function sendChatMessageAPI(
  token: string,
  data: {
    receiverId: string;
    message: string;
    checkedInPlace: string;
  }
) {
  try {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔵 [sendChatMessageAPI] Starting request...');
    console.log('🔵 URL:', `${BASE_URL}/chat/send`);
    console.log('🔵 Receiver:', data.receiverId);
    console.log('🔵 Place:', data.checkedInPlace);
    console.log('🔵 Token valid:', !!token);

    const response = await fetch(`${BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log('🔵 ✅ Request sent');
    console.log('🔵 Response status:', response.status, response.statusText);

    const text = await response.text();
    console.log('🔵 Response length:', text.length);
    if (text.length < 500) {
      console.log('🔵 Response text:', text);
    } else {
      console.log('🔵 Response (truncated):', text.substring(0, 500) + '...');
    }
    
    const responseData = safeParse(text);

    if (!response.ok) {
      const errorMessage = responseData?.message || responseData?.error || `Server returned ${response.status}`;
      console.error('❌ Server error:', errorMessage);
      console.error('❌ Full response:', JSON.stringify(responseData, null, 2));
      throw new Error(errorMessage);
    }
    
    console.log('✅ Message sent successfully');
    return responseData;
  } catch (error: any) {
    console.error('❌ [sendChatMessageAPI] Error:', error.message);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
}

// Get messages with a specific user
export async function getChatMessagesAPI(
  token: string,
  data: {
    userId: string;
    limit?: number;
  }
) {
  try {
    console.log('📥 [getChatMessagesAPI] Fetching messages...');
    console.log('📥 URL:', `${BASE_URL}/chat/messages`);
    console.log('📥 Data:', JSON.stringify(data, null, 2));

    const response = await fetch(`${BASE_URL}/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log('📥 Response status:', response.status, response.statusText);
    const text = await response.text();
    console.log('📥 Response text:', text.substring(0, 300));

    const responseData = safeParse(text);

    if (!response.ok) {
      const errorMessage = responseData?.message || responseData?.error || `Server returned ${response.status}`;

      if (errorMessage?.includes('FAILED_PRECONDITION') && errorMessage?.includes('requires an index')) {
        console.warn('⚠️ Messages query needs Firestore index; returning empty message list as fallback');
        return { conversationId: [data.userId, 'pending'].join('_'), messages: [], count: 0, indexRequired: true };
      }

      throw new Error(errorMessage);
    }
    
    console.log('✅ Messages fetched successfully');
    return responseData;
  } catch (error: any) {
    console.error('❌ [getChatMessagesAPI] Error:', error.message);
    throw error;
  }
}

// Get list of recent conversations at current location
export async function getChatConversationsAPI(
  token: string,
  data: {
    checkedInPlace: string;
  }
) {
  try {
    console.log('💬 [getChatConversationsAPI] Fetching conversations...');
    console.log('💬 URL:', `${BASE_URL}/chat/conversations`);
    console.log('💬 Data:', JSON.stringify(data, null, 2));

    const response = await fetch(`${BASE_URL}/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log('💬 Response status:', response.status, response.statusText);
    const text = await response.text();
    console.log('💬 Response text:', text.substring(0, 300));

    const responseData = safeParse(text);

    if (!response.ok) {
      const errorMessage = responseData?.message || responseData?.error || `Server returned ${response.status}`;

      if (errorMessage?.includes('FAILED_PRECONDITION') && errorMessage?.includes('requires an index')) {
        console.warn('⚠️ Conversations query needs Firestore index; returning empty list as fallback');
        return { checkedInPlace: data.checkedInPlace, conversations: [], count: 0, indexRequired: true };
      }

      throw new Error(errorMessage);
    }
    
    console.log('✅ Conversations fetched successfully');
    return responseData;
  } catch (error: any) {
    console.error('❌ [getChatConversationsAPI] Error:', error.message);
    throw error;
  }
}

// Mark messages as read
export async function markMessagesAsReadAPI(
  token: string,
  data: {
    conversationId: string;
  }
) {
  try {
    console.log('✔️ [markMessagesAsReadAPI] Marking as read...');
    console.log('✔️ URL:', `${BASE_URL}/chat/mark-read`);
    console.log('✔️ Data:', JSON.stringify(data, null, 2));

    const response = await fetch(`${BASE_URL}/chat/mark-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log('✔️ Response status:', response.status, response.statusText);
    const text = await response.text();
    console.log('✔️ Response text:', text.substring(0, 300));

    const responseData = safeParse(text);

    if (!response.ok) {
      const errorMessage = responseData?.message || responseData?.error || `Server returned ${response.status}`;
      throw new Error(errorMessage);
    }
    
    console.log('✅ Messages marked as read');
    return responseData;
  } catch (error: any) {
    console.error('❌ [markMessagesAsReadAPI] Error:', error.message);
    throw error;
  }
}
