import auth from '@react-native-firebase/auth';

const STORAGE_BUCKET = 'klatchup2-app.firebasestorage.app';

/**
 * Upload a base64-encoded image to Firebase Storage and return a public download URL.
 * Using base64 → data: URL → blob is the most reliable approach in React Native on Android
 * (reading local file:// URIs via fetch is unreliable on some Android versions).
 *
 * @param base64Data  Raw base64 string (no "data:image/..." prefix) from ImageCropPicker
 * @param storagePath  Destination path inside the bucket, e.g. "profiles/uid/photo1.jpg"
 */
export async function uploadImageToStorage(base64Data: string, storagePath: string): Promise<string> {
  const token = await auth().currentUser?.getIdToken(true);
  if (!token) throw new Error('Not authenticated');

  // data: URL approach — works natively in React Native fetch on Android & iOS
  const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();

  const encodedPath = encodeURIComponent(storagePath);
  const uploadUrl =
    `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o` +
    `?uploadType=media&name=${encodedPath}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'image/jpeg',
    },
    body: blob,
  });

  if (!uploadResponse.ok) {
    const errText = await uploadResponse.text();
    throw new Error(`Storage upload failed (${uploadResponse.status}): ${errText}`);
  }

  const data = await uploadResponse.json();
  const downloadToken = data.downloadTokens;
  if (!downloadToken) {
    // Fallback: construct URL without token (requires auth to read, but works for our rules)
    return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodedPath}?alt=media`;
  }

  return (
    `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/` +
    `${encodedPath}?alt=media&token=${downloadToken}`
  );
}
