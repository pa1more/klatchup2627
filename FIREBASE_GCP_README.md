# Firebase & GCP Setup - Quick Start

This directory contains everything you need to migrate your Klatchup app to a new Firebase project and optionally migrate to Google Cloud Platform (GCP) for enhanced backend capabilities.

## 📋 What's Been Prepared

### Documentation
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Start here! Step-by-step checklist
- **[FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)** - Detailed Firebase migration guide
- **[GCP_MIGRATION_GUIDE.md](./GCP_MIGRATION_GUIDE.md)** - Advanced GCP features guide

### Automated Scripts
- **[setup-firebase.sh](./setup-firebase.sh)** - Automated Firebase setup script
- **[deploy-gcp.sh](./deploy-gcp.sh)** - Deploy backend to Google Cloud Run

### Configuration Files
- **[firebase.json](./firebase.json)** - Updated with rules configuration
- **[firebase-backend/firestore.rules](./firebase-backend/firestore.rules)** - Firestore security rules
- **[firebase-backend/database.rules.json](./firebase-backend/database.rules.json)** - Realtime Database rules
- **[firebase-backend/firestore.indexes.json](./firebase-backend/firestore.indexes.json)** - Firestore indexes

## 🚀 Quick Start (3 Steps)

### Step 1: Download Your Firebase Credentials

From [Firebase Console](https://console.firebase.google.com):

1. **iOS**: Download `GoogleService-Info.plist` → save to `ios/klatchup/`
2. **Android**: Download `google-services.json` → save to `android/app/`

### Step 2: Run the Setup Script

```bash
./setup-firebase.sh
```

Follow the prompts. The script will:
- Update project configuration
- Create backend environment file
- Update API endpoints
- Optionally deploy to Firebase Functions

### Step 3: Rebuild and Test

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## 📱 What Gets Updated

### Mobile App
- iOS Firebase configuration
- Android Firebase configuration
- API endpoint URLs in `src/services/apiConfig.ts`

### Backend
- Firebase project ID in `firebase.json`
- Environment variables in `firebase-backend/.env`
- Security rules for Firestore and Realtime Database

### Optional: GCP Migration
- Dockerfile for containerization
- Cloud Run deployment configuration
- GCP services enablement

## 🔧 Manual Setup (Alternative)

If you prefer not to use the automated script:

1. **Place credentials**:
   ```bash
   cp ~/Downloads/GoogleService-Info.plist ios/klatchup/
   cp ~/Downloads/google-services.json android/app/
   ```

2. **Update firebase.json**:
   ```json
   {
     "projects": {
       "default": "YOUR-NEW-PROJECT-ID"
     }
   }
   ```

3. **Create firebase-backend/.env**:
   ```env
   FIREBASE_PROJECT_ID=YOUR-NEW-PROJECT-ID
   GOOGLE_PLACES_API_KEY=your_key_here
   NODE_ENV=production
   REGION=us-central1
   ```

4. **Update src/services/apiConfig.ts**:
   ```typescript
   firebase: {
     baseURL: 'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api',
   }
   ```

5. **Deploy**:
   ```bash
   firebase login
   firebase use YOUR-PROJECT-ID
   firebase deploy
   ```

## ☁️ GCP Deployment (Optional)

For better scalability and more control:

```bash
./deploy-gcp.sh
```

This deploys your backend to Cloud Run with:
- Auto-scaling
- Better cold start performance
- More deployment control
- Access to full GCP services

See [GCP_MIGRATION_GUIDE.md](./GCP_MIGRATION_GUIDE.md) for details.

## 🧪 Testing

### Backend Health Check
```bash
# Firebase Functions
curl https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api/health

# Cloud Run
curl https://klatchup-api-xxxxx-uc.a.run.app/health
```

Expected response:
```json
{"status":"OK","timestamp":"2024-XX-XX..."}
```

### Mobile App
1. Sign up/sign in with phone number
2. Create a profile
3. Send a chat message
4. Create a check-in

Verify data appears in Firebase Console.

## 📚 Architecture

### Current Setup (Firebase Functions)
```
Mobile App (iOS/Android)
    ↓
Firebase Authentication
    ↓
Firebase Functions (Express API)
    ↓
├─→ Firestore (profiles, check-ins, locations)
└─→ Realtime Database (chat messages)
```

### Optional GCP Setup (Cloud Run)
```
Mobile App (iOS/Android)
    ↓
Firebase Authentication
    ↓
Cloud Run (Express API)
    ↓
├─→ Firestore
├─→ Realtime Database
├─→ Cloud Storage
├─→ Cloud Tasks (background jobs)
└─→ Other GCP Services
```

## 🔒 Security

The setup includes:
- ✅ Firestore security rules (user data isolation)
- ✅ Realtime Database rules (authenticated access only)
- ✅ API authentication via Firebase tokens
- ✅ Service account for backend operations
- ✅ .gitignore for sensitive files

## 🐛 Troubleshooting

### iOS Build Issues
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
```

### Firebase Functions Not Working
```bash
# Check logs
firebase functions:log

# Redeploy
cd firebase-backend
npm run build
firebase deploy --only functions
```

### Authentication Issues
1. Check credentials files are in place
2. Verify package names match Firebase Console
3. Check Firebase Console → Authentication is enabled

## 📞 Support

- **Firebase**: [Firebase Console](https://console.firebase.google.com)
- **GCP**: [Google Cloud Console](https://console.cloud.google.com)
- **Docs**: See individual guide files in this directory

## ✅ Checklist

- [ ] Downloaded iOS credentials (GoogleService-Info.plist)
- [ ] Downloaded Android credentials (google-services.json)
- [ ] Ran setup script or updated configs manually
- [ ] Deployed backend (Firebase Functions or Cloud Run)
- [ ] Deployed security rules
- [ ] Rebuilt mobile app
- [ ] Tested authentication
- [ ] Tested app features
- [ ] Verified data in Firebase Console

## 🎯 Next Steps After Setup

1. **Development**: Test all features thoroughly
2. **Staging**: Create a separate Firebase project for staging
3. **CI/CD**: Set up automated deployments (GitHub Actions)
4. **Monitoring**: Enable Firebase Crashlytics and Performance Monitoring
5. **Analytics**: Enable Firebase Analytics
6. **Testing**: Set up automated testing

---

**Need Help?** Start with [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for a detailed walkthrough.

**Ready to Deploy?** Run `./setup-firebase.sh`

**Want GCP Features?** See [GCP_MIGRATION_GUIDE.md](./GCP_MIGRATION_GUIDE.md)
