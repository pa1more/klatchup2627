# 🎯 Developer Handover Guide - Klatchup App

This guide is designed to help the new developer quickly understand and run the Klatchup project.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- iOS: Xcode 15+, CocoaPods
- Android: Android Studio, JDK 11+
- Firebase CLI: `npm install -g firebase-tools`
- Git

### Initial Setup (15 minutes)

1. **Clone and install dependencies**
   ```bash
   cd klatchup
   npm install
   cd firebase-backend && npm install && cd ..
   ```

2. **Set up environment variables**
   ```bash
   # Firebase backend configuration
   cp firebase-backend/.env.example firebase-backend/.env
   # Edit with your Firebase project details
   nano firebase-backend/.env
   ```

3. **Set up Firebase project**
   - Create a new Firebase project at https://firebase.google.com/console
   - Add iOS and Android apps to your project
   - Download `GoogleService-Info.plist` for iOS
   - Download `google-services.json` for Android

4. **Configure iOS**
   ```bash
   cd ios
   pod install
   cd ..
   # Place GoogleService-Info.plist in ios/klatchup/
   ```

5. **Configure Android**
   ```bash
   # Place google-services.json in android/app/
   ```

6. **Update firebase.json**
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

## 📁 Project Structure

```
klatchup/
├── src/                          # React Native source code
│   ├── components/              # Reusable UI components
│   ├── screens/                 # App screens/pages
│   ├── services/                # API, Firebase services
│   ├── store/                   # Redux state management
│   └── utils/                   # Utility functions
├── firebase-backend/            # Firebase Cloud Functions (Node.js)
│   ├── src/
│   │   ├── api/                # Express API routes
│   │   ├── services/           # Business logic
│   │   └── seed-users.ts       # Demo data seeding
│   └── .env.example            # Environment template
├── ios/                         # iOS native code
│   └── klatchup/
│       └── GoogleService-Info.plist  # Firebase config
├── android/                     # Android native code
│   └── app/
│       └── google-services.json      # Firebase config
└── README.md                    # Project documentation
```

## 🔧 Environment Setup

### Firebase Configuration
The app uses Firebase for:
- Authentication (Phone + OTP)
- Realtime Database (Chat/Messaging)
- Firestore (User profiles, check-ins)
- Cloud Storage (Profile pictures)
- Cloud Functions (Backend API)

**Required Files** (must be obtained from Firebase Console):
- `ios/klatchup/GoogleService-Info.plist`
- `android/app/google-services.json`
- `firebase-backend/service-account.json` (for admin operations)

### Environment Variables
Create `firebase-backend/.env`:
```env
# Firebase Project
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_service_account_email

# APIs
GOOGLE_PLACES_API_KEY=your_api_key

# Configuration
NODE_ENV=production
REGION=us-central1
FIRESTORE_DATABASE_ID=default
```

## 🏃 Running the App

### Start Metro Bundler
```bash
npm start
```

### iOS Development
```bash
npx react-native run-ios
# Or open in Xcode
open ios/klatchup.xcworkspace
```

### Android Development
```bash
npx react-native run-android
# Or use Android Studio
```

### Firebase Backend (Local Testing)
```bash
cd firebase-backend
npm run build
npm run serve
```

## 📦 Key Dependencies

### Frontend
- **React Native** 0.77+ - Mobile framework
- **React Navigation** - App navigation
- **Redux** - State management
- **Firebase SDK** - Backend services
- **Reanimated** - Smooth animations

### Backend
- **Firebase Functions** - Serverless backend
- **Express.js** - API routing
- **Firestore Admin SDK** - Database access
- **Google Places API** - Location services

## 🔐 Security & Credentials

### ⚠️ CRITICAL: Never commit credentials!

The `.gitignore` is configured to ignore:
- `.env*` files (except `.env.example`)
- Firebase service account keys (`*firebase-adminsdk*.json`)
- Google Services JSON files
- Apple App Store Connect keys (`*.p8`)
- AWS credentials

If you accidentally commit sensitive data:
1. Immediately regenerate the credentials in their respective consoles
2. Use `git filter-repo` or `BFG Repo Cleaner` to remove from history
3. Force push (if safe)

### Setting Up Credentials Securely

1. **For local development**, use Firebase CLI authentication:
   ```bash
   firebase login
   ```

2. **For CI/CD**, use environment variables in your CI/CD platform's secrets

3. **Never share credentials** - regenerate for each team member

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Firebase Backend Tests
```bash
cd firebase-backend
npm test
```

### Seed Demo Data
```bash
cd firebase-backend
npm run seed-users
```

This creates 10 dummy user profiles for testing.

## 📱 App Features

### Authentication
- Phone number + OTP login
- Firebase Phone Authentication

### User Profiles
- Create/update user profiles
- Profile pictures
- Interests and preferences
- Location-based matching

### Check-ins
- Users can check in at locations
- See others nearby
- Real-time location updates

### Messaging (Realtime Database)
- Direct messaging between matched users
- Chat history

### Location Services
- Google Places API integration
- Location-based search
- Map view of nearby users

## 🚨 Common Issues & Solutions

### Issue: "DefaultFirebaseApp not initialized"
**Solution:** Ensure Firebase config files are in the correct location
```bash
# iOS
ls ios/klatchup/GoogleService-Info.plist

# Android
ls android/app/google-services.json
```

### Issue: Pod install fails
**Solution:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Issue: Android build fails
**Solution:**
```bash
cd android
./gradlew clean
cd ..
```

### Issue: Metro bundler hangs
**Solution:**
```bash
npm start -- --reset-cache
```

### Issue: Cannot connect to Firebase backend
**Solution:** Check that your project ID in `firebase.json` matches your Firebase project

## 📚 Important Files to Understand

1. **App.tsx** - Root component and Firebase initialization
2. **src/services/apiConfig.ts** - Backend API configuration
3. **firebase-backend/src/api/** - Backend API endpoints
4. **src/store/index.ts** - Redux store setup
5. **firebase.json** - Firebase project configuration

## 🔄 Deployment

### Deploy Backend
```bash
firebase deploy --only functions
```

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy to App Stores
See individual platform guides in `ios/` and `android/` directories

## 📞 Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Docs](https://reactnative.dev/docs)
- [React Navigation](https://reactnavigation.org/)
- [Google Places API](https://developers.google.com/maps/documentation/places)

## ✅ Verification Checklist

Before considering setup complete:
- [ ] npm install completes without errors
- [ ] Firebase config files are in place
- [ ] `npm start` runs without errors
- [ ] `npx react-native run-ios` or `run-android` works
- [ ] App opens in emulator/simulator
- [ ] Firebase authentication works
- [ ] Can create a user profile
- [ ] Can see demo users (after running seed script)

## 🎯 Next Steps After Setup

1. **Read the main README.md** for detailed feature documentation
2. **Explore the codebase structure** starting with `App.tsx`
3. **Run the seed demo data** to test the full app flow
4. **Review Firebase security rules** in `firebase-backend/firestore.rules`
5. **Familiarize with the API** endpoints in `firebase-backend/src/api/`

## 💡 Development Tips

- Use Redux DevTools for state debugging: `npm install redux-devtools-extension`
- Set `NODE_ENV=development` in `.env` for better error messages
- Use Firebase Emulator Suite for local testing:
  ```bash
  firebase emulators:start
  ```
- Keep `.env` files on your machine only (never in git)
- Test on both iOS and Android regularly

---

**Questions?** Check the repo issues or reach out to the previous developer!

**Last Updated:** 2026-07-13  
**Project:** Klatchup App  
**Status:** Ready for handover ✅
