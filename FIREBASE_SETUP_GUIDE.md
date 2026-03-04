# Firebase & GCP Migration Guide

## Overview
This guide will help you:
1. Replace Firebase credentials for iOS and Android
2. Configure Firebase backend with new project
3. Set up GCP (Google Cloud Platform) for backend APIs
4. Deploy and test the new configuration

---

## Part 1: Mobile App Configuration

### Step 1: iOS Firebase Setup

1. **Download GoogleService-Info.plist from Firebase Console**
   - Go to Firebase Console → Your New Project
   - Click Project Settings (gear icon)
   - Under "Your apps" section, find your iOS app
   - Click "Download GoogleService-Info.plist"

2. **Add to iOS Project**
   ```bash
   # Copy the file to:
   ios/klatchup/GoogleService-Info.plist
   ```

3. **Add to Xcode Project**
   - Open `ios/klatchup.xcworkspace` in Xcode
   - Right-click on `klatchup` folder in project navigator
   - Select "Add Files to klatchup..."
   - Select `GoogleService-Info.plist`
   - ✅ Check "Copy items if needed"
   - ✅ Check "Add to targets: klatchup"
   - Click "Add"

### Step 2: Android Firebase Setup

1. **Download google-services.json from Firebase Console**
   - Go to Firebase Console → Your New Project
   - Click Project Settings (gear icon)
   - Under "Your apps" section, find your Android app
   - Click "Download google-services.json"

2. **Replace existing file**
   ```bash
   # The file should be placed at:
   android/app/google-services.json
   
   # Back up old file first (optional)
   mv android/app/google-services.json android/app/google-services.json.backup
   
   # Copy new file
   cp ~/Downloads/google-services.json android/app/google-services.json
   ```

---

## Part 2: Backend Configuration

### Step 3: Firebase Backend Setup

1. **Update Firebase Project Reference**
   
   Update `firebase.json` with your new project ID:
   ```json
   {
     "projects": {
       "default": "your-new-project-id"
     }
   }
   ```

2. **Get Service Account Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Select your new Firebase project
   - Go to: IAM & Admin → Service Accounts
   - Find "Firebase Admin SDK" service account
   - Click Actions (⋮) → Manage Keys → Add Key → Create New Key
   - Choose JSON format and download

3. **Create Backend Environment File**
   
   Create `firebase-backend/.env`:
   ```bash
   # Firebase Project Configuration
   FIREBASE_PROJECT_ID=your-new-project-id
   
   # Google Places API Key (if using location services)
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   
   # Environment
   NODE_ENV=production
   REGION=us-central1
   ```

4. **Store Service Account Key**
   
   Option A: For local development
   ```bash
   # Store service account key
   cp ~/Downloads/your-project-xxxxx.json firebase-backend/serviceAccountKey.json
   
   # Add to .gitignore (already should be there)
   echo "serviceAccountKey.json" >> firebase-backend/.gitignore
   ```
   
   Option B: For deployment (Firebase automatically uses project credentials)
   - No need to store the key file
   - Firebase Functions will use the project's default credentials

### Step 4: Update Mobile App API Configuration

Update `src/services/apiConfig.ts` with your new Firebase Functions URL:

```typescript
export const API_CONFIG = {
  firebase: {
    baseURL: 'https://us-central1-YOUR-NEW-PROJECT-ID.cloudfunctions.net/api',
    name: 'Firebase',
    status: 'ACTIVE - Real-time enabled',
  },
  // ... rest of config
};
```

---

## Part 3: GCP Migration Setup

### Step 5: Enable Required GCP Services

Run these commands to enable necessary GCP services:

```bash
# Authenticate with GCP
gcloud auth login

# Set your project
gcloud config set project YOUR-NEW-PROJECT-ID

# Enable required services
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable firebase.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

### Step 6: Deploy Backend to Firebase Functions

```bash
# Navigate to backend directory
cd firebase-backend

# Install dependencies
npm install

# Build the project
npm run build

# Login to Firebase (if not already)
firebase login

# Set the project
firebase use YOUR-NEW-PROJECT-ID

# Deploy functions
npm run deploy
# OR
firebase deploy --only functions
```

### Step 7: Configure Firestore Security Rules

Create or update `firebase-backend/firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Profiles collection
    match /profiles/{profileId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == profileId;
    }
    
    // Check-ins collection
    match /checkins/{checkinId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Locations collection
    match /locations/{locationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Step 8: Configure Firebase Realtime Database Rules

Create or update `firebase-backend/database.rules.json`:

```json
{
  "rules": {
    "chatrooms": {
      "$roomId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "messages": {
          "$messageId": {
            ".write": "auth != null && !data.exists()",
            ".validate": "newData.hasChildren(['text', 'sender', 'timestamp'])"
          }
        }
      }
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only database
```

---

## Part 4: Testing & Verification

### Step 9: Test Mobile App

```bash
# Clean and rebuild

# iOS
cd ios
pod install
cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### Step 10: Verify Backend Functions

Test the health endpoint:
```bash
curl https://us-central1-YOUR-NEW-PROJECT-ID.cloudfunctions.net/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ"
}
```

---

## Checklist

### Mobile App
- [ ] iOS GoogleService-Info.plist added
- [ ] Android google-services.json replaced
- [ ] apiConfig.ts updated with new Firebase Functions URL
- [ ] App rebuilds successfully
- [ ] Firebase Auth works (sign in/sign up)
- [ ] Realtime Database messaging works

### Backend
- [ ] firebase.json updated with new project ID
- [ ] Service account key downloaded and stored securely
- [ ] .env file created in firebase-backend/
- [ ] Dependencies installed (npm install)
- [ ] Project builds successfully (npm run build)
- [ ] Functions deployed successfully
- [ ] Firestore rules deployed
- [ ] Database rules deployed
- [ ] Health endpoint returns 200 OK

### GCP Services
- [ ] Cloud Functions enabled
- [ ] Firestore enabled
- [ ] Firebase Authentication enabled
- [ ] Realtime Database enabled
- [ ] Cloud Build enabled
- [ ] Billing account connected (required for some services)

---

## Quick Commands Reference

```bash
# Firebase CLI
firebase login
firebase projects:list
firebase use YOUR-PROJECT-ID
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only database

# Build & Deploy Backend
cd firebase-backend
npm install
npm run build
npm run deploy

# Run Backend Locally (with emulators)
npm start

# Mobile App
npm install
npx react-native run-ios
npx react-native run-android

# Clean iOS build
cd ios && pod install && cd ..
rm -rf ios/build ios/Pods/build

# Clean Android build
cd android && ./gradlew clean && cd ..
```

---

## Troubleshooting

### Issue: "Firebase project not found"
**Solution**: Make sure you've set the correct project:
```bash
firebase use YOUR-NEW-PROJECT-ID
```

### Issue: "Service account key not found"
**Solution**: Either:
1. Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable
2. Or let Firebase Functions use default credentials (recommended for deployment)

### Issue: "API endpoint returns 404"
**Solution**: 
1. Check that functions are deployed: `firebase functions:list`
2. Verify the URL in apiConfig.ts matches your project ID
3. Check function logs: `firebase functions:log`

### Issue: iOS app won't build
**Solution**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

### Issue: Android build fails
**Solution**:
```bash
cd android
./gradlew clean
cd ..
rm -rf android/app/build
```

---

## Next Steps

1. Follow this guide step by step
2. Test each component as you go
3. Once everything works, update your CI/CD pipelines
4. Update documentation for your team
5. Consider setting up staging environment with a separate Firebase project

---

## Support Resources

- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase Docs](https://rnfirebase.io/)

---

**Created**: February 2026
**Project**: Klatchup
