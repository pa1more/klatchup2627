# 🚀 Firebase & GCP Setup Checklist

## Prerequisites
- [ ] New Firebase project created
- [ ] iOS app registered in Firebase Console
- [ ] Android app registered in Firebase Console
- [ ] Firebase Authentication enabled
- [ ] Firestore enabled
- [ ] Realtime Database enabled
- [ ] Firebase Functions enabled (or Cloud Run)
- [ ] Billing enabled on GCP (required for most services)

---

## Part 1: Download Credentials (Do This First!)

### iOS Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click Settings (⚙️) → Project Settings
4. Scroll to "Your apps" section
5. Find your iOS app
6. Click "Download GoogleService-Info.plist"
7. **Save to**: `ios/klatchup/GoogleService-Info.plist`

### Android Credentials
1. In the same Firebase Console page
2. Find your Android app
3. Click "Download google-services.json"
4. **Save to**: `android/app/google-services.json`

### Backend Service Account (Optional - for local development)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Navigate to: IAM & Admin → Service Accounts
4. Find "Firebase Admin SDK" service account
5. Click Actions (⋮) → Manage Keys
6. Add Key → Create New Key → JSON
7. **Save to**: `firebase-backend/serviceAccountKey.json`
8. ⚠️ **NEVER commit this file to git!**

---

## Part 2: Run Automated Setup

Once you have the credentials downloaded:

```bash
# Run the automated setup script
./setup-firebase.sh
```

This script will:
- ✅ Update firebase.json with your project ID
- ✅ Set your Firebase project
- ✅ Prompt you to place credentials files
- ✅ Create backend .env file
- ✅ Update API configuration
- ✅ Optionally deploy to Firebase Functions

---

## Part 3: Manual Steps (if not using script)

### 1. Place Credentials Files
```bash
# iOS
cp ~/Downloads/GoogleService-Info.plist ios/klatchup/

# Android  
cp ~/Downloads/google-services.json android/app/

# Backend (optional)
cp ~/Downloads/your-project-xxxxx.json firebase-backend/serviceAccountKey.json
```

### 2. Add iOS Credentials to Xcode
```bash
# Open Xcode
open ios/klatchup.xcworkspace
```
Then in Xcode:
1. Right-click `klatchup` folder
2. "Add Files to klatchup..."
3. Select `GoogleService-Info.plist`
4. ✅ Check "Copy items if needed"
5. ✅ Check "Add to targets: klatchup"

### 3. Update Project Configuration

Edit `firebase.json`:
```json
{
  "projects": {
    "default": "YOUR-NEW-PROJECT-ID"
  }
}
```

Create `firebase-backend/.env`:
```env
FIREBASE_PROJECT_ID=YOUR-NEW-PROJECT-ID
GOOGLE_PLACES_API_KEY=your_api_key_here
NODE_ENV=production
REGION=us-central1
```

Update `src/services/apiConfig.ts`:
```typescript
export const API_CONFIG = {
  firebase: {
    baseURL: 'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api',
    // ...
  }
};
```

---

## Part 4: Deploy Backend

### Option A: Firebase Functions (Easier)

```bash
# Install dependencies
cd firebase-backend
npm install

# Build
npm run build

# Login and set project
firebase login
firebase use YOUR-PROJECT-ID

# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only database
```

### Option B: Cloud Run (More Scalable)

```bash
# Run the GCP deployment script
./deploy-gcp.sh
```

This will:
- ✅ Build Docker container
- ✅ Push to Google Container Registry
- ✅ Deploy to Cloud Run
- ✅ Configure auto-scaling

---

## Part 5: Test the Setup

### Test Backend

```bash
# If using Firebase Functions
curl https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api/health

# If using Cloud Run
curl https://klatchup-api-xxxxx-uc.a.run.app/health
```

Expected response:
```json
{"status":"OK","timestamp":"2024-XX-XX..."}
```

### Test Mobile App

```bash
# Clean and rebuild

# iOS
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios

# Android
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Test Authentication

1. Launch the app
2. Try to sign up/sign in with phone number
3. Check Firebase Console → Authentication to see new users

### Test Firestore

1. Create a profile in the app
2. Check Firebase Console → Firestore to see data
3. Verify security rules are working

### Test Realtime Database (Chat)

1. Send a message in the app
2. Check Firebase Console → Realtime Database
3. Verify messages appear under `chatrooms`

---

## Part 6: Verify Everything Works

### Mobile App Checklist
- [ ] iOS app builds successfully
- [ ] Android app builds successfully
- [ ] Firebase SDK initialized (check app logs)
- [ ] Authentication works (sign up/sign in)
- [ ] Profile creation works
- [ ] Check-ins work
- [ ] Chat/messaging works
- [ ] Location services work

### Backend Checklist
- [ ] Health endpoint returns 200 OK
- [ ] Authentication endpoint works
- [ ] Profile CRUD operations work
- [ ] Check-in endpoints work
- [ ] Location endpoints work
- [ ] Firebase Admin SDK connected
- [ ] Environment variables loaded
- [ ] Logs show no errors

### Security Checklist
- [ ] Firestore rules deployed
- [ ] Database rules deployed
- [ ] Users can only read/write their own data
- [ ] Unauthenticated requests are blocked
- [ ] API endpoints require authentication
- [ ] Service account key is NOT in git

---

## Troubleshooting

### "No matching client found for package name"
**Fix**: Make sure package name in google-services.json matches android/app/build.gradle

```gradle
// Should match in both files
applicationId "com.klatchup"
```

### "Could not find 'GoogleService-Info.plist'"
**Fix**: Make sure file is added to Xcode project, not just copied to folder

### "DefaultFirebaseApp is not initialized"
**Fix**: Check that credentials files are in correct locations:
- iOS: `ios/klatchup/GoogleService-Info.plist`
- Android: `android/app/google-services.json`

### "Functions deployment failed"
**Fix**: 
1. Check billing is enabled
2. Make sure you're on the right project: `firebase use YOUR-PROJECT-ID`
3. Check build errors: `cd firebase-backend && npm run build`

### "Permission denied" errors in Firestore
**Fix**: Deploy security rules:
```bash
firebase deploy --only firestore:rules
```

### iOS build fails with CocoaPods error
**Fix**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

---

## Quick Command Reference

```bash
# Firebase
firebase login
firebase use YOUR-PROJECT-ID
firebase deploy
firebase deploy --only functions
firebase deploy --only firestore:rules,database
firebase functions:log

# GCP
gcloud auth login
gcloud config set project YOUR-PROJECT-ID
gcloud run services list
gcloud run services logs read klatchup-api

# Mobile App
npm install
npx react-native run-ios
npx react-native run-android

# Backend
cd firebase-backend
npm install
npm run build
npm run deploy

# Clean builds
# iOS
cd ios && pod install && cd ..
rm -rf ios/build

# Android
cd android && ./gradlew clean && cd ..
```

---

## Support & Documentation

- 📖 [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) - Detailed setup instructions
- ☁️ [GCP_MIGRATION_GUIDE.md](./GCP_MIGRATION_GUIDE.md) - Cloud Run migration guide
- 🔥 [Firebase Console](https://console.firebase.google.com)
- ☁️ [Google Cloud Console](https://console.cloud.google.com)

---

## Need Your Project Details

To complete the setup, you'll need:

1. **Project ID**: `_________________`
2. **Region**: `us-central1` (recommended)
3. **Google Places API Key** (optional): `_________________`

Once you have these, run:
```bash
./setup-firebase.sh
```

---

**Status**: Ready to configure ✅  
**Last Updated**: February 2026
