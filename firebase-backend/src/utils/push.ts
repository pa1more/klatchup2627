import * as admin from 'firebase-admin';

export async function sendPushToToken(
  token: string | undefined,
  payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }
): Promise<void> {
  if (!token) return;

  try {
    await admin.messaging().send({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      android: {
        priority: 'high',
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
      },
    });
  } catch (error: any) {
    console.warn('Push send failed:', error?.message || error);
  }
}
