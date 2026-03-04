# Quick Testing Commands

## 🚀 Quick Start (30 seconds)

### Step 1: Set up demo users
```bash
cd firebase-backend
npm install
npm run seed
```

### Step 2: Add Test Phone Numbers to Firebase
1. Open: https://console.firebase.google.com
2. Your Project → Authentication → Sign-in method → Phone
3. Add these test numbers (OTP: `123456`):
   - `+918001001001` through `+918001001010`

### Step 3: Test on Device/Emulator
- Phone 1: Login with `9029581874` (Your main account)
- Phone 2: Login with `8001001001` (Priya Singh - First demo user)
- OTP: `123456`

---

## 📱 Common Testing Tasks

### Create Demo Users
```bash
cd firebase-backend
npm run seed
```

### View Firestore Data
```bash
firebase firestore:get profiles --recursive
```

### Clear Demo Data
```bash
firebase firestore:delete profiles --recursive
firebase firestore:delete chatrooms --recursive
```

### Re-create Everything
```bash
cd firebase-backend
firebase firestore:delete profiles --recursive
firebase firestore:delete chatrooms --recursive
npm run seed
```

---

## 🔧 Android Emulator Commands

### Start Data Emulator
```bash
# Terminal 1
emulator -avd Pixel_6_API_30 -netdelay none -netspeed full &
```

### Start App Dev Server
```bash
# Terminal 2
cd /Users/pavan/Documents/klatchup/klatchup
npm start
```

### Build & Install on Emulator
```bash
# Terminal 3
npx react-native run-android
```

### Watch Logs
```bash
adb logcat | grep ReactNativeJS
```

---

## 👥 Test User Phone Numbers

```
+918001001001 - Priya Singh (Travel, Books)
+918001001002 - Raj Patel (Fitness, Sports)
+918001001003 - Anjali Sharma (Art, Music)
+918001001004 - Vikram Desai (Business, Tech)
+918001001005 - Neha Gupta (Wellness, Nature)
+918001001006 - Arjun Kumar (Movies, Games)
+918001001007 - Pooja Reddy (Food, Travel)
+918001001008 - Rohit Singh (Music, Tech)
+918001001009 - Divya Nair (Fitness, Business)
+918001001010 - Aman Verma (Business, Finance)
```

**Default OTP for all:** `123456`

---

## ✅ Test Scenarios Checklist

- [ ] **Login Flow**
  - [ ] Can enter phone number
  - [ ] Can request OTP
  - [ ] OTP code works
  - [ ] Redirects to profile creation if new user
  - [ ] Redirects to home if returning user

- [ ] **People Discovery**
  - [ ] See demo users in list
  - [ ] Can view user profile
  - [ ] Can send friend request

- [ ] **Friend Requests**
  - [ ] Can send request
  - [ ] Other user sees request in KlatchUp Requests
  - [ ] Can accept request
  - [ ] Can reject/ignore request
  - [ ] Status updates in real-time

- [ ] **Chat**
  - [ ] See friends in chat list after accepting
  - [ ] Can send message
  - [ ] Message appears on other device
  - [ ] Can see message history

- [ ] **Check-in**
  - [ ] Can check in to location
  - [ ] Location updates profile
  - [ ] Can see checked-in users from other accounts
  - [ ] Can see user count at location

- [ ] **Profile**
  - [ ] Can view own profile
  - [ ] Can edit profile
  - [ ] Changes sync to other users
  - [ ] Can see other users' profiles

---

## 🐛 Troubleshooting

### "OTP Failed" Error
```bash
# Make sure test numbers are added in Firebase Console
# Restart the app
# Clear app cache: adb shell pm clear com.klatchup.app
```

### Users Not Appearing in People List
```bash
# Check Firestore has profiles:
firebase firestore:get profiles

# Re-seed if needed:
cd firebase-backend
npm run seed
```

### Chat Not Syncing
```bash
# Check Firestore rules allow authenticated writes
# Verify both users are friends
# Wait 5 seconds and refresh
```

### App Won't Install
```bash
# Uninstall old version:
adb uninstall com.klatchup.app

# Then rebuild:
npx react-native run-android
```

---

## 📊 Testing with 2 Physical Devices (if available)

1. Connect Device 1 and Device 2 via USB
2. Build once:
   ```bash
   npx react-native run-android
   ```
3. When asked which device, select Device 1
4. Install on Device 2:
   ```bash
   adb -s <DEVICE_2_SERIAL> install android/app/build/outputs/apk/debug/app-debug.apk
   ```
5. Open app on Device 1 → login as `9029581874`
6. Open app on Device 2 → login as `8001001001`
7. Test friend requests, chat, check-in across both devices!

---

## 📝 Full Testing Guide

For comprehensive testing scenarios, see: `TESTING_GUIDE.md`
